import React, { useState, useContext } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import './Styles/log.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const goToHome = () => {
        navigate('/');
    }

    const verifyLogin = async () => {
        if (!email || !password) {
            setMessage('Por favor rellene todos los campos');
            return;
        }

        try {
            const response = await Axios.post('http://localhost:3001/login', {
                email,
                password
            });

            const { Lessor_name, Lessor_lastname, Lessor_email, Lessor_phonenumber } = response.data;

            setUser({
                nombre: Lessor_name,
                apellido: Lessor_lastname,
                email: Lessor_email,
                telefono: Lessor_phonenumber
            });
            console.log('Login exitoso');
            goToHome();
        } catch (error) {
            console.error('Error en el login:', error.response ? error.response.data : error.message);
            setMessage('Correo o contraseña incorrectos');
        }
    }

    return (
        <div className="container">
            <div className="exit-icon" onClick={goToHome}>
                <FontAwesomeIcon icon={faTimes} />
            </div>
            <div className="div-container">
                <div className="title">
                    <h2>Inicia sesión en CampusHousing</h2>
                </div>
                <div className="form-container">
                    <div>
                        <input 
                            type="email" 
                            placeholder="Correo electrónico"
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            placeholder="Contraseña" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button onClick={verifyLogin}>Entrar</button>
                    {message && <p className="error-message">{message}</p>}
                </div>
            </div>
        </div>
    );
}

export default Login;
