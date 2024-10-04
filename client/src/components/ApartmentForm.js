import React, { useState, useContext } from 'react';
import Axios from 'axios';
import { UserContext } from '../UserContext';
import './styles/ApartmentForm.css';

function ApartmentForm() {
    const { user } = useContext(UserContext);
    const [barrio, setBarrio] = useState('');
    const [direccion, setDireccion] = useState('');
    const [latitud, setLatitud] = useState('');
    const [longitud, setLongitud] = useState('');
    const [addInfo, setAddInfo] = useState('');
    const [charCount, setCharCount] = useState(0); // Estado para contar caracteres

    const handleSubmit = async () => {
        if (!barrio || !direccion || !latitud || !longitud || !addInfo) {
            alert('Por favor rellene los campos');
            return;
        }

        try {
            await Axios.post('http://localhost:3001/addApartment', {
                barrio,
                direccion,
                latitud,
                longitud,
                addInfo,
                Lessor_email: user.email // Enlazar al arrendador logeado
            });
            alert('Apartamento añadido exitosamente');

            // Limpiar formulario después de enviar
            setBarrio('');
            setDireccion('');
            setLatitud('');
            setLongitud('');
            setAddInfo('');
            setCharCount(0); // Reiniciar el contador de caracteres
        } catch (error) {
            console.error('Error añadiendo apartamento:', error);
        }
    };

    const handleAddInfoChange = (e) => {
        const value = e.target.value;
        setAddInfo(value);
        setCharCount(value.length); // Actualizar el número de caracteres
    };

    return (
        <div className='apartment-form-container'>
            <h2>Añadir Apartamento</h2>
            <div className="form-group">
                <label htmlFor="barrio">Barrio</label>
                <input
                    type="text"
                    id="barrio"
                    placeholder="Barrio"
                    value={barrio}
                    onChange={(e) => setBarrio(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="direccion">Dirección</label>
                <input
                    type="text"
                    id="direccion"
                    placeholder="Dirección"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Coordenadas</label>
                <div className="input-inline">
                    <div className='input-inline'>
                        <input
                            type="text"
                            id="latitud"
                            placeholder="Latitud"
                            value={latitud}
                            onChange={(e) => setLatitud(e.target.value)}
                        />
                    </div>
                    <div className='input-inline'>
                        <input
                            type="text"
                            id="longitud"
                            placeholder="Longitud"
                            value={longitud}
                            onChange={(e) => setLongitud(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="addInfo">
                    Información adicional ({charCount}/500 caracteres Max.)
                </label>
                <textarea
                    id="addInfo"
                    placeholder="Información adicional de la publicación"
                    value={addInfo}
                    onChange={handleAddInfoChange}
                    maxLength="500"
                    rows="5" // Definir la altura del textarea
                    className="textarea-field" // Asignar clase CSS para ajustar el estilo
                />
            </div>
            <button className="submit-btn" onClick={handleSubmit}>
                Añadir Apartamento
            </button>
        </div>
    );
}

export default ApartmentForm;
