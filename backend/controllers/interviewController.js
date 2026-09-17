const Interview = require('../models/Interview');
const openai = require('../services/openaiService');

// ─── POST /api/interviews/start ───────────────────────────────────────────────
exports.startInterview = async (req, res) => {
  try {
    const { jobRole, experience, difficulty, interviewType, numberOfQuestions } = req.body;

    if (!jobRole || !experience || !difficulty || !interviewType || !numberOfQuestions) {
      return res.status(400).json({ message: 'All interview parameters are required' });
    }

    // Generate all questions upfront via LLM
    const questions = await openai.generateInterviewQuestions({
      jobRole, experience, difficulty, interviewType,
      numberOfQuestions: parseInt(numberOfQuestions),
    });

    const interview = await Interview.create({
      userId: req.user._id,
      jobRole, experience, difficulty,
      interviewType,
      totalQuestions: questions.length,
      questions: questions.map(q => ({
        question: q.question,
        category: q.category,
        difficulty: q.difficulty,
        expectedConcepts: q.expectedConcepts,
      })),
      currentIndex: 0,
      status: 'in_progress',
    });

    // Return first question only — never expose all questions at once
    const first = interview.questions[0];
    res.status(201).json({
      interviewId: interview._id,
      totalQuestions: interview.totalQuestions,
      currentQuestion: {
        questionId: first._id,
        questionNumber: 1,
        question: first.question,
        category: first.category,
        difficulty: first.difficulty,
      },
    });
  } catch (err) {
    console.error('startInterview error:', err.message);
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message, code: err.code });
    }
    res.status(500).json({ message: 'Failed to start interview: ' + err.message });
  }
};

// ─── POST /api/interviews/:id/answer ─────────────────────────────────────────
exports.submitAnswer = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    if (interview.status === 'completed') {
      return res.status(400).json({ message: 'Interview already completed' });
    }

    const { questionId, answer } = req.body;
    if (!questionId) return res.status(400).json({ message: 'questionId is required' });

    const qIndex = interview.questions.findIndex(q => q._id.toString() === questionId);
    if (qIndex === -1) return res.status(404).json({ message: 'Question not found' });

    const q = interview.questions[qIndex];

    // Evaluate via LLM
    const evaluation = await openai.evaluateInterviewAnswer({
      jobRole: interview.jobRole,
      question: q.question,
      answer: answer || '',
      difficulty: q.difficulty,
      expectedConcepts: q.expectedConcepts,
      previousContext: interview.questions
        .filter((previousQuestion, index) => index !== qIndex && previousQuestion.answer)
        .map(previousQuestion => `Question: ${previousQuestion.question}\nAnswer: ${previousQuestion.answer}`)
        .join('\n\n'),
    });

    const storedEvaluation = {
      ...evaluation,
      technicalCorrectness: evaluation.technicalScore,
      relevance: evaluation.relevanceScore,
      completeness: evaluation.completenessScore,
      communication: evaluation.communicationScore,
      specificity: evaluation.confidenceScore,
      feedback: evaluation.evaluationSummary,
      suggestedAnswer: evaluation.idealAnswer,
      answerQuality: evaluation.overallScore >= 80 ? 'strong' : evaluation.overallScore >= 55 ? 'partially_correct' : 'weak',
    };

    // Save answer + evaluation
    interview.questions[qIndex].answer = answer || '';
    interview.questions[qIndex].evaluation = storedEvaluation;
    interview.questions[qIndex].answeredAt = new Date();
    interview.currentIndex = qIndex + 1;

    await interview.save();

    res.json({
      evaluation,
      questionNumber: qIndex + 1,
      totalQuestions: interview.totalQuestions,
      isLastQuestion: qIndex + 1 >= interview.totalQuestions,
    });
  } catch (err) {
    console.error('submitAnswer error:', err.message);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: statusCode === 500 ? 'Failed to evaluate answer.' : err.message, code: err.code });
  }
};

