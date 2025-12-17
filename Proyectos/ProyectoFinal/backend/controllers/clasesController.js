const { query } = require('../config/database');

/**
 * Obtener clases del profesor (Agenda)
 * CORREGIDO: Aseguramos que el ID sea numérico y la fecha sea comparada correctamente
 */
const obtenerClasesProfesor = async (req, res) => {
  try {
    // Convertimos a Int para asegurar compatibilidad con PostgreSQL
    const profesor_id = parseInt(req.usuario.id);
    
    console.log(`👨‍🏫 Buscando clases para Profesor ID: ${profesor_id}`);

    const sql = `
      SELECT c.id, c.fecha, c.hora_inicio, c.hora_fin, 
             c.cupos_totales, c.cupos_disponibles, c.estado,
             tc.nombre as tipo_clase, tc.descripcion, tc.imagen,
             (SELECT COUNT(*) FROM inscripciones WHERE clase_id = c.id) as inscritos
      FROM clases c
      INNER JOIN tipos_clase tc ON c.tipo_clase_id = tc.id
      WHERE c.profesor_id = $1 
        AND c.estado = 'programada' 
        AND c.fecha >= CURRENT_DATE
      ORDER BY c.fecha ASC, c.hora_inicio ASC
    `;

    const clases = await query(sql, [profesor_id]);
    
    console.log(`✅ Clases encontradas para profesor ${profesor_id}: ${clases.length}`);

    res.json({
      success: true,
      data: clases
    });
    
  } catch (error) {
    console.error('❌ Error al obtener clases del profesor:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tus clases'
    });
  }
};

/**
 * Dashboard Profesor
 * CORREGIDO: Lógica de conteo robusta
 */
const obtenerDashboardProfesor = async (req, res) => {
  try {
    const profesor_id = parseInt(req.usuario.id);
    
    // 1. Clases de Hoy (Usamos DATE() para evitar problemas de formato)
    const clasesHoy = await query(
      `SELECT COUNT(*) as total FROM clases 
       WHERE profesor_id = $1 
       AND fecha = CURRENT_DATE 
       AND estado = 'programada'`,
      [profesor_id]
    );

    // 2. Alumnos Activos (Total del sistema)
    const totalAlumnos = await query(
      `SELECT COUNT(*) as total FROM usuarios u
       INNER JOIN roles r ON u.rol_id = r.id
       WHERE r.nombre = 'usuario' AND u.activo = TRUE`
    );

    // 3. Clases de la Semana (Desde hoy en adelante)
    const clasesSemana = await query(
      `SELECT COUNT(*) as total FROM clases 
       WHERE profesor_id = $1 
       AND fecha >= CURRENT_DATE 
       AND fecha <= (CURRENT_DATE + INTERVAL '7 days')
       AND estado = 'programada'`,
      [profesor_id]
    );

    // 4. Mensajes sin leer
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

// ... (Mantén el resto de funciones igual: obtenerClases, inscribirseClase, etc.)

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