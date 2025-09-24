const db = require("../config/mysql");

const getAllVacantes = async (req, res) => {
    const con = await db.getConnection();
    try {
        const [vacantes] = await con.query(`
            SELECT 
                pl.id_Plaza AS id_Plaza,
                pl.nombre AS nombre,
                pl.puesto,
                pl.tabulador,
                u.nombre AS unidad,
                pl.status
            FROM Plazas pl
            LEFT JOIN Unidades u ON pl.id_Unidad = u.id_Unidad
            WHERE pl.status = 1
            ORDER BY pl.id_Plaza;
        `);

        return res.status(200).json(vacantes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, msg: 'Algo salió mal' });
    } finally {
        con.release();
    }
};

const getVacanteById = async (req, res) => {
    const { idVacante } = req.params;
    const con = await db.getConnection();
    try {
        const [rows] = await con.query(`
            SELECT 
                pl.id_Plaza AS id_Plaza,
                pl.nombre AS nombre,
                pl.puesto,
                pl.tabulador,
                u.nombre AS unidad,
                pl.status
            FROM Plazas pl
            LEFT JOIN Unidades u ON pl.id_Unidad = u.id_Unidad
            WHERE pl.status = 1 AND pl.id_Plaza = ?;
        `, [idVacante]);

        if (rows.length === 0) {
            return res.status(404).json({ ok: false, msg: "Vacante no encontrada" });
        }

        return res.status(200).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, msg: 'Algo salió mal' });
    } finally {
        con.release();
    }
};

module.exports = {
    getAllVacantes,
    getVacanteById,
};
