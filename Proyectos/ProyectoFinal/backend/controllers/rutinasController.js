const { query } = require('../config/database');

/**
 * Obtener rutinas del usuario
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
 * Asignar rutina a un alumno (solo profesores)
 */
const asignarRutina = async (req, res) => {
  try {
    const { usuario_id, titulo, descripcion, tipo_clase_id } = req.body;
    const profesor_id = req.usuario.id;
    
    if (!usuario_id || !titulo || !descripcion) {
      return res.status(400).json({
        success: false,
        message: 'Usuario, título y descripción son obligatorios'
      });
    }
    
    // Verificar que el usuario existe y está en alguna clase del profesor
    const alumno = await query(
      `SELECT DISTINCT u.id
       FROM usuarios u
       INNER JOIN inscripciones i ON u.id = i.usuario_id
       INNER JOIN clases c ON i.clase_id = c.id
       WHERE u.id = $1 AND c.profesor_id = $2 AND c.fecha >= CURRENT_DATE`,
      [usuario_id, profesor_id]
    );
    
    if (alumno.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'El usuario no está inscrito en ninguna de tus clases'
      });
    }
    
    const fecha_asignacion = new Date().toISOString().split('T')[0];
    
    const resultado = await query(
      `INSERT INTO rutinas (profesor_id, usuario_id, titulo, descripcion, fecha_asignacion, tipo_clase_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [profesor_id, usuario_id, titulo, descripcion, fecha_asignacion, tipo_clase_id || null]
    );
    
    res.status(201).json({
      success: true,
      message: 'Rutina asignada exitosamente',
      data: { id: resultado[0].id }
    });
    
  } catch (error) {
    console.error('Error al asignar rutina:', error);
    res.status(500).json({
      success: false,
      message: 'Error al asignar rutina'
    });
  }
};

/**
 * Obtener rutinas asignadas por el profesor
 */
const obtenerRutinasAsignadas = async (req, res) => {
  try {
    const rutinas = await query(
      `SELECT r.*, 
              u.nombre as alumno_nombre, u.apellido as alumno_apellido,
              tc.nombre as tipo_clase
       FROM rutinas r
       INNER JOIN usuarios u ON r.usuario_id = u.id
       LEFT JOIN tipos_clase tc ON r.tipo_clase_id = tc.id
       WHERE r.profesor_id = $1
       ORDER BY r.created_at DESC`,
      [req.usuario.id]
    );
    
    res.json({
      success: true,
      data: rutinas
    });
    
  } catch (error) {
    console.error('Error al obtener rutinas asignadas:', error);
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
    
    // Verificar que la rutina pertenece al profesor
    const rutina = await query(
      'SELECT id FROM rutinas WHERE id = $1 AND profesor_id = $2',
      [id, profesor_id]
    );
    
    if (rutina.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Rutina no encontrada'
      });
    }
    
    await query(
      'UPDATE rutinas SET titulo = $1, descripcion = $2 WHERE id = $3',
      [titulo, descripcion, id]
    );
    
    res.json({
      success: true,
      message: 'Rutina actualizada'
    });
    
  } catch (error) {
    console.error('Error al actualizar rutina:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar rutina'
    });
  }
};

/**
 * Desactivar rutina
 */
const desactivarRutina = async (req, res) => {
  try {
    const { id } = req.params;
    const profesor_id = req.usuario.id;
    
    // Verificar que la rutina pertenece al profesor
    const rutina = await query(
      'SELECT id FROM rutinas WHERE id = $1 AND profesor_id = $2',
      [id, profesor_id]
    );
    
    if (rutina.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Rutina no encontrada'
      });
    }
    
    await query(
      'UPDATE rutinas SET activa = FALSE WHERE id = $1',
      [id]
    );
    
    res.json({
      success: true,
      message: 'Rutina desactivada'
    });
    
  } catch (error) {
    console.error('Error al desactivar rutina:', error);
    res.status(500).json({
      success: false,
      message: 'Error al desactivar rutina'
    });
  }
};

module.exports = {
  obtenerMisRutinas,
  asignarRutina,
  obtenerRutinasAsignadas,
  actualizarRutina,
  desactivarRutina
};