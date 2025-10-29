import React from "react";
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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
    <div className="bg-white rounded-xl shadow-xl w-11/12 max-w-md p-6 relative">
        
        {/* Botón de cerrar */}
        <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        >
        <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>

        {/* Contenido del modal */}
        <div className="space-y-6 text-center">
        <div>
            <p className="text-gray-700 text-lg mb-2">No tienes una cuenta? Regístrate:</p>
            <button
            onClick={goToSignup}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
            >
            Regístrate
            </button>
        </div>

        <div>
            <p className="text-gray-700 text-lg mb-2">Si ya tienes una cuenta, inicia sesión:</p>
            <button
            onClick={goToLogin}
            className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition"
            >
            Inicia sesión
            </button>
        </div>
        </div>
    </div>
    </div>
);
}

export default Join;
