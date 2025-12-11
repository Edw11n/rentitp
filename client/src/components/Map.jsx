import React, { useState, useEffect } from "react";
import { MapContainer, Marker, TileLayer, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import mapController from '../apis/mapController';
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Actualiza la vista del mapa cuando cambian las coordenadas
function UpdateMapCenter({ center }) {
const map = useMap();
useEffect(() => {
map.setView(center, 17);
}, [center, map]);
return null;
}

// Componente para invalidar el tamaño del mapa cuando cambia el contenedor
function InvalidateSize() {
const map = useMap();
useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
}, [map]);
return null;
}

function Map() {
const [apartments, setApartments] = useState([]);
const [center, setCenter] = useState([1.157037, -76.651443]);
const [routeCoordinates, setRouteCoordinates] = useState([]);
const [distance, setDistance] = useState(null);
const [selectedApartment, setSelectedApartment] = useState(null);

const ITP_COORDINATES = [1.157037, -76.651443];

useEffect(() => {
const handleStorageChange = () => {
    const storedCenter = localStorage.getItem("mapCenter");
    if (storedCenter) {
    setCenter(JSON.parse(storedCenter));
    localStorage.removeItem("mapCenter");
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

// Función para calcular la ruta usando OSRM (OpenStreetMap Routing Machine)
const calculateRoute = async (apartmentLat, apartmentLng) => {
    try {
    const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${ITP_COORDINATES[1]},${ITP_COORDINATES[0]};${apartmentLng},${apartmentLat}?overview=full&geometries=geojson`
    );
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        const distanceKm = (route.distance / 1000).toFixed(2);
        const durationMin = Math.round(route.duration / 60);
        
        setRouteCoordinates(coordinates);
        setDistance({ km: distanceKm, min: durationMin });
        return true;
    }
    } catch (error) {
    console.error('Error calculando la ruta:', error);
    setRouteCoordinates([]);
    setDistance(null);
    }
    return false;
};

// Manejar clic en apartamento
const handleApartmentClick = async (apt) => {
    if (selectedApartment?.id_apartamento === apt.id_apartamento) {
    // Si ya está seleccionado, deseleccionar
    setSelectedApartment(null);
    setRouteCoordinates([]);
    setDistance(null);
    } else {
    // Seleccionar nuevo apartamento y calcular ruta
    setSelectedApartment(apt);
    await calculateRoute(apt.latitud_apartamento, apt.longitud_apartamento);
    }
};

return (
<div className="relative w-full h-full">
    <MapContainer
    center={center}
    zoom={17}
    className="w-full h-full z-0" // z-0 para que modales queden arriba
    maxZoom={18}
    >
    <UpdateMapCenter center={center} />
    <InvalidateSize />
    <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />

    <Marker position={[1.157037, -76.651443]} icon={InstituteIcon}>
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
        <Popup className="!z-50">
            <b>Dirección: {apt.direccion_apartamento}</b>
            <p><strong>Barrio:</strong> {apt.barrio_apartamento}</p>
            <p><b>Información adicional:</b><br />{apt.info_adicional_apartamento}</p>
            {selectedApartment?.id_apartamento === apt.id_apartamento && distance && (
            <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                <p className="text-sm font-semibold text-blue-800">📍 Distancia desde el ITP:</p>
                <p className="text-sm text-blue-700">🚗 {distance.km} km</p>
                <p className="text-sm text-blue-700">⏱️ {distance.min} minutos aprox.</p>
            </div>
            )}
            <button 
            onClick={() => handleApartmentClick(apt)}
            className="mt-2 px-2 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
            >
            {selectedApartment?.id_apartamento === apt.id_apartamento ? 'Ocultar ruta' : 'Ver ruta desde ITP'}
            </button>
        </Popup>
        </Marker>
    ))}

    {/* Mostrar la ruta cuando hay un apartamento seleccionado */}
    {routeCoordinates.length > 0 && (
        <Polyline
        positions={routeCoordinates}
        color="#3b82f6"
        weight={5}
        opacity={0.7}
        />
    )}
    </MapContainer>
</div>
);
}

export default Map;
