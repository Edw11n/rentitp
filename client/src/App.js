import React, { useState } from 'react';
import { UserProvider } from './contexts/UserContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SpeedInsights } from "@vercel/speed-insights/react"
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import Account from './components/Account';
import Join from './components/Join';
import ProtectedRoute from './contexts/ProtectedRoute';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';
import MyAccount from './pages/My-Account';

function App() {
    const [showJoin, setShowJoin] = useState(false);
    const [showAccount, setShowAccount] = useState(false);

    const toggleJoin = () => setShowJoin(prev => !prev);
    const toggleAccount = () => setShowAccount(prev => !prev);

    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <UserProvider>
                <Router>
                    <SpeedInsights />
                    <Navbar 
                        goToJoin={toggleJoin} // Cambia a la función de controlador
                        showAccount={showAccount}
                        setShowAccount={toggleAccount} // Cambia a la función de controlador
                    />
                    {showJoin && <Join onClose={toggleJoin} />}
                    {showAccount && <Account onClose={toggleAccount} />}
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/signup' element={<Signup />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path='/my-account' element={<MyAccount />} />
                    </Routes>
                </Router>
            </UserProvider>
        </GoogleOAuthProvider>
    );
}

export default App;
