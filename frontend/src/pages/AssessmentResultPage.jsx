import {
  AlertCircle,
  ArrowLeft,
  Award,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Mic,
  ShieldCheck,
  Target,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import { getAssessmentResult } from '../services/api';

export default function AssessmentResultPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'aptitude' | 'technical' | 'interview'

  useEffect(() => {
    let isMounted = true;
    getAssessmentResult()
      .then((res) => {
        if (!isMounted) return;
        setData(res.result);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.response?.data?.message || 'Unable to load consolidated assessment results.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[500px] max-w-4xl flex-col items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        <p className="mt-4 font-semibold text-slate-600">Loading Consolidated Assessment Dossier...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <AlertCircle className="mx-auto text-red-500" size={48} />
        <h2 className="mt-4 font-display text-2xl font-bold text-slate-800">Assessment Incomplete</h2>
        <p className="mt-2 text-sm text-slate-600">
          {error || 'You have not yet finalized all eligible rounds of the hiring assessment.'}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="secondary" onClick={() => navigate('/assessment')}>
            Return to Assessment Hub
          </Button>
        </div>
      </div>
    );
  }

  const rounds = data.rounds || {};
  const apt = rounds.aptitude || {};
  const tech = rounds.technical || {};
  const interview = rounds.interview || {};

  const isFinalPass = data.finalStatus === 'PASS';
  const isFinalFail = data.finalStatus === 'FAIL';

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:py-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-accent">
              SmartInterview AI
            </span>
            <span className="text-xs text-slate-400">Consolidated Hiring Assessment</span>
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold text-slate-900 md:text-4xl">
            Candidate Assessment Dossier
          </h1>
          <p className="text-sm text-slate-500">
            Role: <strong>{data.jobRole}</strong> ({data.experience})
          </p>
        </div>

        <Link to="/dashboard" className="btn-secondary">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      {/* Overall Assessment Status Banner */}
      <div className="mt-6">
        {isFinalPass ? (
          <div className="flex items-start gap-4 rounded-2xl border-2 border-emerald-300 bg-emerald-50/80 p-6 text-emerald-900 shadow-sm">
            <CheckCircle2 className="mt-1 shrink-0 text-emerald-600" size={32} />
            <div>
              <span className="rounded-full bg-emerald-200 px-3 py-0.5 text-xs font-black uppercase tracking-wider text-emerald-800">
                HIRING QUALIFICATION: PASSED
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold">
                Candidate Successfully Cleared All 3 Hiring Rounds!
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-emerald-800">
                You achieved passing marks across Aptitude, Technical MCQ, and the One-on-One AI Voice Interview with a weighted aggregate score of <strong>{data.overallScore}%</strong>.
              </p>
            </div>
          </div>
        ) : isFinalFail ? (
          <div className="flex items-start gap-4 rounded-2xl border-2 border-red-200 bg-red-50/80 p-6 text-red-900 shadow-sm">
            <XCircle className="mt-1 shrink-0 text-red-600" size={32} />
            <div>
              <span className="rounded-full bg-red-200 px-3 py-0.5 text-xs font-black uppercase tracking-wider text-red-800">
                HIRING ASSESSMENT: NOT QUALIFIED
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold">
                Did Not Meet Overall Qualification Criteria
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-red-800">
                One or more rounds did not achieve the required threshold score. Review the breakdown below for detailed feedback.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-4 rounded-2xl border-2 border-indigo-200 bg-indigo-50/80 p-6 text-indigo-900 shadow-sm">
            <Sparkles className="mt-1 shrink-0 text-accent" size={32} />
            <div>
              <span className="rounded-full bg-indigo-200 px-3 py-0.5 text-xs font-black uppercase tracking-wider text-accent">
                HIRING ASSESSMENT: IN PROGRESS
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold">
                Assessment In Progress
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-indigo-800">
                One or more rounds are currently in progress or awaiting completion. Complete all stages to receive your finalized hiring evaluation.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3 Staged Rounds Cards Grid */}
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {/* Round 1: Aptitude */}
        <Card className="flex flex-col justify-between border-2 border-slate-200 p-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-accent">
                <Target size={18} />
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  apt.passed
                    ? 'bg-emerald-100 text-emerald-700'
                    : apt.status === 'FAILED'
                    ? 'bg-red-100 text-red-700'
                    : apt.status === 'IN_PROGRESS'
                    ? 'bg-indigo-100 text-accent'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {apt.passed
                  ? 'PASSED'
                  : apt.status === 'FAILED'
                  ? 'FAILED'
                  : apt.status === 'IN_PROGRESS'
                  ? 'IN PROGRESS'
                  : 'NOT STARTED'}
              </span>
            </div>

            <h3 className="mt-4 font-display text-lg font-bold text-slate-900">Round 1 – Aptitude</h3>
            <p className="text-xs text-slate-500">20 Questions • 25 Minutes</p>

            <div className="mt-6 flex items-baseline gap-1.5">
              <span className="font-display text-4xl font-extrabold text-slate-900">{apt.score}</span>
              <span className="text-sm font-bold text-slate-400">/ 20</span>
              <span className="ml-2 text-xs font-bold text-slate-500">({apt.percentage}%)</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">Passing criteria: 15 / 20</p>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-600">
            <span>{apt.correctCount} Correct • {apt.incorrectCount} Wrong</span>
          </div>
        </Card>

        {/* Round 2: Technical MCQ */}
        <Card className="flex flex-col justify-between border-2 border-slate-200 p-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-accent">
                <ShieldCheck size={18} />
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  tech.passed
                    ? 'bg-emerald-100 text-emerald-700'
                    : tech.status === 'FAILED'
                    ? 'bg-red-100 text-red-700'
                    : tech.status === 'LOCKED'
                    ? 'bg-slate-200 text-slate-600'
                    : tech.status === 'IN_PROGRESS'
                    ? 'bg-indigo-100 text-accent'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tech.passed
                  ? 'PASSED'
                  : tech.status === 'FAILED'
                  ? 'FAILED'
                  : tech.status === 'LOCKED'
                  ? 'LOCKED'
                  : tech.status === 'IN_PROGRESS'
                  ? 'IN PROGRESS'
                  : 'NOT STARTED'}
              </span>
            </div>

            <h3 className="mt-4 font-display text-lg font-bold text-slate-900">Round 2 – Technical MCQ</h3>
            <p className="text-xs text-slate-500">20 Questions • 25 Minutes</p>

            <div className="mt-6 flex items-baseline gap-1.5">
              <span className="font-display text-4xl font-extrabold text-slate-900">{tech.score}</span>
              <span className="text-sm font-bold text-slate-400">/ 20</span>
              <span className="ml-2 text-xs font-bold text-slate-500">({tech.percentage}%)</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">Passing criteria: 15 / 20</p>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-600">
            <span>{tech.correctCount} Correct • {tech.incorrectCount} Wrong</span>
          </div>
        </Card>

        {/* Round 3: One-on-One AI Interview */}
        <Card className="flex flex-col justify-between border-2 border-slate-200 p-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-accent">
                <Mic size={18} />
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  interview.passed
                    ? 'bg-emerald-100 text-emerald-700'
                    : interview.status === 'FAILED'
                    ? 'bg-red-100 text-red-700'
                    : interview.status === 'LOCKED'
                    ? 'bg-slate-200 text-slate-600'
                    : interview.status === 'IN_PROGRESS'
                    ? 'bg-indigo-100 text-accent'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {interview.passed
                  ? 'PASSED'
                  : interview.status === 'FAILED'
                  ? 'FAILED'
                  : interview.status === 'LOCKED'
                  ? 'LOCKED'
                  : interview.status === 'IN_PROGRESS'
                  ? 'IN PROGRESS'
                  : 'NOT STARTED'}
              </span>
            </div>

            <h3 className="mt-4 font-display text-lg font-bold text-slate-900">Round 3 – AI Interview</h3>
            <p className="text-xs text-slate-500">Voice-First One-on-One Evaluation</p>

            <div className="mt-6 flex items-baseline gap-1.5">
              <span className="font-display text-4xl font-extrabold text-slate-900">{interview.score}</span>
              <span className="text-sm font-bold text-slate-400">/ 100</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">Passing criteria: 60 / 100</p>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-600">
            <span>{interview.questions?.length || 5} Questions Evaluated</span>
          </div>
        </Card>
      </div>

      {/* Tabs Navigation for Detailed Reviews */}
      <div className="mt-10 border-b border-slate-200">
        <div className="flex gap-2 overflow-x-auto">
          <TabButton
            active={activeTab === 'summary'}
            onClick={() => setActiveTab('summary')}
            label="AI Interview Competencies"
          />
          <TabButton
            active={activeTab === 'aptitude'}
            onClick={() => setActiveTab('aptitude')}
            label={`Aptitude Review (${apt.review?.length || 0})`}
          />
          <TabButton
            active={activeTab === 'technical'}
            onClick={() => setActiveTab('technical')}
            label={`Technical Review (${tech.review?.length || 0})`}
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* Tab 1: AI Interview Competencies */}
        {activeTab === 'summary' && (
          <Card className="p-6 md:p-8">
            <h3 className="font-display text-xl font-bold text-slate-900">
              One-on-One AI Interview Breakdown
            </h3>
            <p className="text-xs text-slate-500">
              Real-time multi-dimensional scoring generated by the backend AI evaluation engine.
            </p>

            {interview.finalEvaluation ? (
              <div className="mt-6 space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <MetricCard label="Technical Knowledge" value={interview.finalEvaluation.technicalScore} />
                  <MetricCard label="Communication" value={interview.finalEvaluation.communicationScore} />
                  <MetricCard label="Answer Relevance" value={interview.finalEvaluation.relevanceScore} />
                  <MetricCard label="Clarity of Thought" value={interview.finalEvaluation.clarityScore} />
                  <MetricCard label="Problem Solving" value={interview.finalEvaluation.problemSolvingScore} />
                  <MetricCard label="Overall Score" value={interview.finalEvaluation.overallScore} highlight />
                </div>

                {interview.finalEvaluation.overallFeedback && (
                  <div className="rounded-2xl bg-slate-50 p-5 text-sm leading-relaxed text-slate-700">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Interviewer Observations</p>
                    <p className="mt-2">{interview.finalEvaluation.overallFeedback}</p>
                  </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
                    <h4 className="flex items-center gap-2 font-display text-sm font-bold text-emerald-900">
                      <CheckCircle2 size={16} className="text-emerald-600" /> Key Strengths
                    </h4>
                    <ul className="mt-3 list-inside list-disc space-y-1.5 text-xs text-emerald-800">
                      {interview.finalEvaluation.strengths?.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5">
                    <h4 className="flex items-center gap-2 font-display text-sm font-bold text-amber-900">
                      <AlertCircle size={16} className="text-amber-600" /> Areas for Improvement
                    </h4>
                    <ul className="mt-3 list-inside list-disc space-y-1.5 text-xs text-amber-800">
                      {interview.finalEvaluation.weaknesses?.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">Interview evaluation not yet recorded.</p>
            )}
          </Card>
        )}

        {/* Tab 2: Aptitude Review */}
        {activeTab === 'aptitude' && (
          <div className="space-y-4">
            {apt.review?.map((q) => (
              <ReviewCard key={q.questionNumber} item={q} />
            ))}
          </div>
        )}

        {/* Tab 3: Technical Review */}
        {activeTab === 'technical' && (
          <div className="space-y-4">
            {tech.review?.map((q) => (
              <ReviewCard key={q.questionNumber} item={q} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-b-2 px-5 py-3 text-sm font-bold transition whitespace-nowrap ${
        active
          ? 'border-accent text-accent'
          : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
      }`}
    >
      {label}
    </button>
  );
}

function MetricCard({ label, value, highlight = false }) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        highlight
          ? 'border-indigo-200 bg-indigo-50/80 text-accent'
          : 'border-slate-200 bg-white text-slate-800'
      }`}
    >
      <p className="text-[11px] font-bold uppercase tracking-wider opacity-70">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold">{value !== undefined ? `${value}%` : 'N/A'}</p>
    </div>
  );
}

function ReviewCard({ item }) {
  const isCorrect = Boolean(item.isCorrect);

  return (
    <Card
      className={`border-2 p-5 ${
        isCorrect ? 'border-emerald-200 bg-emerald-50/20' : 'border-red-200 bg-red-50/20'
      }`}
    >
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="text-slate-500">Question #{item.questionNumber}</span>
        <span
          className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 ${
            isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {isCorrect ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
          {isCorrect ? 'Correct' : 'Incorrect'}
        </span>
      </div>

      <p className="mt-3 font-display text-base font-bold text-slate-900">{item.question}</p>

      <div className="mt-4 grid gap-3 text-xs sm:grid-cols-2">
        <div className="rounded-lg bg-white/80 p-3 border border-slate-200">
          <p className="font-bold text-slate-400 uppercase">Your Answer</p>
          <p className="mt-1 font-semibold text-slate-800">{item.candidateAnswer || 'None'}</p>
        </div>
        <div className="rounded-lg bg-emerald-50 p-3 border border-emerald-200">
          <p className="font-bold text-emerald-600 uppercase">Correct Answer</p>
          <p className="mt-1 font-bold text-emerald-950">{item.correctAnswer}</p>
        </div>
      </div>

      {item.explanation && (
        <p className="mt-3 text-xs leading-relaxed text-slate-600">
          <strong>Explanation:</strong> {item.explanation}
        </p>
      )}
    </Card>
  );
}
