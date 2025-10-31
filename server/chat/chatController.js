// server/chat/chatController.js
const { ChatModel } = require("./chatModel");

const ChatController = {
  async obtenerConversacion(req, res) {
    try {
      const { emisor_id, receptor_id } = req.params;
      const mensajes = await ChatModel.obtenerConversacion(emisor_id, receptor_id);
      res.json(mensajes);
    } catch (error) {
      console.error("Error al obtener conversación:", error);
      res.status(500).json({ message: "Error al obtener la conversación" });
    }
  },

  async obtenerConversacionesArrendador(req, res) {
    try {
      const { arrendador_id } = req.params;
      const conversaciones = await ChatModel.obtenerConversacionesArrendador(arrendador_id);
      res.json(conversaciones);
    } catch (error) {
      console.error("Error al obtener conversaciones del arrendador:", error);
      res.status(500).json({ message: "Error al obtener las conversaciones" });
    }
  }
};

module.exports = { ChatController };
