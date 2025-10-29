import React, { useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import ApartmentFormController from '../apis/apartmentformController';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEye, faSave, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import MapModal from './MapModal';

function ApartmentForm() {
const { user } = useContext(UserContext);

const [barrio, setBarrio] = useState('');
const [direccion, setDireccion] = useState('');
const [latitud, setLatitud] = useState('');
const [longitud, setLongitud] = useState('');
const [addInfo, setAddInfo] = useState('');
const [charCount, setCharCount] = useState(0);
const [message, setMessage] = useState('');
const [imageFiles, setImageFiles] = useState([]);
const [showMap, setShowMap] = useState(false);

const handleFileChange = (e) => {
    if (e.target.files) setImageFiles(prev => [...prev, ...Array.from(e.target.files)]);
};

const removeImage = (index) => setImageFiles(prev => prev.filter((_, i) => i !== index));

const handleViewImage = (file) => {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const handleSubmit = async () => {
    if (imageFiles.length === 0) return setMessage('Por favor, cargue al menos una imagen');

    const formData = new FormData();
    formData.append('barrio', barrio);
    formData.append('direccion', direccion);
    formData.append('latitud', latitud);
    formData.append('longitud', longitud);
    formData.append('addInfo', addInfo);
    formData.append('user_email', user.email);
    imageFiles.forEach(file => formData.append('images', file));

    try {
    const controller = new ApartmentFormController(user);
    const successMessage = await controller.submitApartment(formData);
    setMessage(successMessage);
    setBarrio('');
    setDireccion('');
    setLatitud('');
    setLongitud('');
    setAddInfo('');
    setCharCount(0);
    setImageFiles([]);
    } catch (error) {
    setMessage(error.message);
    }
};

const handleAddInfoChange = (e) => {
    const value = e.target.value;
    setAddInfo(value);
    setCharCount(value.length);
};

const handleSelectLocation = ({ lat, lng }) => {
    setLatitud(lat);
    setLongitud(lng);
};

return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg space-y-6">
    <h2 className="text-2xl font-bold text-gray-800">Añadir Apartamento</h2>
    {message && <p className="text-red-600 font-medium">{message}</p>}

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
        type="text"
        placeholder="Barrio"
        value={barrio}
        onChange={(e) => setBarrio(e.target.value)}
        className="border rounded p-2 w-full focus:ring-2 focus:ring-blue-400"
        />
        <input
        type="text"
        placeholder="Dirección"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
        className="border rounded p-2 w-full focus:ring-2 focus:ring-blue-400"
        />
    </div>

    <div>
        <label className="block font-semibold mb-2">Coordenadas</label>
        <div className="flex gap-2 items-center">
        <input
            type="text"
            placeholder="Latitud"
            value={latitud}
            readOnly
            className="border rounded p-2 w-1/3 focus:ring-2 focus:ring-blue-400"
        />
        <input
            type="text"
            placeholder="Longitud"
            value={longitud}
            readOnly
            className="border rounded p-2 w-1/3 focus:ring-2 focus:ring-blue-400"
        />
        <button
            type="button"
            onClick={() => setShowMap(true)}
            className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
            <FontAwesomeIcon icon={faMapMarkerAlt} /> Seleccionar en mapa
        </button>
        </div>
    </div>

    <div>
        <label className="block font-semibold mb-2">Información adicional</label>
        <textarea
        placeholder="Información adicional de la publicación"
        value={addInfo}
        onChange={handleAddInfoChange}
        maxLength="500"
        rows="5"
        className="border rounded p-2 w-full focus:ring-2 focus:ring-blue-400"
        />
        <span className="text-sm text-gray-500">{charCount}/500</span>
    </div>

    <div>
        <label className="block font-semibold mb-2">Imágenes del Apartamento</label>
        <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="border rounded p-2 w-full"
        />
        {imageFiles.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
            {imageFiles.map((file, idx) => (
            <div key={idx} className="bg-gray-100 p-2 rounded flex items-center gap-2">
                <span className="text-sm font-medium">Imagen {idx + 1}</span>
                <button onClick={() => handleViewImage(file)} className="text-blue-600 hover:text-blue-800">
                <FontAwesomeIcon icon={faEye} />
                </button>
                <button onClick={() => removeImage(idx)} className="text-red-600 hover:text-red-800">
                <FontAwesomeIcon icon={faTrashAlt} />
                </button>
            </div>
            ))}
        </div>
        )}
    </div>

    <button
        onClick={handleSubmit}
        className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition flex items-center justify-center gap-2"
    >
        <FontAwesomeIcon icon={faSave} /> Publicar Apartamento
    </button>

    {showMap && (
        <MapModal
        onClose={() => setShowMap(false)}
        onSelectLocation={handleSelectLocation}
        initialCoords={latitud && longitud ? { lat: parseFloat(latitud), lng: parseFloat(longitud) } : null}
        />
    )}
    </div>
);
}

export default ApartmentForm;
