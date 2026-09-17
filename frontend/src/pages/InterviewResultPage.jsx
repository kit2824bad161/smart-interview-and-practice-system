import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  Target,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/Badge';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { getInterviewResult } from '../services/api';

export default function InterviewResultPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = localStorage.getItem('smart_interview_id');
    if (!id) {
      setError('No completed mock interview was found in this session.');
      return;
    }
    getInterviewResult(id)
      .then(setResult)
      .catch((err) =>
        setError(err.response?.data?.message || 'Unable to load interview feedback dossier.')
      );
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-4xl p-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <AlertCircle size={26} />
        </div>
        <h2 className="mt-4 font-display text-xl font-bold text-navy-900">Result Not Found</h2>
        <p className="mt-2 text-xs text-slate-500">{error}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/interview/setup" className="btn-primary inline-flex items-center gap-2">
            Start New Interview <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="mx-auto flex min-h-[400px] max-w-5xl flex-col items-center justify-center p-12 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        <p className="mt-4 font-semibold text-slate-600">Compiling interview evaluation dossier...</p>
      </div>
    );
  }

  const evaluations = result.questions?.map((item) => item.evaluation || {}) || [];
  const average = (key) =>
    evaluations.length
      ? Math.round(
          evaluations.reduce((sum, item) => sum + Number(item[key] || 0), 0) / evaluations.length
        )
      : 0;

  const strengths = [...new Set(evaluations.flatMap((item) => item.strengths || []))].slice(0, 6);
  const improvements = [
    ...new Set(evaluations.flatMap((item) => item.improvementSuggestions || [])),
  ].slice(0, 6);
  const missing = [...new Set(evaluations.flatMap((item) => item.missingConcepts || []))].slice(0, 10);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="success">
              <CheckCircle2 size={13} className="mr-1 inline" /> Session Complete
            </Badge>
            <span className="text-xs font-semibold text-slate-400">Mock Evaluation Dossier</span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-navy-900 md:text-4xl">
            Interview Performance Dossier
          </h1>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500 md:text-sm">
            {result.finalFeedback?.overallFeedback ||
              'Consolidated diagnostic feedback from your AI-proctored technical simulation.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/interview/history"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft size={15} /> All History
          </Link>
          <Link to="/interview/setup" className="btn-primary inline-flex items-center gap-2 text-xs">
            Practice Again <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* Top Scorecard Grid */}
      <div className="grid gap-6 lg:grid-cols-[.75fr_1.25fr]">
        {/* Executive Circular Gauge Card */}
        <Card className="flex flex-col items-center justify-center border-slate-800 bg-navy-950 p-8 text-center text-white shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Composite Performance
          </span>

          <div
            className="relative mt-6 flex h-52 w-52 items-center justify-center rounded-full"
            style={{
              background: `conic-gradient(#10b981 ${result.overallScore * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
            }}
          >
            <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full bg-navy-950 shadow-inner">
              <span className="font-display text-5xl font-extrabold tracking-tight text-white">
                {result.overallScore}
                <span className="text-2xl font-semibold text-slate-400">%</span>
              </span>
              <span className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Overall Rating
              </span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold text-slate-200">
            <Sparkles size={14} className="text-emerald-400" />
            <span>{result.finalFeedback?.readinessLevel || 'Interview Readiness Verified'}</span>
          </div>
        </Card>

        {/* Competency Breakdown Card */}
        <Card className="p-6 md:p-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <TrendingUp size={17} />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-navy-900">
                Core Competency Evaluation
              </h2>
              <p className="text-xs text-slate-400">
                Averaged signal across all submitted answers
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <ProgressBar
              label="Technical Correctness"
              value={average('technicalCorrectness')}
              color="bg-brand-500"
            />
            <ProgressBar
              label="Relevance & Focus"
              value={average('relevance')}
              color="bg-indigo-500"
            />
            <ProgressBar
              label="Completeness & Depth"
              value={average('completeness')}
              color="bg-amber-500"
            />
            <ProgressBar
              label="Communication & Clarity"
              value={average('communication')}
              color="bg-emerald-500"
            />
          </div>
        </Card>
      </div>

      {/* Strengths & Growth Areas */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 md:p-7">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={17} />
            </div>
            <h3 className="font-display text-base font-bold text-navy-900">Key Strengths Demonstrated</h3>
          </div>
          <ul className="mt-5 space-y-3 text-xs leading-relaxed text-slate-600">
            {strengths.map((x) => (
              <li key={x} className="flex items-start gap-2.5">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 md:p-7">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <XCircle size={17} />
            </div>
            <h3 className="font-display text-base font-bold text-navy-900">Recommended Growth Areas</h3>
          </div>
          <ul className="mt-5 space-y-3 text-xs leading-relaxed text-slate-600">
            {improvements.map((x) => (
              <li key={x} className="flex items-start gap-2.5">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Missing Concepts & Recommended Learning */}
      <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <Target size={17} />
            </div>
            <h3 className="font-display text-base font-bold text-navy-900">Missing Concepts</h3>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {missing.length > 0 ? (
              missing.map((x) => (
                <span
                  key={x}
                  className="rounded-lg border border-rose-200 bg-rose-50/80 px-2.5 py-1.5 text-xs font-semibold text-rose-700"
                >
                  {x}
                </span>
              ))
            ) : (
              <span className="text-xs italic text-slate-400">None detected — great coverage!</span>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Lightbulb size={17} />
            </div>
            <h3 className="font-display text-base font-bold text-navy-900">Recommended Deep Dives</h3>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {(result.finalFeedback?.recommendedTopics || []).length > 0 ? (
              result.finalFeedback.recommendedTopics.map((x) => (
                <span
                  key={x}
                  className="rounded-lg border border-brand-200 bg-brand-50/80 px-2.5 py-1.5 text-xs font-semibold text-brand-700"
                >
                  {x}
                </span>
              ))
            ) : (
              <span className="text-xs italic text-slate-400">Continue with standard practice sets.</span>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
