const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
    static async getUserData(userId) {
        try {
            const [results] = await db.query(
                `SELECT users.user_id, users.user_name, users.user_lastname, 
                        users.user_email, users.user_phonenumber, 
                        user_rol.rol_id
                    FROM users
                    INNER JOIN user_rol ON users.user_id = user_rol.user_id
                    WHERE users.user_id = ?`,
                [userId]
            );
            return results[0] || null;
        } catch (error) {
            throw new Error('Error al obtener datos del usuario');
        }
    }
    static async updateUserData(userId, { nombre, apellido, email, telefono, password, rol }) {
        try {
            console.log("Datos recibidos para actualizar:", { nombre, apellido, email, telefono, password, rol });
            console.log("ID de usuario:", userId);
            // Verificar que los datos requeridos no estén vacíos
            if (!nombre || !apellido || !email || !telefono || !rol) {
                throw new Error("Todos los campos deben estar llenos, excepto la contraseña.");
            }

            // Obtener el usuario actual para verificar si existe
            const [userResult] = await db.execute("SELECT * FROM users WHERE user_id = ? LIMIT 1", [userId]);
            if (userResult.length === 0) {
                return null; // Usuario no encontrado
            }

            // Si la contraseña está vacía, no se actualiza
            let passwordHash = userResult[0].user_password || null; // Mantener la contraseña actual
            if (password) {
                // Encriptar la nueva contraseña
                const salt = await bcrypt.genSalt(10);
                passwordHash = await bcrypt.hash(password, salt);
            }

            // Actualizar los datos en la base de datos
            const [updateUserResult] = await db.execute(
                `UPDATE users 
                    SET user_name=?, user_lastname=?, user_email=?, user_phonenumber=?, user_password=? 
                    WHERE user_id=?`,
                [nombre, apellido, email, telefono, passwordHash, userId]
            );
            // Actualizar el rol
            const [updateRolResult] = await db.execute(
                `UPDATE user_rol
                    SET rol_id=?, start_date=NOW()
                    WHERE user_id=?`,
                [rol, userId]
            );         

            if (updateUserResult.affectedRows === 0 || updateRolResult.affectedRows === 0) {
                return null; // No se pudo actualizar
            }

            // Retornar los datos actualizados
            return {
                user_id: userId,
                user_name: nombre,
                user_lastname: apellido,
                user_email: email,
                user_phonenumber: telefono,
                rol_id: rol
            };
        } catch (error) {
            console.error("Error en User.updateUserData:", error);
            throw error;
        }
    }

    static async signup({ nombre, apellido, email, telefono, password, rolId }) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Hash de contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            // 2. Insertar usuario
            const [userResult] = await connection.query(
                `INSERT INTO users 
                (user_name, user_lastname, user_email, user_phonenumber, user_password)
                VALUES (?, ?, ?, ?, ?)`,
                [nombre, apellido, email, telefono, hashedPassword]
            );

            // 3. Insertar rol
            await connection.query(
                `INSERT INTO user_rol (user_id, rol_id, start_date)
                VALUES (?, ?, ?)`,
                [userResult.insertId, rolId, new Date()]
            );

            await connection.commit();
            return {
                user_id: userResult.insertId,
                user_email: email,
                rol_id: rolId
            };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async findByEmail(email) {
        try {
            const [results] = await db.query(
                `SELECT users.user_id, users.user_name, users.user_lastname, 
                        users.user_email, users.user_phonenumber, users.user_password, 
                        user_rol.rol_id
                    FROM users
                    JOIN user_rol ON users.user_id = user_rol.user_id
                    WHERE users.user_email = ?`,
                [email]
            );
            return results[0] || null;
        } catch (error) {
            throw new Error('Error al buscar usuario por email');
        }
    }

    static async comparePassword(plainPassword, hashedPassword) {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            throw new Error('Error al comparar contraseñas');
        }
    }

    static async emailExists(email) {
        try {
            const [results] = await db.query(
                'SELECT user_id FROM users WHERE user_email = ?',
                [email]
            );
            return results.length > 0;
        } catch (error) {
            throw new Error('Error al verificar existencia de email');
        }
    }
}

module.exports = User;