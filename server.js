// GameTracker-Backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Cargar variables de entorno. ¡Debe ser de las primeras líneas!
require('dotenv').config({ path: './.env' })

// --- 1. Importar Rutas ---
const userRoutes = require('./routes/user'); 
const gameRoutes = require('./routes/games'); 
const reviewRoutes = require('./routes/reviews'); 

const app = express();

// ***** LEYENDO VALORES REALES DESDE .env *****
const MONGO_URI = process.env.MONGO_URI; 
const SECRET = process.env.SECRET; 
const PORT = process.env.PORT || 7000;
// ********************************************

// --- 2. Middlewares Globales ---
app.use(cors());          
app.use(express.json());  

// --- 3. Rutas de la API (Conexión de las Rutas con el Servidor) ---
app.use('/api/user', userRoutes);   
app.use('/api/juegos', gameRoutes); 
app.use('/api/reseñas', reviewRoutes); 


// --- 4. Conexión a MongoDB y Arranque del Servidor ---
// Líneas de depuración (puedes borrarlas después)
console.log('--- INTENTANDO CONECTAR A ---'); 
console.log('URI:', MONGO_URI);             

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Servidor conectado a la base de datos Atlas.');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor Express escuchando en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ Error fatal de conexión a MongoDB:', error.message);
        console.error('Revisa la URI en tu archivo .env y la configuración de IP de tu Atlas.');
    });