// 1. importaciones: traemos las "herramientas" que vamos a necesitar
const express = require('express'); // el framework para armar el servidor
const mysql = require('mysql2');    // el que nos deja hablar con la base de datos mysql
const cors = require('cors');       // un middleware que permite que nuestro frontend le pueda hacer peticiones

// 2. inicialización: creamos la aplicación del servidor
const app = express();

// 3. middlewares: son funciones que se ejecutan en el medio de cada petición
app.use(cors());           // le decimos a la app que use cors para no tener problemas de permisos
app.use(express.json());   // permite que nuestro servidor entienda el formato json que le manda el frontend

// 4. conexión a la base de datos: configuramos los datos para entrar a mysql
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ianian2323', // acá va la clave que configuraste
    database: 'mi_app'
});

// intentamos conectar a la base de datos
db.connect(err => {
    // si hay un error, lo mostramos en la consola del backend y cortamos
    if (err) {
        console.error('error al conectar a la base de datos:', err);
        return;
    }
    // si se conecta bien, avisamos.
    console.log('¡conectado exitosamente a la base de datos mysql! 🐘');
});

// 5. rutas de la api (los "endpoints" o "departamentos" de nuestro servidor)
// acá definimos qué tiene que hacer el servidor según la url que le pidan

// ruta para obtener todos los usuarios (listado)
// se activa cuando el frontend hace una petición get a http://localhost:5000/usuarios
app.get('/usuarios', (req, res) => {
    const sql = 'select * from usr'; // la consulta sql que le vamos a hacer a la base de datos
    db.query(sql, (err, resultados) => {
        if (err) {
            // si la base de datos tira un error, le respondemos al frontend con ese error
            return res.status(500).json({ error: err.message });
        }
        // si todo sale bien, le respondemos al frontend con la lista de usuarios en formato json
        res.json(resultados);
    });
});

// ruta para añadir un usuario nuevo (alta)
// se activa con una petición post a http://localhost:5000/usuarios
app.post('/usuarios', (req, res) => {
    // sacamos los datos del nuevo usuario que el frontend mandó en el "cuerpo" (body) de la petición
    const { nombre, apellido, email, celular } = req.body;
    // la consulta sql para insertar. los signos de pregunta son para evitar inyecciones sql
    const sql = 'insert into usr (nombre, apellido, email, celular) values (?, ?, ?, ?)';
    // ejecutamos la consulta, pasando los datos en un array
    db.query(sql, [nombre, apellido, email, celular], (err, resultado) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // si se crea bien, respondemos con un mensaje de éxito y el id del nuevo usuario
        res.status(201).json({ message: 'usuario añadido con éxito', id: resultado.insertId });
    });
});

// ruta para actualizar un usuario existente 
// se activa con una petición put a http://localhost:5000/usuarios/id (ej: /usuarios/5)
app.put('/usuarios/:id', (req, res) => {
    const { id } = req.params; // agarramos el id que viene en la url.
    const { nombre, apellido, email, celular } = req.body; // agarramos los datos actualizados del cuerpo
    const sql = 'update usr set nombre = ?, apellido = ?, email = ?, celular = ? where id = ?';
    db.query(sql, [nombre, apellido, email, celular, id], (err, resultado) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'usuario actualizado con éxito' });
    });
});

// ruta para borrar un usuario (baja)
// se activa con una petición delete a http://localhost:5000/usuarios/id
app.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params; // agarramos el id de la url
    const sql = 'delete from usr where id = ?';
    db.query(sql, [id], (err, resultado) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'usuario eliminado con éxito' });
    });
});


// 6. iniciar el servidor le decimos a la aplicación que se ponga a """escuchar""" peticiones
const port = 5000; // el "puerto" o "puerta" por donde va a escuchar
app.listen(port, () => {
    console.log(`🚀 servidor corriendo en http://localhost:${port}`);
});