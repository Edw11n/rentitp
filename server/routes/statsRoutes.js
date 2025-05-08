const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController'); // Importar el controlador de estadísticas
const authMiddleware = require('../middlewares/authMiddleware');



router.get('/get-user-top-apartment', authMiddleware, statsController.getUserTopApartment); // Ruta para obtener las estadísticas de un usuario
router.get('/get-top-landlord', statsController.getTopLandlord); // Ruta para obtener el arrendador con más apartamentos publicados
module.exports = router; // Exportar el router para usarlo en la aplicación principal