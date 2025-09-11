const { Router } = require("express");
const { 
    registrar_Unidad,
    obtener_Unidad,
    obtener_Unidad_One,
} = require('../controllers/Unidades');

const routerUnidades = Router();

routerUnidades.post('/', registrar_Unidad);
routerUnidades.get('/', obtener_Unidad);
routerUnidades.get('/:id_Unidad', obtener_Unidad_One);

module.exports = (app) => app.use('/Unidades',routerUnidades);
