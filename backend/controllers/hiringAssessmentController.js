const HiringAssessment = require('../models/HiringAssessment');
const Interview = require('../models/Interview');
const openai = require('../services/openaiService');
const { ASSESSMENT_THRESHOLDS, ASSESSMENT_STATUS } = require('../config/assessment');

// Helper to sanitize questions so correct answers/explanations are NEVER exposed during tests
function sanitizeQuestionForCandidate(question) {
  if (!question) return null;
  return {
    questionNumber: question.questionNumber,
    question: question.question,
    options: question.options,
    category: question.category || '',
    topic: question.topic || '',
    difficulty: question.difficulty || 'Medium',
  };
}

// Ensure candidate's assessment exists or get latest
async function ensureAssessment(req) {
  return HiringAssessment.findOne({ user: req.user._id }).sort({ createdAt: -1 });
}

// Build assessment summary with status of all rounds
function buildAssessmentStatusResponse(assessment) {
  if (!assessment) return null;

  const now = Date.now();
  const aptRemaining = assessment.aptitude?.expiresAt
    ? Math.max(0, Math.ceil((new Date(assessment.aptitude.expiresAt).getTime() - now) / 1000))
    : 0;
  const techRemaining = assessment.technical?.expiresAt
    ? Math.max(0, Math.ceil((new Date(assessment.technical.expiresAt).getTime() - now) / 1000))
    : 0;

  const aptStatus = assessment.aptitude?.status || assessment.aptitudeStatus || 'NOT_STARTED';
  const aptScore = Number(assessment.aptitude?.score ?? assessment.aptitudeScore ?? 0);
  const aptPassed = aptStatus === 'PASSED' && aptScore >= ASSESSMENT_THRESHOLDS.PASSING_CORRECT_ANSWERS;
  const aptFailed = aptStatus === 'FAILED';

  const techStatus = assessment.technical?.status || assessment.technicalStatus || (aptPassed ? 'NOT_STARTED' : 'LOCKED');
  const techScore = Number(assessment.technical?.score ?? assessment.technicalScore ?? 0);
  const techPassed = techStatus === 'PASSED' && techScore >= ASSESSMENT_THRESHOLDS.PASSING_CORRECT_ANSWERS;
  const techFailed = techStatus === 'FAILED';

  const interviewStatus = assessment.interview?.status || assessment.aiInterviewStatus || (aptPassed && techPassed ? 'NOT_STARTED' : 'LOCKED');
  const interviewScore = Number(assessment.interview?.score ?? assessment.aiInterviewScore ?? 0);
  const interviewPassed = interviewStatus === 'PASSED' && interviewScore >= ASSESSMENT_THRESHOLDS.AI_INTERVIEW_PASS_PERCENTAGE;
  const interviewFailed = interviewStatus === 'FAILED';

  return {
    _id: assessment._id,
    user: assessment.user,
    jobRole: assessment.jobRole || 'Software Developer',
    experience: assessment.experience || 'Intermediate',
    status: assessment.status || 'IN_PROGRESS',
    currentLevel: assessment.currentLevel || 'APTITUDE',
    finalStatus: assessment.finalStatus || 'PENDING',
    overallScore: assessment.overallScore || 0,
    completedAt: assessment.completedAt || null,
    aptitudeStatus: aptStatus,
    technicalStatus: techStatus,
    aiInterviewStatus: interviewStatus,
    thresholds: {
      aptitudePassMarks: ASSESSMENT_THRESHOLDS.PASSING_CORRECT_ANSWERS,
      aptitudeTotalMarks: ASSESSMENT_THRESHOLDS.TOTAL_QUESTIONS,
      technicalPassMarks: ASSESSMENT_THRESHOLDS.PASSING_CORRECT_ANSWERS,
      technicalTotalMarks: ASSESSMENT_THRESHOLDS.TOTAL_QUESTIONS,
      interviewPassPercentage: ASSESSMENT_THRESHOLDS.AI_INTERVIEW_PASS_PERCENTAGE,
    },
    aptitude: {
      status: aptStatus,
      score: aptScore,
      totalQuestions: assessment.aptitude?.totalQuestions || ASSESSMENT_THRESHOLDS.TOTAL_QUESTIONS,
      passingScore: ASSESSMENT_THRESHOLDS.PASSING_CORRECT_ANSWERS,
      correctCount: assessment.aptitude?.correctCount || 0,
      incorrectCount: assessment.aptitude?.incorrectCount || 0,
      percentage: assessment.aptitude?.percentage || 0,
      startedAt: assessment.aptitude?.startedAt || null,
      expiresAt: assessment.aptitude?.expiresAt || null,
      submittedAt: assessment.aptitude?.submittedAt || null,
      remainingSeconds: aptRemaining,
      passed: aptPassed,
      failed: aptFailed,
      isLocked: false,
    },
    technical: {
      status: techStatus,
      score: techScore,
      totalQuestions: assessment.technical?.totalQuestions || ASSESSMENT_THRESHOLDS.TOTAL_QUESTIONS,
      passingScore: ASSESSMENT_THRESHOLDS.PASSING_CORRECT_ANSWERS,
      correctCount: assessment.technical?.correctCount || 0,
      incorrectCount: assessment.technical?.incorrectCount || 0,
      percentage: assessment.technical?.percentage || 0,
      startedAt: assessment.technical?.startedAt || null,
      expiresAt: assessment.technical?.expiresAt || null,
      submittedAt: assessment.technical?.submittedAt || null,
      remainingSeconds: techRemaining,
      passed: techPassed,
      failed: techFailed,
      isLocked: !aptPassed,
      lockedReason: !aptPassed ? 'Minimum 15 out of 20 in Aptitude is required to qualify for Technical Round.' : '',
    },
    interview: {
      status: interviewStatus,
      score: interviewScore,
      passingScore: ASSESSMENT_THRESHOLDS.AI_INTERVIEW_PASS_PERCENTAGE,
      totalQuestions: assessment.interview?.totalQuestions || ASSESSMENT_THRESHOLDS.INTERVIEW_TOTAL_QUESTIONS,
      currentIndex: assessment.interview?.currentIndex || 0,
      startedAt: assessment.interview?.startedAt || null,
      completedAt: assessment.interview?.completedAt || null,
      passed: interviewPassed,
      failed: interviewFailed,
      isLocked: !(aptPassed && techPassed),
      lockedReason: !(aptPassed && techPassed) ? 'You must pass both Aptitude (15/20) and Technical (15/20) to qualify for the AI Interview.' : '',
      finalEvaluation: assessment.interview?.finalEvaluation || null,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/assessment/start
// ─────────────────────────────────────────────────────────────────────────────
exports.startAssessment = async (req, res) => {
  try {
    const { jobRole = 'Software Developer', experience = 'Intermediate', reset = false } = req.body;

    let assessment = await ensureAssessment(req);

    // If candidate requests reset or has an existing finished assessment and wants a fresh start
    if (reset || !assessment) {
      assessment = await HiringAssessment.create({
        user: req.user._id,
        jobRole,
        experience,
        status: 'IN_PROGRESS',
        currentLevel: 'APTITUDE',
        finalStatus: 'PENDING',
        aptitude: {
          status: 'NOT_STARTED',
          totalQuestions: ASSESSMENT_THRESHOLDS.TOTAL_QUESTIONS,
          passingScore: ASSESSMENT_THRESHOLDS.PASSING_CORRECT_ANSWERS,
        },
        technical: {
          status: 'LOCKED',
          totalQuestions: ASSESSMENT_THRESHOLDS.TOTAL_QUESTIONS,
          passingScore: ASSESSMENT_THRESHOLDS.PASSING_CORRECT_ANSWERS,
        },
        interview: {
          status: 'LOCKED',
          totalQuestions: ASSESSMENT_THRESHOLDS.INTERVIEW_TOTAL_QUESTIONS,
          passingScore: ASSESSMENT_THRESHOLDS.AI_INTERVIEW_PASS_PERCENTAGE,
        },
      });
    }

    res.json({ success: true, assessment: buildAssessmentStatusResponse(assessment) });
  } catch (error) {
    console.error('startAssessment error:', error);
    res.status(500).json({ success: false, message: 'Unable to initialize assessment: ' + error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/assessment/current
// ─────────────────────────────────────────────────────────────────────────────
exports.getCurrentAssessment = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    console.log('[Assessment] Current assessment requested by:', userId);
    const assessment = await ensureAssessment(req);
    console.log('[Assessment] Assessment found:', assessment?._id);
    console.log('[Assessment] currentLevel:', assessment?.currentLevel);
    console.log('[Assessment] finalStatus:', assessment?.finalStatus);

    if (!assessment) {
      return res.status(200).json({ success: true, assessment: null });
    }
    return res.status(200).json({
      success: true,
      assessment: buildAssessmentStatusResponse(assessment),
    });
  } catch (error) {
    console.error('getCurrentAssessment error:', error);
    res.status(500).json({ success: false, message: 'Unable to fetch assessment status: ' + error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ROUND 1: APTITUDE TEST
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/assessment/aptitude/current
exports.getCurrentAptitudeSession = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    console.log('[APTITUDE] Restore requested');
    console.log('[APTITUDE] User:', userId);
    console.log('[APTITUDE] Finding active assessment...');
    const assessment = await ensureAssessment(req);
    console.log('[APTITUDE] Assessment found:', !!assessment);
    console.log('[APTITUDE] Status:', assessment?.aptitude?.status || assessment?.aptitudeStatus);

    if (
      !assessment ||
      !assessment.aptitude ||
      assessment.aptitude.status === 'NOT_STARTED' ||
      !assessment.aptitude.questions ||
      assessment.aptitude.questions.length === 0
    ) {
      console.log('[APTITUDE] Returning session (null)');
      return res.status(200).json({
        success: true,
        session: null,
      });
    }

    const apt = assessment.aptitude;
    const now = new Date();
    const expiresAt = apt.expiresAt ? new Date(apt.expiresAt) : null;
    const remainingSeconds = expiresAt ? Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / 1000)) : 0;

    const savedAnswers = {};
    const responses = [];
    (apt.questions || []).forEach((q) => {
      if (q.selectedAnswer) {
        savedAnswers[q.questionNumber] = q.selectedAnswer;
        responses.push({
          questionNumber: q.questionNumber,
          selectedAnswer: q.selectedAnswer,
        });
      }
    });

    console.log('[APTITUDE] Returning session');
    return res.status(200).json({
      success: true,
      session: {
        assessmentId: assessment._id,
        status: apt.status || assessment.aptitudeStatus,
        questions: (apt.questions || []).map(sanitizeQuestionForCandidate),
        responses,
        savedAnswers,
        startedAt: apt.startedAt,
        expiresAt: apt.expiresAt,
        remainingSeconds,
        durationMinutes: ASSESSMENT_THRESHOLDS.ASSESSMENT_DURATION_MINUTES,
        totalQuestions: apt.questions?.length || ASSESSMENT_THRESHOLDS.TOTAL_QUESTIONS,
        score: apt.score || 0,
        passed: apt.status === 'PASSED',
        failed: apt.status === 'FAILED',
        fullscreenViolationCount: apt.fullscreenViolationCount || 0,
        attemptVersion: apt.attemptVersion || 1,
      },
    });
  } catch (error) {
    console.error('[APTITUDE] getCurrentAptitudeSession error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to restore Aptitude session: ' + error.message,
    });
  }
};

// POST /api/assessment/aptitude/start
exports.startAptitudeRound = async (req, res) => {
  try {
    let assessment = await ensureAssessment(req);
    if (!assessment) {
      assessment = await HiringAssessment.create({
        user: req.user._id,
        jobRole: 'Software Developer',
        experience: 'Intermediate',
        status: 'IN_PROGRESS',
        currentLevel: 'APTITUDE',
      });
    }

    if (assessment.aptitude?.status === 'PASSED' || assessment.aptitude?.status === 'FAILED') {
      return res.status(409).json({
        message: 'Aptitude test has already been completed.',
        status: assessment.aptitude.status,
      });
    }

    const now = new Date();

    // If questions already generated and test is in progress, restore session
    if (assessment.aptitude?.questions?.length > 0) {
      const expiresAt = new Date(assessment.aptitude.expiresAt);
      const remainingSeconds = Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / 1000));

      const savedAnswers = {};
      const responses = [];
      assessment.aptitude.questions.forEach(q => {
        if (q.selectedAnswer) {
          savedAnswers[q.questionNumber] = q.selectedAnswer;
          responses.push({ questionNumber: q.questionNumber, selectedAnswer: q.selectedAnswer });
        }
      });

      return res.json({
        success: true,
        session: {
          assessmentId: assessment._id,
          status: assessment.aptitude.status,
          questions: assessment.aptitude.questions.map(sanitizeQuestionForCandidate),
          responses,
          savedAnswers,
          startedAt: assessment.aptitude.startedAt,
          expiresAt: assessment.aptitude.expiresAt,
          remainingSeconds,
          durationMinutes: ASSESSMENT_THRESHOLDS.ASSESSMENT_DURATION_MINUTES,
          totalQuestions: assessment.aptitude.questions.length,
        },
        totalQuestions: assessment.aptitude.questions.length,
        durationMinutes: ASSESSMENT_THRESHOLDS.ASSESSMENT_DURATION_MINUTES,
        remainingSeconds,
        startedAt: assessment.aptitude.startedAt,
        expiresAt: assessment.aptitude.expiresAt,
        questions: assessment.aptitude.questions.map(sanitizeQuestionForCandidate),
        savedAnswers,
      });
    }

    // Generate 20 questions
    const questions = await openai.generateAptitudeQuestionsBatch({ count: ASSESSMENT_THRESHOLDS.TOTAL_QUESTIONS });
    const expiresAt = new Date(now.getTime() + ASSESSMENT_THRESHOLDS.ASSESSMENT_DURATION_MINUTES * 60 * 1000);

    assessment.aptitude.questions = questions.map((q, idx) => ({
      questionNumber: idx + 1,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      category: q.category || 'Quantitative Aptitude',
      topic: q.topic || 'General Aptitude',
      difficulty: q.difficulty || 'Medium',
      selectedAnswer: '',
      isCorrect: null,
    }));
    assessment.aptitude.startedAt = now;
    assessment.aptitude.expiresAt = expiresAt;
    assessment.aptitude.status = 'IN_PROGRESS';
    assessment.aptitude.totalQuestions = ASSESSMENT_THRESHOLDS.TOTAL_QUESTIONS;
    assessment.aptitude.passingScore = ASSESSMENT_THRESHOLDS.PASSING_CORRECT_ANSWERS;
    assessment.currentLevel = 'APTITUDE';
    assessment.aptitudeStatus = 'IN_PROGRESS';

    await assessment.save();

    res.status(201).json({
      success: true,
      session: {
        assessmentId: assessment._id,
        status: assessment.aptitude.status,
        questions: assessment.aptitude.questions.map(sanitizeQuestionForCandidate),
        responses: [],
        savedAnswers: {},
        startedAt: assessment.aptitude.startedAt,
        expiresAt: assessment.aptitude.expiresAt,
        remainingSeconds: ASSESSMENT_THRESHOLDS.ASSESSMENT_DURATION_MINUTES * 60,
        durationMinutes: ASSESSMENT_THRESHOLDS.ASSESSMENT_DURATION_MINUTES,
        totalQuestions: assessment.aptitude.questions.length,
      },
      totalQuestions: assessment.aptitude.questions.length,
      durationMinutes: ASSESSMENT_THRESHOLDS.ASSESSMENT_DURATION_MINUTES,
      remainingSeconds: ASSESSMENT_THRESHOLDS.ASSESSMENT_DURATION_MINUTES * 60,
      startedAt: assessment.aptitude.startedAt,
      expiresAt: assessment.aptitude.expiresAt,
      questions: assessment.aptitude.questions.map(sanitizeQuestionForCandidate),
      savedAnswers: {},
    });
  } catch (error) {
    console.error('startAptitudeRound error:', error);
    res.status(500).json({ message: 'Failed to start Aptitude test: ' + error.message });
  }
};

// POST /api/assessment/aptitude/save-progress
exports.saveAptitudeProgress = async (req, res) => {
  try {
    const { responses = [] } = req.body;
    const assessment = await ensureAssessment(req);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found.' });

    if (assessment.aptitude?.status === 'PASSED' || assessment.aptitude?.status === 'FAILED') {
      return res.status(409).json({ message: 'Test already submitted. Modifying answers is disabled.' });
    }

    const responseMap = new Map(responses.map(r => [Number(r.questionNumber), String(r.selectedAnswer || '').trim()]));

    assessment.aptitude.questions.forEach(q => {
      if (responseMap.has(q.questionNumber)) {
        const val = responseMap.get(q.questionNumber);
        if (q.options.includes(val)) {
          q.selectedAnswer = val;
          q.answeredAt = new Date();
        }
      }
    });

    await assessment.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save progress: ' + error.message });
  }
};

// POST /api/assessment/aptitude/submit
exports.submitAptitudeRound = async (req, res) => {
  try {
    const { responses = [] } = req.body;
    const assessment = await ensureAssessment(req);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found.' });

    if (assessment.aptitude?.status === 'PASSED' || assessment.aptitude?.status === 'FAILED') {
      return res.status(409).json({ message: 'Aptitude test already submitted.' });
    }

    const responseMap = new Map(responses.map(r => [Number(r.questionNumber), String(r.selectedAnswer || '').trim()]));

    let correctCount = 0;
    let attemptedCount = 0;

    assessment.aptitude.questions.forEach(q => {
      const selected = responseMap.has(q.questionNumber) ? responseMap.get(q.questionNumber) : q.selectedAnswer;
      if (selected && q.options.includes(selected)) {
        q.selectedAnswer = selected;
        q.answeredAt = q.answeredAt || new Date();
        attemptedCount += 1;
      }
      q.isCorrect = Boolean(q.selectedAnswer && q.selectedAnswer === q.correctAnswer);
      if (q.isCorrect) correctCount += 1;
    });

    const totalQuestions = assessment.aptitude.questions.length || ASSESSMENT_THRESHOLDS.TOTAL_QUESTIONS;
    const incorrectCount = totalQuestions - correctCount;
    const score = correctCount; // 1 mark per question
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = score >= ASSESSMENT_THRESHOLDS.PASSING_CORRECT_ANSWERS;

    assessment.aptitude.score = score;
    assessment.aptitude.correctCount = correctCount;
    assessment.aptitude.incorrectCount = incorrectCount;
    assessment.aptitude.percentage = percentage;
    assessment.aptitude.submittedAt = new Date();
    assessment.aptitude.status = passed ? 'PASSED' : 'FAILED';

    // Top-level legacy field sync
    assessment.aptitudeScore = score;
    assessment.aptitudeStatus = passed ? 'APTITUDE_PASSED' : 'APTITUDE_FAILED';

    if (passed) {
      assessment.currentLevel = 'TECHNICAL';
      assessment.technical.status = 'NOT_STARTED';
      assessment.technicalStatus = 'NOT_STARTED';
    } else {
      assessment.currentLevel = 'APTITUDE_FAILED';
      assessment.finalStatus = 'FAIL';
      assessment.technical.status = 'LOCKED';
      assessment.technicalStatus = 'LOCKED';
      assessment.interview.status = 'LOCKED';
      assessment.aiInterviewStatus = 'LOCKED';
      assessment.completedAt = new Date();
    }

    await assessment.save();

    const review = assessment.aptitude.questions.map(q => ({
      questionNumber: q.questionNumber,
      question: q.question,
      options: q.options,
      candidateAnswer: q.selectedAnswer || null,
      correctAnswer: q.correctAnswer,
      isCorrect: Boolean(q.isCorrect),
      explanation: q.explanation,
      category: q.category,
      topic: q.topic,
    }));

    res.json({
      score,
      totalQuestions,
      passingScore: ASSESSMENT_THRESHOLDS.PASSING_CORRECT_ANSWERS,
      correctCount,
      incorrectCount,
      attemptedCount,
      percentage,
      passed,
      status: assessment.aptitude.status,
      message: passed
        ? 'Congratulations! You passed the Aptitude round and qualified for Round 2.'
        : 'Minimum 15 out of 20 is required to qualify for the Technical Round.',
      review,
    });
  } catch (error) {
    console.error('submitAptitudeRound error:', error);
    res.status(500).json({ message: 'Unable to submit Aptitude test: ' + error.message });
  }
};

// GET /api/assessment/aptitude/result
exports.getAptitudeResult = async (req, res) => {
  try {
    const assessment = await ensureAssessment(req);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found.' });

    if (assessment.aptitude?.status !== 'PASSED' && assessment.aptitude?.status !== 'FAILED') {
      return res.status(400).json({ message: 'Aptitude round has not been submitted yet.' });
    }

    const review = assessment.aptitude.questions.map(q => ({
      questionNumber: q.questionNumber,
      question: q.question,
      options: q.options,
      candidateAnswer: q.selectedAnswer || null,
      correctAnswer: q.correctAnswer,
      isCorrect: Boolean(q.isCorrect),
      explanation: q.explanation,
      topic: q.topic,
    }));

    const passed = assessment.aptitude.score >= ASSESSMENT_THRESHOLDS.PASSING_CORRECT_ANSWERS;
    const attemptedCount = assessment.aptitude.questions.filter(q => q.selectedAnswer).length;

    res.json({
      score: assessment.aptitude.score,
      totalQuestions: assessment.aptitude.totalQuestions,
      passingScore: ASSESSMENT_THRESHOLDS.PASSING_CORRECT_ANSWERS,
      correctCount: assessment.aptitude.correctCount,
      incorrectCount: assessment.aptitude.incorrectCount,
      attemptedCount,
      percentage: assessment.aptitude.percentage,
      passed,
      status: assessment.aptitude.status,
      review,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load Aptitude result: ' + error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ROUND 2: TECHNICAL MCQ TEST
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/assessment/technical/current
exports.getCurrentTechnicalSession = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    console.log('[TECHNICAL] Restore requested');
    console.log('[TECHNICAL] User:', userId);
    console.log('[TECHNICAL] Finding active assessment...');
    const assessment = await ensureAssessment(req);
    console.log('[TECHNICAL] Assessment found:', !!assessment);

    if (!assessment) {
      return res.status(200).json({ success: true, session: null });
    }

    // Check prerequisites: Aptitude must be passed
    const aptPassed =
      assessment.aptitude?.status === 'PASSED' &&
      assessment.aptitude?.score >= ASSESSMENT_THRESHOLDS.PASSING_CORRECT_ANSWERS;
    if (!aptPassed) {
      return res.status(403).json({
        success: false,
        message: 'Minimum 15 out of 20 in Aptitude is required to qualify for the Technical Round.',
        isLocked: true,
      });
    }

    if (
      !assessment.technical ||
      assessment.technical.status === 'NOT_STARTED' ||
      !assessment.technical.questions ||
      assessment.technical.questions.length === 0
    ) {
      console.log('[TECHNICAL] Returning session (null)');
      return res.status(200).json({ success: true, session: null });
    }

    const tech = assessment.technical;
    const now = new Date();
    const expiresAt = tech.expiresAt ? new Date(tech.expiresAt) : null;
    const remainingSeconds = expiresAt ? Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / 1000)) : 0;

    const savedAnswers = {};
    const responses = [];
    (tech.questions || []).forEach((q) => {
      if (q.selectedAnswer) {
        savedAnswers[q.questionNumber] = q.selectedAnswer;
        responses.push({
          questionNumber: q.questionNumber,
          selectedAnswer: q.selectedAnswer,
        });
      }
    });

    console.log('[TECHNICAL] Returning session');
    return res.status(200).json({
      success: true,
      session: {
        assessmentId: assessment._id,
        status: tech.status || assessment.technicalStatus,
        questions: (tech.questions || []).map(sanitizeQuestionForCandidate),
        responses,
        savedAnswers,
        startedAt: tech.startedAt,
        expiresAt: tech.expiresAt,
        remainingSeconds,
        durationMinutes: ASSESSMENT_THRESHOLDS.ASSESSMENT_DURATION_MINUTES,
        totalQuestions: tech.questions?.length || ASSESSMENT_THRESHOLDS.TOTAL_QUESTIONS,
        score: tech.score || 0,
        passed: tech.status === 'PASSED',
        failed: tech.status === 'FAILED',
        fullscreenViolationCount: tech.fullscreenViolationCount || 0,
        attemptVersion: tech.attemptVersion || 1,
      },
    });
  } catch (error) {
    console.error('[TECHNICAL] getCurrentTechnicalSession error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to restore Technical session: ' + error.message,
    });
  }
};

// POST /api/assessment/technical/start
exports.startTechnicalRound = async (req, res) => {
  try {
    const assessment = await ensureAssessment(req);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found.' });

    // STRICT BACKEND VALIDATION: Must pass Aptitude (>= 15 / 20)
    const aptPassed = assessment.aptitude?.status === 'PASSED' && assessment.aptitude?.score >= ASSESSMENT_THRESHOLDS.PASSING_CORRECT_ANSWERS;
    if (!aptPassed) {
      return res.status(403).json({
        message: 'Minimum 15 out of 20 in Aptitude is required to qualify for the Technical Round.',
        aptitudeScore: assessment.aptitude?.score || 0,
        requiredScore: ASSESSMENT_THRESHOLDS.PASSING_CORRECT_ANSWERS,
      });
    }

    if (assessment.technical?.status === 'PASSED' || assessment.technical?.status === 'FAILED') {
      return res.status(409).json({
        message: 'Technical MCQ test has already been completed.',
        status: assessment.technical.status,
      });
    }

    const now = new Date();

    // If questions already generated and in progress, restore session
    if (assessment.technical?.questions?.length > 0) {
      const expiresAt = new Date(assessment.technical.expiresAt);
      const remainingSeconds = Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / 1000));

      const savedAnswers = {};
      const responses = [];
      assessment.technical.questions.forEach(q => {
        if (q.selectedAnswer) {
          savedAnswers[q.questionNumber] = q.selectedAnswer;
          responses.push({ questionNumber: q.questionNumber, selectedAnswer: q.selectedAnswer });
        }
      });

      return res.json({
        success: true,
        session: {
          assessmentId: assessment._id,
          status: assessment.technical.status,
          questions: assessment.technical.questions.map(sanitizeQuestionForCandidate),
          responses,
          savedAnswers,
          startedAt: assessment.technical.startedAt,
          expiresAt: assessment.technical.expiresAt,
          remainingSeconds,
          durationMinutes: ASSESSMENT_THRESHOLDS.ASSESSMENT_DURATION_MINUTES,
          totalQuestions: assessment.technical.questions.length,
          fullscreenViolationCount: assessment.technical.fullscreenViolationCount || 0,
          attemptVersion: assessment.technical.attemptVersion || 1,
        },
        totalQuestions: assessment.technical.questions.length,
        durationMinutes: ASSESSMENT_THRESHOLDS.ASSESSMENT_DURATION_MINUTES,
        remainingSeconds,
        startedAt: assessment.technical.startedAt,
        expiresAt: assessment.technical.expiresAt,
        questions: assessment.technical.questions.map(sanitizeQuestionForCandidate),
        savedAnswers,
      });
    }

    // Generate 20 technical questions
    const technicalQuestions = await openai.generateTechnicalMcqs({
      category: assessment.jobRole || 'Software Developer',
      topics: [
        'Programming Fundamentals',
        'Data Structures & Algorithms',
        'Object-Oriented Programming',
        'DBMS & SQL',
        'Operating Systems',
        'Computer Networks',
        'Web Development',
      ],
      difficulty: 'Mixed',
      count: ASSESSMENT_THRESHOLDS.TOTAL_QUESTIONS,
    });

    const expiresAt = new Date(now.getTime() + ASSESSMENT_THRESHOLDS.ASSESSMENT_DURATION_MINUTES * 60 * 1000);

    assessment.technical.questions = technicalQuestions.map((q, idx) => ({
      questionNumber: idx + 1,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      topic: q.topic || 'Software Engineering',
      difficulty: q.difficulty || 'Medium',
      selectedAnswer: '',
      isCorrect: null,
    }));
    assessment.technical.startedAt = now;
    assessment.technical.expiresAt = expiresAt;
    assessment.technical.status = 'IN_PROGRESS';
    assessment.technical.totalQuestions = ASSESSMENT_THRESHOLDS.TOTAL_QUESTIONS;
    assessment.technical.passingScore = ASSESSMENT_THRESHOLDS.PASSING_CORRECT_ANSWERS;
    assessment.currentLevel = 'TECHNICAL';
    assessment.technicalStatus = 'IN_PROGRESS';

    await assessment.save();

    res.status(201).json({
      success: true,
      session: {
        assessmentId: assessment._id,
        status: assessment.technical.status,
        questions: assessment.technical.questions.map(sanitizeQuestionForCandidate),
        responses: [],
        savedAnswers: {},
        startedAt: assessment.technical.startedAt,
        expiresAt: assessment.technical.expiresAt,
        remainingSeconds: ASSESSMENT_THRESHOLDS.ASSESSMENT_DURATION_MINUTES * 60,
        durationMinutes: ASSESSMENT_THRESHOLDS.ASSESSMENT_DURATION_MINUTES,
        totalQuestions: assessment.technical.questions.length,
        fullscreenViolationCount: assessment.technical.fullscreenViolationCount || 0,
        attemptVersion: assessment.technical.attemptVersion || 1,
      },
      totalQuestions: assessment.technical.questions.length,
      durationMinutes: ASSESSMENT_THRESHOLDS.ASSESSMENT_DURATION_MINUTES,
      remainingSeconds: ASSESSMENT_THRESHOLDS.ASSESSMENT_DURATION_MINUTES * 60,
      startedAt: assessment.technical.startedAt,
      expiresAt: assessment.technical.expiresAt,
      questions: assessment.technical.questions.map(sanitizeQuestionForCandidate),
      savedAnswers: {},
    });
  } catch (error) {
    console.error('startTechnicalRound error:', error);
    res.status(500).json({ message: 'Failed to start Technical test: ' + error.message });
  }
};

