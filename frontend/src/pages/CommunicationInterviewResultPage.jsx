import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ListChecks,
  Mic,
  RotateCcw,
  Sparkles,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Badge from '../components/Badge';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { getCommunicationResult } from '../services/api';

export default function CommunicationInterviewResultPage() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const targetId = id || localStorage.getItem('smart_communication_result_id');
    if (!targetId) {
      setError('No completed speech interview record was found.');
      return;
    }
    getCommunicationResult(targetId)
      .then(setResult)
      .catch((err) =>
        setError(err.response?.data?.message || 'Unable to load speech communication feedback.')
      );
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-4xl p-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <AlertCircle size={26} />
        </div>
        <h2 className="mt-4 font-display text-xl font-bold text-navy-900">Speech Report Not Found</h2>
        <p className="mt-2 text-xs text-slate-500">{error}</p>
        <div className="mt-6">
          <Link to="/communication" className="btn-primary inline-flex items-center gap-2">
            Start Speech Interview
          </Link>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="mx-auto flex min-h-[400px] max-w-5xl flex-col items-center justify-center p-12 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        <p className="mt-4 font-semibold text-slate-600">Generating voice communication dossier...</p>
      </div>
    );
  }

  const metrics = result.summary?.averages || {};

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="accent">
              <Mic size={13} className="mr-1 inline" /> Voice Evaluation
            </Badge>
            <span className="text-xs font-semibold text-slate-400">Speech Intelligence Report</span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-navy-900 md:text-4xl">
            Communication Diagnostic Dossier
          </h1>
          <p className="mt-1 text-xs text-slate-500 md:text-sm">
            Target Role: <strong>{result.jobRole}</strong> • {result.answers?.length || 0} voice responses analyzed
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft size={15} /> Dashboard
          </Link>
          <Link to="/communication" className="btn-primary inline-flex items-center gap-2 text-xs">
            <RotateCcw size={15} /> Practice Again
          </Link>
        </div>
      </div>

      {/* Scorecards */}
      <div className="grid gap-6 lg:grid-cols-[.75fr_1.25fr]">
        <Card className="flex flex-col items-center justify-center border-slate-800 bg-navy-950 p-8 text-center text-white shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Overall Communication
          </span>
          <div className="mt-6 font-display text-6xl font-extrabold tracking-tight text-white">
            {result.overallScore}
            <span className="text-2xl font-semibold text-slate-400">%</span>
          </div>
          <p className="mt-3 text-xs text-slate-300">
            Multi-factor composite voice score
          </p>
        </Card>

        <Card className="p-6 md:p-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <TrendingUp size={17} />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-navy-900">
                Acoustic & Semantic Breakdown
              </h2>
              <p className="text-xs text-slate-400">
                Evaluated across linguistic and delivery dimensions
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <ProgressBar label="Relevance & Intent" value={metrics.relevance || 0} color="bg-brand-500" />
            <ProgressBar label="Content Correctness" value={metrics.contentCorrectness || 0} color="bg-indigo-500" />
            <ProgressBar label="Speech Fluency" value={metrics.fluency || 0} color="bg-emerald-500" />
            <ProgressBar label="Grammar & Syntax" value={metrics.grammar || 0} color="bg-cyan-500" />
            <ProgressBar label="Professional Vocabulary" value={metrics.vocabulary || 0} color="bg-purple-500" />
            <ProgressBar label="Answer Structure" value={metrics.answerStructure || 0} color="bg-amber-500" />
          </div>
        </Card>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 md:p-7">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={17} />
            </div>
            <h3 className="font-display text-base font-bold text-navy-900">Communication Strengths</h3>
          </div>
          <ul className="mt-5 space-y-3 text-xs leading-relaxed text-slate-600">
            {(result.summary?.strengths || []).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 md:p-7">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <XCircle size={17} />
            </div>
            <h3 className="font-display text-base font-bold text-navy-900">Verbal Growth Areas</h3>
          </div>
          <ul className="mt-5 space-y-3 text-xs leading-relaxed text-slate-600">
            {(result.summary?.weaknesses || []).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* AI Improvement Plan */}
      <Card className="p-6 md:p-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <ListChecks size={17} />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-navy-900">
              Personalized Verbal Improvement Plan
            </h2>
            <p className="text-xs text-slate-400">
              Actionable techniques to enhance your live executive communication
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {(result.summary?.improvementPlan || []).map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4 text-xs leading-relaxed text-slate-700"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">
                {idx + 1}
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
