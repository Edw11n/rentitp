import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import '../styles/modals.css'; 

function SuccessModal({ message }) {
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
                <h2>{message}</h2>
                <p>El proceso se ha realizado correctamente. Puede continuar iniciando sesión.</p>
                <button onClick={goToLogin}>Ir al login</button>
            </div>
        </div>
    );
}

export default SuccessModal;

