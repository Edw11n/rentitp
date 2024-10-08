import React, { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from 'react-router-dom';
import './styles/Account.css';

function Account({ onClose }) {
    const navigate = useNavigate();
    const { user, logout } = useContext(UserContext);
    const [showConfirmLogout, setShowConfirmLogout] = useState(false); // Estado para controlar la confirmación de cerrar sesión

    const goToDashboard = () => {
        navigate('/dashboard');
        onClose();
    };

    const handleLogoutClick = () => {
        setShowConfirmLogout(true); // Mostrar la confirmación al hacer clic en cerrar sesión
    };

    const confirmLogout = () => {
        logout();
        setShowConfirmLogout(false); // Cerrar la confirmación
        navigate('/');
    };

    const cancelLogout = () => {
        setShowConfirmLogout(false); // Ocultar la confirmación si se cancela
    };

    if (!user) {
        return null;
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
                <button onClick={handleLogoutClick} className="logout-button">Cerrar sesión</button>

                {/* Mostrar el diálogo de confirmación */}
                {showConfirmLogout && (
                    <div className="confirm-logout-dialog">
                        <p>¿Estás seguro de que deseas cerrar sesión?</p>
                        <div className="confirm-logout-actions">
                            <button onClick={confirmLogout} className="logout-confirm-btn">Sí</button>
                            <button onClick={cancelLogout} className="logout-cancel-btn">No</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Account;
