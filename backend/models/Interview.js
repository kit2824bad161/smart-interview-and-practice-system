const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  technicalScore:        Number,
  relevanceScore:        Number,
  completenessScore:     Number,
  communicationScore:    Number,
  confidenceScore:       Number,
  technicalCorrectness: Number,
  relevance:            Number,
  conceptCoverage:      Number,
  completeness:         Number,
  specificity:          Number,
  communication:        Number,
  overallScore:         Number,
  answerQuality:        String,
  strengths:            [String],
  weaknesses:           [String],
  missingConcepts:      [String],
  feedback:             String,
  suggestedAnswer:      String,
  improvementSuggestions: [String],
  idealAnswer:           String,
  evaluationSummary:     String,
}, { _id: false });

const questionSchema = new mongoose.Schema({
  question:         { type: String, required: true },
  category:         String,
  difficulty:       String,
  expectedConcepts: [String],
  answer:           { type: String, default: '' },
  evaluation:       evaluationSchema,
  answeredAt:       Date,
}, { _id: true });

const interviewSchema = new mongoose.Schema({
  userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobRole:       { type: String, required: true },
  experience:    { type: String, required: true },
  difficulty:    { type: String, required: true },
  interviewType: { type: String, required: true },
  totalQuestions:{ type: Number, required: true },
  questions:     [questionSchema],
  currentIndex:  { type: Number, default: 0 },
  status:        { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' },
  overallScore:  { type: Number, default: 0 },
  finalFeedback: {
    overallFeedback:    String,
    strengths:          [String],
    weaknesses:         [String],
    recommendedTopics:  [String],
    improvementPlan:    [String],
    readinessLevel:     String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
