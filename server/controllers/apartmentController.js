const Apartment = require('../models/ApartmentModel');
const { unlink } = require('fs').promises;

exports.addApartment = async (req, res) => {
    try {
        // Obtener ID del usuario autenticado desde el token
        const userId = req.user.id;
        const { barrio, direccion, latitud, longitud, addInfo } = req.body;
        
        // Validación de campos requeridos
        const requiredFields = ['barrio', 'direccion', 'latitud', 'longitud'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                error: 'Campos requeridos faltantes',
                missing: missingFields
            });
        }

        // Crear apartamento asociado al usuario
        const apartment = await Apartment.addApartment({
            barrio,
            direccion,
            latitud,
            longitud,
            addInfo,
            userId
        });
        const apartmentId = apartment.insertId;

        // Procesar imágenes subidas, si existen
        if (req.files?.length > 0) {
            try {
                await Promise.all(
                    req.files.map(file => 
                        Apartment.addImage(
                            apartmentId, 
                            file.path.replace(/\\/g, '/') // Normalizar rutas para Windows
                        )
                    )
                );
            } catch (error) {
                // Rollback: Eliminar el apartamento y limpiar archivos en caso de error
                await Apartment.deleteApartment(apartmentId);
                throw error;
            }
        }

        res.status(201).json({
            message: 'Apartamento creado exitosamente',
            apartmentId,
            images: req.files?.map(file => file.path.replace(/\\/g, '/')) || []
        });
    } catch (error) {
        // Limpiar archivos subidos en caso de error
        if (req.files) {
            await Promise.all(
                req.files.map(file => 
                    unlink(file.path.replace(/\\/g, '/')).catch(() => {})
                )
            );
        }
        res.status(500).json({ 
            error: 'Error al agregar apartamento',
            ...(process.env.NODE_ENV === 'development' && { details: error.message })
        });
    }
};

exports.uploadImage = async (req, res) => {
    try {
        const { id_apt } = req.params;
        if (!req.files?.length) {
            return res.status(400).json({ error: 'No se han subido archivos' });
        }

        // Agregar imágenes a la BD, normalizando rutas
        const results = await Promise.allSettled(
            req.files.map(file => 
                Apartment.addImage(
                    id_apt, 
                    file.path.replace(/\\/g, '/') // Convertir a rutas tipo UNIX
                )
            )
        );

        const successful = results.filter(r => r.status === 'fulfilled');
        const failed = results.filter(r => r.status === 'rejected');

        const response = {
            message: `${successful.length} imagen(es) subida(s) correctamente`,
            uploadedPaths: successful.map(r => r.value),
            failed: failed.length,
            ...(failed.length > 0 && { errors: failed.map(f => f.reason.message) })
        };

        res.status(failed.length ? 207 : 200).json(response);
    } catch (error) {
        res.status(500).json({ 
            error: 'Error en el servidor',
            ...(process.env.NODE_ENV === 'development' && { details: error.message })
        });
    }
};

exports.updateApartment = async (req, res) => {
    try {
        const { id_apt } = req.params;
        let { direccion_apt, barrio, latitud_apt, longitud_apt, info_add_apt, existing_images } = req.body;
        const newImages = req.files || [];

        // Validación de campos requeridos
        const requiredFields = ['direccion_apt', 'barrio', 'latitud_apt', 'longitud_apt'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                error: 'Campos requeridos faltantes',
                missing: missingFields
            });
        }

        // Convertir existing_images a array si es una cadena
        const existingImagesArray = typeof existing_images === 'string'
            ? existing_images.split(',').map(img => img.trim()).filter(Boolean)
            : existing_images;

        // Actualizar datos principales del apartamento
        const updateResult = await Apartment.updateApartment(id_apt, { 
            direccion_apt, 
            barrio, 
            latitud_apt, 
            longitud_apt, 
            info_add_apt, 
            existing_images: existingImagesArray
        });

        // Procesar y agregar nuevas imágenes, si existen
        const imageResults = await Promise.allSettled(
            newImages.map(file => 
                Apartment.addImage(
                    id_apt, 
                    file.path.replace(/\\/g, '/')
                )
            )
        );

        res.json({
            message: 'Apartamento actualizado exitosamente',
            updatedFields: updateResult.affectedRows,
            newImages: {
                added: imageResults.filter(r => r.status === 'fulfilled').length,
                failed: imageResults.filter(r => r.status === 'rejected').length
            }
        });
    } catch (error) {
        // Limpiar archivos en caso de error
        if (req.files) {
            await Promise.all(req.files.map(file => 
                unlink(file.path.replace(/\\/g, '/')).catch(() => {})
            ));
        }
        res.status(500).json({ 
            error: 'Error al actualizar apartamento',
            ...(process.env.NODE_ENV === 'development' && { details: error.message })
        });
    }
};

exports.getApartmentsByLessor = async (req, res) => {
    try {
        // Obtenemos el id del usuario autenticado desde req.user
        const { id } = req.user;
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
        const userId = req.user.id;
        
        const result = await Apartment.deleteApartment(id_apt, userId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Apartamento no encontrado o no autorizado' });
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
