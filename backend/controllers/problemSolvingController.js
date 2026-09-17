const mongoose = require('mongoose');
const Problem = require('../models/Problem');
const ProblemAttempt = require('../models/ProblemAttempt');
const openai = require('../services/openaiService');
const codeExecution = require('../services/codeExecutionService');
const { SEED_PROBLEMS, TOPIC_LIST } = require('../data/seedProblems');

const VALID_DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const VALID_LANGUAGES = ['java', 'python', 'cpp'];

/**
 * Ensures database is seeded with real, high-quality placement coding problems.
 * Upserts by stable slug so problems are never duplicated.
 */
let isSeeding = false;
async function ensureProblemsSeeded() {
  if (isSeeding) return;
  isSeeding = true;
  try {
    const count = await Problem.countDocuments();
    if (count !== 200) {
      console.log(`[ProblemSolving] Syncing curated DSA problems catalogue (current count: ${count})...`);
      const validSlugs = SEED_PROBLEMS.map(p => p.slug);
      await Problem.deleteMany({ slug: { $nin: validSlugs } });
      for (const p of SEED_PROBLEMS) {
        await Problem.findOneAndUpdate(
          { slug: p.slug },
          { $set: p },
          { upsert: true, new: true }
        );
      }
      console.log(`[ProblemSolving] Successfully verified 200 DSA problems in database.`);
    }
  } catch (err) {
    console.warn('[ProblemSolving] Seed check warning:', err.message);
  } finally {
    isSeeding = false;
  }
}

// Auto-seed on controller initialization
ensureProblemsSeeded();

/**
 * Strips hidden test cases and private solutions before sending to client
 */
function sanitizeProblem(problem, attempt = null) {
  return {
    problemId: problem._id,
    slug: problem.slug,
    attemptId: attempt ? attempt._id : null,
    title: problem.title,
    difficulty: problem.difficulty,
    topic: problem.topic,
    problemStatement: problem.problemStatement,
    inputFormat: problem.inputFormat,
    outputFormat: problem.outputFormat,
    constraints: problem.constraints,
    examples: problem.examples,
    starterCode: problem.starterCode,
    userCode: attempt?.code || null,
    userLanguage: attempt?.language || 'java',
    attemptStatus: attempt?.status || 'not_started',
    verdict: attempt?.verdict || null,
    testCasesPassed: attempt?.testCasesPassed || 0,
    totalTestCases: problem.testCases?.length || attempt?.totalTestCases || 0,
    hintsUsed: attempt?.hintsUsed || 0,
    hasReview: Boolean(attempt?.aiReview?.approachSummary),
    aiReview: attempt?.aiReview || null,
  };
}

/**
 * GET /api/problem-solving/topics
 * Returns the list of 20 DSA topics with problem counts & difficulty distribution
 */
exports.getTopics = async (req, res) => {
  try {
    await ensureProblemsSeeded();
    res.json({ topics: TOPIC_LIST });
  } catch (err) {
    console.error('[ProblemSolving] getTopics error:', err);
    res.status(500).json({ message: 'Failed to fetch topics.' });
  }
};

/**
 * GET /api/problem-solving/list or GET /api/problem-solving
 * Lists problems for selected topic ordered by 4 Easy, 3 Medium, 3 Hard
 */
