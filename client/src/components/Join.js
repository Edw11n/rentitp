import React from "react";
import '../styles/modals.css';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function Join({ onClose }) {
    const navigate = useNavigate();

    const goToSignup = () => {
        navigate('/signup');
        onClose();
    };

    const goToLogin = () => {
        navigate('/login');
        onClose();
    };

    return (
        <div className="join">
            <div className="join-content">
                <div className="close-icon" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </div>
                <div className="join-options-content">
                    <div className="signup-case">
                        <p>No tienes una cuenta? Regístrate:</p>
                        <button className="signup-button" onClick={goToSignup}>Regístrate</button>
                    </div>
                    <div className="login-case">
                        <p>Si ya tienes una cuenta, inicia sesión:</p>
                        <button className="login-button" onClick={goToLogin}>Inicia sesión</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Join;
