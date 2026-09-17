const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');

async function testCoreRoutes() {
  console.log('=== VERIFYING CORE APPLICATION API ROUTES ===\n');
  await mongoose.connect(process.env.MONGO_URI);
  let user = await User.findOne({ role: 'candidate' });
  if (!user) {
    user = await User.create({
      name: 'Route Verification User',
      email: `route_verify_${Date.now()}@example.com`,
      password: 'Password123!',
      role: 'candidate',
    });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const headers = { Authorization: `Bearer ${token}` };
  const baseUrl = 'http://localhost:5000/api';

  const routesToTest = [
    { name: 'Root Health Check (GET /health)', url: 'http://localhost:5000/health', noAuth: true },
    { name: 'API Health Check (GET /api/health)', url: `${baseUrl}/health`, noAuth: true },
    { name: 'Auth Profile (GET /api/auth/profile)', url: `${baseUrl}/auth/profile` },
    { name: 'Assessment Current (GET /api/assessment/current)', url: `${baseUrl}/assessment/current` },
    { name: 'Assessment Aptitude Current (GET /api/assessment/aptitude/current)', url: `${baseUrl}/assessment/aptitude/current` },
    { name: 'Assessment Technical Current (GET /api/assessment/technical/current)', url: `${baseUrl}/assessment/technical/current` },
    { name: 'Assessment Consolidated Result (GET /api/assessment/result)', url: `${baseUrl}/assessment/result` },
    { name: 'Candidate Interview History (GET /api/interviews)', url: `${baseUrl}/interviews` },
    { name: 'Problem Solving Topics (GET /api/problem-solving/topics)', url: `${baseUrl}/problem-solving/topics` },
    { name: 'Problem Solving Problem List (GET /api/problem-solving/list?topic=Arrays)', url: `${baseUrl}/problem-solving/list?topic=Arrays` },
    { name: 'Problem Solving Stats (GET /api/problem-solving/stats)', url: `${baseUrl}/problem-solving/stats` },
    { name: 'Problem Solving History (GET /api/problem-solving/history)', url: `${baseUrl}/problem-solving/history` },
  ];

  let passed = 0;
  let failed = 0;

  for (const r of routesToTest) {
    try {
      const res = await fetch(r.url, {
        headers: r.noAuth ? {} : headers,
      });
      const ok = res.status >= 200 && res.status < 400;
      if (ok) {
        passed++;
        console.log(`[PASS] [${res.status}] ${r.name}`);
      } else {
        failed++;
        console.error(`[FAIL] [${res.status}] ${r.name}`);
      }
    } catch (err) {
      failed++;
      console.error(`[ERROR] ${r.name}:`, err.message);
    }
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed.`);
  await mongoose.disconnect();

  if (failed > 0) {
    process.exit(1);
  }
}

testCoreRoutes().catch(err => {
  console.error('Route test error:', err);
  process.exit(1);
});
