const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES || '1h'
    });
};

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d'
    });
};

const verifyToken = (token, secret = process.env.JWT_SECRET) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        console.error('Error verificando token:', error);
        return null; // Evita que falle si el token es inválido
    }
};

module.exports = { generateToken, generateRefreshToken, verifyToken };
