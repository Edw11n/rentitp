import React, { useState, useEffect } from 'react';
import { UserProvider } from './contexts/UserContext';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { SpeedInsights } from "@vercel/speed-insights/react";
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import Account from './components/Account';
import Join from './components/Join';
import Toast from './components/Toast';
import ProtectedRoute from './contexts/ProtectedRoute';
import { GoogleOAuthProvider } from '@react-oauth/google';
import MyAccount from './pages/My-Account';
import './App.css'; // Para animaciones o personalizaciones extra

function AppContent() {
  const [showJoin, setShowJoin] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showLogoutToast, setShowLogoutToast] = useState(false);
  const location = useLocation();

  const toggleJoin = () => setShowJoin(prev => !prev);
  const toggleAccount = () => setShowAccount(prev => !prev);
  const handleLogoutSuccess = () => {
    setShowAccount(false);
    setShowLogoutToast(true);
  };

  // Cerrar el popup de Account cada vez que cambie la ruta
  useEffect(() => {
    setShowAccount(false);
    setShowJoin(false);
  }, [location.pathname]);

  return (
    <>
      <SpeedInsights />

      {/* Navbar */}
      <Navbar 
        goToJoin={toggleJoin}
        showAccount={showAccount}
        setShowAccount={toggleAccount}
      />

      {/* Modals */}
      {showJoin && <Join onClose={toggleJoin} />}
      {showAccount && <Account onClose={toggleAccount} onLogoutSuccess={handleLogoutSuccess} />}
      
      {/* Notificación de logout */}
      {showLogoutToast && (
        <Toast 
          message="Sesión cerrada exitosamente" 
          type="success" 
          onClose={() => setShowLogoutToast(false)} 
        />
      )}

      {/* Main Routes */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path='/my-account' element={<MyAccount />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <UserProvider>
        <Router>
          <AppContent />
        </Router>
      </UserProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
