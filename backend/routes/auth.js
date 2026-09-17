const router = require('express').Router();
const {
  register,
  login,
  getProfile,
  forgotPassword,
  resetPassword,
  googleAuth,
  googleCallback,
  githubAuth,
  githubCallback,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Local Authentication
router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);

// Password Reset Flow
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Google OAuth Flow
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

// GitHub OAuth Flow
router.get('/github', githubAuth);
router.get('/github/callback', githubCallback);

module.exports = router;
