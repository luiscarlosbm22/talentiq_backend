import mongoose from "mongoose";
import Usuario from "../models/Usuario.js"
import Admin from "../models/Admin.js";
import Cliente from "../models/Cliente.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailOlvidePasswordCliente, emailOlvidePasswordAdmin } from "../helpers/email.js";

import AutenticarUsuarioCommand from "./CommandAutenticar/autenticarUsuarioCommand.js"
import ValidarUsuarioExistenteCommand from "./CommandAutenticar/validarUsuarioExistenteCommand.js"
import ValidarCuentaConfirmadaCommand from "./CommandAutenticar/validarCuentaConfirmadaCommand.js"
import ObtenerCamposEspecificosCommand from "./CommandAutenticar/obtenerCamposEspecificosCommand.js"
import AutenticarConContrasenaCommand from "./CommandAutenticar/autenticarConContrasenaCommand.js"

const registrarAdmin = async (req, res) => {
     const { nombres, apellidos, email, password } = req.body;
     const existeUsuarioPorEmail = await Usuario.findOne({ email });

     if (existeUsuarioPorEmail) {
          const error = new Error('Email ya registrado');
          return res.status(400).json({ msg: error.message });
     }

     try {
          const admin = new Admin({ nombres, apellidos, email, password });
          admin.token = generarId();
          const adminAlmacenado = await admin.save();
          res.json({
               admin: adminAlmacenado,
               msg: "Usuario Creado Correctamente, Revisa tu Email para confirmar tu cuenta"
          });
     } catch (error) {
          console.log(error);
          res.status(500).json({ msg: 'Error al registrar el administrador' });
     }
};

const editarCliente = async (req, res) => {
     try {
          const { id } = req.params; // Obtén el ID del cliente de los parámetros de la solicitud
          const { nombres, apellidos, email, rol, confirmado, password, codigo_cliente, token } = req.body; // Obtén los nuevos datos del cliente de la solicitud

          // Busca el cliente por su ID
          const cliente = await Cliente.findById(id);

          // Si el cliente no se encuentra, devuelve un error
          if (!cliente) {
               return res.status(404).json({ mensaje: "Cliente no encontrado" });
          }

          // Actualiza los campos del cliente con los nuevos datos
          cliente.nombres = nombres;
          cliente.apellidos = apellidos;
          cliente.email = email;
          cliente.rol = rol;
          cliente.confirmado = confirmado;
          cliente.token = token;
          cliente.codigo_cliente = codigo_cliente;

          // Si el password no se proporciona en la solicitud, mantener el mismo password
          cliente.password = password ? password : cliente.password;

          // Guarda los cambios en la base de datos
          await cliente.save();

          // Devuelve una respuesta con el cliente actualizado
          res.status(200).json({ mensaje: "Cliente actualizado correctamente", cliente: cliente });
     } catch (error) {
          console.error("Error al editar el cliente:", error);
          res.status(500).json({ mensaje: "Error interno del servidor" });
     }
};

const eliminarCliente = async (req, res) => {
     try {
          // Verificar si el usuario que realiza la solicitud es un administrador
          if (req.usuario.__t !== 'Admin') {
               return res.status(401).json({ msg: 'No autorizado para realizar esta acción' });
          }

          // Obtener el ID del cliente a eliminar desde los parámetros de la solicitud
          const { id } = req.params;

          // Verificar si el ID proporcionado es válido
          if (!mongoose.Types.ObjectId.isValid(id)) {
               return res.status(400).json({ msg: 'ID de cliente inválido' });
          }

          // Buscar el cliente en la base de datos
          const cliente = await Cliente.findById(id);

          // Verificar si el cliente existe
          if (!cliente) {
               return res.status(404).json({ msg: 'Cliente no encontrado' });
          }

          // Eliminar el cliente de la base de datos
          await cliente.deleteOne();

          res.json({ msg: 'Cliente eliminado correctamente' });
     } catch (error) {
          console.log(error);
          res.status(500).json({ msg: 'Error al eliminar el cliente' });
     }
};



// Función para registrar un cliente
const registrarCliente = async (req, res) => {
     const { nombres, apellidos, email, password } = req.body;

     // Verificar si el correo electrónico ya está registrado
     const existeUsuarioPorEmail = await Usuario.findOne({ email });
     if (existeUsuarioPorEmail) {
          return res.status(400).json({ msg: 'Email del cliente ya registrado' });
     }

     try {
          // Crear un nuevo cliente utilizando el modelo Cliente
          const cliente = new Cliente({ nombres, apellidos, email, password });

          // Generar un token para el cliente
          cliente.token = generarId();

          // Guardar el cliente en la base de datos
          await cliente.save();

          // Enviar el email de confirmación
          emailRegistro({
               email: cliente.email,
               token: cliente.token
          });

          // Responder con un mensaje de éxito
          res.json({ msg: "Usuario Creado Correctamente, Revisa tu Email para confirmar tu cuenta" });
     } catch (error) {
          console.log(error);
          res.status(500).json({ msg: 'Error en el servidor' });
     }
};


