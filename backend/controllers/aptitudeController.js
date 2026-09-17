const AptitudeSession = require('../models/AptitudeSession');
const openai = require('../services/openaiService');
const { getCuratedAptitudeQuestion } = require('../data/curatedAptitudeBank');

const CATEGORIES = ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability'];
const TOPICS = {
  'Quantitative Aptitude': [
    'Percentages', 'Percentage', 'Profit and Loss', 'Profit & Loss', 'Ratio and Proportion', 'Ratio & Proportion',
    'Averages', 'Average', 'Time and Work', 'Time & Work', 'Time, Speed and Distance', 'Time, Speed & Distance',
    'Simple Interest', 'Compound Interest', 'Probability', 'Number System', 'HCF and LCM', 'HCF & LCM',
    'Permutation and Combination', 'Data Interpretation', 'Arithmetic', 'Simplification', 'Problems on Ages',
    'Partnership', 'Mixtures & Alligation', 'Squares & Cubes'
  ],
  'Logical Reasoning': [
    'Number Series', 'Alphabet Series', 'Series', 'Coding-Decoding', 'Coding & Decoding', 'Blood Relations',
    'Direction Sense', 'Syllogism', 'Analogy', 'Classification', 'Logical Relations', 'Cube & Dice',
    'Seating Arrangement', 'Logical Puzzles', 'Statement and Conclusion', 'Logical Reasoning'
  ],
  'Verbal Ability': [
    'Grammar', 'Sentence Correction', 'Synonyms', 'Antonyms', 'Vocabulary',
    'Sentence Completion', 'Para Jumbles', 'Reading Comprehension', 'Error Detection'
  ],
};
const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Mixed', 'Moderate', 'Advanced'];
const QUESTION_LIMITS = [5, 10, 15, 20, 30, 50];
const TIME_LIMITS = [5, 10, 15, 20, 25, 30, 45, 60];

function matchesTopicName(t1, t2) {
  return String(t1 || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]/g, '') ===
         String(t2 || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]/g, '');
}

function normalizeQuestionText(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[₹$€£]|rs\.?\s*/gi, '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractNumbers(text) {
  const matches = String(text || '').match(/\b\d+(?:\.\d+)?\b/g);
  return matches ? matches.map(Number) : [];
}

function areNumbersEqual(nums1, nums2) {
  if (nums1.length !== nums2.length) return false;
  return nums1.every((num, i) => Math.abs(num - nums2[i]) < 1e-6);
}

function isDuplicateQuestion(candidate, existing) {
  const textC = typeof candidate === 'string' ? candidate : candidate?.question;
  const textE = typeof existing === 'string' ? existing : existing?.question;
  const normC = normalizeQuestionText(textC);
  const normE = normalizeQuestionText(textE);

  if (!normC || !normE) return false;

  // Exact normalized match
  if (normC === normE) return true;

  const numsC = extractNumbers(normC);
  const numsE = extractNumbers(normE);

  // If both have numbers and numbers are distinct, they are distinct questions!
  if (numsC.length > 0 && numsE.length > 0) {
    if (!areNumbersEqual(numsC, numsE)) {
      return false;
    }
  }

  // Check options if both are full question objects
  if (Array.isArray(candidate?.options) && Array.isArray(existing?.options)) {
    const optsC = new Set(candidate.options.map(o => normalizeQuestionText(o)));
    const optsE = new Set(existing.options.map(o => normalizeQuestionText(o)));
    let matchCount = 0;
    for (const opt of optsC) {
      if (optsE.has(opt)) matchCount++;
    }
    // If all options differ and correct answers differ, not a duplicate
    if (matchCount === 0 && candidate.correctAnswer !== existing.correctAnswer) {
      return false;
    }
  }

  // Word overlap comparison for non-numeric or identical-numeric questions
  const wordsC = normC.split(' ').filter(w => w.length > 2);
  const wordsE = normE.split(' ').filter(w => w.length > 2);
  const setC = new Set(wordsC);
  const setE = new Set(wordsE);

  if (!setC.size || !setE.size) return false;

  let common = 0;
  for (const w of setC) {
    if (setE.has(w)) common++;
  }

  const similarity = common / Math.max(setC.size, setE.size);
  // High similarity threshold: only duplicate if 92% of non-trivial words overlap
  return similarity >= 0.92;
}

function isExpired(session) {
  return Date.now() >= new Date(session.expiresAt).getTime();
}

function publicQuestion(session, question, index = session.currentIndex) {
  return {
    questionId: question._id,
    questionNumber: index + 1,
    totalQuestions: session.totalQuestions,
    category: question.category,
    topic: question.topic,
    difficulty: question.difficulty,
    question: question.question,
    options: question.options,
    remainingSeconds: Math.max(0, Math.ceil((new Date(session.expiresAt).getTime() - Date.now()) / 1000)),
  };
}

