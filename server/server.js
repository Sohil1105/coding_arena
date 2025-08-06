// Main backend entry
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./auth');
const problemsRoutes = require('./problems');
const submissionsRoutes = require('./submissions');
const usersRoutes = require('./users');
const leaderboardRoutes = require('./leaderboard');
const aiRoutes = require('./ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/codingarena', {});
        console.log('MongoDB connected successfully.');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Exit on failure
    }
};

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/problems', problemsRoutes);
app.use('/api/submissions', submissionsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/ai', aiRoutes);

if (!process.env.JWT_SECRET) {
    console.warn('Warning: JWT_SECRET is not set. JWT authentication will fail. Set JWT_SECRET in your environment variables or .env file.');
}

if (!process.env.MONGO_URL) {
    console.warn('Warning: MONGO_URL is not set. Defaulting to mongodb://localhost:27017/codingarena. Set MONGO_URL in your environment variables or docker-compose.yml for production.');
}

// Health check
app.get('/', (req, res) => {
    res.status(200).send('Backend API is running successfully.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
