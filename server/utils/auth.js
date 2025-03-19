const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES || '1h'  // Vida corta, por ejemplo 1 hora
    });
};

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' // Vida más larga, por ejemplo 7 días
    });
};

const verifyToken = (token, secret = process.env.JWT_SECRET) => {
    return jwt.verify(token, secret);
};

module.exports = { generateToken, generateRefreshToken, verifyToken };
