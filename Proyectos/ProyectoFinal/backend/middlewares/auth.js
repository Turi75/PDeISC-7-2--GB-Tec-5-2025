const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

/**
 * Middleware para verificar el token JWT
 */
const verificarToken = async (req, res, next) => {
  try {
    // Obtener token del header
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer TOKEN"
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No se proporcionó token de autenticación'
      });
    }
    
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Obtener información del usuario
    const usuario = await query(
      `SELECT u.id, u.nombre, u.apellido, u.email, u.dni, u.activo, 
              r.nombre as rol
       FROM usuarios u
       INNER JOIN roles r ON u.rol_id = r.id
       WHERE u.id = $1`,
      [decoded.id]
    );
    
    if (usuario.length === 0 || !usuario[0].activo) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado o inactivo'
      });
    }
    
    // Agregar usuario a la petición
    req.usuario = usuario[0];
    next();
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Error al verificar token'
    });
  }
};

/**
 * Middleware para verificar roles específicos
 */
const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }
    
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso'
      });
    }
    
    next();
  };
};

module.exports = {
  verificarToken,
  verificarRol
};