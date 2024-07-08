import express from "express";
import {
    obtenerEmpleos,
    nuevoEmpleo,
    obtenerEmpleo,
    editarEmpleo,
    eliminarEmpleo,
    actualizarEmpleos,
    obtenerEmpleoPublic,
    obtenerEmpleosPublic,
    obtenerEmpleosAdmin,
} from "../controllers/empleoController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

// Ruta pública para obtener todos los emleos sin autenticación
 router.route("/public").get(obtenerEmpleosPublic);

//Obtener empleos para el admin que los creo
router.route("/emp").get(checkAuth, obtenerEmpleosAdmin);

//Obtener empleos para el admin que los creo
router.route("/editar-empleo/:id").put(checkAuth, editarEmpleo);

//Eliminar un producto para el admin que los creo
router.route("/eliminar-empleo/:id").delete(checkAuth, eliminarEmpleo);

router
    .route("/").get(checkAuth, obtenerEmpleos)
    .post(checkAuth, nuevoEmpleo);

router
    .route("/:id")
    .get(checkAuth, obtenerEmpleo)


export default router;
