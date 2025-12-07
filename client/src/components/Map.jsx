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

// Función para calcular distancia usando la fórmula de Haversine
function calculateDistance(lat1, lon1, lat2, lon2) {
const R = 6371; // Radio de la Tierra en km
const dLat = (lat2 - lat1) * Math.PI / 180;
const dLon = (lon2 - lon1) * Math.PI / 180;
const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
const distance = R * c;
return distance;
}

// Función para obtener la ruta real siguiendo las calles
async function getRoute(startLat, startLon, endLat, endLon) {
try {
    // Usando OSRM (Open Source Routing Machine) - Servicio gratuito
    const url = `https://router.project-osrm.org/route/v1/walking/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
    const route = data.routes[0];
    const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]); // Invertir [lon, lat] a [lat, lon]
    const distance = route.distance; // en metros
    const duration = route.duration; // en segundos
    
    return {
        coordinates,
        distance,
        duration
    };
    }
    return null;
} catch (error) {
    console.error('Error obteniendo la ruta:', error);
    return null;
}
}

function Map() {
const [apartments, setApartments] = useState([]);
const [center, setCenter] = useState([1.157037, -76.651443]);
const [selectedRoute, setSelectedRoute] = useState(null);
const [routeInfo, setRouteInfo] = useState(null);
const [loadingRoute, setLoadingRoute] = useState(false);

const itpCoords = [1.157037, -76.651443];

useEffect(() => {
const handleStorageChange = () => {
    const storedCenter = localStorage.getItem("mapCenter");
    if (storedCenter) {
    setCenter(JSON.parse(storedCenter));
    localStorage.removeItem("mapCenter");
    }
    
    // Escuchar evento para mostrar ruta
    const storedRoute = localStorage.getItem("showRoute");
    if (storedRoute) {
    const routeData = JSON.parse(storedRoute);
    showRoute(routeData.lat, routeData.lng);
    localStorage.removeItem("showRoute");
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

const showRoute = async (lat, lng) => {
setLoadingRoute(true);

// Obtener la ruta real siguiendo las calles
const routeData = await getRoute(lat, lng, itpCoords[0], itpCoords[1]);

if (routeData) {
    // Usar datos de la ruta real
    const distanceInMeters = routeData.distance.toFixed(0);
    const distanceInKm = (routeData.distance / 1000).toFixed(2);
    const walkingTime = Math.round(routeData.duration / 60); // Convertir segundos a minutos
    const bikeTime = Math.round(walkingTime / 3); // Aproximadamente 3 veces más rápido en bici
    
    setSelectedRoute(routeData.coordinates);
    setRouteInfo({
    distance: routeData.distance > 1000 ? `${distanceInKm} km` : `${distanceInMeters} m`,
    walkingTime: `${walkingTime} min`,
    bikeTime: `${bikeTime} min`,
    realRoute: true
    });
} else {
    // Fallback a línea recta si falla el servicio de routing
    const distance = calculateDistance(itpCoords[0], itpCoords[1], lat, lng);
    const distanceInMeters = (distance * 1000).toFixed(0);
    const distanceInKm = distance.toFixed(2);
    const walkingTime = Math.round((distance / 5) * 60);
    const bikeTime = Math.round((distance / 15) * 60);
    
    setSelectedRoute([[itpCoords[0], itpCoords[1]], [lat, lng]]);
    setRouteInfo({
    distance: distanceInMeters > 1000 ? `${distanceInKm} km` : `${distanceInMeters} m`,
    walkingTime: `${walkingTime} min`,
    bikeTime: `${bikeTime} min`,
    realRoute: false
    });
}

setCenter([lat, lng]);
setLoadingRoute(false);
};

const clearRoute = () => {
setSelectedRoute(null);
setRouteInfo(null);
};

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
<div className="relative w-full h-full">
    {/* Panel de información de ruta */}
    {routeInfo && (
    <div className="absolute top-4 left-4 z-[1000] bg-white rounded-xl shadow-2xl p-5 min-w-[280px] border border-gray-200">
        <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Ruta a UniPutumayo
        </h3>
        <button 
            onClick={clearRoute}
            className="text-gray-400 hover:text-gray-600 transition"
        >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        </div>
        
        {loadingRoute ? (
        <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
        ) : (
        <>
            <div className="space-y-3">
            <div className="flex items-center justify-between py-2 px-3 bg-indigo-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Distancia</span>
                <span className="text-lg font-bold text-indigo-600">{routeInfo.distance}</span>
            </div>
            
            <div className="space-y-2">
                <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm text-gray-700">Caminando</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{routeInfo.walkingTime}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-sm text-gray-700">En bicicleta</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{routeInfo.bikeTime}</span>
                </div>
            </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {routeInfo.realRoute ? 'Ruta siguiendo calles' : 'Distancia en línea recta'}
            </p>
            </div>
        </>
        )}
    </div>
    )}

    <MapContainer
    center={center}
    zoom={17}
    className="w-full h-full z-0"
    maxZoom={18}
    >
    <UpdateMapCenter center={center} />
    <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />

    {/* Línea de ruta */}
    {selectedRoute && (
        <Polyline
        positions={selectedRoute}
        color="#4F46E5"
        weight={5}
        opacity={0.8}
        />
    )}

    <Marker position={itpCoords} icon={InstituteIcon}>
        <Popup>
        <b>UniPutumayo</b>
        <p>"Un sueño de todos"</p>
        </Popup>
    </Marker>

    {apartments.map((apt) => (
        <Marker
        key={apt.id_apartamento}
        position={[apt.latitud_apartamento, apt.longitud_apartamento]}
        icon={DefaultIcon}
        eventHandlers={{
            click: () => {
            showRoute(apt.latitud_apartamento, apt.longitud_apartamento);
            },
        }}
        >
        <Popup className="!z-50">
            <div className="min-w-[200px]">
            <b>Dirección: {apt.direccion_apartamento}</b>
            <p><strong>Barrio:</strong> {apt.barrio_apartamento}</p>
            <p><b>Información adicional:</b><br />{apt.info_adicional_apartamento}</p>
            <button 
                onClick={() => showRoute(apt.latitud_apartamento, apt.longitud_apartamento)}
                className="mt-2 w-full px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Ver Ruta a UniPutumayo
            </button>
            </div>
        </Popup>
        </Marker>
    ))}
    </MapContainer>
</div>
);
}

export default Map;
