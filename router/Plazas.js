const { Router } = require("express");
const { modificarPlazas } = require("../controllers/Plazas");

const routerPlazas = Router();

routerPlazas.put('/', modificarPlazas)

module.exports = (app) => app.use('/Plazas',routerPlazas);