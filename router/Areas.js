const { Router } = require("express");
const { 
    registrar_Area,
    obtener_Area,
    obtener_Area_One,
} = require('../controllers/Areas');

const routerAreas = Router();

routerAreas.post('/', registrar_Area);
routerAreas.get('/', obtener_Area);
routerAreas.get('/:id_Area', obtener_Area_One);

module.exports = (app) => app.use('/area',routerAreas);
