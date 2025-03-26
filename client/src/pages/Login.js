import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from '../apis/loginController';
import { UserContext } from "../contexts/UserContext";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { googleLogin } from "../apis/googleAuthController";
import '../styles/log.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { login } = useContext(UserContext);
    const navigate = useNavigate();

    const goToHome = () => {
        navigate('/');
    };
    // Login con email y contraseña
    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await loginUser({ email, password, login });
        if (result.success) {
            console.log('Login exitoso');
            goToHome();
        } else {
            setMessage(result.message);
        }
    };
    // Login con Google
    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const {credential} = credentialResponse;
            if (!credential) {
                console.error('No se recibio el token de google');
                return;
            }
            const decoded = jwtDecode(credential);
            console.log('Token decodificado:', decoded);

            const result = await googleLogin({ token: credential, login });
            if (result.success) {
                console.log('Login exitoso');
                goToHome();
            } else {
                setMessage(result.message);
            }
        } catch (error) {
            console.error('Error en el login con Google:', error);
            setMessage('Error en el login con Google');
        }
    }

    return (
        <div className="container login-container">
            <FontAwesomeIcon icon={faTimes} className="exit-icon-login" onClick={goToHome} />
            
            <div className="div-container">
                <div className="title">
                    <h2>Bienvenido de vuelta</h2>
                    <div className="google-login-container">
                        <GoogleLogin 
                            onSuccess={handleGoogleLogin}
                            onError={() => setMessage('Error en el login con Google')}
                        />
                        <p className="google-text">O</p>
                    </div>
                    <p className="subtitle">Ingresa tus credenciales para continuar</p>
                </div>
                
                <div className="form-container">
                    <div className="input-group">
                        <label>Correo electrónico</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div className="input-group">
                        <label>Contraseña</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button className="in-button" onClick={handleSubmit}>Acceder a mi cuenta</button>
                    
                    {message && <p className="error-message">{message}</p>}
                    
                    <p className="register-link">
                        ¿No tienes cuenta? <span onClick={() => navigate('/signup')}>Regístrate aquí</span>
                    </p>
                </div>
            </div>
            
            <div className="visual-section login-visual">
                <div className="visual-content">
                    <h1>Tu comunidad te espera</h1>
                    <p>Conecta con la mejor opción de alojamiento estudiantil</p>
                </div>
            </div>
        </div>
    );
}

export default Login;
