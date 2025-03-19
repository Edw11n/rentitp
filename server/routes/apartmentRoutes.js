const express = require('express');
const router = express.Router();
const { upload, validateFiles } = require('../middlewares/fileUpload');
const ApartmentController = require('../controllers/apartmentController');

// Rutas con middlewares aplicados
router.post('/uploadImage/:id_apt', 
    upload.array('images'),
    validateFiles,
    ApartmentController.uploadImage
);

router.post('/addApartment', 
    upload.array('images'),
    validateFiles,
    ApartmentController.addApartment
);

router.put('/update/:id_apt', 
    upload.array("new_images"),
    validateFiles,
    ApartmentController.updateApartment
);

// Rutas sin manejo de archivos
router.get('/manage', ApartmentController.getApartmentsByLessor);
router.delete('/delete/:id_apt', ApartmentController.deleteApartment);
router.get('/getapts', ApartmentController.getAllApartments);
router.get('/getMarkersInfo', ApartmentController.getMarkersInfo);

module.exports = router;