// src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './UserContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(UserContext);

    // Si no hay usuario, redirige a /login
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    if (user.rolId === 1){
        return <Navigate to="/" replace />;
    }
    // Si hay usuario, renderiza los hijos (la ruta protegida)
    return children;
};

export default ProtectedRoute;
