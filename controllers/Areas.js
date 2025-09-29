const db = require("../config/mysql");

const registrar_Area = async (req, res) => {
    const { nombre } = req.body;
    const con = await db.getConnection();

    try{
        const [Areas] = await con.query("SELECT id_Area, nombre FROM Areas where nombre = ? and status = 1", [nombre]);
        if (Areas.find(Areas => Areas.nombre === nombre)) {
            return res.status(400).json({ok: false, msg: "La area ya existe"});
        }
        await con.query("INSERT INTO Areas (nombre) VALUES (?)", [nombre]);
        return res.status(201).json({msg: "Area registrada correctamente"});
    }catch(err){
        console.log(err);
        res.status(500).json({ok: false, msg: 'Algo salió mal'});
    }finally{
        con.release();
    }
}

const obtener_Area = async (req, res) => {
    const con = await db.getConnection();
    try {
        const [Areas] = await con.query("SELECT id_Area, nombre FROM Areas where status = 1");

        const final_Json = Areas.map(Area => ({
            id_Area: Area.id_Area,
            nombre: Area.nombre
        }));

        return res.status(200).json(final_Json);
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, msg: 'Algo salió mal' });
    } finally {
        con.release();
    }
};


const obtener_Area_One = async (req, res) => {
    const { id_Area } = req.params;
    const con = await db.getConnection();
    try {
        const [Areas] = await con.query("select id_Area, nombre FROM Areas WHERE id_Area = ? and status = 1", [id_Area]);
        if (Areas.length === 0) {
            return res.status(404).json({ ok: false, msg: "Area no encontrada" });
        }

        const Area = Areas[0];

        const result = {
            id_Area: Area.id_Area,
            nombre: Area.nombre
        };

        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, msg: 'Algo salió mal' });
    } finally {
        con.release();
    }
}

const modificar_Area = async (req, res) => {
    const { id_Area } = req.params;
    const { nombre } = req.body;
    const con = await db.getConnection();

    try {
        const [Areas] = await con.query("SELECT * FROM Areas WHERE id_Area = ? and status = 1", [id_Area]);
        if (Areas.length === 0) {
            return res.status(404).json({ ok: false, msg: "Area no encontrada" });
        }

        await con.query(
            "update Areas set nombre = ? where id_Area = ?",
            [nombre, id_Area]
        );

        const [updatedAreaRows] = await con.query("SELECT * FROM Areas WHERE id_Area = ? and status = 1", [id_Area]);
        const Area = updatedAreaRows[0];

        const result = {
            id_Area: Area.id_Area,
            nombre: Area.nombre
        };

        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, msg: 'Algo salió mal' });
    } finally {
        con.release();
    }
}

const eliminar_Area = async (req, res) => {
    const { id_Area } = req.params;
    const con = await db.getConnection();
    try {
        const [Areas] = await con.query("SELECT * FROM Areas WHERE id_Area = ? and status = 1", [id_Area]);
        if (Areas.length === 0) {
            return res.status(404).json({ ok: false, msg: "Area no encontrada" });
        }

        await con.query("UPDATE areas SET status = 0 WHERE id_Area = ?", [id_Area]);

        return res.status(200).json({ ok: true, msg: "Area eliminada correctamente" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, msg: 'Algo salió mal' });
    } finally {
        con.release();
    }
}

module.exports = {
    registrar_Area,
    obtener_Area,
    obtener_Area_One,
    modificar_Area,
    eliminar_Area,
}