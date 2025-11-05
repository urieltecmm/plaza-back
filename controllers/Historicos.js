const db = require("../config/mysql");

const obtener_Historico = async (req, res) => {
    const con = await db.getConnection();
    try {
        const [Historicos] = await con.query(`
            SELECT 
                hi.id_Historial AS id_Historico,
                pe.nombre,
                pl.puesto,
                pl.nombre AS plaza,
                hi.old_Codigo AS codigo, 
                hi.old_Nivel AS nivel,
                hi.fecha_mod,
                un.nombre AS unidad,
                hi.autorizo,
                hi.tipo_mov
            FROM Historial AS hi
            JOIN Personal AS pe ON hi.id_Personal = pe.id_Personal
            LEFT JOIN Plazas AS pl ON hi.old_Plaza = pl.id_Plaza
            LEFT JOIN Unidades AS un ON pl.id_Unidad = un.id_Unidad
        `);
        Historicos.forEach(h => {
            if (h.fecha_mod) {
            const date = new Date(h.fecha_mod);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            h.fecha_mod = `${day}/${month}/${year}`;
            }
        });
        
        const final_Json = Historicos.map(Historico => ({
            id_Historico: Historico.id_Historico,
            nombre: Historico.nombre,
            puesto: Historico.puesto,
            unidad: Historico.unidad,
            plaza: Historico.plaza,
            codigo: Historico.codigo,
            fecha_mod: Historico.fecha_mod,
            nivel: Historico.nivel
        }));

        return res.status(200).json(final_Json);
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, msg: 'Algo salió mal' });
    } finally {
        con.release();
    }
};

const obtener_Historico_One = async (req, res) => {
    const { id_Plaza } = req.params;
    const con = await db.getConnection();
    try {
        const [Historicos] = await con.query(`
            SELECT 
                hi.id_Historial AS id_Historico,
                pe.nombre,
                pl.puesto,
                pl.nombre AS plaza,
                hi.old_Codigo AS codigo, 
                hi.old_Nivel AS nivel,
                hi.fecha_mod,
                un.nombre AS unidad,
                hi.autorizo,
                hi.tipo_mov
            FROM Historial AS hi
            JOIN Personal AS pe ON hi.id_Personal = pe.id_Personal
            LEFT JOIN Plazas AS pl ON hi.old_Plaza = pl.id_Plaza
            LEFT JOIN Unidades AS un ON pl.id_Unidad = un.id_Unidad
            WHERE hi.old_Plaza = ?;
        `, [id_Plaza]);
        Historicos.forEach(h => {
            if (h.fecha_mod) {
                const date = new Date(h.fecha_mod);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                h.fecha_mod = `${day}/${month}/${year}`;
            }
        });

        const final_Json = Historicos.map(Historico => ({
            id_Historico: Historico.id_Historico,
            nombre: Historico.nombre,
            puesto: Historico.puesto,
            unidad: Historico.unidad,
            plaza: Historico.plaza,
            codigo: Historico.codigo,
            fecha_mod: Historico.fecha_mod,
            nivel: Historico.nivel
        }));

        return res.status(200).json(final_Json);
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, msg: 'Algo salió mal' });
    } finally {
        con.release();
    }
};

const obtener_HistoricoP_One = async (req, res) => {
    const { id_Personal } = req.params;
    const con = await db.getConnection();
    try {
        const [Historicos] = await con.query(`
            SELECT 
                hi.id_Historial AS id_Historico,
                pe.nombre,
                pl.puesto,
                pl.nombre AS plaza,
                hi.old_Codigo AS codigo, 
                hi.old_Nivel AS nivel,
                hi.fecha_mod,
                un.nombre AS unidad,
                hi.autorizo,
                hi.tipo_mov
            FROM Historial AS hi
            JOIN Personal AS pe ON hi.id_Personal = pe.id_Personal
            LEFT JOIN Plazas AS pl ON hi.old_Plaza = pl.id_Plaza
            LEFT JOIN Unidades AS un ON pl.id_Unidad = un.id_Unidad
            WHERE hi.id_Personal = ?;
        `, [id_Personal]);
        Historicos.forEach(h => {
            if (h.fecha_mod) {
                const date = new Date(h.fecha_mod);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                h.fecha_mod = `${day}/${month}/${year}`;
            }
        });

        const final_Json = Historicos.map(Historico => ({
            id_Historico: Historico.id_Historico,
            nombre: Historico.nombre,
            puesto: Historico.puesto,
            unidad: Historico.unidad,
            plaza: Historico.plaza,
            codigo: Historico.codigo,
            fecha_mod: Historico.fecha_mod,
            nivel: Historico.nivel
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
    obtener_Historico,
    obtener_Historico_One,
    obtener_HistoricoP_One
}