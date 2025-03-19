const db = require('../config/db');

class Apartment {
    static async addApartment(data) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Insertar barrio si no existe
            await connection.query(`
                INSERT INTO barrio (barrio)
                SELECT ? 
                WHERE NOT EXISTS (SELECT 1 FROM barrio WHERE barrio = ?)
            `, [data.barrio, data.barrio]);

            // Obtener ID del barrio
            const [barrioResults] = await connection.query(
                'SELECT id_barrio FROM barrio WHERE barrio = ?',
                [data.barrio]
            );

            // Obtener ID del usuario
            const [userResults] = await connection.query(
                'SELECT user_id FROM users WHERE user_email = ?',
                [data.user_email]
            );

            if (userResults.length === 0) {
                throw new Error('Usuario no encontrado');
            }

            // Insertar apartamento
            const [apartmentResult] = await connection.query(`
                INSERT INTO apartments 
                (id_barrio, direccion_apt, latitud_apt, longitud_apt, info_add_apt, user_id)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [
                barrioResults[0].id_barrio,
                data.direccion,
                data.latitud,
                data.longitud,
                data.addInfo || null,
                userResults[0].user_id
            ]);

            await connection.commit();
            return apartmentResult;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async addImage(id_apt, imagePath) {
        const [result] = await db.query(
            'INSERT INTO apartment_images (imagen, id_apt) VALUES (?, ?)',
            [imagePath, id_apt]
        );
        return result;
    }

    static async updateApartment(id_apt, data) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Insertar barrio si no existe
            await connection.query(`
                INSERT INTO barrio (barrio)
                SELECT ?
                WHERE NOT EXISTS (SELECT 1 FROM barrio WHERE barrio = ?)
            `, [data.barrio, data.barrio]);

            // Obtener ID del barrio
            const [barrioResults] = await connection.query(
                'SELECT id_barrio FROM barrio WHERE barrio = ?',
                [data.barrio]
            );

            // Actualizar apartamento
            const [updateResult] = await connection.query(`
                UPDATE apartments 
                SET direccion_apt = ?, 
                    id_barrio = ?, 
                    latitud_apt = ?, 
                    longitud_apt = ?, 
                    info_add_apt = ?
                WHERE id_apt = ?
            `, [
                data.direccion_apt,
                barrioResults[0].id_barrio,
                data.latitud_apt,
                data.longitud_apt,
                data.info_add_apt || null,
                id_apt
            ]);

            // Manejo de imágenes existentes
            if (typeof data.existing_images !== 'undefined') {
                const normalized = data.existing_images.replace(/\\/g, '/').trim();
                const images = normalized.split(',').map(img => img.trim()).filter(img => img);

                if (images.length === 0) {
                    await connection.query(
                        'DELETE FROM apartment_images WHERE id_apt = ?',
                        [id_apt]
                    );
                } else {
                    await connection.query(`
                        DELETE FROM apartment_images 
                        WHERE id_apt = ? 
                        AND TRIM(REPLACE(imagen, '\\\\', '/')) NOT IN (?)
                    `, [id_apt, [images]]);
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
    
    static async getApartmentsByLessor(user_id) {
        const [results] = await db.query(`
            SELECT 
                a.*, 
                b.barrio,
                GROUP_CONCAT(ai.imagen) AS images
            FROM apartments AS a
            LEFT JOIN barrio AS b ON a.id_barrio = b.id_barrio
            LEFT JOIN apartment_images AS ai ON a.id_apt = ai.id_apt
            WHERE a.user_id = ?
            GROUP BY a.id_apt
        `, [user_id]);
        return results;
    }

    

    static async deleteApartment(id_apt) {
        const [result] = await db.query(
            'DELETE FROM apartments WHERE id_apt = ?',
            [id_apt]
        );
        return result;
    }

    static async getAllApartments() {
        const [results] = await db.query(`
            SELECT
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
                GROUP_CONCAT(ai.imagen) AS images
            FROM
                apartments AS a
            LEFT JOIN barrio AS b ON a.id_barrio = b.id_barrio
            LEFT JOIN users AS u ON a.user_id = u.user_id
            LEFT JOIN apartment_images AS ai ON a.id_apt = ai.id_apt
            GROUP BY a.id_apt
        `);
        return results;
    }

    static async getMarkersInfo() {
        const [results] = await db.query(`
            SELECT
                a.id_apt AS id_apartamento,
                a.direccion_apt AS direccion_apartamento,
                b.barrio AS barrio_apartamento,
                a.latitud_apt AS latitud_apartamento,
                a.longitud_apt AS longitud_apartamento,
                a.info_add_apt AS info_adicional_apartamento
            FROM
                apartments AS a
            LEFT JOIN barrio AS b ON a.id_barrio = b.id_barrio
        `);
        return results;
    }
}

module.exports = Apartment;