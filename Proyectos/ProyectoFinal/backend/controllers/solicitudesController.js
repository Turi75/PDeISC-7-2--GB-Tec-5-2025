const pool = require('../db'); // Asegúrate de que esta ruta apunte a tu conexión de base de datos

// Crear una solicitud de cambio de plan
exports.solicitarCambio = async (req, res) => {
  const { plan_id } = req.body;
  const usuario_id = req.user.id; // Asumimos que obtienes el ID del middleware de autenticación

  try {
    // 1. Verificar si ya tiene una solicitud pendiente
    const solicitudExistente = await pool.query(
      "SELECT * FROM solicitudes_cambio_plan WHERE usuario_id = $1 AND estado = 'PENDIENTE'",
      [usuario_id]
    );

    if (solicitudExistente.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Ya tienes una solicitud de cambio de plan en proceso." 
      });
    }

    // 2. Crear la nueva solicitud
    await pool.query(
      "INSERT INTO solicitudes_cambio_plan (usuario_id, plan_solicitado_id, estado) VALUES ($1, $2, 'PENDIENTE')",
      [usuario_id, plan_id]
    );

    res.json({ success: true, message: "Solicitud enviada correctamente. Espera la aprobación del administrador." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al procesar la solicitud." });
  }
};

// Obtener el estado de la solicitud actual del usuario
exports.obtenerEstadoSolicitud = async (req, res) => {
  const usuario_id = req.user.id;

  try {
    const result = await pool.query(
      `SELECT s.*, p.nombre as plan_nombre 
       FROM solicitudes_cambio_plan s
       JOIN planes p ON s.plan_solicitado_id = p.id
       WHERE s.usuario_id = $1 AND s.estado = 'PENDIENTE'
       ORDER BY s.fecha_solicitud DESC LIMIT 1`,
      [usuario_id]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, data: result.rows[0] });
    } else {
      res.json({ success: true, data: null });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al obtener estado." });
  }
};