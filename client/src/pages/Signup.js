import React, { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './Styles/log.css'; // Asegúrate de que la ruta a tu archivo CSS sea correcta

function Signup() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(true);
      setMensaje("Las contraseñas no coinciden");
      return;
    }

    try {
      // Lógica para registrar al usuario
      await Axios.post("http://localhost:3001/signup", {
        nombre,
        apellido,
        email,
        telefono,
        password,
      });
      navigate("/"); // Redirigir a la página de inicio
    } catch (error) {
      setMensaje("Hubo un error registrando los datos");
      console.error(error);
    }
  };

  return (
    <div className="container">
      <FontAwesomeIcon icon={faTimes} className="exit-icon" onClick={() => navigate("/")} />
      <div className="div-container">
        <div className="title">
          <h2>Regístrate</h2>
        </div>
          <input
            type="text"
            placeholder="Nombre"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            type="text"
            placeholder="Apellido"
            required
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Teléfono"
            required
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button onClick={handleSubmit}>Registrarse</button>
          {error && <p style={{ color: 'red' }}>{mensaje}</p>}
        {mensaje && <p className="message">{mensaje}</p>}
      </div>
    </div>
  );
}

export default Signup;
