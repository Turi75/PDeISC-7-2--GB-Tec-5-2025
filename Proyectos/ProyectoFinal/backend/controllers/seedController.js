const { query } = require('../config/database');
const bcrypt = require('bcryptjs');

const repararBaseDeDatos = async (req, res) => {
  try {
    console.log('🛠️ Iniciando reparación de datos maestros...');

    // 1. Asegurar Roles
    await query(`INSERT INTO roles (nombre, descripcion) VALUES ('usuario', 'Cliente'), ('profesor', 'Instructor'), ('administrador', 'Admin') ON CONFLICT (nombre) DO NOTHING`);

    // 2. Asegurar Tipos de Clase
    await query(`
      INSERT INTO tipos_clase (nombre, descripcion, duracion_minutos, capacidad_maxima) VALUES 
      ('Crossfit', 'Alta intensidad', 60, 20),
      ('Yoga', 'Relajación y estiramiento', 60, 15),
      ('Spinning', 'Cardio en bicicleta', 50, 20)
      ON CONFLICT (nombre) DO NOTHING
    `);

    // 3. Crear Profesores (Si no existen)
    const hash = await bcrypt.hash('12345678', 10);
    
    // Profe Juan
    await query(`
      INSERT INTO usuarios (nombre, apellido, email, password, dni, rol_id, activo)
      SELECT 'Juan', 'Profe', 'juan@gym.com', $1, '1001', id, TRUE 
      FROM roles WHERE nombre = 'profesor'
      ON CONFLICT (email) DO NOTHING
    `, [hash]);
    
    // Profe Ana
    await query(`
      INSERT INTO usuarios (nombre, apellido, email, password, dni, rol_id, activo)
      SELECT 'Ana', 'Yoga', 'ana@gym.com', $1, '1002', id, TRUE 
      FROM roles WHERE nombre = 'profesor'
      ON CONFLICT (email) DO NOTHING
    `, [hash]);

    // 4. OBTENER IDs REALES
    const profeJuanResult = await query("SELECT id FROM usuarios WHERE email = 'juan@gym.com'");
    const profeAnaResult = await query("SELECT id FROM usuarios WHERE email = 'ana@gym.com'");
    
    // Validación por si acaso falló la creación
    if (profeJuanResult.length === 0 || profeAnaResult.length === 0) {
        throw new Error("No se pudieron crear o encontrar los profesores.");
    }

    const profeJuan = profeJuanResult[0].id;
    const profeAna = profeAnaResult[0].id;

    // Obtener IDs de clases
    const crossfitIdResult = await query("SELECT id FROM tipos_clase WHERE nombre = 'Crossfit'");
    const yogaIdResult = await query("SELECT id FROM tipos_clase WHERE nombre = 'Yoga'");
    const spinningIdResult = await query("SELECT id FROM tipos_clase WHERE nombre = 'Spinning'");

    const idCrossfit = crossfitIdResult[0].id;
    const idYoga = yogaIdResult[0].id;
    const idSpinning = spinningIdResult[0].id;

    // 5. INSERTAR HORARIOS FIJOS
    // Limpiamos horarios viejos
    await query("DELETE FROM horarios_clase");

    // Insertamos la plantilla
    await query(`
      INSERT INTO horarios_clase (tipo_clase_id, profesor_id, dia_semana, hora_inicio, hora_fin, activo) VALUES
      ($1, $4, 'Lunes', '08:00:00', '09:00:00', TRUE),
      ($2, $5, 'Lunes', '10:00:00', '11:00:00', TRUE),
      ($3, $4, 'Martes', '18:00:00', '19:00:00', TRUE),
      ($1, $4, 'Miércoles', '08:00:00', '09:00:00', TRUE),
      ($2, $5, 'Miércoles', '19:00:00', '20:00:00', TRUE),
      ($3, $5, 'Jueves', '17:00:00', '18:00:00', TRUE),
      ($1, $4, 'Viernes', '09:00:00', '10:00:00', TRUE)
    `, [idCrossfit, idYoga, idSpinning, profeJuan, profeAna]);

    res.json({ 
      success: true, 
      message: '✅ Base de datos reparada correctamente.' 
    });

  } catch (error) {
    console.error("ERROR EN REPARAR DB:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { repararBaseDeDatos };