const { Router } = require("express");
const { 
    obtener_Unidad,
    obtener_Unidad_One,
} = require('../controllers/Unidades');
const verificarToken = require("../middlewares/token");

const routerUnidades = Router();

routerUnidades.get('/', verificarToken, obtener_Unidad);
routerUnidades.get('/:id_Unidad', verificarToken, obtener_Unidad_One);

module.exports = (app) => app.use('/unidades',routerUnidades);
