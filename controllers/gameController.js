// GameTracker-Backend/controllers/gameController.js
const Game = require('../models/Game');
const mongoose = require('mongoose');

const getGames = async (req, res) => {
    const userId = req.user._id; 
    try {
        const games = await Game.find({ userId }).sort({ createdAt: -1 }); 
        res.status(200).json(games);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los juegos.' });
    }
};

const createGame = async (req, res) => {
    const { titulo } = req.body;
    if (!titulo) return res.status(400).json({ error: 'El título es obligatorio.' });
    
    if (req.body.status && !['Pendiente', 'Jugando', 'Terminado', 'Abandonado'].includes(req.body.status)) {
        return res.status(400).json({ error: 'Estado de juego inválido.' });
    }

    try {
        const userId = req.user._id; 
        const game = await Game.create({ ...req.body, userId });
        res.status(201).json(game);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteGame = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ error: 'ID de juego inválido' });
    
    const game = await Game.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!game) return res.status(404).json({ error: 'Juego no encontrado o no autorizado.' });
    res.status(200).json(game);
};

// Asegura que el campo 'status' se actualice correctamente (Arreglo del PUT)
const updateGame = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ error: 'ID de juego inválido' });
    
    const game = await Game.findOneAndUpdate(
        { _id: id, userId: req.user._id }, 
        { $set: req.body }, // Usar $set para asegurar la actualización del 'status'
        { new: true } 
    );
    if (!game) return res.status(404).json({ error: 'Juego no encontrado o no autorizado.' });
    res.status(200).json(game);
};

// 💥 FUNCIÓN PARA OBTENER ESTADÍSTICAS (Corregida con $ifNull)
const getGameStats = async (req, res) => {
    const userId = req.user._id.toString(); 

    try {
        // Pipeline de Agregación de MongoDB para calcular conteos por estado
        const stats = await Game.aggregate([
            // 1. Convertir la cadena userId a tipo ObjectId para el $match
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            
            // 💥 CORRECCIÓN FINAL: Usamos $ifNull para agrupar los datos viejos que tienen status: null
            {
                $group: {
                    // Si 'status' es nulo, lo agrupa como "Sin Clasificar".
                    _id: { $ifNull: ['$status', 'Sin Clasificar'] }, 
                    count: { $sum: 1 } // Contar cuántos juegos hay en cada estado
                }
            },
            
            // 3. Ordenar por la cantidad de juegos (mayor a menor)
            { $sort: { count: -1 } }
        ]);

        if (stats.length === 0) {
             // Si no hay juegos, devuelve un array vacío
             return res.status(200).json([]);
        }

        res.status(200).json(stats);

    } catch (error) {
        res.status(500).json({ error: 'Error al calcular las estadísticas.', details: error.message });
    }
};

module.exports = { 
    getGames, 
    createGame, 
    deleteGame, 
    updateGame,
    getGameStats // Exportamos la función
};