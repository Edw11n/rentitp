// loginController.js
import Axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

export const loginUser = async ({ email, password, login }) => {
if (!email || !password) {
    return { success: false, message: 'Por favor rellene todos los campos' };
}
try {
    const response = await Axios.post(`${API_URL}/users/login`, {
    email,
    password
    });
    // Desestructuramos la respuesta correctamente
    const { user, token: accessToken, refreshToken } = response.data;
    // Extraemos las propiedades del objeto 'user'
    const { id, nombre, apellido, email: userEmail, telefono, rol } = user;
    const userData = {
    id,
    nombre,
    apellido,
    email: userEmail,
    telefono,
    rol: rol,
    token: accessToken,
    refreshToken
    };
    // Guarda el usuario en el contexto y en el localStorage para persistencia
    login(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return { success: true };
} catch (error) {
    console.error('Error en el login:', error.response ? error.response.data : error.message);
    return { success: false, message: 'Correo o contraseña incorrectos' };
}
};
