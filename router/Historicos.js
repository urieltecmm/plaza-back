const { Router } = require("express");
const { 
    obtener_Historico,
    obtener_Historico_One,
    obtener_HistoricoP_One,
} = require('../controllers/Historicos');

const routerHistoricos = Router();

routerHistoricos.get('/', obtener_Historico);
routerHistoricos.get('/v/:id_Plaza', obtener_Historico_One);
routerHistoricos.get('/p/:id_Personal', obtener_HistoricoP_One);

module.exports = (app) => app.use('/historico', routerHistoricos);