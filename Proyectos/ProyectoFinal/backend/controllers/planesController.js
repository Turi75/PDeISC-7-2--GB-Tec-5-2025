const { query } = require('../config/database');

/**
 * Obtener todos los planes disponibles
 */
const obtenerPlanes = async (req, res) => {
  try {
    const planes = await query(
      'SELECT * FROM planes ORDER BY precio ASC'
    );
    
    res.json({
      success: true,
      data: planes
    });
    
  } catch (error) {
    console.error('Error al obtener planes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener planes'
    });
  }
};

/**
 * Obtener suscripción del usuario
 */
const obtenerMiSuscripcion = async (req, res) => {
  try {
    const suscripcion = await query(
      `SELECT s.*, p.nombre as plan_nombre, p.descripcion as plan_descripcion,
              p.precio, p.max_clases, p.max_visitas_semana
       FROM suscripciones s
       INNER JOIN planes p ON s.plan_id = p.id
       WHERE s.usuario_id = $1
       ORDER BY s.created_at DESC
       LIMIT 1`,
      [req.usuario.id]
    );
    
    if (suscripcion.length === 0) {
      return res.json({
        success: true,
        data: null,
        message: 'No tienes ninguna suscripción'
      });
    }
    
    res.json({
      success: true,
      data: suscripcion[0]
    });
    
  } catch (error) {
    console.error('Error al obtener suscripción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tu suscripción'
    });
  }
};

/**
 * Solicitar suscripción a un plan
 */
const solicitarSuscripcion = async (req, res) => {
  try {
    const { plan_id, metodo_pago } = req.body;
    const usuario_id = req.usuario.id;
    
    if (!plan_id) {
      return res.status(400).json({
        success: false,
        message: 'Plan es obligatorio'
      });
    }
    
    // Verificar que el plan existe
    const plan = await query(
      'SELECT * FROM planes WHERE id = $1',
      [plan_id]
    );
    
    if (plan.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Plan no encontrado'
      });
    }
    
    // Verificar si ya tiene una suscripción activa o pendiente
    const suscripcionActiva = await query(
      `SELECT id FROM suscripciones 
       WHERE usuario_id = $1 AND estado IN ('activa', 'pendiente')`,
      [usuario_id]
    );
    
    if (suscripcionActiva.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ya tienes una suscripción activa o pendiente'
      });
    }
    
    // Crear suscripción pendiente (30 días)
    const fecha_inicio = new Date();
    const fecha_fin = new Date();
    fecha_fin.setDate(fecha_fin.getDate() + 30);
    
    const resultado = await query(
      `INSERT INTO suscripciones (usuario_id, plan_id, fecha_inicio, fecha_fin, estado, metodo_pago)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [usuario_id, plan_id, 
       fecha_inicio.toISOString().split('T')[0],
       fecha_fin.toISOString().split('T')[0],
       'pendiente',
       metodo_pago || 'transferencia']
    );
    
    res.status(201).json({
      success: true,
      message: 'Solicitud de suscripción enviada. Un administrador la revisará pronto',
      data: { id: resultado[0].id }
    });
    
  } catch (error) {
    console.error('Error al solicitar suscripción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al solicitar suscripción'
    });
  }
};

/**
 * NUEVO - Solicitar cambio de suscripción
 */
const solicitarCambioSuscripcion = async (req, res) => {
  try {
    const { plan_id, metodo_pago } = req.body;
    const usuario_id = req.usuario.id;
    
    if (!plan_id) {
      return res.status(400).json({
        success: false,
        message: 'Plan es obligatorio'
      });
    }
    
    // Verificar que el plan existe
    const plan = await query(
      'SELECT * FROM planes WHERE id = $1',
      [plan_id]
    );
    
    if (plan.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Plan no encontrado'
      });
    }
    
    // Obtener suscripción actual
    const suscripcionActual = await query(
      `SELECT * FROM suscripciones 
       WHERE usuario_id = $1 AND estado = 'activa'
       ORDER BY created_at DESC LIMIT 1`,
      [usuario_id]
    );
    
    if (suscripcionActual.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No tienes una suscripción activa para cambiar'
      });
    }
    
    // Verificar que no sea el mismo plan
    if (suscripcionActual[0].plan_id === plan_id) {
      return res.status(400).json({
        success: false,
        message: 'Ya tienes este plan activo'
      });
    }
    
    // Verificar si ya hay un cambio pendiente
    const cambioPendiente = await query(
      `SELECT id FROM suscripciones 
       WHERE usuario_id = $1 AND estado = 'pendiente'`,
      [usuario_id]
    );
    
    if (cambioPendiente.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ya tienes un cambio de plan pendiente de aprobación'
      });
    }
    
    // Crear nueva suscripción pendiente (mantiene fecha actual)
    const fecha_inicio = new Date();
    const fecha_fin = new Date(suscripcionActual[0].fecha_fin);
    
    const resultado = await query(
      `INSERT INTO suscripciones (usuario_id, plan_id, fecha_inicio, fecha_fin, estado, metodo_pago)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [usuario_id, plan_id, 
       fecha_inicio.toISOString().split('T')[0],
       fecha_fin.toISOString().split('T')[0],
       'pendiente',
       metodo_pago || 'transferencia']
    );
    
    res.status(201).json({
      success: true,
      message: 'Solicitud de cambio de plan enviada. Un administrador la revisará pronto',
      data: { id: resultado[0].id }
    });
    
  } catch (error) {
    console.error('Error al solicitar cambio:', error);
    res.status(500).json({
      success: false,
      message: 'Error al solicitar cambio de plan'
    });
  }
};

