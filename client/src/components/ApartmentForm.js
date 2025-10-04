import React, { useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import ApartmentFormController from '../apis/apartmentformController';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEye, faSave } from '@fortawesome/free-solid-svg-icons';
import '../styles/apartments.css';

    function ApartmentForm() {
    const { user } = useContext(UserContext);
    const [barrio, setBarrio] = useState('');
    const [direccion, setDireccion] = useState('');
    const [latitud, setLatitud] = useState('');
    const [longitud, setLongitud] = useState('');
    const [addInfo, setAddInfo] = useState('');
    const [charCount, setCharCount] = useState(0);
    const [message, setMessage] = useState('');
    // Estado para múltiples archivos
    const [imageFiles, setImageFiles] = useState([]);

    const handleFileChange = (e) => {
        if (e.target.files) {
        const filesArray = Array.from(e.target.files);
        setImageFiles(prevFiles => [...prevFiles, ...filesArray]);
        }
    };

    const removeImage = (index) => {
        setImageFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    // Función para abrir la imagen en una nueva pestaña
    const handleViewImage = (file) => {
        const url = URL.createObjectURL(file);
        window.open(url, '_blank');
        // Opcional: revocar el objeto URL después de un tiempo
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    const handleSubmit = async () => {
        if (imageFiles.length === 0) {
            setMessage('Por favor, cargue al menos una imagen');
            return;
        }
        const formData = new FormData();
        formData.append('barrio', barrio);
        formData.append('direccion', direccion);
        formData.append('latitud', latitud);
        formData.append('longitud', longitud);
        formData.append('addInfo', addInfo);
        formData.append('user_email', user.email);
        imageFiles.forEach(file => {
        formData.append('images', file);
        });

        try {
            const controller = new ApartmentFormController(user);
            const successMessage = await controller.submitApartment(formData);
                setMessage(successMessage);
            // Limpiar formulario
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

    return (
        <div className='apartment-form-container'>
            <h2>Añadir Apartamento</h2>
            {message && <p className="message">{message}</p>}
            
            <div className="input-grid">
                <div className="form-group">
                    <input
                        type="text"
                        id="barrio"
                        placeholder="Barrio"
                        value={barrio}
                        onChange={(e) => setBarrio(e.target.value)}
                    />
                </div>
                
                <div className="form-group">
                    <input
                        type="text"
                        id="direccion"
                        placeholder="Dirección"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                    />
                </div>
            </div>
            
            <div className="form-group">
                <label>Coordenadas</label>
                <div className="coordinates-group">
                    <input
                        type="text"
                        id="latitud"
                        placeholder="Latitud"
                        value={latitud}
                        onChange={(e) => setLatitud(e.target.value)}
                    />
                    <input
                        type="text"
                        id="longitud"
                        placeholder="Longitud"
                        value={longitud}
                        onChange={(e) => setLongitud(e.target.value)}
                    />
                </div>
            </div>
            
            <div className="form-group">
                <div className="textarea-container">
                    <textarea
                        id="addInfo"
                        placeholder="Información adicional de la publicación"
                        value={addInfo}
                        onChange={handleAddInfoChange}
                        maxLength="500"
                        rows="5"
                        className="textarea-field"
                    />
                    <span className="char-counter">{charCount}/500</span>
                </div>
            </div>
            
            <div className="form-group">
                <label htmlFor="apartmentImages">Imágenes del Apartamento</label>
                <input
                    type="file"
                    id="apartmentImages"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="file-input"
                />
            </div>
            
            {imageFiles.length > 0 && (
                <div className="image-preview-list">
                    {imageFiles.map((file, index) => (
                        <div key={index} className="image-preview-item">
                            <span>Imagen {index + 1}</span>
                            <div className="image-actions">
                                <button onClick={() => handleViewImage(file)} className="view-image-button">
                                    <FontAwesomeIcon icon={faEye} />
                                </button>
                                <button onClick={() => removeImage(index)} className="remove-image-button">
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <button className="submit-btn" onClick={handleSubmit}>
                <FontAwesomeIcon icon={faSave} /> Publicar Apartamento
            </button>
        </div>
    );
}

export default ApartmentForm;
