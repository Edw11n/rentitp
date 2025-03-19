const express = require('express');
const router = express.Router();
const DocumentController = require('../controllers/DocumentController');

// Endpoint para generar un documento PDF de un apartamento
router.get('/apartments/:id/document/pdf', DocumentController.generatePDF);

// Endpoint para generar un documento Excel de un apartamento
router.get('/apartments/:id/document/excel', DocumentController.generateExcel);

module.exports = router;