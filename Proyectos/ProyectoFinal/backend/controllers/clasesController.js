const { query } = require('../config/database');

/**
 * Obtener todas las clases disponibles (Para el Home de alumnos)
 */
const obtenerClases = async (req, res) => {
  try {
    const { fecha, tipo_clase_id } = req.query;
    
    let sql = `
      SELECT c.id, c.fecha, c.hora_inicio, c.hora_fin, 
             c.cupos_totales, c.cupos_disponibles, c.estado,
             tc.nombre as tipo_clase, tc.descripcion, tc.imagen,
             u.nombre as profesor_nombre, u.apellido as profesor_apellido,
             c.profesor_id
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
 * CORREGIDO: Filtra desde el backend las inasistencias pasadas.
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
         AND (c.fecha >= CURRENT_DATE OR i.asistio = TRUE)
       ORDER BY c.fecha ASC, c.hora_inicio ASC`,
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
 * Obtener clases del profesor (Agenda)
 * CORREGIDO: Orden ASCENDENTE para ver lo próximo (Hoy -> Mañana)
 * Se incluye desde el día actual en adelante.
 */
const obtenerClasesProfesor = async (req, res) => {
  try {
    const profesor_id = req.usuario.id;
    
    const clases = await query(
      `SELECT c.id, c.fecha, c.hora_inicio, c.hora_fin,
              c.cupos_totales, c.cupos_disponibles, c.estado,
              tc.nombre as tipo_clase, tc.descripcion,
              (SELECT COUNT(*) FROM inscripciones WHERE clase_id = c.id) as inscritos
       FROM clases c
       INNER JOIN tipos_clase tc ON c.tipo_clase_id = tc.id
       WHERE c.profesor_id = $1
         AND c.fecha >= CURRENT_DATE -- Solo mostrar desde hoy en adelante
       ORDER BY c.fecha ASC, c.hora_inicio ASC -- Orden cronológico correcto
       LIMIT 100`, 
      [profesor_id]
    );
    
    res.json({
      success: true,
      data: clases
    });
    
  } catch (error) {
    console.error('Error al obtener clases del profesor:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tus clases'
    });
  }
};

/**
 * Dashboard Profesor
 */
const obtenerDashboardProfesor = async (req, res) => {
  try {
    const profesor_id = req.usuario.id;
    
    const clasesHoy = await query(
      `SELECT COUNT(*) as total FROM clases 
       WHERE profesor_id = $1 AND fecha = CURRENT_DATE AND estado != 'cancelada'`,
      [profesor_id]
    );

    const totalAlumnos = await query(
      `SELECT COUNT(*) as total FROM usuarios u
       INNER JOIN roles r ON u.rol_id = r.id
       WHERE r.nombre = 'usuario' AND u.activo = TRUE`
    );

    const clasesSemana = await query(
      `SELECT COUNT(*) as total FROM clases 
       WHERE profesor_id = $1 
       AND fecha >= CURRENT_DATE AND fecha <= (CURRENT_DATE + INTERVAL '7 days')
       AND estado != 'cancelada'`,
      [profesor_id]
    );

    const mensajes = await query(
      `SELECT COUNT(*) as total FROM mensajes 
       WHERE destinatario_id = $1 AND leido = FALSE`,
      [profesor_id]
    );

    res.json({
      success: true,
      data: {
        total_clases_hoy: parseInt(clasesHoy[0].total),
        total_alumnos: parseInt(totalAlumnos[0].total),
        total_clases_semana: parseInt(clasesSemana[0].total),
        mensajes_sin_leer: parseInt(mensajes[0].total)
      }
    });

  } catch (error) {
    console.error('Error al obtener dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cargar estadísticas'
    });
  }
};

/**
 * Estadísticas Admin
 */
