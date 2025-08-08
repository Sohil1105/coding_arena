const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./auth');
const problemsRoutes = require('./problems');
const submissionsRoutes = require('./submissions');
const usersRoutes = require('./users');
const leaderboardRoutes = require('./leaderboard');
require('dotenv').config();

const app = express();
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));
app.use(express.json());

// Establish connection to MongoDB
const connectDB = async () => {
    const maxRetries = 5;
    const retryDelay = 5000;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const mongoUrl = process.env.MONGO_URL;
            if (!mongoUrl) {
                console.error('MONGO_URL environment variable is required.');
                process.exit(1);
            }
            
            await mongoose.connect(mongoUrl, {
                ssl: true,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
                maxPoolSize: 10,
                minPoolSize: 2,
                maxIdleTimeMS: 10000
            });
            
            console.log('MongoDB Atlas connected successfully.');
            return;
        } catch (err) {
            console.error(`MongoDB connection attempt ${attempt} failed:`, err.message);
            if (attempt === maxRetries) {
                console.error('Max retries reached. Exiting...');
                process.exit(1);
            }
            console.log(`Retrying in ${retryDelay/1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
};

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/problems', problemsRoutes);
app.use('/api/submissions', submissionsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

if (!process.env.JWT_SECRET) {
    console.warn('Warning: JWT_SECRET is not set. JWT authentication will fail. Set JWT_SECRET in your environment variables or .env file.');
}

if (!process.env.MONGO_URL) {
    console.warn('Warning: MONGO_URL is not set. Defaulting to mongodb://localhost:27017/codingarena. Set MONGO_URL in your environment variables or docker-compose.yml for production.');
}

// Health check endpoint
app.get('/', (req, res) => {
    res.status(200).send('Backend API is running successfully.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
