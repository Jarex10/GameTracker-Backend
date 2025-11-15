// GameTracker-Backend/routes/games.js
const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/requireAuth');
const { 
    getGames, 
    createGame, 
    deleteGame, 
    updateGame,
    getGameStats // <-- Importamos la nueva función de estadísticas
} = require('../controllers/gameController'); // <-- Asegúrate de que esta línea esté actualizada

// Aplica el middleware JWT a todas las rutas definidas a continuación
router.use(requireAuth);

// 💥 NUEVA RUTA: Obtener las estadísticas personales del usuario
// Endpoint: GET /api/juegos/stats
router.get('/stats', getGameStats); 

// Rutas CRUD existentes
router.get('/', getGames);
router.post('/', createGame);
router.delete('/:id', deleteGame);
router.put('/:id', updateGame);

module.exports = router;