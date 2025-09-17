const db = require("../config/mysql");
const jwt = require('jsonwebtoken');


const iniciar_sesion = async (req, res) => {
    const {user, pass} = req.body;
    const con = await db.getConnection();

    try{
        const [validacion_usuario] = await con.query("SELECT COUNT(id_Usuario) AS res, nombre, email, tipo FROM Usuarios WHERE email = ? AND contra = sha1(?) AND status = 1", [user, pass]);

        if(parseInt(validacion_usuario[0].res) > 0){
            const validacion = validacion_usuario[0];
            const payload = {
                nombre: validacion.nombre,
                email: validacion.email,
                tipo: validacion.tipo
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '6h' });

            return res.status(200).json({ok: true, msg: "Inicio de sesión exitoso", token: token});
        }else{
            return res.status(404).json({ok: false, msg: "Inicio de sesión no valido"});
        }
    
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, msg: 'Algo salió mal' });
    } finally {
        con.release();
    }
}

module.exports = {
    iniciar_sesion
}