const express = require('express');
const router = express.Router();
const { verificarToken, esAdmin } = require('../middlewares/auth'); // Asegurate de tener esAdmin
const solicitudesController = require('../controllers/solicitudesController');

// Rutas de Usuario
router.post('/crear', verificarToken, solicitudesController.solicitarCambio);
router.get('/estado', verificarToken, solicitudesController.obtenerEstadoSolicitud);

// Rutas de Admin
// Importante: Agregamos el middleware 'esAdmin' para seguridad si lo tienes, si no, solo verificarToken
router.get('/admin/pendientes', verificarToken, solicitudesController.obtenerTodasSolicitudes);
router.post('/admin/responder', verificarToken, solicitudesController.responderSolicitud);

module.exports = router;