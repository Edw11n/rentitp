import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "../styles/MapModal.css";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationSelector({ onSelect }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onSelect({ lat, lng });
    },
  });
  return null;
}

export default function MapModal({ onClose, onSelectLocation, initialCoords }) {
  const [selected, setSelected] = useState(initialCoords || null);

  const handleSelect = (coords) => {
    setSelected(coords);
    onSelectLocation(coords);
  };

  return (
    <div className="map-modal-overlay">
      <div className="map-modal-content">
        <button className="map-close-button" onClick={onClose}>
          ✖
        </button>
        <h3 className="map-title">Selecciona la ubicación del apartamento</h3>

        <MapContainer
          center={selected || [1.157037, -76.651443]} // Mocoa por defecto
          zoom={14}
          style={{ height: "400px", width: "100%", borderRadius: "8px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <LocationSelector onSelect={handleSelect} />
          {selected && <Marker position={[selected.lat, selected.lng]} icon={markerIcon} />}
        </MapContainer>

        {selected && (
          <div className="map-coords">
            <p><b>Latitud:</b> {selected.lat.toFixed(6)}</p>
            <p><b>Longitud:</b> {selected.lng.toFixed(6)}</p>
          </div>
        )}

        <button className="map-accept-button" onClick={onClose}>
          Aceptar
        </button>
      </div>
    </div>
  );
}
