const { Router } = require("express");
const { 
    registrar_Personal,
    obtener_Personal,
    obtener_Personal_One,
    eliminar_Personal,
    modificar_Personal
} = require('../controllers/Personal');

const routerPersonal = Router();

routerPersonal.post('/', registrar_Personal);
routerPersonal.get('/', obtener_Personal);
routerPersonal.get('/:id_Personal', obtener_Personal_One);
routerPersonal.put('/:id_Personal', modificar_Personal);
routerPersonal.delete('/:id_Personal', eliminar_Personal);

module.exports = (app) => app.use('/personal', routerPersonal);