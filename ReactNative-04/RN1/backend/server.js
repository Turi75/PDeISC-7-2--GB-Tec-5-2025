// API para el registro y acceso de usuarios con validaciones de seguridad
// y lógica de primer acceso.

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const puerto = 3000;
app.use(cors());
app.use(express.json());

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'empresa_db'
});

conexion.connect(error => {
  if (error) {
    console.error('Error al conectar a la base de datos:', error);
    return;
  }
  console.log('Conexión a la base de datos MySQL exitosa.');
});

// --- Endpoint de Registro (con validación de contraseña) ---
app.post('/registro', (req, res) => {
  const { nombre_completo, nombre_usuario, contrasena } = req.body;

  // [NUEVO] Validación de la contraseña en el backend para mayor seguridad.
  if (!contrasena || contrasena.length < 8) {
    // Retornamos un error '400 - Bad Request' si la contraseña no es válida.
    return res.status(400).json({
      registro: false,
      mensaje: 'La contraseña debe tener al menos 8 caracteres.'
    });
  }

  // Verificamos si el nombre de usuario ya existe
  const consultaVerificacion = 'SELECT * FROM usuarios WHERE nombre_usuario = ?';
  conexion.query(consultaVerificacion, [nombre_usuario], (error, resultados) => {
    if (error) return res.status(500).json({ mensaje: 'Error en el servidor' });
    if (resultados.length > 0) {
      // Retornamos un error '409 - Conflict' si el usuario ya existe.
      return res.status(409).json({ registro: false, mensaje: 'El nombre de usuario ya está en uso.' });
    }

    // Si todo es correcto, insertamos el nuevo usuario
    const consultaInsercion = 'INSERT INTO usuarios (nombre_completo, nombre_usuario, contrasena) VALUES (?, ?, ?)';
    conexion.query(consultaInsercion, [nombre_completo, nombre_usuario, contrasena], (errorInsercion) => {
      if (errorInsercion) {
        return res.status(500).json({ mensaje: 'Error al registrar el usuario.' });
      }
      // Retornamos un '201 - Created' para indicar que el recurso se creó con éxito.
      res.status(201).json({ registro: true, mensaje: 'Usuario registrado con éxito' });
    });
  });
});

// --- Endpoint de Login (con lógica de primer acceso) ---
app.post('/login', (req, res) => {
  const { nombre_usuario, contrasena } = req.body;
  // Modificamos la consulta para obtener también la columna 'ultimo_login'
  const consulta = 'SELECT id, nombre_completo, ultimo_login FROM usuarios WHERE nombre_usuario = ? AND contrasena = ?';

  conexion.query(consulta, [nombre_usuario, contrasena], (error, resultados) => {
    if (error) return res.status(500).json({ mensaje: 'Error en el servidor' });

    if (resultados.length > 0) {
      const usuario = resultados[0];
      
      // [NUEVO] Verificamos si el campo 'ultimo_login' es NULL para saber si es el primer acceso.
      const esPrimerLogin = usuario.ultimo_login === null;

      // Actualizamos la fecha del último login en la base de datos para este usuario.
      // Se ejecutará la próxima vez que inicie sesión, marcándolo como un usuario que regresa.
      const consultaUpdate = 'UPDATE usuarios SET ultimo_login = NOW() WHERE id = ?';
      conexion.query(consultaUpdate, [usuario.id]);

      res.json({
        acceso: true,
        mensaje: 'Acceso concedido',
        usuario: {
          nombre: usuario.nombre_completo
        },
        esPrimerLogin: esPrimerLogin // Enviamos este dato clave al frontend
      });
    } else {
      // Retornamos '401 - Unauthorized' si las credenciales son incorrectas.
      res.status(401).json({ acceso: false, mensaje: 'Usuario o contraseña incorrectos' });
    }
  });
});

app.listen(puerto, () => {
  console.log(`Servidor corriendo en http://localhost:${puerto}`);
});