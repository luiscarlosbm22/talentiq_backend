import express from "express";
import {
    obtenerSedes,
    obtenerSedesPublic,
    nuevoSede,
    obtenerSede,
    editarSede,
    eliminarSede,
    obtenerSedePublic,
    obtenerSedesAdmin,
} from "../controllers/sedeController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

// Ruta pública para obtener todos los blogs sin autenticación
 router.route("/public").get(obtenerSedesPublic);
// router.route("/:id").get(obtenerProductoPublic);

//Obtener productos para el admin que los creo
router.route("/sed").get(checkAuth, obtenerSedesAdmin);

//Obtener productos para el admin que los creo
router.route("/editar-sede/:id").put(checkAuth, editarSede);

//Eliminar un producto para el admin que los creo
router.route("/eliminar-sede/:id").delete(checkAuth, eliminarSede);

router
    .route("/").get(checkAuth, obtenerSedes)
    .post(checkAuth, nuevoSede);

router
    .route("/:id")
    .get(checkAuth, obtenerSede)


export default router;
