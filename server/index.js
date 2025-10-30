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

// === Configuración de CORS ===
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

// === Archivos estáticos ===
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// === Logging simple ===
app.use((req, _, next) => {
console.log(`${req.method} ${req.path}`);
next();
});

// === Rutas ===
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

// === Manejo de errores ===
app.use((_, res) => res.status(404).json({ error: 'Endpoint no encontrado' }));
app.use((err, _, res, __) => {
console.error('Error global:', err);
res.status(500).json({
    error: 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
});
});

// === Variables de entorno ===
const NODE_ENV = process.env.NODE_ENV || 'development';
const SSL_PORT = process.env.SSL_PORT || 3443;
const HTTP_PORT = process.env.PORT || process.env.SERVER_PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || '*';

// === Función para configurar socket.io ===
function setupSocket(server) {
const io = new Server(server, {
    cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"]
    }
});

const userSockets = new Map();

io.on("connection", (socket) => {
    console.log("🟢 Usuario conectado al chat:", socket.id);

    socket.on("register", (userId) => {
    if (!userId) return;
    console.log(`🔖 Registrando socket ${socket.id} para user ${userId}`);
    userSockets.set(String(userId), socket.id);
    socket.join(`user_${userId}`);
    });

    socket.on("enviar_mensaje", async (data) => {
    const { emisor_id, receptor_id, contenido } = data;
    try {
        console.log("📨 Mensaje recibido:", data);
        const insertId = await ChatModel.guardarMensaje(emisor_id, receptor_id, contenido);
        const nuevoMensaje = { id: insertId, emisor_id, receptor_id, contenido, fecha_envio: new Date() };

        // Confirmación al emisor
        socket.emit("mensaje_guardado", { success: true, id: insertId });

        // Emitir al receptor si está conectado
        const receptorSocketId = userSockets.get(String(receptor_id));
        if (receptorSocketId) {
        io.to(receptorSocketId).emit("nuevo_mensaje", nuevoMensaje);
        }

        // Emitir también al emisor (si tiene otra pestaña abierta)
        const emisorSocketId = userSockets.get(String(emisor_id));
        if (emisorSocketId && emisorSocketId !== socket.id) {
        io.to(emisorSocketId).emit("nuevo_mensaje", nuevoMensaje);
        }
    } catch (err) {
        console.error("❌ Error guardando mensaje:", err);
        socket.emit("mensaje_guardado", { success: false, error: err.message });
    }
    });

    socket.on("disconnect", () => {
    console.log("🔴 Usuario desconectado:", socket.id);
    for (const [userId, sId] of userSockets.entries()) {
        if (sId === socket.id) userSockets.delete(userId);
    }
    });
});
}

// === Servidor local con HTTPS (solo en desarrollo) ===
if (NODE_ENV === 'development') {
const privateKey = fs.readFileSync(path.join(__dirname, 'certs/key.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, 'certs/cert.pem'), 'utf8');
const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);
setupSocket(httpsServer);

httpsServer.listen(SSL_PORT, () => {
    console.log(`🔐 Servidor HTTPS activo en https://localhost:${SSL_PORT}`);
});

const redirectApp = express();
redirectApp.use((req, res) => {
    res.redirect(`https://localhost:${SSL_PORT}${req.url}`);
});

http.createServer(redirectApp).listen(HTTP_PORT, () => {
    console.log(`➡️ Redirigiendo HTTP (${HTTP_PORT}) → HTTPS (${SSL_PORT})`);
});

// === Servidor en producción (Render, Railway, etc.) ===
} else {
const server = http.createServer(app);
setupSocket(server);

server.listen(HTTP_PORT, () => {
    console.log(`🚀 Servidor HTTP activo en puerto ${HTTP_PORT}`);
});
}
