const express = require('express');
const router = express.Router();
const { verificarToken, verificarRol } = require('../middlewares/auth');
const {
  obtenerPlanes,
  obtenerMiSuscripcion,
  solicitarSuscripcion,
  subirComprobante,
  obtenerTodasSuscripciones,
  actualizarEstadoSuscripcion
} = require('../controllers/planesController');

/**
 * @route   GET /api/planes
 * @desc    Obtener todos los planes
 * @access  Público
 */
router.get('/', obtenerPlanes);

/**
 * @route   GET /api/planes/mi-suscripcion
 * @desc    Obtener suscripción del usuario
 * @access  Privado
 */
router.get('/mi-suscripcion', verificarToken, obtenerMiSuscripcion);

/**
 * @route   POST /api/planes/solicitar
 * @desc    Solicitar suscripción a un plan
 * @access  Privado (usuario)
 */
router.post('/solicitar', verificarToken, verificarRol('usuario'), solicitarSuscripcion);

/**
 * @route   POST /api/planes/comprobante
 * @desc    Subir comprobante de pago
 * @access  Privado (usuario)
 */
router.post('/comprobante', verificarToken, verificarRol('usuario'), subirComprobante);

/**
 * @route   GET /api/planes/suscripciones
 * @desc    Obtener todas las suscripciones
 * @access  Privado (admin)
 */
router.get('/suscripciones', verificarToken, verificarRol('administrador'), obtenerTodasSuscripciones);

/**
 * @route   PUT /api/planes/suscripciones/:id
 * @desc    Aprobar/rechazar suscripción
 * @access  Privado (admin)
 */
router.put('/suscripciones/:id', verificarToken, verificarRol('administrador'), actualizarEstadoSuscripcion);

module.exports = router;