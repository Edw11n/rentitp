const Apartment = require('../models/ApartmentModel');
const { unlink } = require('fs').promises;

exports.addApartment = async (req, res) => {
    try {
        const { barrio, direccion, latitud, longitud, addInfo, user_email } = req.body;
        
        if (!barrio || !direccion || !latitud || !longitud || !user_email) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        const apartment = await Apartment.addApartment({
            barrio,
            direccion,
            latitud,
            longitud,
            addInfo,
            user_email
        });

        const apartmentId = apartment.insertId;

        if (req.files?.length > 0) {
            try {
                await Promise.all(req.files.map(file => 
                    Apartment.addImage(apartmentId, file.path.replace(/\\/g, '/'))
                ));
            } catch (error) {
                await Apartment.deleteApartment(apartmentId);
                throw error;
            }
        }

        res.status(201).json({
            message: 'Apartamento creado exitosamente',
            apartmentId,
            imagesCount: req.files?.length || 0
        });

    } catch (error) {
        if (req.files) {
            await Promise.all(req.files.map(file => 
                unlink(file.path.replace(/\\/g, '/')).catch(() => {})
            ));
        }
        res.status(500).json({ 
            error: 'Error al agregar apartamento',
            details: error.message 
        });
    }
};

exports.uploadImage = async (req, res) => {
    try {
        const { id_apt } = req.params;
        
        if (!req.files?.length) {
            return res.status(400).json({ error: 'No se han subido archivos' });
        }

        const results = await Promise.allSettled(
            req.files.map(file => Apartment.addImage(id_apt, file.path.replace(/\\/g, '/')))
        );

        const successful = results.filter(r => r.status === 'fulfilled');
        const failed = results.filter(r => r.status === 'rejected');

        const response = {
            message: `${successful.length} imagen(es) subida(s) correctamente`,
            uploaded: successful.map(r => r.value),
            failed: failed.length,
            ...(failed.length > 0 && {
                errors: failed.map(f => f.reason.message)
            })
        };

        res.status(failed.length ? 207 : 200).json(response);

    } catch (error) {
        res.status(500).json({ 
            error: 'Error en el servidor',
            details: error.message 
        });
    }
};

exports.updateApartment = async (req, res) => {
    try {
        const { id_apt } = req.params;
        const { direccion_apt, barrio, latitud_apt, longitud_apt, info_add_apt, existing_images } = req.body;
        const newImages = req.files || [];

        if (!direccion_apt || !barrio || !latitud_apt || !longitud_apt) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        const updateResult = await Apartment.updateApartment(id_apt, { 
            direccion_apt, 
            barrio, 
            latitud_apt, 
            longitud_apt, 
            info_add_apt, 
            existing_images 
        });

        const imageResults = await Promise.allSettled(
            newImages.map(file => Apartment.addImage(id_apt, file.path.replace(/\\/g, '/')))
        );

        res.json({
            message: 'Apartamento actualizado exitosamente',
            updatedFields: updateResult.affectedRows,
            newImages: {
                success: imageResults.filter(r => r.status === 'fulfilled').length,
                failed: imageResults.filter(r => r.status === 'rejected').length
            }
        });

    } catch (error) {
        if (req.files) {
            await Promise.all(req.files.map(file => 
                unlink(file.path.replace(/\\/g, '/')).catch(() => {})
            ));
        }
        res.status(500).json({ 
            error: 'Error al actualizar apartamento',
            details: error.message 
        });
    }
};

exports.getApartmentsByLessor = async (req, res) => {
    try {
        const { id } = req.query;
        const results = await Apartment.getApartmentsByLessor(id);
        res.json(results);
    } catch (error) {
        console.error('Error obteniendo apartamentos:', error);
        res.status(500).json({ error: 'Error al obtener los apartamentos' });
    }
};

exports.deleteApartment = async (req, res) => {
    try {
        const { id_apt } = req.params;
        const result = await Apartment.deleteApartment(id_apt);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Apartamento no encontrado' });
        }
        
        res.json({ message: 'Apartamento eliminado exitosamente' });
    } catch (error) {
        console.error('Error eliminando apartamento:', error);
        res.status(500).json({ error: 'Error al eliminar el apartamento' });
    }
};

exports.getAllApartments = async (req, res) => {
    try {
        const results = await Apartment.getAllApartments();
        res.json(results);
    } catch (error) {
        console.error('Error obteniendo apartamentos:', error);
        res.status(500).json({ error: 'Error al obtener los apartamentos' });
    }
};

exports.getMarkersInfo = async (req, res) => {
    try {
        const results = await Apartment.getMarkersInfo();
        res.json(results);
    } catch (error) {
        console.error('Error obteniendo marcadores:', error);
        res.status(500).json({ error: 'Error al obtener los marcadores' });
    }
};