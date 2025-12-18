const db = require("../config/mysql");

const obtener_Empleados_Por_Status = async (req, res) => {
    const { status } = req.params;
    const con = await db.getConnection();
    
    try {
        const [Empleados] = await con.query(`
            SELECT 
                pe.id_Personal,
                pe.nombre,
                pe.codigo,
                pe.fecha_entrada,
                pe.fecha_termino,
                pe.status,
                pe.sindicalizado,
                pl.nombre as plaza,
                pl.puesto,
                u.nombre as unidad,
                u.zona,
                a.id_Plaza
            FROM Personal as pe
            LEFT JOIN Asignaciones as a ON pe.id_Personal = a.id_Personal AND a.status = 'Activo'
            LEFT JOIN Plazas as pl ON a.id_Plaza = pl.id_Plaza
            LEFT JOIN Unidades as u ON pl.id_Unidad = u.id_Unidad
            WHERE pe.status = ?
            ORDER BY pe.nombre;
        `, [status]);

        const final_Json = Empleados.map(empleado => ({
            id_Personal: empleado.id_Personal,
            nombre: empleado.nombre,
            codigo: empleado.codigo,
            fecha_entrada: empleado.fecha_entrada,
            fecha_termino: empleado.fecha_termino,
            status: empleado.status,
            sindicalizado: empleado.sindicalizado,
            plaza: empleado.plaza,
            puesto: empleado.puesto,
            unidad: empleado.unidad,
            zona: empleado.zona,
            id_Plaza: empleado.id_Plaza
        }));

        return res.status(200).json(final_Json);
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, msg: 'Algo salió mal' });
    } finally {
        con.release();
    }
};

module.exports = {
    obtener_Empleados_Por_Status
};
