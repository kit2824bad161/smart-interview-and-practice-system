const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

async function testProblemSolving() {
  await mongoose.connect(process.env.MONGO_URI);
  const User = require('../models/User');
  const Problem = require('../models/Problem');

  const user = await User.findOne();
  if (!user) throw new Error('No user found');
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  const twoSum = await Problem.findOne({ title: 'Two Sum' });
  console.log('Testing Problem:', twoSum?.title, twoSum?._id);

  if (!twoSum) throw new Error('Two Sum not found');

  // 1. Run Sample Cases
  console.log('\n--- 1. Testing Run Code (Java Sample Cases) ---');
  const runRes = await fetch(`http://localhost:5000/api/problem-solving/${twoSum._id}/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ code: twoSum.starterCode.java, language: 'java' })
  });
  const runData = await runRes.json();
  console.log('Run Status:', runRes.status);
  console.log('Success:', runData.success, 'All Passed:', runData.allPassed);
  if (runData.results?.length) {
    console.log('Case 1 Status:', runData.results[0].status, '| Output:', runData.results[0].actualOutput, '| Expected:', runData.results[0].expectedOutput);
  }

  // 2. Custom Input
  console.log('\n--- 2. Testing Custom Input Execution ---');
  const customRes = await fetch(`http://localhost:5000/api/problem-solving/${twoSum._id}/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ code: twoSum.starterCode.java, language: 'java', customInput: '3 10\n2 5 8' })
  });
  const customData = await customRes.json();
  console.log('Custom Input Status:', customRes.status, 'IsCustom:', customData.isCustom);
  console.log('Custom Output:', customData.result?.actualOutput);

  // 3. Submit Code
  console.log('\n--- 3. Testing Submit Code (Java Hidden Test Cases) ---');
  const submitRes = await fetch(`http://localhost:5000/api/problem-solving/${twoSum._id}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ code: twoSum.starterCode.java, language: 'java' })
  });
  const submitData = await submitRes.json();
  console.log('Submit Status:', submitRes.status);
  console.log('Verdict:', submitData.verdict, 'Passed:', submitData.passedCount, '/', submitData.totalCount);
  console.log('Case summaries count:', submitData.caseSummaries?.length);

  // 4. Test Python Run
  console.log('\n--- 4. Testing Python Sample Cases ---');
  const pyRes = await fetch(`http://localhost:5000/api/problem-solving/${twoSum._id}/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ code: twoSum.starterCode.python, language: 'python' })
  });
  const pyData = await pyRes.json();
  console.log('Python Run Status:', pyRes.status, 'All Passed:', pyData.allPassed);

  // 5. Test C++ Run
  console.log('\n--- 5. Testing C++ Sample Cases ---');
  const cppRes = await fetch(`http://localhost:5000/api/problem-solving/${twoSum._id}/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ code: twoSum.starterCode.cpp, language: 'cpp' })
  });
  const cppData = await cppRes.json();
  console.log('C++ Run Status:', cppRes.status, 'All Passed:', cppData.allPassed);
  if (!cppData.allPassed) console.log('C++ Results:', cppData.results);

  await mongoose.disconnect();
  console.log('\nAll tests completed successfully!');
}

testProblemSolving().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
