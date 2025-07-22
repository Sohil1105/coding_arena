// Main backend entry point for AlgoU-Project
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./auth');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/algou', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use('/auth', authRoutes);

// Health check endpoint
app.get('/', (req, res) => {
    res.status(200).send('Backend API is running successfully.');
});

app.listen(5000, () => console.log('Server running on 5000'));