/**
 * Subir comprobante de pago
 */
const subirComprobante = async (req, res) => {
  try {
    const { comprobante } = req.body;
    const usuario_id = req.usuario.id;
    
    if (!comprobante) {
      return res.status(400).json({
        success: false,
        message: 'Comprobante es obligatorio'
      });
    }
    
    // Buscar suscripción pendiente
    const suscripcion = await query(
      `SELECT id FROM suscripciones 
       WHERE usuario_id = $1 AND estado = $2
       ORDER BY created_at DESC LIMIT 1`,
      [usuario_id, 'pendiente']
    );
    
    if (suscripcion.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No tienes ninguna suscripción pendiente'
      });
    }
    
    // Actualizar comprobante
    await query(
      'UPDATE suscripciones SET comprobante = $1 WHERE id = $2',
      [comprobante, suscripcion[0].id]
    );
    
    res.json({
      success: true,
      message: 'Comprobante enviado exitosamente'
    });
    
  } catch (error) {
    console.error('Error al subir comprobante:', error);
    res.status(500).json({
      success: false,
      message: 'Error al subir comprobante'
    });
  }
};

/**
 * Obtener todas las suscripciones (solo admin)
 */
const obtenerTodasSuscripciones = async (req, res) => {
  try {
    const { estado } = req.query;
    
    let sql = `
      SELECT s.*, 
             u.nombre as usuario_nombre, u.apellido as usuario_apellido, u.email as usuario_email,
             p.nombre as plan_nombre, p.precio
      FROM suscripciones s
      INNER JOIN usuarios u ON s.usuario_id = u.id
      INNER JOIN planes p ON s.plan_id = p.id
    `;
    
    const params = [];
    
    if (estado) {
      sql += ' WHERE s.estado = $1';
      params.push(estado);
    }
    
    sql += ' ORDER BY s.created_at DESC';
    
    const suscripciones = await query(sql, params);
    
    res.json({
      success: true,
      data: suscripciones
    });
    
  } catch (error) {
    console.error('Error al obtener suscripciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener suscripciones'
    });
  }
};

/**
 * Aprobar/rechazar suscripción (solo admin) - MEJORADO
 */
const actualizarEstadoSuscripcion = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    
    if (!['activa', 'cancelada'].includes(estado)) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido. Debe ser "activa" o "cancelada"'
      });
    }
    
    // Obtener la suscripción pendiente
    const suscripcionPendiente = await query(
      'SELECT * FROM suscripciones WHERE id = $1',
      [id]
    );
    
    if (suscripcionPendiente.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Suscripción no encontrada'
      });
    }
    
    const usuario_id = suscripcionPendiente[0].usuario_id;
    
    if (estado === 'activa') {
      // Si se aprueba, cancelar cualquier suscripción activa anterior
      await query(
        `UPDATE suscripciones 
         SET estado = 'cancelada' 
         WHERE usuario_id = $1 AND estado = 'activa' AND id != $2`,
        [usuario_id, id]
      );
    }
    
    // Actualizar el estado de la suscripción
    await query(
      'UPDATE suscripciones SET estado = $1 WHERE id = $2',
      [estado, id]
    );
    
    res.json({
      success: true,
      message: `Suscripción ${estado === 'activa' ? 'aprobada' : 'rechazada'} exitosamente`
    });
    
  } catch (error) {
    console.error('Error al actualizar suscripción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar suscripción'
    });
  }
};

module.exports = {
  obtenerPlanes,
  obtenerMiSuscripcion,
  solicitarSuscripcion,
  solicitarCambioSuscripcion, // NUEVO
  subirComprobante,
  obtenerTodasSuscripciones,
  actualizarEstadoSuscripcion
};