const express = require('express');
const router = express.Router();
const { verificarToken, verificarRol } = require('../middlewares/auth');
const {
  obtenerUsuarios,
  obtenerEstadisticasUsuarios,
  toggleEstadoUsuario,
  eliminarUsuario
} = require('../controllers/usuariosController');

/**
 * @route   GET /api/usuarios
 * @desc    Obtener todos los usuarios
 * @access  Privado (admin)
 */
router.get('/', verificarToken, verificarRol('administrador'), obtenerUsuarios);

/**
 * @route   GET /api/usuarios/estadisticas
 * @desc    Obtener estadísticas de usuarios
 * @access  Privado (admin)
 */
router.get('/estadisticas', verificarToken, verificarRol('administrador'), obtenerEstadisticasUsuarios);

/**
 * @route   PUT /api/usuarios/:id/estado
 * @desc    Activar/desactivar usuario
 * @access  Privado (admin)
 */
router.put('/:id/estado', verificarToken, verificarRol('administrador'), toggleEstadoUsuario);

/**
 * @route   DELETE /api/usuarios/:id
 * @desc    Eliminar usuario permanentemente (solo inactivos)
 * @access  Privado (admin)
 */
router.delete('/:id', verificarToken, verificarRol('administrador'), eliminarUsuario);

module.exports = router;