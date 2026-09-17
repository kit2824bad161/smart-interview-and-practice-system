const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');

async function syncSeedProblems() {
  await mongoose.connect(process.env.MONGO_URI);
  const Problem = require('../models/Problem');
  const { SEED_PROBLEMS } = require('../data/seedProblems');

  for (const p of SEED_PROBLEMS) {
    await Problem.findOneAndUpdate(
      { title: p.title },
      { $set: { starterCode: p.starterCode, testCases: p.testCases, examples: p.examples } },
      { upsert: true }
    );
  }
  console.log(`Synced ${SEED_PROBLEMS.length} seed problems successfully!`);
  await mongoose.disconnect();
}

syncSeedProblems().catch(console.error);