// POST /api/assessment/technical/save-progress
exports.saveTechnicalProgress = async (req, res) => {
  try {
    const { responses = [] } = req.body;
    const assessment = await ensureAssessment(req);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found.' });

    if (assessment.technical?.status === 'PASSED' || assessment.technical?.status === 'FAILED') {
      return res.status(409).json({ message: 'Technical test already submitted.' });
    }

    const responseMap = new Map(responses.map(r => [Number(r.questionNumber), String(r.selectedAnswer || '').trim()]));

    assessment.technical.questions.forEach(q => {
      if (responseMap.has(q.questionNumber)) {
        const val = responseMap.get(q.questionNumber);
        if (q.options.includes(val)) {
          q.selectedAnswer = val;
          q.answeredAt = new Date();
        }
      }
    });

    await assessment.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save progress: ' + error.message });
  }
};

// POST /api/assessment/technical/submit
exports.submitTechnicalRound = async (req, res) => {
  try {
    const { responses = [] } = req.body;
    const assessment = await ensureAssessment(req);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found.' });

    // Strict validation
    if (assessment.aptitude?.status !== 'PASSED' || assessment.aptitude?.score < ASSESSMENT_THRESHOLDS.PASSING_CORRECT_ANSWERS) {
      return res.status(403).json({ message: 'Cannot submit Technical round without passing Aptitude.' });
    }

    if (assessment.technical?.status === 'PASSED' || assessment.technical?.status === 'FAILED') {
      return res.status(409).json({ message: 'Technical test already submitted.' });
    }

    const responseMap = new Map(responses.map(r => [Number(r.questionNumber), String(r.selectedAnswer || '').trim()]));

    let correctCount = 0;
    let attemptedCount = 0;

    assessment.technical.questions.forEach(q => {
      const selected = responseMap.has(q.questionNumber) ? responseMap.get(q.questionNumber) : q.selectedAnswer;
      if (selected && q.options.includes(selected)) {
        q.selectedAnswer = selected;
        q.answeredAt = q.answeredAt || new Date();
        attemptedCount += 1;
      }
      q.isCorrect = Boolean(q.selectedAnswer && q.selectedAnswer === q.correctAnswer);
      if (q.isCorrect) correctCount += 1;
    });

    const totalQuestions = assessment.technical.questions.length || ASSESSMENT_THRESHOLDS.TOTAL_QUESTIONS;
    const incorrectCount = totalQuestions - correctCount;
    const score = correctCount;
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = score >= ASSESSMENT_THRESHOLDS.PASSING_CORRECT_ANSWERS;

    assessment.technical.score = score;
    assessment.technical.correctCount = correctCount;
    assessment.technical.incorrectCount = incorrectCount;
    assessment.technical.percentage = percentage;
    assessment.technical.submittedAt = new Date();
    assessment.technical.status = passed ? 'PASSED' : 'FAILED';

    assessment.technicalScore = score;
    assessment.technicalStatus = passed ? 'TECHNICAL_PASSED' : 'TECHNICAL_FAILED';

    if (passed) {
      assessment.currentLevel = 'AI_INTERVIEW';
      assessment.interview.status = 'NOT_STARTED';
      assessment.aiInterviewStatus = 'NOT_STARTED';
    } else {
      assessment.currentLevel = 'TECHNICAL_FAILED';
      assessment.finalStatus = 'FAIL';
      assessment.interview.status = 'LOCKED';
      assessment.aiInterviewStatus = 'LOCKED';
      assessment.completedAt = new Date();
    }

    await assessment.save();

    const review = assessment.technical.questions.map(q => ({
      questionNumber: q.questionNumber,
      question: q.question,
      options: q.options,
      candidateAnswer: q.selectedAnswer || null,
      correctAnswer: q.correctAnswer,
      isCorrect: Boolean(q.isCorrect),
      explanation: q.explanation,
      topic: q.topic,
    }));

    res.json({
      score,
      totalQuestions,
      passingScore: ASSESSMENT_THRESHOLDS.PASSING_CORRECT_ANSWERS,
      correctCount,
      incorrectCount,
      attemptedCount,
      percentage,
      passed,
      status: assessment.technical.status,
      message: passed
        ? 'Congratulations! You passed the Technical MCQ round and qualified for Round 3 (AI Interview).'
        : 'Minimum 15 out of 20 is required to qualify for the One-on-One AI Interview.',
      review,
    });
  } catch (error) {
    console.error('submitTechnicalRound error:', error);
    res.status(500).json({ message: 'Unable to submit Technical test: ' + error.message });
  }
};

