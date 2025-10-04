const db = require('../config/db');
const path = require('path');
const { unlink } = require('fs').promises;
const { decryptImage } = require('../utils/encryption');
const fs = require('fs/promises');

class Apartment {
    static async addApartment(data) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Insertar (o asegurarse de que exista) el barrio
            await connection.query(
                `INSERT INTO barrio (barrio)
                    SELECT ? 
                    WHERE NOT EXISTS (SELECT 1 FROM barrio WHERE barrio = ?)`,
                [data.barrio, data.barrio]
            );

            // 2. Obtener el ID del barrio
            const [barrioResults] = await connection.query(
                'SELECT id_barrio FROM barrio WHERE barrio = ?',
                [data.barrio]
            );

            // 3. Insertar apartamento usando el ID del usuario (viene del middleware de autenticación)
            const [apartmentResult] = await connection.query(
                `INSERT INTO apartments 
                    (id_barrio, direccion_apt, latitud_apt, longitud_apt, info_add_apt, user_id)
                    VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    barrioResults[0].id_barrio,
                    data.direccion,
                    data.latitud,
                    data.longitud,
                    data.addInfo || null,
                    data.userId
                ]
            );

            await connection.commit();
            return apartmentResult;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async addImage(id_apt, imagePath, iv) {
        console.log('IV de la imagen en modelo:', iv);
        const connection = await db.getConnection();
        try {
            const normalizedPath = imagePath.replace(/\\/g, '/');
            const [result] = await connection.query(
                'INSERT INTO apartment_images (imagen, iv, id_apt) VALUES (?, ?, ?)',
                [normalizedPath, iv, id_apt]
            );
            return result;
        } finally {
            connection.release();
        }
    }

    static async updateApartment(id_apt, data) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Actualizar (o insertar) el barrio
            await connection.query(
                `INSERT INTO barrio (barrio)
                    SELECT ?
                    WHERE NOT EXISTS (SELECT 1 FROM barrio WHERE barrio = ?)`,
                [data.barrio, data.barrio]
            );

            const [barrioResults] = await connection.query(
                'SELECT id_barrio FROM barrio WHERE barrio = ?',
                [data.barrio]
            );

            // 2. Actualizar los datos del apartamento
            const [updateResult] = await connection.query(
                `UPDATE apartments 
                    SET direccion_apt = ?, 
                        id_barrio = ?, 
                        latitud_apt = ?, 
                        longitud_apt = ?, 
                        info_add_apt = ?
                    WHERE id_apt = ?`,
                [
                    data.direccion_apt,
                    barrioResults[0].id_barrio,
                    data.latitud_apt,
                    data.longitud_apt,
                    data.info_add_apt || null,
                    id_apt
                ]
            );

            // 3. Manejo de imágenes existentes
            if (data.existing_images) {
                // Obtener las imágenes actuales de la BD
                const [currentRows] = await connection.query(
                    'SELECT imagen FROM apartment_images WHERE id_apt = ?',
                    [id_apt]
                );
                const currentImages = currentRows.map(row => row.imagen);

                // Normalizar las rutas recibidas
                const imagesToKeep = data.existing_images.map(img => img.replace(/\\/g, '/').trim());
                // Determinar qué imágenes deben eliminarse (las que ya no están en la lista de las existentes)
                const imagesToDelete = currentImages.filter(img => !imagesToKeep.includes(img));

                if (imagesToDelete.length > 0) {
                    // Eliminar registros de la BD
                    await connection.query(
                        'DELETE FROM apartment_images WHERE id_apt = ? AND imagen IN (?)',
                        [id_apt, imagesToDelete]
                    );
                    // Eliminar archivos físicos
                    await Promise.all(
                        imagesToDelete.map(async (imgPath) => {
                            try {
                                const fullPath = path.join(__dirname, '../', imgPath);
                                console.log('Eliminando archivo:', fullPath);
                                await unlink(fullPath);
                            } catch (error) {
                                console.error(`Error eliminando archivo ${imgPath}:`, error);
                            }
                        })
                    );
                }
            }

            await connection.commit();
            return updateResult;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getApartmentImages(id_apt) {
        const connection = await db.getConnection();
        try {
            const [rows] = await connection.query(
                'SELECT id_img, imagen, iv FROM apartment_images WHERE id_apt = ?',
                [id_apt]
            );
            return rows;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }


    static async getApartmentsByLessor(user_id) {
        const [results] = await db.query(
            `SELECT 
                a.*, 
                b.barrio,
                GROUP_CONCAT(CONCAT(ai.iv, ':', ai.imagen)) AS images
            FROM apartments AS a
            LEFT JOIN barrio AS b ON a.id_barrio = b.id_barrio
            LEFT JOIN apartment_images AS ai ON a.id_apt = ai.id_apt
            WHERE a.user_id = ?
            GROUP BY a.id_apt`,
            [user_id]
        );
        const processedResults = await Promise.all(
            results.map(
                async apartment => {
                    if (apartment.images) {
                        const imageStrings = apartment.images.split(',');
                        const decryptedImages = await Promise.all(
                            imageStrings.map(async imgStr => {
                                const parts = imgStr.split(':');
                                if (parts.length !== 2) {
                                    console.error(`Formato de imagen inválido: ${imgStr}`);
                                    return null;
                                }
                                const [iv, imagePath] = parts;
                                try {
                                    const encryptedBuffer = await fs.readFile(imagePath);
                                    const encryptedHex = encryptedBuffer.toString('hex');
                                    console.log('IV para desencriptar:', iv);
                                    const decryptedBuffer = decryptImage(iv, encryptedHex);
                                    return `data:image/webp;base64,${decryptedBuffer.toString('base64')}`;
                                } catch (error) {
                                    console.error(`Error al leer o desencriptar la imagen: (${imagePath}) `, error);
                                    return null;
                                }
                            }));
                        apartment.images = decryptedImages.filter(img=> img !== null);
                    }
                    return apartment;
                }));
        return processedResults;
    }

    static async deleteApartment(id_apt, userId) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
    
            // 1. Obtener las imágenes asociadas al apartamento
            const [rows] = await connection.query(
                'SELECT imagen FROM apartment_images WHERE id_apt = ?',
                [id_apt]
            );
            const images = rows.map(row => row.imagen);
    
            // 2. Eliminar el registro del apartamento sólo si pertenece al usuario autenticado
            const [result] = await connection.query(
                'DELETE FROM apartments WHERE id_apt = ? AND user_id = ?',
                [id_apt, userId]
            );
    
            // Si no se eliminó ningún registro, el apartamento no existe o no pertenece al usuario
            if (result.affectedRows === 0) {
                await connection.rollback();
                return result;
            }
    
            // 3. Eliminar los archivos físicos asociados
            await Promise.all(
                images.map(async (imgPath) => {
                    try {
                        // Usamos process.cwd() para obtener la raíz del proyecto y unir la ruta almacenada
                        const filePath = path.join(process.cwd(), imgPath);
                        await unlink(filePath);
                    } catch (error) {
                        console.error(`Error eliminando archivo ${imgPath}:`, error);
                    }
                })
            );
    
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getAllApartments() {
        const [results] = await db.query(
            `SELECT
                a.id_apt,
                a.direccion_apt,
                a.latitud_apt,
                a.longitud_apt,
                a.info_add_apt,
                b.barrio,
                u.user_id,
                u.user_name,
                u.user_lastname,
                u.user_email,
                u.user_phonenumber,
                GROUP_CONCAT(CONCAT(ai.iv, ':', ai.imagen)) AS images
            FROM apartments AS a
            LEFT JOIN barrio AS b ON a.id_barrio = b.id_barrio
            LEFT JOIN users AS u ON a.user_id = u.user_id
            LEFT JOIN apartment_images AS ai ON a.id_apt = ai.id_apt
            GROUP BY a.id_apt`
        );
        const processedResults = await Promise.all(
            results.map(
                async apartment => {
                    if (apartment.images) {
                        const imageStrings = apartment.images.split(',');
                        const decryptedImages = await Promise.all(
                            imageStrings.map(async imgStr => {
                                const parts = imgStr.split(':');
                                if (parts.length !== 2) {
                                    console.error(`Formato de imagen inválido: ${imgStr}`);
                                    return null;
                                }
                                const [iv, imagePath] = parts;
                                try {
                                    const encryptedBuffer = await fs.readFile(imagePath);
                                    const encryptedHex = encryptedBuffer.toString('hex');
                                    console.log('IV para desencriptar:', iv);
                                    const decryptedBuffer = decryptImage(iv, encryptedHex);
                                    return `data:image/webp;base64,${decryptedBuffer.toString('base64')}`;
                                } catch (error) {
                                    console.error(`Error al leer o desencriptar la imagen: (${imagePath}) `, error);
                                    return null;
                                }
                            }));
                        apartment.images = decryptedImages.filter(img=> img !== null);
                    }
                    return apartment;
                }));
        return processedResults;
    }

    static async getMarkersInfo() {
        const [results] = await db.query(
            `SELECT
                a.id_apt AS id_apartamento,
                a.direccion_apt AS direccion_apartamento,
                b.barrio AS barrio_apartamento,
                a.latitud_apt AS latitud_apartamento,
                a.longitud_apt AS longitud_apartamento,
                a.info_add_apt AS info_adicional_apartamento
            FROM apartments AS a
            LEFT JOIN barrio AS b ON a.id_barrio = b.id_barrio`
        );
        return results;
    }
}

module.exports = Apartment;
