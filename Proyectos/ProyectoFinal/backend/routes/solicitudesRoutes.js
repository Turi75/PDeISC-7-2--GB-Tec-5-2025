const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth');
const solicitudesController = require('../controllers/solicitudesController');

// Verificación de seguridad
if (!solicitudesController.solicitarCambio) {
    throw new Error("ERROR FATAL: El controlador 'solicitudesController' no exportó funciones correctamente.");
}

// Rutas Usuario
router.post('/crear', verificarToken, solicitudesController.solicitarCambio);
router.get('/estado', verificarToken, solicitudesController.obtenerEstadoSolicitud);

// Rutas Admin
router.get('/admin/pendientes', verificarToken, solicitudesController.obtenerTodasSolicitudes);
router.post('/admin/responder', verificarToken, solicitudesController.responderSolicitud);

module.exports = router;