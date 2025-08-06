const express = require('express');
const router = express.Router();
const Submission = require('./models/submission');
const auth = require('./middleware/auth');

// @route   POST api/submissions
// @desc    Create a submission
// @access  Private
const axios = require('axios');
const Problem = require('./models/problem');

router.post('/', auth, async (req, res) => {
    const { problemId, code, language } = req.body;

    try {
        // Fetch problem test cases
        const problem = await Problem.findOne({ id: problemId });
        if (!problem) {
            return res.status(404).json({ msg: 'Problem not found' });
        }

        const testCases = problem.testCases || [];
        const results = [];

        // Run code against each test case using compiler backend /run API
        for (const testCase of testCases) {
            // Prepare code with test case input appended or passed as input
            // Here we append input as a comment or modify code accordingly
            // For simplicity, we assume code reads input from stdin, so we send input as part of request if supported
            // Since compiler backend only accepts code, we append input as comment (adjust as needed)
            const codeWithInput = code + `\n// Input: ${testCase.input}`;

            // Call compiler backend /run API
            const response = await axios.post('http://localhost:8000/run', {
                language,
                code: codeWithInput
            });

            const output = response.data.output.trim();

            // Compare output with expected output
            const passed = output === testCase.output;

            results.push({
                input: testCase.input,
                expectedOutput: testCase.output,
                actualOutput: output,
                passed
            });
        }

        // Aggregate results
        const allPassed = results.every(r => r.passed);
        const outputSummary = allPassed ? 'Accepted' : 'Failed';
        const detailedOutput = JSON.stringify(results, null, 2);

        const newSubmission = new Submission({
            problemId,
            code,
            language,
            output: `${outputSummary}\n${detailedOutput}`,
            userId: req.user.id
        });

        const submission = await newSubmission.save();
        res.json(submission);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/submissions/user/:userId
// @desc    Get all submissions by a user
// @access  Private
router.get('/user/:userId', auth, async (req, res) => {
    try {
        const submissions = await Submission.find({ userId: req.params.userId }).sort({ submittedAt: -1 });
        res.json(submissions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