// GET /api/assessment/technical/result
exports.getTechnicalResult = async (req, res) => {
  try {
    const assessment = await ensureAssessment(req);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found.' });

    if (assessment.technical?.status !== 'PASSED' && assessment.technical?.status !== 'FAILED') {
      return res.status(400).json({ message: 'Technical round has not been submitted yet.' });
    }

    const review = assessment.technical.questions.map(q => ({
      questionNumber: q.questionNumber,
      question: q.question,
      options: q.options,
      candidateAnswer: q.selectedAnswer || null,
      correctAnswer: q.correctAnswer,
      isCorrect: Boolean(q.isCorrect),
      explanation: q.explanation,
      topic: q.topic,
    }));

    const passed = assessment.technical.score >= ASSESSMENT_THRESHOLDS.PASSING_CORRECT_ANSWERS;
    const attemptedCount = assessment.technical.questions.filter(q => q.selectedAnswer).length;

    res.json({
      score: assessment.technical.score,
      totalQuestions: assessment.technical.totalQuestions,
      passingScore: ASSESSMENT_THRESHOLDS.PASSING_CORRECT_ANSWERS,
      correctCount: assessment.technical.correctCount,
      incorrectCount: assessment.technical.incorrectCount,
      attemptedCount,
      percentage: assessment.technical.percentage,
      passed,
      status: assessment.technical.status,
      review,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load Technical result: ' + error.message });
  }
};

// POST /api/assessment/:round/restart (or /aptitude/restart or /technical/restart)
exports.restartAssessmentRound = async (req, res) => {
  try {
    const rawRound = req.params.round || req.body.round || 'aptitude';
    const round = String(rawRound).toLowerCase();

    if (round !== 'aptitude' && round !== 'technical') {
      return res.status(400).json({ success: false, message: 'Invalid assessment round specified for restart.' });
    }

    const assessment = await ensureAssessment(req);
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found.' });
    }

    const candidateId = req.user?.id || req.user?._id;
    console.log('[ASSESSMENT SECURITY] Fullscreen violation');
    console.log('[ASSESSMENT SECURITY] Candidate:', candidateId);
    console.log('[ASSESSMENT SECURITY] Round:', round);
    console.log('[ASSESSMENT SECURITY] Restarting attempt');

    const roundData = assessment[round];
    if (!roundData || roundData.status !== 'IN_PROGRESS') {
      return res.status(400).json({
        success: false,
        message: `Cannot restart round '${round}' because its status is not IN_PROGRESS (current: ${roundData?.status || 'NOT_STARTED'}).`,
      });
    }

    const reason = req.body.reason || 'FULLSCREEN_EXIT';

    // Record fullscreen violation & increment violation count
    roundData.fullscreenViolationCount = (roundData.fullscreenViolationCount || 0) + 1;
    if (!Array.isArray(roundData.fullscreenViolations)) {
      roundData.fullscreenViolations = [];
    }
    roundData.fullscreenViolations.push({
      type: reason,
      timestamp: new Date(),
      details: req.body.details || 'Candidate exited fullscreen mode during active assessment.',
    });

    // Increment attemptVersion to invalidate stale submissions
    roundData.attemptVersion = (roundData.attemptVersion || 1) + 1;

    // Reset round timer: full 25 minutes
    const now = new Date();
    const durationMinutes = ASSESSMENT_THRESHOLDS.ASSESSMENT_DURATION_MINUTES;
    const expiresAt = new Date(now.getTime() + durationMinutes * 60 * 1000);

    roundData.startedAt = now;
    roundData.expiresAt = expiresAt;

    // Clear candidate's current attempt answers on existing stored questions (reuse questions, ZERO AI delays)
    (roundData.questions || []).forEach((q) => {
      q.selectedAnswer = '';
      q.isCorrect = null;
      q.answeredAt = null;
    });

    roundData.score = 0;
    roundData.correctCount = 0;
    roundData.incorrectCount = 0;
    roundData.percentage = 0;

    await assessment.save();

    return res.status(200).json({
      success: true,
      message: `${round === 'aptitude' ? 'Aptitude' : 'Technical MCQ'} round successfully restarted from Question 1.`,
      session: {
        assessmentId: assessment._id,
        round,
        status: 'IN_PROGRESS',
        questions: (roundData.questions || []).map(sanitizeQuestionForCandidate),
        responses: [],
        savedAnswers: {},
        currentQuestionIndex: 0,
        startedAt: roundData.startedAt,
        expiresAt: roundData.expiresAt,
        remainingSeconds: durationMinutes * 60,
        durationMinutes,
        totalQuestions: roundData.questions?.length || ASSESSMENT_THRESHOLDS.TOTAL_QUESTIONS,
        fullscreenViolationCount: roundData.fullscreenViolationCount,
        attemptVersion: roundData.attemptVersion,
      },
      totalQuestions: roundData.questions?.length || ASSESSMENT_THRESHOLDS.TOTAL_QUESTIONS,
      durationMinutes,
      remainingSeconds: durationMinutes * 60,
      startedAt: roundData.startedAt,
      expiresAt: roundData.expiresAt,
      questions: (roundData.questions || []).map(sanitizeQuestionForCandidate),
      savedAnswers: {},
    });
  } catch (error) {
    console.error('[ASSESSMENT SECURITY] restartAssessmentRound error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to restart assessment round: ' + error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ROUND 3: ONE-ON-ONE AI INTERVIEW
// ─────────────────────────────────────────────────────────────────────────────

// Fast fallback next question generator in case of network timeout or LLM rate limit
function getFallbackNextQuestion(jobRole, qNum) {
  const role = jobRole || 'Software Developer';
  const fallbacks = [
    {
      question: `Can you describe how you handle state management, caching, and data consistency in production applications as a ${role}?`,
      category: 'System Architecture',
      difficulty: 'Medium',
      expectedConcepts: ['Caching', 'State Management', 'Data Consistency', 'Latency'],
    },
    {
      question: `Describe a challenging performance bottleneck or subtle bug you encountered and the exact debugging steps you took to diagnose and resolve it.`,
      category: 'Problem Solving & Debugging',
      difficulty: 'Medium',
      expectedConcepts: ['Root Cause Analysis', 'Profiling', 'Debugging Tools', 'Preventative Testing'],
    },
    {
      question: `How do you approach database schema design, indexing strategies, and query optimization when query performance begins degrading under scale?`,
      category: 'Database & Performance',
      difficulty: 'Hard',
      expectedConcepts: ['Indexing', 'Query Optimization', 'Transactions', 'Execution Plans'],
    },
    {
      question: `In a fast-paced engineering team, how do you handle technical disagreements, conduct effective code reviews, and maintain testing standards?`,
      category: 'Collaboration & Best Practices',
      difficulty: 'Medium',
      expectedConcepts: ['Code Reviews', 'Automated Testing', 'Team Alignment', 'Technical Trade-offs'],
    },
  ];
  const idx = Math.min(fallbacks.length - 1, Math.max(0, qNum - 2));
  return fallbacks[idx];
}

// POST /api/assessment/interview/start
exports.startAiInterview = async (req, res) => {
  try {
    const assessment = await ensureAssessment(req);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found.' });

    // STRICT BACKEND VALIDATION: Must pass BOTH Round 1 & Round 2 (>= 15 / 20)
    const aptPassed = assessment.aptitude?.status === 'PASSED' && assessment.aptitude?.score >= ASSESSMENT_THRESHOLDS.PASSING_CORRECT_ANSWERS;
    const techPassed = assessment.technical?.status === 'PASSED' && assessment.technical?.score >= ASSESSMENT_THRESHOLDS.PASSING_CORRECT_ANSWERS;

    if (!aptPassed || !techPassed) {
      return res.status(403).json({
        message: 'AI Interview is locked. You must successfully pass both Aptitude (>=15/20) and Technical MCQ (>=15/20) tests.',
        aptitudePassed: aptPassed,
        technicalPassed: techPassed,
      });
    }

    if (assessment.interview?.status === 'PASSED' || assessment.interview?.status === 'FAILED' || assessment.status === 'COMPLETED') {
      return res.status(409).json({
        message: 'AI Interview has already been completed.',
        status: assessment.interview.status,
        interviewId: assessment.interview?.interviewId || assessment._id,
      });
    }

    // 1. Check if an active MongoDB Interview document already exists for this assessment
    if (assessment.interview?.interviewId) {
      const existingInterview = await Interview.findOne({
        _id: assessment.interview.interviewId,
        userId: req.user._id,
      });

      if (existingInterview && existingInterview.status === 'in_progress' && existingInterview.questions?.length > 0) {
        const curIdx = existingInterview.currentIndex || 0;
        const currentQ = existingInterview.questions[curIdx] || existingInterview.questions[existingInterview.questions.length - 1];

        return res.json({
          interviewId: existingInterview._id,
          assessmentId: assessment._id,
          questionNumber: curIdx + 1,
          totalQuestions: existingInterview.totalQuestions || ASSESSMENT_THRESHOLDS.INTERVIEW_TOTAL_QUESTIONS,
          currentQuestion: {
            questionId: currentQ._id,
            questionNumber: curIdx + 1,
            question: currentQ.question,
            category: currentQ.category || 'Technical',
            difficulty: currentQ.difficulty || 'Medium',
          },
          status: 'IN_PROGRESS',
        });
      }
    }

    // 2. Generate ONLY Question 1 on start (Do NOT generate 20 MCQs or all 5 questions upfront)
    let firstQData;
    try {
      const generated = await openai.generateInterviewQuestions({
        jobRole: assessment.jobRole || 'Software Developer',
        experience: assessment.experience || 'Intermediate',
        difficulty: 'Medium',
        interviewType: 'Technical & Behavioral',
        numberOfQuestions: 1,
      });
      firstQData = generated[0];
    } catch (aiError) {
      console.warn('Initial AI question generation error, using curated fallback question:', aiError.message);
      firstQData = {
        question: `Can you introduce yourself and explain your architectural approach to building maintainable, scalable software as a ${assessment.jobRole || 'Software Developer'}?`,
        category: 'Architecture & Fundamentals',
        difficulty: 'Medium',
        expectedConcepts: ['Scalability', 'Maintainability', 'Architecture', 'Trade-offs'],
      };
    }

    // 3. Create genuine MongoDB Interview session document
    const newInterview = await Interview.create({
      userId: req.user._id,
      jobRole: assessment.jobRole || 'Software Developer',
      experience: assessment.experience || 'Intermediate',
      difficulty: 'Medium',
      interviewType: 'One-on-One AI Interview',
      totalQuestions: ASSESSMENT_THRESHOLDS.INTERVIEW_TOTAL_QUESTIONS,
      currentIndex: 0,
      status: 'in_progress',
      questions: [{
        question: firstQData.question,
        category: firstQData.category || 'Technical',
        difficulty: firstQData.difficulty || 'Medium',
        expectedConcepts: firstQData.expectedConcepts || [],
        answer: '',
      }],
    });

    // 4. Link MongoDB interview ID to HiringAssessment document
    assessment.interview.interviewId = newInterview._id;
    assessment.interview.status = 'IN_PROGRESS';
    assessment.interview.startedAt = new Date();
    assessment.interview.totalQuestions = ASSESSMENT_THRESHOLDS.INTERVIEW_TOTAL_QUESTIONS;
    assessment.interview.currentIndex = 0;
    assessment.interview.questions = [{
      questionNumber: 1,
      question: firstQData.question,
      category: firstQData.category || 'Technical',
      difficulty: firstQData.difficulty || 'Medium',
      expectedConcepts: firstQData.expectedConcepts || [],
      answer: '',
    }];
    assessment.currentLevel = 'AI_INTERVIEW';
    assessment.aiInterviewStatus = 'IN_PROGRESS';

    await assessment.save();

    const createdFirstQ = newInterview.questions[0];

    return res.status(201).json({
      interviewId: newInterview._id,
      assessmentId: assessment._id,
      questionNumber: 1,
      totalQuestions: ASSESSMENT_THRESHOLDS.INTERVIEW_TOTAL_QUESTIONS,
      currentQuestion: {
        questionId: createdFirstQ._id,
        questionNumber: 1,
        question: createdFirstQ.question,
        category: createdFirstQ.category,
        difficulty: createdFirstQ.difficulty,
      },
      status: 'IN_PROGRESS',
    });
  } catch (error) {
    console.error('startAiInterview error:', error);
    res.status(500).json({ message: 'Failed to start AI Interview: ' + error.message });
  }
};

// GET /api/assessment/interview/:interviewId or /api/assessment/interview/current
exports.getInterviewSession = async (req, res) => {
  try {
    const assessment = await ensureAssessment(req);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found.' });

    const interviewId = req.params.interviewId && req.params.interviewId !== 'current'
      ? req.params.interviewId
      : assessment.interview?.interviewId;

    if (!interviewId) {
      return res.status(404).json({ message: 'No active AI Interview session found.' });
    }

    const interview = await Interview.findOne({ _id: interviewId, userId: req.user._id });
    if (!interview) {
      return res.status(404).json({ message: 'Interview session document not found.' });
    }

    const curIdx = interview.currentIndex || 0;
    const currentQ = interview.questions[curIdx] || interview.questions[interview.questions.length - 1];

    res.json({
      interviewId: interview._id,
      assessmentId: assessment._id,
      questionNumber: curIdx + 1,
      totalQuestions: interview.totalQuestions || ASSESSMENT_THRESHOLDS.INTERVIEW_TOTAL_QUESTIONS,
      status: interview.status === 'in_progress' ? 'IN_PROGRESS' : interview.status.toUpperCase(),
      currentQuestion: currentQ ? {
        questionId: currentQ._id,
        questionNumber: curIdx + 1,
        question: currentQ.question,
        category: currentQ.category || 'Technical',
        difficulty: currentQ.difficulty || 'Medium',
      } : null,
      completedAnswers: interview.questions.filter(q => q.answer).length,
      isLastQuestion: curIdx >= (interview.totalQuestions || ASSESSMENT_THRESHOLDS.INTERVIEW_TOTAL_QUESTIONS) - 1,
    });
  } catch (error) {
    console.error('getInterviewSession error:', error);
    res.status(500).json({ message: 'Failed to retrieve interview session: ' + error.message });
  }
};

// POST /api/assessment/interview/:interviewId/answer (and fallback /api/assessment/interview/answer)
exports.submitInterviewAnswer = async (req, res) => {
  try {
    const assessment = await ensureAssessment(req);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found.' });

    const interviewId = req.params.interviewId || req.body.interviewId || assessment.interview?.interviewId;
    if (!interviewId) {
      return res.status(400).json({ message: 'No interview ID associated with this session.' });
    }

    const interview = await Interview.findOne({ _id: interviewId, userId: req.user._id });
    if (!interview) {
      return res.status(404).json({ message: 'Interview session not found.' });
    }

    if (interview.status !== 'in_progress') {
      return res.status(400).json({ message: 'AI Interview is not in progress.' });
    }

    const { textAnswer, duration } = req.body;
    const curIdx = interview.currentIndex || 0;
    const targetQuestion = interview.questions[curIdx];

    if (!targetQuestion) {
      return res.status(400).json({ message: 'No active question found for this interview step.' });
    }

    let transcript = (textAnswer || '').trim();
    const audioDuration = Number(duration || 0);

    // 1. Audio transcription with Groq Whisper
    if (req.file) {
      try {
        transcript = await openai.transcribeAudio({
          buffer: req.file.buffer,
          filename: req.file.originalname || 'answer.webm',
          mimeType: req.file.mimetype || 'audio/webm',
        });
      } catch (sttError) {
        console.warn('Speech transcription failed:', sttError.message);
        if (!transcript) {
          return res.status(422).json({
            message: 'Audio transcription failed. Please record again or type your answer in text mode.',
          });
        }
      }
    }

    if (!transcript) {
      return res.status(400).json({ message: 'Please provide a voice recording or typed answer.' });
    }

    // 2. Real AI evaluation of candidate's answer
    const evaluation = await openai.evaluateAssessmentInterviewAnswer({
      jobRole: interview.jobRole || assessment.jobRole,
      question: targetQuestion.question,
      answer: transcript,
      transcript,
      difficulty: targetQuestion.difficulty,
      expectedConcepts: targetQuestion.expectedConcepts,
    });

    // 3. Save answer and evaluation on MongoDB Interview document
    targetQuestion.answer = transcript;
    targetQuestion.answeredAt = new Date();
    targetQuestion.evaluation = evaluation;

    // Synchronize into assessment document as well
    if (assessment.interview.questions[curIdx]) {
      assessment.interview.questions[curIdx].answer = transcript;
      assessment.interview.questions[curIdx].transcript = transcript;
      assessment.interview.questions[curIdx].audioDuration = audioDuration;
      assessment.interview.questions[curIdx].answeredAt = new Date();
      assessment.interview.questions[curIdx].evaluation = evaluation;
    }

    const totalQuestions = interview.totalQuestions || ASSESSMENT_THRESHOLDS.INTERVIEW_TOTAL_QUESTIONS;
    const nextIndex = curIdx + 1;
    const isLastQuestion = nextIndex >= totalQuestions;

    interview.currentIndex = nextIndex;
    assessment.interview.currentIndex = nextIndex;

    // 4. If not last question, adaptively generate the next question
    if (!isLastQuestion) {
      let nextQData;
      try {
        nextQData = await openai.generateNextQuestion({
          jobRole: interview.jobRole || assessment.jobRole || 'Software Developer',
          experience: interview.experience || assessment.experience || 'Intermediate',
          currentDifficulty: targetQuestion.difficulty || 'Medium',
          interviewType: 'Technical & Behavioral',
          previousQuestions: interview.questions.map(q => q.question),
          previousScores: interview.questions
            .filter(q => q.evaluation?.overallScore)
            .map(q => q.evaluation.overallScore),
          weakAreas: evaluation.weaknesses || [],
        });
      } catch (aiErr) {
        console.warn('Adaptive next question generation fallback:', aiErr.message);
        nextQData = getFallbackNextQuestion(interview.jobRole, nextIndex + 1);
      }

      const nextQDoc = {
        question: nextQData.question,
        category: nextQData.category || 'Technical',
        difficulty: nextQData.difficulty || 'Medium',
        expectedConcepts: nextQData.expectedConcepts || [],
        answer: '',
      };

      interview.questions.push(nextQDoc);
      assessment.interview.questions.push({
        questionNumber: nextIndex + 1,
        ...nextQDoc,
      });

      await interview.save();
      await assessment.save();

      const savedNextQ = interview.questions[interview.questions.length - 1];

      return res.json({
        transcript,
        evaluation,
        questionNumber: nextIndex + 1,
        totalQuestions,
        isLastQuestion: false,
        nextQuestion: {
          questionId: savedNextQ._id,
          questionNumber: nextIndex + 1,
          question: savedNextQ.question,
          category: savedNextQ.category,
          difficulty: savedNextQ.difficulty,
        },
      });
    }

    // 5. If this was the final question:
    await interview.save();
    await assessment.save();

    return res.json({
      transcript,
      evaluation,
      questionNumber: nextIndex,
      totalQuestions,
      isLastQuestion: true,
      nextQuestion: null,
    });
  } catch (error) {
    console.error('submitInterviewAnswer error:', error);
    res.status(500).json({ message: 'Failed to process interview answer: ' + error.message });
  }
};

// POST /api/assessment/interview/:interviewId/complete (and fallback /api/assessment/interview/complete)
exports.completeAiInterview = async (req, res) => {
  try {
    const assessment = await ensureAssessment(req);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found.' });

    const interviewId = req.params.interviewId || req.body.interviewId || assessment.interview?.interviewId;
    let interview = null;
    if (interviewId) {
      interview = await Interview.findOne({ _id: interviewId, userId: req.user._id });
    }

    const answeredQuestions = (interview?.questions || assessment.interview?.questions || []).filter(
      q => q.answer && q.evaluation
    );

    if (answeredQuestions.length === 0) {
      return res.status(400).json({ message: 'No interview answers found to evaluate.' });
    }

    // Aggregate category score metrics
    const technicalScores = answeredQuestions.map(q => q.evaluation.technicalScore || 0);
    const commScores = answeredQuestions.map(q => q.evaluation.communicationScore || 0);
    const relevanceScores = answeredQuestions.map(q => q.evaluation.relevanceScore || 0);
    const clarityScores = answeredQuestions.map(q => q.evaluation.clarityScore || 0);
    const psScores = answeredQuestions.map(q => q.evaluation.problemSolvingScore || 0);
    const overallScores = answeredQuestions.map(q => q.evaluation.overallScore || 0);

    const avg = arr => (arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0);

    const techAvg = avg(technicalScores);
    const commAvg = avg(commScores);
    const relAvg = avg(relevanceScores);
    const clarityAvg = avg(clarityScores);
    const psAvg = avg(psScores);
    const interviewOverallScore = avg(overallScores);

    // Generate comprehensive final report using AI service
    const finalReport = await openai.generateFinalInterviewReport({
      jobRole: assessment.jobRole,
      experience: assessment.experience,
      questions: answeredQuestions.map(q => q.question),
      answers: answeredQuestions.map(q => q.answer),
      evaluations: answeredQuestions.map(q => q.evaluation),
      scores: overallScores,
    });

    const passed = interviewOverallScore >= ASSESSMENT_THRESHOLDS.AI_INTERVIEW_PASS_PERCENTAGE;

    // Update MongoDB Interview session
    if (interview) {
      interview.status = 'completed';
      interview.overallScore = interviewOverallScore;
      interview.finalFeedback = {
        overallFeedback: finalReport.overallFeedback || '',
        strengths: finalReport.strengths || [],
        weaknesses: finalReport.weaknesses || [],
        recommendedTopics: finalReport.recommendedTopics || [],
        improvementPlan: finalReport.improvementPlan || [],
        readinessLevel: finalReport.readinessLevel || (passed ? 'Qualified' : 'Needs Practice'),
      };
      await interview.save();
    }

    // Update HiringAssessment document
    assessment.interview.score = interviewOverallScore;
    assessment.interview.status = passed ? 'PASSED' : 'FAILED';
    assessment.interview.completedAt = new Date();
    assessment.interview.finalEvaluation = {
      overallScore: interviewOverallScore,
      technicalScore: techAvg,
      communicationScore: commAvg,
      relevanceScore: relAvg,
      clarityScore: clarityAvg,
      problemSolvingScore: psAvg,
      strengths: finalReport.strengths || [],
      weaknesses: finalReport.weaknesses || [],
      improvementSuggestions: finalReport.improvementPlan || [],
      overallFeedback: finalReport.overallFeedback || '',
      readinessLevel: finalReport.readinessLevel || (passed ? 'Qualified' : 'Needs Practice'),
    };

    assessment.aiInterviewScore = interviewOverallScore;
    assessment.aiInterviewStatus = passed ? 'AI_INTERVIEW_PASSED' : 'AI_INTERVIEW_FAILED';

    // Compute consolidated overall assessment status
    const aptPercent = assessment.aptitude?.percentage || 0;
    const techPercent = assessment.technical?.percentage || 0;
    const interviewPercent = interviewOverallScore;

    const overallWeighted = Math.round(
      aptPercent * ASSESSMENT_THRESHOLDS.APTITUDE_WEIGHT +
      techPercent * ASSESSMENT_THRESHOLDS.TECHNICAL_WEIGHT +
      interviewPercent * ASSESSMENT_THRESHOLDS.AI_INTERVIEW_WEIGHT
    );

    assessment.overallScore = overallWeighted;
    assessment.completedAt = new Date();

    const aptPassed = assessment.aptitude?.status === 'PASSED';
    const techPassed = assessment.technical?.status === 'PASSED';

    if (aptPassed && techPassed && passed) {
      assessment.finalStatus = 'PASS';
      assessment.status = 'COMPLETED';
      assessment.currentLevel = 'COMPLETED';
    } else {
      assessment.finalStatus = 'FAIL';
      assessment.status = 'COMPLETED';
      assessment.currentLevel = 'COMPLETED';
    }

    await assessment.save();

    res.json({
      interviewId: interview?._id || assessment.interview?.interviewId,
      overallInterviewScore: interviewOverallScore,
      passed,
      status: assessment.interview.status,
      passingScore: ASSESSMENT_THRESHOLDS.AI_INTERVIEW_PASS_PERCENTAGE,
      evaluation: assessment.interview.finalEvaluation,
      overallAssessmentStatus: assessment.finalStatus,
      overallAssessmentScore: overallWeighted,
    });
  } catch (error) {
    console.error('completeAiInterview error:', error);
    res.status(500).json({ message: 'Failed to finalize AI interview: ' + error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// CONSOLIDATED FINAL ASSESSMENT RESULT
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/assessment/result
exports.getAssessmentResult = async (req, res) => {
  try {
    const assessment = await ensureAssessment(req);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found.' });

    const aptQuestions = assessment.aptitude?.questions || [];
    const techQuestions = assessment.technical?.questions || [];
    const interviewQuestions = assessment.interview?.questions || [];

    const aptAttempted = aptQuestions.filter(q => q.selectedAnswer).length;
    const techAttempted = techQuestions.filter(q => q.selectedAnswer).length;

    const aptPassed = assessment.aptitude?.status === 'PASSED' && assessment.aptitude?.score >= ASSESSMENT_THRESHOLDS.PASSING_CORRECT_ANSWERS;
    const techPassed = assessment.technical?.status === 'PASSED' && assessment.technical?.score >= ASSESSMENT_THRESHOLDS.PASSING_CORRECT_ANSWERS;
    const interviewPassed = assessment.interview?.status === 'PASSED' && assessment.interview?.score >= ASSESSMENT_THRESHOLDS.AI_INTERVIEW_PASS_PERCENTAGE;

    res.json({
      result: {
        assessmentId: assessment._id,
        user: assessment.user,
        jobRole: assessment.jobRole,
        experience: assessment.experience,
        finalStatus: assessment.finalStatus,
        overallScore: assessment.overallScore,
        status: assessment.status,
        completedAt: assessment.completedAt,
        rounds: {
          aptitude: {
            roundNumber: 1,
            title: 'Round 1 – Aptitude Test',
            status: assessment.aptitude?.status || 'NOT_STARTED',
            score: assessment.aptitude?.score || 0,
            totalQuestions: assessment.aptitude?.totalQuestions || 20,
            passingScore: ASSESSMENT_THRESHOLDS.PASSING_CORRECT_ANSWERS,
            percentage: assessment.aptitude?.percentage || 0,
            attempted: aptAttempted,
            correctCount: assessment.aptitude?.correctCount || 0,
            incorrectCount: assessment.aptitude?.incorrectCount || 0,
            passed: aptPassed,
            review: aptQuestions.map(q => ({
              questionNumber: q.questionNumber,
              question: q.question,
              options: q.options,
              candidateAnswer: q.selectedAnswer || null,
              correctAnswer: q.correctAnswer,
              isCorrect: Boolean(q.isCorrect),
              explanation: q.explanation,
              category: q.category,
              topic: q.topic,
            })),
          },
          technical: {
            roundNumber: 2,
            title: 'Round 2 – Technical MCQ',
            status: assessment.technical?.status || 'LOCKED',
            score: assessment.technical?.score || 0,
            totalQuestions: assessment.technical?.totalQuestions || 20,
            passingScore: ASSESSMENT_THRESHOLDS.PASSING_CORRECT_ANSWERS,
            percentage: assessment.technical?.percentage || 0,
            attempted: techAttempted,
            correctCount: assessment.technical?.correctCount || 0,
            incorrectCount: assessment.technical?.incorrectCount || 0,
            passed: techPassed,
            review: techQuestions.map(q => ({
              questionNumber: q.questionNumber,
              question: q.question,
              options: q.options,
              candidateAnswer: q.selectedAnswer || null,
              correctAnswer: q.correctAnswer,
              isCorrect: Boolean(q.isCorrect),
              explanation: q.explanation,
              topic: q.topic,
            })),
          },
          interview: {
            roundNumber: 3,
            title: 'Round 3 – One-on-One AI Interview',
            status: assessment.interview?.status || 'LOCKED',
            score: assessment.interview?.score || 0,
            passingScore: ASSESSMENT_THRESHOLDS.AI_INTERVIEW_PASS_PERCENTAGE,
            totalQuestions: assessment.interview?.totalQuestions || 5,
            passed: interviewPassed,
            finalEvaluation: assessment.interview?.finalEvaluation || null,
            questions: interviewQuestions.map(q => ({
              questionNumber: q.questionNumber,
              question: q.question,
              category: q.category,
              answer: q.answer,
              transcript: q.transcript,
              evaluation: q.evaluation,
            })),
          },
        },
      },
    });
  } catch (error) {
    console.error('getAssessmentResult error:', error);
    res.status(500).json({ message: 'Unable to fetch consolidated assessment result: ' + error.message });
  }
};
