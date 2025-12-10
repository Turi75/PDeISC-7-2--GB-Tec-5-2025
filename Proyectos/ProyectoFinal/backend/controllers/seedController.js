const { query } = require('../config/database');
const bcrypt = require('bcryptjs');

const repararBaseDeDatos = async (req, res) => {
  try {
    console.log('🛠️ Iniciando reparación de datos maestros...');

    // 1. Asegurar Roles
    await query(`INSERT INTO roles (nombre) VALUES ('usuario'), ('profesor'), ('administrador') ON CONFLICT (nombre) DO NOTHING`);

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

    // 4. OBTENER IDs REALES (Necesario porque en Render los IDs cambian)
    const profeJuan = (await query("SELECT id FROM usuarios WHERE email = 'juan@gym.com'"))[0].id;
    const profeAna = (await query("SELECT id FROM usuarios WHERE email = 'ana@gym.com'"))[0].id;
    
    const idCrossfit = (await query("SELECT id FROM tipos_clase WHERE nombre = 'Crossfit'"))[0].id;
    const idYoga = (await query("SELECT id FROM tipos_clase WHERE nombre = 'Yoga'"))[0].id;
    const idSpinning = (await query("SELECT id FROM tipos_clase WHERE nombre = 'Spinning'"))[0].id;

    [cite_start]// 5. INSERTAR HORARIOS FIJOS (¡ESTO ES LO QUE TE FALTA!) [cite: 1]
    // Primero limpiamos horarios viejos
    await query("DELETE FROM horarios_clase");

    // Insertamos la plantilla de la semana
    await query(`
      INSERT INTO horarios_clase (tipo_clase_id, profesor_id, dia_semana, hora_inicio, hora_fin, activo) VALUES
      -- Lunes
      ($1, $3, 'Lunes', '08:00:00', '09:00:00', TRUE), -- Crossfit Juan
      ($2, $4, 'Lunes', '10:00:00', '11:00:00', TRUE), -- Yoga Ana
      
      -- Martes
      ($3, $3, 'Martes', '18:00:00', '19:00:00', TRUE), -- Spinning Juan
      
      -- Miércoles
      ($1, $3, 'Miércoles', '08:00:00', '09:00:00', TRUE), -- Crossfit Juan
      ($2, $4, 'Miércoles', '19:00:00', '20:00:00', TRUE), -- Yoga Ana
      
      -- Jueves
      ($3, $4, 'Jueves', '17:00:00', '18:00:00', TRUE), -- Spinning Ana
      
      -- Viernes
      ($1, $3, 'Viernes', '09:00:00', '10:00:00', TRUE)  -- Crossfit Juan
    `, [idCrossfit, idYoga, idSpinning, profeJuan, profeAna]);

    res.json({ 
      success: true, 
      message: '✅ Base de datos reparada. Ahora el botón "Generar Clases" funcionará.' 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { repararBaseDeDatos };