// GameTracker-Backend/models/Review.js
const mongoose = require('mongoose');
const ReviewSchema = new mongoose.Schema({
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true }, 
    puntuacion: { type: Number, min: 1, max: 5, required: true }, 
    textoReseña: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
}, { timestamps: true });
module.exports = mongoose.model('Review', ReviewSchema);