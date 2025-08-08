const express = require('express');
const router = express.Router();
const Problem = require('./models/problem');
const auth = require('./middleware/auth');

// Fetch all problems
router.get('/', async (req, res) => {
    try {
        const problems = await Problem.find();
        res.json(problems);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Fetch a single problem by ID
router.get('/:id', async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) {
            return res.status(404).json({ msg: 'Problem not found' });
        }
        res.json(problem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Create a new problem
router.post('/', auth, async (req, res) => {
    const { title, description, difficulty, tags, testCases } = req.body;

    try {
        const newProblem = new Problem({
            title,
            description,
            difficulty,
            tags,
            testCases,
            author: req.user.id
        });

        const problem = await newProblem.save();
        res.json(problem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update an existing problem
router.put('/:id', auth, async (req, res) => {
    const { title, description, difficulty, tags, testCases } = req.body;

    const problemFields = {};
    if (title) problemFields.title = title;
    if (description) problemFields.description = description;
    if (difficulty) problemFields.difficulty = difficulty;
    if (tags) problemFields.tags = tags;
    if (testCases) problemFields.testCases = testCases;

    try {
        let problem = await Problem.findById(req.params.id);

        if (!problem) return res.status(404).json({ msg: 'Problem not found' });

        // Verify user is the author or an admin
        if (problem.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        problem = await Problem.findByIdAndUpdate(
            req.params.id,
            { $set: problemFields },
            { new: true }
        );

        res.json(problem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a problem
router.delete('/:id', auth, async (req, res) => {
    try {
        let problem = await Problem.findById(req.params.id);

        if (!problem) return res.status(404).json({ msg: 'Problem not found' });

        // Verify user is the author or an admin
        if (problem.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Problem.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Problem removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
