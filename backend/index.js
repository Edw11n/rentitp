const express = require('express');
const mysql = require('mysql2');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');

app.use(cors());
app.use(express.json());
const portconnect = 3001;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'wasd',
    database: 'rentitp',
    port: 3306
});

db.connect(err => {
    if (err) {
        console.error('error al conectar a la base de datos: ' + err.stack);
        return;
    }
    console.log('conexion a la base de datos establecida correctamente');
});

//Rutas del CRUD
//Registro de arrendadores
app.post('/signup', (req, res) => {
    const {nombre, apellido, email, telefono, password} = req.body;
    if (!nombre || !apellido || !email || !telefono || !password) {
        req.statusCode(400).send('Por favor ingrese todos los campos')
        return;
    }
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error al encriptar la contraseña ', err);
            res.status(500).send('Error al crear usuario ');
            return;
        }
    
    db.query('INSERT INTO arrendadores_data (Lessor_name, Lessor_lastname, Lessor_email, Lessor_phonenumber, Lessor_password) VALUES (?, ?, ?, ?, ?)', [nombre, apellido, email, telefono, hashedPassword], (err, result) => {
        if (err) {
            console.error('Error al crear usuario ' + err);
            res.status(500).send('Error al crear usuario ')
            return;
        }
        res.status(201).send('Usuario registrado exitosamente ');
    });
});
});

//Login de arrendadores
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Consulta por correo electrónico
    const query = 'SELECT * FROM arrendadores_data WHERE Lessor_email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error en la consulta ', err);
            res.status(500).send('Error en la consulta ');
            return;
        }
        if (results.length > 0) {
            const user = results[0];
            console.log(user);

            // Comparar las contraseñas
            bcrypt.compare(password, user.Lessor_password, (err, isMatch) => {
                if (err) {
                    console.error('Error al comparar contraseñas', err);
                    res.status(500).send('Error al comparar contraseñas');
                    return;
                }
                if (isMatch) {
                    res.json({
                        Lessor_name: user.Lessor_name,
                        Lessor_lastname: user.Lessor_lastname,
                        Lessor_email: user.Lessor_email,
                        Lessor_phonenumber: user.Lessor_phonenumber
                    });
                } else {
                    res.status(401).json({ message: 'Correo o contraseña incorrectos' });
                }
            });

        } else {
            res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        }
    });
});

//Agregar apartamentos
app.post('/addApartment', (req, res) => {
    const { barrio, direccion, latitud, longitud, addInfo, Lessor_email } = req.body;

    const query = 'INSERT INTO apartamentos_data (barrio_apartamento, direccion_apartamento, latitud_apartamento, longitud_apartamento, info_adicional_apartamento, Lessor_email) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [barrio, direccion, latitud, longitud, addInfo, Lessor_email], (err, result) => {
        if (err) {
            console.error('Error adding apartment: ', err);
            res.status(500).send('Error adding apartment');
        } else {
            res.status(200).send('Apartment added successfully');
        }
    });
});

//Obtener los apartamentos para los arrendadores
app.get('/manage', (req, res) => {
    const {email} = req.query;
    if (!email) {
        return res.status(400).send('Email del arrendador es requerido');
    }
    const query = 'SELECT * FROM apartamentos_data WHERE Lessor_email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error al obtener los datos:', err);
            res.status(500).send('Error obteniendo los apartamentos');
        } else {
            res.json(results);
        }
    });
});
//obetener los apartamentos para los usuarios
app.get('/apartments', (req, res) => {
    const query = `
        SELECT 
            a.*, 
            r.Lessor_name, 
            r.Lessor_lastname, 
            r.Lessor_email, 
            r.Lessor_phonenumber 
        FROM 
            apartamentos_data AS a
        LEFT JOIN 
            arrendadores_data AS r 
        ON 
            a.Lessor_email = r.Lessor_email
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los datos:', err);
            res.status(500).send('Error obteniendo los datos');
        } else {
            res.json(results);
        }
    });
});

//eliminar apartamento de la base de datos
app.delete('/delete/:id_apartamento', (req, res) => {
    const { id_apartamento } = req.params;
    const query = 'DELETE FROM apartamentos_data WHERE id_apartamento = ?';

    db.query(query, [id_apartamento], (err, result) => {
        if (err) {
            console.error('Error eliminando apartamento:', err);
            res.status(500).send('Error eliminando apartamento');
        } else if (result.affectedRows === 0) {
            res.status(404).send('Apartamento no encontrado');
        } else {
            res.status(200).send('Apartamento eliminado exitosamente');
        }
    });
});
//editar-actualizar apartamentos
app.put('/update/:id_apartamento', (req, res) => {
    const { id_apartamento } = req.params;
    const { direccion_apartamento, barrio_apartamento, latitud_apartamento, longitud_apartamento, info_adicional_apartamento } = req.body;

    const query = `
        UPDATE apartamentos_data 
        SET direccion_apartamento = ?, barrio_apartamento = ?, latitud_apartamento = ?, longitud_apartamento = ?, info_adicional_apartamento = ? 
        WHERE id_apartamento = ?`;

    db.query(query, [direccion_apartamento, barrio_apartamento, latitud_apartamento, longitud_apartamento, info_adicional_apartamento, id_apartamento], (err, result) => {
        if (err) {
            console.error('Error actualizando apartamento:', err);
            res.status(500).send('Error actualizando apartamento');
        } else {
            res.status(200).send('Apartamento actualizado exitosamente');
            
        }
    });
});

//Iniciar el servidor
app.listen(portconnect, () => {
    console.log(`Servidor corriendo en http://localhost:${portconnect}`)
})