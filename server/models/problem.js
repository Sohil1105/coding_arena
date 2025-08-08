const mongoose = require('mongoose');

// Defines the schema for the Problem model
const ProblemSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    testCases: [
        {
            input: {
                type: String,
                required: true
            },
            output: {
                type: String,
                required: true
            }
        }
    ],
    author: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Problem', ProblemSchema);
