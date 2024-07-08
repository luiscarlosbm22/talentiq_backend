import mongoose from "mongoose";

const ordenSchema = mongoose.Schema({
    cliente: {
      type: String,
      required: true
    },
    mesa: {
      type: String,
      required: true
    },
    productos: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Producto',
          required: true
        },
        nombre: {
          type: String,
          required: true
        },
        descripcion: {
          type: String
        },
        precioUnitario: {
          type: Number,
          required: true
        },
        linkImagen: {
          type: String
        },
        cantidad: {
          type: Number,
          required: true,
          default: 1 // Puedes establecer un valor predeterminado si lo deseas
        },
        categoria: {
          type: String,
          required:true
        }
        // Otros campos de producto si los hay
      }
    ],
    mesero: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
      },
      nombres: {
        type: String,
        required: true
      },
      apellidos: {
        type: String,
        required: true
      }
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    completada: {
      type: Boolean,
      default: false // Por defecto, la orden se considera pendiente
  },
    fechaCreacion: {
      type: Date,
      default: Date.now
    }
  }, {
    timestamps: true
  });
  
  const Orden = mongoose.model('Orden', ordenSchema);
  

export default Orden;