//Funcion para Obtener a los Uusarios que son Clientes
const obtenerClientes = async (req, res) => {
     try {

          const adminId = req.usuario;
          // Buscar usuarios con el rol "Cliente"
          const clientes = await Cliente.find({ __t: 'Cliente', admin_id: adminId });
          res.status(200).json(clientes); // Devolver los clientes encontrados como respuesta
     } catch (error) {
          console.error('Error al obtener clientes:', error);
          res.status(500).json({ message: 'Error interno del servidor' });
     }
}

//Obtener trabajador para el usuario que lo creo
const obtenerTrabajador = async (req, res) => {
     const { id } = req.params;

     const trabajador = await Cliente.findById(id)

     if (!trabajador) {
          const error = new Error('No encontrado');
          return res.status(404).json({ msg: error.message })

     }
     if (trabajador.admin_id.toString() !== req.usuario._id.toString()) {
          const error = new Error('Accion no válida o no tienes los permisos');
          return res.status(401).json({ msg: error.message })

     }

     res.json(trabajador)
}


// La función principal utilizando las funciones compuestas
const autenticar = async (req, res) => {
     const { email, password } = req.body;

     try {
          const autenticarCommand = new AutenticarUsuarioCommand({ email, password });
          const usuario = await autenticarCommand.execute();

          const validarExistenteCommand = new ValidarUsuarioExistenteCommand(usuario);
          validarExistenteCommand.execute();

          const validarConfirmadaCommand = new ValidarCuentaConfirmadaCommand(usuario);
          validarConfirmadaCommand.execute();

          const autenticarContraseñaCommand = new AutenticarConContrasenaCommand(usuario, password);
          const autenticado = await autenticarContraseñaCommand.execute();

          if (autenticado) {
               const obtenerCamposCommand = new ObtenerCamposEspecificosCommand(usuario);
               const camposEspecificos = obtenerCamposCommand.execute();

               res.json({
                    _id: usuario._id,
                    email: usuario.email,
                    token: generarJWT(usuario._id),
                    confirmado: usuario.confirmado,
                    __t: usuario.__t,
                    createdAt: usuario.createdAt,
                    ...camposEspecificos,
               });
          }
     } catch (error) {
          return res.status(403).json({ msg: error.message });
     }
};


const confirmar = async (req, res) => {
     const { token } = req.params
     const usuarioConfirmar = await Usuario.findOne({ token });
     if (!usuarioConfirmar) {
          const error = new Error("Token no valido");
          return res.status(403).json({ msg: error.message });
     }
     try {
          usuarioConfirmar.confirmado = true;
          usuarioConfirmar.token = "";
          await usuarioConfirmar.save();
          res.json({ msg: "Usuario confirmado correctamente" });

     } catch (error) {
          console.log(error);
     }
};

const olvidePasswordCliente = async (req, res) => {
     const { email } = req.body;
     const usuarioCliente = await Cliente.findOne({ email });

     if (!usuarioCliente) {
          const error = new Error("El usuario no existe o es inválido");
          return res.status(404).json({ msg: error.message });
     }

     try {
          usuarioCliente.token = generarId();
          await usuarioCliente.save();

          //Enviar el email
          emailOlvidePasswordCliente({
               email: usuarioCliente.email,
               codigo_cliente: usuarioCliente.codigo_cliente,
               token: usuarioCliente.token
          });

          res.json({ msg: "Hemos enviado un email con las instrucciones" });
     } catch (error) {
          console.log(error);
     }
};
const olvidePasswordAdmin = async (req, res) => {
     const { email } = req.body;
     const usuarioAdmin = await Admin.findOne({ email });

     if (!usuarioAdmin) {
          const error = new Error("El usuario no existe o inválido");
          return res.status(404).json({ msg: error.message });
     }

     try {
          usuarioAdmin.token = generarId();
          await usuarioAdmin.save();

          //Enviar el email
          emailOlvidePasswordAdmin({
               email: usuarioAdmin.email,
               nombres: usuarioAdmin.nombres,
               token: usuarioAdmin.token
          });

          res.json({ msg: "Hemos enviado un email con las instrucciones" });
     } catch (error) {
          console.log(error);
     }
};

const comprobarToken = async (req, res) => {
     const { token } = req.params;

     const usuarioAdmin = await Admin.findOne({ token });
     const usuarioCliente = await Cliente.findOne({ token });

     if (usuarioAdmin) {
          res.json({ msg: "Token válido para administrador" });
     } else if (usuarioCliente) {
          res.json({ msg: "Token válido para cliente" });
     } else {
          const error = new Error("Token no válido o usuario no válido");
          return res.status(403).json({ msg: error.message });
     }
};

const nuevoPassword = async (req, res) => {
     const { token } = req.params;
     const { password } = req.body;

     const usuario = await Usuario.findOne({ token });
     if (usuario) {
          usuario.password = password;
          usuario.token = "";

          try {
               await usuario.save();
               res.json({ msg: "Password Modificado Correctamente" });
          } catch (error) {
               console.log(error);
          }
     } else {
          const error = new Error("Token no válido");
          return res.status(403).json({ msg: error.message });
     }
};

const perfil = async (req, res) => {
     const { usuario } = req;
     res.json(usuario);
}




export {
     registrarAdmin,
     registrarCliente,
     autenticar,
     confirmar,
     olvidePasswordCliente,
     olvidePasswordAdmin,
     comprobarToken,
     nuevoPassword,
     perfil,
     obtenerClientes,
     obtenerTrabajador,
     editarCliente,
     eliminarCliente
};