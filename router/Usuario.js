const { Router } = require("express");

const {iniciar_sesion} = require("../controllers/Usuarios");

const UsuarioRoutes = Router();

UsuarioRoutes.post("/sesion", iniciar_sesion);

module.exports = (app) => app.use('/Usuario', UsuarioRoutes);