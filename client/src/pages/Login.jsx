import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../apis/loginController";
import { googleLogin } from "../apis/googleAuthController";
import { UserContext } from "../contexts/UserContext";
import { GoogleLogin } from "@react-oauth/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEnvelope, faLock, faHome, faShieldAlt, faUserCheck, faBolt } from "@fortawesome/free-solid-svg-icons";

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
    <div className="min-h-screen grid lg:grid-cols-[1fr_1.2fr] grid-cols-1 items-center bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-500 relative overflow-hidden">
      
      {/* Animated background effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Exit Button */}
      <button
        onClick={goToHome}
        className="fixed top-24 right-8 w-12 h-12 rounded-full cursor-pointer text-white bg-indigo-600/80 backdrop-blur-md z-50 hover:bg-indigo-700 hover:rotate-90 hover:scale-110 transition-all duration-300 flex items-center justify-center border-2 border-white/50 shadow-xl"
        aria-label="Volver al inicio"
      >
        <FontAwesomeIcon icon={faTimes} className="text-xl font-bold" />
      </button>

      {/* Visual Section - Ahora a la izquierda */}
      <div className="hidden lg:flex h-screen bg-white/8 backdrop-blur-md items-center justify-center px-12 relative">
        <div className="text-white max-w-xl space-y-8 animate-fadeInUp">
          {/* Icon */}
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-lg border-2 border-white/30 mb-6">
            <FontAwesomeIcon icon={faHome} className="text-4xl text-white" />
          </div>

          <h1 className="text-5xl font-bold leading-tight">
            Tu comunidad te espera
          </h1>
          <p className="text-white/90 text-xl leading-relaxed">
            Conecta con la mejor opción de alojamiento estudiantil de forma rápida y segura
          </p>

          {/* Features */}
          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                <FontAwesomeIcon icon={faShieldAlt} className="text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Acceso Seguro</h3>
                <p className="text-white/80 text-sm">Tus datos están protegidos</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                <FontAwesomeIcon icon={faUserCheck} className="text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Verificado</h3>
                <p className="text-white/80 text-sm">Propietarios y propiedades verificadas</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                <FontAwesomeIcon icon={faBolt} className="text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Rápido y Fácil</h3>
                <p className="text-white/80 text-sm">Encuentra tu hogar en minutos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Container - Ahora a la derecha */}
      <div className="bg-gradient-to-br from-white to-gray-50 backdrop-blur-lg h-screen flex flex-col justify-center px-8 lg:px-16 shadow-2xl relative">
        <div className="max-w-md mx-auto w-full space-y-6">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-3">
              ¡Bienvenido de vuelta! 👋
            </h2>
            <p className="text-gray-500 text-base">
              Inicia sesión para continuar tu búsqueda
            </p>
          </div>

          {/* Google Login */}
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setMessage("Error en el login con Google")}
            />
          </div>

          {/* Separator */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-4 text-gray-400 text-sm font-medium">O inicia con tu email</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-gray-700 text-sm font-semibold flex items-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-indigo-500" />
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all hover:border-gray-300 bg-white"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-700 text-sm font-semibold flex items-center gap-2">
                <FontAwesomeIcon icon={faLock} className="text-indigo-500" />
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all hover:border-gray-300 bg-white"
              />
            </div>

            {/* Error Message */}
            {message && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 flex items-center gap-2 animate-shake">
                <span className="text-red-600 text-lg">⚠</span>
                <p className="text-red-600 font-semibold text-sm">{message}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-bold rounded-xl uppercase tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group mt-6"
            >
              <span>Acceder a mi cuenta</span>
              <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
            </button>

            {/* Register Link */}
            <p className="text-gray-500 text-center pt-4">
              ¿No tienes cuenta?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-indigo-600 font-semibold cursor-pointer hover:text-indigo-800 hover:underline transition-colors"
              >
                Regístrate aquí
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
