import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SucessModal from '../components/SuccessModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUser, faEnvelope, faPhone, faLock, faUserTie, faHome } from '@fortawesome/free-solid-svg-icons';
import '../styles/log.css';
import { signupUser } from '../apis/signupController'; // Importa el controlador
import { UserContext } from "../contexts/UserContext";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { googleLogin } from "../apis/googleAuthController";

function Signup() {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [mensaje, setMessage] = useState("");
    const [showSucess, setShowSucess] = useState(false);
    const [error, setError] = useState(false);
    const {login} = useContext(UserContext);
    const [userType, setUserType] = useState(""); // Estado para almacenar el tipo de usuario
    const navigate = useNavigate();

    const goToHome = () => {
        navigate('/');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError(true);
            setMessage("Las contraseñas no coinciden");
            return;
        }

        // Asigna el rol basado en la selección de userType
        let rolId = 2; // Default: arrendador
        if (userType === "usuario") {
            rolId = 1; // Si es usuario, rolId es 1
        }

        // Verifica que al menos un rol esté seleccionado
        if (!userType) {
            setError(true);
            setMessage("Por favor selecciona un tipo de usuario.");
            return;
        }

        const result = await signupUser({ nombre, apellido, email, telefono, password, rolId });
        if (result.success) {
            setShowSucess(true);
        } else {
            setMessage(result.message);
            setError(true);
        }
    };

    const handleSuccessClose = () => {
        setShowSucess(false);
        navigate('/login');
    }
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
        <div className="container">
            <button className="exit-icon" onClick={goToHome} aria-label="Volver al inicio">
                <FontAwesomeIcon icon={faTimes} />
            </button>
            
            <div className="visual-section">
                <div className="visual-content">
                    <div className="icon-wrapper">
                        <FontAwesomeIcon icon={faHome} className="home-icon" />
                    </div>
                    <h1>Únete a nuestra comunidad</h1>
                    <p>Encuentra o ofrece el alojamiento perfecto cerca de tu universidad</p>
                    <div className="features-list">
                        <div className="feature-item">
                            <span className="check-icon">✓</span>
                            <span>Busca propiedades verificadas</span>
                        </div>
                        <div className="feature-item">
                            <span className="check-icon">✓</span>
                            <span>Conecta con propietarios directamente</span>
                        </div>
                        <div className="feature-item">
                            <span className="check-icon">✓</span>
                            <span>Gestiona tus propiedades fácilmente</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="div-container">
                <div className="title">
                    <h2>Crea tu cuenta</h2>
                    <p className="subtitle">Únete a miles de estudiantes y propietarios</p>
                </div>

                <div className="google-login-container">
                    <GoogleLogin 
                        onSuccess={handleGoogleLogin}
                        onError={() => setMessage('Error en el login con Google')}
                    />
                    <p className="google-text">O regístrate con tu email</p>
                </div>

                <div className="input-grid">
                    <div className="input-group">
                        <label><FontAwesomeIcon icon={faUser} className="input-icon" /> Nombre</label>
                        <input 
                            type="text" 
                            value={nombre} 
                            onChange={(e) => setNombre(e.target.value)} 
                            placeholder="Tu nombre"
                        />
                    </div>
                    
                    <div className="input-group">
                        <label><FontAwesomeIcon icon={faUser} className="input-icon" /> Apellido</label>
                        <input 
                            type="text" 
                            value={apellido} 
                            onChange={(e) => setApellido(e.target.value)} 
                            placeholder="Tu apellido"
                        />
                    </div>
                    
                    <div className="input-group">
                        <label><FontAwesomeIcon icon={faEnvelope} className="input-icon" /> Correo electrónico</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="correo@ejemplo.com"
                        />
                    </div>
                    
                    <div className="input-group">
                        <label><FontAwesomeIcon icon={faPhone} className="input-icon" /> Teléfono</label>
                        <input 
                            type="text" 
                            value={telefono} 
                            onChange={(e) => setTelefono(e.target.value)} 
                            placeholder="(+57) 300 123 4567"
                        />
                    </div>
                    
                    <div className="input-group">
                        <label><FontAwesomeIcon icon={faLock} className="input-icon" /> Contraseña</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="••••••••"
                        />
                    </div>
                    
                    <div className="input-group">
                        <label><FontAwesomeIcon icon={faLock} className="input-icon" /> Confirmar contraseña</label>
                        <input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            placeholder="••••••••"
                        />
                    </div>
                </div>
                
                <div className="role-selector-header">
                    <h3>Selecciona tu tipo de cuenta</h3>
                </div>

                <div className="role-selector">
                    <div 
                        className={`role-card ${userType === 'usuario' ? 'selected' : ''}`}
                        onClick={() => setUserType('usuario')}
                    >
                        <div className="role-icon">
                            <FontAwesomeIcon icon={faUser} />
                        </div>
                        <h3>Usuario</h3>
                        <p>Busco alojamiento cerca de mi universidad</p>
                        {userType === 'usuario' && <div className="selected-badge">✓ Seleccionado</div>}
                    </div>
                    
                    <div 
                        className={`role-card ${userType === 'arrendador' ? 'selected' : ''}`}
                        onClick={() => setUserType('arrendador')}
                    >
                        <div className="role-icon">
                            <FontAwesomeIcon icon={faUserTie} />
                        </div>
                        <h3>Arrendador</h3>
                        <p>Ofrezco alojamiento para estudiantes</p>
                        {userType === 'arrendador' && <div className="selected-badge">✓ Seleccionado</div>}
                    </div>
                </div>
                
                {error && (
                    <div className="error-message">
                        <span className="error-icon">⚠</span>
                        {mensaje}
                    </div>
                )}
                
                <button className="in-button" onClick={handleSubmit}>
                    <span>Registrarse ahora</span>
                    <span className="arrow">→</span>
                </button>

                <div className="register-link">
                    ¿Ya tienes cuenta? <span onClick={() => navigate('/login')}>Inicia sesión aquí</span>
                </div>
                
                <div>
                    {showSucess && <SucessModal message={'Registro Exitoso.'} goToLogin={handleSuccessClose} />}
                </div>
            </div>
        </div>
    );
}

export default Signup;