async function expireIfNeeded(session) {
  if (session.completionStatus === 'in_progress' && isExpired(session)) await completeSession(session, 'expired');
  return session.completionStatus !== 'in_progress';
}

async function generateNext(session) {
  const currentIndex = session.questions.length;
  const questionNumber = currentIndex + 1;

  // Determine target category
  let category = session.category;
  if (!category || category === 'Mixed Aptitude') {
    if (session.topic && session.topic !== 'Mixed' && session.topic !== 'All Topics') {
      const foundCategory = CATEGORIES.find(cat =>
        TOPICS[cat]?.some(t => matchesTopicName(t, session.topic))
      );
      category = foundCategory || 'Quantitative Aptitude';
    } else {
      category = CATEGORIES[currentIndex % CATEGORIES.length];
    }
  }

  // Determine target topic
  const topic = (session.topic === 'All Topics' || session.topic === 'Mixed') ? 'Mixed' : session.topic;

  // Determine target difficulty
  let difficulty = session.difficulty;
  if (difficulty === 'Moderate') difficulty = 'Medium';
  if (difficulty === 'Advanced') difficulty = 'Hard';
  if (difficulty === 'Mixed') {
    difficulty = currentIndex % 3 === 0 ? 'Easy' : currentIndex % 3 === 1 ? 'Medium' : 'Hard';
  }

  const previous = session.questions.map(q => q.question);
  const MAX_ATTEMPTS = 4;
  let lastError = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    console.log(`[APTITUDE] Question ${questionNumber}/${session.totalQuestions} - Generation attempt ${attempt}/${MAX_ATTEMPTS} (Topic: ${topic}, Difficulty: ${difficulty})`);

    let variationHint = '';
    if (attempt === 2) {
      variationHint = 'Use completely fresh numerical values, different characters, and an alternative calculation scenario.';
    } else if (attempt === 3) {
      variationHint = 'Drastically alter the problem context, wording, and question structure. Ensure no similarity with earlier questions.';
    } else if (attempt === 4) {
      variationHint = 'Formulate a creative practical word problem testing a different reasoning facet of this topic.';
    }

    try {
      const generated = await openai.generateAptitudeQuestion({
        category,
        topic,
        difficulty,
        previousQuestions: previous,
        questionNumber,
        variationHint,
      });

      console.log(`[APTITUDE] Question ${questionNumber} - AI response received and parsed successfully`);

      // Validation
      if (!generated || !generated.question || !Array.isArray(generated.options) || generated.options.length !== 4) {
        console.warn(`[APTITUDE] Question ${questionNumber} - Attempt ${attempt}: Validation failed (invalid question format). Retrying...`);
        continue;
      }

      // Check uniqueness against all previously accepted questions in this session
      const isDupe = session.questions.some(existing => isDuplicateQuestion(generated, existing));
      if (isDupe) {
        console.warn(`[APTITUDE] Question ${questionNumber} - Attempt ${attempt}: Duplicate detected against previous questions. Retrying...`);
        continue;
      }

      console.log(`[APTITUDE] Question ${questionNumber} - Validation passed and uniqueness verified.`);
      session.questions.push(generated);
      await session.save();
      return session.questions[session.questions.length - 1];
    } catch (err) {
      console.error(`[APTITUDE] Question ${questionNumber} - Attempt ${attempt} failed:`, err.message || err);
      lastError = err;
    }
  }

  // Safe fallback if AI fails or exhausts retries (e.g. rate limit 429)
  console.warn(`[APTITUDE] Question ${questionNumber} - AI attempts exhausted or API unavailable. Utilizing verified curated question.`);
  const curated = getCuratedAptitudeQuestion(topic, difficulty, previous);
  if (curated) {
    // Ensure uniqueness
    if (!session.questions.some(existing => isDuplicateQuestion(curated, existing))) {
      console.log(`[APTITUDE] Question ${questionNumber} - Curated question loaded successfully.`);
      session.questions.push(curated);
      await session.save();
      return session.questions[session.questions.length - 1];
    }
  }

  // If even curated had duplicates or null, throw descriptive error
  const errorMsg = lastError?.message || 'Unable to generate a unique aptitude question after multiple attempts.';
  console.error(`[APTITUDE] Question ${questionNumber} - Fatal generation failure:`, errorMsg);
  const error = new Error(errorMsg);
  error.statusCode = lastError?.statusCode || 502;
  throw error;
}

