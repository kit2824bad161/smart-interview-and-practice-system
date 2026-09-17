const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  category: { type: String, default: 'Communication' },
  difficulty: { type: String, required: true },
  expectedConcepts: { type: [String], default: [] },
  answerId: { type: mongoose.Schema.Types.ObjectId, ref: 'CommunicationAnswer' },
}, { _id: true });

const communicationInterviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  jobRole: { type: String, required: true },
  experience: { type: String, required: true },
  difficulty: { type: String, required: true },
  interviewType: { type: String, required: true },
  totalQuestions: { type: Number, required: true },
  questions: { type: [questionSchema], default: [] },
  currentIndex: { type: Number, default: 0 },
  warnings: { type: Number, default: 0 },
  status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' },
  overallScore: { type: Number, default: 0 },
  finalFeedback: {
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    improvementPlan: { type: [String], default: [] },
  },
}, { timestamps: true });

module.exports = mongoose.model('CommunicationInterview', communicationInterviewSchema);
