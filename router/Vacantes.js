const { Router } = require("express");
const { 
    getAllVacantes,
    getVacanteById,
    getAllPlazas,
} = require('../controllers/Vacantes');

const routerVacante = Router();

routerVacante.get('/', getAllVacantes);
routerVacante.get('/plazas', getAllPlazas);
routerVacante.get('/:idVacante', getVacanteById);

module.exports = (app) => app.use('/vacantes', routerVacante);