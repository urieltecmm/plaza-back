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

const modificarVacantes = async (req, res) => {
    const con = await db.getConnection();
    const {id_Plaza, puesto, id_Unidad, nivel} = req.body;

    try {
        console.log(id_Plaza, puesto, id_Unidad, nivel);
        const [validacion] = await con.query("SELECT count(id_Plaza) AS res FROM Plazas WHERE status = 1 AND id_Plaza = ?", id_Plaza);

        if(parseInt(validacion[0].res) === 0){
            return res.status(200).json({ok: false, msg: 'La plaza no se encuentra vacante'}) 
        }

        await con.query("UPDATE Plazas SET puesto = ?, id_Unidad = ?, nivel = ? WHERE id_Plaza = ?", [puesto, id_Unidad, nivel, id_Plaza])
        
        return res.status(200).json({ok: true, msg: 'se actualizo exitosamente'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, msg: 'Algo salió mal' });
    } finally {
        con.release();
    }
}

const asignarVacante = async (req, res) => {
    const con = await db.getConnection();
    const {id_Personal, id_Plaza} = req.body;

    try {
        console.log(id_Personal, id_Plaza);
        //validar que la persona no tenga una plaza asignada

        const [validar_personal] = await con.query("SELECT count(id_Personal) AS res FROM Personal WHERE id_Personal = ? AND id_Plaza IS NULL", [id_Personal]);
        if(parseInt(validar_personal[0].res) === 0 ){
            return res.status(200).json({ok: false, msg: 'El personal ya tiene una plaza asignada'});
        }

        //validar que la plaza no está asignada

        const [validar_plaza] = await con.query("SELECT count(id_Personal) AS res FROM Personal WHERE id_Plaza = ?", [id_Plaza]);
        if(parseInt(validar_plaza[0].res) > 0){
            return res.status(200).json({ok: false, msg: 'La plaza ya se encuentra asignada'});
        }

        //asignar plaza

        await con.query("UPDATE Personal SET id_Plaza = ? WHERE id_Personal = ?", [id_Plaza, id_Personal]);
        await con.query("UPDATE Plazas SET status = 0 WHERE id_Plaza = ?", [id_Plaza]);

        return res.status(200).json({ok: true, msg: "plaza asignada exitosamente"});
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, msg: 'Algo salió mal' });
    } finally {
        con.release();
    }
}

const desasignarVacante = async (req, res) => {
    const con = await db.getConnection();
    const {id_Personal} = req.params;

    console.log(id_Personal);
    try{
        const [validar_personal] = await con.query("SELECT COUNT(id_Personal) AS res, id_Plaza FROM Personal WHERE id_Personal = ?", [id_Personal]);
        if(parseInt(validar_personal[0].res) === 0){
            return res.status(200).json({ok: false, msg: ''});    
        }

        await con.query("UPDATE Personal SET id_Plaza = NULL WHERE id_Personal = ?", [id_Personal]);
        await con.query("UPDATE Plazas SET status = 1 WHERE id_Plaza = ?", [validar_personal[0].id_Plaza]);
        return res.status(200).json({ok: true, msg: 'se desasigno plaza exitosamente'});
    } catch (err){
        console.error(err);
        res.status(500).json({ ok: false, msg: 'Algo salió mal' });
    } finally {
        con.release();
    }
}

module.exports = {
    getAllVacantes,
    getVacanteById,
    modificarVacantes,
    asignarVacante,
    desasignarVacante
};
