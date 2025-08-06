const mongoose = require('mongoose');
const Problem = require('./models/problem');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Read problems from problems.json
const problemsJsonPath = path.join(__dirname, '..', 'problems.json');
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
    // Use localhost for local development, mongo for Docker
    const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/codingarena';
    await mongoose.connect(mongoUrl);
    await Problem.deleteMany({});
    await Problem.insertMany(problems);
    console.log(`Database seeded with ${problems.length} problems!`);
    mongoose.connection.close();
};

seedDB(); 