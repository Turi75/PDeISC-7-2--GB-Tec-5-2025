const { query } = require('../config/database');

/**
 * Obtener alumnos inscritos en una clase específica
 */
const obtenerAlumnosClase = async (req, res) => {
  try {
    const { clase_id } = req.params;
    const profesor_id = req.usuario.id;

    // Verificar que la clase pertenece al profesor
    const clase = await query(
      'SELECT id FROM clases WHERE id = $1 AND profesor_id = $2',
      [clase_id, profesor_id]
    );

    if (clase.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver esta clase'
      });
    }

    // Obtener alumnos inscritos con su estado de asistencia
    const alumnos = await query(
      `SELECT 
        i.id as inscripcion_id,
        i.asistio,
        u.id as usuario_id,
        u.nombre,
        u.apellido,
        u.email,
        u.foto_perfil,
        i.fecha_inscripcion
       FROM inscripciones i
       INNER JOIN usuarios u ON i.usuario_id = u.id
       WHERE i.clase_id = $1
       ORDER BY u.apellido, u.nombre`,
      [clase_id]
    );

    res.json({
      success: true,
      data: alumnos
    });

  } catch (error) {
    console.error('Error al obtener alumnos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener alumnos de la clase'
    });
  }
};

/**
 * Marcar asistencia de un alumno
 */
const marcarAsistencia = async (req, res) => {
  try {
    const { inscripcion_id } = req.params;
    const { asistio } = req.body;
    const profesor_id = req.usuario.id;

    if (typeof asistio !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'El campo "asistio" debe ser true o false'
      });
    }

    // Verificar que la inscripción existe y la clase pertenece al profesor
    const verificacion = await query(
      `SELECT i.id, c.profesor_id
       FROM inscripciones i
       INNER JOIN clases c ON i.clase_id = c.id
       WHERE i.id = $1`,
      [inscripcion_id]
    );

    if (verificacion.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Inscripción no encontrada'
      });
    }

    if (verificacion[0].profesor_id !== profesor_id) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para modificar esta asistencia'
      });
    }

    // Actualizar asistencia
    await query(
      'UPDATE inscripciones SET asistio = $1 WHERE id = $2',
      [asistio, inscripcion_id]
    );

    res.json({
      success: true,
      message: `Asistencia marcada como ${asistio ? 'presente' : 'ausente'}`
    });

  } catch (error) {
    console.error('Error al marcar asistencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error al marcar asistencia'
    });
  }
};

/**
 * Marcar asistencia masiva (todos los alumnos de una clase)
 */
const marcarAsistenciaMasiva = async (req, res) => {
  try {
    const { clase_id } = req.params;
    const { asistencias } = req.body; // Array de { inscripcion_id, asistio }
    const profesor_id = req.usuario.id;

    // Verificar que la clase pertenece al profesor
    const clase = await query(
      'SELECT id FROM clases WHERE id = $1 AND profesor_id = $2',
      [clase_id, profesor_id]
    );

    if (clase.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para modificar esta clase'
      });
    }

    // Validar formato del array
    if (!Array.isArray(asistencias) || asistencias.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Formato de asistencias inválido'
      });
    }

    // Actualizar cada asistencia
    for (const asistencia of asistencias) {
      await query(
        'UPDATE inscripciones SET asistio = $1 WHERE id = $2 AND clase_id = $3',
        [asistencia.asistio, asistencia.inscripcion_id, clase_id]
      );
    }

    res.json({
      success: true,
      message: 'Asistencias actualizadas correctamente',
      data: { actualizadas: asistencias.length }
    });

  } catch (error) {
    console.error('Error al marcar asistencia masiva:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar asistencias'
    });
  }
};

module.exports = {
  obtenerAlumnosClase,
  marcarAsistencia,
  marcarAsistenciaMasiva
};