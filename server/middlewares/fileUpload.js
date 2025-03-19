const multer = require('multer');
const path = require('path');
const sanitize = require('sanitize-filename');
const { fileTypeFromBuffer } = require('file-type');
const fs = require('fs/promises');
require('dotenv').config();

// Configuración de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const sanitizedName = sanitize(file.originalname);
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(sanitizedName);
        cb(null, `${uniquePrefix}${extension}`);
    }
});

// Validación de tipos MIME
const allowedMimes = new Set(
    (process.env.ALLOWED_MIMES || 'image/jpeg,image/png,image/webp,image/jpg').split(',')
);

const fileFilter = (req, file, cb) => {
    if (!allowedMimes.has(file.mimetype)) {
        return cb(new Error('Tipo de archivo no permitido'), false);
    }
    cb(null, true);
};

// Configuración de Multer exportable
exports.upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024,
        files: process.env.MAX_FILES || 10
    }    
});

// Middleware de validación avanzada
exports.validateFiles = async (req, res, next) => {
    if (!req.files || req.files.length === 0) return next();
    
    try {
        for (const file of req.files) {
            const buffer = await fs.readFile(file.path, { length: 4100 });
            const type = await fileTypeFromBuffer(buffer);
            
            if (!type || !allowedMimes.has(type.mime)) {
                await fs.unlink(file.path);
                throw new Error(`Archivo inválido: ${file.originalname}`);
            }
            
            const newPath = `${file.path}.${type.ext}`;
            await fs.rename(file.path, newPath);
            file.path = newPath;
        }
        next();
    } catch (error) {
        await Promise.all(req.files.map(file => fs.unlink(file.path)));
        next(error);
    }
};