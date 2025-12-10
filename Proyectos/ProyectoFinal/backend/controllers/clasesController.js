const { query } = require('../config/database');

/**
 * Obtener todas las clases disponibles
 */
const obtenerClases = async (req, res) => {
  try {
    const { fecha, tipo_clase_id } = req.query;
    
    let sql = `
      SELECT c.id, c.fecha, c.hora_inicio, c.hora_fin, 
             c.cupos_totales, c.cupos_disponibles, c.estado,
             tc.nombre as tipo_clase, tc.descripcion, tc.imagen,
             u.nombre as profesor_nombre, u.apellido as profesor_apellido
      FROM clases c
      INNER JOIN tipos_clase tc ON c.tipo_clase_id = tc.id
      INNER JOIN usuarios u ON c.profesor_id = u.id
      WHERE c.estado = 'programada' AND c.fecha >= CURRENT_DATE
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (fecha) {
      sql += ` AND c.fecha = $${paramIndex}`;
      params.push(fecha);
      paramIndex++;
    }
    
    if (tipo_clase_id) {
      sql += ` AND c.tipo_clase_id = $${paramIndex}`;
      params.push(tipo_clase_id);
      paramIndex++;
    }
    
    sql += ' ORDER BY c.fecha ASC, c.hora_inicio ASC';
    
    const clases = await query(sql, params);
    
    res.json({
      success: true,
      data: clases
    });
    
  } catch (error) {
    console.error('Error al obtener clases:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener clases'
    });
  }
};

/**
 * Obtener clases del usuario (inscripciones)
 */
const obtenerMisClases = async (req, res) => {
  try {
    const clases = await query(
      `SELECT c.id, c.fecha, c.hora_inicio, c.hora_fin,
              tc.nombre as tipo_clase, tc.descripcion,
              u.nombre as profesor_nombre, u.apellido as profesor_apellido,
              i.asistio, i.fecha_inscripcion
       FROM inscripciones i
       INNER JOIN clases c ON i.clase_id = c.id
       INNER JOIN tipos_clase tc ON c.tipo_clase_id = tc.id
       INNER JOIN usuarios u ON c.profesor_id = u.id
       WHERE i.usuario_id = $1
       ORDER BY c.fecha DESC, c.hora_inicio DESC`,
      [req.usuario.id]
    );
    
    res.json({
      success: true,
      data: clases
    });
    
  } catch (error) {
    console.error('Error al obtener mis clases:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tus clases'
    });
  }
};

/**
 * Inscribirse a una clase
 */
const inscribirseClase = async (req, res) => {
  try {
    const { clase_id } = req.body;
    const usuario_id = req.usuario.id;
    
    if (!clase_id) {
      return res.status(400).json({
        success: false,
        message: 'ID de clase es obligatorio'
      });
    }
    
    // Verificar que la clase existe y tiene cupos
    const clase = await query(
      'SELECT * FROM clases WHERE id = $1 AND estado = $2',
      [clase_id, 'programada']
    );
    
    if (clase.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Clase no encontrada'
      });
    }
    
    if (clase[0].cupos_disponibles <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay cupos disponibles'
      });
    }
    
    // Verificar que el usuario tiene suscripción activa
    const suscripcion = await query(
      `SELECT s.*, p.max_clases, p.max_visitas_semana
       FROM suscripciones s
       INNER JOIN planes p ON s.plan_id = p.id
       WHERE s.usuario_id = $1 AND s.estado = $2 
       AND s.fecha_fin >= CURRENT_DATE`,
      [usuario_id, 'activa']
    );
    
    if (suscripcion.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No tienes una suscripción activa. Por favor, adquiere un plan'
      });
    }
    
    const plan = suscripcion[0];
    
    // Verificar límite de clases si aplica
    if (plan.max_clases !== null) {
      const clasesInscritas = await query(
        `SELECT COUNT(DISTINCT c.tipo_clase_id) as total
         FROM inscripciones i
         INNER JOIN clases c ON i.clase_id = c.id
         WHERE i.usuario_id = $1 AND c.fecha >= CURRENT_DATE`,
        [usuario_id]
      );
      
      if (parseInt(clasesInscritas[0].total) >= plan.max_clases) {
        return res.status(400).json({
          success: false,
          message: `Tu plan permite inscribirte a un máximo de ${plan.max_clases} tipos de clase`
        });
      }
    }
    
    // Verificar límite de visitas semanales si aplica
    if (plan.max_visitas_semana !== null) {
      const inicioSemana = new Date();
      inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay() + 1);
      
      const visitasSemanales = await query(
        `SELECT COUNT(*) as total
         FROM inscripciones i
         INNER JOIN clases c ON i.clase_id = c.id
         WHERE i.usuario_id = $1 AND c.fecha >= $2`,
        [usuario_id, inicioSemana.toISOString().split('T')[0]]
      );
      
      if (parseInt(visitasSemanales[0].total) >= plan.max_visitas_semana) {
        return res.status(400).json({
          success: false,
          message: `Tu plan permite ${plan.max_visitas_semana} visitas por semana`
        });
      }
    }
    
    // Verificar que no esté ya inscrito
    const yaInscrito = await query(
      'SELECT id FROM inscripciones WHERE usuario_id = $1 AND clase_id = $2',
      [usuario_id, clase_id]
    );
    
    if (yaInscrito.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ya estás inscrito en esta clase'
      });
    }
    
    // Inscribir al usuario
    await query(
      'INSERT INTO inscripciones (usuario_id, clase_id) VALUES ($1, $2)',
      [usuario_id, clase_id]
    );
    
    // Actualizar cupos disponibles
    await query(
      'UPDATE clases SET cupos_disponibles = cupos_disponibles - 1 WHERE id = $1',
      [clase_id]
    );
    
    res.status(201).json({
      success: true,
      message: 'Inscripción exitosa'
    });
    
  } catch (error) {
    console.error('Error al inscribirse:', error);
    res.status(500).json({
      success: false,
      message: 'Error al inscribirse a la clase'
    });
  }
};

/**
 * Cancelar inscripción a una clase
 */
const cancelarInscripcion = async (req, res) => {
  try {
    const { clase_id } = req.params;
    const usuario_id = req.usuario.id;
    
    // Verificar que está inscrito
    const inscripcion = await query(
      'SELECT id FROM inscripciones WHERE usuario_id = $1 AND clase_id = $2',
      [usuario_id, clase_id]
    );
    
    if (inscripcion.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No estás inscrito en esta clase'
      });
    }
    
    // Cancelar inscripción
    await query(
      'DELETE FROM inscripciones WHERE usuario_id = $1 AND clase_id = $2',
      [usuario_id, clase_id]
    );
    
    // Liberar cupo
    await query(
      'UPDATE clases SET cupos_disponibles = cupos_disponibles + 1 WHERE id = $1',
      [clase_id]
    );
    
    res.json({
      success: true,
      message: 'Inscripción cancelada'
    });
    
  } catch (error) {
    console.error('Error al cancelar inscripción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cancelar inscripción'
    });
  }
};

/**
 * Crear clase (solo admin)
 */
const crearClase = async (req, res) => {
  try {
    const { tipo_clase_id, profesor_id, fecha, hora_inicio, hora_fin, cupos_totales } = req.body;
    
    if (!tipo_clase_id || !profesor_id || !fecha || !hora_inicio || !hora_fin || !cupos_totales) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios'
      });
    }
    
    const resultado = await query(
      `INSERT INTO clases (tipo_clase_id, profesor_id, fecha, hora_inicio, hora_fin, 
                           cupos_totales, cupos_disponibles)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [tipo_clase_id, profesor_id, fecha, hora_inicio, hora_fin, cupos_totales, cupos_totales]
    );
    
    res.status(201).json({
      success: true,
      message: 'Clase creada exitosamente',
      data: { id: resultado[0].id }
    });
    
  } catch (error) {
    console.error('Error al crear clase:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear clase'
    });
  }
};

