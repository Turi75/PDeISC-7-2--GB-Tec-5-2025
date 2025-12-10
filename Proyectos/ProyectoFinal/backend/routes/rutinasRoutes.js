const express = require('express');
const router = express.Router();
const { verificarToken, verificarRol } = require('../middlewares/auth');
const {
  obtenerMisRutinas,
  asignarRutina,
  obtenerRutinasAsignadas,
  actualizarRutina,
  desactivarRutina
} = require('../controllers/rutinasController');

/**
 * @route   GET /api/rutinas
 * @desc    Obtener mis rutinas
 * @access  Privado (usuarios)
 */
router.get('/', verificarToken, verificarRol('usuario'), obtenerMisRutinas);

/**
 * @route   POST /api/rutinas
 * @desc    Asignar rutina a alumno
 * @access  Privado (profesores)
 */
router.post('/', verificarToken, verificarRol('profesor'), asignarRutina);

/**
 * @route   GET /api/rutinas/asignadas
 * @desc    Obtener rutinas asignadas por el profesor
 * @access  Privado (profesores)
 */
router.get('/asignadas', verificarToken, verificarRol('profesor'), obtenerRutinasAsignadas);

/**
 * @route   PUT /api/rutinas/:id
 * @desc    Actualizar rutina
 * @access  Privado (profesores)
 */
router.put('/:id', verificarToken, verificarRol('profesor'), actualizarRutina);

/**
 * @route   DELETE /api/rutinas/:id
 * @desc    Desactivar rutina
 * @access  Privado (profesores)
 */
router.delete('/:id', verificarToken, verificarRol('profesor'), desactivarRutina);

module.exports = router;