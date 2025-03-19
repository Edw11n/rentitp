import React from 'react';
import '../styles/images.css';
const API_URL = process.env.REACT_APP_API_URL;

function ImageModal({ images, currentIndex, onClose, onPrev, onNext }) {
    const rawPath = images[currentIndex] || "";
    const normalizedPath = rawPath.replace(/\\/g, '/'); 
    const cleanedPath = normalizedPath.startsWith('uploads/') 
        ? normalizedPath.slice('uploads/'.length) 
        : normalizedPath;
    const imageUrl = `${API_URL}/uploads/${cleanedPath}`;

    return (
        <div className="modal-overlay"onClick={onClose}>
        <div className="modal-content"onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={onClose}>&times;</button>
            <button className="modal-prev" onClick={onPrev}>&#8592;</button>
            <img src={imageUrl} alt="Apartamento" className="modal-image"/>
            <button className="modal-next" onClick={onNext}>&#8594;</button>
        </div>
        </div>
    );
    }

export default ImageModal;
