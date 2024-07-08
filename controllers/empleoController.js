import mongoose from "mongoose";
import Cliente from "../models/Cliente.js";
import Usuario from "../models/Usuario.js";
import Empleo from "../models/Empleo.js";

const obtenerEmpleos = async (req, res) => {
    try {
        // Suponiendo que req.usuario contiene el ID del cliente que realiza la solicitud
        const cliente = await Cliente.findById(req.usuario); // Obtener los detalles del cliente
        if (!cliente) {
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }

        // Usar el admin_id del cliente para buscar los productos asociados al administrador
        const empleos = await Empleo.find({ admin_id: cliente.admin_id });
        res.json(empleos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al obtener los empleos' });
    }
};

const obtenerEmpleosAdmin = async (req, res) => {
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
        const empleos = await Empleo.find({ admin_id: usuario._id });
        res.json(empleos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al obtener los empleos' });
    }
};


const obtenerEmpleosPublic = async (req, res) => {
    try {
        const empleos = await Empleo.find();
        res.json(empleos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al obtener los empleos' });
    }
};

const nuevoEmpleo = async (req, res) => {
    const empleo = new Empleo(req.body)
    empleo.admin_id = req.usuario._id

    try {
        const empleoAlmacenado = await empleo.save()
        res.json(empleoAlmacenado);
    } catch (error) {
        console.log(error);
    }
};
const obtenerEmpleoPublic = async (req, res) => {
    const { id } = req.params;
    let empleo;

    if (mongoose.Types.ObjectId.isValid(id)) {
        empleo = await Empleo.findById(id);
        if (empleo) {
            return res.json(empleo);
        } else {
            const error = new Error('Empleo no fue encontrado');
            return res.status(404).json({ msg: error.message });
        }
    } else {
        const error = new Error('ID de empleo no válido');
        return res.status(400).json({ msg: error.message });
    }
};

//Obtener producto para el usuario que lo creo
const obtenerEmpleo = async (req, res) => {
    const {_id} = req.params;

    const empleo = await Empleo.findById(_id)

    if (!empleo) {
        const error = new Error('No encontrado');
        return res.status(404).json({ msg: error.message })
        
    }
    if (empleo.admin_id.toString() !== req.usuario._id.toString()) {
        const error = new Error('Accion no válida o no tienes los permisos');
        return res.status(401).json({ msg: error.message })
        
    }

    res.json(empleo)
};

const editarEmpleo = async (req, res) => {
    const {id} = req.params;

    const empleo = await Empleo.findById(id)

    if (!empleo) {
        const error = new Error('No encontrado');
        return res.status(404).json({ msg: error.message })
        
    }
    if (empleo.admin_id.toString() !== req.usuario._id.toString()) {
        const error = new Error('Accion no válida o no tienes los permisos');
       
        return res.status(401).json({ msg: error.message })

        
        
    }

    empleo.titulo = req.body.titulo || empleo.titulo;
    empleo.descripcion = req.body.descripcion || empleo.descripcion;
    empleo.salario = req.body.salario || empleo.salario;
    empleo.tipo_empleo = req.body.tipo_empleo || empleo.tipo_empleo;
    empleo.estado = req.body.estado || empleo.estado;
    empleo.sede = req.body.sede || empleo.sede;

    try {
        const empleoAlmacenado = await empleo.save()
        res.json(empleoAlmacenado)
    } catch (error) {
        console.log(error);
    }
};

const actualizarEmpleos = async (empleos) => {
    try {
      const filter = { _id: { $in: empleos.map(p => p.id) } };
      const update = { $inc: { cantidad: -1 } };
      await Empleo.updateMany(filter, update);
    } catch (error) {
      console.error(error);
    }
  };

const eliminarEmpleo = async (req, res) => {
    const {id} = req.params;

    const empleo = await Empleo.findById(id)

    if (!empleo) {
        const error = new Error('No encontrado');
        return res.status(404).json({ msg: error.message })
        
    }
    if (empleo.admin_id.toString() !== req.usuario._id.toString()) {
        const error = new Error('Accion no válida o no tienes los permisos');
        return res.status(401).json({ msg: error.message })
        
    }
    try {
        await empleo.deleteOne();
        res.json({msg: "Empleo Eliminado"})
    } catch (error) {
        console.log(error);
    }
};




export {
    obtenerEmpleos,
    nuevoEmpleo,
    obtenerEmpleo,
    editarEmpleo,
    eliminarEmpleo,
    actualizarEmpleos,
    obtenerEmpleoPublic,
    obtenerEmpleosPublic,
    obtenerEmpleosAdmin,
}