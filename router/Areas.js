const { Router } = require("express");
const { 
    registrar_Area,
    obtener_Area,
    obtener_Area_One,
} = require('../controllers/Areas');
const verificarToken = require("../middlewares/token");

const routerAreas = Router();

routerAreas.post('/', verificarToken, registrar_Area);
routerAreas.get('/', verificarToken, obtener_Area);
routerAreas.get('/:id_Area', verificarToken, obtener_Area_One);

module.exports = (app) => app.use('/area',routerAreas);
