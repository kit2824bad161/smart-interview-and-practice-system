export const ROLE_OPTIONS = ['Software Developer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Analyst', 'Data Scientist', 'AI/ML Engineer', 'Java Developer', 'C++ Developer'];
export const ROLE_GROUPS = { 'Software Developer': 'Engineering', 'Frontend Developer': 'Engineering', 'Backend Developer': 'Engineering', 'Full Stack Developer': 'Engineering', 'Data Analyst': 'Data', 'Data Scientist': 'Data', 'AI/ML Engineer': 'Data', 'Java Developer': 'Engineering', 'C++ Developer': 'Engineering' };
export const mockQuestions = {
  'Software Developer': [
    { id: 'sd-1', question: 'Explain how you would design a rate limiter for a public API.', difficulty: 'Medium', category: 'System Design' },
    { id: 'sd-2', question: 'What trade-offs would you consider when choosing between a relational and document database?', difficulty: 'Medium', category: 'Databases' },
    { id: 'sd-3', question: 'Walk through the time and space complexity of binary search and when it cannot be used.', difficulty: 'Easy', category: 'Algorithms' },
    { id: 'sd-4', question: 'How would you debug a production service whose latency suddenly doubled?', difficulty: 'Hard', category: 'Problem Solving' },
    { id: 'sd-5', question: 'Describe a testing strategy for a service that processes payments.', difficulty: 'Medium', category: 'Engineering Practice' },
  ],
  'Frontend Developer': [
    { id: 'fe-1', question: 'How does React reconciliation work, and what makes a component re-render?', difficulty: 'Medium', category: 'React' },
    { id: 'fe-2', question: 'Design a responsive dashboard that remains usable on a 320px viewport.', difficulty: 'Medium', category: 'UI Engineering' },
    { id: 'fe-3', question: 'Explain event delegation and when it improves browser performance.', difficulty: 'Easy', category: 'JavaScript' },
    { id: 'fe-4', question: 'How would you measure and improve Core Web Vitals on a large application?', difficulty: 'Hard', category: 'Performance' },
    { id: 'fe-5', question: 'What accessibility checks belong in a frontend pull request?', difficulty: 'Medium', category: 'Accessibility' },
  ],
  'Backend Developer': [
    { id: 'be-1', question: 'How would you make an Express endpoint idempotent?', difficulty: 'Medium', category: 'API Design' },
    { id: 'be-2', question: 'Compare optimistic and pessimistic locking in a concurrent system.', difficulty: 'Hard', category: 'Databases' },
    { id: 'be-3', question: 'What happens between a browser request and a Node.js handler?', difficulty: 'Easy', category: 'Web Fundamentals' },
    { id: 'be-4', question: 'Design a background job system that can retry safely.', difficulty: 'Hard', category: 'System Design' },
    { id: 'be-5', question: 'How do you protect a JWT-based API from common attacks?', difficulty: 'Medium', category: 'Security' },
  ],
  'Data Analyst': [
    { id: 'da-1', question: 'How would you investigate a sudden drop in a product conversion funnel?', difficulty: 'Medium', category: 'Analytics' },
    { id: 'da-2', question: 'Explain the difference between correlation and causation with a business example.', difficulty: 'Easy', category: 'Statistics' },
    { id: 'da-3', question: 'Write the logic for finding the second-highest sale per region.', difficulty: 'Medium', category: 'SQL' },
    { id: 'da-4', question: 'How would you detect and communicate an outlier in a stakeholder report?', difficulty: 'Medium', category: 'Data Quality' },
    { id: 'da-5', question: 'Design an experiment to test whether a new onboarding flow improves retention.', difficulty: 'Hard', category: 'Experimentation' },
  ],
};
export const getQuestionsForRole = (role) => mockQuestions[role] || mockQuestions['Software Developer'];
export const mockResult = { overallScore: 84, breakdown: { technical: 85, relevance: 90, completeness: 78, communication: 82 }, strengths: ['Good understanding of core concepts', 'Clear explanation and structure', 'Strong problem-solving approach'], improvements: ['Improve complexity analysis', 'Add practical examples', 'Explain edge cases more explicitly'], missing: ['Caching strategies', 'Failure recovery patterns'], topics: ['System Design', 'Advanced JavaScript', 'API Security'] };
