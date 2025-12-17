const express = require('express');
const router = express.Router();
const { verificarToken, verificarRol } = require('../middlewares/auth');
const {
  obtenerAlumnosClase,
  marcarAsistencia,
  marcarAsistenciaMasiva
} = require('../controllers/asistenciaController');

/**
 * @route   GET /api/asistencia/clase/:clase_id
 * @desc    Obtener alumnos inscritos en una clase
 * @access  Privado (profesor)
 */
router.get('/clase/:clase_id', verificarToken, verificarRol('profesor'), obtenerAlumnosClase);

/**
 * @route   PUT /api/asistencia/:inscripcion_id
 * @desc    Marcar asistencia de un alumno individual
 * @access  Privado (profesor)
 */
router.put('/:inscripcion_id', verificarToken, verificarRol('profesor'), marcarAsistencia);

/**
 * @route   POST /api/asistencia/clase/:clase_id/masiva
 * @desc    Marcar asistencia masiva de todos los alumnos
 * @access  Privado (profesor)
 */
router.post('/clase/:clase_id/masiva', verificarToken, verificarRol('profesor'), marcarAsistenciaMasiva);

module.exports = router;