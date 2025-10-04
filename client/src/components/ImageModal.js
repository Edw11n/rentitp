import React from 'react';
import '../styles/images.css';

function ImageModal({ images, currentIndex, onClose, onPrev, onNext }) {
    const imageSrc = images[currentIndex] || "";

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>
                <button className="modal-prev" onClick={onPrev}>&#8592;</button>
                <img src={imageSrc} alt="Apartamento" className="modal-image" />
                <button className="modal-next" onClick={onNext}>&#8594;</button>
            </div>
        </div>
    );
}

export default ImageModal;
