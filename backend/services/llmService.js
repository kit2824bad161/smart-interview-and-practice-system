/**
 * LLM Service — Abstraction layer for all AI calls.
 * Provider: Amazon Bedrock (Claude 3)
 * To switch provider: only modify this file.
 */

const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

// ─── Client setup ─────────────────────────────────────────────────────────────

let bedrockClient = null;

function getClient() {
  if (!bedrockClient) {
    if (!process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID === 'your_aws_access_key_id') {
      throw new Error(
        'AWS credentials not configured. Set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION in backend/.env'
      );
    }
    bedrockClient = new BedrockRuntimeClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  return bedrockClient;
}

// ─── Core invoke function ─────────────────────────────────────────────────────

async function invokeClaude(prompt, maxTokens = 1500) {
  const client = getClient();
  const modelId = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-haiku-20240307-v1:0';

  const body = JSON.stringify({
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  const command = new InvokeModelCommand({
    modelId,
    contentType: 'application/json',
    accept: 'application/json',
    body,
  });

  const response = await client.send(command);
  const decoded = JSON.parse(new TextDecoder().decode(response.body));
  return decoded.content[0].text;
}

// ─── Safe JSON parser with retry ─────────────────────────────────────────────

function safeParseJSON(text) {
  // Extract JSON from markdown code blocks if present
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/);
  const raw = jsonMatch ? jsonMatch[1] : text;
  try {
    return JSON.parse(raw.trim());
  } catch {
    throw new Error(`LLM returned invalid JSON: ${raw.substring(0, 200)}`);
  }
}

// ─── 1. Generate Interview Questions ─────────────────────────────────────────

async function generateInterviewQuestions({ jobRole, experience, difficulty, interviewType, numberOfQuestions, previousQuestions = [] }) {
  const prevList = previousQuestions.length > 0
    ? `\nAlready asked questions (DO NOT repeat or ask similar):\n${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`
    : '';

  const prompt = `You are an expert technical interviewer conducting a professional job interview.

Generate ${numberOfQuestions} interview questions for:
- Job Role: ${jobRole}
- Experience Level: ${experience}
- Difficulty: ${difficulty}
- Interview Type: ${interviewType}
${prevList}

Requirements:
- Questions must be directly relevant to the job role
- Match the candidate's experience level (${experience})
- Match the requested difficulty (${difficulty})
- For Technical interviews: include programming, algorithms, system design, and role-specific topics
- For HR interviews: include behavioral, situational, and soft-skill questions
- For Mixed: combine both technical and HR questions
- Each question must be unique and not similar to previously asked questions
- Do not reveal expected answers in the question
- Include a mix of conceptual and practical questions

Return ONLY valid JSON in this exact format, no other text:
{
  "questions": [
    {
      "question": "question text here",
      "category": "category name",
      "difficulty": "${difficulty}",
      "expectedConcepts": ["concept1", "concept2", "concept3"]
    }
  ]
}`;

  const raw = await invokeClaude(prompt, 2000);
  const parsed = safeParseJSON(raw);

  if (!parsed.questions || !Array.isArray(parsed.questions)) {
    throw new Error('LLM did not return a valid questions array');
  }

  return parsed.questions.map((q, i) => ({
    questionNumber: i + 1,
    question: q.question,
    category: q.category || 'General',
    difficulty: q.difficulty || difficulty,
    expectedConcepts: Array.isArray(q.expectedConcepts) ? q.expectedConcepts : [],
  }));
}

// ─── 2. Generate Single Next Question (adaptive) ──────────────────────────────

async function generateNextQuestion({ jobRole, experience, currentDifficulty, interviewType, previousQuestions, previousScores, weakAreas }) {
  const avgScore = previousScores.length > 0
    ? Math.round(previousScores.reduce((a, b) => a + b, 0) / previousScores.length)
    : 50;

  let adaptedDifficulty = currentDifficulty;
  if (avgScore >= 80 && currentDifficulty === 'Easy') adaptedDifficulty = 'Medium';
  else if (avgScore >= 80 && currentDifficulty === 'Medium') adaptedDifficulty = 'Hard';
  else if (avgScore < 50 && currentDifficulty === 'Hard') adaptedDifficulty = 'Medium';

  const weakFocus = weakAreas.length > 0
    ? `\nThe candidate is weak in: ${weakAreas.join(', ')}. Prioritize a question in one of these areas.`
    : '';

  const prompt = `You are an expert technical interviewer.

Generate ONE interview question for:
- Job Role: ${jobRole}
- Experience: ${experience}
- Difficulty: ${adaptedDifficulty}
- Interview Type: ${interviewType}
- Candidate average score so far: ${avgScore}%
${weakFocus}

Already asked questions (DO NOT repeat or ask similar):
${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Return ONLY valid JSON, no other text:
{
  "question": "question text",
  "category": "category",
  "difficulty": "${adaptedDifficulty}",
  "expectedConcepts": ["concept1", "concept2"]
}`;

  const raw = await invokeClaude(prompt, 500);
  const parsed = safeParseJSON(raw);

  return {
    question: parsed.question,
    category: parsed.category || 'General',
    difficulty: parsed.difficulty || adaptedDifficulty,
    expectedConcepts: Array.isArray(parsed.expectedConcepts) ? parsed.expectedConcepts : [],
  };
}

// ─── 3. Evaluate Answer ───────────────────────────────────────────────────────

async function evaluateAnswer({ question, answer, expectedConcepts, jobRole, difficulty }) {
  // Handle empty / don't know answers without calling LLM
  const trimmed = (answer || '').trim().toLowerCase();
  if (!trimmed) {
    return buildZeroScore('Answer was empty. Please attempt the question.');
  }
  const dkPhrases = ["i don't know", "i do not know", "not sure", "no idea", "idk", "don't know"];
  if (dkPhrases.some(p => trimmed.includes(p)) && trimmed.split(/\s+/).length < 10) {
    return buildZeroScore('You indicated you do not know the answer. Study this topic and try again.');
  }

  const conceptList = expectedConcepts && expectedConcepts.length > 0
    ? `Expected concepts to cover: ${expectedConcepts.join(', ')}`
    : '';

  const prompt = `You are a strict but fair technical interviewer evaluating a candidate's answer.

Question: "${question}"
Job Role: ${jobRole}
Difficulty: ${difficulty}
${conceptList}

Candidate's Answer: "${answer}"

Evaluate this answer strictly. Do NOT give high scores for vague, generic, or irrelevant answers.

Scoring rules:
- If the answer does not address the specific question asked, Relevance must be below 30
- If the answer contains technically incorrect statements, Technical Correctness must be penalized heavily
- Generic statements like "it is useful" or "programming is important" must receive very low Specificity scores
- Short answers that lack substance must receive low Completeness scores
- Only give high scores (80+) when the answer is clearly correct, relevant, and sufficiently detailed

Score each dimension from 0 to 100:
1. technicalCorrectness (30% weight): Are the technical claims accurate? Are there any incorrect statements?
2. relevance (25% weight): Does the answer directly address the specific question asked?
3. conceptCoverage (20% weight): How many of the expected concepts were correctly covered?
4. completeness (10% weight): Is the answer sufficiently complete for the difficulty level?
5. specificity (10% weight): Is the answer specific with technical details, or vague and generic?
6. communication (5% weight): Is the answer clearly structured and well-communicated?

Also provide:
- strengths: list of what the candidate did well (empty array if nothing notable)
- weaknesses: list of specific problems with the answer
- missingConcepts: list of important concepts that were missing
- feedback: one paragraph of constructive feedback
- suggestedAnswer: a model answer that would score 90+

Return ONLY valid JSON, no other text:
{
  "technicalCorrectness": <0-100>,
  "relevance": <0-100>,
  "conceptCoverage": <0-100>,
  "completeness": <0-100>,
  "specificity": <0-100>,
  "communication": <0-100>,
  "strengths": [],
  "weaknesses": [],
  "missingConcepts": [],
  "feedback": "...",
  "suggestedAnswer": "..."
}`;

  const raw = await invokeClaude(prompt, 1200);
  const llm = safeParseJSON(raw);

  // Clamp all scores to 0-100
  const clamp = (v) => Math.max(0, Math.min(100, Math.round(Number(v) || 0)));
  const tc  = clamp(llm.technicalCorrectness);
  const rel = clamp(llm.relevance);
  const cc  = clamp(llm.conceptCoverage);
  const cmp = clamp(llm.completeness);
  const sp  = clamp(llm.specificity);
  const com = clamp(llm.communication);

  // Backend calculates final score — never trust LLM's own overall score
  const overallScore = Math.round(tc * 0.30 + rel * 0.25 + cc * 0.20 + cmp * 0.10 + sp * 0.10 + com * 0.05);

  // Quality label
  let answerQuality;
  if (overallScore >= 80) answerQuality = 'strong';
  else if (overallScore >= 55) answerQuality = 'partially_correct';
  else if (overallScore >= 30) answerQuality = 'weak';
  else answerQuality = 'insufficient';

  return {
    technicalCorrectness: tc,
    relevance: rel,
    conceptCoverage: cc,
    completeness: cmp,
    specificity: sp,
    communication: com,
    overallScore,
    answerQuality,
    strengths: Array.isArray(llm.strengths) ? llm.strengths : [],
    weaknesses: Array.isArray(llm.weaknesses) ? llm.weaknesses : [],
    missingConcepts: Array.isArray(llm.missingConcepts) ? llm.missingConcepts : [],
    feedback: llm.feedback || '',
    suggestedAnswer: llm.suggestedAnswer || '',
  };
}

// ─── 4. Generate Final Interview Feedback ────────────────────────────────────

async function generateFinalFeedback({ jobRole, experience, questions, answers, scores }) {
  const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  const qa = questions.map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] || '(no answer)'}\nScore: ${scores[i]}%`).join('\n\n');

  const prompt = `You are an expert career coach reviewing a complete mock interview.

Job Role: ${jobRole}
Experience Level: ${experience}
Overall Average Score: ${avgScore}%

Interview Q&A:
${qa}

Generate comprehensive final feedback. Be honest and constructive.

Return ONLY valid JSON, no other text:
{
  "overallFeedback": "2-3 sentence overall assessment",
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "recommendedTopics": ["topic1", "topic2", "topic3", "topic4"],
  "improvementPlan": ["action1", "action2", "action3"],
  "readinessLevel": "one of: Excellent, Good, Average, Needs Improvement, Not Ready"
}`;

  const raw = await invokeClaude(prompt, 1000);
  const parsed = safeParseJSON(raw);

  return {
    overallFeedback: parsed.overallFeedback || '',
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
    recommendedTopics: Array.isArray(parsed.recommendedTopics) ? parsed.recommendedTopics : [],
    improvementPlan: Array.isArray(parsed.improvementPlan) ? parsed.improvementPlan : [],
    readinessLevel: parsed.readinessLevel || 'Average',
  };
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function buildZeroScore(feedbackMsg) {
  return {
    technicalCorrectness: 0,
    relevance: 0,
    conceptCoverage: 0,
    completeness: 0,
    specificity: 0,
    communication: 0,
    overallScore: 0,
    answerQuality: 'empty',
    strengths: [],
    weaknesses: [feedbackMsg],
    missingConcepts: [],
    feedback: feedbackMsg,
    suggestedAnswer: '',
  };
}

module.exports = {
  generateInterviewQuestions,
  generateNextQuestion,
  evaluateAnswer,
  generateFinalFeedback,
};
