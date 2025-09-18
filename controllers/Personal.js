const db = require("../config/mysql");

const registrar_Personal = async (req, res) => {
    const { nombre } = req.body;
    const con = await db.getConnection();

    try{
        const [Personals] = await con.query("SELECT id_Personal, nombre FROM Personals where nombre = ? and status = 1", [nombre]);
        if (Personals.find(Personals => Personals.nombre === nombre)) {
            return res.status(400).json({ok: false, msg: "La Personal ya existe"});
        }
        await con.query("INSERT INTO Personals (nombre) VALUES (?)", [nombre]);
        return res.status(201).json({msg: "Personal registrada correctamente"});
    }catch(err){
        console.log(err);
        res.status(500).json({ok: false, msg: 'Algo salió mal'});
    }finally{
        con.release();
    }
}

const obtener_Personal = async (req, res) => {
    const con = await db.getConnection();
    try {
        const [Personals] = await con.query(`
            select pe.id_Personal, pe.nombre, pl.puesto, u.nombre as unidad, a.nombre as area, pl.nombre as plaza, pe.codigo, pl.nivel, pe.sindicalizado, pl.tabulador,
            (
                SELECT COUNT(*) 
                FROM Historial h
                WHERE h.id_Personal = pe.id_Personal 
            ) AS total_historial
            from Personal as pe
            join Plazas as pl on pe.id_Plaza = pl.id_Plaza
            join Areas as a on pe.id_Area = a.id_Area
            left join Unidades as u on pl.id_Unidad = u.id_Unidad
			ORDER by pe.codigo ;
        `);

        const final_Json = Personals.map(Personal => ({
            id_Personal: Personal.id_Personal,
            nombre: Personal.nombre,
            puesto: Personal.puesto,
            unidad: Personal.unidad,
            area: Personal.area,
            plaza: Personal.plaza,
            codigo: Personal.codigo,
            nivel: Personal.nivel,
            tabulador: Personal.tabulador,
            sindicalizado: Personal.sindicalizado,
            total_historial: Personal.total_historial
        }));

        return res.status(200).json(final_Json);
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, msg: 'Algo salió mal' });
    } finally {
        con.release();
    }
};


const obtener_Personal_One = async (req, res) => {
    const { id_Personal } = req.params;
    const con = await db.getConnection();
    try {
        const [Personals] = await con.query("select id_Personal, nombre FROM Personals WHERE id_Personal = ? and status = 1", [id_Personal]);
        if (Personals.length === 0) {
            return res.status(404).json({ ok: false, msg: "Personal no encontrada" });
        }

        const Personal = Personals[0];

        const result = {
            id_Personal: Personal.id_Personal,
            nombre: Personal.nombre
        };

        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, msg: 'Algo salió mal' });
    } finally {
        con.release();
    }
}

const modificar_Personal = async (req, res) => {
    const { id_Personal } = req.params;
    const { nombre } = req.body;
    const con = await db.getConnection();

    try {
        const [Personals] = await con.query("SELECT * FROM Personals WHERE id_Personal = ? and status = 1", [id_Personal]);
        if (Personals.length === 0) {
            return res.status(404).json({ ok: false, msg: "Personal no encontrada" });
        }

        await con.query(
            "update Personals set nombre = ? where id_Personal = ?",
            [nombre, id_Personal]
        );

        const [updatedPersonalRows] = await con.query("SELECT * FROM Personals WHERE id_Personal = ? and status = 1", [id_Personal]);
        const Personal = updatedPersonalRows[0];

        const result = {
            id_Personal: Personal.id_Personal,
            nombre: Personal.nombre
        };

        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, msg: 'Algo salió mal' });
    } finally {
        con.release();
    }
}

const eliminar_Personal = async (req, res) => {
    const { id_Personal } = req.params;
    const con = await db.getConnection();
    try {
        const [Personals] = await con.query("SELECT * FROM Personal WHERE id_Personal = ? and status = 1", [id_Personal]);
        if (Personals.length === 0) {
            return res.status(404).json({ ok: false, msg: "Personal no encontrada" });
        }

        await con.query("UPDATE Personal SET status = 0 WHERE id_Personal = ?", [id_Personal]);

        return res.status(200).json({ ok: true, msg: "Personal eliminada correctamente" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, msg: 'Algo salió mal' });
    } finally {
        con.release();
    }
}

module.exports = {
    registrar_Personal,
    obtener_Personal,
    obtener_Personal_One,
    eliminar_Personal
}