// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../utils/auth'); // Asume que tienes un utils/auth.js

module.exports = async (req, res, next) => {
    try {
        // Obtener el token del header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Acceso no autorizado' });
        }

        // Verificar el token
        const decoded = await verifyToken(token);
        req.user = decoded; // Agregar datos del usuario al request
        next();
    } catch (error) {
        console.error('Error en authMiddleware:', error);
        res.status(401).json({ error: 'Token inválido o expirado' });
    }
};