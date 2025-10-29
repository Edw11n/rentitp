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
  }
};

module.exports = { ChatModel };
