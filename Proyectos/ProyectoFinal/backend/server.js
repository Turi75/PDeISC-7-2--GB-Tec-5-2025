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

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARES
// ============================================

// CORS - Configuración para permitir APK y desarrollo
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (como mobile apps)
    if (!origin) return callback(null, true);
    
    // Permitir todos los orígenes en producción para APK
    if (process.env.NODE_ENV === 'production') {
      return callback(null, true);
    }
    
    // En desarrollo, permitir localhost
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
      rutinas: '/api/rutinas'
    }
  });
});

// Conectar las rutas
app.use('/api/auth', authRoutes);
app.use('/api/clases', clasesRoutes);
app.use('/api/planes', planesRoutes);
app.use('/api/mensajes', mensajesRoutes);
app.use('/api/rutinas', rutinasRoutes);

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
      console.log(`🗄️  Base de datos: PostgreSQL en Render`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();