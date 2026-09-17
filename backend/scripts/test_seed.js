const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Problem = require('../models/Problem');
const { SEED_PROBLEMS, TOPIC_LIST } = require('../data/seedProblems');

async function test() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-interview';
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri);
  console.log('Connected! Checking database problem count...');

  let count = await Problem.countDocuments();
  console.log(`Current problems in DB: ${count}`);

  console.log(`Upserting all ${SEED_PROBLEMS.length} problems by slug...`);
  for (const p of SEED_PROBLEMS) {
    await Problem.findOneAndUpdate(
      { slug: p.slug },
      { $set: p },
      { upsert: true, new: true }
    );
  }

  count = await Problem.countDocuments();
  console.log(`Updated problems in DB: ${count}`);

  // Test topic distribution in DB
  for (const t of TOPIC_LIST) {
    const list = await Problem.find({ topic: { $regex: new RegExp(`^${t.name}$`, 'i') } });
    const diffs = { Easy: 0, Medium: 0, Hard: 0 };
    list.forEach(p => { diffs[p.difficulty] = (diffs[p.difficulty] || 0) + 1; });
    console.log(`Topic: ${t.name.padEnd(22)} Total: ${list.length} (Easy: ${diffs.Easy}, Med: ${diffs.Medium}, Hard: ${diffs.Hard})`);
  }

  await mongoose.disconnect();
  console.log('Database verification complete!');
}

test().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
