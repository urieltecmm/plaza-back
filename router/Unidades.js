const { Router } = require("express");
const { 
    registrar_Unidad,
    obtener_Unidad,
    obtener_Unidad_One,
    modificar_Unidad,
    eliminar_Unidad
} = require('../controllers/Unidades');

const routerUnidades = Router();

routerUnidades.post('/', registrar_Unidad);
routerUnidades.get('/', obtener_Unidad);
routerUnidades.get('/:id_Unidad', obtener_Unidad_One);
routerUnidades.put('/:id_Unidad', modificar_Unidad);
routerUnidades.delete('/:id_Unidad', eliminar_Unidad);

module.exports = (app) => app.use('/Unidades',routerUnidades);
