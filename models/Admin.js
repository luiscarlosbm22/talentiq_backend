import mongoose from "mongoose";
import Usuario from "./Usuario.js";

const adminSchema = mongoose.Schema({
    nombres: {
        type: String,
        required: true,
        trim: true,
    },
    apellidos: {
        type: String,
        required: true,
        trim: true,
    }
},
{
    timestamps:true,
});

const Admin = Usuario.discriminator("Admin", adminSchema);
export default Admin;
