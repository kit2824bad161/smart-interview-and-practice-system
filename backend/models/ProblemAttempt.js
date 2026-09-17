const mongoose = require('mongoose');

const problemAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true, index: true },
  title: { type: String, required: true },
  difficulty: { type: String, required: true, enum: ['Easy', 'Medium', 'Hard'] },
  topic: { type: String, required: true },
  language: { type: String, required: true, enum: ['java', 'python', 'cpp'], default: 'java' },
  problemSnapshot: {
    title: String,
    difficulty: String,
    topic: String,
    problemStatement: String,
    inputFormat: String,
    outputFormat: String,
    constraints: [String],
    examples: [{
      input: String,
      output: String,
      explanation: String,
    }],
  },
  code: { type: String, default: '' },
  status: {
    type: String,
    enum: ['in_progress', 'accepted', 'wrong_answer', 'runtime_error', 'compilation_error', 'time_limit_exceeded'],
    default: 'in_progress',
    index: true,
  },
  testCasesPassed: { type: Number, default: 0 },
  totalTestCases: { type: Number, default: 0 },
  verdict: { type: String, default: '' },
  hintsUsed: { type: Number, default: 0 },
  aiReview: {
    approachSummary: { type: String, default: '' },
    timeComplexity: { type: String, default: '' },
    spaceComplexity: { type: String, default: '' },
    codeQuality: { type: String, default: '' },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    optimizationSuggestions: { type: [String], default: [] },
    cleanerApproach: { type: String, default: '' },
  },
  startedAt: { type: Date, default: Date.now },
  submittedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('ProblemAttempt', problemAttemptSchema);
