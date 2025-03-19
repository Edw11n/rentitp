import Axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

export const loginUser = async ({ email, password, setUser }) => {
    if (!email || !password) {
        return { success: false, message: 'Por favor rellene todos los campos' };
    }
    try {
        const response = await Axios.post(`${API_URL}/lessors/login`, {
            email,
            password
        });
        // Desestructuramos la respuesta correctamente
        const { user, token } = response.data;
        // Extraemos las propiedades del objeto 'user'
        const { id, nombre, apellido, email: userEmail, telefono, rol } = user;
        setUser({
            id,
            nombre,
            apellido,
            email: userEmail,
            telefono,
            rolId: rol
        });
        console.log('Usuario:', response.data);
        return { success: true };
    } catch (error) {
        console.error('Error en el login:', error.response ? error.response.data : error.message);
        return { success: false, message: 'Correo o contraseña incorrectos' };
    }
};
