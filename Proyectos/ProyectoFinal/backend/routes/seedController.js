const { query } = require('../config/database');
const bcrypt = require('bcryptjs');

const repararBaseDeDatos = async (req, res) => {
  try {
    console.log('🛠️ Iniciando reparación de datos maestros...');

    // 1. Roles
    await query(`INSERT INTO roles (nombre, descripcion) VALUES ('usuario', 'Cliente'), ('profesor', 'Instructor'), ('administrador', 'Admin') ON CONFLICT (nombre) DO NOTHING`);

    // 2. Tipos de Clase
    await query(`
      INSERT INTO tipos_clase (nombre, descripcion, duracion_minutos, capacidad_maxima) VALUES 
      ('Crossfit', 'Alta intensidad', 60, 20),
      ('Yoga', 'Relajación y estiramiento', 60, 15),
      ('Spinning', 'Cardio en bicicleta', 50, 20)
      ON CONFLICT (nombre) DO NOTHING
    `);

    // 3. Profesores Base
    const hash = await bcrypt.hash('12345678', 10);
    
    // Crear Profesores si no existen
    await query(`
      INSERT INTO usuarios (nombre, apellido, email, password, dni, rol_id, activo)
      SELECT 'Juan', 'Profe', 'juan@gym.com', $1, '1001', id, TRUE FROM roles WHERE nombre = 'profesor'
      ON CONFLICT (email) DO NOTHING
    `, [hash]);

    await query(`
      INSERT INTO usuarios (nombre, apellido, email, password, dni, rol_id, activo)
      SELECT 'Ana', 'Yoga', 'ana@gym.com', $1, '1002', id, TRUE FROM roles WHERE nombre = 'profesor'
      ON CONFLICT (email) DO NOTHING
    `, [hash]);

    // 4. Obtener IDs correctos de la DB actual
    const profeJuan = (await query("SELECT id FROM usuarios WHERE email = 'juan@gym.com'"))[0].id;
    const profeAna = (await query("SELECT id FROM usuarios WHERE email = 'ana@gym.com'"))[0].id;
    const idCrossfit = (await query("SELECT id FROM tipos_clase WHERE nombre = 'Crossfit'"))[0].id;
    const idYoga = (await query("SELECT id FROM tipos_clase WHERE nombre = 'Yoga'"))[0].id;
    const idSpinning = (await query("SELECT id FROM tipos_clase WHERE nombre = 'Spinning'"))[0].id;

    // 5. INSERTAR HORARIOS FIJOS (Esto hace que "Generar Clases" funcione)
    await query("DELETE FROM horarios_clase"); // Limpiar anteriores

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

    res.json({ success: true, message: '✅ Base de datos reparada. Ahora puedes Generar Clases.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { repararBaseDeDatos };