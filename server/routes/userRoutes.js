// Importación de módulos necesarios
const express = require('express'); // Framework para manejar rutas y peticiones HTTP
const router = express.Router(); // Router para agrupar y manejar rutas
const userController = require('../controllers/userController'); // Controlador para manejar la lógica de los arrendadores
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware para manejar autenticación

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.put('/update', authMiddleware, userController.updateUserData);
router.get('/getUser', authMiddleware, userController.getUserData);

// Exportación del router para usarlo en la aplicación principal
module.exports = router;
