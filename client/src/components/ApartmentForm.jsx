import React, { useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import ApartmentFormController from '../apis/apartmentformController';
import { FaTrash, FaEye, FaSave, FaMapMarkerAlt, FaHome, FaMapPin, FaInfoCircle, FaImages, FaPlus } from 'react-icons/fa';
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

const handleSelectLocation = async ({ lat, lng }) => {
    setLatitud(lat);
    setLongitud(lng);
    
    // Geocodificación inversa para obtener la dirección automáticamente
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
            {
                headers: {
                    'Accept-Language': 'es'
                }
            }
        );
        const data = await response.json();
        
        if (data && data.address) {
            // Extraer el barrio (neighbourhood, suburb, o locality)
            const neighbourhood = data.address.neighbourhood || 
                                data.address.suburb || 
                                data.address.village ||
                                data.address.town ||
                                data.address.city_district || 
                                '';
            
            // Construir la dirección completa con más detalles
            const addressParts = [];
            
            // Tipo de vía (avenue, street, lane, etc.)
            if (data.address.road_type) {
                addressParts.push(data.address.road_type);
            }
            
            // Calle y número
            if (data.address.road) {
                if (data.address.house_number) {
                    addressParts.push(`${data.address.road} #${data.address.house_number}`);
                } else {
                    addressParts.push(data.address.road);
                }
            } else if (data.address.pedestrian) {
                // Algunas áreas peatonales
                addressParts.push(data.address.pedestrian);
            } else if (data.address.highway) {
                // Autopistas o carreteras
                addressParts.push(data.address.highway);
            }
            
            // Información adicional de la calle
            if (data.address.street) {
                addressParts.push(data.address.street);
            }
            
            // Nombre del edificio o lugar
            if (data.address.building) {
                addressParts.push(`Edificio ${data.address.building}`);
            }
            
            // Barrio/Vecindario
            if (data.address.neighbourhood) {
                addressParts.push(data.address.neighbourhood);
            } else if (data.address.suburb) {
                addressParts.push(data.address.suburb);
            } else if (data.address.quarter) {
                addressParts.push(data.address.quarter);
            }
            
            // Municipio o localidad
            if (data.address.municipality) {
                addressParts.push(data.address.municipality);
            }
            
            // Ciudad
            if (data.address.city) {
                addressParts.push(data.address.city);
            } else if (data.address.town) {
                addressParts.push(data.address.town);
            } else if (data.address.village) {
                addressParts.push(data.address.village);
            } else if (data.address.hamlet) {
                addressParts.push(data.address.hamlet);
            }
            
            // Condado o distrito
            if (data.address.county) {
                addressParts.push(data.address.county);
            }
            
            // Departamento/Estado/Región
            if (data.address.state) {
                addressParts.push(data.address.state);
            } else if (data.address.region) {
                addressParts.push(data.address.region);
            }
            
            // País
            if (data.address.country) {
                addressParts.push(data.address.country);
            }
            
            // Código postal si está disponible
            if (data.address.postcode) {
                addressParts.push(`CP ${data.address.postcode}`);
            }
            
            const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : data.display_name;
            
            // Actualizar los campos
            if (neighbourhood) setBarrio(neighbourhood);
            if (fullAddress) setDireccion(fullAddress);
        }
    } catch (error) {
        console.error('Error al obtener la dirección:', error);
        // No mostramos error al usuario, simplemente no se completa automáticamente
    }
};

return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl space-y-8 border border-blue-100">
    <div className="flex items-center gap-3 pb-4 border-b-2 border-blue-200">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
        <FaHome className="text-white text-2xl" />
        </div>
        <div>
        <h2 className="text-3xl font-bold text-gray-800">Añadir Apartamento</h2>
        <p className="text-sm text-gray-600">Complete la información para publicar su propiedad</p>

        </div>
    </div>
    {message && (
        <div className={`p-4 rounded-xl border-l-4 ${
        message.includes('éxito') || message.includes('exitosamente') 
            ? 'bg-green-50 border-green-500 text-green-700' 
            : 'bg-red-50 border-red-500 text-red-700'
        }`}>
        <p className="font-medium">{message}</p>
        </div>
    )}

    <div className="bg-white p-6 rounded-xl shadow-md space-y-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
        <FaMapPin className="text-blue-600 text-xl" />
        <h3 className="text-lg font-semibold text-gray-800">Ubicación</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Barrio</label>
            <input

            type="text"
            placeholder="Ej: Chapinero"
            value={barrio}
            onChange={(e) => setBarrio(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
            <input
            type="text"
            placeholder="Ej: Calle 72 # 10-34"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
        </div>
        </div>

        <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Coordenadas</label>
        <div className="flex gap-3 items-end">
        <div className="flex-1">
            <label className="block text-xs text-gray-600 mb-1">Latitud</label>
            <input
            type="text"
            placeholder="0.000000"
            value={latitud}
            readOnly
            className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 text-gray-700"
            />
        </div>
        <div className="flex-1">
            <label className="block text-xs text-gray-600 mb-1">Longitud</label>
            <input

            type="text"
            placeholder="0.000000"
            value={longitud}
            readOnly
            className="border border-gray-300 rounded-lg p-3 w-full bg-gray-50 text-gray-700"
            />
        </div>
        <button
            type="button"
            onClick={() => setShowMap(true)}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition shadow-md font-medium"

        >
            <FaMapMarkerAlt /> Seleccionar en mapa
        </button>
        </div>
        </div>
    </div>

    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
        <FaInfoCircle className="text-blue-600 text-xl" />
        <h3 className="text-lg font-semibold text-gray-800">Información Adicional</h3>
        </div>
        <textarea
        placeholder="Describa características adicionales del apartamento: número de habitaciones, baños, servicios incluidos, normas, etc."
        value={addInfo}
        onChange={handleAddInfoChange}
        maxLength="500"
        rows="6"
        className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
        />
        <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-500">Añada detalles relevantes para los arrendatarios</span>
        <span className={`text-sm font-medium ${
            charCount > 450 ? 'text-red-600' : 'text-gray-600'
        }`}>{charCount}/500</span>
        </div>
    </div>

    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
        <FaImages className="text-blue-600 text-xl" />
        <h3 className="text-lg font-semibold text-gray-800">Imágenes del Apartamento</h3>
        </div>
        <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 bg-blue-50 hover:bg-blue-100 transition cursor-pointer relative">
        <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"

        />
        <div className="text-center">
            <FaPlus className="text-blue-600 text-3xl mx-auto mb-2" />
            <p className="text-gray-700 font-medium">Haga clic o arrastre imágenes aquí</p>
            <p className="text-sm text-gray-500 mt-1">Formatos: JPG, PNG, WEBP</p>
        </div>
        </div>
        {imageFiles.length > 0 && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {imageFiles.map((file, idx) => (
            <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Imagen {idx + 1}</span>
                <div className="flex gap-2">
                    <button 
                    onClick={() => handleViewImage(file)} 
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
                    title="Ver imagen"
                    >
                    <FaEye className="text-sm" />
                    </button>
                    <button 
                    onClick={() => removeImage(idx)} 
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-sm"
                    title="Eliminar imagen"
                    >
                    <FaTrash className="text-sm" />
                    </button>
                </div>
                </div>
                <p className="text-xs text-gray-500 truncate">{file.name}</p>

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
        className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-lg rounded-xl hover:from-green-700 hover:to-green-800 transition shadow-xl hover:shadow-2xl transform hover:scale-[1.02] flex items-center justify-center gap-3"

    >
        <FaSave className="text-xl" /> Publicar Apartamento
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
