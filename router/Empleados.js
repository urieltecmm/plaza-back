const { Router } = require("express");
const { obtener_Empleados_Por_Status } = require("../controllers/Empleados");
const verificarToken = require("../middlewares/token");

const routerEmpleados = Router();

routerEmpleados.get("/:status", verificarToken, obtener_Empleados_Por_Status);

module.exports = (app) => app.use('/empleados', routerEmpleados);
