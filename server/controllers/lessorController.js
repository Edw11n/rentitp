const Lessor = require('../models/LessorModel');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/auth');
require('dotenv').config();

// Controlador para registrar un nuevo usuario
exports.signup = async (req, res) => {
    try {
        const { nombre, apellido, email, telefono, password, rolId } = req.body;
        
        // Validación de campos
        const requiredFields = ['nombre', 'apellido', 'email', 'telefono', 'password', 'rolId'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                error: 'Campos requeridos faltantes',
                missing: missingFields
            });
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Formato de email inválido' });
        }

        // Verificar si el usuario ya existe
        const existingUser = await Lessor.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: 'El usuario ya está registrado' });
        }

        // Hashear la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Crear usuario
        const newUser = await Lessor.signup({
            nombre,
            apellido,
            email,
            telefono,
            password: hashedPassword,
            rolId
        });

        // Generar token JWT
        const token = generateToken({
            id: newUser.user_id,
            rol: newUser.rol_id
        });

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: {
                id: newUser.user_id,
                email: newUser.user_email,
                rol: newUser.rol_id
            },
            token
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// Controlador para iniciar sesión
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña requeridos' });
        }

        // Buscar usuario
        const user = await Lessor.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        // Verificar si el usuario usa Google OAuth
        if (!user.user_password) {
            return res.status(400).json({ error: 'Este usuario usa Google OAuth, inicie sesión con Google' });
        }

        // Verificar contraseña
        const validPassword = await bcrypt.compare(password, user.user_password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generar token JWT
        const token = generateToken({
            id: user.user_id,
            rol: user.rol_id
        });

        // Excluir información sensible
        const userData = {
            id: user.user_id,
            nombre: user.user_name,
            apellido: user.user_lastname,
            email: user.user_email,
            telefono: user.user_phonenumber,
            rol: user.rol_id
        };

        res.json({
            message: 'Autenticación exitosa',
            user: userData,
            token
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};
