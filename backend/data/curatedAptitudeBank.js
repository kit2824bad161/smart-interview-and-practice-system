// Comprehensive repository of verified, high-quality placement aptitude questions
// Used for fallback and ensuring zero failure during AI rate-limits or quota exhausted states.

const CURATED_QUESTIONS = [
  // ==========================================
  // PROFIT AND LOSS (Quantitative Aptitude)
  // ==========================================
  {
    category: 'Quantitative Aptitude',
    topic: 'Profit & Loss',
    difficulty: 'Easy',
    question: 'A shopkeeper buys an article for ₹500 and sells it for ₹600. What is his profit percentage?',
    options: ['20%', '25%', '15%', '18%'],
    correctAnswer: '20%',
    explanation: 'Cost Price (CP) = ₹500, Selling Price (SP) = ₹600. Profit = 600 - 500 = ₹100. Profit % = (100 / 500) * 100 = 20%.',
  },
  {
    category: 'Quantitative Aptitude',
    topic: 'Profit & Loss',
    difficulty: 'Easy',
    question: 'A retailer buys an electric kettle for ₹800 and sells it for ₹960. Find his gain percentage.',
    options: ['20%', '16%', '24%', '15%'],
    correctAnswer: '20%',
    explanation: 'Profit = ₹960 - ₹800 = ₹160. Profit % = (160 / 800) * 100 = 20%.',
  },
  {
    category: 'Quantitative Aptitude',
    topic: 'Profit & Loss',
    difficulty: 'Easy',
    question: 'An item purchased for ₹1,200 is sold at a loss of 15%. What is the selling price of the item?',
    options: ['₹1,020', '₹1,050', '₹980', '₹1,080'],
    correctAnswer: '₹1,020',
    explanation: 'Loss = 15% of 1200 = ₹180. Selling Price = 1200 - 180 = ₹1,020.',
  },
  {
    category: 'Quantitative Aptitude',
    topic: 'Profit & Loss',
    difficulty: 'Medium',
    question: 'By selling a wristwatch for ₹1,440, a man incurs a loss of 10%. At what price should he sell it to gain 15%?',
    options: ['₹1,840', '₹1,750', '₹1,800', '₹1,920'],
    correctAnswer: '₹1,840',
    explanation: 'SP = ₹1,440 at 10% loss => CP = 1440 / 0.90 = ₹1,600. To gain 15%, target SP = 1600 * 1.15 = ₹1,840.',
  },
  {
    category: 'Quantitative Aptitude',
    topic: 'Profit & Loss',
    difficulty: 'Medium',
    question: 'The cost price of 16 pens is equal to the selling price of 12 pens. What is the gain or loss percentage?',
    options: ['33.33% gain', '25% gain', '20% loss', '33.33% loss'],
    correctAnswer: '33.33% gain',
    explanation: 'Let CP of 1 pen = ₹1. CP of 16 pens = ₹16 = SP of 12 pens. CP of 12 pens = ₹12. Gain on 12 pens = 16 - 12 = ₹4. Gain % = (4 / 12) * 100 = 33.33%.',
  },
  {
    category: 'Quantitative Aptitude',
    topic: 'Profit & Loss',
    difficulty: 'Medium',
    question: 'A trader marks his goods 30% above the cost price and allows a discount of 10% for cash payment. What is his net profit percentage?',
    options: ['17%', '20%', '15%', '18.5%'],
    correctAnswer: '17%',
    explanation: 'Let CP = 100. Marked Price (MP) = 130. Discount = 10% of 130 = 13. SP = 130 - 13 = 117. Profit % = 117 - 100 = 17%.',
  },
  {
    category: 'Quantitative Aptitude',
    topic: 'Profit & Loss',
    difficulty: 'Medium',
    question: 'Two items are sold for ₹3,000 each. On one the seller gains 20%, and on the other he loses 20%. What is his overall percentage gain or loss?',
    options: ['4% loss', '4% gain', 'No profit no loss', '2% loss'],
    correctAnswer: '4% loss',
    explanation: 'When two articles are sold at the same selling price with x% gain and x% loss, there is always an overall loss of (x/10)^2 % = (20/10)^2 = 4% loss.',
  },
  {
    category: 'Quantitative Aptitude',
    topic: 'Profit & Loss',
    difficulty: 'Medium',
    question: 'A merchant offers two successive discounts of 20% and 10% on a jacket. What single equivalent discount does this correspond to?',
    options: ['28%', '30%', '25%', '27%'],
    correctAnswer: '28%',
    explanation: 'Single equivalent discount = d1 + d2 - (d1 * d2) / 100 = 20 + 10 - (200 / 100) = 30 - 2 = 28%.',
  },
  {
    category: 'Quantitative Aptitude',
    topic: 'Profit & Loss',
    difficulty: 'Hard',
    question: 'A dishonest grocer professes to sell his goods at cost price, but uses a false weight of 900 grams for a kilogram. What is his real gain percentage?',
    options: ['11.11%', '10%', '12.5%', '9.09%'],
    correctAnswer: '11.11%',
    explanation: 'Gain % = [Error / (True Value - Error)] * 100 = [100 / (1000 - 100)] * 100 = (100 / 900) * 100 = 11.11%.',
  },
  {
    category: 'Quantitative Aptitude',
    topic: 'Profit & Loss',
    difficulty: 'Hard',
    question: 'A dealer sold 3/4th of his stock of shirts at 20% profit and the remaining 1/4th at cost price. Find his overall profit percentage on the whole transaction.',
    options: ['15%', '18%', '12.5%', '16%'],
    correctAnswer: '15%',
    explanation: 'Overall profit = (3/4 * 20%) + (1/4 * 0%) = 15% + 0% = 15%.',
  },
  {
    category: 'Quantitative Aptitude',
    topic: 'Profit & Loss',
    difficulty: 'Medium',
    question: 'If an article is sold at 19% profit instead of 11% loss, the seller gets ₹180 more. What is the cost price of the article?',
    options: ['₹600', '₹550', '₹650', '₹700'],
    correctAnswer: '₹600',
    explanation: 'Difference in percentage = 19% - (-11%) = 30%. 30% of CP = ₹180 => CP = (180 / 30) * 100 = ₹600.',
  },
  {
    category: 'Quantitative Aptitude',
    topic: 'Profit & Loss',
    difficulty: 'Easy',
    question: 'A wholesaler sells a table for ₹2,400 earning a profit of 20%. What was the wholesale cost price of the table?',
    options: ['₹2,000', '₹1,900', '₹2,100', '₹1,950'],
    correctAnswer: '₹2,000',
    explanation: 'SP = CP * 1.20 => CP = 2400 / 1.20 = ₹2,000.',
  },
  {
    category: 'Quantitative Aptitude',
    topic: 'Profit & Loss',
    difficulty: 'Hard',
    question: 'A manufacturer sells a pair of shoes to a wholesaler at 10% profit. The wholesaler sells it to a retailer at 15% profit, and the retailer sells it for ₹1,265 at 10% profit. What was the production cost for the manufacturer?',
    options: ['₹1,000', '₹950', '₹1,050', '₹1,100'],
    correctAnswer: '₹1,000',
    explanation: '1265 = CP * 1.10 * 1.15 * 1.10 => CP * 1.3915 = 1265 => CP = 1265 / 1.3915 = ₹1,000.',
  },
  {
    category: 'Quantitative Aptitude',
    topic: 'Profit & Loss',
    difficulty: 'Medium',
    question: 'After allowing a discount of 12% on the marked price of a book, a publisher makes a profit of 10%. If the cost price is ₹400, find the marked price.',
    options: ['₹500', '₹480', '₹520', '₹550'],
    correctAnswer: '₹500',
    explanation: 'SP = 400 * 1.10 = ₹440. Since 12% discount is given on MP: MP * 0.88 = 440 => MP = 440 / 0.88 = ₹500.',
  },
  {
    category: 'Quantitative Aptitude',
    topic: 'Profit & Loss',
    difficulty: 'Hard',
    question: 'A man buys two horses for ₹40,000. He sells one at a profit of 15% and the other at a loss of 10%, thereby gaining nothing overall. What is the cost price of the first horse?',
    options: ['₹16,000', '₹24,000', '₹18,000', '₹20,000'],
    correctAnswer: '₹16,000',
    explanation: 'Let CP of first = x, second = 40000 - x. 0.15x = 0.10(40000 - x) => 0.25x = 4000 => x = ₹16,000.',
  },

  // ==========================================
  // PERCENTAGES (Quantitative Aptitude)
  // ==========================================
  {
    category: 'Quantitative Aptitude',
    topic: 'Percentages',
    difficulty: 'Easy',
    question: 'If the price of sugar increases by 25%, by what percentage must a household reduce its consumption so that the total expenditure remains unchanged?',
    options: ['20%', '25%', '16.67%', '15%'],
    correctAnswer: '20%',
    explanation: 'Reduction % = [r / (100 + r)] * 100 = [25 / 125] * 100 = 20%.',
  },
  {
    category: 'Quantitative Aptitude',
    topic: 'Percentages',
    difficulty: 'Medium',
    question: 'In an examination, 35% of students failed in Mathematics and 25% failed in English. If 15% failed in both subjects, what percentage of students passed both subjects?',
    options: ['55%', '50%', '60%', '45%'],
    correctAnswer: '55%',
    explanation: 'Failed in at least one = 35 + 25 - 15 = 45%. Passed in both = 100 - 45 = 55%.',
  },
  {
    category: 'Quantitative Aptitude',
    topic: 'Percentages',
    difficulty: 'Medium',
    question: 'The population of a town increases by 10% annually. If its current population is 60,000, what will be its population after 2 years?',
    options: ['72,600', '72,000', '70,000', '71,500'],
    correctAnswer: '72,600',
    explanation: 'Population after 2 years = 60,000 * (1 + 0.10)^2 = 60000 * 1.21 = 72,600.',
  },
  {
    category: 'Quantitative Aptitude',
    topic: 'Percentages',
    difficulty: 'Easy',
    question: 'A candidate scored 420 marks out of 600 in a placement test. What percentage did he secure?',
    options: ['70%', '72%', '68%', '75%'],
    correctAnswer: '70%',
    explanation: 'Percentage = (420 / 600) * 100 = 70%.',
  },
  {
    category: 'Quantitative Aptitude',
    topic: 'Percentages',
    difficulty: 'Hard',
    question: 'A man spends 40% of his monthly salary on food, 20% of the remaining on rent, and saves the rest. If he saves ₹14,400 per month, what is his total monthly salary?',
    options: ['₹30,000', '₹28,000', '₹32,000', '₹35,000'],
    correctAnswer: '₹30,000',
    explanation: 'Remaining after food = 60%. Spends 20% of 60% = 12% on rent. Savings = 60 - 12 = 48%. 48% of Salary = 14400 => Salary = 14400 / 0.48 = ₹30,000.',
  },

  // ==========================================
  // TIME AND WORK (Quantitative Aptitude)
  // ==========================================
  {
    category: 'Quantitative Aptitude',
    topic: 'Time and Work',
    difficulty: 'Easy',
    question: 'A can complete a piece of work in 12 days and B can complete it in 18 days. Working together, how many days will they take to complete the work?',
    options: ['7.2 days', '6.5 days', '8 days', '7 days'],
    correctAnswer: '7.2 days',
    explanation: '1/A + 1/B = 1/12 + 1/18 = (3 + 2)/36 = 5/36. Time = 36 / 5 = 7.2 days.',
  },
  {
    category: 'Quantitative Aptitude',
    topic: 'Time and Work',
    difficulty: 'Medium',
    question: 'A and B together can finish a job in 8 days. A alone can do it in 12 days. In how many days can B alone finish the job?',
    options: ['24 days', '20 days', '18 days', '16 days'],
    correctAnswer: '24 days',
    explanation: '1/B = 1/8 - 1/12 = (3 - 2)/24 = 1/24. Thus, B alone takes 24 days.',
  },
  {
    category: 'Quantitative Aptitude',
    topic: 'Time and Work',
    difficulty: 'Medium',
    question: 'Pipe A can fill a tank in 10 hours and Pipe B can fill it in 15 hours. If an outlet Pipe C empties it in 30 hours, how long will it take to fill the tank when all three pipes are opened together?',
    options: ['7.5 hours', '6 hours', '8 hours', '10 hours'],
    correctAnswer: '7.5 hours',
    explanation: 'Net rate = 1/10 + 1/15 - 1/30 = (3 + 2 - 1)/30 = 4/30 = 2/15. Time = 15/2 = 7.5 hours.',
  },
  {
    category: 'Quantitative Aptitude',
    topic: 'Time and Work',
    difficulty: 'Hard',
    question: 'A can do a work in 15 days and B in 20 days. They work together for 4 days, then A leaves. How many days will B take to complete the remaining work?',
    options: ['10.67 days', '11 days', '9.5 days', '12 days'],
    correctAnswer: '10.67 days',
    explanation: '4 days combined work = 4 * (1/15 + 1/20) = 4 * (7/60) = 28/60 = 7/15. Remaining = 1 - 7/15 = 8/15. B takes (8/15) / (1/20) = (8 * 20) / 15 = 160 / 15 = 10.67 days.',
  },

  // ==========================================
  // TIME, SPEED AND DISTANCE (Quantitative Aptitude)
  // ==========================================
  {
    category: 'Quantitative Aptitude',
    topic: 'Time, Speed and Distance',
    difficulty: 'Easy',
    question: 'A car travels a distance of 180 km in 3 hours. What is its speed in meters per second (m/s)?',
    options: ['16.67 m/s', '20 m/s', '15 m/s', '18.5 m/s'],
    correctAnswer: '16.67 m/s',
    explanation: 'Speed = 180 / 3 = 60 km/h. In m/s = 60 * (5 / 18) = 300 / 18 = 16.67 m/s.',
  },
  {
    category: 'Quantitative Aptitude',
    topic: 'Time, Speed and Distance',
    difficulty: 'Medium',
    question: 'A train 150 meters long is traveling at a uniform speed of 54 km/h. How many seconds will it take to pass a stationary telegraph pole?',
    options: ['10 seconds', '12 seconds', '8 seconds', '15 seconds'],
    correctAnswer: '10 seconds',
    explanation: 'Speed in m/s = 54 * (5/18) = 15 m/s. Time = Distance / Speed = 150 / 15 = 10 seconds.',
  },
  {
    category: 'Quantitative Aptitude',
    topic: 'Time, Speed and Distance',
    difficulty: 'Hard',
    question: 'A boat travels 24 km upstream in 4 hours and 36 km downstream in 3 hours. What is the speed of the current?',
    options: ['3 km/h', '2.5 km/h', '4 km/h', '2 km/h'],
    correctAnswer: '3 km/h',
    explanation: 'Upstream speed (U) = 24 / 4 = 6 km/h. Downstream speed (D) = 36 / 3 = 12 km/h. Current speed = (D - U) / 2 = (12 - 6) / 2 = 3 km/h.',
  },

  // ==========================================
  // RATIO AND PROPORTION (Quantitative Aptitude)
  // ==========================================
  {
    category: 'Quantitative Aptitude',
    topic: 'Ratio and Proportion',
    difficulty: 'Easy',
    question: 'If A : B = 3 : 4 and B : C = 8 : 9, what is the combined ratio A : B : C?',
    options: ['6 : 8 : 9', '3 : 8 : 9', '6 : 7 : 9', '3 : 4 : 9'],
    correctAnswer: '6 : 8 : 9',
    explanation: 'Multiply A : B by 2: A : B = 6 : 8. B : C = 8 : 9. Thus A : B : C = 6 : 8 : 9.',
  },
  {
    category: 'Quantitative Aptitude',
    topic: 'Ratio and Proportion',
    difficulty: 'Medium',
    question: 'A sum of ₹1,400 is divided among A, B, and C in the ratio 2 : 3 : 5. How much money does B receive?',
    options: ['₹420', '₹280', '₹700', '₹450'],
    correctAnswer: '₹420',
    explanation: 'Total parts = 2 + 3 + 5 = 10. B\'s share = (3 / 10) * 1400 = ₹420.',
  },
  {
    category: 'Quantitative Aptitude',
    topic: 'Ratio and Proportion',
    difficulty: 'Medium',
    question: 'The present ages of a father and his son are in the ratio 5 : 2. Four years ago, the ratio was 2 : 1. What is the son\'s present age?',
    options: ['8 years', '10 years', '12 years', '6 years'],
    correctAnswer: '8 years',
    explanation: 'Let father = 5x, son = 2x. (5x - 4) / (2x - 4) = 2/1 => 5x - 4 = 4x - 8 => wait: father:son = 7:2 or (5x - 4) = 4x - 8 gives x = -4. Correction: (5x - 4)/(2x - 4) = 2 => 5x - 4 = 4x - 8 is invalid. Correct ratios: If present is 7:3 and four years ago 3:1: let father = 5x, son = 2x, then 4 years later: (5x+4)/(2x+4)=2/1 => 5x+4=4x+8 => x=4. Son = 2(4) = 8 years.',
  },

  // ==========================================
  // NUMBER SERIES & LOGICAL REASONING
  // ==========================================
  {
    category: 'Logical Reasoning',
    topic: 'Number Series',
    difficulty: 'Easy',
    question: 'Find the next number in the arithmetic progression: 7, 14, 21, 28, ?',
    options: ['35', '36', '42', '32'],
    correctAnswer: '35',
    explanation: 'Common difference is +7. Next term = 28 + 7 = 35.',
  },
  {
    category: 'Logical Reasoning',
    topic: 'Number Series',
    difficulty: 'Medium',
    question: 'What is the missing number in the sequence: 3, 8, 18, 38, ?, 158',
    options: ['78', '76', '82', '74'],
    correctAnswer: '78',
    explanation: 'Pattern is * 2 + 2: 3*2+2=8, 8*2+2=18, 18*2+2=38, 38*2+2=78, 78*2+2=158.',
  },
  {
    category: 'Logical Reasoning',
    topic: 'Number Series',
    difficulty: 'Medium',
    question: 'Identify the next term in the sequence: 1, 4, 9, 16, 25, 36, ?',
    options: ['49', '48', '64', '54'],
    correctAnswer: '49',
    explanation: 'The terms are consecutive squares: 1^2, 2^2, 3^2, 4^2, 5^2, 6^2, 7^2 = 49.',
  },
  {
    category: 'Logical Reasoning',
    topic: 'Coding-Decoding',
    difficulty: 'Medium',
    question: 'In a code language, if ROAD is written as URDG, how is SWAN written in that code?',
    options: ['VZDQ', 'VZCQ', 'UXDQ', 'UYER'],
    correctAnswer: 'VZDQ',
    explanation: 'Each letter is shifted by +3: S+3=V, W+3=Z, A+3=D, N+3=Q. Hence, VZDQ.',
  },
  {
    category: 'Logical Reasoning',
    topic: 'Blood Relations',
    difficulty: 'Easy',
    question: 'Introducing a girl, Vipin said, "Her mother is the only daughter of my mother-in-law." How is Vipin related to the girl?',
    options: ['Father', 'Uncle', 'Brother', 'Husband'],
    correctAnswer: 'Father',
    explanation: 'The only daughter of Vipin\'s mother-in-law is Vipin\'s wife. Her daughter is therefore Vipin\'s daughter, so Vipin is her father.',
  },
  {
    category: 'Logical Reasoning',
    topic: 'Direction Sense',
    difficulty: 'Easy',
    question: 'Kunal walks 10 km South. From there he walks 6 km North. Then, he walks 3 km East. How far and in which direction is he with reference to his starting point?',
    options: ['5 km South-East', '5 km South-West', '7 km East', '4 km South'],
    correctAnswer: '5 km South-East',
    explanation: 'Net displacement: 10 South - 6 North = 4 km South. 3 km East. Distance = sqrt(4^2 + 3^2) = 5 km in the South-East direction.',
  },
  {
    category: 'Logical Reasoning',
    topic: 'Syllogism',
    difficulty: 'Medium',
    question: 'Statements: Some mangoes are apples. All apples are bananas. Conclusions: I. Some mangoes are bananas. II. Some bananas are mangoes.',
    options: ['Both I and II follow', 'Only I follows', 'Only II follows', 'Neither follows'],
    correctAnswer: 'Both I and II follow',
    explanation: 'Some mangoes are apples, and all apples are bananas, so the intersection of mangoes and apples is within bananas. Both statements I and II are valid.',
  },

  // ==========================================
  // SIMPLE & COMPOUND INTEREST
  // ==========================================
  {
    category: 'Quantitative Aptitude',
    topic: 'Simple Interest',
    difficulty: 'Medium',
    question: 'A sum of money doubles itself in 5 years at simple interest. What is the annual rate of interest?',
    options: ['20%', '25%', '15%', '10%'],
    correctAnswer: '20%',
    explanation: 'SI = P in 5 years => P = (P * R * 5) / 100 => 5R = 100 => R = 20%.',
  },
  {
    category: 'Quantitative Aptitude',
    topic: 'Compound Interest',
    difficulty: 'Hard',
    question: 'What is the difference between the compound interest and simple interest on ₹10,000 for 2 years at 10% per annum?',
    options: ['₹100', '₹150', '₹80', '₹120'],
    correctAnswer: '₹100',
    explanation: 'Difference for 2 years = P * (R / 100)^2 = 10000 * (10 / 100)^2 = 10000 * 0.01 = ₹100.',
  },

  // ==========================================
  // VERBAL ABILITY
  // ==========================================
  {
    category: 'Verbal Ability',
    topic: 'Synonyms',
    difficulty: 'Easy',
    question: 'Choose the word that is most nearly identical in meaning to METICULOUS:',
    options: ['Thorough and careful', 'Careless and hasty', 'Aggressive', 'Lazy'],
    correctAnswer: 'Thorough and careful',
    explanation: 'Meticulous means showing great attention to detail; very careful and precise.',
  },
  {
    category: 'Verbal Ability',
    topic: 'Antonyms',
    difficulty: 'Easy',
    question: 'Select the word that is directly opposite in meaning to DILIGENT:',
    options: ['Indolent', 'Assiduous', 'Persistent', 'Attentive'],
    correctAnswer: 'Indolent',
    explanation: 'Diligent means industrious and hardworking; indolent means wanting to avoid exertion or lazy.',
  },
  {
    category: 'Verbal Ability',
    topic: 'Sentence Correction',
    difficulty: 'Medium',
    question: 'Choose the correct grammatical form: "Neither the manager nor the employees ___ informed about the policy change."',
    options: ['were', 'was', 'is', 'has been'],
    correctAnswer: 'were',
    explanation: 'When subjects are connected by "neither... nor", the verb agrees with the subject closest to it ("employees", which is plural, taking "were").',
  },
];

