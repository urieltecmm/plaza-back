const { Router } = require("express");
const { 
    registrar_Personal,
    obtener_Personal,
    obtener_Personal_One,
} = require('../controllers/Personal');

const routerPersonals = Router();

routerPersonals.post('/', registrar_Personal);
routerPersonals.get('/', obtener_Personal);
routerPersonals.get('/:id_Personal', obtener_Personal_One);

module.exports = (app) => app.use('/Personal',routerPersonals);
