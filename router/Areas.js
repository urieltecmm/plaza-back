const { Router } = require("express");
const { 
    registrar_Area,
    obtener_Area,
    obtener_Area_One,
    modificar_Area,
    eliminar_Area
} = require('../controllers/Areaes');

const routerAreas = Router();

routerAreas.post('/', registrar_Area);
routerAreas.get('/', obtener_Area);
routerAreas.get('/:id_Area', obtener_Area_One);
routerAreas.put('/:id_Area', modificar_Area);
routerAreas.delete('/:id_Area', eliminar_Area);

module.exports = (app) => app.use('/Area',routerAreas);
