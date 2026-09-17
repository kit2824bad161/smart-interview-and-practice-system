const CommunicationInterview = require('../models/CommunicationInterview');
const CommunicationAnswer = require('../models/CommunicationAnswer');
const openai = require('../services/openaiService');

const FILLER_PATTERN = /\b(um|uh|like|actually|you know|basically)\b/gi;
const SCORE_WEIGHTS = {
  relevance: 0.20,
  contentCorrectness: 0.15,
  fluency: 0.15,
  grammar: 0.10,
  vocabulary: 0.10,
  pronunciation: 0.10,
  speakingPace: 0.05,
  fillerWords: 0.05,
  confidence: 0.05,
  answerStructure: 0.05,
};

function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
}

function speechMetrics(transcript, duration) {
  const words = transcript.trim().match(/\b[\w'-]+\b/g) || [];
  const fillerWords = transcript.match(FILLER_PATTERN) || [];
  const seconds = Math.max(0, Number(duration) || 0);
  const wordCount = words.length;
  const wordsPerMinute = seconds > 0 ? Math.round((wordCount / seconds) * 60) : 0;
  const fillerRatio = wordCount > 0 ? fillerWords.length / wordCount : 0;
  return {
    wordCount,
    duration: seconds,
    wordsPerMinute,
    fillerWords: fillerWords.map(word => word.toLowerCase()),
    fillerWordCount: fillerWords.length,
    fillerRatio,
    pauseCount: null,
  };
}

function calculateOverall(evaluation, analysis) {
  const values = {
    ...evaluation,
    speakingPace: analysis.wordsPerMinute > 0 ? clamp(100 - Math.abs(135 - analysis.wordsPerMinute) * 0.8) : 0,
    fillerWords: analysis.wordCount > 0 ? clamp(100 - analysis.fillerRatio * 500) : 0,
  };
  let weighted = 0;
  let totalWeight = 0;
  Object.entries(SCORE_WEIGHTS).forEach(([key, weight]) => {
    if (values[key] !== null && values[key] !== undefined) {
      weighted += clamp(values[key]) * weight;
      totalWeight += weight;
    }
  });
  const overall = totalWeight ? Math.round(weighted / totalWeight) : 0;
  return values.relevance < 30 ? Math.min(overall, 40) : overall;
}

function summarize(answers) {
  const metrics = ['relevance', 'contentCorrectness', 'fluency', 'grammar', 'vocabulary', 'answerStructure'];
  const averages = Object.fromEntries(metrics.map(metric => [metric, answers.length ? Math.round(answers.reduce((sum, answer) => sum + Number(answer.evaluation?.[metric] || 0), 0) / answers.length) : 0]));
  const strengths = [...new Set(answers.flatMap(answer => answer.evaluation?.strengths || []))].slice(0, 6);
  const weaknesses = [...new Set(answers.flatMap(answer => answer.evaluation?.weaknesses || []))].slice(0, 6);
  const improvementPlan = ['Practice answering with a clear introduction, main point, and conclusion.', 'Record another response and reduce repeated filler words.'];
  return { averages, strengths, weaknesses, improvementPlan };
}

exports.startCommunicationInterview = async (req, res) => {
  try {
    const { jobRole, experience, difficulty, interviewType, numberOfQuestions = 5 } = req.body;
    const questions = await openai.generateCommunicationQuestions({ jobRole, experience, difficulty, interviewType, numberOfQuestions: Number(numberOfQuestions) });
    const interview = await CommunicationInterview.create({ userId: req.user._id, jobRole, experience, difficulty, interviewType, totalQuestions: questions.length, questions });
    const first = interview.questions[0];
    res.status(201).json({ interviewId: interview._id, totalQuestions: interview.totalQuestions, currentQuestion: { questionId: first._id, questionNumber: 1, question: first.question, category: first.category, difficulty: first.difficulty } });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ message: status === 500 ? 'Unable to start communication interview.' : error.message, code: error.code });
  }
};

exports.submitCommunicationAnswer = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'An audio recording is required.' });
    const interview = await CommunicationInterview.findOne({ _id: req.params.interviewId, userId: req.user._id });
    if (!interview) return res.status(404).json({ message: 'Communication interview not found.' });
    if (interview.status === 'completed') return res.status(400).json({ message: 'Communication interview is already completed.' });

    const questionId = req.body.questionId;
    const questionIndex = interview.questions.findIndex(question => question._id.toString() === questionId);
    if (questionIndex < 0 || questionIndex !== interview.currentIndex) return res.status(400).json({ message: 'That is not the current interview question.' });
    if (req.file.size > 15 * 1024 * 1024) return res.status(413).json({ message: 'Audio recording is too large.' });

    const duration = Math.min(180, Math.max(0, Number(req.body.duration) || 0));
    const transcript = await openai.transcribeAudio({ buffer: req.file.buffer, filename: req.file.originalname, mimeType: req.file.mimetype });
    const analysis = speechMetrics(transcript, duration);
    const evaluation = await openai.evaluateCommunicationAnswer({ jobRole: interview.jobRole, question: interview.questions[questionIndex].question, transcript, difficulty: interview.difficulty, expectedConcepts: interview.questions[questionIndex].expectedConcepts, speechAnalysis: analysis });
    evaluation.speakingPace = analysis.wordsPerMinute > 0 ? clamp(100 - Math.abs(135 - analysis.wordsPerMinute) * 0.8) : 0;
    evaluation.fillerWords = analysis.wordCount > 0 ? clamp(100 - analysis.fillerRatio * 500) : 0;
    evaluation.overallScore = calculateOverall(evaluation, analysis);

    const answer = await CommunicationAnswer.create({ interviewId: interview._id, userId: req.user._id, questionId: interview.questions[questionIndex]._id, question: interview.questions[questionIndex].question, audio: { originalName: req.file.originalname, mimeType: req.file.mimetype, size: req.file.size }, transcript, duration, evaluation, speechAnalysis: { ...analysis, fluencyScore: evaluation.fluency, grammarScore: evaluation.grammar, vocabularyScore: evaluation.vocabulary, pronunciationScore: evaluation.pronunciation, confidenceIndicator: evaluation.confidence } });
    interview.questions[questionIndex].answerId = answer._id;
    interview.currentIndex = questionIndex + 1;
    if (evaluation.warning) interview.warnings += 1;
    await interview.save();

    res.json({ answerId: answer._id, transcript, evaluation, speechAnalysis: answer.speechAnalysis, warningCount: interview.warnings, isLastQuestion: interview.currentIndex >= interview.totalQuestions, questionNumber: questionIndex + 1, totalQuestions: interview.totalQuestions });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ message: status === 500 ? 'Unable to analyze the recording.' : error.message, code: error.code });
  }
};

exports.getCommunicationInterview = async (req, res) => {
  const interview = await CommunicationInterview.findOne({ _id: req.params.interviewId, userId: req.user._id }).populate('questions.answerId');
  if (!interview) return res.status(404).json({ message: 'Communication interview not found.' });
  res.json(interview);
};

exports.getCommunicationResult = async (req, res) => {
  const interview = await CommunicationInterview.findOne({ _id: req.params.interviewId, userId: req.user._id }).populate('questions.answerId');
  if (!interview) return res.status(404).json({ message: 'Communication interview not found.' });
  const answers = interview.questions.map(question => question.answerId).filter(Boolean);
  const summary = summarize(answers);
  const overallScore = answers.length ? Math.round(answers.reduce((sum, answer) => sum + answer.evaluation.overallScore, 0) / answers.length) : 0;
  res.json({ ...interview.toObject(), answers, overallScore, summary });
};
