const { pool } = require('../config/database');

// --- USUARIO: Solicitar Cambio ---
const solicitarCambio = async (req, res) => {
  const { plan_id } = req.body;
  
  if (!req.user || !req.user.id) {
    return res.status(401).json({ success: false, message: "No autorizado" });
  }
  
  const usuario_id = req.user.id;

  try {
    const existente = await pool.query(
      "SELECT * FROM solicitudes_cambio_plan WHERE usuario_id = $1 AND estado = 'PENDIENTE'",
      [usuario_id]
    );

    if (existente.rows.length > 0) {
      return res.status(400).json({ success: false, message: "Ya tienes una solicitud en revisión." });
    }

    await pool.query(
      "INSERT INTO solicitudes_cambio_plan (usuario_id, plan_solicitado_id, estado) VALUES ($1, $2, 'PENDIENTE')",
      [usuario_id, plan_id]
    );

    res.json({ success: true, message: "Solicitud enviada." });

  } catch (error) {
    console.error("Error solicitando cambio:", error);
    res.status(500).json({ success: false, message: "Error interno." });
  }
};

// --- USUARIO: Ver Estado ---
const obtenerEstadoSolicitud = async (req, res) => {
  if (!req.user || !req.user.id) return res.status(401).json({ success: false });
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
    res.status(500).json({ success: false, message: "Error obteniendo estado" });
  }
};

// --- ADMIN: Ver Todas ---
const obtenerTodasSolicitudes = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT s.*, u.nombre, u.apellido, u.email, p.nombre as plan_nombre, p.precio
            FROM solicitudes_cambio_plan s
            JOIN usuarios u ON s.usuario_id = u.id
            JOIN planes p ON s.plan_solicitado_id = p.id
            WHERE s.estado = 'PENDIENTE'
            ORDER BY s.fecha_solicitud ASC
        `);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error("Error Admin Solicitudes:", error);
        res.status(500).json({ success: false, message: "Error al cargar solicitudes" });
    }
};

// --- ADMIN: Responder ---
const responderSolicitud = async (req, res) => {
    const { solicitud_id, accion } = req.body;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const solQuery = await client.query("SELECT * FROM solicitudes_cambio_plan WHERE id = $1", [solicitud_id]);
        if (solQuery.rows.length === 0) throw new Error("Solicitud no encontrada");
        const solicitud = solQuery.rows[0];

        if (accion === 'APROBAR') {
            await client.query("UPDATE solicitudes_cambio_plan SET estado = 'APROBADO', fecha_respuesta = NOW() WHERE id = $1", [solicitud_id]);
            await client.query("UPDATE suscripciones SET estado = 'vencida' WHERE usuario_id = $1 AND estado = 'activa'", [solicitud.usuario_id]);
            
            const fechaInicio = new Date();
            const fechaFin = new Date();
            fechaFin.setDate(fechaFin.getDate() + 30);

            await client.query(`
                INSERT INTO suscripciones (usuario_id, plan_id, fecha_inicio, fecha_fin, estado, metodo_pago)
                VALUES ($1, $2, $3, $4, 'activa', 'transferencia')`,
                [solicitud.usuario_id, solicitud.plan_solicitado_id, fechaInicio, fechaFin]
            );

        } else {
            await client.query("UPDATE solicitudes_cambio_plan SET estado = 'RECHAZADO', fecha_respuesta = NOW() WHERE id = $1", [solicitud_id]);
        }

        await client.query('COMMIT');
        res.json({ success: true, message: `Solicitud ${accion === 'APROBAR' ? 'aprobada' : 'rechazada'} correctamente.` });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error respondiendo solicitud:", error);
        res.status(500).json({ success: false, message: "Error al procesar respuesta" });
    } finally {
        client.release();
    }
};

// EXPORTACIÓN UNIFICADA
module.exports = {
    solicitarCambio,
    obtenerEstadoSolicitud,
    obtenerTodasSolicitudes,
    responderSolicitud
};