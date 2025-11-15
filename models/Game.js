// GameTracker-Backend/models/Game.js
const mongoose = require('mongoose');
const GameSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    genero: { type: String },           
    plataforma: { type: String },
    imagenPortada: { type: String }, 
    
    // 💥 CORRECCIÓN 1: ELIMINAMOS 'completado'
    // 💥 CORRECCIÓN 2: AÑADIMOS EL CAMPO 'status' REQUERIDO
    status: { 
        type: String, 
        required: true,
        // Los valores que tu Dashboard espera contar
        enum: ['Pendiente', 'Jugando', 'Terminado', 'Abandonado'], 
        default: 'Pendiente'
    },
    
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
}, { timestamps: true });

module.exports = mongoose.model('Game', GameSchema);