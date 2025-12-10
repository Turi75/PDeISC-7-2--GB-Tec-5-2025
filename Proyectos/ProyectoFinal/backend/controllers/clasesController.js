const { pool } = require('../config/database');

/**
 * 1. Generar clases automáticamente para la próxima semana
 */
exports.generarClasesSemanales = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Mapeo de días para coincidir con PostgreSQL
        const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        
        let fechaCursor = new Date();
        let clasesCreadas = 0;
        const clasesDetalle = [];

        console.log("🔄 Iniciando generación de clases...");

        // Iterar los próximos 7 días
        for (let i = 0; i < 7; i++) {
            const diaIndice = fechaCursor.getDay();
            const diaNombre = diasSemana[diaIndice];
            const fechaSQL = fechaCursor.toISOString().split('T')[0];

            // Buscar horarios activos para este día
            const horarios = await client.query(
                `SELECT h.*, t.capacidad_maxima, t.nombre as tipo_nombre 
                 FROM horarios_clase h
                 JOIN tipos_clase t ON h.tipo_clase_id = t.id
                 WHERE h.dia_semana = $1 AND h.activo = TRUE`,
                [diaNombre]
            );

            for (const horario of horarios.rows) {
                // Evitar duplicados
                const existe = await client.query(
                    `SELECT id FROM clases 
                     WHERE fecha = $1 AND hora_inicio = $2 AND profesor_id = $3`,
                    [fechaSQL, horario.hora_inicio, horario.profesor_id]
                );

                if (existe.rows.length === 0) {
                    const nuevaClase = await client.query(
                        `INSERT INTO clases 
                        (tipo_clase_id, profesor_id, fecha, hora_inicio, hora_fin, cupos_totales, cupos_disponibles, estado)
                        VALUES ($1, $2, $3, $4, $5, $6, $6, 'programada')
                        RETURNING id`,
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
                    clasesDetalle.push({
                        id: nuevaClase.rows[0].id,
                        fecha: fechaSQL,
                        actividad: horario.tipo_nombre
                    });
                }
            }
            // Avanzar un día
            fechaCursor.setDate(fechaCursor.getDate() + 1);
        }

        await client.query('COMMIT');
        console.log(`✅ Se generaron ${clasesCreadas} clases.`);
        
        res.json({ 
            success: true, 
            message: `Proceso completado. Se crearon ${clasesCreadas} clases nuevas.`, 
            data: clasesDetalle
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
 * 2. Obtener todas las clases (público/usuarios)
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
 * 3. Obtener Mis Clases (Inscripciones del usuario)
 */
exports.obtenerMisClases = async (req, res) => {
    const usuario_id = req.user.id;
    try {
        const resultado = await pool.query(`
            SELECT c.*, t.nombre as actividad, i.asistio 
            FROM inscripciones i
            JOIN clases c ON i.clase_id = c.id
            JOIN tipos_clase t ON c.tipo_clase_id = t.id
            WHERE i.usuario_id = $1
            ORDER BY c.fecha DESC`, 
            [usuario_id]
        );
        res.json({ success: true, data: resultado.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error al obtener mis clases" });
    }
};

/**
 * 4. Inscribirse a una clase
 */
exports.inscribirseClase = async (req, res) => {
    const { clase_id } = req.body;
    
    if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: "Usuario no autenticado" });
    }
    
    const usuario_id = req.user.id;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Validar clase y cupos
        const claseRes = await client.query("SELECT * FROM clases WHERE id = $1 FOR UPDATE", [clase_id]);
        if (claseRes.rows.length === 0) throw new Error("Clase no encontrada");
        
        const clase = claseRes.rows[0];
        if (clase.cupos_disponibles <= 0) throw new Error("No hay cupos disponibles");

        // Validar que no esté inscrito ya
        const existe = await client.query(
            "SELECT * FROM inscripciones WHERE usuario_id = $1 AND clase_id = $2",
            [usuario_id, clase_id]
        );
        if (existe.rows.length > 0) throw new Error("Ya estás inscrito en esta clase");

        // Inscribir
        await client.query(
            "INSERT INTO inscripciones (usuario_id, clase_id) VALUES ($1, $2)",
            [usuario_id, clase_id]
        );

        // Descontar cupo
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

/**
 * 5. Cancelar inscripción
 */
exports.cancelarInscripcion = async (req, res) => {
    const { clase_id } = req.params;
    const usuario_id = req.user.id;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Verificar inscripción
        const inscripcion = await client.query(
            "SELECT * FROM inscripciones WHERE usuario_id = $1 AND clase_id = $2",
            [usuario_id, clase_id]
        );

        if (inscripcion.rows.length === 0) throw new Error("No estás inscrito en esta clase");

        // Borrar inscripción
        await client.query(
            "DELETE FROM inscripciones WHERE usuario_id = $1 AND clase_id = $2",
            [usuario_id, clase_id]
        );

        // Devolver cupo
        await client.query(
            "UPDATE clases SET cupos_disponibles = cupos_disponibles + 1 WHERE id = $1",
            [clase_id]
        );

        await client.query('COMMIT');
        res.json({ success: true, message: "Inscripción cancelada" });

    } catch (error) {
        await client.query('ROLLBACK');
        res.status(400).json({ success: false, message: error.message });
    } finally {
        client.release();
    }
};

/**
 * 6. Crear clase manualmente (Opcional, para admin)
 */
exports.crearClase = async (req, res) => {
    const { tipo_clase_id, profesor_id, fecha, hora_inicio, hora_fin, cupos_totales } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO clases (tipo_clase_id, profesor_id, fecha, hora_inicio, hora_fin, cupos_totales, cupos_disponibles, estado)
             VALUES ($1, $2, $3, $4, $5, $6, $6, 'programada') RETURNING id`,
            [tipo_clase_id, profesor_id, fecha, hora_inicio, hora_fin, cupos_totales]
        );
        res.json({ success: true, message: "Clase creada", data: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error al crear clase" });
    }
};