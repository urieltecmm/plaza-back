const { Router } = require("express");
const { 
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
} = require('../controllers/Personal');
const verificarToken = require("../middlewares/token");

const routerPersonal = Router();

routerPersonal.post('/', verificarToken, registrar_Personal);
routerPersonal.post('/codigo/', verificarToken, registrar_Personal2);
routerPersonal.get('/', verificarToken, obtener_Personal);
routerPersonal.get('/libre/', verificarToken, obtener_Personal_vacante);
routerPersonal.get('/:id_Personal', verificarToken, obtener_Personal_One);
routerPersonal.get('/activo/solo', verificarToken, obtener_Personal_solo);
routerPersonal.get('/activo/solo/:id_Personal', verificarToken, obtener_Personal_solo_one)
routerPersonal.patch('/:id_Personal', verificarToken, modificar_Personal);
routerPersonal.put('/baja-licencia/:id_Personal', verificarToken, registrar_baja_licencia);
routerPersonal.put('/reincorporacion/:id_Personal', verificarToken, reincorporar_empleado);
routerPersonal.delete('/:id_Personal', verificarToken, eliminar_Personal);


module.exports = (app) => app.use('/personal', routerPersonal);