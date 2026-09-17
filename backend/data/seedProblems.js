/**
 * Master DSA Problem Catalogue & Seed Aggregator
 * Exactly 20 DSA Topics, each containing exactly 10 genuine coding problems (4 Easy, 3 Medium, 3 Hard).
 * Total: 200 stable, unique, placement-grade DSA problems.
 */

const arrays = require('./dsaCatalog/arrays');
const strings = require('./dsaCatalog/strings');
const searching = require('./dsaCatalog/searching');
const sorting = require('./dsaCatalog/sorting');
const twoPointers = require('./dsaCatalog/twoPointers');
const slidingWindow = require('./dsaCatalog/slidingWindow');
const hashing = require('./dsaCatalog/hashing');
const stack = require('./dsaCatalog/stack');
const queue = require('./dsaCatalog/queue');
const linkedList = require('./dsaCatalog/linkedList');
const recursion = require('./dsaCatalog/recursion');
const binarySearch = require('./dsaCatalog/binarySearch');
const trees = require('./dsaCatalog/trees');
const bst = require('./dsaCatalog/bst');
const graphs = require('./dsaCatalog/graphs');
const greedy = require('./dsaCatalog/greedy');
const dp = require('./dsaCatalog/dp');
const backtracking = require('./dsaCatalog/backtracking');
const bitManipulation = require('./dsaCatalog/bitManipulation');
const math = require('./dsaCatalog/math');

const TOPIC_LIST = [
  { name: 'Arrays', key: 'arrays', count: 10, easy: 4, medium: 3, hard: 3, problems: arrays },
  { name: 'Strings', key: 'strings', count: 10, easy: 4, medium: 3, hard: 3, problems: strings },
  { name: 'Searching', key: 'searching', count: 10, easy: 4, medium: 3, hard: 3, problems: searching },
  { name: 'Sorting', key: 'sorting', count: 10, easy: 4, medium: 3, hard: 3, problems: sorting },
  { name: 'Two Pointers', key: 'twoPointers', count: 10, easy: 4, medium: 3, hard: 3, problems: twoPointers },
  { name: 'Sliding Window', key: 'slidingWindow', count: 10, easy: 4, medium: 3, hard: 3, problems: slidingWindow },
  { name: 'Hashing', key: 'hashing', count: 10, easy: 4, medium: 3, hard: 3, problems: hashing },
  { name: 'Stack', key: 'stack', count: 10, easy: 4, medium: 3, hard: 3, problems: stack },
  { name: 'Queue', key: 'queue', count: 10, easy: 4, medium: 3, hard: 3, problems: queue },
  { name: 'Linked List', key: 'linkedList', count: 10, easy: 4, medium: 3, hard: 3, problems: linkedList },
  { name: 'Recursion', key: 'recursion', count: 10, easy: 4, medium: 3, hard: 3, problems: recursion },
  { name: 'Binary Search', key: 'binarySearch', count: 10, easy: 4, medium: 3, hard: 3, problems: binarySearch },
  { name: 'Trees', key: 'trees', count: 10, easy: 4, medium: 3, hard: 3, problems: trees },
  { name: 'Binary Search Tree', key: 'bst', count: 10, easy: 4, medium: 3, hard: 3, problems: bst },
  { name: 'Graphs', key: 'graphs', count: 10, easy: 4, medium: 3, hard: 3, problems: graphs },
  { name: 'Greedy', key: 'greedy', count: 10, easy: 4, medium: 3, hard: 3, problems: greedy },
  { name: 'Dynamic Programming', key: 'dp', count: 10, easy: 4, medium: 3, hard: 3, problems: dp },
  { name: 'Backtracking', key: 'backtracking', count: 10, easy: 4, medium: 3, hard: 3, problems: backtracking },
  { name: 'Bit Manipulation', key: 'bitManipulation', count: 10, easy: 4, medium: 3, hard: 3, problems: bitManipulation },
  { name: 'Basic Mathematics', key: 'math', count: 10, easy: 4, medium: 3, hard: 3, problems: math },
];

function normalizeProblem(p) {
  const constraints = Array.isArray(p.constraints)
    ? p.constraints
    : (p.constraints ? [p.constraints] : []);

  const examples = (p.examples || []).map(ex => ({
    input: String(ex.input || ''),
    output: String(ex.output || ''),
    explanation: String(ex.explanation || ''),
  }));

  const rawTestCases = p.hiddenTestCases || p.testCases || [];
  const testCases = rawTestCases.map(tc => ({
    input: String(tc.input || ''),
    expectedOutput: String(tc.expectedOutput || tc.output || ''),
  }));

  return {
    title: p.title,
    slug: p.slug,
    difficulty: p.difficulty,
    topic: p.topic,
    problemStatement: p.problemStatement || p.description || '',
    inputFormat: p.inputFormat || '',
    outputFormat: p.outputFormat || '',
    constraints,
    examples,
    starterCode: p.starterCode || {},
    testCases,
  };
}

const SEED_PROBLEMS = [];
for (const t of TOPIC_LIST) {
  for (const prob of t.problems) {
    SEED_PROBLEMS.push(normalizeProblem(prob));
  }
}

module.exports = {
  TOPIC_LIST: TOPIC_LIST.map(t => ({
    name: t.name,
    key: t.key,
    count: t.count,
    easy: t.easy,
    medium: t.medium,
    hard: t.hard,
  })),
  SEED_PROBLEMS,
};
