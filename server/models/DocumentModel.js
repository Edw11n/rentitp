const db = require('../config/db');

class Document {
    static async getApartmentById(id) {
        try {
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
                FROM apartments AS a
                LEFT JOIN barrio AS b ON a.id_barrio = b.id_barrio
                LEFT JOIN users AS u ON a.user_id = u.user_id
                LEFT JOIN apartment_images AS ai ON a.id_apt = ai.id_apt
                WHERE a.id_apt = ?
                GROUP BY a.id_apt
            `, [id]);

            return results[0] || null;
            
        } catch (error) {
            console.error('Error en getApartmentById:', error);
            throw new Error('Error al obtener los datos del apartamento');
        }
    }
}

module.exports = Document;