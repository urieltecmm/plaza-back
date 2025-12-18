const { Router } = require("express");
const { 
    getAllVacantes,
    getVacanteById,
    getAllPlazas,
    getAllAsignadas,
    modificarVacantes,
    asignarVacante,
    desasignarVacante,
    crearPlaza,
    getAsignacionesByPersonal,
    getHistorialByPlaza,
    desactivarPlaza,
} = require('../controllers/Vacantes');
const verificarToken = require("../middlewares/token");

const routerVacante = Router();

routerVacante.get('/', verificarToken, getAllVacantes);
routerVacante.get('/asignadas', verificarToken, getAllAsignadas);
routerVacante.get('/asignaciones/:id_Personal', verificarToken, getAsignacionesByPersonal);
routerVacante.get('/historial-plaza/:id_Plaza', verificarToken, getHistorialByPlaza);
routerVacante.get('/plazas', verificarToken, getAllPlazas);
routerVacante.get('/:idVacante', verificarToken, getVacanteById);
routerVacante.patch('/', verificarToken, modificarVacantes)
routerVacante.post('/asignar', verificarToken, asignarVacante);
routerVacante.post('/', verificarToken, crearPlaza);
routerVacante.delete('/desasignar/:id_Personal', verificarToken, desasignarVacante);
routerVacante.delete('/desactivar/:id_Plaza', verificarToken, desactivarPlaza);

module.exports = (app) => app.use('/vacantes', routerVacante);