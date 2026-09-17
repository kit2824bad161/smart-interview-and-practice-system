const SpeakingChallenge = require('../models/SpeakingChallenge');
const openai = require('../services/openaiService');

function clamp(value) { return Math.max(0, Math.min(100, Math.round(Number(value) || 0))); }
function debug(stage, data) {
  if (process.env.DEBUG_SPEAKING_CHALLENGE === 'true') console.info(`[speaking-challenge] ${stage}`, data);
}
function measureSpeech(transcript, duration) {
  const words = transcript.match(/\b[\w'-]+\b/g) || [];
  const fillers = transcript.match(/\b(um|uh|like|actually|you know|basically)\b/gi) || [];
  const seconds = Math.max(0, Number(duration) || 0);
  return { wordCount: words.length, duration: seconds, wordsPerMinute: seconds ? Math.round(words.length * 60 / seconds) : 0, fillerWords: fillers.map(word => word.toLowerCase()), fillerWordCount: fillers.length, fillerRatio: words.length ? fillers.length / words.length : 0, pauseCount: null };
}
function overall(evaluation) {
  const score = evaluation.topicRelevance * 0.30 + evaluation.contentQuality * 0.20 + evaluation.fluency * 0.15 + evaluation.grammar * 0.10 + evaluation.vocabulary * 0.10 + evaluation.structure * 0.15;
  return evaluation.isRelevant && evaluation.isValidSpeechResponse ? clamp(score) : Math.min(clamp(score), 25);
}

exports.calculateSpeakingChallengeScore = overall;

exports.startSpeakingChallenge = async (req, res) => {
  try {
    const { jobRole, experience, difficulty, durationLimit = 120 } = req.body;
    if (![120, 180].includes(Number(durationLimit))) return res.status(400).json({ message: 'durationLimit must be 120 or 180 seconds.' });
    const topic = await openai.generateSpeakingTopic({ jobRole, experience, difficulty });
    const challenge = await SpeakingChallenge.create({ userId: req.user._id, jobRole, experience, difficulty, durationLimit: Number(durationLimit), topic });
    res.status(201).json({ challengeId: challenge._id, topic: challenge.topic, durationLimit: challenge.durationLimit, preparationSeconds: 10 });
  } catch (error) { res.status(error.statusCode || 500).json({ message: error.statusCode ? error.message : 'Unable to start speaking challenge.', code: error.code }); }
};

exports.submitSpeakingChallenge = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'An audio recording is required.' });
    debug('received audio', { size: req.file.size, type: req.file.mimetype, name: req.file.originalname });
    const challenge = await SpeakingChallenge.findOne({ _id: req.params.challengeId, userId: req.user._id });
    if (!challenge) return res.status(404).json({ message: 'Speaking challenge not found.' });
    if (challenge.status === 'completed') return res.status(400).json({ message: 'Speaking challenge is already completed.' });
    const duration = Math.min(challenge.durationLimit, Math.max(0, Number(req.body.duration) || 0));
    const transcript = await openai.transcribeAudio({ buffer: req.file.buffer, filename: req.file.originalname, mimeType: req.file.mimetype });
    debug('transcription result', { transcript });
    const speechAnalysis = measureSpeech(transcript, duration);
    debug('assigned topic', { topic: challenge.topic });
    debug('evaluation request', { jobRole: challenge.jobRole, topic: challenge.topic, difficulty: challenge.difficulty, speechAnalysis });
    const evaluation = await openai.evaluateSpeakingChallengeAnswer({ jobRole: challenge.jobRole, topic: challenge.topic, transcript, difficulty: challenge.difficulty });
    debug('parsed evaluation', evaluation);
    evaluation.overallScore = overall(evaluation);
    debug('final calculated score', { overallScore: evaluation.overallScore });
    challenge.audio = { originalName: req.file.originalname, mimeType: req.file.mimetype, size: req.file.size };
    challenge.transcript = transcript; challenge.duration = duration; challenge.speechAnalysis = speechAnalysis; challenge.evaluation = evaluation; challenge.status = 'completed';
    await challenge.save();
    debug('saved database object', { challengeId: challenge._id, transcript: challenge.transcript, evaluation: challenge.evaluation });
    res.json(challenge);
  } catch (error) { res.status(error.statusCode || 500).json({ message: error.statusCode ? error.message : 'Unable to analyze speaking challenge.', code: error.code }); }
};

exports.getSpeakingChallengeResult = async (req, res) => {
  const challenge = await SpeakingChallenge.findOne({ _id: req.params.challengeId, userId: req.user._id });
  if (!challenge) return res.status(404).json({ message: 'Speaking challenge not found.' });
  res.json(challenge);
};
