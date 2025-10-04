import Axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const googleLogin = async ({ token, login }) => {
    try {
        const response = await Axios.post(`${API_URL}/auth/google`, { token });

        const { user, token: accessToken } = response.data;
        const { user_id, user_name, user_lastname, user_email, user_phonenumber, rol_id } = user;

        login({ 
            id: user_id, 
            nombre: user_name, 
            apellido: user_lastname, 
            email: user_email, 
            telefono: user_phonenumber, 
            rol: rol_id, 
            token: accessToken });

        return { success: true };
    } catch (error) {
        console.error("Error en Google Login:", error.response ? error.response.data : error.message);
        return { success: false, message: "Error al autenticar con Google" };
    }
};