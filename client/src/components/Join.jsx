import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUserPlus, faSignInAlt, faHome } from '@fortawesome/free-solid-svg-icons';

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
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 p-4 animate-fadeIn">
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl w-full max-w-md p-8 relative transform transition-all animate-slideUp">
        
        {/* Botón de cerrar */}
        <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 hover:rotate-90 transition-all duration-300 p-2 rounded-full hover:bg-gray-100"
        aria-label="Cerrar"
        >
        <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>

        {/* Encabezado */}
        <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full mb-4 shadow-lg">
            <FontAwesomeIcon icon={faHome} className="text-white text-2xl" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Bienvenido a RentUp!</h2>
        <p className="text-gray-500 text-sm">Encuentra tu hogar ideal o gestiona tus propiedades</p>
        </div>

        {/* Contenido del modal */}
        <div className="space-y-4">
        {/* Botón Regístrate */}
        <div className="space-y-2">
            <p className="text-gray-600 text-sm font-medium">¿No tienes una cuenta?</p>
            <button
            onClick={goToSignup}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-3 group"
            >
            <FontAwesomeIcon icon={faUserPlus} className="group-hover:scale-110 transition-transform" />
            <span>Crear cuenta nueva</span>
            </button>
        </div>

        {/* Divisor */}
        <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm font-medium">O</span>
            <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Botón Inicia Sesión */}
        <div className="space-y-2">
            <p className="text-gray-600 text-sm font-medium">¿Ya tienes cuenta?</p>
            <button
            onClick={goToLogin}
            className="w-full py-4 bg-white hover:bg-gray-50 text-gray-800 rounded-xl font-semibold transition-all duration-300 border-2 border-gray-200 hover:border-indigo-400 hover:shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-3 group"
            >
            <FontAwesomeIcon icon={faSignInAlt} className="group-hover:scale-110 transition-transform text-indigo-600" />
            <span>Iniciar sesión</span>
            </button>
        </div>
        </div>
    </div>
    </div>
);
}

export default Join;
