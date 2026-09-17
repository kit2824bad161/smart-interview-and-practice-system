const fs = require('fs');
const path = require('path');

const catalogDir = path.join(__dirname, '../data/dsaCatalog');
const topicFiles = [
  'arrays.js',
  'strings.js',
  'searching.js',
  'sorting.js',
  'twoPointers.js',
  'slidingWindow.js',
  'hashing.js',
  'stack.js',
  'queue.js',
  'linkedList.js',
  'recursion.js',
  'binarySearch.js',
  'trees.js',
  'bst.js',
  'graphs.js',
  'greedy.js',
  'dp.js',
  'backtracking.js',
  'bitManipulation.js',
  'math.js'
];

console.log(`Checking ${topicFiles.length} topic files...`);

const allProblems = [];
const slugSet = new Set();
const titleSet = new Set();

const expectedTopics = [
  'Arrays',
  'Strings',
  'Searching',
  'Sorting',
  'Two Pointers',
  'Sliding Window',
  'Hashing',
  'Stack',
  'Queue',
  'Linked List',
  'Recursion',
  'Binary Search',
  'Trees',
  'Binary Search Tree',
  'Graphs',
  'Greedy',
  'Dynamic Programming',
  'Backtracking',
  'Bit Manipulation',
  'Basic Mathematics'
];

for (const file of topicFiles) {
  const filePath = path.join(catalogDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`MISSING FILE: ${file}`);
    process.exit(1);
  }
  const problems = require(filePath);
  console.log(`- ${file}: ${problems.length} problems loaded.`);
  if (problems.length !== 10) {
    console.error(`ERROR: ${file} does not have exactly 10 problems! Has: ${problems.length}`);
    process.exit(1);
  }

  const diffCounts = { Easy: 0, Medium: 0, Hard: 0 };
  for (const p of problems) {
    diffCounts[p.difficulty] = (diffCounts[p.difficulty] || 0) + 1;
    if (slugSet.has(p.slug)) {
      console.error(`DUPLICATE SLUG: ${p.slug} in ${file}`);
      process.exit(1);
    }
    slugSet.add(p.slug);
    titleSet.add(p.title);
    allProblems.push(p);
  }

  if (diffCounts.Easy !== 4 || diffCounts.Medium !== 3 || diffCounts.Hard !== 3) {
    console.error(`ERROR: ${file} distribution mismatch:`, diffCounts);
    process.exit(1);
  }
}

console.log('====================================');
console.log(`TOTAL PROBLEMS: ${allProblems.length}`);
console.log(`UNIQUE SLUGS: ${slugSet.size}`);
console.log(`UNIQUE TITLES: ${titleSet.size}`);
console.log('All 20 topics verified with exactly 4 Easy, 3 Medium, 3 Hard each!');