/**
 * Generar clases automáticamente desde horarios fijos
 */
const generarClasesSemanales = async (req, res) => {
  try {
    const { fecha_inicio } = req.body;
    const inicio = fecha_inicio ? new Date(fecha_inicio) : new Date();
    
    // Obtener todos los horarios activos
    const horarios = await query(
      `SELECT hc.*, tc.duracion_minutos, tc.capacidad_maxima
       FROM horarios_clase hc
       INNER JOIN tipos_clase tc ON hc.tipo_clase_id = tc.id
       WHERE hc.activo = TRUE`
    );
    
    const diasSemana = {
      'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 'Jueves': 4,
      'Viernes': 5, 'Sábado': 6, 'Domingo': 0
    };
    
    let clasesCreadas = 0;
    
    // Generar clases para los próximos 7 días
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(inicio);
      fecha.setDate(fecha.getDate() + i);
      const diaSemana = fecha.getDay();
      
      // Buscar horarios para este día
      const horariosDelDia = horarios.filter(h => diasSemana[h.dia_semana] === diaSemana);
      
      for (const horario of horariosDelDia) {
        // Verificar si ya existe esta clase
        const existe = await query(
          `SELECT id FROM clases 
           WHERE tipo_clase_id = $1 AND profesor_id = $2 
           AND fecha = $3 AND hora_inicio = $4`,
          [horario.tipo_clase_id, horario.profesor_id, 
           fecha.toISOString().split('T')[0], horario.hora_inicio]
        );
        
        if (existe.length === 0) {
          await query(
            `INSERT INTO clases (tipo_clase_id, profesor_id, fecha, hora_inicio, 
                                 hora_fin, cupos_totales, cupos_disponibles)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [horario.tipo_clase_id, horario.profesor_id, 
             fecha.toISOString().split('T')[0], horario.hora_inicio,
             horario.hora_fin, horario.capacidad_maxima, horario.capacidad_maxima]
          );
          clasesCreadas++;
        }
      }
    }
    
    res.json({
      success: true,
      message: `Se generaron ${clasesCreadas} clases`,
      data: { clasesCreadas }
    });
    
  } catch (error) {
    console.error('Error al generar clases:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar clases'
    });
  }
};

module.exports = {
  obtenerClases,
  obtenerMisClases,
  inscribirseClase,
  cancelarInscripcion,
  crearClase,
  generarClasesSemanales
};