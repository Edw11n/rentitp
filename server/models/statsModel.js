const db = require('../config/db');

class Stats {
    // Método para obtener estadísticas de los apartamentos
    static async getStats(userId) {
        try {
            const [results] = await db.query(
                `SELECT 
                    u.user_name AS arrendador_nombre,
                    u.user_lastname AS arrendador_apellido,
                    a.id_apt,
                    a.direccion_apt,
                    b.barrio,
                    TIMESTAMPDIFF(MONTH, ua.start_date, IFNULL(ua.end_date, CURDATE())) + 1 AS meses_arrendado,
                    DATE_FORMAT(ua.start_date, '%Y-%m') AS inicio_arrendamiento,
                    DATE_FORMAT(IFNULL(ua.end_date, CURDATE()), '%Y-%m') AS fin_arrendamiento,
                    u2.user_name AS inquilino_nombre,
                    u2.user_lastname AS inquilino_apellido,
                    u2.user_email AS inquilino_email
                FROM apartments a
                JOIN user_apartment ua ON a.id_apt = ua.id_apt
                JOIN users u ON a.user_id = u.user_id  -- arrendador
                JOIN users u2 ON ua.id_user = u2.user_id  -- inquilino
                JOIN barrio b ON a.id_barrio = b.id_barrio
                WHERE a.user_id = ?  -- Filtrando por el user_id del arrendador
                GROUP BY a.id_apt, u.user_id, a.direccion_apt, b.barrio, ua.start_date, ua.end_date, u2.user_id
                HAVING meses_arrendado = (
                    SELECT MAX(TIMESTAMPDIFF(MONTH, start_date, IFNULL(end_date, CURDATE())) + 1)
                    FROM user_apartment 
                    WHERE id_apt = a.id_apt
                )
                AND ua.start_date = (
                    SELECT MAX(start_date)
                    FROM user_apartment
                    WHERE id_apt = a.id_apt
                    AND TIMESTAMPDIFF(MONTH, start_date, IFNULL(end_date, CURDATE())) + 1 = meses_arrendado
                )
                ORDER BY ua.start_date DESC;`, // Solo traer el arrendamiento más largo y reciente
                [userId] // Pasa el userId del arrendador
            );
            console.log("Resultados de la consulta:", results); // Para depuración
            return results; // Devuelve los resultados obtenidos de la consulta
        } catch (error) {
            console.error("Error en Stats.getStats:", error); // Manejo de errores
            throw error;
        }
    }
}

module.exports = Stats;  // Exporta el modelo para usarlo en otros archivos
