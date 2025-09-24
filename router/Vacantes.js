const { Router } = require("express");
const { 
    getAllVacantes,
    getVacanteById,
} = require('../controllers/Vacantes');

const routerVacante = Router();

routerVacante.get('/', getAllVacantes);
routerVacante.get('/:idVacante', getVacanteById);

module.exports = (app) => app.use('/vacantes', routerVacante);