exports.listProblems = async (req, res) => {
  try {
    await ensureProblemsSeeded();
    const { topic, difficulty, search } = req.query;
    const query = {};

    if (topic && topic !== 'All' && topic !== 'All Topics') {
      query.topic = { $regex: new RegExp(`^${topic}$`, 'i') };
    }
    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }
    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { problemStatement: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const problems = await Problem.find(query)
      .select('title slug difficulty topic problemStatement constraints examples')
      .lean();

    // Order problems strictly by difficulty: 4 Easy, 3 Medium, 3 Hard
    const diffRank = { Easy: 1, Medium: 2, Hard: 3 };
    problems.sort((a, b) => {
      const rA = diffRank[a.difficulty] || 99;
      const rB = diffRank[b.difficulty] || 99;
      if (rA !== rB) return rA - rB;
      return (a.title || '').localeCompare(b.title || '');
    });

    const problemList = problems.map(p => {
      const summary = p.problemStatement ? p.problemStatement.split('\n')[0].replace(/[`#]/g, '').slice(0, 140) : '';
      return {
        _id: p._id,
        problemId: p._id,
        slug: p.slug,
        title: p.title,
        difficulty: p.difficulty,
        topic: p.topic,
        summary,
      };
    });

    res.json({ problems: problemList });
  } catch (err) {
    console.error('[ProblemSolving] listProblems error:', err);
    res.status(500).json({ message: 'Failed to fetch problem list.' });
  }
};

/**
 * GET /api/problem-solving/recent
 * Kept only for API backward compatibility; returns empty array as Recent Problems is completely removed.
 */
exports.getRecentProblems = async (req, res) => {
  res.json({ recentProblems: [] });
};

/**
 * 1. POST /api/problem-solving/generate
 * Generates or picks a DSA problem matching requested topic and difficulty
 */
exports.generate = async (req, res) => {
  try {
    await ensureProblemsSeeded();
    const { difficulty = 'Medium', topic = null, language = 'java' } = req.body;

    const diff = VALID_DIFFICULTIES.includes(difficulty) ? difficulty : 'Medium';
    const lang = VALID_LANGUAGES.includes(language.toLowerCase()) ? language.toLowerCase() : 'java';

    // Retrieve recent problem titles for this user
    const recentAttempts = await ProblemAttempt.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title problemId')
      .lean();

    const attemptedIds = recentAttempts.map(a => a.problemId);

    // Check if an unattempted curated problem matches topic & difficulty
    const topicQuery = topic ? { topic: { $regex: new RegExp(`^${topic}$`, 'i') } } : {};
    let problem = await Problem.findOne({
      ...topicQuery,
      difficulty: diff,
      _id: { $nin: attemptedIds },
    });

    // If all are attempted, pick any matching topic
    if (!problem && topic) {
      problem = await Problem.findOne({
        topic: { $regex: new RegExp(`^${topic}$`, 'i') },
      });
    }

    // If still no problem, pick any unattempted problem
    if (!problem) {
      problem = await Problem.findOne({ _id: { $nin: attemptedIds } });
    }

    // Fallback to any problem
    if (!problem) {
      problem = await Problem.findOne();
    }

    if (!problem) {
      return res.status(404).json({ message: 'No problem available.' });
    }

    // Create initial attempt tracking record
    const initialCode = problem.starterCode?.[lang] || problem.starterCode?.java || '';
    const attempt = await ProblemAttempt.create({
      userId: req.user._id,
      problemId: problem._id,
      title: problem.title,
      difficulty: problem.difficulty,
      topic: problem.topic,
      language: lang,
      problemSnapshot: {
        title: problem.title,
        difficulty: problem.difficulty,
        topic: problem.topic,
        problemStatement: problem.problemStatement,
        inputFormat: problem.inputFormat,
        outputFormat: problem.outputFormat,
        constraints: problem.constraints,
        examples: problem.examples,
      },
      code: initialCode,
      status: 'in_progress',
      totalTestCases: problem.testCases?.length || 0,
    });

    res.status(201).json(sanitizeProblem(problem, attempt));
  } catch (error) {
    console.error('[ProblemSolving] Generate error:', error);
    res.status(500).json({ message: 'Unable to load problem at this time. Please try again.' });
  }
};

/**
 * Helper to look up problem by MongoDB _id or slug
 */
async function findProblemByIdOrSlug(idOrSlug) {
  if (!idOrSlug) return null;
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    const p = await Problem.findById(idOrSlug);
    if (p) return p;
  }
  return await Problem.findOne({ slug: idOrSlug });
}

/**
 * 2. GET /api/problem-solving/:problemId
 * Fetches problem details for coding workspace
 */
exports.getProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    const problem = await findProblemByIdOrSlug(problemId);

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found.' });
    }

    const latestAttempt = await ProblemAttempt.findOne({
      userId: req.user._id,
      problemId: problem._id,
    }).sort({ updatedAt: -1 });

    res.json(sanitizeProblem(problem, latestAttempt));
  } catch (error) {
    console.error('[ProblemSolving] GetProblem error:', error);
    res.status(500).json({ message: 'Failed to load problem.' });
  }
};

/**
 * 3. POST /api/problem-solving/:problemId/run
 * Runs candidate code against public/sample test cases or custom input
 */
exports.runCode = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { code, language = 'java', customInput } = req.body;

    const problem = await findProblemByIdOrSlug(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found.' });
    }

    if (!code || !code.trim()) {
      return res.status(400).json({ message: 'Code cannot be empty.' });
    }

    const lang = VALID_LANGUAGES.includes(language.toLowerCase()) ? language.toLowerCase() : 'java';

    // If custom input is provided, run single execution
    if (typeof customInput === 'string' && customInput.trim()) {
      const execResult = await codeExecution.executeSingle({
        language: lang,
        sourceCode: code,
        stdin: customInput,
      });

      return res.json({
        success: true,
        isCustom: true,
        result: {
          input: customInput,
          actualOutput: execResult.stdout,
          expectedOutput: null,
          passed: !execResult.isError,
          status: execResult.status,
          time: execResult.time,
          error: execResult.stderr || null,
        },
      });
    }

    // Otherwise execute against sample examples via sandbox
    const runResult = await codeExecution.runSampleCases({
      language: lang,
      sourceCode: code,
      examples: problem.examples,
    });

    // Save candidate's latest working code in attempt record
    await ProblemAttempt.findOneAndUpdate(
      { userId: req.user._id, problemId: problem._id },
      { $set: { code, language: lang } },
      { sort: { updatedAt: -1 }, upsert: false }
    );

    res.json(runResult);
  } catch (error) {
    console.error('[ProblemSolving] RunCode error:', error);
    res.status(500).json({ message: error.message || 'Code execution failed.' });
  }
};

/**
 * 4. POST /api/problem-solving/:problemId/submit
 * Evaluates candidate code against hidden test cases and updates attempt status
 */
exports.submitCode = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { code, language = 'java' } = req.body;

    const problem = await findProblemByIdOrSlug(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found.' });
    }

    if (!code || !code.trim()) {
      return res.status(400).json({ message: 'Code cannot be empty.' });
    }

    const lang = VALID_LANGUAGES.includes(language.toLowerCase()) ? language.toLowerCase() : 'java';

    // Execute against hidden evaluation test cases
    const submissionResult = await codeExecution.evaluateSubmission({
      language: lang,
      sourceCode: code,
      testCases: problem.testCases,
    });

    const isAccepted = submissionResult.verdict === 'Accepted';
    const status = isAccepted ? 'accepted' :
      submissionResult.verdict === 'Compilation Error' ? 'compilation_error' :
      submissionResult.verdict === 'Time Limit Exceeded' ? 'time_limit_exceeded' :
      submissionResult.verdict === 'Runtime Error' ? 'runtime_error' : 'wrong_answer';

    // Update attempt record in MongoDB
    const attempt = await ProblemAttempt.findOneAndUpdate(
      { userId: req.user._id, problemId: problem._id },
      {
        $set: {
          code,
          language: lang,
          status,
          verdict: submissionResult.verdict,
          testCasesPassed: submissionResult.passedCount,
          totalTestCases: submissionResult.totalCount,
          submittedAt: new Date(),
        },
      },
      { new: true, sort: { updatedAt: -1 } }
    );

    // Return verdict & statistics WITHOUT revealing hidden expected outputs
    res.json({
      verdict: submissionResult.verdict,
      isAccepted,
      status,
      passedCount: submissionResult.passedCount,
      totalCount: submissionResult.totalCount,
      failedTestCase: submissionResult.failedTestCase ? {
        index: submissionResult.failedTestCase.index,
        input: submissionResult.failedTestCase.input,
        actualOutput: submissionResult.failedTestCase.actualOutput,
        error: submissionResult.failedTestCase.error,
        status: submissionResult.failedTestCase.status,
      } : null,
      runtime: submissionResult.runtime,
      memory: submissionResult.memory,
      testCasesPassed: submissionResult.passedCount,
      totalTestCases: submissionResult.totalCount,
    });
  } catch (error) {
    console.error('[ProblemSolving] SubmitCode error:', error);
    res.status(500).json({ message: error.message || 'Submission failed.' });
  }
};

/**
 * 5. POST /api/problem-solving/:problemId/hint
 * Progressive hint generation using AI (Hint 1, 2, 3)
 */
exports.getHint = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { code = '', language = 'java' } = req.body;

    const problem = await findProblemByIdOrSlug(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found.' });
    }

    let attempt = await ProblemAttempt.findOne({
      userId: req.user._id,
      problemId: problem._id,
    }).sort({ updatedAt: -1 });

    const currentHintLevel = Math.min(3, ((attempt?.hintsUsed || 0) + 1));

    const hint = await openai.generateDsaHint({
      problem,
      hintLevel: currentHintLevel,
      currentCode: code || attempt?.code || '',
      language,
    });

    if (attempt) {
      attempt.hintsUsed = currentHintLevel;
      await attempt.save();
    }

    res.json({
      ...hint,
      hintsUsed: currentHintLevel,
      remainingHints: Math.max(0, 3 - currentHintLevel),
    });
  } catch (error) {
    console.error('[ProblemSolving] GetHint error:', error);
    res.status(500).json({ message: 'Unable to retrieve hint.' });
  }
};

/**
 * 6. POST /api/problem-solving/:problemId/review
 * In-depth AI review of candidate code
 */
exports.getReview = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { code, language = 'java' } = req.body;

    const problem = await findProblemByIdOrSlug(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found.' });
    }

    let attempt = await ProblemAttempt.findOne({
      userId: req.user._id,
      problemId: problem._id,
    }).sort({ updatedAt: -1 });

    const reviewCode = code || attempt?.code;
    if (!reviewCode) {
      return res.status(400).json({ message: 'Please write or submit code to receive a review.' });
    }

    const aiReview = await openai.generateDsaCodeReview({
      problem,
      code: reviewCode,
      language: language || attempt?.language || 'java',
      verdict: attempt?.verdict || 'In Progress',
    });

    if (attempt) {
      attempt.aiReview = aiReview;
      await attempt.save();
    }

    res.json({ review: aiReview });
  } catch (error) {
    console.error('[ProblemSolving] GetReview error:', error);
    res.status(500).json({ message: 'Unable to generate code review.' });
  }
};

/**
 * 7. GET /api/problem-solving/:problemId/solution
 * Optimal solution unlock endpoint
 */
exports.getSolution = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { confirmed } = req.query;

    const problem = await findProblemByIdOrSlug(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found.' });
    }

    const attempt = await ProblemAttempt.findOne({
      userId: req.user._id,
      problemId: problem._id,
    }).sort({ updatedAt: -1 });

    const hasSubmitted = attempt && attempt.status !== 'in_progress';

    if (!hasSubmitted && confirmed !== 'true') {
      return res.status(403).json({
        message: 'Solution is locked. Submit an attempt or confirm to view the solution.',
        requiresConfirmation: true,
      });
    }

    res.json({
      approach: problem.solution?.approach || 'Optimal algorithmic solution.',
      timeComplexity: problem.solution?.timeComplexity || 'O(n)',
      spaceComplexity: problem.solution?.spaceComplexity || 'O(1)',
      starterCode: problem.starterCode,
      code: {
        java: problem.solution?.java || '',
        python: problem.solution?.python || '',
        cpp: problem.solution?.cpp || '',
      },
    });
  } catch (error) {
    console.error('[ProblemSolving] GetSolution error:', error);
    res.status(500).json({ message: 'Unable to retrieve solution.' });
  }
};

/**
 * 8. GET /api/problem-solving/stats
 * Real database statistics for authenticated user
 */
exports.getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get unique accepted problem IDs
    const acceptedAttempts = await ProblemAttempt.find({
      userId,
      status: 'accepted',
    }).select('problemId difficulty createdAt');

    const uniqueSolvedMap = new Map();
    acceptedAttempts.forEach(att => {
      uniqueSolvedMap.set(String(att.problemId), att);
    });

    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;

    uniqueSolvedMap.forEach(att => {
      if (att.difficulty === 'Easy') easySolved++;
      else if (att.difficulty === 'Medium') mediumSolved++;
      else if (att.difficulty === 'Hard') hardSolved++;
    });

    const totalSolved = uniqueSolvedMap.size;

    // Calculate streak based on activity dates
    const allAttempts = await ProblemAttempt.find({ userId })
      .sort({ createdAt: -1 })
      .select('createdAt')
      .lean();

    let streak = 0;
    if (allAttempts.length > 0) {
      const dates = new Set(
        allAttempts.map(a => new Date(a.createdAt).toISOString().split('T')[0])
      );
      const today = new Date();
      let checkDate = new Date(today);

      while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (dates.has(dateStr)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          // If today hasn't had an attempt yet, check if yesterday had one
          if (streak === 0) {
            checkDate.setDate(checkDate.getDate() - 1);
            const yestStr = checkDate.toISOString().split('T')[0];
            if (dates.has(yestStr)) {
              streak++;
              checkDate.setDate(checkDate.getDate() - 1);
              continue;
            }
          }
          break;
        }
      }
    }

    const recentAttempts = await ProblemAttempt.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(6)
      .select('problemId title difficulty topic language status testCasesPassed totalTestCases verdict updatedAt createdAt')
      .lean();

    res.json({
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      streak,
      totalAttempts: allAttempts.length,
      recentAttempts,
    });
  } catch (error) {
    console.error('[ProblemSolving] GetStats error:', error);
    res.status(500).json({ message: 'Unable to retrieve statistics.' });
  }
};

/**
 * 9. GET /api/problem-solving/history
 * Detailed problem-solving history
 */
exports.getHistory = async (req, res) => {
  try {
    const attempts = await ProblemAttempt.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .limit(50)
      .lean();

    res.json({ attempts });
  } catch (error) {
    console.error('[ProblemSolving] GetHistory error:', error);
    res.status(500).json({ message: 'Unable to retrieve history.' });
  }
};
