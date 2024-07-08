import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import conectarDB from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import sedeRoutes from './routes/sedeRoutes.js';
import empleoRoutes from './routes/empleoRoutes.js';
import postulacionRoutes from './routes/postulacionRoutes.js';
import pdfParse from 'pdf-parse';  // Importar pdf-parse

dotenv.config();

const app = express();

app.use(express.json());
app.use(fileUpload());

conectarDB();

// Configurar CORS
const whitelist = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Error de cors'));
        }
    },
};
app.use(cors(corsOptions));

// Routing
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/empleos', empleoRoutes);
app.use('/api/postulacion', postulacionRoutes);
app.use('/api/sedes', sedeRoutes);

// Endpoint para extraer texto del PDF
app.post("/api/extract-text", async (req, res) => {
    if (!req.files || !req.files.pdfFile) {
        return res.status(400).json({ message: 'No se ha subido ningún archivo PDF' });
    }

    const pdfFile = req.files.pdfFile;

    try {
        const data = await pdfParse(pdfFile.data);
        res.status(200).json({ text: data.text });
    } catch (error) {
        console.error('Error al extraer texto del PDF:', error);
        res.status(500).json({ message: 'Error al extraer texto del PDF', error: error.message });
    }
});

const PORT = process.env.PORT || 4000;

const servidor = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
