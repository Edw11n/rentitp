// server/chat/chatRoutes.js
const express = require("express");
const { ChatController } = require("./chatController");
const router = express.Router();

router.get("/:emisor_id/:receptor_id", ChatController.obtenerConversacion);

module.exports = router;
