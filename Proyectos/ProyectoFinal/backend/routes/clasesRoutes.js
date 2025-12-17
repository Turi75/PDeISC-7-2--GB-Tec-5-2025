const express = require('express');
const router = express.Router();
const { verificarToken, verificarRol } = require('../middlewares/auth');
const {
  obtenerClases,
  obtenerMisClases,
  obtenerClasesProfesor,
  obtenerDashboardProfesor, // Importamos la nueva función
  obtenerEstadisticasClases,
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
 * @route   GET /api/clases/profesor
 * @desc    Obtener clases del profesor
 * @access  Privado (profesor)
 */
router.get('/profesor', verificarToken, verificarRol('profesor'), obtenerClasesProfesor);

/**
 * @route   GET /api/clases/dashboard/profesor
 * @desc    Obtener estadísticas del panel de profesor (NUEVO)
 * @access  Privado (profesor)
 */
router.get('/dashboard/profesor', verificarToken, verificarRol('profesor'), obtenerDashboardProfesor);

/**
 * @route   GET /api/clases/estadisticas
 * @desc    Obtener estadísticas de clases (Admin)
 * @access  Privado (admin)
 */
router.get('/estadisticas', verificarToken, verificarRol('administrador'), obtenerEstadisticasClases);

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