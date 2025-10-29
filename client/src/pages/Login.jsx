import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../apis/loginController";
import { googleLogin } from "../apis/googleAuthController";
import { UserContext } from "../contexts/UserContext";
import { GoogleLogin } from "@react-oauth/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const goToHome = () => navigate("/");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await loginUser({ email, password, login });
    if (result.success) goToHome();
    else setMessage(result.message);
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const credential = credentialResponse?.credential;
      if (!credential) return setMessage("No se recibió token de Google");

      const result = await googleLogin({ token: credential, login });
      if (result.success) goToHome();
      else setMessage(result.message);
    } catch {
      setMessage("Error en el login con Google");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.2fr_1fr] grid-cols-1 items-center bg-gradient-to-br from-indigo-700 to-indigo-400 relative">

      {/* Exit Button */}
      <FontAwesomeIcon
        icon={faTimes}
        className="fixed top-32 right-8 w-10 h-10 p-4 rounded-full cursor-pointer text-white bg-white/10 backdrop-blur-sm z-50 hover:bg-white/20 hover:rotate-90 hover:scale-110 transition-all duration-300"
        onClick={goToHome}
      />

      {/* Form Container */}
      <div className="bg-white/95 backdrop-blur-lg h-screen flex flex-col justify-center px-6 lg:px-20 shadow-lg lg:shadow-[20px_0_40px_rgba(0,0,0,0.05)]">
        <div className="text-center lg:text-left mb-8 max-w-md w-full mx-auto lg:mx-0">
          <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-4">
            Bienvenido de vuelta
          </h2>

          {/* Google Login */}
          <div className="my-4 w-full max-w-sm mx-auto flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setMessage("Error en el login con Google")}
            />
          </div>

          {/* Separador "O" limpio */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-4 text-gray-400 text-sm">O</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Texto de credenciales */}
          <p className="text-gray-400 text-sm mb-6">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        {/* Inputs */}
        <div className="max-w-md mx-auto w-full space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-gray-600 text-sm font-medium">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-lg text-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-600 text-sm font-medium">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-lg text-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full p-4 bg-gradient-to-br from-indigo-700 to-indigo-400 text-white font-semibold rounded-lg uppercase tracking-wider mt-4 mb-2 hover:-translate-y-1 hover:shadow-lg transition-all"
          >
            Acceder a mi cuenta
          </button>

          {message && <p className="text-red-500 text-center font-medium">{message}</p>}

          <p className="text-gray-400 text-center mt-4">
            ¿No tienes cuenta?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-indigo-700 font-medium cursor-pointer hover:text-indigo-900 hover:underline ml-1"
            >
              Regístrate aquí
            </span>
          </p>
        </div>
      </div>

      {/* Visual Section */}
      <div className="hidden lg:flex h-screen bg-white/5 backdrop-blur-lg border-l border-white/10 items-center justify-center px-8">
        <div className="text-white max-w-lg text-center lg:text-left">
          <h1 className="text-3xl lg:text-4xl font-semibold mb-4">Tu comunidad te espera</h1>
          <p className="text-white/90 text-lg">
            Conecta con la mejor opción de alojamiento estudiantil
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
