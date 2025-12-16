const { query } = require('../config/database');

/**
 * Obtener todos los usuarios (solo admin)
 */
const obtenerUsuarios = async (req, res) => {
  try {
    const { rol } = req.query;
    
    let sql = `
      SELECT u.id, u.nombre, u.apellido, u.email, u.dni, u.activo, u.created_at,
             r.nombre as rol
      FROM usuarios u
      INNER JOIN roles r ON u.rol_id = r.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (rol && rol !== 'todos') {
      sql += ' AND r.nombre = $1';
      params.push(rol);
    }
    
    sql += ' ORDER BY u.created_at DESC';
    
    const usuarios = await query(sql, params);
    
    console.log(`✅ Usuarios obtenidos: ${usuarios.length}`);
    
    res.json({
      success: true,
      data: usuarios
    });
    
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios'
    });
  }
};

/**
 * Obtener estadísticas de usuarios (solo admin)
 */
const obtenerEstadisticasUsuarios = async (req, res) => {
  try {
    const totalUsuarios = await query(
      `SELECT COUNT(*) as total FROM usuarios u
       INNER JOIN roles r ON u.rol_id = r.id
       WHERE r.nombre = 'usuario'`
    );
    
    const totalProfesores = await query(
      `SELECT COUNT(*) as total FROM usuarios u
       INNER JOIN roles r ON u.rol_id = r.id
       WHERE r.nombre = 'profesor'`
    );
    
    const totalActivos = await query(
      `SELECT COUNT(*) as total FROM usuarios
       WHERE activo = TRUE`
    );
    
    const totalInactivos = await query(
      `SELECT COUNT(*) as total FROM usuarios
       WHERE activo = FALSE`
    );
    
    res.json({
      success: true,
      data: {
        total_usuarios: parseInt(totalUsuarios[0].total),
        total_profesores: parseInt(totalProfesores[0].total),
        total_activos: parseInt(totalActivos[0].total),
        total_inactivos: parseInt(totalInactivos[0].total)
      }
    });
    
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas'
    });
  }
};

/**
 * Activar/desactivar usuario (solo admin)
 */
const toggleEstadoUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;
    
    if (typeof activo !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'El campo "activo" debe ser true o false'
      });
    }
    
    // No permitir desactivarse a sí mismo
    if (parseInt(id) === req.usuario.id) {
      return res.status(400).json({
        success: false,
        message: 'No puedes desactivar tu propia cuenta'
      });
    }
    
    // Verificar que el usuario existe
    const usuario = await query(
      'SELECT id, nombre, apellido FROM usuarios WHERE id = $1',
      [id]
    );
    
    if (usuario.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    // Actualizar estado
    await query(
      'UPDATE usuarios SET activo = $1 WHERE id = $2',
      [activo, id]
    );
    
    console.log(`✅ Usuario ${id} ${activo ? 'activado' : 'desactivado'}`);
    
    res.json({
      success: true,
      message: `Usuario ${activo ? 'activado' : 'desactivado'} exitosamente`
    });
    
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar estado del usuario'
    });
  }
};

/**
 * Eliminar usuario permanentemente (solo admin)
 */
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    
    // No permitir eliminarse a sí mismo
    if (parseInt(id) === req.usuario.id) {
      return res.status(400).json({
        success: false,
        message: 'No puedes eliminar tu propia cuenta'
      });
    }
    
    // Verificar que el usuario existe y está inactivo
    const usuario = await query(
      'SELECT id, nombre, apellido, activo FROM usuarios WHERE id = $1',
      [id]
    );
    
    if (usuario.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    if (usuario[0].activo) {
      return res.status(400).json({
        success: false,
        message: 'Solo se pueden eliminar usuarios inactivos. Primero desactiva el usuario.'
      });
    }
    
    // Eliminar usuario (las relaciones se eliminan en cascada)
    await query('DELETE FROM usuarios WHERE id = $1', [id]);
    
    console.log(`🗑️ Usuario ${id} eliminado permanentemente`);
    
    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
    
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario'
    });
  }
};

module.exports = {
  obtenerUsuarios,
  obtenerEstadisticasUsuarios,
  toggleEstadoUsuario,
  eliminarUsuario
};