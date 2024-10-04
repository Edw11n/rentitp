import React, { useContext } from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from 'react-router-dom';
import './styles/Account.css';

function Account({ onClose }) {
    const navigate = useNavigate();
    const { user, logout } = useContext(UserContext);

    const goToDashboard = () => {
        navigate('/dashboard');
        onClose();
    };

    if (!user) {
        return;
    }

    return (
        <div className="account">
            <div className="account-container">
                <h2>Información de la cuenta</h2>
                <p className="role">ARRENDADOR</p>
                <p className='go-to-dashboard' onClick={goToDashboard}>Panel de gestión</p>
                <div className="user-info">
                    <p><strong>Nombre:</strong> {user.nombre}</p>
                    <p><strong>Apellido:</strong> {user.apellido}</p>
                    <p><strong>Correo:</strong> {user.email}</p>
                    <p><strong>Teléfono:</strong> {user.telefono}</p>
                </div>
                <button onClick={logout} className="logout-button">Cerrar sesión</button>
            </div>
        </div>
    );
}

export default Account;
