const { Router } = require("express");
const { modificarPlazas } = require("../controllers/Plazas");
const verificarToken = require("../middlewares/token");

const routerPlazas = Router();

routerPlazas.patch('/', verificarToken, modificarPlazas)

module.exports = (app) => app.use('/plazas',routerPlazas);