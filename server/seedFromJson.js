const mongoose = require('mongoose');
const Problem = require('./models/problem');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Read problems from problems_20.json
const problemsJsonPath = path.join(__dirname, 'problems_20.json');
const problemsData = JSON.parse(fs.readFileSync(problemsJsonPath, 'utf8'));

// Convert problems.json format to database schema format
const problems = problemsData.map((problem, index) => ({
    id: problem.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    title: problem.name,
    description: problem.description,
    difficulty: problem.difficulty,
    tags: problem.tags,
    testCases: problem.testCases.map(testCase => ({
        input: testCase.input,
        output: testCase.expectedOutput
    })),
    author: problem.author
}));

const seedDB = async () => {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
        console.error('MONGO_URL environment variable is required.');
        process.exit(1);
    }
    
    try {
        await mongoose.connect(mongoUrl, {
            ssl: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            minPoolSize: 2,
            maxIdleTimeMS: 10000
        });
        
        console.log('Connected to MongoDB successfully');
        await Problem.deleteMany({});
        await Problem.insertMany(problems);
        console.log(`Database seeded with ${problems.length} problems!`);
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    } finally {
        mongoose.connection.close();
    }
};

seedDB();
