import React, { useState, useEffect } from "react";
import Axios from "axios";
import './styles/ApartmentList.css';

function ApartmentList() {
    const [loading, setLoading] = useState(true);
    const [apartmentList, setApartmentList] = useState([]);
    const [selectedApartment, setSelectedApartment] = useState(null); // Estado para el apartamento seleccionado

    useEffect(() => {
        Axios.get('http://localhost:3001/apartments')
            .then((response) => {
                setApartmentList(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error obteniendo apartamentos:', error);
                setLoading(false);
            });
    }, []);

    const toggleApartmentDetails = (id) => {
        setSelectedApartment(selectedApartment === id ? null : id);
    };

    return (
        <div className="apartment-list-container">
            {loading ? (
                <p className="loading-text">Cargando apartamentos...</p> // Mostrar un mensaje mientras se cargan los datos
            ) : apartmentList.length > 0 ? (
                apartmentList.map((apartment) => (
                    <div
                        key={apartment.id_apartamento || apartment.Lessor_email}
                        className={`apartment-item-map ${selectedApartment === apartment.id_apartamento ? 'selected' : ''}`}
                    >
                        <div className="apartment-info">
                            <h3
                                className="apartment-title"
                                onClick={() => toggleApartmentDetails(apartment.id_apartamento)} // Click solo en el título
                            >
                                {apartment.barrio_apartamento}
                            </h3>
                            <p
                                className="apartment-address"
                                onClick={() => toggleApartmentDetails(apartment.id_apartamento)} // Click solo en la dirección
                            >
                                {apartment.direccion_apartamento}
                            </p>
                        </div>

                        {/* Mostrar información adicional si el apartamento está seleccionado */}
                        {selectedApartment === apartment.id_apartamento && (
                            <div className="apartment-details">
                                <p className="details-header">Detalles del apartamento:</p>
                                <p>Información adicional: {apartment.info_adicional_apartamento}</p>
                                <p><i>Ver imagenes</i></p>
                                <p className="lessor-info-header"><b>Información del arrendador</b></p>
                                <p>Arrendador: {apartment.Lessor_name} {apartment.Lessor_lastname}</p>
                                <p>Email: {apartment.Lessor_email}</p>
                                <p>Teléfono: {apartment.Lessor_phonenumber}</p>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p className="empty-list-message">No hay apartamentos disponibles</p> // Mostrar si la lista está vacía
            )}
        </div>
    );
}

export default ApartmentList;