async function completeSession(session, status = 'completed') {
  const answered = session.questions.filter(question => question.answeredAt);
  const correct = answered.filter(question => question.isCorrect).length;
  session.questionsAttempted = answered.length;
  session.score = correct;
  session.accuracy = answered.length ? Math.round((correct / answered.length) * 100) : 0;
  session.endTime = session.endTime || new Date();
  session.completionStatus = status;
  if (!session.feedback && answered.length) {
    const sections = CATEGORIES.map(category => {
      const items = session.questions.filter(question => question.category === category);
      return `${category}: ${items.filter(question => question.isCorrect).length}/${items.length}`;
    }).join(', ');
    try {
      session.feedback = await openai.generateAptitudeFeedback({ summary: `Score: ${session.score}/${session.totalQuestions}. Attempted: ${answered.length}. Accuracy: ${session.accuracy}%. ${sections}.` });
    } catch {
      session.feedback = 'Review the explanations for missed questions and practise the weakest section next.';
    }
  }
  await session.save();
}

exports.start = async (req, res) => {
  try {
    let { mode = 'practice', category, topic = 'Mixed', difficulty = 'Medium', numberOfQuestions, timeLimit } = req.body;

    // Normalize topic
    if (!topic || topic === 'All Topics' || topic === 'Mixed') {
      topic = 'Mixed';
    }

    // Normalize difficulty
    if (difficulty === 'Moderate') difficulty = 'Medium';
    if (difficulty === 'Advanced') difficulty = 'Hard';

    // Auto-detect category from topic if needed
    if (!category || category === 'Mixed Aptitude' || topic === 'Mixed') {
      if (topic !== 'Mixed') {
        const foundCategory = CATEGORIES.find(cat => TOPICS[cat]?.some(t => matchesTopicName(t, topic)));
        category = foundCategory || 'Mixed Aptitude';
      } else {
        category = 'Mixed Aptitude';
      }
    }

    const count = Number(numberOfQuestions);
    const minutes = Number(timeLimit);
    const validCategory = category === 'Mixed Aptitude' || CATEGORIES.includes(category);
    const validTopic = topic === 'Mixed' || CATEGORIES.some(item => TOPICS[item].some(t => matchesTopicName(t, topic)));
    const topicCategoryMatches = topic === 'Mixed' || category === 'Mixed Aptitude' || TOPICS[category]?.some(t => matchesTopicName(t, topic));
    if (mode !== 'practice' || !validCategory || !validTopic || !topicCategoryMatches || !DIFFICULTIES.includes(difficulty) || !Number.isInteger(count) || count < 1 || count > 50 || !Number.isInteger(minutes) || minutes < 1 || minutes > 120) {
      return res.status(400).json({ message: 'Invalid aptitude practice configuration.' });
    }
    const startTime = new Date();
    const session = await AptitudeSession.create({ userId: req.user._id, mode, category, topic, difficulty, totalQuestions: count, timeLimit: minutes, durationSeconds: minutes * 60, startTime, expiresAt: new Date(startTime.getTime() + minutes * 60 * 1000) });
    const question = await generateNext(session);
    res.status(201).json({ sessionId: session._id, totalQuestions: session.totalQuestions, durationSeconds: session.durationSeconds, currentQuestion: publicQuestion(session, question, 0), config: { mode, category, topic, difficulty, numberOfQuestions: count, timeLimit: minutes } });
  } catch (error) {
    console.error('[APTITUDE] start aptitude error:', error.message);
    res.status(error.statusCode || 500).json({ message: error.statusCode ? error.message : 'Failed to start aptitude test.', code: error.code });
  }
};

exports.getQuestion = async (req, res) => {
  try {
    const session = await AptitudeSession.findOne({ _id: req.params.sessionId, userId: req.user._id });
    if (!session) return res.status(404).json({ message: 'Aptitude session not found.' });
    if (await expireIfNeeded(session)) return res.status(410).json({ message: 'Aptitude session has expired.', status: session.completionStatus });

    const requestedIndex = req.query.index !== undefined ? parseInt(req.query.index, 10) : session.currentIndex;
    const targetIndex = Number.isInteger(requestedIndex) && requestedIndex >= 0 && requestedIndex < session.totalQuestions
      ? requestedIndex
      : session.currentIndex;

    if (targetIndex >= session.totalQuestions) return res.status(409).json({ message: 'All aptitude questions are complete.' });

    while (session.questions.length <= targetIndex && session.questions.length < session.totalQuestions) {
      await generateNext(session);
    }

    const question = session.questions[targetIndex] || session.questions[0];
    const pub = publicQuestion(session, question, targetIndex);

    res.json({
      ...pub,
      selectedAnswer: question.selectedAnswer || '',
      answered: Boolean(question.answeredAt),
      currentIndex: targetIndex,
      totalQuestions: session.totalQuestions,
      questionStatuses: Array.from({ length: session.totalQuestions }, (_, i) => ({
        index: i,
        questionNumber: i + 1,
        answered: Boolean(session.questions[i]?.selectedAnswer),
        isCurrent: i === targetIndex,
      })),
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.statusCode ? error.message : 'Failed to load aptitude question.', code: error.code });
  }
};

