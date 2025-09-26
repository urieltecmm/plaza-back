const db = require("../config/mysql");


const obtener_Unidad = async (req, res) => {
    const con = await db.getConnection();
    try {
        const [Unidades] = await con.query("SELECT id_unidad, nombre, zona FROM Unidades");

        const final_Json = Unidades.map(unidad => ({
            id_unidad: unidad.id_unidad,
            nombre: unidad.nombre,
            zona: unidad.zona
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
        const [Unidades] = await con.query("SELECT id_unidad, nombre, zona FROM Unidades WHERE id_unidad = ? ", [id_Unidad]);
        if (Unidades.length === 0) {
            return res.status(404).json({ ok: false, msg: "Unidad no encontrada" });
        }

        const unidad = Unidades[0];

        const result = {
            id_unidad: unidad.id_unidad,
            nombre: unidad.nombre,
            zona: unidad.zona
        };

        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, msg: 'Algo salió mal' });
    } finally {
        con.release();
    }
}


module.exports = {
    obtener_Unidad,
    obtener_Unidad_One,
}