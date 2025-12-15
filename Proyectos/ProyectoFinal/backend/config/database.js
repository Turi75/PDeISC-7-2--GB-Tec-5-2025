const { Pool } = require('pg');
require('dotenv').config();

// Pool de conexiones PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Necesario para Render
  }
});

/**
 * Inicializa la base de datos
 * 1. Crea todas las tablas necesarias
 * 2. Inserta datos iniciales
 */
async function initializeDatabase() {
  let client;
  
  try {
    console.log('🔄 Conectando a PostgreSQL en Render...');
    
    client = await pool.connect();
    console.log('✅ Conexión establecida con PostgreSQL');
    
    // ============================================
    // CREAR TABLAS
    // ============================================
    
    // Tabla: roles
    await client.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL UNIQUE,
        descripcion TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla "roles" creada');
    
    // Tabla: usuarios
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        dni VARCHAR(20) NOT NULL UNIQUE,
        rol_id INT NOT NULL,
        activo BOOLEAN DEFAULT TRUE,
        foto_perfil VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (rol_id) REFERENCES roles(id)
      )
    `);
    console.log('✅ Tabla "usuarios" creada');
    
    // Tabla: planes
    await client.query(`
      CREATE TABLE IF NOT EXISTS planes (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL UNIQUE,
        descripcion TEXT,
        precio DECIMAL(10,2) NOT NULL,
        max_clases INT,
        max_visitas_semana INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla "planes" creada');
    
    // Tabla: suscripciones
    await client.query(`
      CREATE TABLE IF NOT EXISTS suscripciones (
        id SERIAL PRIMARY KEY,
        usuario_id INT NOT NULL,
        plan_id INT NOT NULL,
        fecha_inicio DATE NOT NULL,
        fecha_fin DATE NOT NULL,
        estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'activa', 'vencida', 'cancelada')),
        metodo_pago VARCHAR(100),
        comprobante VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (plan_id) REFERENCES planes(id)
      )
    `);
    console.log('✅ Tabla "suscripciones" creada');
    
    // Tabla: tipos_clase
    await client.query(`
      CREATE TABLE IF NOT EXISTS tipos_clase (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL UNIQUE,
        descripcion TEXT,
        duracion_minutos INT DEFAULT 60,
        capacidad_maxima INT DEFAULT 20,
        imagen VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla "tipos_clase" creada');
    
    // Tabla: horarios_clase
    await client.query(`
      CREATE TABLE IF NOT EXISTS horarios_clase (
        id SERIAL PRIMARY KEY,
        tipo_clase_id INT NOT NULL,
        profesor_id INT NOT NULL,
        dia_semana VARCHAR(20) NOT NULL CHECK (dia_semana IN ('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo')),
        hora_inicio TIME NOT NULL,
        hora_fin TIME NOT NULL,
        activo BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tipo_clase_id) REFERENCES tipos_clase(id),
        FOREIGN KEY (profesor_id) REFERENCES usuarios(id)
      )
    `);
    console.log('✅ Tabla "horarios_clase" creada');
    
    // Tabla: clases
    await client.query(`
      CREATE TABLE IF NOT EXISTS clases (
        id SERIAL PRIMARY KEY,
        tipo_clase_id INT NOT NULL,
        profesor_id INT NOT NULL,
        fecha DATE NOT NULL,
        hora_inicio TIME NOT NULL,
        hora_fin TIME NOT NULL,
        cupos_totales INT NOT NULL,
        cupos_disponibles INT NOT NULL,
        estado VARCHAR(20) DEFAULT 'programada' CHECK (estado IN ('programada', 'en_curso', 'completada', 'cancelada')),
        observaciones TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tipo_clase_id) REFERENCES tipos_clase(id),
        FOREIGN KEY (profesor_id) REFERENCES usuarios(id)
      )
    `);
    console.log('✅ Tabla "clases" creada');
    
    // Tabla: inscripciones
    await client.query(`
      CREATE TABLE IF NOT EXISTS inscripciones (
        id SERIAL PRIMARY KEY,
        usuario_id INT NOT NULL,
        clase_id INT NOT NULL,
        asistio BOOLEAN DEFAULT FALSE,
        fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (clase_id) REFERENCES clases(id) ON DELETE CASCADE,
        UNIQUE (usuario_id, clase_id)
      )
    `);
    console.log('✅ Tabla "inscripciones" creada');
    
    // Tabla: rutinas
    await client.query(`
      CREATE TABLE IF NOT EXISTS rutinas (
        id SERIAL PRIMARY KEY,
        profesor_id INT NOT NULL,
        usuario_id INT NOT NULL,
        tipo_clase_id INT,
        titulo VARCHAR(255) NOT NULL,
        descripcion TEXT NOT NULL,
        fecha_asignacion DATE NOT NULL,
        activa BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (profesor_id) REFERENCES usuarios(id),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (tipo_clase_id) REFERENCES tipos_clase(id)
      )
    `);
    console.log('✅ Tabla "rutinas" creada');
    
    // Tabla: mensajes
    await client.query(`
      CREATE TABLE IF NOT EXISTS mensajes (
        id SERIAL PRIMARY KEY,
        remitente_id INT NOT NULL,
        destinatario_id INT NOT NULL,
        mensaje TEXT NOT NULL,
        leido BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (remitente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (destinatario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Tabla "mensajes" creada');
    
    // Tabla: comunicados
    await client.query(`
      CREATE TABLE IF NOT EXISTS comunicados (
        id SERIAL PRIMARY KEY,
        profesor_id INT NOT NULL,
        tipo_clase_id INT NOT NULL,
        titulo VARCHAR(255) NOT NULL,
        contenido TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (profesor_id) REFERENCES usuarios(id),
        FOREIGN KEY (tipo_clase_id) REFERENCES tipos_clase(id)
      )
    `);
    console.log('✅ Tabla "comunicados" creada');
    
    // ============================================
    // INSERTAR DATOS INICIALES
    // ============================================
    
    // Verificar si ya existen datos
    const rolesExistentes = await client.query('SELECT COUNT(*) as count FROM roles');
    
    if (parseInt(rolesExistentes.rows[0].count) === 0) {
      console.log('📝 Insertando datos iniciales...');
      
      // Roles
      await client.query(`
        INSERT INTO roles (nombre, descripcion) VALUES
        ('usuario', 'Usuario cliente del gimnasio'),
        ('profesor', 'Profesor de clases'),
        ('administrador', 'Administrador del gimnasio')
      `);
      console.log('✅ Roles insertados');
      
      // Planes
      await client.query(`
        INSERT INTO planes (nombre, descripcion, precio, max_clases, max_visitas_semana) VALUES
        ('Básico', 'Acceso a 2 clases, 2 visitas por semana a cada una', 5000.00, 2, 2),
        ('Intermedio', 'Acceso a 3 clases, 2 o 3 visitas por semana según distribución', 8000.00, 3, 6),
        ('Premium', 'Acceso ilimitado a todas las clases', 12000.00, NULL, NULL)
      `);
      console.log('✅ Planes insertados');
      
      // Tipos de clase
      await client.query(`
        INSERT INTO tipos_clase (nombre, descripcion, duracion_minutos, capacidad_maxima) VALUES
        ('GYM', 'Entrenamiento con pesas y máquinas', 60, 30),
        ('Spinning', 'Clase de ciclismo indoor', 60, 20),
        ('Yoga', 'Clase de yoga y meditación', 90, 15)
      `);
      console.log('✅ Tipos de clase insertados');
      
      // Usuarios de ejemplo (con contraseñas hasheadas)
      const bcrypt = require('bcryptjs');
      
      // Jefe
      const hashJefe = await bcrypt.hash('JefeSupremo', 10);
      await client.query(`
        INSERT INTO usuarios (nombre, apellido, email, password, dni, rol_id) VALUES
        ('Jefe', 'Supremo', 'jefe@gimnasio.com', $1, '1', 3)
      `, [hashJefe]);
      
      // Administradores
      const hashAdmin1 = await bcrypt.hash('AdminTurnoMañana', 10);
      const hashAdmin2 = await bcrypt.hash('AdminTurnoTarde', 10);
      await client.query(`
        INSERT INTO usuarios (nombre, apellido, email, password, dni, rol_id) VALUES
        ('Admin Turno', 'Mañana', 'admin1@gimnasio.com', $1, '2', 3),
        ('Admin Turno', 'Tarde', 'admin2@gimnasio.com', $2, '3', 3)
      `, [hashAdmin1, hashAdmin2]);
      
      // Profesores
      const hashProfe1 = await bcrypt.hash('ProfedeYoga', 10);
      const hashProfe2 = await bcrypt.hash('ProfeDeCrossfit', 10);
      const hashProfe3 = await bcrypt.hash('ProfeDeSpinning', 10);
      await client.query(`
        INSERT INTO usuarios (nombre, apellido, email, password, dni, rol_id) VALUES
        ('Profe de', 'Yoga', 'profe1@gimnasio.com', $1, '4', 2),
        ('Profe de', 'Crossfit', 'profe2@gimnasio.com', $2, '5', 2),
        ('Profe de', 'Spinning', 'profe3@gimnasio.com', $3, '6', 2)
      `, [hashProfe1, hashProfe2, hashProfe3]);
      
      console.log('✅ Usuarios de ejemplo insertados');
      
      // Horarios de clase fijos
      await client.query(`
        INSERT INTO horarios_clase (tipo_clase_id, profesor_id, dia_semana, hora_inicio, hora_fin) VALUES
        (1, 5, 'Lunes', '07:00:00', '18:00:00'),
        (1, 5, 'Martes', '07:00:00', '18:00:00'),
        (1, 5, 'Miércoles', '07:00:00', '18:00:00'),
        (1, 5, 'Jueves', '07:00:00', '18:00:00'),
        (1, 5, 'Viernes', '07:00:00', '18:00:00'),
        (1, 5, 'Sábado', '07:00:00', '14:00:00'),
        (2, 6, 'Lunes', '16:00:00', '17:00:00'),
        (2, 6, 'Lunes', '17:00:00', '18:00:00'),
        (2, 6, 'Miércoles', '16:00:00', '17:00:00'),
        (2, 6, 'Miércoles', '17:00:00', '18:00:00'),
        (2, 6, 'Viernes', '16:00:00', '17:00:00'),
        (2, 6, 'Viernes', '17:00:00', '18:00:00'),
        (3, 4, 'Martes', '08:30:00', '10:00:00'),
        (3, 4, 'Martes', '18:00:00', '20:00:00'),
        (3, 4, 'Jueves', '08:30:00', '10:00:00'),
        (3, 4, 'Jueves', '18:00:00', '20:00:00')
      `);
      console.log('✅ Horarios fijos insertados');
      
      console.log('✅ Datos iniciales completos');
    } else {
      console.log('ℹ️  Los datos iniciales ya existen, omitiendo inserción');
    }
    
    client.release();
    console.log('🎉 Base de datos inicializada correctamente\n');
    
    return pool;
    
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    if (client) client.release();
    throw error;
  }
}

/**
 * Obtiene el pool de conexiones
 */
function getPool() {
  if (!pool) {
    throw new Error('La base de datos no ha sido inicializada. Llama a initializeDatabase() primero.');
  }
  return pool;
}

/**
 * Ejecuta una query
 */
async function query(sql, params) {
  const pool = getPool();
  const result = await pool.query(sql, params);
  return result.rows;
}

module.exports = {
  initializeDatabase,
  getPool,
  query
};