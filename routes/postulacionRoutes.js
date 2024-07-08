import express from 'express';
import { postularEmpleo } from '../controllers/postulacionController.js';
import checkAuth from "../middleware/checkAuth.js";


const router = express.Router();

router.post('/enviar/:id', checkAuth, postularEmpleo);

export default router;
