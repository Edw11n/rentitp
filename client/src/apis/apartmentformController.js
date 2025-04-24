import Axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

class ApartmentFormController {
    constructor(user) {
        this.user = user;
    }

    async submitApartment(formData) {
        if (
            !formData.get('barrio') ||
            !formData.get('direccion') ||
            !formData.get('latitud') ||
            !formData.get('longitud') ||
            !formData.get('addInfo')
        ) {
            throw new Error('Por favor rellene los campos');
        }

        try {
            console.log('token', this.user.token);
            await Axios.post(`${API_URL}/apartments/addApartment`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${this.user.token}`,
                },
            });
            return 'Apartamento añadido exitosamente';
        } catch (error) {
            console.error('Error añadiendo apartamento:', error);
            throw new Error('Hubo un problema al añadir el apartamento');
        }
    }
}

export default ApartmentFormController;
