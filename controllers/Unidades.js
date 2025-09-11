const db = require("../config/mysql");

const registrar_Unidad = async (req, res) => {
    const { nombre } = req.body;
    const con = await db.getConnection();

    try{
        const [Unidades] = await con.query("SELECT id_unidad, nombre FROM Unidades where nombre = ? and status = 1", [nombre]);
        if (Unidades.find(Unidades => Unidades.nombre === nombre)) {
            return res.status(400).json({ok: false, msg: "La unidad ya existe"});
        }
        await con.query("INSERT INTO Unidades (nombre) VALUES (?)", [nombre]);
        return res.status(201).json({msg: "Unidad registrada correctamente"});
    }catch(err){
        console.log(err);
        res.status(500).json({ok: false, msg: 'Algo salió mal'});
    }finally{
        con.release();
    }
}

const obtener_Unidad = async (req, res) => {
    const con = await db.getConnection();
    try {
        const [Unidades] = await con.query("SELECT id_unidad, nombre FROM Unidades and status = 1");

        const final_Json = Unidades.map(unidad => ({
            id_unidad: unidad.id_unidad,
            nombre: unidad.nombre
        }));

        return res.status(200).json(final_Json);
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, msg: 'Algo salió mal' });
    } finally {
        con.release();
    }
};


const obtener_Unidad_One = async (req, res) => {
    const { id_Unidad } = req.params;
    const con = await db.getConnection();
    try {
        const [Unidades] = await con.query("select id_unidad, nombre FROM Unidades WHERE id_unidad = ? and status = 1", [id_Unidad]);
        if (Unidades.length === 0) {
            return res.status(404).json({ ok: false, msg: "Unidad no encontrada" });
        }

        const unidad = Unidades[0];

        const result = {
            id_unidad: unidad.id_unidad,
            nombre: unidad.nombre
        };

        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, msg: 'Algo salió mal' });
    } finally {
        con.release();
    }
}

const modificar_Unidad = async (req, res) => {
    const { id_Unidad } = req.params;
    const { nombre } = req.body;
    const con = await db.getConnection();

    try {
        const [Unidades] = await con.query("SELECT * FROM Unidades WHERE id_unidad = ? and status = 1", [id_Unidad]);
        if (Unidades.length === 0) {
            return res.status(404).json({ ok: false, msg: "Unidad no encontrada" });
        }

        await con.query(
            "update Unidades set nombre = ? where id_unidad = ? and status = 1",
            [nombre, id_Unidad]
        );

        const [updatedUnidadRows] = await con.query("SELECT * FROM Unidades WHERE id_unidad = ?", [id_Unidad]);
        const unidad = updatedUnidadRows[0];

        const result = {
            id_unidad: unidad.id_unidad,
            nombre: unidad.nombre
        };

        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, msg: 'Algo salió mal' });
    } finally {
        con.release();
    }
}

const eliminar_Unidad = async (req, res) => {
    const { id_Unidad } = req.params;
    const con = await db.getConnection();
    try {
        const [Unidades] = await con.query("SELECT * FROM Unidades WHERE id_unidad = ? ", [id_Unidad]);
        if (Unidades.length === 0) {
            return res.status(404).json({ ok: false, msg: "Unidad no encontrada" });
        }

        await con.query("UPDATE Unidades SET status = 0 WHERE id_Unidad = ?", [id_Unidad]);

        return res.status(200).json({ ok: true, msg: "Unidad eliminada correctamente" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, msg: 'Algo salió mal' });
    } finally {
        con.release();
    }
}

module.exports = {
    registrar_Unidad,
    obtener_Unidad,
    obtener_Unidad_One,
}