require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const HiringAssessment = require('../models/HiringAssessment');

async function testFullscreenSecurity() {
  try {
    console.log('--- Connecting to MongoDB ---');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');

    const user = await User.findOne();
    if (!user) {
      console.error('No user found to test with.');
      process.exit(1);
    }
    console.log(`Using test user: ${user.name} (${user._id})`);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const baseURL = 'http://127.0.0.1:5000/api/assessment';

    console.log('\n--- 1. Testing GET /api/assessment/aptitude/current ---');
    let res = await fetch(`${baseURL}/aptitude/current`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    let data = await res.json();
    console.log('Aptitude current status:', res.status, 'Session active:', !!data.session);

    console.log('\n--- 2. Saving progress to /api/assessment/aptitude/save-progress ---');
    res = await fetch(`${baseURL}/aptitude/save-progress`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        responses: [
          { questionNumber: 1, selectedAnswer: 'Option A' },
          { questionNumber: 2, selectedAnswer: 'Option B' }
        ]
      })
    });
    console.log('Progress save status:', res.status);

    console.log('\n--- 3. Testing POST /api/assessment/aptitude/restart (Fullscreen Exit) ---');
    res = await fetch(`${baseURL}/aptitude/restart`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'FULLSCREEN_EXIT' })
    });
    const aptRestartData = await res.json();
    console.log('Aptitude Restart response status:', res.status);
    console.log('Aptitude Attempt version:', aptRestartData.session?.attemptVersion);
    console.log('Aptitude Fullscreen violation count:', aptRestartData.session?.fullscreenViolationCount);
    console.log('Aptitude Remaining seconds:', aptRestartData.session?.remainingSeconds);

    let assessment = await HiringAssessment.findOne({ user: user._id, status: 'IN_PROGRESS' });
    let answeredAptCount = assessment.aptitude.questions.filter(q => q.selectedAnswer).length;
    console.log('Answered questions in DB after restart:', answeredAptCount, '(Expected: 0)');

    if (
      aptRestartData.session?.fullscreenViolationCount >= 1 &&
      answeredAptCount === 0 &&
      aptRestartData.session?.remainingSeconds > 1400
    ) {
      console.log('>>> PASS: Aptitude Fullscreen restart verified! <<<');
    } else {
      console.error('>>> FAIL: Aptitude Fullscreen restart failed! <<<');
      process.exit(1);
    }

    console.log('\n--- 4. Setting Aptitude to PASSED to test Technical Round Fullscreen Security ---');
    assessment.aptitude.status = 'PASSED';
    assessment.aptitude.score = 18;
    assessment.technical.status = 'IN_PROGRESS';
    assessment.technical.startedAt = new Date();
    assessment.technical.expiresAt = new Date(Date.now() + 25 * 60 * 1000);
    // If no questions in technical, copy dummy questions
    if (!assessment.technical.questions || assessment.technical.questions.length === 0) {
      assessment.technical.questions = assessment.aptitude.questions.slice(0, 20).map((q, idx) => ({
        questionNumber: idx + 1,
        question: `Technical question ${idx + 1}?`,
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 'A',
        explanation: 'Correct explanation',
        topic: 'Engineering',
        difficulty: 'Medium'
      }));
    }
    // Set an answer on question 1
    assessment.technical.questions[0].selectedAnswer = 'A';
    await assessment.save();

    console.log('\n--- 5. Testing GET /api/assessment/technical/current ---');
    res = await fetch(`${baseURL}/technical/current`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    data = await res.json();
    console.log('Technical current status:', res.status, 'Session active:', !!data.session);
    console.log('Saved answers before restart:', data.session?.savedAnswers);

    console.log('\n--- 6. Testing POST /api/assessment/technical/restart (Fullscreen Exit) ---');
    res = await fetch(`${baseURL}/technical/restart`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'FULLSCREEN_EXIT' })
    });
    const techRestartData = await res.json();
    console.log('Technical Restart status:', res.status);
    console.log('Technical Attempt version:', techRestartData.session?.attemptVersion);
    console.log('Technical Violation count:', techRestartData.session?.fullscreenViolationCount);
    console.log('Technical Remaining seconds:', techRestartData.session?.remainingSeconds);

    assessment = await HiringAssessment.findOne({ user: user._id, status: 'IN_PROGRESS' });
    let answeredTechCount = assessment.technical.questions.filter(q => q.selectedAnswer).length;
    console.log('Answered technical questions in DB after restart:', answeredTechCount, '(Expected: 0)');
    console.log('Technical violations in DB:', assessment.technical.fullscreenViolations);

    if (
      techRestartData.session?.fullscreenViolationCount >= 1 &&
      answeredTechCount === 0 &&
      techRestartData.session?.remainingSeconds > 1400
    ) {
      console.log('>>> PASS: Technical Fullscreen restart verified! <<<');
    } else {
      console.error('>>> FAIL: Technical Fullscreen restart failed! <<<');
      process.exit(1);
    }

    console.log('\n=============================================');
    console.log('ALL FULLSCREEN SECURITY BACKEND TESTS PASSED!');
    console.log('=============================================');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Test execution failed:', err);
    process.exit(1);
  }
}

testFullscreenSecurity();
