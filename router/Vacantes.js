const { Router } = require("express");
const { 
    getAllVacantes,
    getVacanteById,
    getAllPlazas,
    modificarVacantes,
    asignarVacante,
    desasignarVacante,
} = require('../controllers/Vacantes');
const verificarToken = require("../middlewares/token");

const routerVacante = Router();

routerVacante.get('/', verificarToken, getAllVacantes);
routerVacante.get('/plazas', verificarToken, getAllPlazas);
routerVacante.get('/:idVacante', verificarToken, getVacanteById);
routerVacante.patch('/', verificarToken, modificarVacantes)
routerVacante.post('/asignar', verificarToken, asignarVacante);
routerVacante.delete('/desasignar/:id_Personal', verificarToken, desasignarVacante);

module.exports = (app) => app.use('/vacantes', routerVacante);