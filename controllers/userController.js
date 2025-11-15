// GameTracker-Backend/controllers/userController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// 💥 CORRECCIÓN 1: ELIMINAR O COMENTAR LA CLAVE FIJA
// const SECRET = "ClaveSeguraParaGameTracker2025!"; 

const createToken = (_id) => {
    // 💥 CORRECCIÓN 2: USAR process.env.SECRET (asegurando que lea del .env)
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' }); 
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    try {
        const user = await User.findOne({ email });
        if (!user) throw Error('Email no registrado.');
        const match = await bcrypt.compare(password, user.password);
        if (!match) throw Error('Contraseña incorrecta.');
        const token = createToken(user._id);
        res.status(200).json({ email, token }); 
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const registerUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    try {
        const exists = await User.findOne({ email });
        if (exists) throw Error('El email ya está en uso.');
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ email, password: hashedPassword });
        const token = createToken(user._id);
        res.status(201).json({ email, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { loginUser, registerUser };