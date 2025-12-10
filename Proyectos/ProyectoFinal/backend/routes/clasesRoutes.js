const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth');
const clasesController = require('../controllers/clasesController');

// Verificación de seguridad
if (!clasesController.generarClasesSemanales) {
    throw new Error("ERROR CRÍTICO: El controlador no exportó 'generarClasesSemanales'.");
}

// Rutas Públicas
router.get('/', clasesController.obtenerClases);

// Rutas Privadas
router.get('/mis-clases', verificarToken, clasesController.obtenerMisClases);
router.post('/inscribirse', verificarToken, clasesController.inscribirseClase);
router.delete('/cancelar/:clase_id', verificarToken, clasesController.cancelarInscripcion);

// Rutas Admin (IMPORTANTE: Esta es la que usa el botón naranja)
// Antes se llamaba '/generar', ahora '/generar-semanales' para ser consistentes
router.post('/generar-semanales', verificarToken, clasesController.generarClasesSemanales);
router.post('/crear', verificarToken, clasesController.crearClase);

module.exports = router;