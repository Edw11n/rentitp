import Axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

class ApartmentListController {
    constructor() {
        this.apartmentList = [];
        this.loading = true;
    }

    async fetchApartments() {
        try {
            const response = await Axios.get(`${API_URL}/apartments/getapts`);

            if (!Array.isArray(response.data)) {
                throw new Error(`La API no devolvió un array. Respuesta: ${JSON.stringify(response.data)}`);
            }

            console.log("Datos de la API:", response.data); // Para depuración

            this.apartmentList = response.data.map(apt => ({
                ...apt,
                images: typeof apt.images === 'string' 
                    ? apt.images.split(',') 
                    : (Array.isArray(apt.images) ? apt.images : [])
            }));

            this.loading = false;
        } catch (error) {
            console.error('Error obteniendo apartamentos:', error);
            this.loading = false;
        }
    }
}

export default ApartmentListController;