const obtenerEstadisticasClases = async (req, res) => {
  try {
    const clasesHoy = await query(
      `SELECT COUNT(*) as total FROM clases 
       WHERE fecha = CURRENT_DATE AND estado = 'programada'`
    );
    
    const clasesSemana = await query(
      `SELECT COUNT(*) as total FROM clases 
       WHERE fecha >= CURRENT_DATE AND fecha <= (CURRENT_DATE + INTERVAL '7 days') AND estado = 'programada'`
    );
    
    const proximasClases = await query(
      `SELECT c.id, c.fecha, c.hora_inicio, c.hora_fin,
              c.cupos_totales, c.cupos_disponibles,
              tc.nombre as tipo_clase,
              u.nombre as profesor_nombre, u.apellido as profesor_apellido
       FROM clases c
       INNER JOIN tipos_clase tc ON c.tipo_clase_id = tc.id
       INNER JOIN usuarios u ON c.profesor_id = u.id
       WHERE c.fecha >= CURRENT_DATE AND c.estado = 'programada'
       ORDER BY c.fecha ASC, c.hora_inicio ASC
       LIMIT 10`
    );
    
    res.json({
      success: true,
      data: {
        clases_hoy: parseInt(clasesHoy[0].total),
        clases_semana: parseInt(clasesSemana[0].total),
        proximas_clases: proximasClases
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
 * Inscribirse a una clase
 */
const inscribirseClase = async (req, res) => {
  try {
    const { clase_id } = req.body;
    const usuario_id = req.usuario.id;
    
    if (!clase_id) return res.status(400).json({ success: false, message: 'ID de clase obligatorio' });
    
    const clase = await query('SELECT * FROM clases WHERE id = $1 AND estado = $2', [clase_id, 'programada']);
    
    if (clase.length === 0) return res.status(404).json({ success: false, message: 'Clase no encontrada' });
    if (clase[0].cupos_disponibles <= 0) return res.status(400).json({ success: false, message: 'No hay cupos disponibles' });
    
    const suscripcion = await query(
      `SELECT s.* FROM suscripciones s WHERE s.usuario_id = $1 AND s.estado = 'activa' AND s.fecha_fin >= CURRENT_DATE`,
      [usuario_id]
    );
    
    if (suscripcion.length === 0) return res.status(400).json({ success: false, message: 'No tienes una suscripción activa.' });
    
    const yaInscrito = await query('SELECT id FROM inscripciones WHERE usuario_id = $1 AND clase_id = $2', [usuario_id, clase_id]);
    
    if (yaInscrito.length > 0) return res.status(400).json({ success: false, message: 'Ya estás inscrito en esta clase' });
    
    await query('INSERT INTO inscripciones (usuario_id, clase_id) VALUES ($1, $2)', [usuario_id, clase_id]);
    await query('UPDATE clases SET cupos_disponibles = cupos_disponibles - 1 WHERE id = $1', [clase_id]);
    
    res.status(201).json({ success: true, message: 'Inscripción exitosa' });
    
  } catch (error) {
    console.error('Error al inscribirse:', error);
    res.status(500).json({ success: false, message: 'Error al inscribirse' });
  }
};

/**
 * Cancelar inscripción
 */
const cancelarInscripcion = async (req, res) => {
  try {
    const { clase_id } = req.params;
    const usuario_id = req.usuario.id;
    
    const inscripcion = await query('SELECT id FROM inscripciones WHERE usuario_id = $1 AND clase_id = $2', [usuario_id, clase_id]);
    
    if (inscripcion.length === 0) return res.status(404).json({ success: false, message: 'No estás inscrito en esta clase' });
    
    await query('DELETE FROM inscripciones WHERE usuario_id = $1 AND clase_id = $2', [usuario_id, clase_id]);
    await query('UPDATE clases SET cupos_disponibles = cupos_disponibles + 1 WHERE id = $1', [clase_id]);
    
    res.json({ success: true, message: 'Inscripción cancelada' });
    
  } catch (error) {
    console.error('Error al cancelar inscripción:', error);
    res.status(500).json({ success: false, message: 'Error al cancelar inscripción' });
  }
};

/**
 * Crear clase (admin)
 */
const crearClase = async (req, res) => {
  try {
    const { tipo_clase_id, profesor_id, fecha, hora_inicio, hora_fin, cupos_totales } = req.body;
    
    const resultado = await query(
      `INSERT INTO clases (tipo_clase_id, profesor_id, fecha, hora_inicio, hora_fin, cupos_totales, cupos_disponibles)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [tipo_clase_id, profesor_id, fecha, hora_inicio, hora_fin, cupos_totales, cupos_totales]
    );
    
    res.status(201).json({ success: true, message: 'Clase creada exitosamente', data: { id: resultado[0].id } });
    
  } catch (error) {
    console.error('Error al crear clase:', error);
    res.status(500).json({ success: false, message: 'Error al crear clase' });
  }
};

/**
 * Generar clases automáticamente
 */
const generarClasesSemanales = async (req, res) => {
  try {
    const { fecha_inicio } = req.body;
    const inicio = fecha_inicio ? new Date(fecha_inicio) : new Date();
    
    const horarios = await query(
      `SELECT hc.*, tc.duracion_minutos, tc.capacidad_maxima
       FROM horarios_clase hc
       INNER JOIN tipos_clase tc ON hc.tipo_clase_id = tc.id
       WHERE hc.activo = TRUE`
    );
    
    if (horarios.length === 0) return res.json({ success: true, message: 'No hay horarios configurados', data: { clasesCreadas: 0 } });
    
    const diasSemana = { 'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 'Jueves': 4, 'Viernes': 5, 'Sábado': 6, 'Domingo': 0 };
    let clasesCreadas = 0;
    
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(inicio);
      fecha.setDate(fecha.getDate() + i);
      const diaSemana = fecha.getDay();
      const horariosDelDia = horarios.filter(h => diasSemana[h.dia_semana] === diaSemana);
      
      for (const horario of horariosDelDia) {
        const existe = await query(
          `SELECT id FROM clases WHERE tipo_clase_id = $1 AND profesor_id = $2 AND fecha = $3 AND hora_inicio = $4`,
          [horario.tipo_clase_id, horario.profesor_id, fecha.toISOString().split('T')[0], horario.hora_inicio]
        );
        
        if (existe.length === 0) {
          await query(
            `INSERT INTO clases (tipo_clase_id, profesor_id, fecha, hora_inicio, hora_fin, cupos_totales, cupos_disponibles)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [horario.tipo_clase_id, horario.profesor_id, fecha.toISOString().split('T')[0], horario.hora_inicio, horario.hora_fin, horario.capacidad_maxima, horario.capacidad_maxima]
          );
          clasesCreadas++;
        }
      }
    }
    res.json({ success: true, message: `Se generaron ${clasesCreadas} clases nuevas`, data: { clasesCreadas } });
  } catch (error) {
    console.error('❌ Error al generar clases:', error);
    res.status(500).json({ success: false, message: 'Error al generar clases' });
  }
};

module.exports = {
  obtenerClases,
  obtenerMisClases,
  obtenerClasesProfesor,
  obtenerDashboardProfesor,
  obtenerEstadisticasClases,
  inscribirseClase,
  cancelarInscripcion,
  crearClase,
  generarClasesSemanales
};