const mongoose = require('mongoose');
const speechAnalysisSchema = require('./SpeechAnalysis').schema;

const evaluationSchema = new mongoose.Schema({
  topicRelevance: { type: Number, default: 0 },
  contentQuality: { type: Number, default: 0 },
  fluency: { type: Number, default: 0 },
  grammar: { type: Number, default: 0 },
  vocabulary: { type: Number, default: 0 },
  structure: { type: Number, default: 0 },
  overallScore: { type: Number, default: 0 },
  isRelevant: { type: Boolean, default: false },
  isValidSpeechResponse: { type: Boolean, default: false },
  languageMatch: { type: Boolean, default: true },
  responseType: { type: String, enum: ['relevant', 'partially_relevant', 'off_topic', 'non_speech', 'song_or_lyrics', 'empty', 'unclear', 'prompt_injection'], default: 'unclear' },
  feedback: { type: String, default: '' },
  strengths: { type: [String], default: [] },
  weaknesses: { type: [String], default: [] },
  improvementSuggestions: { type: [String], default: [] },
}, { _id: false });

const speakingChallengeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  jobRole: { type: String, required: true },
  experience: { type: String, required: true },
  difficulty: { type: String, required: true },
  durationLimit: { type: Number, enum: [120, 180], required: true },
  topic: { type: String, required: true },
  audio: { originalName: String, mimeType: String, size: Number },
  transcript: { type: String, default: '' },
  duration: { type: Number, default: 0 },
  speechAnalysis: { type: speechAnalysisSchema, default: () => ({}) },
  evaluation: { type: evaluationSchema, default: () => ({}) },
  status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' },
}, { timestamps: true });

module.exports = mongoose.model('SpeakingChallenge', speakingChallengeSchema);
