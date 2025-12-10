const { pool } = require('../config/database'); 

// Crear una solicitud de cambio de plan
exports.solicitarCambio = async (req, res) => {
  const { plan_id } = req.body;
  
  if (!req.user || !req.user.id) {
    return res.status(401).json({ success: false, message: "Usuario no autenticado." });
  }

  const usuario_id = req.user.id;

  try {
    const solicitudExistente = await pool.query(
      "SELECT * FROM solicitudes_cambio_plan WHERE usuario_id = $1 AND estado = 'PENDIENTE'",
      [usuario_id]
    );

    if (solicitudExistente.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Ya tienes una solicitud pendiente. Espera a que sea procesada." 
      });
    }

    await pool.query(
      "INSERT INTO solicitudes_cambio_plan (usuario_id, plan_solicitado_id, estado) VALUES ($1, $2, 'PENDIENTE')",
      [usuario_id, plan_id]
    );

    res.json({ success: true, message: "Solicitud enviada correctamente." });

  } catch (error) {
    console.error("Error en solicitarCambio:", error);
    res.status(500).json({ success: false, message: "Error interno al procesar solicitud." });
  }
};

// Obtener estado
exports.obtenerEstadoSolicitud = async (req, res) => {
  if (!req.user || !req.user.id) {
    // Si llegamos aquí, el middleware falló o no inyectó el usuario
    console.error("Error: Usuario no identificado en controller");
    return res.status(401).json({ success: false, message: "No autorizado" });
  }

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

    // IMPORTANTE: Si no hay solicitud, devolvemos success: true y data: null
    // NO devolvemos error.
    if (result.rows.length > 0) {
      res.json({ success: true, data: result.rows[0] });
    } else {
      res.json({ success: true, data: null });
    }
  } catch (error) {
    console.error("Error base de datos (obtenerEstado):", error);
    res.status(500).json({ success: false, message: "Error de servidor" });
  }
};