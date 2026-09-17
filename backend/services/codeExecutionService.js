/**
 * Isolated Sandbox Code Execution Service
 * Uses Judge0 CE sandbox API to safely execute user-submitted Java, Python, and C++ code.
 * Arbitrary code is NEVER run on the server host.
 */

const JUDGE0_BASE_URL = process.env.JUDGE0_URL || 'https://ce.judge0.com';
const EXECUTION_TIMEOUT_MS = Number(process.env.EXECUTION_TIMEOUT_MS) || 12000;

// Language mappings for Judge0 CE
const LANGUAGE_CONFIG = {
  java: { id: 62, name: 'Java (OpenJDK 13.0.1)' },
  python: { id: 71, name: 'Python (3.8.1)' },
  cpp: { id: 54, name: 'C++ (GCC 9.2.0)' },
};

/**
 * Normalizes string outputs for reliable comparison (trims trailing spaces/newlines, normalizes CRLF)
 */
function normalizeOutput(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();
}

/**
 * Executes a single code submission on the isolated sandbox
 */
async function executeSingle({ language, sourceCode, stdin = '', expectedOutput = '' }) {
  const lang = (language || '').toLowerCase().trim();
  const config = LANGUAGE_CONFIG[lang];

  if (!config) {
    throw new Error(`Unsupported programming language: ${language}. Supported languages: java, python, cpp.`);
  }

  if (!sourceCode || !sourceCode.trim()) {
    return {
      passed: false,
      stdout: '',
      stderr: 'No code provided.',
      compileOutput: null,
      time: 0,
      status: 'Empty Code',
      isError: true,
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), EXECUTION_TIMEOUT_MS);

  try {
    const url = `${JUDGE0_BASE_URL}/submissions?wait=true&base64_encoded=true`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        source_code: Buffer.from(sourceCode || '', 'utf8').toString('base64'),
        language_id: config.id,
        stdin: Buffer.from(stdin || '', 'utf8').toString('base64'),
        cpu_time_limit: 4.0,
        memory_limit: 128000,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Sandbox service error (${response.status}): ${errorText.slice(0, 200)}`);
    }

    const data = await response.json();
    const decodeB64 = (val) => {
      if (!val) return '';
      try {
        return Buffer.from(val, 'base64').toString('utf8');
      } catch {
        return String(val);
      }
    };

    const stdout = decodeB64(data.stdout).trimEnd();
    const stderr = decodeB64(data.stderr).trimEnd();
    const compileOutput = decodeB64(data.compile_output).trimEnd();
    const statusDesc = data.status?.description || 'Unknown';
    const statusId = data.status?.id;

    // Check status: 3 = Accepted
    const isCompileError = statusId === 6;
    const isTimeLimit = statusId === 5;
    const isRuntimeError = statusId >= 7 && statusId <= 12;

    const normalizedActual = normalizeOutput(stdout);
    const normalizedExpected = normalizeOutput(expectedOutput);
    const passed = statusId === 3 && normalizedActual === normalizedExpected;

    return {
      passed,
      stdout,
      stderr: compileOutput || stderr,
      compileOutput,
      time: Number(data.time || 0),
      memory: data.memory,
      status: isCompileError ? 'Compilation Error' :
              isTimeLimit ? 'Time Limit Exceeded' :
              isRuntimeError ? 'Runtime Error' :
              (passed ? 'Accepted' : 'Wrong Answer'),
      statusId,
      actualOutput: normalizedActual,
      expectedOutput: normalizedExpected,
    };
  } catch (err) {
    clearTimeout(timeoutId);
    const isAbort = err.name === 'AbortError';
    return {
      passed: false,
      stdout: '',
      stderr: isAbort ? 'Execution timed out while connecting to sandbox.' : (err.message || 'Execution error'),
      compileOutput: null,
      time: 0,
      status: isAbort ? 'Time Limit Exceeded' : 'Sandbox Error',
      isError: true,
    };
  }
}

/**
 * Runs code against sample / public test cases
 */
async function runSampleCases({ language, sourceCode, examples = [] }) {
  const results = [];

  for (let i = 0; i < examples.length; i++) {
    const ex = examples[i];
    const execResult = await executeSingle({
      language,
      sourceCode,
      stdin: ex.input,
      expectedOutput: ex.output,
    });

    results.push({
      caseNumber: i + 1,
      input: ex.input,
      expectedOutput: ex.output,
      actualOutput: execResult.stdout,
      passed: execResult.passed,
      status: execResult.status,
      time: execResult.time,
      error: execResult.stderr || null,
      explanation: ex.explanation || '',
    });

    // Short circuit if compilation error on first test case
    if (execResult.status === 'Compilation Error') {
      break;
    }
  }

  const allPassed = results.length > 0 && results.every(r => r.passed);
  return {
    success: true,
    allPassed,
    results,
  };
}

/**
 * Submits code against hidden test cases for final verdict
 */
async function evaluateSubmission({ language, sourceCode, testCases = [] }) {
  let passedCount = 0;
  let finalVerdict = 'Accepted';
  const caseResults = [];

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const execResult = await executeSingle({
      language,
      sourceCode,
      stdin: tc.input,
      expectedOutput: tc.expectedOutput,
    });

    if (execResult.passed) {
      passedCount++;
    } else if (finalVerdict === 'Accepted') {
      // First non-passing test sets the verdict
      finalVerdict = execResult.status;
    }

    caseResults.push({
      caseNumber: i + 1,
      passed: execResult.passed,
      status: execResult.status,
      time: execResult.time,
      error: execResult.stderr || null,
    });

    // If compilation error, stop running further cases
    if (execResult.status === 'Compilation Error') {
      finalVerdict = 'Compilation Error';
      break;
    }
  }

  return {
    verdict: finalVerdict,
    passedCount,
    totalCount: testCases.length,
    caseResults,
  };
}

module.exports = {
  LANGUAGE_CONFIG,
  executeSingle,
  runSampleCases,
  evaluateSubmission,
};
