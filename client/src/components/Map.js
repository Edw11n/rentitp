import React from "react";
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";
import './styles/Map.css';

// Componente Map
function Map() {
    // Configuración del ícono del marcador
    const DefaultIcon = L.icon({
        iconUrl: markerIconPng,
        shadowUrl: markerShadowPng,
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    return (
        <div className="map-container">
            <MapContainer 
                center={[1.157, -76.651]} 
                zoom={20}  
                className="leaflet-container" // Añadido para aplicar estilos CSS
                
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
                />
            </MapContainer>
        </div>
    );
}

export default Map;
