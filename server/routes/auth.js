const express = require('express');
const router = express.Router();
const { verifyToken, generateAccessToken } = require('../utils/auth');
const {googleLogin} = require('../controllers/authController');

router.post('/refresh-token', (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ error: 'Token de refresco no proporcionado' });
    }
    try {
        const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
        const newAccesToken = generateAccessToken({ id: decoded.id, role: decoded.role });
        res.json({ accessToken: newAccesToken });
    } catch (error) {
        console.error('Error refrescando token:', error);
        res.status(401).json({ error: 'Token de refresco inválido o expirado' });
    }
});
router.get('/logout', (req, res) => {
    req.logout(() => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error cerrando sesión:', err);
                return res.status(500).json({ error: 'No se pudo cerrar sesión' });
            }
            res.json({ message: 'Sesión cerrada correctamente' });
        });
    });
});

router.post('/google', googleLogin)

module.exports = router;