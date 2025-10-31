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
        // cierra solo si se hace click en el overlay (fuera del popup)
        if (event.target.classList && event.target.classList.contains("account-overlay")) onClose();
    };

    // Iniciales para avatar
    const initials = `${(user.nombre || '').charAt(0)}${(user.apellido || '').charAt(0)}`.toUpperCase();
    const firstName = (user.nombre || '').split(' ')[0] || '';

    return (
        // overlay transparente: captura clicks fuera para cerrar, pero no oscurece la app
        <div
            className="account-overlay fixed inset-0 z-50"
            onClick={handleOutsideClick}
        >
            <div className="relative w-full h-full">
                {/* Popup alineado al lado superior derecho (similar al menú de cuenta de Gmail) */}
                <div className="absolute top-14 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="p-4">
                        {/* Cabecera: email + close */}
                        <div className="flex items-start justify-between">
                            <div className="text-sm text-gray-600 truncate max-w-[60%]">{user.email}</div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 rounded-full p-1"
                                aria-label="Cerrar"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Avatar y saludo */}
                        <div className="flex flex-col items-center mt-3">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white text-xl font-extrabold shadow-md">
                                {initials || user.email.charAt(0).toUpperCase()}
                            </div>
                            <h3 className="mt-3 text-lg font-semibold text-gray-800">¡Hola, {firstName}!</h3>
                            <button
                                onClick={goToConfigAccount}
                                className="mt-3 px-3 py-1 border rounded-full text-indigo-600 border-indigo-200 hover:bg-indigo-50 text-sm"
                            >
                                Administrar tu Cuenta
                            </button>
                        </div>

                        {/* Información resumida */}
                        <div className="mt-4 bg-gray-50 rounded-lg p-3 border border-gray-100">
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-gray-500">Nombre</span>
                                <span className="text-sm font-semibold text-gray-900">{user.nombre}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-gray-500">Apellido</span>
                                <span className="text-sm font-semibold text-gray-900">{user.apellido}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-gray-500">Correo</span>
                                <span className="text-sm font-semibold text-gray-900 truncate max-w-[45%]">{user.email}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-gray-500">Teléfono</span>
                                <span className="text-sm font-semibold text-gray-900">{user.telefono || '-'}</span>
                            </div>
                        </div>

                                    {/* Acciones: solo botón de cerrar sesión */}
                                    <div className="mt-4">
                                        <button
                                            onClick={handleLogoutClick}
                                            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
                                        >
                                            Cerrar sesión
                                        </button>
                                    </div>

                        {/* Si el usuario es arrendador, link al panel */}
                        {user.rol === 2 && (
                            <p
                                className="mt-3 text-center text-indigo-600 cursor-pointer hover:underline text-sm"
                                onClick={goToDashboard}
                            >
                                Panel de gestión
                            </p>
                        )}

                    </div>

                    {/* Confirmación de logout — overlay pequeño sobre el popup */}
                    {showConfirmLogout && (
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                            <div className="bg-white p-5 rounded-xl shadow-lg w-64">
                                <p className="text-center text-gray-700 font-medium">¿Estás seguro de que deseas cerrar sesión?</p>
                                <div className="flex justify-center gap-4 mt-4">
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
        </div>
    );
}

export default Account;
