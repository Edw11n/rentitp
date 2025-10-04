const multer = require('multer');
const path = require('path');
const fileType = require('file-type');
const fs = require('fs/promises');
const sharp = require('sharp');
const { encryptImage } = require('../utils/encryption');
require('dotenv').config();

// Configuración de almacenamiento dinámico por usuario
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            // Obtener ID de usuario (asumiendo que viene en el token JWT)
            const userId = req.user?.id || 'temp';
            const userDir = path.join('uploads', `user_${userId}`);
            
            // Crear directorio si no existe
            await fs.mkdir(userDir, { recursive: true });
            cb(null, userDir);
        } catch (error) {
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueName}.webp`); // Todos los archivos de imagen tendrán extensión .webp
    }
});

// Tipos MIME permitidos
const defaultMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
const allowedMimes = new Set(
    process.env.ALLOWED_MIMES
        ? process.env.ALLOWED_MIMES.split(',').map(mime => mime.trim())
        : defaultMimes
);


const fileFilter = (req, file, cb) => {
    if (!allowedMimes.has(file.mimetype)) {
        return cb(new Error('Tipo de archivo no permitido'), false);
    }
    cb(null, true);
};

exports.upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: process.env.MAX_FILE_SIZE || 10 * 1024 * 1024,
        files: process.env.MAX_FILES || 10
    }
});

exports.validateFiles = async (req, res, next) => {
    if (!req.files?.length) return next();
    
    try {
        for (const file of req.files) {
            // Leer el archivo temporal
            const buffer = await fs.readFile(file.path);
            const type = await fileType.fileTypeFromBuffer(buffer);
            
            // Validación de tipo real
            if (!type || !allowedMimes.has(type.mime)) {
                await fs.unlink(file.path);
                throw new Error(`Tipo de archivo no permitido: ${file.originalname}`);
            }

            // Procesar imágenes
            if (type.mime.startsWith('image/')) {
                const processedBuffer = await sharp(buffer)
                    .resize({
                        width: 1920,
                        height: 1080,
                        fit: 'inside',
                        withoutEnlargement: true
                    })
                    .webp({ 
                        quality: 80,
                        lossless: false,
                        alphaQuality: 100
                    })
                    .toBuffer();

                    // Encriptar imagen procesada
                    const {iv, data} = encryptImage(processedBuffer);
                    await fs.writeFile(file.path, Buffer.from(data, 'hex'));

                    // Guardar la ruta y el IV en la base de datos
                    req.encryptedFiles = req.encryptedFiles || [];
                    req.encryptedFiles.push({
                        path: file.path,
                        iv: iv
                    })
                    console.log('IV en middleware:', iv);
            }
        }
        next();
    } catch (error) {
        // Limpiar archivos subidos en caso de error
        await Promise.all(req.files.map(file => 
            fs.unlink(file.path).catch(() => {})
        ));
        next(error);
    }
};
