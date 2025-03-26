const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const db = require("../config/db"); // Conexión a la base de datos

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ success: false, message: "Token no proporcionado" });
        }

        // Verificar el token de Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, sub } = payload; // sub es el ID único del usuario en Google

        // Buscar usuario en la base de datos
        let [user] = await db.query(`
            SELECT U.*, UR.rol_id 
            FROM users AS U 
            LEFT JOIN user_rol AS UR ON U.user_id = UR.user_id 
            WHERE U.user_email = ? 
            LIMIT 1
        `, [email]);

        if (user.length === 0) {
            // Si el usuario no existe, crearlo automáticamente
            await db.query(`
                INSERT INTO users (user_nombre, user_email, user_google_id)
                VALUES (?, ?, ?)
            `, [name, email, sub]);

            // Obtener el usuario recién creado con su rol
            [user] = await db.query(`
                SELECT 
                U.user_id,
                U.user_nombre,
                U.user_apellido,
                U.user_email,
                U.user_telefono, 
                UR.rol_id 
                FROM users AS U 
                LEFT JOIN user_rol AS UR ON U.user_id = UR.user_id 
                WHERE U.user_email = ? 
                LIMIT 1
            `, [email]);
        }

        if (user.length === 0) {
            return res.status(500).json({ success: false, message: "Error al recuperar el usuario" });
        }

        // Extraer información del usuario
        console.log("Usuario encontrado:", user[0]); // 🔍 Verifica si se obtiene el rol

        const { user_id, user_name, user_lastname, user_email, user_phonenumber, rol_id } = user[0];

        // Generar token de acceso
        const accessToken = jwt.sign({ user_id, user_email, rol_id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({
            success: true,
            token: accessToken,
            user: { user_id, user_name, user_lastname, user_email, user_phonenumber, rol_id },
        });

    } catch (error) {
        console.error("Error en la autenticación con Google:", error);
        res.status(500).json({ success: false, message: "Error en la autenticación con Google" });
    }
};

module.exports = { googleLogin };
