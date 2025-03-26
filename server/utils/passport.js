const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../config/db');
require('dotenv').config(); // Para cargar variables de entorno

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
async (accessToken, refreshToken, profile, done) => {
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE google_id = ?', [profile.id]);

        if (rows.length > 0) {
        // Si el usuario ya existe, lo devolvemos
        return done(null, rows[0]);
        } else {
        // Si no existe, lo creamos en la base de datos
        const newUser = {
            google_id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            rol: 1,
        };

        const [result] = await db.query(
            'INSERT INTO users (google_id, user_name, user_email, rol_id) VALUES (?, ?, ?, ?)',
            [newUser.google_id, newUser.name, newUser.email, newUser.rol]
        );

        newUser.user_id = result.insertId; // Obtener el ID insertado

        return done(null, newUser);
        }
    } catch (error) {
    return done(error, null);
    }
}
));

// Serializar usuario en la sesión
passport.serializeUser((user, done) => {
done(null, user);
});

// Deserializar usuario
passport.deserializeUser(async (user_id, done) => {
    try {
    const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [user_id]);
    if (rows.length > 0) {
        return done(null, rows[0]);
    }
    } catch (error) {
    return done(error, null);
    }
});

module.exports = passport;
