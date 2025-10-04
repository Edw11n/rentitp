import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useManageController from "../apis/manageController"; // Importa el controlador
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEye, faFilePdf, faFileExcel, faEdit } from '@fortawesome/free-solid-svg-icons';
import '../styles/manage.css';
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
} = useManageController(navigate); // Utiliza el controlador

const [newImageFiles, setNewImageFiles] = useState([]);
const handleNewImageChange = (e) => {
    if (e.target.files) {
        const filesArray = Array.from(e.target.files);
        setNewImageFiles(prevFiles => [...prevFiles, ...filesArray]);
    }
};

const handleViewImageExisting = (imgBase64) => {
    const newTab = window.open();
    if (newTab) {
        newTab.document.write(`<img src="${imgBase64}" style="max-width: 80%; max-height: 80vh;" />`);
        newTab.document.title = "Vista previa de la imagen";
    }
};

const handleRemoveExistingImage = (index) => {
    if (editFormData.images) {
    const updatedImages = editFormData.images.filter((_, i) => i !== index);
    setEditFormData({ ...editFormData, images: updatedImages });
    console.log('Imágenes exitentes actualizadas:', updatedImages);
    }
};

const handleViewNewImage = (file) => {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const handleRemoveNewImage = (index) => {
    setNewImageFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
};

// Función para descargar documento (PDF o Excel)
const downloadDocument = (id, type) => {
    // Se construye la URL:
    const url = `${API_URL}/documents/apartments/${id}/document/${type}`;
    window.open(url, '_blank');
};

useEffect(() => {
    fetchApartments();
}, []); // Se ejecuta solo una vez al montar el componente

return (
    <div className="manage-container">
    {loading ? (
        <p>Cargando apartamentos...</p>
    ) : (
        <div>
        <h2>Mis Apartamentos</h2>
        <button className="refresh-btn" onClick={fetchApartments}>Actualizar</button>
        {apartmentList.length === 0 ? (
            <b>No hay apartamentos disponibles para editar.</b>
        ) : (
            <div className="apartment-list">
            {apartmentList.map((apartment) => (
                <div key={apartment.id_apt} className="apartment-item">
                {editApartmentId === apartment.id_apt ? (
                    <div className="edit-apartment-form">
                    <input 
                        type="text" 
                        name="barrio" 
                        value={editFormData.barrio} 
                        onChange={handleInputChange} 
                        placeholder="Barrio" 
                    />
                    <input 
                        type="text" 
                        name="direccion_apt" 
                        value={editFormData.direccion_apt} 
                        onChange={handleInputChange} 
                        placeholder="Dirección" 
                    /> 
                    <input 
                        type="text" 
                        name="latitud_apt" 
                        value={editFormData.latitud_apt} 
                        onChange={handleInputChange} 
                        placeholder="Latitud" 
                    />
                    <input 
                        type="text" 
                        name="longitud_apt" 
                        value={editFormData.longitud_apt} 
                        onChange={handleInputChange} 
                        placeholder="Longitud" 
                    />
                    <textarea 
                        className="edit-form-textarea" 
                        name="info_add_apt" 
                        value={editFormData.info_add_apt} 
                        onChange={handleInputChange} 
                        placeholder="Información adicional"
                    />
                    <div className="edit-images-section">
                        <p>Imágenes existentes:</p>
                        {Array.isArray(editFormData.images) && editFormData.images.length > 0 ? (
                        editFormData.images.map((img, index) => (
                            <div key={index} className="image-preview-item">
                            <span>Imagen {index + 1}</span>
                            <button 
                                className="view-image-button"
                                onClick={() => handleViewImageExisting(img)}
                            >
                                <FontAwesomeIcon icon={faEye} />
                            </button>
                            <button 
                                className="remove-image-button"
                                onClick={() => handleRemoveExistingImage(index)}
                            >
                                <FontAwesomeIcon icon={faTrashAlt} />
                            </button>
                            </div>
                        ))
                        ) : (
                        <p>No hay imágenes cargadas.</p>
                        )}
                    </div>
                    {/* Sección para añadir nuevas imágenes */}
                    <div className="edit-images-section">
                        <p>Añadir nuevas imágenes:</p>
                        <input 
                        type="file" 
                        id="editApartmentImages" 
                        accept="image/*" 
                        multiple 
                        onChange={handleNewImageChange}
                        />
                        {newImageFiles.length > 0 && (
                        <div className="new-image-preview-list">
                            {newImageFiles.map((file, index) => (
                            <div key={index} className="image-preview-item">
                                <span>Imagen nueva {index + 1}</span>
                                <button 
                                className="view-image-button"
                                onClick={() => handleViewNewImage(file)}
                                >
                                <FontAwesomeIcon icon={faEye} />
                                </button>
                                <button 
                                className="remove-image-button"
                                onClick={() => handleRemoveNewImage(index)}
                                >
                                <FontAwesomeIcon icon={faTrashAlt} />
                                </button>
                            </div>
                            ))}
                        </div>
                        )}
                    </div>
                    <div className="edit-buttons"> 
                        <button className="update-btn" onClick={() => {
                            handleUpdate(apartment.id_apt, newImageFiles);
                            setNewImageFiles([]);
                        }}>Actualizar</button>
                        <button className="cancel-btn" onClick={handleCancelEdit}>Cancelar</button>
                    </div>
                    </div>
                ) : (
                    <>
                    <div className="download-buttons">
                        {/* Botones para descargar documentos */}
                        <button  className="pdf-btn" onClick={() => downloadDocument(apartment.id_apt, 'pdf')}>
                        <FontAwesomeIcon icon={faFilePdf}/>
                        </button>
                        <button  className="excel-btn" onClick={() => downloadDocument(apartment.id_apt, 'excel')}>    
                            <FontAwesomeIcon icon={faFileExcel}/>
                        </button>
                    </div>
                    <div className="apartment-details">
                        <p><strong>Barrio:</strong> {apartment.barrio}</p>
                        <p><strong>Dirección:</strong> {apartment.direccion_apt}</p>
                        <p><strong>Latitud:</strong> {apartment.latitud_apt}</p>
                        <p><strong>Longitud:</strong> {apartment.longitud_apt}</p>
                        <p><strong>Información adicional:</strong> {apartment.info_add_apt}</p>
                    </div>
                    <div className="action-buttons">
                        <button className="edit-btn" onClick={() => handleEditClick(apartment)}>
                            <FontAwesomeIcon icon={faEdit} /> Editar
                        </button>
                        <button className="delete-btn" onClick={() => handleDelete(apartment.id_apt)}>
                            <FontAwesomeIcon icon={faTrashAlt} /> Eliminar
                        </button>
                    </div>

                    </>
                )}
                </div>
            ))}
            </div>
        )}
        </div>
    )}
    </div>
);
}

export default Manage;