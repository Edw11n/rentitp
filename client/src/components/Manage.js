import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useManageController from "../apis/manageController";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEye, faFilePdf, faFileExcel, faEdit, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import MapModal from './MapModal';
import Toast from './Toast';

const API_URL = process.env.REACT_APP_API_URL;

function Manage() {
const navigate = useNavigate();
const {
    loading,
    apartmentList,
    fetchApartments,
    editApartmentId,
    editFormData,
    setEditFormData,
    handleEditClick,
    handleInputChange,
    handleDelete,
    handleUpdate,
    handleCancelEdit,
    toast,
    closeToast,
} = useManageController(navigate);

const [newImageFiles, setNewImageFiles] = useState([]);
const [showMap, setShowMap] = useState(false);

const handleNewImageChange = (e) => {
    if (e.target.files) {
    setNewImageFiles(prev => [...prev, ...Array.from(e.target.files)]);
    }
};

const handleViewImageExisting = (img) => {
    const newTab = window.open();
    if (newTab) {
    newTab.document.write(`<img src="${img}" style="max-width: 80%; max-height: 80vh;" />`);
    newTab.document.title = "Vista previa de la imagen";
    }
};

const handleRemoveExistingImage = (index) => {
    if (editFormData.images) {
    const updatedImages = editFormData.images.filter((_, i) => i !== index);
    setEditFormData({ ...editFormData, images: updatedImages });
    }
};

const handleViewNewImage = (file) => {
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const handleRemoveNewImage = (index) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
};

const handleSelectLocation = ({ lat, lng }) => {
    // Actualizar el formulario de edición con las nuevas coordenadas
    const updatedFormData = {
        ...editFormData,
        latitud_apt: lat.toString(),
        longitud_apt: lng.toString()
    };
    setEditFormData(updatedFormData);
};

const downloadDocument = (id, type) => {
    window.open(`${API_URL}/documents/apartments/${id}/document/${type}`, "_blank");
};

useEffect(() => { fetchApartments(); }, []);

return (
    <div>
    <button
        onClick={fetchApartments}
        className="mb-6 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
    >
        Actualizar
    </button>

    {loading ? (
        <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    ) : apartmentList.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="mt-4 text-lg font-medium text-gray-900">No hay apartamentos disponibles para editar</p>
            <p className="mt-2 text-sm text-gray-500">Comienza añadiendo tu primer apartamento</p>
        </div>
    ) : (
        <div className="space-y-6">
        {apartmentList.map((apt) => (
            <div key={apt.id_apt} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
            {editApartmentId === apt.id_apt ? (
                <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <FontAwesomeIcon icon={faEdit} className="mr-2 text-indigo-600" />
                    Editando Apartamento
                </h3>
                <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Barrio</label>
                        <input 
                        name="barrio" 
                        value={editFormData.barrio} 
                        onChange={handleInputChange} 
                        placeholder="Barrio" 
                        className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                        <input 
                        name="direccion_apt" 
                        value={editFormData.direccion_apt} 
                        onChange={handleInputChange} 
                        placeholder="Dirección" 
                        className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" 
                        />
                    </div>
                    </div>

                    {/* Sección de coordenadas con mapa */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-100">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Coordenadas</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input 
                        name="latitud_apt" 
                        value={editFormData.latitud_apt} 
                        onChange={handleInputChange} 
                        placeholder="Latitud" 
                        readOnly
                        className="border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" 
                        />
                        <input 
                        name="longitud_apt" 
                        value={editFormData.longitud_apt} 
                        onChange={handleInputChange} 
                        placeholder="Longitud" 
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Información adicional</label>
                    <textarea
                        name="info_add_apt"
                        value={editFormData.info_add_apt}
                        onChange={handleInputChange}
                        placeholder="Información adicional"
                        className="border border-gray-300 rounded-lg p-3 w-full h-24 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                    />
                    </div>

                    {/* Imágenes existentes */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="font-semibold mb-3 text-gray-800 flex items-center">
                        <FontAwesomeIcon icon={faEye} className="mr-2 text-indigo-600" />
                        Imágenes existentes:
                    </p>
                    {editFormData.images?.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {editFormData.images.map((img, idx) => (
                            <div key={idx} className="relative group bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-indigo-300 transition">
                            <p className="text-sm text-gray-600 mb-2">Imagen {idx + 1}</p>
                            <div className="flex gap-2">
                                <button 
                                onClick={() => handleViewImageExisting(img)} 
                                className="flex-1 py-1.5 px-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
                                >
                                <FontAwesomeIcon icon={faEye} />
                                </button>
                                <button 
                                onClick={() => handleRemoveExistingImage(idx)} 
                                className="flex-1 py-1.5 px-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                                >
                                <FontAwesomeIcon icon={faTrashAlt} />
                                </button>
                            </div>
                            </div>
                        ))}
                        </div>
                    ) : <p className="text-gray-500 text-sm">No hay imágenes cargadas.</p>}
                    </div>

                    {/* Nuevas imágenes */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="font-semibold mb-3 text-gray-800">Añadir nuevas imágenes:</p>
                    <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        onChange={handleNewImageChange} 
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                    />
                    {newImageFiles.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                        {newImageFiles.map((file, idx) => (
                            <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-600 mb-2">Nueva {idx + 1}</p>
                            <div className="flex gap-2">
                                <button 
                                onClick={() => handleViewNewImage(file)} 
                                className="flex-1 py-1.5 px-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
                                >
                                <FontAwesomeIcon icon={faEye} />
                                </button>
                                <button 
                                onClick={() => handleRemoveNewImage(idx)} 
                                className="flex-1 py-1.5 px-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                                >
                                <FontAwesomeIcon icon={faTrashAlt} />
                                </button>
                            </div>
                            </div>
                        ))}
                        </div>
                    )}
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button 
                        onClick={() => { handleUpdate(apt.id_apt, newImageFiles); setNewImageFiles([]); }} 
                        className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                    >
                        Guardar Cambios
                    </button>
                    <button 
                        onClick={handleCancelEdit} 
                        className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                    >
                        Cancelar
                    </button>
                    </div>
                </div>
                </div>
            ) : (
                <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{apt.barrio}</h3>
                    <p className="text-gray-600 text-sm">{apt.direccion_apt}</p>
                    </div>
                    <div className="flex gap-2">
                    <button 
                        onClick={() => downloadDocument(apt.id_apt, "pdf")} 
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
                        title="Descargar PDF"
                    >
                        <FontAwesomeIcon icon={faFilePdf} />
                    </button>
                    <button 
                        onClick={() => downloadDocument(apt.id_apt, "excel")} 
                        className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 shadow-sm hover:shadow-md"
                        title="Descargar Excel"
                    >
                        <FontAwesomeIcon icon={faFileExcel} />
                    </button>
                    </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 mb-4">
                    <div className="flex">
                    <span className="text-sm font-medium text-gray-500 w-32">Coordenadas:</span>
                    <span className="text-sm text-gray-900">{apt.latitud_apt}, {apt.longitud_apt}</span>
                    </div>
                    <div className="flex">
                    <span className="text-sm font-medium text-gray-500 w-32">Información:</span>
                    <span className="text-sm text-gray-900">{apt.info_add_apt || 'Sin información adicional'}</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button 
                    onClick={() => handleEditClick(apt)} 
                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                    >
                    <FontAwesomeIcon icon={faEdit} className="mr-2" /> Editar
                    </button>
                    <button 
                    onClick={() => handleDelete(apt.id_apt)} 
                    className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                    >
                    <FontAwesomeIcon icon={faTrashAlt} className="mr-2" /> Eliminar
                    </button>
                </div>
                </div>
            )}
            </div>
        ))}
        </div>
    )}
    
    {/* Toast de notificación */}
    {toast && (
        <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={closeToast}
        duration={2000}
        />
    )}
    
    {/* Modal de mapa */}
    {showMap && (
        <MapModal
        onClose={() => setShowMap(false)}
        onSelectLocation={handleSelectLocation}
        initialCoords={
            editFormData.latitud_apt && editFormData.longitud_apt 
            ? { lat: parseFloat(editFormData.latitud_apt), lng: parseFloat(editFormData.longitud_apt) } 
            : null
        }
        />
    )}
    </div>
);
}

export default Manage;
