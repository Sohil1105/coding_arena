const express = require('express');
const router = express.Router();
const Submission = require('./models/submission');
const auth = require('./middleware/auth');

const axios = require('axios');
const Problem = require('./models/problem');

// Create a new submission
router.post('/', auth, async (req, res) => {
    const { problemId, code, language } = req.body;

    try {
        // Fetch problem details for test cases
        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ msg: 'Problem not found' });
        }

        const testCases = problem.testCases || [];
        const results = [];

        // Execute code against each test case
        for (const testCase of testCases) {
            // Append input to the code (adjust as per compiler API)
            const codeWithInput = code + `\n// Input: ${testCase.input}`;

            // Call the compiler service
            const response = await axios.post(`${process.env.COMPILER_URL}/run`, {
                language,
                code: codeWithInput
            });

            const output = response.data.output.trim();

            // Validate the output against the expected output
            const passed = output === testCase.output;

            results.push({
                input: testCase.input,
                expectedOutput: testCase.output,
                actualOutput: output,
                passed
            });
        }

        // Summarize test case results
        const allPassed = results.every(r => r.passed);
        const outputSummary = allPassed ? 'Accepted' : 'Failed';
        const detailedOutput = JSON.stringify(results, null, 2);

        // Create a new submission record
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

// Fetch all submissions for a specific user
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
