const { query } = require('../config/database');

/**
 * Obtener rutinas del usuario (Para que el alumno vea sus rutinas)
 */
const obtenerMisRutinas = async (req, res) => {
  try {
    const rutinas = await query(
      `SELECT r.*, 
              u.nombre as profesor_nombre, u.apellido as profesor_apellido,
              tc.nombre as tipo_clase
       FROM rutinas r
       INNER JOIN usuarios u ON r.profesor_id = u.id
       LEFT JOIN tipos_clase tc ON r.tipo_clase_id = tc.id
       WHERE r.usuario_id = $1 AND r.activa = TRUE
       ORDER BY r.created_at DESC`,
      [req.usuario.id]
    );
    
    res.json({
      success: true,
      data: rutinas
    });
    
  } catch (error) {
    console.error('Error al obtener rutinas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tus rutinas'
    });
  }
};

/**
 * SOLUCIÓN ERROR 500: Obtener TODOS los usuarios 'usuario' activos.
 * Se eliminaron los JOINs complejos que causaban el error.
 * Ahora funciona como un buscador global de alumnos.
 */
const obtenerAlumnosParaRutinas = async (req, res) => {
  try {
    console.log('📚 Buscando usuarios registrados para sistema de rutinas...');
    
    // Consulta simplificada y robusta
    // Asume que el rol 'usuario' existe en la tabla roles.
    // Si usas IDs fijos para roles, puedes cambiar la subconsulta por el ID (ej: 2).
    const usuarios = await query(
      `SELECT u.id, u.nombre, u.apellido, u.email, u.dni, u.foto_perfil
       FROM usuarios u
       INNER JOIN roles r ON u.rol_id = r.id
       WHERE r.nombre = 'usuario' AND u.activo = TRUE
       ORDER BY u.nombre ASC`
    );
    
    console.log(`✅ Se encontraron ${usuarios.length} usuarios disponibles.`);
    
    res.json({
      success: true,
      data: usuarios
    });
    
  } catch (error) {
    console.error('❌ Error al obtener usuarios para rutinas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener lista de usuarios'
    });
  }
};

/**
 * Asignar rutina a un usuario
 */
const asignarRutina = async (req, res) => {
  try {
    const { usuario_id, titulo, descripcion, tipo_clase_id } = req.body;
    const profesor_id = req.usuario.id;
    
    console.log('📝 Asignando rutina:', { profesor_id, usuario_id, titulo });
    
    if (!usuario_id || !titulo || !descripcion) {
      return res.status(400).json({
        success: false,
        message: 'Usuario, título y descripción son obligatorios'
      });
    }
    
    const fecha_asignacion = new Date().toISOString().split('T')[0];
    
    const resultado = await query(
      `INSERT INTO rutinas (profesor_id, usuario_id, titulo, descripcion, fecha_asignacion, tipo_clase_id, activa)
       VALUES ($1, $2, $3, $4, $5, $6, TRUE)
       RETURNING id, titulo`,
      [profesor_id, usuario_id, titulo, descripcion, fecha_asignacion, tipo_clase_id || null]
    );
    
    res.status(201).json({
      success: true,
      message: 'Rutina asignada exitosamente',
      data: resultado[0]
    });
    
  } catch (error) {
    console.error('❌ Error al asignar rutina:', error);
    res.status(500).json({
      success: false,
      message: 'Error al asignar rutina'
    });
  }
};

/**
 * Obtener rutinas asignadas por el profesor (Historial)
 */
const obtenerRutinasAsignadas = async (req, res) => {
  try {
    const rutinas = await query(
      `SELECT r.*, 
              u.nombre as alumno_nombre, 
              u.apellido as alumno_apellido,
              u.email as alumno_email
       FROM rutinas r
       INNER JOIN usuarios u ON r.usuario_id = u.id
       WHERE r.profesor_id = $1
       ORDER BY r.created_at DESC`,
      [req.usuario.id]
    );
    
    res.json({
      success: true,
      data: rutinas
    });
    
  } catch (error) {
    console.error('❌ Error al obtener rutinas asignadas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener rutinas asignadas'
    });
  }
};

/**
 * Actualizar rutina
 */
const actualizarRutina = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion } = req.body;
    const profesor_id = req.usuario.id;
    
    const check = await query(
      'SELECT id FROM rutinas WHERE id = $1 AND profesor_id = $2',
      [id, profesor_id]
    );
    
    if (check.length === 0) {
      return res.status(404).json({ success: false, message: 'Rutina no encontrada' });
    }
    
    await query(
      'UPDATE rutinas SET titulo = $1, descripcion = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [titulo, descripcion, id]
    );
    
    res.json({ success: true, message: 'Rutina actualizada' });
    
  } catch (error) {
    console.error('❌ Error al actualizar:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar rutina' });
  }
};

/**
 * Desactivar rutina
 */
const desactivarRutina = async (req, res) => {
  try {
    const { id } = req.params;
    const profesor_id = req.usuario.id;
    
    const check = await query(
      'SELECT id FROM rutinas WHERE id = $1 AND profesor_id = $2',
      [id, profesor_id]
    );
    
    if (check.length === 0) {
      return res.status(404).json({ success: false, message: 'Rutina no encontrada' });
    }
    
    await query(
      'UPDATE rutinas SET activa = FALSE WHERE id = $1',
      [id]
    );
    
    res.json({ success: true, message: 'Rutina eliminada' });
    
  } catch (error) {
    console.error('❌ Error al desactivar:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar rutina' });
  }
};

module.exports = {
  obtenerMisRutinas,
  obtenerAlumnosParaRutinas,
  asignarRutina,
  obtenerRutinasAsignadas,
  actualizarRutina,
  desactivarRutina
};