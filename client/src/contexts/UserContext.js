import React, { createContext, useState, useEffect } from 'react';

// Crear el contexto
export const UserContext = createContext();

// Proveedor del contexto
export const UserProvider = ({ children }) => {
    // Inicializar el estado a partir del localStorage, si existe
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = (userData) => {
        setUser(userData);
        // Guardar en localStorage para persistencia
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    // Opcional: actualizar localStorage si el user cambia
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
