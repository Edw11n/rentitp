import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function SuccessModal({ message }) {
const navigate = useNavigate();

const goToLogin = () => {
    navigate('/login');
};

return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-xl p-8 w-11/12 max-w-md text-center">
        <FontAwesomeIcon
        icon={faCheckCircle}
        className="text-green-500 text-6xl mb-4"
        />
        <h2 className="text-xl font-semibold mb-2">{message}</h2>
        <p className="text-gray-600 mb-6">
        El proceso se ha realizado correctamente. Puede continuar iniciando sesión.
        </p>
        <button
        onClick={goToLogin}
        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
        >
        Ir al login
        </button>
    </div>
    </div>
);
}

export default SuccessModal;
