const { Router } = require("express");
const { 
    registrar_Unidad,
    obtener_Unidad,
    obtener_Unidad_One,
    modificar_Unidad,
    eliminar_Unidad
} = require('../controllers/Unidades');

const routerNoticias = Router();

routerNoticias.post('/', registrar_Unidad);
routerNoticias.get('/', obtener_Unidad);
routerNoticias.get('/:id_Unidad', obtener_Unidad_One);
routerNoticias.put('/:id_Unidad', modificar_Unidad);
routerNoticias.delete('/:id_Unidad', eliminar_Unidad);

module.exports = (app) => app.use('/Unidades',routerNoticias);
