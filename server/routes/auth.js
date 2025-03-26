const express = require('express');
const router = express.Router();
const { verifyToken, generateAccessToken } = require('../utils/auth');
const { googleLogin } = require('../controllers/authController');
const passport = require('passport');

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
router.get('/google', 
    passport.authenticate('google', 
        { scope: ['profile', 'email'] }
    )
);
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Error en la autenticación' });
        }

        const accessToken = generateAccessToken({ id: req.user.user_id, role: req.user.rol_id });

        res.json({ 
            message: 'Inicio de sesión exitoso',
            accessToken,
            user: {
                id: req.user.user_id,
                name: req.user.user_name,
                email: req.user.user_email,
                role: req.user.rol_id
            }
        });
    }
);
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