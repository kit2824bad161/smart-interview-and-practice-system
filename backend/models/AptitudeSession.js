const mongoose = require('mongoose');

const aptitudeQuestionSchema = new mongoose.Schema({
  category: { type: String, required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true, validate: value => value.length === 4 },
  correctAnswer: { type: String, required: true },
  explanation: { type: String, required: true },
  selectedAnswer: { type: String, default: '' },
  marks: { type: Number, default: 1 },
  isCorrect: Boolean,
  answeredAt: Date,
}, { _id: true });

const aptitudeSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  mode: { type: String, enum: ['practice'], default: 'practice' },
  category: { type: String, default: 'Mixed Aptitude' },
  topic: { type: String, default: 'Mixed' },
  difficulty: { type: String, default: 'Easy' },
  startTime: { type: Date, required: true },
  endTime: Date,
  expiresAt: { type: Date, required: true },
  totalQuestions: { type: Number, default: 30 },
  durationSeconds: { type: Number, default: 1800 },
  timeLimit: { type: Number, default: 30 },
  questions: { type: [aptitudeQuestionSchema], default: [] },
  questionsAttempted: { type: Number, default: 0 },
  currentIndex: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  completionStatus: { type: String, enum: ['in_progress', 'completed', 'expired'], default: 'in_progress' },
  feedback: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('AptitudeSession', aptitudeSessionSchema);