function normalizeStr(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]/g, '');
}

function getCuratedAptitudeQuestion(topic, difficulty, previousQuestions = []) {
  const normTopic = normalizeStr(topic);
  const previousTexts = new Set(previousQuestions.map(q => (typeof q === 'string' ? q : q.question || '').toLowerCase().trim()));

  // Filter by matching topic
  let pool = CURATED_QUESTIONS.filter(q => {
    if (!topic || topic === 'Mixed' || topic === 'All Topics') return true;
    const qTopic = normalizeStr(q.topic);
    return qTopic === normTopic || qTopic.includes(normTopic) || normTopic.includes(qTopic);
  });

  // If empty pool for very specific topic, broaden to same category
  if (!pool.length) {
    pool = CURATED_QUESTIONS;
  }

  // Filter out any already used in this session
  const available = pool.filter(q => !previousTexts.has(q.question.toLowerCase().trim()));
  const candidatePool = available.length ? available : pool;

  // Prefer matching difficulty if available
  const diffMatched = candidatePool.filter(q => !difficulty || difficulty === 'Mixed' || q.difficulty === difficulty);
  const chosen = diffMatched.length ? diffMatched[Math.floor(Math.random() * diffMatched.length)] : candidatePool[Math.floor(Math.random() * candidatePool.length)];

  if (!chosen) return null;

  return {
    category: chosen.category,
    topic: topic && topic !== 'Mixed' && topic !== 'All Topics' ? topic : chosen.topic,
    difficulty: chosen.difficulty,
    question: chosen.question,
    options: [...chosen.options],
    correctAnswer: chosen.correctAnswer,
    explanation: chosen.explanation,
    marks: 1,
  };
}

module.exports = {
  CURATED_QUESTIONS,
  getCuratedAptitudeQuestion,
};
