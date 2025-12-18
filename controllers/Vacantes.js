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
                pl.nivel,
                pl.conversion,
                pl.reservada,
                pl.id_Unidad,
                u.nombre AS unidad,
                u.zona,
                pl.status,
                CASE 
                    WHEN pl.reservada = '-' THEN 'temporal'
                    ELSE 'normal'
                END AS tipo_vacante
            FROM Plazas pl
            LEFT JOIN Unidades u ON pl.id_Unidad = u.id_Unidad
            LEFT JOIN Asignaciones a ON pl.id_Plaza = a.id_Plaza AND a.status = 'Activo' AND a.vigencia = 'Temporal'
            WHERE (pl.reservada = 'No' OR (pl.reservada = '-' AND a.id_Asignacion IS NULL))
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
                pl.conversion,
                u.nombre AS unidad,
                u.zona,
                pl.status
            FROM Plazas pl
            LEFT JOIN Unidades u ON pl.id_Unidad = u.id_Unidad
            WHERE pl.status = 'Activo' AND pl.id_Plaza = ?;
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
    const {id_Plaza, nombre, puesto, tabulador, id_Unidad, nivel, conversion} = req.body;

    try {
        console.log(id_Plaza, nombre, puesto, tabulador, id_Unidad, nivel, conversion);
        const [validacion] = await con.query("SELECT count(id_Plaza) AS res FROM Plazas WHERE status = 'Activo' AND id_Plaza = ?", id_Plaza);

        if(parseInt(validacion[0].res) === 0){
            return res.status(200).json({ok: false, msg: 'La plaza no se encuentra vacante'}) 
        }

        await con.query("UPDATE Plazas SET nombre = ?, puesto = ?, tabulador = ?, id_Unidad = ?, nivel = ?, conversion = ? WHERE id_Plaza = ?", [nombre, puesto, tabulador, id_Unidad, nivel, conversion, id_Plaza])
        
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
    const {id_Personal, id_Plaza, notas, esReasignacion, fecha_inicio, fecha_termino} = req.body;

    try {
        console.log(id_Personal, id_Plaza);
        
        let fechaInicioFinal = fecha_inicio || null;
        
        // Si es reasignación, primero desactivar la asignación actual
        if (esReasignacion) {
            // Buscar la asignación activa del personal
            const [asignacionActual] = await con.query(
                "SELECT id_Asignacion, id_Plaza FROM Asignaciones WHERE id_Personal = ? AND status = 'Activo'",
                [id_Personal]
            );

            if (asignacionActual.length > 0) {
                const plazaAnterior = asignacionActual[0].id_Plaza;
                const fechaTerminoAnterior = fecha_inicio || null;
                
                // Desactivar la asignación anterior usando la fecha de inicio del formulario como fecha de término
                await con.query(
                    "UPDATE Asignaciones SET status = 'Inactivo', fecha_termino = IFNULL(?, CURDATE()) WHERE id_Asignacion = ?",
                    [fechaTerminoAnterior, asignacionActual[0].id_Asignacion]
                );
                
                // Liberar la plaza anterior
                await con.query(
                    "UPDATE Plazas SET status = 'Activo', reservada = 'No' WHERE id_Plaza = ?",
                    [plazaAnterior]
                );
            }
        } else {
            // Validar que la persona no tenga una plaza asignada (solo en nueva asignación)
            const [validar_personal] = await con.query(
                "SELECT COUNT(*) AS res FROM Asignaciones WHERE id_Personal = ? AND status = 'Activo'", 
                [id_Personal]
            );
            if(parseInt(validar_personal[0].res) > 0){
                return res.status(200).json({ok: false, msg: 'El personal ya tiene una plaza asignada'});
            }
        }

        // Validar que la plaza no está asignada
        const [validar_plaza] = await con.query(
            "SELECT COUNT(*) AS res FROM Asignaciones WHERE id_Plaza = ? AND status = 'Activo'", 
            [id_Plaza]
        );
        if(parseInt(validar_plaza[0].res) > 0){
            return res.status(200).json({ok: false, msg: 'La plaza ya se encuentra asignada'});
        }

        // Crear nueva asignación con fechas y notas
        // La vigencia siempre es 'Indeterminada' para asignaciones manuales
        await con.query(
            "INSERT INTO Asignaciones (id_Personal, id_Plaza, fecha_inicio, fecha_termino, status, vigencia, notas) VALUES (?, ?, IFNULL(?, CURDATE()), ?, 'Activo', 'Indeterminada', ?)",
            [id_Personal, id_Plaza, fechaInicioFinal, fecha_termino, notas]
        );
        
        // Marcar plaza como ocupada y reservada 'Si'
        await con.query("UPDATE Plazas SET status = 'Inactivo', reservada = 'Si' WHERE id_Plaza = ?", [id_Plaza]);

        const mensaje = esReasignacion ? "Plaza reasignada exitosamente" : "Plaza asignada exitosamente";
        return res.status(200).json({ok: true, msg: mensaje});
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
        // Buscar la asignación activa del personal
        const [validar_personal] = await con.query(
            "SELECT COUNT(*) AS res, id_Plaza, id_Asignacion FROM Asignaciones WHERE id_Personal = ? AND status = 'Activo'",
            [id_Personal]
        );
        
        if(parseInt(validar_personal[0].res) === 0){
            return res.status(200).json({ok: false, msg: 'El personal no tiene plaza asignada'});    
        }

        const id_Plaza = validar_personal[0].id_Plaza;
        const id_Asignacion = validar_personal[0].id_Asignacion;

        // Desactivar la asignación
        await con.query(
            "UPDATE Asignaciones SET status = 'Inactivo', fecha_termino = CURDATE() WHERE id_Asignacion = ?",
            [id_Asignacion]
        );
        
        // Liberar la plaza y marcar como no reservada
        await con.query("UPDATE Plazas SET status = 'Activo', reservada = 'No' WHERE id_Plaza = ?", [id_Plaza]);
        
        return res.status(200).json({ok: true, msg: 'se desasigno plaza exitosamente'});
    } catch (err){
        console.error(err);
        res.status(500).json({ ok: false, msg: 'Algo salió mal' });
    } finally {
        con.release();
    }
}

