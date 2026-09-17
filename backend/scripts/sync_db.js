const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Problem = require('../models/Problem');
const { SEED_PROBLEMS, TOPIC_LIST } = require('../data/seedProblems');

async function sync() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-interview';
  await mongoose.connect(mongoUri);

  const validSlugs = SEED_PROBLEMS.map(p => p.slug);
  // Remove any legacy problems that do not have one of the curated slugs
  const delRes = await Problem.deleteMany({ slug: { $nin: validSlugs } });
  console.log(`Deleted stale non-catalog problems: ${delRes.deletedCount}`);

  // Upsert all 200 curated problems
  for (const p of SEED_PROBLEMS) {
    await Problem.findOneAndUpdate(
      { slug: p.slug },
      { $set: p },
      { upsert: true, new: true }
    );
  }

  const totalCount = await Problem.countDocuments();
  console.log(`Total problems in database: ${totalCount}`);

  let allPerfect = true;
  for (const t of TOPIC_LIST) {
    const list = await Problem.find({ topic: { $regex: new RegExp(`^${t.name}$`, 'i') } });
    const diffs = { Easy: 0, Medium: 0, Hard: 0 };
    list.forEach(p => { diffs[p.difficulty] = (diffs[p.difficulty] || 0) + 1; });
    const isOk = list.length === 10 && diffs.Easy === 4 && diffs.Medium === 3 && diffs.Hard === 3;
    if (!isOk) allPerfect = false;
    console.log(`${t.name.padEnd(24)} Count: ${list.length} | Easy: ${diffs.Easy}, Med: ${diffs.Medium}, Hard: ${diffs.Hard} [${isOk ? 'OK' : 'MISMATCH'}]`);
  }

  console.log('====================================');
  console.log(`Database sync status: ${allPerfect ? 'ALL 20 TOPICS PERFECT (10 each, 4 Easy, 3 Med, 3 Hard)' : 'FAILED'}`);

  await mongoose.disconnect();
}

sync().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
