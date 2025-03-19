const db = require('../config/db');
const bcrypt = require('bcrypt');

class Lessor {
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

module.exports = Lessor;