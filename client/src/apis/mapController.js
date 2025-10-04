import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

// Función para obtener los apartamentos
const fetchApartments = async () => {
    try {
        const response = await axios.get(`${API_URL}/apartments/getMarkersInfo`);
        const data = response.data;

        if (Array.isArray(data)) {
            return data; // Asegura que sea un array antes de retornarlo
        } else {
            console.error("La API no devolvió un array:", data);
            return []; // Retorna un array vacío si la API no responde como se espera
        }
    } catch (error) {
        console.error("Error obteniendo los apartamentos:", error);
        return []; // Retorna un array vacío en caso de error
    }
};

export default fetchApartments;
