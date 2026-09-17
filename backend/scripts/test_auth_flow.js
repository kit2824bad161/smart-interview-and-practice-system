const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');

async function testAuthFlow() {
  console.log('=== STARTING END-TO-END AUTHENTICATION TEST ===');
  const baseUrl = 'http://localhost:5000/api';
  const testEmail = `test_deploy_${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  const testName = 'Deploy Test User';

  // 1. Test Registration
  console.log('\n1. Testing POST /api/auth/register...');
  const regRes = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: testName, email: testEmail, password: testPassword }),
  });
  const regData = await regRes.json();
  console.log('Registration Status:', regRes.status);
  if (regRes.status !== 201 && regRes.status !== 200) {
    throw new Error(`Registration failed: ${JSON.stringify(regData)}`);
  }
  const token = regData.token;
  console.log('Token received:', Boolean(token));

  // 2. Test Login
  console.log('\n2. Testing POST /api/auth/login...');
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: testPassword }),
  });
  const loginData = await loginRes.json();
  console.log('Login Status:', loginRes.status);
  if (loginRes.status !== 200 || !loginData.token) {
    throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
  }
  console.log('Login Token verified:', Boolean(loginData.token));

  // 3. Test Protected Route with Valid Token
  console.log('\n3. Testing GET /api/auth/profile with Bearer Token...');
  const profileRes = await fetch(`${baseUrl}/auth/profile`, {
    headers: { Authorization: `Bearer ${loginData.token}` },
  });
  const profileData = await profileRes.json();
  console.log('Profile Status:', profileRes.status);
  console.log('User name in profile:', profileData.user?.name);
  if (profileRes.status !== 200 || profileData.user?.email !== testEmail) {
    throw new Error(`Profile fetch failed: ${JSON.stringify(profileData)}`);
  }

  // 4. Test Protected Route without Token (Unauthorized Check)
  console.log('\n4. Testing GET /api/auth/profile without Token...');
  const unauthRes = await fetch(`${baseUrl}/auth/profile`);
  console.log('Unauthorized Status:', unauthRes.status);
  if (unauthRes.status !== 401) {
    throw new Error(`Expected 401 Unauthorized, got: ${unauthRes.status}`);
  }

  // 5. Test Protected Route with Invalid Token
  console.log('\n5. Testing GET /api/auth/profile with Invalid Token...');
  const invalidRes = await fetch(`${baseUrl}/auth/profile`, {
    headers: { Authorization: 'Bearer invalid_token_12345' },
  });
  console.log('Invalid Token Status:', invalidRes.status);
  if (invalidRes.status !== 401) {
    throw new Error(`Expected 401 Unauthorized, got: ${invalidRes.status}`);
  }

  // Clean up
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteOne({ email: testEmail });
  await mongoose.disconnect();
  console.log('\nCleaned up test user record.');
  console.log('=== AUTHENTICATION TEST PASSED COMPLETELY ===');
}

testAuthFlow().catch(err => {
  console.error('Auth test failed:', err);
  process.exit(1);
});
