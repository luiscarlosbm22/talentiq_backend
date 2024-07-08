import mongoose from "mongoose";
import Usuario from "./Usuario.js";

const clienteSchema = mongoose.Schema({

    nombres: {
        type: String,
        required: true,
        trim: true,
    },
    apellidos: {
        type: String,
        required: true,
        trim: true,
    },
    estado: {
        type: String,
        trim: true,
        default: 'Activo'
    },
  
},
{
    timestamps:true,
});

const Cliente = Usuario.discriminator("Cliente", clienteSchema);
export default Cliente;
