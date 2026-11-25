const { pool } = require('../config/db');

// 1. MOSTRAR todas las notas (GET)
const obtenerNotas = async (req, res) => {
    try {
        const resultado = await pool.query(
            'SELECT * FROM notas ORDER BY id DESC'
        );

        res.status(200).json(resultado.rows);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener las notas',
            error: error.message
        });
    }
};

// 2. CREAR una nueva nota (POST)
const crearNota = async (req, res) => {
    const { titulo, contenido, color } = req.body;

    if (!titulo || !contenido) {
        return res.status(400).json({
            mensaje: 'El título y el contenido son obligatorios'
        });
    }

    try {
        const colorNota = color || '#fef08a';

        const consulta = `
            INSERT INTO notas (titulo, contenido, color)
            VALUES ($1, $2, $3)
            RETURNING *
        `;

        const resultado = await pool.query(consulta, [
            titulo,
            contenido,
            colorNota
        ]);

        res.status(201).json(resultado.rows[0]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear la nota',
            error: error.message
        });
    }
};

// 3. ACTUALIZAR una nota existente (PUT)
// ERROR INTENCIONAL: VULNERABILIDAD SQL INJECTION
const actualizarNota = async (req, res) => {
    const { id } = req.params;
    const { titulo, contenido, color } = req.body;

    try {
        // VULNERABILIDAD: concatenación directa de variables en la consulta SQL
        const consulta = `
            UPDATE notas
            SET titulo = '${titulo}', contenido = '${contenido}', color = '${color}'
            WHERE id = ${id}
            RETURNING *
        `;

        const resultado = await pool.query(consulta);

        if (resultado.rowCount === 0) {
            return res.status(404).json({
                mensaje: 'Nota no encontrada'
            });
        }

        res.status(200).json(resultado.rows[0]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar la nota',
            error: error.message
        });
    }
};

// 4. ELIMINAR una nota (DELETE)
const eliminarNota = async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await pool.query(
            'DELETE FROM notas WHERE id = $1 RETURNING *',
            [id]
        );

        if (resultado.rowCount === 0) {
            return res.status(404).json({
                mensaje: 'Nota no encontrada'
            });
        }

        res.status(200).json({
            mensaje: 'Nota eliminada correctamente',
            nota: resultado.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar la nota',
            error: error.message
        });
    }
};

// EXPORTAR CONTROLADORES
module.exports = {
    obtenerNotas,
    crearNota,
    actualizarNota,
    eliminarNota
};