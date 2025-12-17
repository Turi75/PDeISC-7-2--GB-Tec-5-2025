const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initializeDatabase } = require('./config/database');

// ============================================
// IMPORTAR RUTAS
// ============================================
const authRoutes = require('./routes/authRoutes');
const clasesRoutes = require('./routes/clasesRoutes');
const planesRoutes = require('./routes/planesRoutes');
const mensajesRoutes = require('./routes/mensajesRoutes');
const rutinasRoutes = require('./routes/rutinasRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes'); // NUEVO

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARES
// ============================================

// CORS - Configuración CORREGIDA para permitir APK y desarrollo
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (como mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Permitir TODOS los orígenes en producción para APK
    // También permite localhost para desarrollo
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-JSON'],
  maxAge: 86400 // 24 horas
};

// IMPORTANTE: Aplicar CORS ANTES de cualquier otra cosa
app.use(cors(corsOptions));

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware (opcional, útil para debug)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================
// RUTAS
// ============================================
app.get('/', (req, res) => {
  res.json({
    message: '🏋️ API del Sistema de Gimnasio',
    version: '1.0.0',
    database: 'PostgreSQL en Render',
    endpoints: {
      auth: '/api/auth',
      clases: '/api/clases',
      planes: '/api/planes',
      mensajes: '/api/mensajes',
      rutinas: '/api/rutinas',
      usuarios: '/api/usuarios' // NUEVO
    }
  });
});

// Conectar las rutas
app.use('/api/auth', authRoutes);
app.use('/api/clases', clasesRoutes);
app.use('/api/planes', planesRoutes);
app.use('/api/mensajes', mensajesRoutes);
app.use('/api/rutinas', rutinasRoutes);
app.use('/api/usuarios', usuariosRoutes); // NUEVO

// ============================================
// MANEJO DE ERRORES
// ============================================
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 - Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================
async function startServer() {
  try {
    // Inicializar base de datos
    await initializeDatabase();
    
    // Iniciar servidor
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📚 Documentación: http://localhost:${PORT}/`);
      console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️ Base de datos: PostgreSQL en Render`);
      console.log(`🌐 CORS: Habilitado para todos los orígenes`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();