// middlewares/authMiddleware.js
const { verifyToken } = require('../utils/auth'); // Asume que tienes un utils/auth.js

module.exports = async (req, res, next) => {
    try {
        // Obtener el header de autorización y verificar su formato
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('Acceso no autorizado: No se proporcionó token');
            return res.status(401).json({ error: 'Acceso no autorizado: No se proporcionó token' });
        }
        const token = authHeader.split(' ')[1];

        // Verificar el token y decodificarlo
        const decoded = await verifyToken(token);
        if (!decoded || !decoded.id) {
            console.log('Token inválido o datos incompletos');
            return res.status(401).json({ error: 'Token inválido o datos incompletos' });
        }

        // Extraer y asignar únicamente los datos necesarios al request
        req.user = {
            id: decoded.id,
            email: decoded.email,  // Si se incluye en el token
            role: decoded.role     // Si se requiere para roles o permisos
        };

        next();
    } catch (error) {
        console.error('Error en authMiddleware:', error);
        res.status(401).json({ error: 'Token inválido o expirado' });
    }
};
