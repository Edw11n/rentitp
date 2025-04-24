const express = require('express');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');
const helmet = require('helmet');
require('dotenv').config();

// Cargar certificados SSL
const privateKey = fs.readFileSync(path.join(__dirname, 'certs/key.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, 'certs/cert.pem'), 'utf8');
const credentials = { key: privateKey, cert: certificate };

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
                imgSrc: ["'self'", "data:"],
                scriptSrc: ["'self'"],
                objectSrc: ["'none'"],
            },
        },
    })
);

app.use(express.json({ limit: '10mb' }));
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

// Middleware de registro
app.use((req, _, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});


const userRoutes = require('./routes/userRoutes');
const apartmentRoutes = require('./routes/apartmentRoutes');
const DocumentRoutes = require('./routes/DocumentRoutes');
const authRoutes = require('./routes/auth');

app.use('/users', userRoutes);
app.use('/apartments', apartmentRoutes);
app.use('/documents', DocumentRoutes);
app.use('/auth', authRoutes);

// 404
app.use((_, res) => {
    res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Manejador de errores
app.use((err, _, res, __) => {
    console.error('Error global:', err);
    res.status(500).json({ 
        error: 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
});

// Puertos
const SSL_PORT = process.env.SSL_PORT || 3443;
const HTTP_PORT = process.env.SERVER_PORT || 3001;

// Servidor HTTPS
https.createServer(credentials, app).listen(SSL_PORT, () => {
    console.log(`🔐 HTTPS escuchando en https://localhost:${SSL_PORT}`);
});

// Redirección HTTP → HTTPS (opcional)
const redirectApp = express();
redirectApp.use((req, res) => {
    res.redirect(`https://localhost:${SSL_PORT}${req.url}`);
});
http.createServer(redirectApp).listen(HTTP_PORT, () => {
    console.log(`➡️ Redirigiendo HTTP (${HTTP_PORT}) → HTTPS (${SSL_PORT})`);
});
