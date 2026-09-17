const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  explanation: { type: String, default: '' },
}, { _id: false });

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
}, { _id: false });

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, index: true },
  slug: { type: String, unique: true, sparse: true, index: true },
  difficulty: { type: String, required: true, enum: ['Easy', 'Medium', 'Hard'], index: true },
  topic: { type: String, required: true, trim: true, index: true },
  problemStatement: { type: String, required: true },
  inputFormat: { type: String, default: '' },
  outputFormat: { type: String, default: '' },
  constraints: { type: [String], default: [] },
  examples: { type: [exampleSchema], default: [] },
  starterCode: {
    java: { type: String, default: '' },
    python: { type: String, default: '' },
    cpp: { type: String, default: '' },
  },
  testCases: { type: [testCaseSchema], default: [] }, // Hidden test cases for backend evaluation
  solution: {
    approach: { type: String, default: '' },
    timeComplexity: { type: String, default: '' },
    spaceComplexity: { type: String, default: '' },
    java: { type: String, default: '' },
    python: { type: String, default: '' },
    cpp: { type: String, default: '' },
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);
