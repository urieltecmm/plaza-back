const { Router } = require("express");
const { modificarPlazas } = require("../controllers/Plazas");

const routerPlazas = Router();

routerPlazas.patch('/', modificarPlazas)

module.exports = (app) => app.use('/plazas',routerPlazas);