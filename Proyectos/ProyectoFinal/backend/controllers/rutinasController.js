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
 * Obtener todos los alumnos (usuarios) disponibles para asignar rutinas
 * Sin restricción de que estén en clases del profesor
 */
const obtenerAlumnosParaRutinas = async (req, res) => {
  try {
    console.log('📚 Obteniendo todos los alumnos para asignar rutinas...');
    
    const alumnos = await query(
      `SELECT 
        u.id,
        u.nombre,
        u.apellido,
        u.email,
        u.dni,
        COUNT(DISTINCT i.clase_id) as total_clases_inscritas,
        STRING_AGG(DISTINCT tc.nombre, ', ') as clases_inscritas
       FROM usuarios u
       LEFT JOIN inscripciones i ON u.id = i.usuario_id
       LEFT JOIN clases c ON i.clase_id = c.id
       LEFT JOIN tipos_clase tc ON c.tipo_clase_id = tc.id
       WHERE u.rol = 'usuario' AND u.activo = TRUE
       GROUP BY u.id, u.nombre, u.apellido, u.email, u.dni
       ORDER BY u.nombre, u.apellido`
    );
    
    console.log(`✅ Se encontraron ${alumnos.length} alumnos`);
    
    res.json({
      success: true,
      data: alumnos
    });
    
  } catch (error) {
    console.error('❌ Error al obtener alumnos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener alumnos'
    });
  }
};

/**
 * Asignar rutina a un alumno (solo profesores)
 * VERSIÓN MEJORADA: Permite asignar a cualquier usuario activo
 */
const asignarRutina = async (req, res) => {
  try {
    const { usuario_id, titulo, descripcion, tipo_clase_id } = req.body;
    const profesor_id = req.usuario.id;
    
    console.log('📝 Intentando asignar rutina:', {
      profesor_id,
      usuario_id,
      titulo,
      descripcion
    });
    
    // Validar campos obligatorios
    if (!usuario_id || !titulo || !descripcion) {
      return res.status(400).json({
        success: false,
        message: 'Usuario, título y descripción son obligatorios'
      });
    }
    
    // Verificar que el usuario existe y es un alumno activo
    const alumno = await query(
      `SELECT id, nombre, apellido, email 
       FROM usuarios 
       WHERE id = $1 AND rol = 'usuario' AND activo = TRUE`,
      [usuario_id]
    );
    
    if (alumno.length === 0) {
      console.log('❌ Usuario no encontrado o inactivo');
      return res.status(404).json({
        success: false,
        message: 'El usuario no existe o no está activo'
      });
    }
    
    console.log('✅ Alumno encontrado:', alumno[0]);
    
    // Crear la rutina
    const fecha_asignacion = new Date().toISOString().split('T')[0];
    
    const resultado = await query(
      `INSERT INTO rutinas (profesor_id, usuario_id, titulo, descripcion, fecha_asignacion, tipo_clase_id, activa)
       VALUES ($1, $2, $3, $4, $5, $6, TRUE)
       RETURNING id, titulo, descripcion, fecha_asignacion`,
      [profesor_id, usuario_id, titulo, descripcion, fecha_asignacion, tipo_clase_id || null]
    );
    
    console.log('✅ Rutina creada exitosamente:', resultado[0]);
    
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
 * Obtener rutinas asignadas por el profesor
 */
const obtenerRutinasAsignadas = async (req, res) => {
  try {
    console.log('📚 Obteniendo rutinas asignadas del profesor:', req.usuario.id);
    
    const rutinas = await query(
      `SELECT r.*, 
              u.nombre as alumno_nombre, 
              u.apellido as alumno_apellido,
              u.email as alumno_email,
              tc.nombre as tipo_clase
       FROM rutinas r
       INNER JOIN usuarios u ON r.usuario_id = u.id
       LEFT JOIN tipos_clase tc ON r.tipo_clase_id = tc.id
       WHERE r.profesor_id = $1
       ORDER BY r.created_at DESC`,
      [req.usuario.id]
    );
    
    console.log(`✅ Se encontraron ${rutinas.length} rutinas asignadas`);
    
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
    
    console.log('✏️ Actualizando rutina:', { id, profesor_id, titulo });
    
    // Validar campos
    if (!titulo || !descripcion) {
      return res.status(400).json({
        success: false,
        message: 'Título y descripción son obligatorios'
      });
    }
    
    // Verificar que la rutina pertenece al profesor
    const rutina = await query(
      'SELECT id, titulo FROM rutinas WHERE id = $1 AND profesor_id = $2',
      [id, profesor_id]
    );
    
    if (rutina.length === 0) {
      console.log('❌ Rutina no encontrada');
      return res.status(404).json({
        success: false,
        message: 'Rutina no encontrada o no tienes permiso para modificarla'
      });
    }
    
    // Actualizar la rutina
    await query(
      'UPDATE rutinas SET titulo = $1, descripcion = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [titulo, descripcion, id]
    );
    
    console.log('✅ Rutina actualizada exitosamente');
    
    res.json({
      success: true,
      message: 'Rutina actualizada exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error al actualizar rutina:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar rutina'
    });
  }
};

/**
 * Desactivar rutina (soft delete)
 */
const desactivarRutina = async (req, res) => {
  try {
    const { id } = req.params;
    const profesor_id = req.usuario.id;
    
    console.log('🗑️ Desactivando rutina:', { id, profesor_id });
    
    // Verificar que la rutina pertenece al profesor
    const rutina = await query(
      'SELECT id, titulo, activa FROM rutinas WHERE id = $1 AND profesor_id = $2',
      [id, profesor_id]
    );
    
    if (rutina.length === 0) {
      console.log('❌ Rutina no encontrada');
      return res.status(404).json({
        success: false,
        message: 'Rutina no encontrada o no tienes permiso para desactivarla'
      });
    }
    
    if (!rutina[0].activa) {
      console.log('⚠️ La rutina ya estaba desactivada');
      return res.status(400).json({
        success: false,
        message: 'La rutina ya está desactivada'
      });
    }
    
    // Desactivar la rutina
    await query(
      'UPDATE rutinas SET activa = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );
    
    console.log('✅ Rutina desactivada exitosamente');
    
    res.json({
      success: true,
      message: 'Rutina desactivada exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error al desactivar rutina:', error);
    res.status(500).json({
      success: false,
      message: 'Error al desactivar rutina'
    });
  }
};

module.exports = {
  obtenerMisRutinas,
  obtenerAlumnosParaRutinas,  // NUEVO
  asignarRutina,
  obtenerRutinasAsignadas,
  actualizarRutina,
  desactivarRutina
};