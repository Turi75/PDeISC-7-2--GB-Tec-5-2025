const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth');
const clasesController = require('../controllers/clasesController');

// ==========================================
// Rutas Públicas (o semi-públicas)
// ==========================================

// Obtener todas las clases disponibles (Filtros por fecha/tipo)
// Esta suele ser la que falla si 'obtenerClases' no existe en el controlador
router.get('/', clasesController.obtenerClases); 

// ==========================================
// Rutas Privadas (Requieren Token)
// ==========================================

// Obtener clases donde estoy inscrito
router.get('/mis-clases', verificarToken, clasesController.obtenerMisClases);

// Inscribirse a una clase
router.post('/inscribirse', verificarToken, clasesController.inscribirseClase);

// Cancelar inscripción (usando ID de la clase en la URL)
router.delete('/cancelar/:clase_id', verificarToken, clasesController.cancelarInscripcion);

// ==========================================
// Rutas de Administración (Deberían tener middleware esAdmin idealmente)
// ==========================================

// Crear una clase manualmente
router.post('/crear', verificarToken, clasesController.crearClase);

// Generar clases automáticas para la semana (LA NUEVA FUNCIÓN)
router.post('/generar-semanales', verificarToken, clasesController.generarClasesSemanales);

module.exports = router;