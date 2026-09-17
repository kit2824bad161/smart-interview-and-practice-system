const TechnicalPracticeSession = require('../models/TechnicalPracticeSession');
const openai = require('../services/openaiService');

const TOPICS = {
  'Programming Fundamentals': ['Variables and Data Types', 'Operators', 'Conditional Statements', 'Loops', 'Functions', 'Arrays', 'Strings', 'Recursion', 'Basic Debugging'],
  'Data Structures & Algorithms': ['Arrays', 'Linked Lists', 'Stack', 'Queue', 'Hashing', 'Trees', 'Graphs', 'Searching', 'Sorting', 'Recursion', 'Time Complexity', 'Space Complexity'],
  'Object-Oriented Programming': ['Class and Object', 'Encapsulation', 'Inheritance', 'Polymorphism', 'Abstraction', 'Constructors', 'Method Overloading', 'Method Overriding'],
  'DBMS & SQL': ['Primary Key', 'Foreign Key', 'Candidate Key', 'Normalization', 'SQL Queries', 'SELECT', 'WHERE', 'GROUP BY', 'ORDER BY', 'JOIN', 'Subqueries', 'Transactions', 'ACID Properties', 'Indexing'],
  'Operating Systems': ['Process', 'Thread', 'Process Scheduling', 'CPU Scheduling', 'Deadlock', 'Memory Management', 'Virtual Memory', 'Paging', 'File Systems'],
  'Computer Networks': ['OSI Model', 'TCP/IP', 'HTTP', 'HTTPS', 'TCP', 'UDP', 'IP Address', 'DNS', 'Routing', 'Network Security Basics'],
  'Web Development': ['HTML', 'CSS', 'JavaScript', 'DOM', 'React', 'REST API', 'HTTP Methods', 'JSON', 'Frontend vs Backend', 'Authentication'],
  Python: ['Python Syntax', 'Lists', 'Tuples', 'Sets', 'Dictionaries', 'Functions', 'Lambda', 'OOP', 'Exception Handling', 'Modules', 'NumPy Basics', 'Pandas Basics'],
  Java: ['Java Basics', 'OOP', 'Classes and Objects', 'Inheritance', 'Interfaces', 'Collections', 'Exception Handling', 'Multithreading', 'JDBC'],
  'C++': ['C++ Basics', 'Functions', 'Arrays', 'Pointers', 'References', 'OOP', 'STL', 'Vector', 'Stack', 'Queue', 'Map', 'Set', 'Exception Handling'],
  'AI & Machine Learning': ['AI Fundamentals', 'Machine Learning Fundamentals', 'Supervised Learning', 'Unsupervised Learning', 'Regression', 'Classification', 'Clustering', 'Overfitting', 'Underfitting', 'Bias and Variance', 'Model Evaluation', 'Neural Networks'],
};
const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Mixed'];
const COUNTS = [10, 20, 30];

function publicQuestion(question) { return { questionId: question._id, topic: question.topic, difficulty: question.difficulty, question: question.question, options: question.options }; }

function buildResult(session) {
  const correctAnswers = session.questions.filter(question => question.isCorrect).length;
  return { sessionId: session._id, topic: session.topic, difficulty: session.difficulty, totalQuestions: session.totalQuestions, score: session.score, accuracy: session.accuracy, correctAnswers, wrongAnswers: session.totalQuestions - correctAnswers, questions: session.questions.map(question => ({ ...question.toObject(), questionId: question._id })) };
}

exports.start = async (req, res) => {
  try {
    const { topic, difficulty = 'Mixed', numberOfQuestions = 10 } = req.body;
    const count = Number(numberOfQuestions);
    if (!TOPICS[topic] || !DIFFICULTIES.includes(difficulty) || !COUNTS.includes(count)) return res.status(400).json({ message: 'Invalid technical practice configuration.' });
    const questions = await openai.generateTechnicalMcqs({ category: topic, topics: TOPICS[topic], difficulty, count });
    const session = await TechnicalPracticeSession.create({ userId: req.user._id, topic, difficulty, totalQuestions: count, questions });
    res.status(201).json({ sessionId: session._id, topic, difficulty, totalQuestions: count, questions: questions.map(publicQuestion) });
  } catch (error) {
    console.error('technical practice start error:', error.message);
    res.status(error.statusCode || 500).json({ message: error.statusCode ? error.message : 'Unable to generate technical questions right now.' });
  }
};

exports.getSession = async (req, res) => {
  try {
    const session = await TechnicalPracticeSession.findOne({ _id: req.params.sessionId, userId: req.user._id });
    if (!session) return res.status(404).json({ message: 'Technical practice session not found.' });
    if (session.status === 'completed') return res.json({ status: session.status, result: buildResult(session) });
    res.json({ sessionId: session._id, topic: session.topic, difficulty: session.difficulty, totalQuestions: session.totalQuestions, questions: session.questions.map(publicQuestion) });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Technical practice session not found.' });
    }
    console.error('getSession error:', error);
    res.status(500).json({ message: 'Error retrieving session.' });
  }
};

exports.complete = async (req, res) => {
  try {
    const session = await TechnicalPracticeSession.findOne({ _id: req.params.sessionId, userId: req.user._id });
    if (!session) return res.status(404).json({ message: 'Technical practice session not found.' });
    if (session.status === 'completed') return res.json(buildResult(session));
    const answers = Array.isArray(req.body.answers) ? req.body.answers : [];
    if (answers.length !== session.totalQuestions) return res.status(400).json({ message: 'Answer every question before submitting.' });
    const answerMap = new Map(answers.map(item => [String(item.questionId), item.selectedAnswer]));
    session.questions.forEach(question => { const selectedAnswer = answerMap.get(String(question._id)); if (!question.options.includes(selectedAnswer)) return; question.selectedAnswer = selectedAnswer; question.isCorrect = selectedAnswer === question.correctAnswer; });
    if (session.questions.some(question => !question.selectedAnswer)) return res.status(400).json({ message: 'Choose an option for every question.' });
    session.score = session.questions.filter(question => question.isCorrect).length;
    session.accuracy = Math.round((session.score / session.totalQuestions) * 100);
    session.status = 'completed'; session.completedAt = new Date();
    await session.save();
    res.json(buildResult(session));
  } catch { res.status(500).json({ message: 'Unable to save your practice result.' }); }
};

exports.result = async (req, res) => {
  try {
    const session = await TechnicalPracticeSession.findOne({ _id: req.params.sessionId, userId: req.user._id });
    if (!session) return res.status(404).json({ message: 'Technical practice result not found.' });
    if (session.status !== 'completed') return res.status(409).json({ message: 'This practice is still in progress.' });
    res.json(buildResult(session));
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Technical practice result not found.' });
    }
    console.error('result error:', error);
    res.status(500).json({ message: 'Error retrieving result.' });
  }
};