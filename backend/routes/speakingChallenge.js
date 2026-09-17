const router = require('express').Router();
const multer = require('multer');
const { protect } = require('../middleware/auth');
const { startSpeakingChallenge, submitSpeakingChallenge, getSpeakingChallengeResult } = require('../controllers/speakingChallengeController');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 }, fileFilter: (req, file, callback) => {
  if (!file.mimetype.startsWith('audio/')) return callback(new Error('Only audio recordings are supported.'));
  callback(null, true);
} });

router.use(protect);
router.post('/start', startSpeakingChallenge);
router.post('/:challengeId/submit', upload.single('audio'), submitSpeakingChallenge);
router.get('/:challengeId/result', getSpeakingChallengeResult);
module.exports = router;
