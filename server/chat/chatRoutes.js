// server/chat/chatRoutes.js
const express = require("express");
const { ChatController } = require("./chatController");
const router = express.Router();

// IMPORTANT: Define specific routes BEFORE generic param routes to avoid conflicts
router.get("/conversaciones/:arrendador_id", ChatController.obtenerConversacionesArrendador);
router.get("/:emisor_id/:receptor_id", ChatController.obtenerConversacion);

module.exports = router;
