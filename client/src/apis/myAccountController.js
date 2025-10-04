import Axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;


export const updateUserData = async (token, formData) => {
    try {
        if (!token) {
        console.error("Usuario no autenticado o token no disponible");
        return null;
        }
        const response = await Axios.put(`${API_URL}/users/update`, formData, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error actualizando datos: ", error);
        return null;
    }
}
export const fetchUserData = async (token) => {
    try {
        if (!token) {
            console.error("Usuario no autenticado o token no disponible");
            return null;
        }
        const response = await Axios.get(`${API_URL}/users/getUser`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error obteniendo datos del usuario: ", error);
        return null;
    }
}