const getAllPlazas = async (req, res) => {
  const con = await db.getConnection();
  try {
    const [plazas] = await con.query(`
      SELECT 
        pl.id_Plaza AS id_Plaza, 
        pl.puesto,
        pl.nombre AS nombre,
        pl.status,
        pl.reservada
      FROM Plazas pl
      WHERE pl.status = 'Activo'
      ORDER BY pl.id_Plaza;
    `);

    return res.status(200).json(plazas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: 'Algo salió mal' });
  } finally {
    con.release();
  }
};

const getAllAsignadas = async (req, res) => {
  const con = await db.getConnection();
  try {
    const [asignadas] = await con.query(`
      SELECT 
        pl.id_Plaza,
        pl.nombre AS plaza,
        pl.puesto,
        pl.tabulador,
        pl.nivel,
        pl.conversion,
        pl.reservada,
        pl.id_Unidad,
        u.nombre AS unidad,
        u.zona,
        pe.id_Personal,
        pe.nombre AS nombre_empleado,
        pe.codigo,
        pe.sindicalizado
      FROM Plazas pl
      LEFT JOIN Unidades u ON pl.id_Unidad = u.id_Unidad
      LEFT JOIN Asignaciones a ON pl.id_Plaza = a.id_Plaza AND a.status = 'Activo'
      LEFT JOIN Personal pe ON a.id_Personal = pe.id_Personal
      WHERE pl.reservada = 'Si' OR (pl.reservada = '-' AND a.id_Asignacion IS NOT NULL AND a.vigencia = 'Temporal')
      ORDER BY pl.id_Plaza;
    `);

    return res.status(200).json(asignadas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: 'Algo salió mal' });
  } finally {
    con.release();
  }
};

