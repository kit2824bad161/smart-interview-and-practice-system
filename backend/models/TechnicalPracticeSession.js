const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  difficulty: { type: String, required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true, validate: value => value.length === 4 },
  correctAnswer: { type: String, required: true },
  explanation: { type: String, required: true },
  selectedAnswer: { type: String, default: '' },
  isCorrect: Boolean,
}, { _id: true });

const technicalPracticeSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  topic: { type: String, required: true },
  difficulty: { type: String, required: true },
  totalQuestions: { type: Number, required: true },
  questions: { type: [questionSchema], default: [] },
  status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' },
  score: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  completedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('TechnicalPracticeSession', technicalPracticeSessionSchema);