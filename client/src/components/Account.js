import React, { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from "@fortawesome/free-solid-svg-icons";

function Account({ onClose }) {
const navigate = useNavigate();
const { user, logout } = useContext(UserContext);
const [showConfirmLogout, setShowConfirmLogout] = useState(false);

if (!user) return null;

const roleName = user.rol === 1 ? "USUARIO" : user.rol === 2 ? "ARRENDADOR" : "DESCONOCIDO";

const goToConfigAccount = () => { navigate('/my-account'); onClose(); };
const goToDashboard = () => { navigate('/dashboard'); onClose(); };
const handleLogoutClick = () => setShowConfirmLogout(true);
const confirmLogout = () => { logout(); setShowConfirmLogout(false); navigate('/'); };
const cancelLogout = () => setShowConfirmLogout(false);

const handleOutsideClick = (event) => {
    if (event.target.classList.contains("account-overlay")) onClose();
};

return (
    <div 
    className="account-overlay fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    onClick={handleOutsideClick}
    >
    <div className="bg-white rounded-xl shadow-xl p-6 w-96 relative flex flex-col gap-4">
        
        {/* Icono de configuración */}
        <div className="flex justify-end">
        <FontAwesomeIcon 
            icon={faGear} 
            className="text-gray-600 hover:text-indigo-600 cursor-pointer text-lg" 
            onClick={goToConfigAccount} 
        />
        </div>

        <h2 className="text-xl font-bold text-indigo-600 text-center">Información de la cuenta</h2>
        <p className="text-sm text-gray-500 text-center"><strong>Rol:</strong> {roleName}</p>

        {user.rol === 2 && (
        <p 
            className="text-indigo-600 text-center cursor-pointer hover:underline"
            onClick={goToDashboard}
        >
            Panel de gestión
        </p>
        )}

        <div className="flex flex-col gap-2 bg-gray-50 p-4 rounded-lg border">
        <p><strong>Nombre:</strong> {user.nombre}</p>
        <p><strong>Apellido:</strong> {user.apellido}</p>
        <p><strong>Correo:</strong> {user.email}</p>
        <p><strong>Teléfono:</strong> {user.telefono}</p>
        </div>

        <button 
        onClick={handleLogoutClick}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
        >
        Cerrar sesión
        </button>

        {/* Confirmación de logout */}
        {showConfirmLogout && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-xl">
            <div className="bg-white p-5 rounded-xl shadow-lg flex flex-col gap-4 w-80">
            <p className="text-center text-gray-700 font-medium">¿Estás seguro de que deseas cerrar sesión?</p>
            <div className="flex justify-center gap-4">
                <button 
                onClick={confirmLogout} 
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition"
                >
                Sí
                </button>
                <button 
                onClick={cancelLogout} 
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg transition"
                >
                No
                </button>
            </div>
            </div>
        </div>
        )}

    </div>
    </div>
);
}

export default Account;
