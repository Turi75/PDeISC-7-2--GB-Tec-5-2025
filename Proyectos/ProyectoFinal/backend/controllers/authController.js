const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

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

/**
 * Registro de nuevo usuario
 */
const registrar = async (req, res) => {
  try {
    const { nombre, apellido, email, password, dni } = req.body;
    
    // Validaciones
    if (!nombre || !apellido || !email || !password || !dni) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios'
      });
    }
    
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 8 caracteres'
      });
    }
    
    // Verificar si el email ya existe
    const emailExiste = await query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email]
    );
    
    if (emailExiste.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }
    
    // Verificar si el DNI ya existe
    const dniExiste = await query(
      'SELECT id FROM usuarios WHERE dni = $1',
      [dni]
    );
    
    if (dniExiste.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El DNI ya está registrado'
      });
    }
    
    // Encriptar contraseña
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Obtener ID del rol "usuario"
    const rolUsuario = await query(
      'SELECT id FROM roles WHERE nombre = $1',
      ['usuario']
    );
    
    // Crear usuario
    const resultado = await query(
      `INSERT INTO usuarios (nombre, apellido, email, password, dni, rol_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [nombre, apellido, email, passwordHash, dni, rolUsuario[0].id]
    );
    
    // Obtener usuario creado
    const nuevoUsuario = await query(
      `SELECT u.id, u.nombre, u.apellido, u.email, u.dni, r.nombre as rol
       FROM usuarios u
       INNER JOIN roles r ON u.rol_id = r.id
       WHERE u.id = $1`,
      [resultado[0].id]
    );
    
    // Generar token
    const token = generarToken(nuevoUsuario[0]);
    
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        usuario: {
          id: nuevoUsuario[0].id,
          nombre: nuevoUsuario[0].nombre,
          apellido: nuevoUsuario[0].apellido,
          email: nuevoUsuario[0].email,
          dni: nuevoUsuario[0].dni,
          rol: nuevoUsuario[0].rol
        },
        token
      }
    });
    
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario'
    });
  }
};

/**
 * Login de usuario
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validaciones
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son obligatorios'
      });
    }
    
    // Buscar usuario
    const usuarios = await query(
      `SELECT u.id, u.nombre, u.apellido, u.email, u.password, u.dni, u.activo,
              r.nombre as rol
       FROM usuarios u
       INNER JOIN roles r ON u.rol_id = r.id
       WHERE u.email = $1`,
      [email]
    );
    
    if (usuarios.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    const usuario = usuarios[0];
    
    // Verificar si el usuario está activo
    if (!usuario.activo) {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo. Contacta al administrador'
      });
    }
    
    // Verificar contraseña
    const passwordValido = await bcrypt.compare(password, usuario.password);
    
    if (!passwordValido) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Generar token
    const token = generarToken(usuario);
    
    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          dni: usuario.dni,
          rol: usuario.rol
        },
        token
      }
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión'
    });
  }
};

/**
 * Obtener perfil del usuario autenticado
 */
const obtenerPerfil = async (req, res) => {
  try {
    // Obtener información completa del usuario
    const usuario = await query(
      `SELECT u.id, u.nombre, u.apellido, u.email, u.dni, u.foto_perfil,
              r.nombre as rol,
              (SELECT COUNT(*) FROM inscripciones WHERE usuario_id = u.id) as total_clases,
              s.estado as estado_suscripcion, s.fecha_fin as fecha_fin_suscripcion,
              p.nombre as plan_nombre
       FROM usuarios u
       INNER JOIN roles r ON u.rol_id = r.id
       LEFT JOIN suscripciones s ON u.id = s.usuario_id AND s.estado = 'activa'
       LEFT JOIN planes p ON s.plan_id = p.id
       WHERE u.id = $1`,
      [req.usuario.id]
    );
    
    res.json({
      success: true,
      data: usuario[0]
    });
    
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil'
    });
  }
};

/**
 * Login con Google (placeholder - implementar OAuth después)
 */
const loginGoogle = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Login con Google en desarrollo'
  });
};

/**
 * Login con GitHub (placeholder - implementar OAuth después)
 */
const loginGithub = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Login con GitHub en desarrollo'
  });
};

module.exports = {
  registrar,
  login,
  obtenerPerfil,
  loginGoogle,
  loginGithub
};