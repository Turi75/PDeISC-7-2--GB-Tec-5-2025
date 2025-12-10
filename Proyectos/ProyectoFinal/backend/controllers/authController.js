const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
// Importamos la librería de Google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Generar token JWT
 */
const generarToken = (usuario) => {
  return jwt.sign(
    { 
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// --- TUS FUNCIONES ORIGINALES (INTACTAS) ---

const registrar = async (req, res) => {
  try {
    const { nombre, apellido, email, password, dni } = req.body;
    if (!nombre || !apellido || !email || !password || !dni) {
      return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }
    const emailExiste = await query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (emailExiste.length > 0) return res.status(400).json({ success: false, message: 'El email ya existe' });

    const passwordHash = await bcrypt.hash(password, 10);
    const rolUsuario = await query("SELECT id FROM roles WHERE nombre = 'usuario'");
    const rolId = rolUsuario[0]?.id || 1;

    const nuevo = await query(
      `INSERT INTO usuarios (nombre, apellido, email, password, dni, rol_id, activo)
       VALUES ($1, $2, $3, $4, $5, $6, TRUE) RETURNING id`,
      [nombre, apellido, email, passwordHash, dni, rolId]
    );

    const usuario = await query('SELECT * FROM usuarios WHERE id = $1', [nuevo[0].id]);
    const token = generarToken(usuario[0]);

    res.status(201).json({ success: true, data: { usuario: usuario[0], token } });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuarios = await query(`
      SELECT u.*, r.nombre as rol FROM usuarios u 
      INNER JOIN roles r ON u.rol_id = r.id WHERE u.email = $1`, [email]);
    
    if (usuarios.length === 0) return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    const usuario = usuarios[0];
    
    if (!await bcrypt.compare(password, usuario.password)) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    const token = generarToken(usuario);
    res.json({ success: true, data: { usuario, token } });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await query(
      `SELECT u.id, u.nombre, u.apellido, u.email, u.dni, r.nombre as rol
       FROM usuarios u INNER JOIN roles r ON u.rol_id = r.id WHERE u.id = $1`,
      [req.usuario.id]
    );
    res.json({ success: true, data: usuario[0] });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// --- NUEVA FUNCIÓN AGREGADA (ESTO ES LO NUEVO) ---

const loginGoogle = async (req, res) => {
  try {
    const { token } = req.body;
    // Validar token con Google
    // NOTA: Si no configuras el GOOGLE_CLIENT_ID en Render, esto advertirá pero intentará funcionar
    const ticket = await client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
    const { email, given_name, family_name, sub } = ticket.getPayload();

    // Buscar si ya existe el usuario
    let usuario = (await query('SELECT u.*, r.nombre as rol FROM usuarios u JOIN roles r ON u.rol_id=r.id WHERE email = $1', [email]))[0];

    if (!usuario) {
      // Si no existe, lo creamos automáticamente
      const pass = Math.random().toString(36); // Contraseña aleatoria
      const hash = await bcrypt.hash(pass, 10);
      const dniTemp = 'G-' + sub.substring(0,8); // DNI temporal
      const rolId = (await query("SELECT id FROM roles WHERE nombre = 'usuario'"))[0].id;

      const nuevo = await query(
        `INSERT INTO usuarios (nombre, apellido, email, password, dni, rol_id, activo)
         VALUES ($1, $2, $3, $4, $5, $6, TRUE) RETURNING id`,
        [given_name, family_name, email, hash, dniTemp, rolId]
      );
      usuario = (await query('SELECT u.*, r.nombre as rol FROM usuarios u JOIN roles r ON u.rol_id=r.id WHERE u.id = $1', [nuevo[0].id]))[0];
    }

    const appToken = generarToken(usuario);
    res.json({ success: true, data: { usuario, token: appToken } });

  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: 'Error con Google: ' + error.message });
  }
};

const loginGithub = async (req, res) => res.status(501).json({message: 'No implementado'});

module.exports = { registrar, login, obtenerPerfil, loginGoogle, loginGithub };