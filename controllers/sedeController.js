import mongoose from "mongoose";
import Sede from "../models/Sede.js";
import Cliente from "../models/Cliente.js";
import Usuario from "../models/Usuario.js";

const obtenerSedes = async (req, res) => {
    try {
        // Suponiendo que req.usuario contiene el ID del cliente que realiza la solicitud
        const cliente = await Cliente.findById(req.usuario); // Obtener los detalles del cliente
        if (!cliente) {
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }

        // Usar el admin_id del cliente para buscar los productos asociados al administrador
        const sedes = await Sede.find({ admin_id: cliente.admin_id });
        res.json(sedes);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al obtener las sedes' });
    }
};

const obtenerSedesAdmin = async (req, res) => {
    try {
        // Suponiendo que req.usuario contiene el ID del usuario que realiza la solicitud
        const usuario = await Usuario.findById(req.usuario); // Obtener los detalles del usuario
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        // Verificar si el usuario es un administrador
        if (usuario.__t !== 'Admin') {
            return res.status(403).json({ msg: 'El usuario no tiene permisos para acceder a esta información' });
        }

        // Usar el ID del usuario para buscar los productos asociados a ese administrador específico
        const sedes = await Sede.find({ admin_id: usuario._id });
        res.json(sedes);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al obtener los sedes' });
    }
};


const obtenerSedesPublic = async (req, res) => {
    try {
        const sedes = await Sede.find();
        res.json(sedes);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al obtener los sedes' });
    }
};

const nuevoSede = async (req, res) => {
    const sede = new Sede(req.body)
    sede.admin_id = req.usuario._id

    try {
        const sedeAlmacenado = await sede.save()
        res.json(sedeAlmacenado);
    } catch (error) {
        console.log(error);
    }
};
const obtenerSedePublic = async (req, res) => {
    const { id } = req.params;
    let sede;

    if (mongoose.Types.ObjectId.isValid(id)) {
        sede = await Sede.findById(id);
        if (sede) {
            return res.json(sede);
        } else {
            const error = new Error('La sede no fue encontrado');
            return res.status(404).json({ msg: error.message });
        }
    } else {
        const error = new Error('ID de sede no válido');
        return res.status(400).json({ msg: error.message });
    }
};

//Obtener producto para el usuario que lo creo
const obtenerSede = async (req, res) => {
    const {_id} = req.params;

    const sede = await Sede.findById(_id)

    if (!sede) {
        const error = new Error('No encontrado');
        return res.status(404).json({ msg: error.message })
        
    }
    if (sede.admin_id.toString() !== req.usuario._id.toString()) {
        const error = new Error('Accion no válida o no tienes los permisos');
        return res.status(401).json({ msg: error.message })
        
    }

    res.json(sede)
};

const editarSede = async (req, res) => {
    const {id} = req.params;

    const sede = await Sede.findById(id)

    if (!sede) {
        const error = new Error('No encontrado');
        return res.status(404).json({ msg: error.message })
        
    }
    if (sede.admin_id.toString() !== req.usuario._id.toString()) {
        const error = new Error('Accion no válida o no tienes los permisos');
       
        return res.status(401).json({ msg: error.message })

        
        
    }

    sede.nombre = req.body.nombre || sede.nombre;
    sede.direccion = req.body.direccion || sede.direccion;
    sede.director = req.body.director || sede.director;
    sede.linkImagen = req.body.linkImagen || sede.linkImagen;


    try {
        const sedeAlmacenado = await sede.save()
        res.json(sedeAlmacenado)
    } catch (error) {
        console.log(error);
    }
};

const actualizarSedes = async (sedes) => {
    try {
      const filter = { _id: { $in: sedes.map(p => p.id) } };
      const update = { $inc: { cantidad: -1 } };
      await Sede.updateMany(filter, update);
    } catch (error) {
      console.error(error);
    }
  };

const eliminarSede = async (req, res) => {
    const {id} = req.params;

    const sede = await Sede.findById(id)

    if (!sede) {
        const error = new Error('No encontrado');
        return res.status(404).json({ msg: error.message })
        
    }
    if (sede.admin_id.toString() !== req.usuario._id.toString()) {
        const error = new Error('Accion no válida o no tienes los permisos');
        return res.status(401).json({ msg: error.message })
        
    }
    try {
        await sede.deleteOne();
        res.json({msg: "Sede Eliminado"})
    } catch (error) {
        console.log(error);
    }
};

const buscarSede = async (req, res) => {
    const {codigoB} = req.body

    const sede = await Sede.findOne({codigoB}).select("-direccion -createdAt -updatedAt -__v")

    if (!sede) {
        const error = new Error("Sede no Encontrado");
        return res.status(404).json({msg: error.message});
    }

    res.json(sede)
}



export {
    obtenerSedes,
    nuevoSede,
    obtenerSede,
    editarSede,
    eliminarSede,
    buscarSede,
    actualizarSedes,
    obtenerSedePublic,
    obtenerSedesPublic,
    obtenerSedesAdmin,
}