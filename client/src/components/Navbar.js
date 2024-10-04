import React, { useContext } from 'react';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import './styles/Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

function Navbar({ goToJoin, setShowAccount }) {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    
    const goToHome = () => {
        navigate('/');
    };

    const handleUserClick = () => {
        setShowAccount(prev => !prev);
    };

    return (
        <nav className='navbar'>
            <h1 className='title' onClick={goToHome}>CampusHousing Mocoa</h1>
            {!user ? (
                <div className='navbar-join'>
                    <p className='navbar-join-click' onClick={goToJoin}>Eres propietario?</p>
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
