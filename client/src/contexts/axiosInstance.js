// axiosInstance.js
import Axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const axiosInstance = Axios.create({
baseURL: API_URL,
});

// Request interceptor: agrega el token de acceso si existe en el localStorage
axiosInstance.interceptors.request.use(
(config) => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
    const user = JSON.parse(storedUser);
    if (user.token) {
        config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    }
    return config;
},
(error) => Promise.reject(error)
);

// Response interceptor: intenta renovar el access token si se obtiene un 401
axiosInstance.interceptors.response.use(
(response) => response,
async (error) => {
    const originalRequest = error.config;
    // Evita bucles infinitos: intenta renovar solo una vez (_retry)
    if (
    error.response &&
    error.response.status === 401 &&
    !originalRequest._retry
    ) {
    originalRequest._retry = true;
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.refreshToken) {
        try {
            const response = await Axios.post(
            `${API_URL}/auth/refresh-token`,
            { refreshToken: user.refreshToken }
            );
            const newAccessToken = response.data.accessToken;
            // Actualiza el token en el localStorage
            const updatedUser = { ...user, token: newAccessToken };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            // Actualiza el header del request original
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            // Reintenta el request original con el nuevo token
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            console.error('Error renovando token', refreshError);
            // Si la renovación falla, opcionalmente puedes realizar un logout aquí
            return Promise.reject(refreshError);
        }
        }
    }
    }
    return Promise.reject(error);
}
);

export default axiosInstance;
