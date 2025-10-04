import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SucessModal from '../components/SuccessModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
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
            <FontAwesomeIcon icon={faTimes} className="exit-icon" onClick={goToHome} />
            
            <div className="visual-section">
                <div className="visual-content">
                    <h1>Únete a nuestra comunidad</h1>
                    <p>Encuentra o ofrece el alojamiento perfecto cerca de tu universidad</p>
                </div>
            </div>
            
            <div className="div-container">
                <div className="title">
                    <h2>Crea tu cuenta</h2>
                </div>
                <div className="google-login-container">
                        <GoogleLogin 
                            onSuccess={handleGoogleLogin}
                            onError={() => setMessage('Error en el login con Google')}
                        />
                        <p className="google-text">O</p>
                    </div>
                <div className="input-grid">
                    <div className="input-group">
                        <label>Nombre</label>
                        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    </div>
                    
                    <div className="input-group">
                        <label>Apellido</label>
                        <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} />
                    </div>
                    
                    <div className="input-group">
                        <label>Correo electrónico</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    
                    <div className="input-group">
                        <label>Teléfono</label>
                        <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                    </div>
                    
                    <div className="input-group">
                        <label>Contraseña</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    
                    <div className="input-group">
                        <label>Confirmar contraseña</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                </div>
                
                <div className="role-selector">
                    <div 
                        className={`role-card ${userType === 'usuario' ? 'selected' : ''}`}
                        onClick={() => setUserType('usuario')}
                    >
                        <h3>Usuario</h3>
                        <p>Busco alojamiento cerca de mi universidad</p>
                    </div>
                    
                    <div 
                        className={`role-card ${userType === 'arrendador' ? 'selected' : ''}`}
                        onClick={() => setUserType('arrendador')}
                    >
                        <h3>Arrendador</h3>
                        <p>Ofrezco alojamiento para estudiantes</p>
                    </div>
                </div>
                
                {error && <p className="error-message">{mensaje}</p>}
                
                <button className="in-button" onClick={handleSubmit}>Registrarse ahora</button>
                
                <div>
                    {showSucess && <SucessModal message={'Registro Exitoso.'} goToLogin={handleSuccessClose} />}
                </div>
            </div>
        </div>
    );
}

export default Signup;
