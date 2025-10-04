import React, { useContext } from 'react';
import '../styles/navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

function Navbar({ goToJoin, setShowAccount }) {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const handleTitleClick = () => {
        // Guarda la ubicación del instituto en localStorage antes de recargar
        localStorage.setItem("mapCenter", JSON.stringify({ lat: 1.157037, lng: -76.651443 }));
        navigate('/'); // Navega a la página principal
        window.location.reload(); // Recarga la página
    };

    const handleUserClick = () => {
        setShowAccount(prev => !prev);
    };

    return (
        <nav className='navbar'>
            <h1 className='title' onClick={handleTitleClick}>RentITP</h1>
            {!user ? (
                <div className='navbar-join'>
                    <p className='navbar-join-click' onClick={goToJoin}>Inicia sesión aquí</p>
                </div>
            ) : (
                <div className='dash'>
                    <FontAwesomeIcon icon={faUser} onClick={handleUserClick} />
                </div>
            )}
        </nav>
    );
}

export default Navbar;
