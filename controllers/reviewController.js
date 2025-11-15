// GameTracker-Backend/controllers/reviewController.js
const Review = require('../models/Review');
const mongoose = require('mongoose');

const getReviews = async (req, res) => {
    const userId = req.user._id; 
    try {
        const reviews = await Review.find({ userId }).sort({ fechaCreacion: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las reseñas.' });
    }
};

const createReview = async (req, res) => {
    const { gameId, puntuacion, textoReseña } = req.body;
    if (!gameId || !puntuacion || !textoReseña) {
        return res.status(400).json({ error: 'Faltan campos obligatorios para la reseña.' });
    }
    try {
        const userId = req.user._id; 
        const review = await Review.create({ ...req.body, userId });
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteReview = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ error: 'ID de reseña inválido' });
    const review = await Review.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!review) return res.status(404).json({ error: 'Reseña no encontrada o no autorizada.' });
    res.status(200).json(review);
};

const updateReview = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ error: 'ID de reseña inválido' });
    const review = await Review.findOneAndUpdate(
        { _id: id, userId: req.user._id }, 
        { ...req.body }, 
        { new: true } 
    );
    if (!review) return res.status(404).json({ error: 'Reseña no encontrada o no autorizada.' });
    res.status(200).json(review);
};

module.exports = { getReviews, createReview, deleteReview, updateReview };