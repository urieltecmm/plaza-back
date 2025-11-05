const { Router } = require("express");
const { 
    obtener_Historico,
    obtener_Historico_One,
    obtener_HistoricoP_One,
} = require('../controllers/Historicos');
const verificarToken = require("../middlewares/token");

const routerHistoricos = Router();

routerHistoricos.get('/', verificarToken, obtener_Historico);
routerHistoricos.get('/v/:id_Plaza', verificarToken, obtener_Historico_One);
routerHistoricos.get('/p/:id_Personal', verificarToken, obtener_HistoricoP_One);

module.exports = (app) => app.use('/historico', routerHistoricos);