const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  startInterview,
  submitAnswer,
  getNextQuestion,
  completeInterview,
  getInterview,
  getMyInterviews,
  getFeedback,
  getAllInterviews,
} = require('../controllers/interviewController');

router.use(protect);

router.post('/start',              startInterview);
router.get('/',                    getMyInterviews);
router.get('/:id',                 getInterview);
router.post('/:id/answer',         submitAnswer);
router.post('/:id/next-question',  getNextQuestion);
router.post('/:id/complete',       completeInterview);
router.get('/:id/feedback',        getFeedback);

// Admin
router.get('/admin/all', adminOnly, getAllInterviews);

module.exports = router;
