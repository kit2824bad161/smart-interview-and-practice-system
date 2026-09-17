const router = require('express').Router();
const { protect } = require('../middleware/auth');
const controller = require('../controllers/technicalPracticeController');

router.use(protect);
router.post('/start', controller.start);
router.get('/:sessionId', controller.getSession);
router.post('/:sessionId/complete', controller.complete);
router.get('/:sessionId/result', controller.result);

module.exports = router;