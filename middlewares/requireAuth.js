// GameTracker-Backend/middlewares/requireAuth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
// 💥 CORRECCIÓN 1: ELIMINAR O COMENTAR LA CLAVE FIJA
// const SECRET = "ClaveSeguraParaGameTracker2025!"; 

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: 'Autorización requerida. No hay token.' });
    }

    const token = authorization.split(' ')[1];

    try {
        // 💥 CORRECCIÓN 2: USAR process.env.SECRET para verificar el token
        const {_id} = jwt.verify(token, process.env.SECRET);
        req.user = await User.findOne({ _id }).select('_id');
        next(); 
    } catch (error) {
        res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

module.exports = requireAuth;