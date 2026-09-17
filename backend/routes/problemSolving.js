const router = require('express').Router();
const { protect } = require('../middleware/auth');
const controller = require('../controllers/problemSolvingController');

router.use(protect);

// Problem Catalog & Topics routes
router.get('/topics', controller.getTopics);
router.get('/', controller.listProblems);
router.get('/list', controller.listProblems);
router.get('/recent', controller.getRecentProblems);

// Generation & Overview routes
router.post('/generate', controller.generate);
router.get('/stats', controller.getStats);
router.get('/history', controller.getHistory);

// Specific problem workspace routes
router.get('/:problemId', controller.getProblem);
router.post('/:problemId/run', controller.runCode);
router.post('/:problemId/submit', controller.submitCode);
router.post('/:problemId/hint', controller.getHint);
router.post('/:problemId/review', controller.getReview);
router.get('/:problemId/solution', controller.getSolution);

module.exports = router;
