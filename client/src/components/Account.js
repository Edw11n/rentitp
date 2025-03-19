import React, { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from 'react-router-dom';
import '../styles/modals.css';

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

    // Determinar el nombre del rol basado en rolId
    const roleName = user.rolId === 1 ? "USUARIO" : user.rolId === 2 ? "ARRENDADOR" : "DESCONOCIDO";

    const handleOutsideClick = (event) => {
        if (event.target.classList.contains("account")) {
            onClose();
        }
    };

    return (
        <div className="account" onClick={handleOutsideClick}>
            <div className="account-container">
                <h2>Información de la cuenta</h2>
                <p className="role"><strong>Rol:</strong> {roleName}</p>

                {/* Mostrar el enlace al panel de gestión solo si rolId es 2 */}
                {user.rolId === 2 && (
                    <p className='go-to-dashboard' onClick={goToDashboard}>Panel de gestión</p>
                )}

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
