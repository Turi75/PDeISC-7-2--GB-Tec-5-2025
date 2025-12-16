const express = require('express');
const router = express.Router();
const { verificarToken, verificarRol } = require('../middlewares/auth');
const {
  obtenerConversaciones,
  obtenerMensajes,
  enviarMensaje,
  obtenerProfesores,
  obtenerAlumnos,
  crearComunicado,
  obtenerComunicados
} = require('../controllers/mensajesController');

/**
 * @route   GET /api/mensajes/conversaciones
 * @desc    Obtener conversaciones del usuario
 * @access  Privado
 */
router.get('/conversaciones', verificarToken, obtenerConversaciones);

/**
 * @route   GET /api/mensajes/:usuario_id
 * @desc    Obtener mensajes con un usuario
 * @access  Privado
 */
router.get('/:usuario_id', verificarToken, obtenerMensajes);

/**
 * @route   POST /api/mensajes
 * @desc    Enviar mensaje
 * @access  Privado
 */
router.post('/', verificarToken, enviarMensaje);

/**
 * @route   GET /api/mensajes/usuarios/profesores
 * @desc    Obtener lista de profesores
 * @access  Privado (usuarios) - CORREGIDO: quitado verificarRol
 */
router.get('/usuarios/profesores', verificarToken, obtenerProfesores);

/**
 * @route   GET /api/mensajes/usuarios/alumnos
 * @desc    Obtener lista de alumnos del profesor
 * @access  Privado (profesores)
 */
router.get('/usuarios/alumnos', verificarToken, verificarRol('profesor'), obtenerAlumnos);

/**
 * @route   POST /api/mensajes/comunicados
 * @desc    Crear comunicado general
 * @access  Privado (profesores)
 */
router.post('/comunicados', verificarToken, verificarRol('profesor'), crearComunicado);

/**
 * @route   GET /api/mensajes/comunicados/mis-clases
 * @desc    Obtener comunicados de mis clases
 * @access  Privado (usuarios)
 */
router.get('/comunicados/mis-clases', verificarToken, verificarRol('usuario'), obtenerComunicados);

module.exports = router;