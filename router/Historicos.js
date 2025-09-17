const { Router } = require("express");
const { 
    obtener_Historico,
    obtener_Historico_One,
} = require('../controllers/Historicos');

const routerHistoricos = Router();

routerHistoricos.get('/', obtener_Historico);
routerHistoricos.get('/:id_Plaza', obtener_Historico_One);

module.exports = (app) => app.use('/historico', routerHistoricos);