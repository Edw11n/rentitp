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
                JOIN users u ON a.user_id = u.user_id  -- arrendador+
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
            console.log("Resultados de la consulta:", results);
            return results; 
        } catch (error) {
            console.error("Error en Stats.getStats:", error); // Manejo de errores
            throw error;
        }
    }
    // Método para obtener el arrendador con más apartamentos publicados
    static async getTopLandlord() {
        try {
            const [results] = await db.query(
                `SELECT 
                    detalles_usuario.id_arrendador,
                    detalles_usuario.nombre_completo,
                    detalles_usuario.correo,
                    publicaciones.total_apartamentos_publicados
                FROM 
                (
                    SELECT 
                        u.user_id AS id_arrendador,
                        CONCAT(u.user_name, ' ', IFNULL(u.user_lastname, '')) AS nombre_completo,
                        u.user_email AS correo
                    FROM 
                        users u
                    WHERE 
                        EXISTS (
                            SELECT 1 
                            FROM apartments a 
                            WHERE a.user_id = u.user_id
                        )
                ) AS detalles_usuario
                JOIN 
                (
                    SELECT 
                        a.user_id AS id_arrendador,
                        COUNT(a.id_apt) AS total_apartamentos_publicados
                    FROM 
                        apartments a
                    GROUP BY 
                        a.user_id
                ) AS publicaciones
                ON 
                    detalles_usuario.id_arrendador = publicaciones.id_arrendador
                WHERE 
                    publicaciones.total_apartamentos_publicados = (
                        SELECT 
                            MAX(apartamentos_contados.total_apartamentos)
                        FROM 
                        (
                            SELECT 
                                user_id, COUNT(id_apt) AS total_apartamentos
                            FROM 
                                apartments
                            GROUP BY 
                                user_id
                        ) AS apartamentos_contados
                    );`
            );
            console.log("Arrendador/es con más apartamentos publicados:", results); // Para depuración
            return results; // Devuelve el resultado
        } catch (error) {
            console.error("Error en Stats.getTopLandlord:", error); // Manejo de errores
            throw error;
        }
    }
}

module.exports = Stats;  // Exporta el modelo para usarlo en otros archivos
