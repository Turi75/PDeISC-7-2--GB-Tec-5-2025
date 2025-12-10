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
 * CORRECCIÓN: Ahora acepta múltiples roles y verifica correctamente
 */
const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }
    
    // CORRECCIÓN: Convertir a minúsculas para comparar
    const rolUsuario = req.usuario.rol.toLowerCase();
    const rolesPermitidosLower = rolesPermitidos.map(r => r.toLowerCase());
    
    console.log(`🔐 Verificando rol: Usuario tiene '${rolUsuario}', se requiere uno de: [${rolesPermitidosLower.join(', ')}]`);
    
    if (!rolesPermitidosLower.includes(rolUsuario)) {
      console.log(`❌ Acceso denegado para rol: ${rolUsuario}`);
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso'
      });
    }
    
    console.log(`✅ Acceso permitido para rol: ${rolUsuario}`);
    next();
  };
};

module.exports = {
  verificarToken,
  verificarRol
};