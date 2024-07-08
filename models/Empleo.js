import mongoose from 'mongoose';

const postulanteSchema = new mongoose.Schema({
    usuario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    nombres: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cv_text: {
        type: String,
        required: true
    },
    cv_url: {
        type: String,
        required: true
    },
    postulado_at: {
        type: Date,
        default: Date.now
    }
});

const empleoSchema = mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    sede: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    salario: {
        type: String,
        required: true,
        trim: true
    },
    tipo_empleo: {
        type: String,
        required: true,
        trim: true
    },

    estado: {
        type: String,
        required: true,
        default: 'Abierta',
        trim: true
    },
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
    },
    postulantes: [postulanteSchema]
}, {
    timestamps: true
});

const Empleo = mongoose.model('Empleo', empleoSchema);

export default Empleo;
