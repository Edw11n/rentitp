import React, { useState, useEffect } from "react";
import { MapContainer, Marker, TileLayer, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/map.css';
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import L from 'leaflet';
import mapController from '../apis/mapController';

// Función para actualizar la vista del mapa
function UpdateMapCenter({ center }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 17); // Centra el mapa en la nueva ubicación
    }, [center, map]);
    return null;
}

function Map() {
    const [apartments, setApartments] = useState([]);
    const [center, setCenter] = useState([1.157037, -76.651443]); // Ubicación inicial

    useEffect(() => {
        const handleStorageChange = () => {
            const storedCenter = localStorage.getItem("mapCenter");
            if (storedCenter) {
                setCenter(JSON.parse(storedCenter));
                localStorage.removeItem("mapCenter"); // Eliminamos el dato después de usarlo
            }
        };
    
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await mapController();
                setApartments(data);
            } catch (error) {
                console.error('Error obteniendo los apartamentos', error);
            }
        };
        fetchData();
    }, []);

    const DefaultIcon = L.icon({
        iconUrl: '/apartmentLogo.png',
        shadowUrl: markerShadow,
        iconSize: [25, 30],
        iconAnchor: [12, 30],
    });

    const InstituteIcon = L.icon({
        iconUrl: '/instituteLogo.png',
        iconSize: [25, 30],
        iconAnchor: [12, 30],
        popupAnchor: [0, -45],
    });

    return (
        <div className="map-container">
            <MapContainer 
                center={center} 
                zoom={17}  
                className="leaflet-container" 
                maxZoom={18}
            >
                <UpdateMapCenter center={center} /> {/* Componente para actualizar la vista */}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
                />

                <Marker 
                    position={[1.157037, -76.651443]} 
                    icon={InstituteIcon}
                >
                    <Popup>
                        <b>Instituto Tecnológico del Putumayo</b>
                        <p>"Un sueño de todos"</p>
                    </Popup>
                </Marker>

                {apartments.map((apt) => (
                    <Marker
                        key={apt.id_apartamento}
                        position={[apt.latitud_apartamento, apt.longitud_apartamento]}
                        icon={DefaultIcon}
                    >
                        <Popup>
                            <b>Dirección: {apt.direccion_apartamento}</b>
                            <p><strong>Barrio: </strong>{apt.barrio_apartamento}</p>
                            <p><b>Información adicional: </b><br />{apt.info_adicional_apartamento}</p>
                            <button>Ver más</button>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}

export default Map;
