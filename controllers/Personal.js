const db = require("../config/mysql");

const registrar_Personal = async (req, res) => {
    const { nombre } = req.body;
    const con = await db.getConnection();

    try{
        const [Personals] = await con.query("SELECT id_Personal, nombre FROM Personal where nombre = ? and status = 'Activo'", [nombre]);
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
    const { codigo, nombre, fecha_entrada, sindicalizado } = req.body;
    const con = await db.getConnection();

    try{
        // Validar que el código no exista
        if (codigo) {
            const [codigo_validacion] = await con.query("SELECT id_Personal, codigo FROM Personal where codigo = ? and status = 'Activo'", [codigo]);
            if (codigo_validacion.length > 0) {
                return res.status(400).json({ok: false, msg: "El número de nómina ya existe"});
            }
        }

        const [Personals] = await con.query("SELECT id_Personal, nombre FROM Personal where nombre = ? and status = 'Activo'", [nombre]);
        if (Personals.find(Personals => Personals.nombre === nombre)) {
            return res.status(400).json({ok: false, msg: "La Personal ya existe"});
        }
        await con.query("INSERT INTO Personal(codigo, nombre, fecha_entrada, sindicalizado, status) VALUES (?, ?, ?, ?, 'Activo')", [codigo, nombre, fecha_entrada, sindicalizado]);
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
            SELECT 
                pe.id_Personal,
                pe.nombre,
                pe.codigo,
                pe.status,
                pe.sindicalizado,
                pl.id_Plaza,
                pl.nombre as plaza,
                pl.puesto,
                pl.nivel,
                pl.tabulador,
                pl.conversion,
                u.nombre as unidad,
                u.zona,
                (
                    SELECT COUNT(*) 
                    FROM Historial h
                    WHERE h.id_Personal = pe.id_Personal 
                ) AS total_historial
            FROM Personal as pe
            LEFT JOIN Asignaciones as a ON pe.id_Personal = a.id_Personal AND a.status = 'Activo'
            LEFT JOIN Plazas as pl ON a.id_Plaza = pl.id_Plaza
            LEFT JOIN Unidades as u ON pl.id_Unidad = u.id_Unidad
            WHERE pe.status = 'Activo'
            ORDER BY pe.codigo;
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
            conversion: Personal.conversion,
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
            SELECT 
                pe.id_Personal,
                pe.codigo,
                pe.nombre,
                pe.fecha_entrada,
                pe.sindicalizado,
                pl.id_Plaza,
                pl.nombre as plaza,
                pl.puesto,
                u.nombre as unidad,
                u.zona
            FROM Personal as pe
            LEFT JOIN Asignaciones as a ON pe.id_Personal = a.id_Personal AND a.status = 'Activo'
            LEFT JOIN Plazas as pl ON a.id_Plaza = pl.id_Plaza
            LEFT JOIN Unidades as u ON pl.id_Unidad = u.id_Unidad
            WHERE pe.status = 'Activo'
            ORDER BY pe.codigo;
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
            fecha_entrada: Personal.fecha_entrada,
            sindicalizado: Personal.sindicalizado
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
            SELECT 
                pe.id_Personal,
                pe.nombre,
                pe.codigo
            FROM Personal as pe
            LEFT JOIN Asignaciones as a ON pe.id_Personal = a.id_Personal AND a.status = 'Activo'
            WHERE a.id_Asignacion IS NULL
            AND (pe.status = 'Activo' OR pe.status = '1')
            ORDER BY pe.codigo;
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
            SELECT 
                pe.id_Personal,
                pe.codigo,
                pe.nombre,
                pe.fecha_entrada,
                pe.sindicalizado,
                pl.id_Plaza,
                pl.nombre as plaza,
                pl.puesto,
                u.nombre as unidad,
                u.zona
            FROM Personal as pe
            LEFT JOIN Asignaciones as a ON pe.id_Personal = a.id_Personal AND a.status = 'Activo'
            LEFT JOIN Plazas as pl ON a.id_Plaza = pl.id_Plaza
            LEFT JOIN Unidades as u ON pl.id_Unidad = u.id_Unidad
            WHERE pe.status = 'Activo' AND pe.id_Personal = ?
            ORDER BY pe.codigo;
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
            fecha_entrada: Personal.fecha_entrada,
            sindicalizado: Personal.sindicalizado
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
    const { codigo, nombre, sindicalizado, fecha_entrada } = req.body;
    const con = await db.getConnection();

    try {
        // Actualizar datos básicos del personal incluyendo fecha_entrada
        const updateFields = [];
        const updateValues = [];

        if (codigo !== undefined) {
            updateFields.push('codigo = ?');
            updateValues.push(codigo);
        }
        if (nombre !== undefined) {
            updateFields.push('nombre = ?');
            updateValues.push(nombre);
        }
        if (sindicalizado !== undefined) {
            updateFields.push('sindicalizado = ?');
            updateValues.push(sindicalizado);
        }
        if (fecha_entrada !== undefined) {
            updateFields.push('fecha_entrada = ?');
            updateValues.push(fecha_entrada);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ ok: false, msg: 'No hay campos para actualizar' });
        }

        updateValues.push(id_Personal);

        await con.query(
            `UPDATE Personal SET ${updateFields.join(', ')} WHERE id_Personal = ?`,
            updateValues
        );

        return res.status(200).json({
            ok: true, 
            msg: 'Personal actualizado correctamente', 
            data: {codigo, nombre, sindicalizado, fecha_entrada}
        });
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

const registrar_baja_licencia = async (req, res) => {
    const { id_Personal } = req.params;
    const { status, fecha_termino, fecha_licencia, motivo } = req.body;
    const con = await db.getConnection();

    try {
        // Verificar que el personal existe y está activo
        const [Personal] = await con.query(
            "SELECT id_Personal FROM Personal WHERE id_Personal = ? AND status = 'Activo'", 
            [id_Personal]
        );

        if (Personal.length === 0) {
            return res.status(404).json({ ok: false, msg: "Personal no encontrado o no está activo" });
        }

        // Buscar la asignación activa
        const [AsignacionActiva] = await con.query(
            "SELECT id_Asignacion, id_Plaza FROM Asignaciones WHERE id_Personal = ? AND status = 'Activo'",
            [id_Personal]
        );

        const id_Plaza = AsignacionActiva.length > 0 ? AsignacionActiva[0].id_Plaza : null;

        // Actualizar el personal con el nuevo status y fechas
        if (status === 'Licencia') {
            await con.query(
                "UPDATE Personal SET status = ?, motivo = ? WHERE id_Personal = ?",
                [status, motivo, id_Personal]
            );
            
            // Desactivar la asignación actual
            if (AsignacionActiva.length > 0) {
                const notaLicencia = `En Licencia hasta ${fecha_licencia}`;
                await con.query(
                    "UPDATE Asignaciones SET status = 'Inactivo', fecha_termino = ?, notas = ? WHERE id_Asignacion = ?",
                    [fecha_termino, notaLicencia, AsignacionActiva[0].id_Asignacion]
                );
            }
            
            // Liberar la plaza para licencias y marcar como reservada con '-'
            if (id_Plaza) {
                await con.query("UPDATE Plazas SET status = 1, reservada = '-' WHERE id_Plaza = ?", [id_Plaza]);
            }
        } else if (status === 'Baja') {
            await con.query(
                "UPDATE Personal SET status = ?, fecha_termino = ?, motivo = ? WHERE id_Personal = ?",
                [status, fecha_termino, motivo, id_Personal]
            );
            
            // Desactivar la asignación actual (mantiene vigencia Indeterminada para bajas definitivas)
            if (AsignacionActiva.length > 0) {
                await con.query(
                    "UPDATE Asignaciones SET status = 'Inactivo', fecha_termino = ?, notas = 'Baja Definitiva' WHERE id_Asignacion = ?",
                    [fecha_termino, AsignacionActiva[0].id_Asignacion]
                );
            }
            
            // Liberar la plaza definitivamente y marcar como no reservada
            if (id_Plaza) {
                await con.query("UPDATE Plazas SET status = 1, reservada = 'No' WHERE id_Plaza = ?", [id_Plaza]);
            }
        }

        return res.status(200).json({ 
            ok: true, 
            msg: `${status} registrada correctamente`
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, msg: 'Algo salió mal' });
    } finally {
        con.release();
    }
}

const reincorporar_empleado = async (req, res) => {
    const { id_Personal } = req.params;
    const con = await db.getConnection();

    try {
        // Verificar que el personal existe y está en Baja o Licencia
        const [Personal] = await con.query(
            "SELECT id_Personal, status FROM Personal WHERE id_Personal = ? AND (status = 'Baja' OR status = 'Licencia')", 
            [id_Personal]
        );

        if (Personal.length === 0) {
            return res.status(404).json({ ok: false, msg: "Personal no encontrado o no está en Baja/Licencia" });
        }

        // Actualizar el personal a estado Activo y limpiar campos
        await con.query(
            "UPDATE Personal SET status = 'Activo', fecha_termino = NULL, fecha_licencia = NULL, motivo = NULL WHERE id_Personal = ?",
            [id_Personal]
        );

        return res.status(200).json({ 
            ok: true, 
            msg: 'Empleado reincorporado exitosamente'
        });
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
    registrar_Personal2,
    registrar_baja_licencia,
    reincorporar_empleado
}