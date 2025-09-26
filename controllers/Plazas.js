const db = require("../config/mysql");

const modificarPlazas = async (req, res) => {
    const con = await db.getConnection();
    const {id_Plaza, puesto, id_Unidad, nivel} = req.body;

    try {
        const [validacion] = await con.query("SELECT count(id_Plaza) AS res FROM Plazas WHERE id_Plaza = ?", id_Plaza);

        if(parseInt(validacion[0].res) === 0){
            return res.status(200).json({ok: false, msg: 'La plaza no existe'}); 
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

module.exports = {
    modificarPlazas
}