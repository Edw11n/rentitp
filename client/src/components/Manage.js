import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useManageController from "../apis/manageController";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEye, faFilePdf, faFileExcel, faEdit } from '@fortawesome/free-solid-svg-icons';

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
} = useManageController(navigate);

const [newImageFiles, setNewImageFiles] = useState([]);

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

const downloadDocument = (id, type) => {
    window.open(`${API_URL}/documents/apartments/${id}/document/${type}`, "_blank");
};

useEffect(() => { fetchApartments(); }, []);

return (
    <div className="p-6 bg-gray-100 min-h-screen">
    <h2 className="text-2xl font-bold mb-4">Mis Apartamentos</h2>
    <button
        onClick={fetchApartments}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
        Actualizar
    </button>

    {loading ? (
        <p>Cargando apartamentos...</p>
    ) : apartmentList.length === 0 ? (
        <b>No hay apartamentos disponibles para editar.</b>
    ) : (
        <div className="space-y-6 max-h-[80vh] overflow-y-auto">
        {apartmentList.map((apt) => (
            <div key={apt.id_apt} className="bg-white rounded-xl shadow p-4">
            {editApartmentId === apt.id_apt ? (
                <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input name="barrio" value={editFormData.barrio} onChange={handleInputChange} placeholder="Barrio" className="border rounded p-2 w-full" />
                    <input name="direccion_apt" value={editFormData.direccion_apt} onChange={handleInputChange} placeholder="Dirección" className="border rounded p-2 w-full" />
                    <input name="latitud_apt" value={editFormData.latitud_apt} onChange={handleInputChange} placeholder="Latitud" className="border rounded p-2 w-full" />
                    <input name="longitud_apt" value={editFormData.longitud_apt} onChange={handleInputChange} placeholder="Longitud" className="border rounded p-2 w-full" />
                </div>
                <textarea
                    name="info_add_apt"
                    value={editFormData.info_add_apt}
                    onChange={handleInputChange}
                    placeholder="Información adicional"
                    className="border rounded p-2 w-full h-24"
                />

                {/* Imágenes existentes */}
                <div>
                    <p className="font-semibold mb-2">Imágenes existentes:</p>
                    {editFormData.images?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {editFormData.images.map((img, idx) => (
                        <div key={idx} className="flex items-center gap-1 bg-gray-100 p-2 rounded">
                            <span>Imagen {idx + 1}</span>
                            <button onClick={() => handleViewImageExisting(img)} className="text-blue-600 hover:text-blue-800">
                            <FontAwesomeIcon icon={faEye} />
                            </button>
                            <button onClick={() => handleRemoveExistingImage(idx)} className="text-red-600 hover:text-red-800">
                            <FontAwesomeIcon icon={faTrashAlt} />
                            </button>
                        </div>
                        ))}
                    </div>
                    ) : <p>No hay imágenes cargadas.</p>}
                </div>

                {/* Nuevas imágenes */}
                <div>
                    <p className="font-semibold mb-2">Añadir nuevas imágenes:</p>
                    <input type="file" multiple accept="image/*" onChange={handleNewImageChange} />
                    {newImageFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {newImageFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-1 bg-gray-100 p-2 rounded">
                            <span>Imagen nueva {idx + 1}</span>
                            <button onClick={() => handleViewNewImage(file)} className="text-blue-600 hover:text-blue-800">
                            <FontAwesomeIcon icon={faEye} />
                            </button>
                            <button onClick={() => handleRemoveNewImage(idx)} className="text-red-600 hover:text-red-800">
                            <FontAwesomeIcon icon={faTrashAlt} />
                            </button>
                        </div>
                        ))}
                    </div>
                    )}
                </div>

                {/* Botones */}
                <div className="flex gap-2 mt-4">
                    <button onClick={() => { handleUpdate(apt.id_apt, newImageFiles); setNewImageFiles([]); }} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Actualizar</button>
                    <button onClick={handleCancelEdit} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition">Cancelar</button>
                </div>
                </div>
            ) : (
                <div className="space-y-2">
                <div className="flex gap-2 mb-2">
                    <button onClick={() => downloadDocument(apt.id_apt, "pdf")} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition">
                    <FontAwesomeIcon icon={faFilePdf} />
                    </button>
                    <button onClick={() => downloadDocument(apt.id_apt, "excel")} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition">
                    <FontAwesomeIcon icon={faFileExcel} />
                    </button>
                </div>
                <div className="space-y-1">
                    <p><strong>Barrio:</strong> {apt.barrio}</p>
                    <p><strong>Dirección:</strong> {apt.direccion_apt}</p>
                    <p><strong>Latitud:</strong> {apt.latitud_apt}</p>
                    <p><strong>Longitud:</strong> {apt.longitud_apt}</p>
                    <p><strong>Información adicional:</strong> {apt.info_add_apt}</p>
                </div>
                <div className="flex gap-2 mt-2">
                    <button onClick={() => handleEditClick(apt)} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                    <FontAwesomeIcon icon={faEdit} /> Editar
                    </button>
                    <button onClick={() => handleDelete(apt.id_apt)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition">
                    <FontAwesomeIcon icon={faTrashAlt} /> Eliminar
                    </button>
                </div>
                </div>
            )}
            </div>
        ))}
        </div>
    )}
    </div>
);
}

export default Manage;