const crearPlaza = async (req, res) => {
  const con = await db.getConnection();
  const { nombre, puesto, tabulador, id_Unidad, nivel, conversion } = req.body;

  try {
    // Validar que la unidad existe
    const [validarUnidad] = await con.query(
      "SELECT COUNT(*) AS res FROM Unidades WHERE id_Unidad = ?",
      [id_Unidad]
    );

    if (parseInt(validarUnidad[0].res) === 0) {
      return res.status(400).json({ ok: false, msg: 'La unidad especificada no existe' });
    }

    // Crear la nueva plaza
    await con.query(
      "INSERT INTO Plazas (nombre, puesto, tabulador, id_Unidad, nivel, conversion, status, reservada) VALUES (?, ?, ?, ?, ?, ?, 'Activo', 'No')",
      [nombre, puesto, tabulador, id_Unidad, nivel, conversion]
    );

    return res.status(201).json({ ok: true, msg: 'Plaza creada exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: 'Algo salió mal' });
  } finally {
    con.release();
  }
};

const getAsignacionesByPersonal = async (req, res) => {
  const con = await db.getConnection();
  const { id_Personal } = req.params;

  try {
    const [asignaciones] = await con.query(`
      SELECT 
        a.id_Asignacion,
        a.fecha_inicio,
        a.fecha_termino,
        a.vigencia,
        a.status,
        a.notas,
        pl.nombre AS plaza,
        pl.puesto,
        pl.nivel,
        u.nombre AS unidad,
        u.zona
      FROM Asignaciones a
      LEFT JOIN Plazas pl ON a.id_Plaza = pl.id_Plaza
      LEFT JOIN Unidades u ON pl.id_Unidad = u.id_Unidad
      WHERE a.id_Personal = ?
      ORDER BY a.fecha_inicio DESC
    `, [id_Personal]);

    return res.status(200).json(asignaciones);
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: 'Algo salió mal' });
  } finally {
    con.release();
  }
};

const getHistorialByPlaza = async (req, res) => {
  const con = await db.getConnection();
  const { id_Plaza } = req.params;

  try {
    const [historial] = await con.query(`
      SELECT 
        a.id_Asignacion,
        a.fecha_inicio,
        a.fecha_termino,
        a.vigencia,
        a.status,
        a.notas,
        pe.id_Personal,
        pe.nombre AS nombre_empleado,
        pe.codigo
      FROM Asignaciones a
      LEFT JOIN Personal pe ON a.id_Personal = pe.id_Personal
      WHERE a.id_Plaza = ?
      ORDER BY a.fecha_inicio DESC
    `, [id_Plaza]);

    return res.status(200).json(historial);
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: 'Algo salió mal' });
  } finally {
    con.release();
  }
};

const desactivarPlaza = async (req, res) => {
  const con = await db.getConnection();
  const { id_Plaza } = req.params;

  try {
    // Validar que la plaza existe y está activa
    const [validarPlaza] = await con.query(
      "SELECT COUNT(*) AS res, reservada FROM Plazas WHERE id_Plaza = ? AND status = 'Activo'",
      [id_Plaza]
    );

    if (parseInt(validarPlaza[0].res) === 0) {
      return res.status(404).json({ ok: false, msg: 'La plaza no existe o ya está inactiva' });
    }

    // Validar que la plaza no esté asignada
    if (validarPlaza[0].reservada === 'Si' || validarPlaza[0].reservada === '-') {
      return res.status(400).json({ ok: false, msg: 'No se puede desactivar una plaza asignada' });
    }

    // Desactivar la plaza
    await con.query(
      "UPDATE Plazas SET status = 'Inactivo' WHERE id_Plaza = ?",
      [id_Plaza]
    );

    return res.status(200).json({ ok: true, msg: 'Plaza desactivada exitosamente' });
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
    modificarVacantes,
    asignarVacante,
    desasignarVacante,
    getAllPlazas,
    getAllAsignadas,
    crearPlaza,
    getAsignacionesByPersonal,
    getHistorialByPlaza,
    desactivarPlaza,
};
