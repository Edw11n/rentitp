const jwt = require('jsonwebtoken');
const { verifyToken } = require('../utils/auth');

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.error('No se proporcionó un token de autorización');
            return res.status(401).json({ error: 'No se proporcionó un token válido' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        req.user = {
            id: decoded.user_id,
            email: decoded.user_email,
            role: decoded.rol_id
        };
        next();
    } catch (error) {
        console.error('Error en authMiddleware:', error);
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: 'Token expirado' });
        }
        res.status(401).json({ error: 'Token inválido' });
    }
};
