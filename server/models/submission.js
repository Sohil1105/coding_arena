// Submission schema for MongoDB
const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  code: String,
  language: String,
  verdict: String,
  stdout: String,
  stderr: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', SubmissionSchema);
