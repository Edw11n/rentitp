// Importación de módulos necesarios
const express = require('express'); // Framework para manejar rutas y peticiones HTTP
const router = express.Router(); // Router para agrupar y manejar rutas
const LessorController = require('../controllers/lessorController'); // Controlador para manejar la lógica de los arrendadores

// Rutas para la gestión de arrendadores

/**
 * Ruta para el registro de un nuevo arrendador.
 * Método: POST
 * Endpoint: /signup
 * Controlador: LessorController.signup
 * Descripción: Permite a los arrendadores registrarse en el sistema.
 */
router.post('/signup', LessorController.signup);

/**
 * Ruta para el inicio de sesión de un arrendador.
 * Método: POST
 * Endpoint: /login
 * Controlador: LessorController.login
 * Descripción: Permite a los arrendadores iniciar sesión en el sistema.
 */
router.post('/login', LessorController.login);

// Exportación del router para usarlo en la aplicación principal
module.exports = router;
