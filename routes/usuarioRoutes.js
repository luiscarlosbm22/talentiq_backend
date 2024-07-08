import express from "express";
const router = express.Router();

import {
    registrarAdmin,
    registrarCliente,
    autenticar, confirmar,
    olvidePasswordCliente,
    olvidePasswordAdmin,
    comprobarToken,
    nuevoPassword,
    perfil,
    obtenerClientes,
    obtenerTrabajador,
    editarCliente,
    eliminarCliente
} from '../controllers/usuarioController.js'
import checkAuth from "../middleware/checkAuth.js";

//Autenticación, Registro y Confirmación de Usuarios
router.post('/admin', registrarAdmin);
// Registro de cliente (formulario público)
router.post("/cliente", registrarCliente);


router.post('/login', autenticar);
router.get("/confirmar/:token", confirmar);
router.post("/cliente/olvide-password", olvidePasswordCliente);
router.post("/admin/olvide-password", olvidePasswordAdmin);

router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);
router.get("/perfil", checkAuth, perfil);

//Obtener Clientes
router.get("/obtener-clientes", checkAuth, obtenerClientes)
//Eliminar Cliente
router.delete("/eliminar-cliente/:id", checkAuth, eliminarCliente)

//Editar Cliente
router.put("/editar-cliente/:id", checkAuth, editarCliente)

export default router;