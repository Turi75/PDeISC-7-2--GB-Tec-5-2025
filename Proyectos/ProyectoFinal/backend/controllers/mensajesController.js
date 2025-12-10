const { query } = require('../config/database');

/**
 * Obtener conversaciones del usuario
 */
const obtenerConversaciones = async (req, res) => {
  try {
    const usuario_id = req.usuario.id;
    
    // Obtener lista de usuarios con los que ha intercambiado mensajes
    const conversaciones = await query(
      `SELECT DISTINCT 
        CASE 
          WHEN m.remitente_id = $1 THEN m.destinatario_id
          ELSE m.remitente_id
        END as usuario_id,
        u.nombre, u.apellido, u.foto_perfil,
        r.nombre as rol,
        (SELECT mensaje FROM mensajes 
         WHERE (remitente_id = $2 AND destinatario_id = (
           CASE WHEN m.remitente_id = $3 THEN m.destinatario_id ELSE m.remitente_id END
         )) 
            OR (remitente_id = (
           CASE WHEN m.remitente_id = $4 THEN m.destinatario_id ELSE m.remitente_id END
         ) AND destinatario_id = $5)
         ORDER BY created_at DESC LIMIT 1) as ultimo_mensaje,
        (SELECT created_at FROM mensajes 
         WHERE (remitente_id = $6 AND destinatario_id = (
           CASE WHEN m.remitente_id = $7 THEN m.destinatario_id ELSE m.remitente_id END
         )) 
            OR (remitente_id = (
           CASE WHEN m.remitente_id = $8 THEN m.destinatario_id ELSE m.remitente_id END
         ) AND destinatario_id = $9)
         ORDER BY created_at DESC LIMIT 1) as fecha_ultimo_mensaje,
        (SELECT COUNT(*) FROM mensajes 
         WHERE remitente_id = (
           CASE WHEN m.remitente_id = $10 THEN m.destinatario_id ELSE m.remitente_id END
         ) AND destinatario_id = $11 AND leido = FALSE) as mensajes_sin_leer
      FROM mensajes m
      INNER JOIN usuarios u ON 
        (CASE 
          WHEN m.remitente_id = $12 THEN m.destinatario_id
          ELSE m.remitente_id
        END) = u.id
      INNER JOIN roles r ON u.rol_id = r.id
      WHERE m.remitente_id = $13 OR m.destinatario_id = $14
      ORDER BY fecha_ultimo_mensaje DESC`,
      [usuario_id, usuario_id, usuario_id, usuario_id, usuario_id, 
       usuario_id, usuario_id, usuario_id, usuario_id, usuario_id,
       usuario_id, usuario_id, usuario_id, usuario_id]
    );
    
    res.json({
      success: true,
      data: conversaciones
    });
    
  } catch (error) {
    console.error('Error al obtener conversaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener conversaciones'
    });
  }
};

/**
 * Obtener mensajes con un usuario específico
 */
const obtenerMensajes = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const mi_id = req.usuario.id;
    
    const mensajes = await query(
      `SELECT m.*, 
              u.nombre as remitente_nombre, u.apellido as remitente_apellido
       FROM mensajes m
       INNER JOIN usuarios u ON m.remitente_id = u.id
       WHERE (m.remitente_id = $1 AND m.destinatario_id = $2)
          OR (m.remitente_id = $3 AND m.destinatario_id = $4)
       ORDER BY m.created_at ASC`,
      [mi_id, usuario_id, usuario_id, mi_id]
    );
    
    // Marcar como leídos los mensajes recibidos
    await query(
      `UPDATE mensajes SET leido = TRUE 
       WHERE remitente_id = $1 AND destinatario_id = $2 AND leido = FALSE`,
      [usuario_id, mi_id]
    );
    
    res.json({
      success: true,
      data: mensajes
    });
    
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener mensajes'
    });
  }
};

/**
 * Enviar mensaje
 */
const enviarMensaje = async (req, res) => {
  try {
    const { destinatario_id, mensaje } = req.body;
    const remitente_id = req.usuario.id;
    
    if (!destinatario_id || !mensaje) {
      return res.status(400).json({
        success: false,
        message: 'Destinatario y mensaje son obligatorios'
      });
    }
    
    // Verificar que el destinatario existe
    const destinatario = await query(
      'SELECT id FROM usuarios WHERE id = $1 AND activo = TRUE',
      [destinatario_id]
    );
    
    if (destinatario.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Destinatario no encontrado'
      });
    }
    
    const resultado = await query(
      'INSERT INTO mensajes (remitente_id, destinatario_id, mensaje) VALUES ($1, $2, $3) RETURNING id',
      [remitente_id, destinatario_id, mensaje]
    );
    
    res.status(201).json({
      success: true,
      message: 'Mensaje enviado',
      data: { id: resultado[0].id }
    });
    
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    res.status(500).json({
      success: false,
      message: 'Error al enviar mensaje'
    });
  }
};

