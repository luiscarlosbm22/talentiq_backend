import mongoose from "mongoose";
import Empleo from "../models/Empleo.js";
import Usuario from '../models/Usuario.js';

const postularEmpleo = async (req, res) => {
    const { id } = req.params; // ID del empleo
    const { usuarioId, cvUrl, cvText } = req.body;

    try {
        const empleo = await Empleo.findById(id);
        if (!empleo) {
            return res.status(404).json({ message: 'Empleo no encontrado' });
        }

        const usuario = await Usuario.findById(usuarioId);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar si el usuario ya ha postulado a este empleo
        const yaPostulado = empleo.postulantes.some(postulante => postulante.usuario_id.equals(usuarioId));
        if (yaPostulado) {
            return res.status(400).json({ message: 'Ya has postulado a este empleo' });
        }

        // Agregar el postulante al empleo
        empleo.postulantes.push({
            usuario_id: usuarioId,
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            email: usuario.email,
            cv_url: cvUrl,
            cv_text: cvText
        });

        await empleo.save();

        res.status(200).json({ message: 'Postulación exitosa', empleo });
    } catch (error) {
        console.error('Error al postular al empleo:', error);
        res.status(500).json({ message: 'Error al postular al empleo', error: error.message });
    }
};

export {
    postularEmpleo
};
