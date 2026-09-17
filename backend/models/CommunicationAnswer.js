const mongoose = require('mongoose');
const speechAnalysisSchema = require('./SpeechAnalysis').schema;

const communicationAnswerSchema = new mongoose.Schema({
  interviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'CommunicationInterview', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  question: { type: String, required: true },
  audio: {
    originalName: String,
    mimeType: String,
    size: Number,
  },
  transcript: { type: String, required: true },
  duration: { type: Number, required: true, min: 0 },
  evaluation: {
    relevance: { type: Number, default: 0 },
    contentCorrectness: { type: Number, default: 0 },
    fluency: { type: Number, default: 0 },
    grammar: { type: Number, default: 0 },
    vocabulary: { type: Number, default: 0 },
    pronunciation: { type: Number, default: null },
    speakingPace: { type: Number, default: 0 },
    fillerWords: { type: Number, default: 0 },
    confidence: { type: Number, default: null },
    answerStructure: { type: Number, default: 0 },
    overallScore: { type: Number, default: 0 },
    warning: { type: Boolean, default: false },
    warningReason: { type: String, default: '' },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    feedback: { type: String, default: '' },
  },
  speechAnalysis: { type: speechAnalysisSchema, default: () => ({}) },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CommunicationAnswer', communicationAnswerSchema);
