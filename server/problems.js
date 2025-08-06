const express = require('express');
const router = express.Router();
const Problem = require('./models/problem');
const auth = require('./middleware/auth');

// @route   GET api/problems
//@desc    Get all problems
// @access  Public
router.get('/', async (req, res) => {
    try {
        const problems = await Problem.find();
        res.json(problems);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/problems/:id
// @desc    Get problem by ID
// @access  Public
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

// @route   POST api/problems
// @desc    Create a problem
// @access  Private
router.post('/', auth, async (req, res) => {
    const { id, title, description, difficulty, tags, testCases, author } = req.body;

    try {
        const newProblem = new Problem({
            id,
            title,
            description,
            difficulty,
            tags,
            testCases,
            author
        });

        const problem = await newProblem.save();
        res.json(problem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/problems/:id
// @desc    Update a problem
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { title, description, difficulty, tags, testCases, author } = req.body;

    const problemFields = {};
    if (title) problemFields.title = title;
    if (description) problemFields.description = description;
    if (difficulty) problemFields.difficulty = difficulty;
    if (tags) problemFields.tags = tags;
    if (testCases) problemFields.testCases = testCases;
    if (author) problemFields.author = author;

    try {
        let problem = await Problem.findOne({ id: req.params.id });

        if (!problem) return res.status(404).json({ msg: 'Problem not found' });

        // Check user
        if (problem.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        problem = await Problem.findOneAndUpdate(
            { id: req.params.id },
            { $set: problemFields },
            { new: true }
        );

        res.json(problem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/problems/:id
// @desc    Delete a problem
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let problem = await Problem.findOne({ id: req.params.id });

        if (!problem) return res.status(404).json({ msg: 'Problem not found' });

        // Check user
        if (problem.author.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Problem.findOneAndRemove({ id: req.params.id });

        res.json({ msg: 'Problem removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
