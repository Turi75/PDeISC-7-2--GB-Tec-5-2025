const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth');
const {
  registrar,
  login,
  obtenerPerfil,
  loginGoogle,
  loginGithub
} = require('../controllers/authController');

/**
 * @route   POST /api/auth/registrar
 * @desc    Registrar nuevo usuario
 * @access  Público
 */
router.post('/registrar', registrar);

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión
 * @access  Público
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/perfil
 * @desc    Obtener perfil del usuario autenticado
 * @access  Privado
 */
router.get('/perfil', verificarToken, obtenerPerfil);

/**
 * @route   POST /api/auth/google
 * @desc    Login con Google
 * @access  Público
 */
router.post('/google', loginGoogle);

/**
 * @route   POST /api/auth/github
 * @desc    Login con GitHub
 * @access  Público
 */
router.post('/github', loginGithub);

module.exports = router;