exports.answer = async (req, res) => {
  try {
    const session = await AptitudeSession.findOne({ _id: req.params.sessionId, userId: req.user._id });
    if (!session) return res.status(404).json({ message: 'Aptitude session not found.' });
    if (await expireIfNeeded(session)) return res.status(410).json({ message: 'Time is up. Your attempt was saved.', status: session.completionStatus });

    const question = session.questions.find(q => q._id.toString() === req.body.questionId) || session.questions[session.currentIndex];
    if (!question) return res.status(404).json({ message: 'This question was not found in session.' });

    const selectedAnswer = typeof req.body.selectedAnswer === 'string' ? req.body.selectedAnswer.trim() : '';
    if (!selectedAnswer || !question.options.includes(selectedAnswer)) return res.status(400).json({ message: 'Select one of the four options.' });

    question.selectedAnswer = selectedAnswer;
    question.isCorrect = selectedAnswer === question.correctAnswer;
    question.answeredAt = new Date();

    const qIdx = session.questions.findIndex(q => q._id.toString() === question._id.toString());
    if (qIdx === session.currentIndex && session.currentIndex < session.totalQuestions - 1) {
      session.currentIndex += 1;
    }

    await session.save();

    // Do NOT reveal correct answer or explanation during the active test session
    res.json({
      success: true,
      selectedAnswer,
      questionId: question._id,
      answeredCount: session.questions.filter(q => q.selectedAnswer).length,
      totalQuestions: session.totalQuestions,
      currentIndex: session.currentIndex,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.statusCode ? error.message : 'Failed to submit aptitude answer.', code: error.code });
  }
};

exports.complete = async (req, res) => {
  try {
    const session = await AptitudeSession.findOne({ _id: req.params.sessionId, userId: req.user._id });
    if (!session) return res.status(404).json({ message: 'Aptitude session not found.' });
    if (session.completionStatus === 'in_progress') await completeSession(session, isExpired(session) ? 'expired' : 'completed');
    res.json({ sessionId: session._id, status: session.completionStatus });
  } catch {
    res.status(500).json({ message: 'Failed to save aptitude attempt.' });
  }
};

exports.result = async (req, res) => {
  try {
    const session = await AptitudeSession.findOne({ _id: req.params.sessionId, userId: req.user._id });
    if (!session) return res.status(404).json({ message: 'Aptitude session not found.' });
    if (session.completionStatus === 'in_progress' && await expireIfNeeded(session)) return res.json(buildResult(session));
    if (session.completionStatus === 'in_progress') return res.status(409).json({ message: 'Aptitude test is still in progress.' });
    res.json(buildResult(session));
  } catch {
    res.status(500).json({ message: 'Failed to load aptitude result.' });
  }
};

function buildResult(session) {
  const answered = session.questions.filter(question => question.answeredAt || question.selectedAnswer);
  const sections = CATEGORIES.map(category => {
    const questions = session.questions.filter(question => question.category === category);
    const correct = questions.filter(question => question.isCorrect).length;
    return { category, correct, total: questions.length, attempted: questions.filter(question => question.answeredAt || question.selectedAnswer).length };
  }).filter(section => section.total > 0);
  const strongest = [...sections].sort((a, b) => b.correct - a.correct)[0];
  const weakest = [...sections].sort((a, b) => a.correct - b.correct)[0];
  const topicPerformance = [...new Set(session.questions.map(question => question.topic))].map(topic => {
    const questions = session.questions.filter(question => question.topic === topic);
    return { topic, correct: questions.filter(question => question.isCorrect).length, total: questions.length };
  });

  const reviewQuestions = session.questions.map((q, idx) => ({
    questionNumber: idx + 1,
    question: q.question,
    options: q.options,
    selectedAnswer: q.selectedAnswer || 'Not Attempted',
    correctAnswer: q.correctAnswer,
    isCorrect: Boolean(q.isCorrect),
    explanation: q.explanation || 'Detailed explanation available.',
    category: q.category,
    topic: q.topic,
  }));

  return {
    sessionId: session._id, status: session.completionStatus, totalScore: session.score, totalQuestions: session.totalQuestions,
    correctAnswers: session.questions.filter(question => question.isCorrect).length,
    incorrectAnswers: session.questions.filter(question => question.selectedAnswer && !question.isCorrect).length,
    unattempted: session.totalQuestions - answered.length, accuracy: session.accuracy,
    category: session.category, topic: session.topic, difficulty: session.difficulty, numberOfQuestions: session.totalQuestions, timeLimit: session.timeLimit,
    timeTakenSeconds: Math.max(0, Math.round(((session.endTime || new Date()).getTime() - session.startTime.getTime()) / 1000)),
    sections, topicPerformance, strongest: strongest?.category || '', weakest: weakest?.category || '', feedback: session.feedback,
    reviewQuestions,
  };
}