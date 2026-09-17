const mongoose = require('mongoose');
const { ASSESSMENT_THRESHOLDS } = require('../config/assessment');

const assessmentMcqQuestionSchema = new mongoose.Schema({
  questionNumber: { type: Number, required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true, validate: value => Array.isArray(value) && value.length === 4 },
  correctAnswer: { type: String, required: true },
  explanation: { type: String, required: true },
  selectedAnswer: { type: String, default: '' },
  isCorrect: { type: Boolean, default: null },
  answeredAt: { type: Date, default: null },
  category: { type: String, default: '' },
  topic: { type: String, default: '' },
  difficulty: { type: String, default: 'Medium' },
}, { _id: true });

const assessmentInterviewQuestionSchema = new mongoose.Schema({
  questionNumber: { type: Number, required: true },
  question: { type: String, required: true },
  category: { type: String, default: 'Technical' },
  difficulty: { type: String, default: 'Medium' },
  expectedConcepts: { type: [String], default: [] },
  answer: { type: String, default: '' },
  transcript: { type: String, default: '' },
  audioDuration: { type: Number, default: 0 },
  answeredAt: { type: Date, default: null },
  evaluation: {
    technicalScore: { type: Number, default: 0 },
    relevanceScore: { type: Number, default: 0 },
    completenessScore: { type: Number, default: 0 },
    communicationScore: { type: Number, default: 0 },
    clarityScore: { type: Number, default: 0 },
    problemSolvingScore: { type: Number, default: 0 },
    overallScore: { type: Number, default: 0 },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    improvementSuggestions: { type: [String], default: [] },
    feedback: { type: String, default: '' },
    idealAnswer: { type: String, default: '' },
  },
}, { _id: true });

const hiringAssessmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  jobRole: { type: String, required: true, trim: true, default: 'Software Developer' },
  experience: { type: String, required: true, trim: true, default: 'Intermediate' },
  status: { type: String, default: 'IN_PROGRESS' }, // NOT_STARTED, IN_PROGRESS, COMPLETED
  currentLevel: { type: String, default: 'APTITUDE' }, // APTITUDE, TECHNICAL, AI_INTERVIEW, COMPLETED
  finalStatus: { type: String, enum: ['PASS', 'FAIL', 'PENDING'], default: 'PENDING' },
  overallScore: { type: Number, default: 0 },
  completedAt: { type: Date, default: null },

  // Round 1: Aptitude Test (20 questions, 25 minutes, pass threshold: 15/20)
  aptitude: {
    status: { type: String, default: 'NOT_STARTED' }, // NOT_STARTED, IN_PROGRESS, PASSED, FAILED
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: ASSESSMENT_THRESHOLDS.TOTAL_QUESTIONS },
    passingScore: { type: Number, default: ASSESSMENT_THRESHOLDS.PASSING_CORRECT_ANSWERS },
    correctCount: { type: Number, default: 0 },
    incorrectCount: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    startedAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
    submittedAt: { type: Date, default: null },
    questions: { type: [assessmentMcqQuestionSchema], default: [] },
    fullscreenViolationCount: { type: Number, default: 0 },
    fullscreenViolations: [
      {
        type: { type: String, default: 'FULLSCREEN_EXIT' },
        timestamp: { type: Date, default: Date.now },
        details: { type: String, default: '' },
      },
    ],
    attemptVersion: { type: Number, default: 1 },
  },

  // Round 2: Technical MCQ Test (20 questions, 25 minutes, pass threshold: 15/20)
  technical: {
    status: { type: String, default: 'LOCKED' }, // LOCKED, NOT_STARTED, IN_PROGRESS, PASSED, FAILED
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: ASSESSMENT_THRESHOLDS.TOTAL_QUESTIONS },
    passingScore: { type: Number, default: ASSESSMENT_THRESHOLDS.PASSING_CORRECT_ANSWERS },
    correctCount: { type: Number, default: 0 },
    incorrectCount: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    startedAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
    submittedAt: { type: Date, default: null },
    questions: { type: [assessmentMcqQuestionSchema], default: [] },
    fullscreenViolationCount: { type: Number, default: 0 },
    fullscreenViolations: [
      {
        type: { type: String, default: 'FULLSCREEN_EXIT' },
        timestamp: { type: Date, default: Date.now },
        details: { type: String, default: '' },
      },
    ],
    attemptVersion: { type: Number, default: 1 },
  },

  // Round 3: One-on-One AI Interview (Adaptive, Voice/Audio, pass threshold: 60/100)
  interview: {
    interviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview', default: null },
    status: { type: String, default: 'LOCKED' }, // LOCKED, NOT_STARTED, IN_PROGRESS, PASSED, FAILED
    score: { type: Number, default: 0 },
    passingScore: { type: Number, default: ASSESSMENT_THRESHOLDS.AI_INTERVIEW_PASS_PERCENTAGE },
    totalQuestions: { type: Number, default: ASSESSMENT_THRESHOLDS.INTERVIEW_TOTAL_QUESTIONS },
    currentIndex: { type: Number, default: 0 },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    questions: { type: [assessmentInterviewQuestionSchema], default: [] },
    finalEvaluation: {
      overallScore: { type: Number, default: 0 },
      technicalScore: { type: Number, default: 0 },
      communicationScore: { type: Number, default: 0 },
      relevanceScore: { type: Number, default: 0 },
      clarityScore: { type: Number, default: 0 },
      problemSolvingScore: { type: Number, default: 0 },
      strengths: { type: [String], default: [] },
      weaknesses: { type: [String], default: [] },
      improvementSuggestions: { type: [String], default: [] },
      overallFeedback: { type: String, default: '' },
      readinessLevel: { type: String, default: '' },
    },
  },

  // Backward compatibility fields
  aptitudeStatus: { type: String, default: 'NOT_STARTED' },
  aptitudeScore: { type: Number, default: 0 },
  technicalStatus: { type: String, default: 'LOCKED' },
  technicalScore: { type: Number, default: 0 },
  aiInterviewStatus: { type: String, default: 'LOCKED' },
  aiInterviewScore: { type: Number, default: 0 },
  questions: { type: [assessmentMcqQuestionSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('HiringAssessment', hiringAssessmentSchema);