// ─── POST /api/interviews/:id/next-question ───────────────────────────────────
exports.getNextQuestion = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
    if (!interview) return res.status(404).json({ message: 'Interview not found' });

    const nextIndex = interview.currentIndex;
    if (nextIndex >= interview.totalQuestions) {
      return res.status(400).json({ message: 'All questions answered. Call /complete to finish.' });
    }

    // Check if next question already exists (pre-generated)
    if (interview.questions[nextIndex]) {
      const q = interview.questions[nextIndex];
      return res.json({
        questionId: q._id,
        questionNumber: nextIndex + 1,
        question: q.question,
        category: q.category,
        difficulty: q.difficulty,
        totalQuestions: interview.totalQuestions,
      });
    }

    // Adaptive: generate next question dynamically
    const answeredQuestions = interview.questions.filter(q => q.answer);
    const previousScores = answeredQuestions.map(q => q.evaluation?.overallScore || 0);
    const weakAreas = answeredQuestions
      .filter(q => (q.evaluation?.overallScore || 0) < 50)
      .map(q => q.category)
      .filter(Boolean);

    const nextQ = await openai.generateNextQuestion({
      jobRole: interview.jobRole,
      experience: interview.experience,
      currentDifficulty: interview.difficulty,
      interviewType: interview.interviewType,
      previousQuestions: interview.questions.map(q => q.question),
      previousScores,
      weakAreas: [...new Set(weakAreas)],
    });

    interview.questions.push({
      question: nextQ.question,
      category: nextQ.category,
      difficulty: nextQ.difficulty,
      expectedConcepts: nextQ.expectedConcepts,
    });
    await interview.save();

    const saved = interview.questions[interview.questions.length - 1];
    res.json({
      questionId: saved._id,
      questionNumber: nextIndex + 1,
      question: saved.question,
      category: saved.category,
      difficulty: saved.difficulty,
      totalQuestions: interview.totalQuestions,
    });
  } catch (err) {
    console.error('getNextQuestion error:', err.message);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: statusCode === 500 ? 'Failed to get next question.' : err.message, code: err.code });
  }
};

// ─── POST /api/interviews/:id/complete ───────────────────────────────────────
exports.completeInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    if (interview.status === 'completed') {
      return res.json({
        interviewId: interview._id,
        overallScore: interview.overallScore,
        totalQuestions: interview.questions.filter(q => q.answer && q.evaluation).length,
        finalFeedback: interview.finalFeedback,
        scores: interview.questions.filter(q => q.answer && q.evaluation).map(q => q.evaluation.overallScore),
      });
    }

    const answered = interview.questions.filter(q => q.answer && q.evaluation);
    if (answered.length === 0) {
      return res.status(400).json({ message: 'No answered questions found' });
    }

    // Final score = average of all question scores
    const scores = answered.map(q => q.evaluation.overallScore);
    const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

    // Generate final feedback via LLM
    const finalFeedback = await openai.generateFinalInterviewReport({
      jobRole: interview.jobRole,
      experience: interview.experience,
      questions: answered.map(q => q.question),
      answers: answered.map(q => q.answer),
      evaluations: answered.map(q => q.evaluation),
      scores,
    });

    interview.status = 'completed';
    interview.overallScore = overallScore;
    interview.finalFeedback = finalFeedback;
    await interview.save();

    res.json({
      interviewId: interview._id,
      overallScore,
      totalQuestions: answered.length,
      finalFeedback,
      scores,
    });
  } catch (err) {
    console.error('completeInterview error:', err.message);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: statusCode === 500 ? 'Failed to complete interview.' : err.message, code: err.code });
  }
};

// ─── GET /api/interviews/:id ──────────────────────────────────────────────────
exports.getInterview = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    res.json(interview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/interviews ──────────────────────────────────────────────────────
exports.getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user._id, status: 'completed' })
      .select('jobRole experience difficulty interviewType overallScore status totalQuestions createdAt updatedAt')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/interviews/:id/feedback ────────────────────────────────────────
exports.getFeedback = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    if (interview.status !== 'completed') {
      return res.status(400).json({ message: 'Interview not yet completed' });
    }
    res.json({
      interviewId: interview._id,
      overallScore: interview.overallScore,
      finalFeedback: interview.finalFeedback,
      questions: interview.questions.map(q => ({
        question: q.question,
        category: q.category,
        difficulty: q.difficulty,
        answer: q.answer,
        evaluation: q.evaluation,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/admin/interviews (admin only) ───────────────────────────────────
exports.getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find()
      .populate('userId', 'name email')
      .select('userId jobRole difficulty overallScore status totalQuestions createdAt')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
