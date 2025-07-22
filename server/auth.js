// Authentication routes for AlgoU-Project
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/user');

// Register new user
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    try {
        const user = await User.create({ username, password: hashed });
        res.json({ message: 'User registered!' });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(400).json({ error: 'Username taken or server error.' });
    }
});

// Login and return JWT
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ error: 'Invalid credentials.' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials.' });
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.json({ token });
    } catch(err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

module.exports = router;
