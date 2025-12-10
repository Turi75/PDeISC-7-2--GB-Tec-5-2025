const { pool } = require('../config/database');

/**
 * Generar clases automáticamente para la próxima semana
 * Se basa en los 'horarios_clase' activos.
 */
exports.generarClasesSemanales = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Mapeo manual para asegurar coincidencia con la DB (PostgreSQL)
        const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        
        // Empezar desde hoy
        let fechaCursor = new Date();
        let clasesCreadas = 0;

        console.log("🔄 Iniciando generación de clases...");

        // Iterar los próximos 7 días
        for (let i = 0; i < 7; i++) {
            const diaIndice = fechaCursor.getDay();
            const diaNombre = diasSemana[diaIndice]; // Ej: "Lunes"
            const fechaSQL = fechaCursor.toISOString().split('T')[0]; // YYYY-MM-DD

            // 1. Buscar horarios configurados para este día
            const horarios = await client.query(
                `SELECT h.*, t.capacidad_maxima 
                 FROM horarios_clase h
                 JOIN tipos_clase t ON h.tipo_clase_id = t.id
                 WHERE h.dia_semana = $1 AND h.activo = TRUE`,
                [diaNombre]
            );

            // 2. Insertar clases si no existen
            for (const horario of horarios.rows) {
                // Verificar duplicados para no crear la misma clase dos veces
                const existe = await client.query(
                    `SELECT id FROM clases 
                     WHERE fecha = $1 AND hora_inicio = $2 AND profesor_id = $3`,
                    [fechaSQL, horario.hora_inicio, horario.profesor_id]
                );

                if (existe.rows.length === 0) {
                    await client.query(
                        `INSERT INTO clases 
                        (tipo_clase_id, profesor_id, fecha, hora_inicio, hora_fin, cupos_totales, cupos_disponibles, estado)
                        VALUES ($1, $2, $3, $4, $5, $6, $6, 'programada')`,
                        [
                            horario.tipo_clase_id,
                            horario.profesor_id,
                            fechaSQL,
                            horario.hora_inicio,
                            horario.hora_fin,
                            horario.capacidad_maxima
                        ]
                    );
                    clasesCreadas++;
                }
            }

            // Avanzar un día en el cursor
            fechaCursor.setDate(fechaCursor.getDate() + 1);
        }

        await client.query('COMMIT');
        console.log(`✅ Se generaron ${clasesCreadas} clases.`);
        
        res.json({ 
            success: true, 
            message: `Proceso completado. Se crearon ${clasesCreadas} clases nuevas.`, 
            clasesCreadas 
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("❌ Error generando clases:", error);
        res.status(500).json({ success: false, message: "Error interno al generar clases" });
    } finally {
        client.release();
    }
};

/**
 * Obtener todas las clases (público/usuarios)
 */
exports.obtenerClases = async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT c.*, t.nombre as actividad, u.nombre as profesor_nombre, u.apellido as profesor_apellido 
            FROM clases c
            JOIN tipos_clase t ON c.tipo_clase_id = t.id
            JOIN usuarios u ON c.profesor_id = u.id
            WHERE c.fecha >= CURRENT_DATE
            ORDER BY c.fecha ASC, c.hora_inicio ASC
        `);
        res.json({ success: true, data: resultado.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error al obtener clases" });
    }
};

/**
 * Inscribirse a una clase
 */
exports.inscribirseClase = async (req, res) => {
    const { clase_id } = req.body;
    const usuario_id = req.user.id; // Asumiendo middleware de auth
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Validar clase y cupos
        const claseRes = await client.query("SELECT * FROM clases WHERE id = $1 FOR UPDATE", [clase_id]);
        if (claseRes.rows.length === 0) throw new Error("Clase no encontrada");
        
        const clase = claseRes.rows[0];
        if (clase.cupos_disponibles <= 0) throw new Error("No hay cupos disponibles");

        // 2. Validar que no esté inscrito ya
        const existe = await client.query(
            "SELECT * FROM inscripciones WHERE usuario_id = $1 AND clase_id = $2",
            [usuario_id, clase_id]
        );
        if (existe.rows.length > 0) throw new Error("Ya estás inscrito en esta clase");

        // 3. Inscribir
        await client.query(
            "INSERT INTO inscripciones (usuario_id, clase_id) VALUES ($1, $2)",
            [usuario_id, clase_id]
        );

        // 4. Descontar cupo
        await client.query(
            "UPDATE clases SET cupos_disponibles = cupos_disponibles - 1 WHERE id = $1",
            [clase_id]
        );

        await client.query('COMMIT');
        res.json({ success: true, message: "Inscripción exitosa" });

    } catch (error) {
        await client.query('ROLLBACK');
        res.status(400).json({ success: false, message: error.message });
    } finally {
        client.release();
    }
};

// ... Puedes agregar cancelarInscripcion, crearClase manual, etc. si los necesitas