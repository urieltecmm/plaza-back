const { Router } = require("express");
const { 
    registrar_Personal,
    obtener_Personal,
    obtener_Personal_One,
} = require('../controllers/Personal');

const routerPersonal = Router();

routerPersonal.post('/', registrar_Personal);
routerPersonal.get('/', obtener_Personal);
routerPersonal.get('/:id_Personal', obtener_Personal_One);

module.exports = (app) => app.use('/personal', routerPersonal);