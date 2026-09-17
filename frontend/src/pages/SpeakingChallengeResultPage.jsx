import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Mic,
  Radio,
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
import { getSpeakingChallengeResult } from '../services/api';

export default function SpeakingChallengeResultPage() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getSpeakingChallengeResult(id)
      .then(setResult)
      .catch((err) =>
        setError(err.response?.data?.message || 'Unable to load speaking challenge result.')
      );
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-4xl p-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <AlertCircle size={26} />
        </div>
        <h2 className="mt-4 font-display text-xl font-bold text-navy-900">Result Not Found</h2>
        <p className="mt-2 text-xs text-slate-500">{error}</p>
        <div className="mt-6">
          <Link to="/communication/challenge/setup" className="btn-primary inline-flex items-center gap-2">
            Try Speaking Challenge
          </Link>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="mx-auto flex min-h-[400px] max-w-5xl flex-col items-center justify-center p-12 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        <p className="mt-4 font-semibold text-slate-600">Evaluating your speech performance...</p>
      </div>
    );
  }

  const evaluation = result.evaluation || {};
  const speech = result.speechAnalysis || {};
  const score = (key) =>
    Number.isFinite(Number(evaluation[key])) ? Number(evaluation[key]) : 0;
  const overallScore = Number.isFinite(Number(evaluation.overallScore))
    ? Number(evaluation.overallScore)
    : 0;

  const formatDuration = (seconds) =>
    `${Math.floor(Number(seconds || 0) / 60)}:${String(Math.round(Number(seconds || 0) % 60)).padStart(2, '0')}`;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="accent">
              <Radio size={13} className="mr-1 inline" /> Extempore Result
            </Badge>
            <span className="text-xs font-semibold text-slate-400">Continuous Speaking Metric</span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-navy-900 md:text-4xl">
            {overallScore}% Fluency Score
          </h1>
          <p className="mt-1 text-xs text-slate-500 md:text-sm">
            Topic Prompt: <strong className="text-navy-900">{result.topic}</strong>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft size={15} /> Dashboard
          </Link>
          <Link
            to="/communication/challenge/setup"
            className="btn-primary inline-flex items-center gap-2 text-xs"
          >
            <RotateCcw size={15} /> Try Again
          </Link>
        </div>
      </div>

      {/* Grid: Fluency Pillars & Speech Acoustic Metrics */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 md:p-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <TrendingUp size={17} />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-navy-900">
                Linguistic Competencies
              </h2>
              <p className="text-xs text-slate-400">Detailed component breakdown</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <ProgressBar label="Topic Relevance" value={score('topicRelevance')} color="bg-brand-500" />
            <ProgressBar label="Content Quality" value={score('contentQuality')} color="bg-indigo-500" />
            <ProgressBar label="Speech Fluency" value={score('fluency')} color="bg-emerald-500" />
            <ProgressBar label="Grammar Accuracy" value={score('grammar')} color="bg-cyan-500" />
            <ProgressBar label="Vocabulary Range" value={score('vocabulary')} color="bg-purple-500" />
            <ProgressBar label="Response Structure" value={score('structure')} color="bg-amber-500" />
          </div>

          <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-xs space-y-1.5 text-slate-600">
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Response Classification:</span>
              <span className="font-bold text-navy-900">{evaluation.responseType || 'Clear Speech'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Topic Relevance Verified:</span>
              <span className="font-bold text-emerald-600">{evaluation.isRelevant ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Natural Audio Pattern:</span>
              <span className="font-bold text-navy-900">{evaluation.isValidSpeechResponse ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col justify-between p-6 md:p-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Mic size={17} />
              </div>
              <div>
                <h2 className="font-display text-base font-bold text-navy-900">
                  Acoustic & Delivery Metrics
                </h2>
                <p className="text-xs text-slate-400">Pacing and rhythm indicators</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Total Duration
                </span>
                <p className="mt-1 font-display text-2xl font-extrabold text-navy-900">
                  {formatDuration(result.duration)}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Words Articulated
                </span>
                <p className="mt-1 font-display text-2xl font-extrabold text-navy-900">
                  {Number.isFinite(Number(speech.wordCount)) ? speech.wordCount : 'N/A'}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Speaking Pace
                </span>
                <p className="mt-1 font-display text-2xl font-extrabold text-brand-600">
                  {Number.isFinite(Number(speech.wordsPerMinute))
                    ? `${speech.wordsPerMinute} WPM`
                    : 'N/A'}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Filler Word Count
                </span>
                <p className="mt-1 font-display text-2xl font-extrabold text-amber-600">
                  {Number.isFinite(Number(speech.fillerWordCount))
                    ? speech.fillerWordCount
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Transcript Section */}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <FileText size={14} className="text-brand-600" />
              <span>Full Audio Transcript</span>
            </div>
            <div className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs leading-relaxed text-slate-700">
              {result.transcript || 'No transcript was captured.'}
            </div>
          </div>
        </Card>
      </div>

      {/* AI Qualitative Feedback */}
      <Card className="p-6 md:p-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <Sparkles size={17} />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-navy-900">
              Interviewer Qualitative Feedback
            </h2>
            <p className="text-xs text-slate-400">Diagnostic synthesis from the AI voice evaluator</p>
          </div>
        </div>

        {evaluation.feedback && (
          <p className="mt-4 text-xs leading-relaxed text-slate-700 md:text-sm">
            {evaluation.feedback}
          </p>
        )}

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <CheckCircle2 size={16} className="text-emerald-600" /> Key Strengths
            </div>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-emerald-900">
              {(evaluation.strengths || []).map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
              <XCircle size={16} className="text-amber-600" /> Growth Points
            </div>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-amber-900">
              {(evaluation.weaknesses || []).map((w, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
