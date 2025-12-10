const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth');
const clasesController = require('../controllers/clasesController');

// Verificación de seguridad: Si el controlador no cargó, detener aquí para ver el error real
if (!clasesController.obtenerClases) {
    throw new Error("ERROR FATAL: El controlador 'clasesController' no exportó 'obtenerClases'. Revisa el archivo.");
}

// Rutas Públicas (o semi-públicas)
router.get('/', clasesController.obtenerClases); 

// Rutas Privadas
router.get('/mis-clases', verificarToken, clasesController.obtenerMisClases);
router.post('/inscribirse', verificarToken, clasesController.inscribirseClase);
router.delete('/cancelar/:clase_id', verificarToken, clasesController.cancelarInscripcion);

// Rutas Admin
router.post('/crear', verificarToken, clasesController.crearClase);
router.post('/generar-semanales', verificarToken, clasesController.generarClasesSemanales);

module.exports = router;