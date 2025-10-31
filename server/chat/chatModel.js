// server/chat/chatModel.js
const db = require("../config/db");

db.query(`
  CREATE TABLE IF NOT EXISTS mensajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    emisor_id INT NOT NULL,
    receptor_id INT NOT NULL,
    contenido TEXT NOT NULL,
    fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    leido BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (emisor_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receptor_id) REFERENCES users(user_id) ON DELETE CASCADE
  );
`).catch(err => {
  // La creación puede fallar si tabla users no existe todavía; solo logueamos.
  console.warn('Advertencia al crear tabla mensajes (si ya existía todo ok):', err.message);
});

const ChatModel = {
  async guardarMensaje(emisor_id, receptor_id, contenido) {
    const sql = `INSERT INTO mensajes (emisor_id, receptor_id, contenido) VALUES (?, ?, ?)`;
    const [result] = await db.query(sql, [emisor_id, receptor_id, contenido]);
    return result.insertId;
  },

  async obtenerConversacion(emisor_id, receptor_id) {
    const sql = `
      SELECT * FROM mensajes 
      WHERE (emisor_id = ? AND receptor_id = ?) 
        OR (emisor_id = ? AND receptor_id = ?)
      ORDER BY fecha_envio ASC
    `;
    const [rows] = await db.query(sql, [emisor_id, receptor_id, receptor_id, emisor_id]);
    return rows;
  },

  async obtenerConversacionesArrendador(arrendador_id) {
    // Normalizamos cada conversación por pareja (emisor, receptor) usando LEAST/GREATEST
    // para asegurar una única fila por conversación. Además, eliminamos el join con apartments
    // que generaba duplicados cuando el arrendador tenía varios apartamentos.
    const sql = `
      SELECT
        u.user_id AS usuario_id,
        u.user_name AS usuario_nombre,
        u.user_lastname AS usuario_apellido,
        u.user_email AS usuario_email,
        m2.contenido AS ultimo_mensaje,
        conv.ultimo_mensaje_fecha,
        (
          SELECT COUNT(*) FROM mensajes m3
          WHERE m3.emisor_id = u.user_id
            AND m3.receptor_id = ?
            AND m3.leido = FALSE
        ) AS mensajes_no_leidos
      FROM (
        SELECT
          CASE WHEN emisor_id = ? THEN receptor_id ELSE emisor_id END AS otro_id,
          MAX(fecha_envio) AS ultimo_mensaje_fecha,
          MAX(id) AS ultimo_mensaje_id,
          LEAST(emisor_id, receptor_id) AS p1,
          GREATEST(emisor_id, receptor_id) AS p2
        FROM mensajes
        WHERE emisor_id = ? OR receptor_id = ?
        GROUP BY LEAST(emisor_id, receptor_id), GREATEST(emisor_id, receptor_id)
      ) AS conv
      INNER JOIN users u ON u.user_id = conv.otro_id
      INNER JOIN mensajes m2 ON m2.id = conv.ultimo_mensaje_id
      ORDER BY conv.ultimo_mensaje_fecha DESC
    `;
    const [rows] = await db.query(sql, [
      arrendador_id,
      arrendador_id,
      arrendador_id, arrendador_id
    ]);
    return rows;
  }
};

module.exports = { ChatModel };