/**
 * Obtener profesores disponibles para chatear
 */
const obtenerProfesores = async (req, res) => {
  try {
    const profesores = await query(
      `SELECT u.id, u.nombre, u.apellido, u.foto_perfil,
              STRING_AGG(DISTINCT tc.nombre, ', ') as clases
       FROM usuarios u
       INNER JOIN roles r ON u.rol_id = r.id
       LEFT JOIN horarios_clase hc ON u.id = hc.profesor_id AND hc.activo = TRUE
       LEFT JOIN tipos_clase tc ON hc.tipo_clase_id = tc.id
       WHERE r.nombre = $1 AND u.activo = TRUE
       GROUP BY u.id, u.nombre, u.apellido, u.foto_perfil`,
      ['profesor']
    );
    
    res.json({
      success: true,
      data: profesores
    });
    
  } catch (error) {
    console.error('Error al obtener profesores:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener profesores'
    });
  }
};

/**
 * Obtener alumnos del profesor
 */
const obtenerAlumnos = async (req, res) => {
  try {
    const profesor_id = req.usuario.id;
    
    // Obtener alumnos inscritos en las clases del profesor
    const alumnos = await query(
      `SELECT DISTINCT u.id, u.nombre, u.apellido, u.foto_perfil, u.email,
              STRING_AGG(DISTINCT tc.nombre, ', ') as clases_inscritas
       FROM usuarios u
       INNER JOIN inscripciones i ON u.id = i.usuario_id
       INNER JOIN clases c ON i.clase_id = c.id
       INNER JOIN tipos_clase tc ON c.tipo_clase_id = tc.id
       WHERE c.profesor_id = $1 AND c.fecha >= CURRENT_DATE
       GROUP BY u.id, u.nombre, u.apellido, u.foto_perfil, u.email`,
      [profesor_id]
    );
    
    res.json({
      success: true,
      data: alumnos
    });
    
  } catch (error) {
    console.error('Error al obtener alumnos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener alumnos'
    });
  }
};

/**
 * Crear comunicado general (solo profesores)
 */
const crearComunicado = async (req, res) => {
  try {
    const { tipo_clase_id, titulo, contenido } = req.body;
    const profesor_id = req.usuario.id;
    
    if (!tipo_clase_id || !titulo || !contenido) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios'
      });
    }
    
    const resultado = await query(
      'INSERT INTO comunicados (profesor_id, tipo_clase_id, titulo, contenido) VALUES ($1, $2, $3, $4) RETURNING id',
      [profesor_id, tipo_clase_id, titulo, contenido]
    );
    
    res.status(201).json({
      success: true,
      message: 'Comunicado publicado',
      data: { id: resultado[0].id }
    });
    
  } catch (error) {
    console.error('Error al crear comunicado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear comunicado'
    });
  }
};

/**
 * Obtener comunicados de las clases del usuario
 */
const obtenerComunicados = async (req, res) => {
  try {
    const usuario_id = req.usuario.id;
    
    const comunicados = await query(
      `SELECT DISTINCT c.*, 
              tc.nombre as tipo_clase,
              u.nombre as profesor_nombre, u.apellido as profesor_apellido
       FROM comunicados c
       INNER JOIN tipos_clase tc ON c.tipo_clase_id = tc.id
       INNER JOIN usuarios u ON c.profesor_id = u.id
       INNER JOIN inscripciones i ON i.usuario_id = $1
       INNER JOIN clases cl ON i.clase_id = cl.id AND cl.tipo_clase_id = c.tipo_clase_id
       WHERE cl.fecha >= CURRENT_DATE
       ORDER BY c.created_at DESC
       LIMIT 20`,
      [usuario_id]
    );
    
    res.json({
      success: true,
      data: comunicados
    });
    
  } catch (error) {
    console.error('Error al obtener comunicados:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener comunicados'
    });
  }
};

module.exports = {
  obtenerConversaciones,
  obtenerMensajes,
  enviarMensaje,
  obtenerProfesores,
  obtenerAlumnos,
  crearComunicado,
  obtenerComunicados
};