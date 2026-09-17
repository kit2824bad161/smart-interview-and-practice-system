const router = require('express').Router();
const multer = require('multer');
const { protect } = require('../middleware/auth');
const {
  startAssessment,
  getCurrentAssessment,
  getCurrentAptitudeSession,
  startAptitudeRound,
  saveAptitudeProgress,
  submitAptitudeRound,
  getAptitudeResult,
  getCurrentTechnicalSession,
  startTechnicalRound,
  saveTechnicalProgress,
  submitTechnicalRound,
  getTechnicalResult,
  restartAssessmentRound,
  startAiInterview,
  getInterviewSession,
  submitInterviewAnswer,
  completeAiInterview,
  getAssessmentResult,
} = require('../controllers/hiringAssessmentController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith('audio/') || file.mimetype === 'video/webm' || file.mimetype === 'application/octet-stream') {
      callback(null, true);
    } else {
      callback(null, true); // Allow audio fallback
    }
  },
});

router.use(protect);

// Overall assessment management
router.post('/start', startAssessment);
router.get('/current', getCurrentAssessment);

// Security Restart Endpoints
router.post('/aptitude/restart', (req, res, next) => {
  req.params.round = 'aptitude';
  return restartAssessmentRound(req, res, next);
});
router.post('/technical/restart', (req, res, next) => {
  req.params.round = 'technical';
  return restartAssessmentRound(req, res, next);
});
router.post('/:round/restart', restartAssessmentRound);

// Round 1: Aptitude Test
router.get('/aptitude/current', getCurrentAptitudeSession);
router.post('/aptitude/start', startAptitudeRound);
router.post('/aptitude/save-progress', saveAptitudeProgress);
router.post('/aptitude/submit', submitAptitudeRound);
router.get('/aptitude/result', getAptitudeResult);

// Round 2: Technical MCQ Test
router.get('/technical/current', getCurrentTechnicalSession);
router.post('/technical/start', startTechnicalRound);
router.post('/technical/save-progress', saveTechnicalProgress);
router.post('/technical/submit', submitTechnicalRound);
router.get('/technical/result', getTechnicalResult);

// Round 3: One-on-One AI Interview
router.post('/interview/start', startAiInterview);
router.get('/interview/:interviewId', getInterviewSession);
router.post('/interview/:interviewId/answer', upload.single('audio'), submitInterviewAnswer);
router.post('/interview/answer', upload.single('audio'), submitInterviewAnswer);
router.post('/interview/:interviewId/complete', completeAiInterview);
router.post('/interview/complete', completeAiInterview);

// Final Consolidated Result
router.get('/result', getAssessmentResult);

module.exports = router;
