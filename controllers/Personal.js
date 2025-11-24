const db = require("../config/mysql");

const registrar_Personal = async (req, res) => {
    const { nombre } = req.body;
    const con = await db.getConnection();

    try{
        const [Personals] = await con.query("SELECT id_Personal, nombre FROM Personal where nombre = ? and status = 1", [nombre]);
        if (Personals.find(Personals => Personals.nombre === nombre)) {
            return res.status(400).json({ok: false, msg: "La Personal ya existe"});
        }
        await con.query("INSERT INTO Personal (nombre) VALUES (?)", [nombre]);
        return res.status(201).json({msg: "Personal registrada correctamente"});
    }catch(err){
        console.log(err);
        res.status(500).json({ok: false, msg: 'Algo salió mal'});
    }finally{
        con.release();
    }
}

const registrar_Personal2 = async (req, res) => {
    const { nombre, fecha_entrada, sindicalizado } = req.body;
    const con = await db.getConnection();

    try{
        /*console.log(codigo, nombre, fecha_entrada, sindicalizado,);
        const [codigo_validacion] = await con.query("SELECT id_Personal, codigo FROM Personal where codigo = ? and status = 1", [codigo]);
        if (codigo_validacion.find(Codigo => Codigo.codigo === codigo)) {
            return res.status(400).json({ok: false, msg: "El código ya existe"});
        }*/

        const [Personals] = await con.query("SELECT id_Personal, nombre FROM Personal where nombre = ? and status = 1", [nombre]);
        if (Personals.find(Personals => Personals.nombre === nombre)) {
            return res.status(400).json({ok: false, msg: "La Personal ya existe"});
        }
        await con.query("INSERT INTO Personal(nombre, fecha_entrada, sindicalizado, status) VALUES (?, ?, ?, 1)", [nombre, fecha_entrada, sindicalizado]);
        return res.status(201).json({ok: true, msg: "Personal registrada correctamente"});
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
            select pl.id_Plaza, pe.status, pe.id_Personal, pe.nombre, pl.puesto, u.nombre as unidad, u.zona ,pl.nombre as plaza, pe.codigo, pl.nivel, pe.sindicalizado, pl.tabulador,
            (
                SELECT COUNT(*) 
                FROM Historial h
                WHERE h.id_Personal = pe.id_Personal 
            ) AS total_historial
            from Personal as pe
            join Plazas as pl on pe.id_Plaza = pl.id_Plaza
            left join Unidades as u on pl.id_Unidad = u.id_Unidad
            where pe.status = 1
			ORDER by pe.codigo ;
        `);

        const final_Json = Personals.map(Personal => ({
            id_Personal: Personal.id_Personal,
            id_Plaza: Personal.id_Plaza,
            nombre: Personal.nombre,
            puesto: Personal.puesto,
            unidad: Personal.unidad,
            zona: Personal.zona,
            plaza: Personal.plaza,
            codigo: Personal.codigo,
            nivel: Personal.nivel,
            tabulador: Personal.tabulador,
            sindicalizado: Personal.sindicalizado,
            total_historial: Personal.total_historial,
            status: Personal.status
        }));

        return res.status(200).json(final_Json);
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, msg: 'Algo salió mal' });
    } finally {
        con.release();
    }
};

const obtener_Personal_solo = async (req, res) => {
    const con = await db.getConnection();
    try {
        const [Personals] = await con.query(`
            select 
            pe.id_Personal,
            pe.codigo,
            pe.nombre,
            pe.fecha_entrada,
            pe.sindicalizado,
            pl.nombre as plaza,
            u.zona,
            from Personal as pe
            join Plazas as pl on pe.id_Plaza = pl.id_Plaza
            left join Unidades as u on pl.id_Unidad = u.id_Unidad
            where pe.status = 1
			ORDER by pe.codigo;
        `);

        const final_Json = Personals.map(Personal => ({
            id_Personal: Personal.id_Personal,
            id_Plaza: Personal.id_Plaza,
            nombre: Personal.nombre,
            puesto: Personal.puesto,
            zona: Personal.zona,
            unidad: Personal.unidad,
            plaza: Personal.plaza,
            codigo: Personal.codigo,
            nivel: Personal.nivel,
            tabulador: Personal.tabulador,
            sindicalizado: Personal.sindicalizado,
            total_historial: Personal.total_historial,
            status: Personal.status
        }));

        return res.status(200).json(final_Json);
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, msg: 'Algo salió mal' });
    } finally {
        con.release();
    }
};

const obtener_Personal_vacante = async (req, res) => {
    const con = await db.getConnection();

    try {
        const [Personals] = await con.query(`
            select 
            pe.id_Personal,
            pe.nombre,
            pe.codigo
            from Personal as pe
            where pe.id_Plaza IS null
            AND status = 1
			ORDER by pe.codigo;
        `);

        const final_Json = Personals.map(Personal => ({
            id_Personal: Personal.id_Personal,
            nombre: Personal.nombre,
            codigo: Personal.codigo,
        }));

        return res.status(200).json(final_Json);
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, msg: 'Algo salió mal' });
    } finally {
        con.release();
    }
};

const obtener_Personal_solo_one = async (req, res) => {
    const con = await db.getConnection();
    const {id_Personal} = req.params;
    try {
        const [Personals] = await con.query(`
            select 
            pe.id_Personal,
            pe.codigo,
            pe.nombre,
            pe.fecha_entrada,
            pe.sindicalizado,
            pl.nombre as plaza,
            u.zona,
            from Personal as pe
            join Plazas as pl on pe.id_Plaza = pl.id_Plaza
            left join Unidades as u on pl.id_Unidad = u.id_Unidad
            where pe.status = 1 AND pe.id_Personal = ?
			ORDER by pe.codigo;
        `, [id_Personal]);

        const final_Json = Personals.map(Personal => ({
            id_Personal: Personal.id_Personal,
            id_Plaza: Personal.id_Plaza,
            nombre: Personal.nombre,
            puesto: Personal.puesto,
            zona: Personal.zona,
            unidad: Personal.unidad,
            plaza: Personal.plaza,
            codigo: Personal.codigo,
            nivel: Personal.nivel,
            tabulador: Personal.tabulador,
            sindicalizado: Personal.sindicalizado,
            total_historial: Personal.total_historial,
            status: Personal.status
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
        const [Personals] = await con.query("select id_Personal, nombre FROM Personal WHERE id_Personal = ? and status = 1", [id_Personal]);
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
    const { codigo, nombre, sindicalizado, id_Plaza, autorizo, status, salida } = req.body;
    const con = await db.getConnection();

    try {
        const [validacion_historial1] = await con.query("SELECT id_Historial as res FROM Historial ORDER BY id_Historial DESC LIMIT 1");

        const validacion1 = validacion_historial1[0].res;

        await con.query(
            "UPDATE Personal SET codigo = ?, nombre = ?, sindicalizado = ?, id_Plaza = ?, status = ? WHERE id_Personal = ?",
            [codigo, nombre, sindicalizado, id_Plaza, status, id_Personal]
        );

        const [validacion_historial2] = await con.query("SELECT id_Historial as res FROM Historial ORDER BY id_Historial DESC LIMIT 1");

        const validacion2 = validacion_historial2[0].res;

        if(validacion1 !== validacion2){
            if(status === false){
                //desasignar plaza
                await con.query("UPDATE Personal SET id_Plaza = NULL WHERE id_Personal = ?", [id_Personal]);
                await con.query("UPDATE Plazas SET status = 1 WHERE id_Plaza = ?", [id_Plaza]);

                await con.query(
                    "UPDATE Historial SET autorizo = ?, salida = ? WHERE id_Historial = ?",
                    [autorizo, salida, validacion2]
                );
                return res.status(200).json({codigo, nombre, sindicalizado, id_Plaza, autorizo, status, salida});
            }else{
                await con.query(
                    "UPDATE Historial SET autorizo = ? WHERE id_Historial = ?",
                    [autorizo, validacion2]
                );
                return res.status(200).json({codigo, nombre, sindicalizado, id_Plaza, autorizo, status});
            }
        } else {
            return res.status(200).json({codigo, nombre, sindicalizado, id_Plaza, status});
        }
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
    eliminar_Personal,
    modificar_Personal,
    obtener_Personal_solo,
    obtener_Personal_solo_one,
    obtener_Personal_vacante,
    registrar_Personal2
}