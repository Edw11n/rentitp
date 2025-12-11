import React, { useState, useEffect } from "react";
import { MapContainer, Marker, TileLayer, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import mapController from '../apis/mapController';
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Estilos personalizados para el popup
import './Map.css';

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
    // Llamadas iniciales de invalidateSize
    const initialTimers = [
      setTimeout(() => map.invalidateSize(), 0),
      setTimeout(() => map.invalidateSize(), 50),
      setTimeout(() => map.invalidateSize(), 100),
      setTimeout(() => map.invalidateSize(), 200),
    ];

    return () => initialTimers.forEach(timer => clearTimeout(timer));
}, [map]);

// Usar ResizeObserver para detectar cambios de tamaño del contenedor
useEffect(() => {
    const container = map.getContainer();
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
}, [map]);

// También escuchar eventos de ventana
useEffect(() => {
    const handleResize = () => {
      map.invalidateSize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    className="w-full h-full z-0"
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
        <Popup className="!z-50 custom-popup">
            <div className="w-80 p-0">
              {/* Header */}
              <div style={{background: 'linear-gradient(135deg, #6A6BEF 0%, #7B7CF0 100%)'}} className="text-white p-4 rounded-t-lg">
                <h3 className="font-bold text-lg mb-1">📍 {apt.barrio_apartamento}</h3>
                <p className="text-sm opacity-90">{apt.direccion_apartamento}</p>
              </div>
              
              {/* Contenido */}
              <div className="p-4 bg-white">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold text-gray-800">Información adicional:</span>
                  </p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                    {apt.info_adicional_apartamento}
                  </p>
                </div>

                {selectedApartment?.id_apartamento === apt.id_apartamento && distance && (
                  <div className="mb-4 bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                    <p className="text-sm font-bold text-blue-900 mb-2">📍 Distancia desde el ITP:</p>
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🚗</span>
                        <div>
                          <p className="text-gray-600">Distancia</p>
                          <p className="font-bold text-blue-700">{distance.km} km</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">⏱️</span>
                        <div>
                          <p className="text-gray-600">Tiempo</p>
                          <p className="font-bold text-blue-700">{distance.min} min</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Botón */}
                <button 
                  onClick={() => handleApartmentClick(apt)}
                  style={{
                    backgroundColor: selectedApartment?.id_apartamento === apt.id_apartamento ? '#E53E3E' : '#6A6BEF',
                  }}
                  className={`w-full px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-white hover:opacity-90`}
                >
                  {selectedApartment?.id_apartamento === apt.id_apartamento ? '❌ Ocultar ruta' : '🗺️ Ver ruta desde ITP'}
                </button>
              </div>
            </div>
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
