const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const apartmentRoutes = require('./routes/apartmentRoutes');
const DocumentRoutes = require('./routes/DocumentRoutes');
const authRoutes = require('./routes/auth');
const path = require('path');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Configuración mejorada de CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Disposition'],
    credentials: true
}));

// Middlewares de seguridad
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'", "https://accounts.google.com"],
                imgSrc: ["'self'", "data:"], // 🔥 Permite imágenes desde tu servidor y datos en base64
                scriptSrc: ["'self'"],
                objectSrc: ["'none'"],
            },
        },
    })
);
app.use(express.json({ limit: '10mb' }));  // Aumentar límite para posibles imágenes en base64
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos con cabeceras de seguridad
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res) => {
        res.set('X-Content-Type-Options', 'nosniff');
        res.set('Content-Security-Policy', "default-src 'self'");
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));

// Middleware de registro de solicitudes (opcional pero útil)
app.use((req, _, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Rutas principales
app.use('/users', userRoutes);
app.use('/apartments', apartmentRoutes);
app.use('/documents', DocumentRoutes);
app.use('/auth', authRoutes);

// Manejador para rutas no encontradas
app.use((_, res) => {
    res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Manejador centralizado de errores
app.use((err, _, res, __) => {
    console.error('Error global:', err);
    res.status(500).json({ 
        error: 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
});

const port = process.env.SERVER_PORT || 3001;
app.listen(port, () => {
    console.log(`🛠️ Servidor en ejecución en: http://localhost:${port}`);
    console.log(`⚙️ Entorno: ${process.env.NODE_ENV || 'development'}`);
});
