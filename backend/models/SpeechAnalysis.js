const mongoose = require('mongoose');

const speechAnalysisSchema = new mongoose.Schema({
  wordCount: { type: Number, default: 0 },
  duration: { type: Number, default: 0 },
  wordsPerMinute: { type: Number, default: 0 },
  fillerWords: { type: [String], default: [] },
  fillerWordCount: { type: Number, default: 0 },
  fillerRatio: { type: Number, default: 0 },
  pauseCount: { type: Number, default: null },
  fluencyScore: { type: Number, default: 0 },
  grammarScore: { type: Number, default: 0 },
  vocabularyScore: { type: Number, default: 0 },
  pronunciationScore: { type: Number, default: null },
  confidenceIndicator: { type: Number, default: null },
}, { _id: false });

module.exports = mongoose.model('SpeechAnalysis', speechAnalysisSchema);
