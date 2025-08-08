const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/user');

// Handle user registration
router.post('/signup', async (req, res) => {
    const { name, phone, email, password, college, profilePicture } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            phone,
            email,
            password: hashedPassword,
            college,
            profilePicture,
        });
        await newUser.save();
        res.status(201).json({ message: 'Signup successful!' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'An error occurred during signup.' });
    }
});

// Handle user login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid credentials.' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials.' });
        const token = jwt.sign({ 
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }, process.env.JWT_SECRET);
        res.json({ token });
    } catch(err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

module.exports = router;
