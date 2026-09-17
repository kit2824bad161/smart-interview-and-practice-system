const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const AptitudeSession = require('../models/AptitudeSession');
const openai = require('../services/openaiService');
const { getCuratedAptitudeQuestion } = require('../data/curatedAptitudeBank');

// Standalone simulation of generateNext without needing HTTP/Auth
async function simulateAptitudeGeneration({ topic, difficulty, count }) {
  console.log(`\n==================================================`);
  console.log(`Testing Aptitude Generation: Topic: "${topic}", Difficulty: "${difficulty}", Count: ${count}`);
  console.log(`==================================================`);

  const mockSession = {
    category: 'Quantitative Aptitude',
    topic,
    difficulty,
    totalQuestions: count,
    questions: [],
    save: async function() { return true; }
  };

  const results = [];
  const startTime = Date.now();

  for (let i = 0; i < count; i++) {
    const questionNumber = i + 1;
    console.log(`\n--- Generating Question ${questionNumber}/${count} ---`);

    // Call generateAptitudeQuestion with retry and fallback
    let q = null;
    let attempts = 0;
    const previous = mockSession.questions.map(item => item.question);

    while (attempts < 3 && !q) {
      attempts++;
      try {
        const generated = await openai.generateAptitudeQuestion({
          category: mockSession.category,
          topic: mockSession.topic,
          difficulty: mockSession.difficulty,
          previousQuestions: previous,
          questionNumber,
          variationHint: attempts > 1 ? `Attempt ${attempts}: ensure distinct values and scenario.` : ''
        });

        // Check options
        if (generated && generated.options?.length === 4 && generated.correctAnswer) {
          q = generated;
        }
      } catch (err) {
        console.warn(`[AI Attempt ${attempts} error]:`, err.message);
      }
    }

    if (!q) {
      console.log(`[Fallback] Using curated question for question ${questionNumber}`);
      q = getCuratedAptitudeQuestion(topic, difficulty, previous);
    }

    if (!q) {
      throw new Error(`Failed to generate or retrieve question ${questionNumber}`);
    }

    // Validate
    if (!q.question || q.question.trim().length === 0) throw new Error(`Empty question text at ${questionNumber}`);
    if (!Array.isArray(q.options) || q.options.length !== 4) throw new Error(`Options count !== 4 at ${questionNumber}`);
    if (!q.options.includes(q.correctAnswer)) throw new Error(`correctAnswer "${q.correctAnswer}" not in options [${q.options.join(', ')}] at ${questionNumber}`);
    if (!q.explanation || q.explanation.trim().length === 0) throw new Error(`Empty explanation at ${questionNumber}`);

    mockSession.questions.push(q);
    results.push(q);
    console.log(`[OK] Q${questionNumber}: "${q.question.slice(0, 80)}..."`);
    console.log(`     Options: ${JSON.stringify(q.options)}`);
    console.log(`     Answer: "${q.correctAnswer}"`);
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nAll ${count} questions generated successfully in ${duration}s.`);

  // Check duplicates among all generated
  const questionsTexts = results.map(r => r.question.toLowerCase().trim());
  const uniqueTexts = new Set(questionsTexts);
  console.log(`Uniqueness check: ${uniqueTexts.size}/${count} unique question texts.`);
  if (uniqueTexts.size !== count) {
    console.warn(`WARNING: Potential duplicates found!`);
  } else {
    console.log(`PASS: Zero duplicate questions.`);
  }

  return results;
}

async function runTests() {
  try {
    // 1. Test Profit & Loss, Medium, 5 questions for rapid validation (or 20)
    console.log('\n--- 1. Testing Profit & Loss (Moderate/Medium) ---');
    await simulateAptitudeGeneration({ topic: 'Profit & Loss', difficulty: 'Medium', count: 5 });

    // 2. Test Percentages, Easy
    console.log('\n--- 2. Testing Percentages (Easy) ---');
    await simulateAptitudeGeneration({ topic: 'Percentages', difficulty: 'Easy', count: 3 });

    // 3. Test Hiring Assessment Aptitude Batch
    console.log('\n--- 3. Testing Hiring Assessment Batch (generateAptitudeQuestionsBatch) ---');
    const batch = await openai.generateAptitudeQuestionsBatch({ count: 5 });
    console.log(`Hiring Batch returned: ${batch.length} questions.`);
    console.log(`Sample hiring Q1: "${batch[0].question.slice(0, 80)}..."`);

    console.log('\n==================================================');
    console.log('ALL TESTS PASSED SUCCESSFULLY!');
    console.log('==================================================');
  } catch (err) {
    console.error('TEST FAILED:', err);
    process.exit(1);
  }
}

runTests();
