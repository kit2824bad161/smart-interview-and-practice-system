import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  ExternalLink,
  Play,
  RotateCcw,
  Send,
  Terminal,
  XCircle,
  AlertCircle,
  Clock,
  Cpu,
  Layers,
  Sparkles,
  ChevronRight,
  Lightbulb,
  Unlock,
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import CodeEditor from '../components/CodeEditor';
import {
  getDsaTopics,
  listDsaProblems,
  getDsaProblem,
  runDsaCode,
  submitDsaCode,
  getDsaHint,
  getDsaSolution,
} from '../services/api';

const LANGUAGES = [
  { id: 'java', label: 'Java' },
  { id: 'python', label: 'Python' },
  { id: 'cpp', label: 'C++' },
];

export default function ProblemSolvingPage() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Navigation State
  const topicParam = searchParams.get('topic');
  const [selectedTopic, setSelectedTopic] = useState(topicParam || null);

  // Topics Catalog State
  const [topics, setTopics] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(true);

  // Topic Problems List State
  const [topicProblems, setTopicProblems] = useState([]);
  const [loadingProblems, setLoadingProblems] = useState(false);

  // Active Problem Workspace State
  const [currentProblem, setCurrentProblem] = useState(null);
  const [loadingProblem, setLoadingProblem] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('java');
  const [codeByLanguage, setCodeByLanguage] = useState({ java: '', python: '', cpp: '' });
  const [copied, setCopied] = useState(false);

  // Workspace Tabs
  const [activeLeftTab, setActiveLeftTab] = useState('problem'); // 'problem' | 'hints' | 'solution'

  // Test Console State
  const [consoleTab, setConsoleTab] = useState('samples'); // 'samples' | 'custom' | 'results' | 'submit'
  const [activeSampleIndex, setActiveSampleIndex] = useState(0);
  const [customInput, setCustomInput] = useState('');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResults, setRunResults] = useState(null);
  const [customRunResult, setCustomRunResult] = useState(null);
  const [submitVerdict, setSubmitVerdict] = useState(null);

  // Hints & Solution State
  const [hints, setHints] = useState([]);
  const [loadingHint, setLoadingHint] = useState(false);
  const [solutionData, setSolutionData] = useState(null);
  const [loadingSolution, setLoadingSolution] = useState(false);

  // 1. Fetch Topics list on mount
  useEffect(() => {
    async function loadTopics() {
      try {
        setLoadingTopics(true);
        const data = await getDsaTopics();
        setTopics(data.topics || []);
      } catch (err) {
        console.error('Failed to load topics:', err);
      } finally {
        setLoadingTopics(false);
      }
    }
    loadTopics();
  }, []);

  // Sync selectedTopic from URL query param
  useEffect(() => {
    if (topicParam) {
      setSelectedTopic(topicParam);
    }
  }, [topicParam]);

  // 2. Fetch problems when a topic is selected
  useEffect(() => {
    if (!selectedTopic || problemId) return;

    async function loadTopicProblems() {
      try {
        setLoadingProblems(true);
        const data = await listDsaProblems({ topic: selectedTopic });
        setTopicProblems(data.problems || []);
      } catch (err) {
        console.error('Failed to load problems for topic:', err);
      } finally {
        setLoadingProblems(false);
      }
    }
    loadTopicProblems();
  }, [selectedTopic, problemId]);

  // 3. Fetch problem details when problemId is active
  useEffect(() => {
    if (!problemId) {
      setCurrentProblem(null);
      return;
    }

    async function loadProblem() {
      try {
        setLoadingProblem(true);
        const prob = await getDsaProblem(problemId);
        setCurrentProblem(prob);

        // Populate starter codes
        const initialCode = {
          java: prob.starterCode?.java || '',
          python: prob.starterCode?.python || '',
          cpp: prob.starterCode?.cpp || '',
        };

        // If candidate previously worked on this problem, restore it
        if (prob.userCode) {
          const userLang = prob.userLanguage || 'java';
          setSelectedLanguage(userLang);
          initialCode[userLang] = prob.userCode;
        } else {
          setSelectedLanguage('java');
        }

        setCodeByLanguage(initialCode);

        // Reset execution state
        setRunResults(null);
        setCustomRunResult(null);
        setSubmitVerdict(null);
        setConsoleTab('samples');
        setActiveSampleIndex(0);
        setCustomInput(prob.examples?.[0]?.input || '');
        setHints([]);
        setSolutionData(null);
        setActiveLeftTab('problem');
      } catch (err) {
        console.error('Failed to load problem:', err);
      } finally {
        setLoadingProblem(false);
      }
    }
    loadProblem();
  }, [problemId]);

  // Handle topic selection
  const handleSelectTopic = (topicName) => {
    setSelectedTopic(topicName);
    setSearchParams({ topic: topicName });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle back to topics
  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setSearchParams({});
    setTopicProblems([]);
  };

  // Handle selecting a problem to solve
  const handleSelectProblem = (prob) => {
    const targetId = prob.slug || prob.problemId || prob._id;
    navigate(`/problem-solving/${targetId}`);
  };

  // Handle back from workspace to current topic list
  const handleBackToTopicProblems = () => {
    const topic = currentProblem?.topic || selectedTopic;
    setCurrentProblem(null);
    if (topic) {
      navigate(`/problem-solving?topic=${encodeURIComponent(topic)}`);
    } else {
      navigate('/problem-solving');
    }
  };

  // Code editor change
  const handleCodeChange = (newCode) => {
    setCodeByLanguage(prev => ({
      ...prev,
      [selectedLanguage]: newCode,
    }));
  };

  // Reset code to default starter code
  const handleResetCode = () => {
    if (!currentProblem) return;
    const starter = currentProblem.starterCode?.[selectedLanguage] || '';
    setCodeByLanguage(prev => ({
      ...prev,
      [selectedLanguage]: starter,
    }));
  };

  // Copy code to clipboard
  const handleCopyCode = () => {
    const code = codeByLanguage[selectedLanguage] || '';
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Run Code against sample test cases
  const handleRunCode = async (useCustom = false) => {
    if (!currentProblem || running) return;

    try {
      setRunning(true);
      const code = codeByLanguage[selectedLanguage] || '';
      const payload = {
        code,
        language: selectedLanguage,
        ...(useCustom ? { customInput } : {}),
      };

      const result = await runDsaCode(currentProblem.problemId || problemId, payload);

      if (useCustom) {
        setCustomRunResult(result.result);
        setConsoleTab('custom');
      } else {
        setRunResults(result);
        setConsoleTab('results');
      }
    } catch (err) {
      console.error('Run code error:', err);
      setRunResults({
        success: false,
        summary: { passedCount: 0, totalCount: currentProblem.examples?.length || 0, allPassed: false },
        results: [{ caseNumber: 1, passed: false, error: err.message || 'Execution error' }],
      });
      setConsoleTab('results');
    } finally {
      setRunning(false);
    }
  };

  // Submit Code against hidden test cases
  const handleSubmitCode = async () => {
    if (!currentProblem || submitting) return;

    try {
      setSubmitting(true);
      const code = codeByLanguage[selectedLanguage] || '';
      const result = await submitDsaCode(currentProblem.problemId || problemId, {
        code,
        language: selectedLanguage,
      });

      setSubmitVerdict(result);
      setConsoleTab('submit');
    } catch (err) {
      console.error('Submit code error:', err);
      setSubmitVerdict({
        verdict: 'Runtime Error',
        isAccepted: false,
        passedCount: 0,
        totalCount: currentProblem.totalTestCases || 5,
        failedTestCase: { error: err.message || 'Submission failed.' },
      });
      setConsoleTab('submit');
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch progressive hint
  const handleGetHint = async () => {
    if (!currentProblem || loadingHint) return;
    try {
      setLoadingHint(true);
      const code = codeByLanguage[selectedLanguage] || '';
      const data = await getDsaHint(currentProblem.problemId || problemId, {
        code,
        language: selectedLanguage,
      });
      setHints(prev => [...prev, data.hint]);
    } catch (err) {
      console.error('Hint error:', err);
    } finally {
      setLoadingHint(false);
    }
  };

  // Fetch optimal solution
  const handleGetSolution = async () => {
    if (!currentProblem || loadingSolution) return;
    try {
      setLoadingSolution(true);
      const data = await getDsaSolution(currentProblem.problemId || problemId, true);
      setSolutionData(data);
    } catch (err) {
      console.error('Solution error:', err);
    } finally {
      setLoadingSolution(false);
    }
  };

  // Difficulty color styling helper
  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Hard':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // =========================================================================
  // VIEW 1: PROBLEM CODING WORKSPACE (Desktop: 45% Left, 55% Right)
  // =========================================================================
  if (problemId || currentProblem) {
    if (loadingProblem) {
      return (
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-3">
            <span className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-600 border-t-transparent" />
            <p className="font-mono text-sm text-slate-600">Loading problem workspace...</p>
          </div>
        </div>
      );
    }

    if (!currentProblem) {
      return (
        <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
          <AlertCircle className="h-10 w-10 text-rose-500" />
          <h2 className="text-xl font-semibold text-slate-900">Problem Not Found</h2>
          <p className="max-w-md text-sm text-slate-600">
            The requested problem does not exist or may have been moved.
          </p>
          <Button onClick={handleBackToTopicProblems}>
            ← Back to Problem List
          </Button>
        </div>
      );
    }

    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col bg-white overflow-hidden">
        {/* Workspace Top Toolbar */}
        <header className="flex h-13 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
          {/* Left: Back & Problem Info */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={handleBackToTopicProblems}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <h1 className="truncate text-sm font-semibold text-slate-900">
              {currentProblem.title}
            </h1>
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${getDifficultyBadge(currentProblem.difficulty)}`}>
              {currentProblem.difficulty}
            </span>
            <span className="hidden sm:inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">
              {currentProblem.topic}
            </span>
          </div>

          {/* Right: Language Selector & Run / Submit Controls */}
          <div className="flex items-center gap-2.5">
            {/* Language Selector */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="language-select" className="sr-only">Language</label>
              <select
                id="language-select"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="h-8 rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-medium text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.id} value={lang.id}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Actions: Reset & Copy */}
            <button
              onClick={handleResetCode}
              title="Reset to starter code"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleCopyCode}
              title="Copy code"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            </button>

            {/* Run Button */}
            <button
              onClick={() => handleRunCode(false)}
              disabled={running || submitting}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-800 shadow-sm hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 transition-colors"
            >
              <Play className="h-3.5 w-3.5 text-slate-700" />
              <span>{running ? 'Running...' : 'Run'}</span>
            </button>

            {/* Submit Button */}
            <button
              onClick={handleSubmitCode}
              disabled={submitting || running}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{submitting ? 'Evaluating...' : 'Submit'}</span>
            </button>
          </div>
        </header>

        {/* Workspace Split Body */}
        <div className="flex flex-1 min-h-0 flex-col lg:flex-row overflow-hidden">
          {/* ================================================================= */}
          {/* LEFT PANEL (~45%): Problem Statement, Input/Output, Examples      */}
          {/* ================================================================= */}
          <div className="flex w-full lg:w-[45%] flex-col border-r border-slate-200 bg-white min-h-0">
            {/* Left Header Tabs: Problem | Hints | Solution */}
            <div className="flex h-10 shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 px-4">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveLeftTab('problem')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    activeLeftTab === 'problem'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Problem
                </button>
                <button
                  onClick={() => setActiveLeftTab('hints')}
                  className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    activeLeftTab === 'hints'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Lightbulb className="h-3 w-3 text-amber-500" />
                  <span>Hints {hints.length > 0 && `(${hints.length})`}</span>
                </button>
                <button
                  onClick={() => setActiveLeftTab('solution')}
                  className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    activeLeftTab === 'solution'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Unlock className="h-3 w-3 text-slate-500" />
                  <span>Solution</span>
                </button>
              </div>
            </div>

            {/* Left Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeLeftTab === 'problem' && (
                <>
                  {/* Title & Topic Meta */}
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      {currentProblem.title}
                    </h2>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getDifficultyBadge(currentProblem.difficulty)}`}>
                        {currentProblem.difficulty}
                      </span>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                        {currentProblem.topic}
                      </span>
                    </div>
                  </div>

                  {/* Problem Statement */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Problem Statement
                    </h3>
                    <div className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                      {currentProblem.problemStatement}
                    </div>
                  </div>

                  {/* Input Format */}
                  {currentProblem.inputFormat && (
                    <div className="space-y-1.5">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Input Format
                      </h3>
                      <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-line">
                        {currentProblem.inputFormat}
                      </div>
                    </div>
                  )}

                  {/* Output Format */}
                  {currentProblem.outputFormat && (
                    <div className="space-y-1.5">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Output Format
                      </h3>
                      <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-line">
                        {currentProblem.outputFormat}
                      </div>
                    </div>
                  )}

                  {/* Constraints */}
                  {currentProblem.constraints && currentProblem.constraints.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Constraints
                      </h3>
                      <ul className="space-y-1 rounded-lg border border-slate-200 bg-slate-50 p-3.5">
                        {currentProblem.constraints.map((c, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs font-mono text-slate-700">
                            <span className="text-slate-400">•</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Examples */}
                  {currentProblem.examples && currentProblem.examples.length > 0 && (
                    <div className="space-y-4 pt-2 border-t border-slate-200">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Examples
                      </h3>
                      <div className="space-y-4">
                        {currentProblem.examples.map((ex, index) => (
                          <div key={index} className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
                            <div className="text-xs font-bold text-slate-900">
                              Example {index + 1}
                            </div>
                            <div className="space-y-2 text-xs font-mono">
                              <div>
                                <span className="text-slate-500 font-sans font-medium block mb-1">Input:</span>
                                <pre className="rounded-md bg-slate-900 p-2.5 text-slate-100 overflow-x-auto">
                                  {ex.input}
                                </pre>
                              </div>
                              <div>
                                <span className="text-slate-500 font-sans font-medium block mb-1">Output:</span>
                                <pre className="rounded-md bg-slate-900 p-2.5 text-emerald-400 overflow-x-auto">
                                  {ex.output}
                                </pre>
                              </div>
                              {ex.explanation && (
                                <div className="pt-1 font-sans text-xs text-slate-600">
                                  <strong className="text-slate-700">Explanation: </strong>
                                  {ex.explanation}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Hints Tab */}
              {activeLeftTab === 'hints' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900">Algorithmic Hints</h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleGetHint}
                      disabled={loadingHint || hints.length >= 3}
                    >
                      {loadingHint ? 'Generating Hint...' : hints.length >= 3 ? 'All Hints Unlocked' : `Unlock Hint ${hints.length + 1}`}
                    </Button>
                  </div>
                  {hints.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-500">
                      Click "Unlock Hint 1" to get progressive guidance on solving this problem without revealing the full answer.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {hints.map((h, idx) => (
                        <div key={idx} className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
                          <div className="text-xs font-semibold text-amber-900 mb-1">
                            Hint {idx + 1}
                          </div>
                          <p className="text-xs text-amber-800 leading-relaxed">{h}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Solution Tab */}
              {activeLeftTab === 'solution' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900">Optimal Reference Solution</h3>
                    {!solutionData && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={handleGetSolution}
                        disabled={loadingSolution}
                      >
                        {loadingSolution ? 'Loading...' : 'Reveal Solution'}
                      </Button>
                    )}
                  </div>
                  {!solutionData ? (
                    <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-500">
                      Try to solve the problem on your own first! If you are stuck, click "Reveal Solution" to view the optimal algorithm and reference code.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                        <div className="text-xs font-semibold text-slate-900">Approach & Analysis</div>
                        <p className="text-xs text-slate-700 leading-relaxed">{solutionData.approach}</p>
                        <div className="flex items-center gap-4 text-xs font-mono text-slate-600 pt-2 border-t border-slate-200">
                          <span>Time: {solutionData.timeComplexity}</span>
                          <span>Space: {solutionData.spaceComplexity}</span>
                        </div>
                      </div>
                      {solutionData.code?.[selectedLanguage] && (
                        <div className="rounded-xl border border-slate-800 bg-[#1e1e1e] p-4">
                          <div className="text-xs font-mono text-slate-400 mb-2 uppercase">
                            Optimal {selectedLanguage} Code:
                          </div>
                          <pre className="text-xs font-mono text-slate-100 overflow-x-auto">
                            {solutionData.code[selectedLanguage]}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ================================================================= */}
          {/* RIGHT PANEL (~55%): Professional Code Editor & Test Console       */}
          {/* ================================================================= */}
          <div className="flex w-full lg:w-[55%] flex-col bg-[#1e1e1e] min-h-0">
            {/* Monaco Code Editor Container */}
            <div className="flex-1 min-h-[300px] overflow-hidden">
              <CodeEditor
                value={codeByLanguage[selectedLanguage] || ''}
                onChange={handleCodeChange}
                language={selectedLanguage}
                height="100%"
              />
            </div>

            {/* Bottom Test Console Panel */}
            <div className="h-64 shrink-0 flex flex-col border-t border-slate-800 bg-[#141414]">
              {/* Console Tabs Header */}
              <div className="flex h-9 shrink-0 items-center justify-between border-b border-slate-800/90 bg-[#181818] px-3">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setConsoleTab('samples')}
                    className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                      consoleTab === 'samples'
                        ? 'bg-[#252525] text-slate-200'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Test Cases
                  </button>
                  <button
                    onClick={() => setConsoleTab('custom')}
                    className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                      consoleTab === 'custom'
                        ? 'bg-[#252525] text-slate-200'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Custom Input
                  </button>
                  <button
                    onClick={() => setConsoleTab('results')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded transition-colors ${
                      consoleTab === 'results'
                        ? 'bg-[#252525] text-slate-200'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>Run Results</span>
                    {runResults && (
                      <span className={`inline-block h-1.5 w-1.5 rounded-full ${
                        runResults.summary?.allPassed ? 'bg-emerald-400' : 'bg-rose-400'
                      }`} />
                    )}
                  </button>
                  <button
                    onClick={() => setConsoleTab('submit')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded transition-colors ${
                      consoleTab === 'submit'
                        ? 'bg-[#252525] text-slate-200'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>Submission Verdict</span>
                    {submitVerdict && (
                      <span className={`inline-block h-1.5 w-1.5 rounded-full ${
                        submitVerdict.isAccepted ? 'bg-emerald-400' : 'bg-rose-400'
                      }`} />
                    )}
                  </button>
                </div>

                {/* Status Indicator */}
                <div className="text-[11px] font-mono text-slate-500">
                  {running && <span className="text-amber-400">Executing...</span>}
                  {submitting && <span className="text-emerald-400">Evaluating against test suite...</span>}
                </div>
              </div>

              {/* Console Body */}
              <div className="flex-1 overflow-y-auto p-4 text-xs font-mono text-slate-300">
                {/* 1. SAMPLES TAB */}
                {consoleTab === 'samples' && (
                  <div className="space-y-3">
                    {/* Case selector pills */}
                    <div className="flex items-center gap-2">
                      {(currentProblem.examples || []).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveSampleIndex(idx)}
                          className={`rounded px-2.5 py-1 text-xs transition-colors ${
                            activeSampleIndex === idx
                              ? 'bg-slate-700 text-white font-semibold'
                              : 'bg-[#202020] text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          Case {idx + 1}
                        </button>
                      ))}
                    </div>

                    {currentProblem.examples?.[activeSampleIndex] ? (
                      <div className="space-y-2">
                        <div>
                          <div className="text-slate-400 text-[11px] mb-1">Input:</div>
                          <pre className="rounded bg-[#1a1a1a] p-2 text-slate-200 border border-slate-800">
                            {currentProblem.examples[activeSampleIndex].input}
                          </pre>
                        </div>
                        <div>
                          <div className="text-slate-400 text-[11px] mb-1">Expected Output:</div>
                          <pre className="rounded bg-[#1a1a1a] p-2 text-emerald-400 border border-slate-800">
                            {currentProblem.examples[activeSampleIndex].output}
                          </pre>
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-500">No sample test cases configured.</div>
                    )}
                  </div>
                )}

                {/* 2. CUSTOM INPUT TAB */}
                {consoleTab === 'custom' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Enter stdin test input:</span>
                      <button
                        onClick={() => handleRunCode(true)}
                        disabled={running}
                        className="rounded bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-xs text-slate-200 disabled:opacity-50"
                      >
                        {running ? 'Running...' : 'Run with Custom Input'}
                      </button>
                    </div>
                    <textarea
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      rows={4}
                      placeholder="Paste input here..."
                      className="w-full rounded bg-[#1a1a1a] p-2.5 text-xs text-slate-100 border border-slate-800 focus:outline-none focus:border-slate-600 font-mono resize-none"
                    />
                    {customRunResult && (
                      <div className="mt-2 space-y-1">
                        <div className="text-slate-400 text-[11px]">Execution Output:</div>
                        <pre className="rounded bg-[#101010] p-2.5 text-slate-100 border border-slate-800 whitespace-pre-wrap">
                          {customRunResult.actualOutput || customRunResult.error || '(No output)'}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. RUN RESULTS TAB */}
                {consoleTab === 'results' && (
                  <div>
                    {!runResults ? (
                      <div className="flex h-32 flex-col items-center justify-center text-slate-500 gap-2">
                        <Play className="h-6 w-6 text-slate-600" />
                        <span>Click [Run] to execute your solution against sample test cases.</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-semibold ${
                              runResults.summary?.allPassed ? 'text-emerald-400' : 'text-rose-400'
                            }`}>
                              {runResults.summary?.allPassed ? 'All Samples Passed' : 'Test Cases Failed'}
                            </span>
                            <span className="text-slate-400 text-xs">
                              ({runResults.summary?.passedCount} / {runResults.summary?.totalCount} passed)
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {runResults.results?.map((res, i) => (
                            <div key={i} className="rounded bg-[#1a1a1a] p-3 border border-slate-800 space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  {res.passed ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-rose-400" />
                                  )}
                                  <span className="font-semibold text-slate-200">
                                    Test Case {res.caseNumber}
                                  </span>
                                </div>
                                <span className="text-[11px] text-slate-500">
                                  {res.time ? `${res.time}s` : ''}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                <div>
                                  <span className="text-slate-500 text-[10px] block">Expected:</span>
                                  <pre className="rounded bg-[#111] p-1.5 text-slate-300 overflow-x-auto">
                                    {res.expectedOutput || '(empty)'}
                                  </pre>
                                </div>
                                <div>
                                  <span className="text-slate-500 text-[10px] block">Your Output:</span>
                                  <pre className={`rounded bg-[#111] p-1.5 overflow-x-auto ${
                                    res.passed ? 'text-emerald-400' : 'text-rose-400'
                                  }`}>
                                    {res.actualOutput || res.error || '(empty)'}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. SUBMISSION VERDICT TAB */}
                {consoleTab === 'submit' && (
                  <div>
                    {!submitVerdict ? (
                      <div className="flex h-32 flex-col items-center justify-center text-slate-500 gap-2">
                        <Send className="h-6 w-6 text-slate-600" />
                        <span>Click [Submit] to evaluate your solution against the full hidden test suite.</span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Verdict Header */}
                        <div className={`rounded-lg p-4 border flex items-center justify-between ${
                          submitVerdict.isAccepted
                            ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                            : 'bg-rose-950/40 border-rose-800 text-rose-300'
                        }`}>
                          <div className="flex items-center gap-3">
                            {submitVerdict.isAccepted ? (
                              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                            ) : (
                              <XCircle className="h-6 w-6 text-rose-400" />
                            )}
                            <div>
                              <div className="text-base font-bold tracking-tight">
                                {submitVerdict.verdict}
                              </div>
                              <div className="text-xs opacity-80">
                                {submitVerdict.isAccepted
                                  ? 'Congratulations! All public and hidden test cases passed.'
                                  : 'Solution did not pass all test cases.'}
                              </div>
                            </div>
                          </div>

                          <div className="text-right font-mono text-xs">
                            <div>Passed: {submitVerdict.passedCount} / {submitVerdict.totalCount}</div>
                            {submitVerdict.runtime && <div className="text-[11px] opacity-75">Runtime: {submitVerdict.runtime}s</div>}
                          </div>
                        </div>

                        {/* If Failed on a test case (input and error shown without exposing hidden expected answer) */}
                        {!submitVerdict.isAccepted && submitVerdict.failedTestCase && (
                          <div className="rounded-lg bg-[#1a1a1a] p-3 border border-slate-800 space-y-2 text-xs">
                            <div className="text-slate-400 font-semibold">
                              Failed on Test Case #{submitVerdict.failedTestCase.index || 1}:
                            </div>
                            {submitVerdict.failedTestCase.input && (
                              <div>
                                <span className="text-slate-500 text-[10px] block">Input:</span>
                                <pre className="rounded bg-[#101010] p-2 text-slate-300 overflow-x-auto">
                                  {submitVerdict.failedTestCase.input}
                                </pre>
                              </div>
                            )}
                            {submitVerdict.failedTestCase.actualOutput && (
                              <div>
                                <span className="text-slate-500 text-[10px] block">Your Output:</span>
                                <pre className="rounded bg-[#101010] p-2 text-rose-400 overflow-x-auto">
                                  {submitVerdict.failedTestCase.actualOutput}
                                </pre>
                              </div>
                            )}
                            {submitVerdict.failedTestCase.error && (
                              <div>
                                <span className="text-slate-500 text-[10px] block">Error Details:</span>
                                <pre className="rounded bg-[#101010] p-2 text-rose-400 whitespace-pre-wrap">
                                  {submitVerdict.failedTestCase.error}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: TOPIC PROBLEMS LIST VIEW (When a topic is selected)
  // =========================================================================
  if (selectedTopic) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Header & Back Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <button
                onClick={handleBackToTopics}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors mb-2"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to DSA Topics</span>
              </button>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {selectedTopic}
              </h1>
              <p className="text-xs font-mono text-slate-500">
                4 Easy · 3 Medium · 3 Hard (Total: 10 Problems)
              </p>
            </div>
          </div>

          {/* Problem List */}
          {loadingProblems ? (
            <div className="flex h-64 items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
                <span className="text-xs text-slate-500 font-mono">Loading curated problems...</span>
              </div>
            </div>
          ) : topicProblems.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
              No problems found for this topic.
            </div>
          ) : (
            <div className="space-y-3">
              {topicProblems.map((prob, index) => (
                <div
                  key={prob._id || prob.slug || index}
                  className="group rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs text-slate-400 font-medium">
                        {String(index + 1).padStart(2, '0')}.
                      </span>
                      <h3 className="text-sm font-semibold text-slate-900 truncate">
                        {prob.title}
                      </h3>
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${getDifficultyBadge(prob.difficulty)}`}>
                        {prob.difficulty}
                      </span>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                        {prob.topic}
                      </span>
                    </div>
                    {prob.summary && (
                      <p className="text-xs text-slate-600 line-clamp-1 pl-6">
                        {prob.summary}
                      </p>
                    )}
                  </div>

                  {/* Solve Button */}
                  <div className="shrink-0 pl-6 sm:pl-0">
                    <button
                      onClick={() => handleSelectProblem(prob)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800 transition-colors"
                    >
                      <span>Solve</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: DSA TOPIC LANDING PAGE (20 Curated DSA Topics)
  // =========================================================================
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header Banner */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Problem Solving
          </h1>
          <p className="text-sm text-slate-600">
            Curated Data Structures & Algorithms topic tracks. Exactly 10 placement problems per topic (4 Easy, 3 Medium, 3 Hard).
          </p>
        </div>

        {/* 20 Topic Grid */}
        {loadingTopics ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
              <span className="text-xs text-slate-500 font-mono">Loading DSA topics...</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topics.map((topic, index) => (
              <div
                key={topic.key || index}
                onClick={() => handleSelectTopic(topic.name)}
                className="group cursor-pointer rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-medium text-slate-400">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-100">
                      10 Problems
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {topic.name}
                  </h3>
                  <div className="mt-2 text-xs font-mono text-slate-500">
                    4 Easy · 3 Med · 3 Hard
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-emerald-600 group-hover:text-emerald-700">
                  <span>Explore Problems</span>
                  <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
