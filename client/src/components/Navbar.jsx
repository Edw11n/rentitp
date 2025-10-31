import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

function Navbar({ goToJoin, setShowAccount }) {
const { user } = useContext(UserContext);
const navigate = useNavigate();

const handleTitleClick = () => {
    localStorage.setItem("mapCenter", JSON.stringify([1.157037, -76.651443]));
    navigate('/');
    window.location.reload();
};

const handleUserClick = () => {
    setShowAccount(prev => !prev);
};

return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-gradient-to-r from-indigo-600 to-indigo-400 shadow-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
    
    <h1
        className="text-white text-2xl font-semibold cursor-pointer tracking-tight transition hover:-translate-y-1 hover:shadow-md"
        onClick={handleTitleClick}
    >
        RentITP
    </h1>

    {!user ? (
        <div>
        <p
            onClick={goToJoin}
            className="text-white font-medium cursor-pointer px-4 py-2 rounded-lg bg-white/10 flex items-center gap-2 transition hover:bg-white/20 hover:-translate-y-1"
        >
            Inicia sesión aquí
        </p>
        </div>
    ) : (
        <div className="flex items-center gap-4">
        {/* Botón Panel de Gestión - Solo para arrendadores (rol === 2) */}
        {user.rol === 2 && (
            <button
            onClick={() => navigate('/dashboard')}
            className="text-white font-medium cursor-pointer px-4 py-2 rounded-lg bg-white/10 flex items-center gap-2 transition hover:bg-white/20 hover:-translate-y-1"
            title="Panel de Gestión"
            >
            <FontAwesomeIcon icon={faClipboardList} />
            <span className="hidden sm:inline">Panel de Gestión</span>
            </button>
        )}
        
        <FontAwesomeIcon
            icon={faUser}
            className="text-white text-xl cursor-pointer p-2 rounded-full bg-white/10 transition hover:bg-white/20 hover:scale-105"
            onClick={handleUserClick}
        />
        </div>
    )}
    </nav>
);
}

export default Navbar;
