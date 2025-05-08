import axios from 'axios';

// Asegúrate de que tu API_URL esté bien configurado en .env
const API_URL = process.env.REACT_APP_API_URL;

export const fetchUserStats = async (token) => {
    try {
        console.log('token', token); // Verifica que el token esté definido y sea correcto
        const response = await axios.get(`${API_URL}/stats/get-user-top-apartment`, {
            headers: {
                'Authorization': `Bearer ${token}`  // Enviar el token en la cabecera
            }
        });
        
        // Retornar los datos de la respuesta
        return response.data;
    } catch (error) {
        // Manejar errores de la solicitud
        console.error('Error al obtener stats:', error);
        throw error;
    }
};
export const fetchTopLandlord = async () => {
    try {
        const response = await axios.get(`${API_URL}/stats/get-top-landlord`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el top arrendador:', error);
        throw error;
    }
};
