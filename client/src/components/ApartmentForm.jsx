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
    <div className="space-y-6">
    {message && (
        <div className={`p-4 rounded-lg ${message.includes('éxito') || message.includes('Apartamento') ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
        <p className="font-medium">{message}</p>
        </div>
    )}

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Barrio</label>
        <input
            type="text"
            placeholder="Ej: El Poblado"
            value={barrio}
            onChange={(e) => setBarrio(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />
        </div>
        <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
        <input
            type="text"
            placeholder="Ej: Calle 10 #15-20"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />
        </div>
    </div>

    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-100">
        <label className="block text-sm font-medium text-gray-700 mb-3">Coordenadas</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
            type="text"
            placeholder="Latitud"
            value={latitud}
            readOnly
            className="border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />
        <input
            type="text"
            placeholder="Longitud"
            value={longitud}
            readOnly
            className="border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />
        <button
            type="button"
            onClick={() => setShowMap(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
        >
            <FontAwesomeIcon icon={faMapMarkerAlt} /> Seleccionar en mapa
        </button>
        </div>
    </div>

    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Información adicional</label>
        <textarea
        placeholder="Describe las características principales del apartamento (ej: número de habitaciones, baños, amenidades, etc.)"
        value={addInfo}
        onChange={handleAddInfoChange}
        maxLength="500"
        rows="5"
        className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
        />
        <div className="flex justify-between items-center mt-1">
        <span className="text-sm text-gray-500">{charCount}/500 caracteres</span>
        </div>
    </div>

    <div className="bg-gray-50 p-5 rounded-xl border-2 border-dashed border-gray-300">
        <label className="block text-sm font-medium text-gray-700 mb-3">Imágenes del Apartamento</label>
        <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer transition"
        />
        {imageFiles.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {imageFiles.map((file, idx) => (
            <div key={idx} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
                <p className="text-sm font-medium text-gray-700 mb-2">Imagen {idx + 1}</p>
                <div className="flex gap-2">
                <button 
                    onClick={() => handleViewImage(file)} 
                    className="flex-1 py-2 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                >
                    <FontAwesomeIcon icon={faEye} />
                </button>
                <button 
                    onClick={() => removeImage(idx)} 
                    className="flex-1 py-2 px-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
                >
                    <FontAwesomeIcon icon={faTrashAlt} />
                </button>
                </div>
            </div>
            ))}
        </div>
        )}
        {imageFiles.length === 0 && (
        <p className="text-sm text-gray-500 mt-2 text-center">No hay imágenes seleccionadas</p>
        )}
    </div>

    <button
        onClick={handleSubmit}
        className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg"
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
