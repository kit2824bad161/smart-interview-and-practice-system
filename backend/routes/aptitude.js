const router = require('express').Router();
const { protect } = require('../middleware/auth');
const controller = require('../controllers/aptitudeController');

router.use(protect);
router.post('/start', controller.start);
router.get('/:sessionId/question', controller.getQuestion);
router.post('/:sessionId/answer', controller.answer);
router.post('/:sessionId/complete', controller.complete);
router.get('/:sessionId/result', controller.result);

module.exports = router;