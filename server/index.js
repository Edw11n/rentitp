// server/index.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');
const helmet = require('helmet');
const { Server } = require('socket.io');
// 💡 Nueva funcionalidad: Importación de base de datos
const importDatabase = require('./utils/importaDatabase');
// 💡 Nueva funcionalidad (requerida para verificar puertos en el arranque avanzado)
const net = require('net');
require('dotenv').config();

const app = express();

// === Configuración de CORS ===
// Se mantiene la lógica del primer archivo para manejar ALLOWED_ORIGINS de forma más flexible,
// pero se usa el formato del segundo archivo (FRONTEND_URL) para el socket.io
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : [process.env.FRONTEND_URL || '*']; // Se usa FRONTEND_URL como fallback para *

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

// === Variables de entorno y Puertos ===
const NODE_ENV = process.env.NODE_ENV || 'development';
const SSL_PORT = process.env.SSL_PORT || 3443;
const HTTP_PORT = process.env.PORT || process.env.SERVER_PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || '*'; // Usado para socket.io

// === Configuración HTTPS y Servidor ===
let httpsServer;

// El servidor HTTPS solo se configura si estamos en desarrollo
if (NODE_ENV === 'development') {
    try {
        const privateKey = fs.readFileSync(path.join(__dirname, 'certs/key.pem'), 'utf8');
        const certificate = fs.readFileSync(path.join(__dirname, 'certs/cert.pem'), 'utf8');
        const credentials = { key: privateKey, cert: certificate };
        httpsServer = https.createServer(credentials, app);
    } catch (err) {
        console.error("⚠️ Advertencia: No se pudo cargar certificados SSL. Cayendo a HTTP. (Crea la carpeta 'certs' con 'key.pem' y 'cert.pem' si quieres usar HTTPS)");
        httpsServer = http.createServer(app); // Usar HTTP como fallback
        // Si fallan los certificados, ajustamos los puertos para usar solo HTTP
        // (Esto es una simplificación; en un entorno real se manejaría distinto)
        // Por la estructura de inicio avanzado, mantendremos la lógica de HTTPS y saldrá error si no están los certificados.
        // Si deseas que inicie en HTTP cuando falle SSL, necesitarías una lógica más compleja en el inicio.
    }
} else {
    // En producción, usamos HTTP (o la plataforma de hosting se encarga del SSL)
    httpsServer = http.createServer(app);
}

// === Configuración de Socket.io (unificada y más limpia) ===
const io = new Server(httpsServer, {
    cors: {
        origin: FRONTEND_URL,
        methods: ["GET", "POST"]
    }
});

// map userId -> socketId (para enviar mensajes dirigidos)
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

            // Emitir también al emisor (si tiene otra pestaña/cliente abierta)
            const emisorSocketId = userSockets.get(String(emisor_id));
            if (emisorSocketId) { // No hace falta la comprobación != socket.id ya que el cliente lo recibe en 'mensaje_guardado'
                io.to(emisorSocketId).emit("nuevo_mensaje", nuevoMensaje);
            }
        } catch (err) {
            console.error("❌ Error guardando mensaje:", err);
            socket.emit("mensaje_guardado", { success: false, error: err.message });
        }
    });

    socket.on("disconnect", () => {
        console.log("🔴 Usuario desconectado:", socket.id);
        // Remover del mapa userSockets
        for (const [userId, sId] of userSockets.entries()) {
            if (sId === socket.id) userSockets.delete(userId);
        }
    });
});

// === Redirección HTTP -> HTTPS (solo si estamos en desarrollo) ===
const redirectApp = express();
redirectApp.use((req, res) => {
    res.redirect(`https://localhost:${SSL_PORT}${req.url}`);
});

// === Función para verificar si un puerto está en uso (Nueva funcionalidad) ===
function isPortInUse(port) {
    return new Promise((resolve) => {
        const server = net.createServer();
        server.once('error', (err) => {
            if (err.code === 'EADDRINUSE') resolve(true);
            else resolve(false);
        });
        server.once('listening', () => {
            server.close();
            resolve(false);
        });
        server.listen(port);
    });
}

// === Arranque Avanzado (Nueva funcionalidad unificada) ===
(async function start() {
    // El modo de inicio en producción (servidor HTTP simple) usa una lógica distinta,
    // pero la más robusta es la que verifica puertos e importa DB.
    // Usaremos esta lógica avanzada solo en desarrollo (donde se requiere HTTPS/redirección)
    if (NODE_ENV === 'development') {
        try {
            // 1. Verificar puertos
            const [httpsInUse, httpInUse] = await Promise.all([
                isPortInUse(SSL_PORT),
                isPortInUse(HTTP_PORT)
            ]);

            if (httpsInUse) {
                throw new Error(`Puerto HTTPS ${SSL_PORT} en uso. Detén otros servidores primero.`);
            }
            if (httpInUse) {
                throw new Error(`Puerto HTTP ${HTTP_PORT} en uso. Detén otros servidores primero.`);
            }

            // 2. Importar base de datos
            try {
                console.log('🔄 Importando base de datos...');
                await importDatabase();
            } catch (dbErr) {
                console.error('⚠️ Error importando base de datos:', dbErr.message);
                console.log('🚀 Continuando con el inicio del servidor...');
            }

            // 3. Iniciar servidores
            httpsServer.listen(SSL_PORT, () => {
                console.log(`🔐 Servidor HTTPS activo con chat en https://localhost:${SSL_PORT}`);
            });

            http.createServer(redirectApp).listen(HTTP_PORT, () => {
                console.log(`➡️ Redirigiendo HTTP (${HTTP_PORT}) → HTTPS (${SSL_PORT})`);
            });

        } catch (err) {
            console.error('❌ Error iniciando servidor:', err.message);
            process.exit(1);
        }
    } else {
        // Lógica de inicio simple para producción (uso del servidor HTTPS/HTTP creado arriba)
        httpsServer.listen(HTTP_PORT, () => {
            console.log(`🚀 Servidor activo en puerto ${HTTP_PORT}`);
        });
    }
})();