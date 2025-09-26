const { Router } = require("express");
const { 
    getAllVacantes,
    getVacanteById,
    modificarVacantes,
    asignarVacante,
    desasignarVacante,
} = require('../controllers/Vacantes');

const routerVacante = Router();

routerVacante.get('/', getAllVacantes);
routerVacante.get('/:idVacante', getVacanteById);
routerVacante.put('/', modificarVacantes)
routerVacante.post('/asignar', asignarVacante);
routerVacante.delete('/desasignar/:id_Personal', desasignarVacante);

module.exports = (app) => app.use('/vacantes', routerVacante);