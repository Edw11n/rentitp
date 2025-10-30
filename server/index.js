// server/index.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');
const helmet = require('helmet');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();

// === SSL (si lo usas) ===
const privateKey = fs.readFileSync(path.join(__dirname, 'certs/key.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, 'certs/cert.pem'), 'utf8');
const credentials = { key: privateKey, cert: certificate };

// === Origin CORS permitido ===
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['*'];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Disposition'],
    credentials: true
}));

app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging
app.use((req, _, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Routes
const userRoutes = require('./routes/userRoutes');
const apartmentRoutes = require('./routes/apartmentRoutes');
const DocumentRoutes = require('./routes/DocumentRoutes');
const authRoutes = require('./routes/auth');
const statsRoutes = require('./routes/statsRoutes');
const chatRoutes = require('./chat/chatRoutes');
const { ChatModel } = require('./chat/chatModel');

app.use('/users', userRoutes);
app.use('/apartments', apartmentRoutes);
app.use('/documents', DocumentRoutes);
app.use('/auth', authRoutes);
app.use('/stats', statsRoutes);
app.use('/api/chat', chatRoutes);

// Error handling
app.use((_, res) => res.status(404).json({ error: 'Endpoint no encontrado' }));
app.use((err, _, res, __) => {
    console.error('Error global:', err);
    res.status(500).json({
        error: 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
});

// Ports
const SSL_PORT = process.env.SSL_PORT || 3443;
const HTTP_PORT = process.env.SERVER_PORT || 3001;

// HTTPS server
const httpsServer = https.createServer(credentials, app);

// Configure socket.io
const io = new Server(httpsServer, {
    cors: {
        origin: process.env.FRONTEND_URL || "*",
        methods: ["GET", "POST"]
    }
});

// map userId -> socketId (so we can target messages)
const userSockets = new Map();

io.on("connection", (socket) => {
    console.log("🟢 Usuario conectado al chat:", socket.id);

    // The client should emit 'register' with their user id right after connecting
    socket.on("register", (userId) => {
        if (!userId) return;
        console.log(`🔖 Registrando socket ${socket.id} para user ${userId}`);
        userSockets.set(String(userId), socket.id);
        // Optionally: join a room by user id
        socket.join(`user_${userId}`);
    });

    // Receive and persist message
    socket.on("enviar_mensaje", async (data) => {
        const { emisor_id, receptor_id, contenido } = data;
        try {
            console.log("📨 Mensaje recibido:", data);
            const insertId = await ChatModel.guardarMensaje(emisor_id, receptor_id, contenido);

            // confirmation to sender only
            socket.emit("mensaje_guardado", { success: true, id: insertId });

            const nuevoMensaje = { id: insertId, emisor_id, receptor_id, contenido, fecha_envio: new Date() };

            // emit to receptor if online
            const receptorSocketId = userSockets.get(String(receptor_id));
            if (receptorSocketId) {
                io.to(receptorSocketId).emit("nuevo_mensaje", nuevoMensaje);
            }

            // also emit to sender (in case other client windows are open)
            const emisorSocketId = userSockets.get(String(emisor_id));
            if (emisorSocketId && emisorSocketId !== socket.id) {
                io.to(emisorSocketId).emit("nuevo_mensaje", nuevoMensaje);
            }

            // Optionally: emit globally as fallback
            // io.emit("nuevo_mensaje", nuevoMensaje);
        } catch (err) {
            console.error("❌ Error guardando mensaje:", err);
            socket.emit("mensaje_guardado", { success: false, error: err.message });
        }
    });

    socket.on("disconnect", () => {
        console.log("🔴 Usuario desconectado:", socket.id);
        // remove from userSockets map if present
        for (const [userId, sId] of userSockets.entries()) {
            if (sId === socket.id) userSockets.delete(userId);
        }
    });
});

// Start HTTPS server
httpsServer.listen(SSL_PORT, () => {
    console.log(`🔐 Servidor HTTPS activo con chat en https://localhost:${SSL_PORT}`);
});

// Redirect HTTP -> HTTPS
const redirectApp = express();
redirectApp.use((req, res) => {
    res.redirect(`https://localhost:${SSL_PORT}${req.url}`);
});
http.createServer(redirectApp).listen(HTTP_PORT, () => {
    console.log(`➡️ Redirigiendo HTTP (${HTTP_PORT}) → HTTPS (${SSL_PORT})`);
});
