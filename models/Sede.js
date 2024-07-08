import mongoose from "mongoose";

const sedeSchema = mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        required: true,
    },
    direccion: {
        type: String,
        trim: true,
        required: true,
    },
    director: {
        type: String,
        trim: true,
        required: true,
    },
    linkImagen: {
        type: String,
        trim: true,
        required: true,
    },
    
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
    }

}, {
    timestamps: true,
    }
);

const Sede = mongoose.model("Sede", sedeSchema);

export default Sede;