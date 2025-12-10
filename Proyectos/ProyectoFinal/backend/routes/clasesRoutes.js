const express = require('express');
const router = express.Router();
const { verificarToken, verificarRol } = require('../middlewares/auth');
const {
  obtenerClases,
  obtenerMisClases,
  inscribirseClase,
  cancelarInscripcion,
  crearClase,
  generarClasesSemanales
} = require('../controllers/clasesController');

/**
 * @route   GET /api/clases
 * @desc    Obtener todas las clases disponibles
 * @access  Privado
 */
router.get('/', verificarToken, obtenerClases);

/**
 * @route   GET /api/clases/mis-clases
 * @desc    Obtener mis clases (inscripciones)
 * @access  Privado
 */
router.get('/mis-clases', verificarToken, obtenerMisClases);

/**
 * @route   POST /api/clases/inscribirse
 * @desc    Inscribirse a una clase
 * @access  Privado (usuarios)
 */
router.post('/inscribirse', verificarToken, verificarRol('usuario'), inscribirseClase);

/**
 * @route   DELETE /api/clases/inscripcion/:clase_id
 * @desc    Cancelar inscripción
 * @access  Privado (usuarios)
 */
router.delete('/inscripcion/:clase_id', verificarToken, verificarRol('usuario'), cancelarInscripcion);

/**
 * @route   POST /api/clases
 * @desc    Crear clase manualmente
 * @access  Privado (admin)
 */
router.post('/', verificarToken, verificarRol('administrador'), crearClase);

/**
 * @route   POST /api/clases/generar
 * @desc    Generar clases automáticamente desde horarios
 * @access  Privado (admin)
 */
router.post('/generar', verificarToken, verificarRol('administrador'), generarClasesSemanales);

module.exports = router;