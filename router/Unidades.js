const { Router } = require("express");
const { 
    obtener_Unidad,
    obtener_Unidad_One,
} = require('../controllers/Unidades');

const routerUnidades = Router();

routerUnidades.get('/', obtener_Unidad);
routerUnidades.get('/:id_Unidad', obtener_Unidad_One);

module.exports = (app) => app.use('/Unidades',routerUnidades);
