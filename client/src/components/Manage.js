import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useManageController from "../apis/manageController";
import { FaTrash, FaEye, FaFilePdf, FaFileExcel, FaEdit, FaHome, FaSync, FaSave, FaTimes, FaPlus, FaMapMarkerAlt, FaInfoCircle } from 'react-icons/fa';
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
    <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
    <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-2xl shadow-xl mb-6 border border-blue-100">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <FaHome className="text-white text-2xl" />
            </div>
            <div>
                <h2 className="text-3xl font-bold text-gray-800">Mis Apartamentos</h2>
                <p className="text-sm text-gray-600">Gestione sus propiedades publicadas</p>
            </div>
            </div>
            <button
            onClick={fetchApartments}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition shadow-lg font-medium"
            >
            <FaSync className="text-lg" /> Actualizar
            </button>
        </div>
        </div>

    {loading ? (
        <div className="flex items-center justify-center py-20">
        <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 font-medium">Cargando apartamentos...</p>
        </div>
        </div>
    ) : apartmentList.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-lg text-center border border-gray-200">
        <FaHome className="text-gray-400 text-6xl mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-700 mb-2">No hay apartamentos disponibles</h3>
        <p className="text-gray-500">Aún no has publicado ningún apartamento para editar.</p>
        </div>
    ) : (
        <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
        {apartmentList.map((apt) => (
            <div key={apt.id_apt} className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300">
            {editApartmentId === apt.id_apt ? (
                <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 to-white">
                <div className="flex items-center gap-2 mb-4">
                    <FaEdit className="text-blue-600 text-xl" />
                    <h3 className="text-xl font-bold text-gray-800">Editando Apartamento</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Barrio</label>
                    <input name="barrio" value={editFormData.barrio} onChange={handleInputChange} placeholder="Barrio" className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                    <input name="direccion_apt" value={editFormData.direccion_apt} onChange={handleInputChange} placeholder="Dirección" className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Latitud</label>
                    <input name="latitud_apt" value={editFormData.latitud_apt} onChange={handleInputChange} placeholder="Latitud" className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Longitud</label>
                    <input name="longitud_apt" value={editFormData.longitud_apt} onChange={handleInputChange} placeholder="Longitud" className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                    </div>
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Información Adicional</label>
                <textarea
                    name="info_add_apt"
                    value={editFormData.info_add_apt}
                    onChange={handleInputChange}
                    placeholder="Información adicional"
                    className="border border-gray-300 rounded-lg p-3 w-full h-28 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                />
                </div>

                {/* Imágenes existentes */}
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                    <FaEye className="text-blue-600" />
                    <p className="font-semibold text-gray-800">Imágenes existentes</p>
                    </div>
                    {editFormData.images?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {editFormData.images.map((img, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-2 bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                            <span className="font-medium text-gray-700">Imagen {idx + 1}</span>
                            <div className="flex gap-2">
                            <button onClick={() => handleViewImageExisting(img)} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm">
                                <FaEye />
                            </button>
                            <button onClick={() => handleRemoveExistingImage(idx)} className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-sm">
                                <FaTrash />
                            </button>
                            </div>
                        </div>
                        ))}
                    </div>
                    ) : <p className="text-gray-500 text-sm">No hay imágenes cargadas.</p>}
                </div>

                {/* Nuevas imágenes */}
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                    <FaPlus className="text-green-600" />
                    <p className="font-semibold text-gray-800">Añadir nuevas imágenes</p>
                    </div>
                    <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50 hover:bg-blue-100 transition cursor-pointer relative">
                    <input type="file" multiple accept="image/*" onChange={handleNewImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="text-center">
                        <FaPlus className="text-blue-600 text-2xl mx-auto mb-2" />
                        <p className="text-sm text-gray-700">Haga clic para seleccionar imágenes</p>
                    </div>
                    </div>
                    {newImageFiles.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                        {newImageFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-2 bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
                            <span className="font-medium text-gray-700 text-sm truncate">Nueva {idx + 1}</span>
                            <div className="flex gap-2">
                            <button onClick={() => handleViewNewImage(file)} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm">
                                <FaEye />
                            </button>
                            <button onClick={() => handleRemoveNewImage(idx)} className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-sm">
                                <FaTrash />
                            </button>
                            </div>
                        </div>

                        ))}
                    </div>
                    )}
                </div>

                {/* Botones */}
                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-300">
                    <button onClick={() => { handleUpdate(apt.id_apt, newImageFiles); setNewImageFiles([]); }} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition shadow-lg">
                    <FaSave /> Guardar Cambios
                    </button>
                    <button onClick={handleCancelEdit} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-xl hover:from-gray-600 hover:to-gray-700 transition shadow-lg">
                    <FaTimes /> Cancelar
                    </button>
                </div>
                </div>
            ) : (
                <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FaHome className="text-blue-600" />
                        Apartamento #{apt.id_apt}
                    </h3>
                    </div>
                    <div className="flex gap-2">
                    <button onClick={() => downloadDocument(apt.id_apt, "pdf")} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition shadow-md font-medium" title="Descargar PDF">
                        <FaFilePdf /> PDF
                    </button>
                    <button onClick={() => downloadDocument(apt.id_apt, "excel")} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition shadow-md font-medium" title="Descargar Excel">
                        <FaFileExcel /> Excel
                    </button>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2 mb-3">
                        <FaMapMarkerAlt className="text-blue-600" />
                        <h4 className="font-semibold text-gray-800">Ubicación</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                        <p className="flex items-start gap-2">
                        <span className="font-medium text-gray-600 min-w-[80px]">Barrio:</span>
                        <span className="text-gray-800">{apt.barrio}</span>
                        </p>
                        <p className="flex items-start gap-2">
                        <span className="font-medium text-gray-600 min-w-[80px]">Dirección:</span>
                        <span className="text-gray-800">{apt.direccion_apt}</span>
                        </p>
                        <p className="flex items-start gap-2">
                        <span className="font-medium text-gray-600 min-w-[80px]">Latitud:</span>
                        <span className="text-gray-800">{apt.latitud_apt}</span>
                        </p>
                        <p className="flex items-start gap-2">
                        <span className="font-medium text-gray-600 min-w-[80px]">Longitud:</span>
                        <span className="text-gray-800">{apt.longitud_apt}</span>
                        </p>
                    </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-2 mb-3">
                        <FaInfoCircle className="text-purple-600" />
                        <h4 className="font-semibold text-gray-800">Información Adicional</h4>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{apt.info_add_apt || 'Sin información adicional'}</p>
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button onClick={() => handleEditClick(apt)} className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition shadow-lg">
                    <FaEdit /> Editar Apartamento
                    </button>
                    <button onClick={() => handleDelete(apt.id_apt)} className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition shadow-lg">
                    <FaTrash /> Eliminar
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
    </div>
);
}

export default Manage;
