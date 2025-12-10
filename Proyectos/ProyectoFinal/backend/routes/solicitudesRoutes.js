const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth'); // Usamos el mismo middleware de seguridad que ya tienes
const solicitudesController = require('../controllers/solicitudesController');

// Ruta para crear una solicitud (POST /api/solicitudes/crear)
router.post('/crear', verificarToken, solicitudesController.solicitarCambio);

// Ruta para ver el estado (GET /api/solicitudes/estado)
router.get('/estado', verificarToken, solicitudesController.obtenerEstadoSolicitud);

module.exports = router;