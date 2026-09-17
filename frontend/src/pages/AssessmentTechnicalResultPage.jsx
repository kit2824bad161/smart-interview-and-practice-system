import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mic,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import { getAssessmentTechnicalResult } from '../services/api';

export default function AssessmentTechnicalResultPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('smart_technical_result') || 'null');
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(!result);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    getAssessmentTechnicalResult()
      .then((data) => {
        if (!isMounted) return;
        setResult(data);
        sessionStorage.setItem('smart_technical_result', JSON.stringify(data));
      })
      .catch((err) => {
        if (!isMounted) return;
        if (!result) {
          setError(err.response?.data?.message || 'Unable to load technical test result.');
        }
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
        <p className="mt-4 font-semibold text-slate-600">Calculating Technical MCQ Score...</p>
      </div>
    );
  }

  if (error && !result) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <AlertCircle className="mx-auto text-red-500" size={48} />
        <h2 className="mt-4 font-display text-2xl font-bold text-slate-800">No Result Available</h2>
        <p className="mt-2 text-sm text-slate-600">{error}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="secondary" onClick={() => navigate('/assessment')}>
            Back to Assessment Hub
          </Button>
        </div>
      </div>
    );
  }

  const passed = result?.passed || (result?.score >= 15);
  const score = result?.score ?? 0;
  const totalQuestions = result?.totalQuestions ?? 20;
  const passingScore = result?.passingScore ?? 15;
  const percentage = result?.percentage ?? Math.round((score / totalQuestions) * 100);
  const correctCount = result?.correctCount ?? score;
  const incorrectCount = result?.incorrectCount ?? (totalQuestions - score);
  const attemptedCount = result?.attemptedCount ?? (correctCount + incorrectCount);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:py-8">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-accent">
              Round 2 Result
            </span>
            <span className="text-xs text-slate-400">Technical Qualification</span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Technical MCQ Assessment Result
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Passing threshold is strictly 15 out of 20 marks to qualify for the One-on-One AI Interview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/assessment" className="btn-secondary">
            <ArrowLeft size={16} /> Assessment Hub
          </Link>
          {passed ? (
            <Link to="/assessment/interview" className="btn-primary bg-emerald-600 hover:bg-emerald-700">
              <Mic size={16} /> Enter AI Interview <ArrowRight size={16} />
            </Link>
          ) : (
            <Button variant="secondary" disabled className="opacity-60">
              <Lock size={16} /> AI Interview Locked
            </Button>
          )}
        </div>
      </div>

      {/* Qualification Alert */}
      <div className="mt-6">
        {passed ? (
          <div className="flex items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 text-emerald-900">
            <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={24} />
            <div>
              <h3 className="font-display text-lg font-bold">PASSED — Qualified for Round 3 (One-on-One AI Interview)!</h3>
              <p className="mt-1 text-sm leading-relaxed text-emerald-800">
                Outstanding! You scored <strong>{score} / 20</strong>, clearing the technical qualification barrier.
                You are now eligible for the final round: a live voice-first One-on-One AI Interview.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-4 rounded-2xl border border-red-200 bg-red-50/80 p-5 text-red-900">
            <XCircle className="mt-0.5 shrink-0 text-red-600" size={24} />
            <div>
              <h3 className="font-display text-lg font-bold">FAILED — Did Not Meet Technical Passing Criteria</h3>
              <p className="mt-1 text-sm leading-relaxed text-red-800">
                Minimum 15 out of 20 is required to qualify for the AI Interview round. Your score was{' '}
                <strong>{score} / 20</strong>. Round 3 remains locked. Study the technical solutions below to sharpen your concepts.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Primary Scorecard Grid */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Score & Badge */}
        <Card className="flex flex-col justify-between bg-ink p-6 text-white sm:col-span-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-mint">Technical Score</span>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-6xl font-extrabold">{score}</span>
              <span className="text-2xl text-slate-400">/ {totalQuestions}</span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
            <div>
              <p className="text-xs text-slate-400">Percentage</p>
              <p className="font-display text-xl font-bold">{percentage}%</p>
            </div>
            <span
              className={`rounded-xl px-4 py-1.5 text-sm font-black tracking-wide ${
                passed ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
              }`}
            >
              {passed ? 'PASS' : 'FAIL'}
            </span>
          </div>
        </Card>

        {/* Correct Answers */}
        <Card className="p-6">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Correct</span>
            <CheckCircle2 className="text-emerald-500" size={20} />
          </div>
          <p className="mt-4 font-display text-4xl font-bold text-emerald-600">{correctCount}</p>
          <p className="mt-2 text-xs text-slate-500">1 mark per correct question</p>
        </Card>

        {/* Wrong Answers */}
        <Card className="p-6">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Wrong / Skipped</span>
            <XCircle className="text-red-500" size={20} />
          </div>
          <p className="mt-4 font-display text-4xl font-bold text-red-600">{incorrectCount}</p>
          <p className="mt-2 text-xs text-slate-500">No negative marks</p>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="mt-4 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-xs font-bold text-slate-600 sm:grid-cols-3">
        <div className="flex justify-between sm:block">
          <span className="text-slate-400">Total Questions:</span>
          <span className="sm:ml-2 sm:font-display sm:text-base sm:text-slate-800">{totalQuestions}</span>
        </div>
        <div className="flex justify-between sm:block">
          <span className="text-slate-400">Questions Attempted:</span>
          <span className="sm:ml-2 sm:font-display sm:text-base sm:text-slate-800">{attemptedCount}</span>
        </div>
        <div className="flex justify-between sm:block">
          <span className="text-slate-400">Required Threshold:</span>
          <span className="sm:ml-2 sm:font-display sm:text-base sm:text-slate-800">{passingScore} / 20 (75%)</span>
        </div>
      </div>

      {/* Question Review List */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">Technical Answer Review</h2>
            <p className="text-xs text-slate-500">
              In-depth technical breakdown and conceptual explanation for each question.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {result?.review?.map((item) => {
            const isCorrect = Boolean(item.isCorrect);

            return (
              <Card
                key={item.questionNumber}
                className={`overflow-hidden border-2 p-6 transition md:p-7 ${
                  isCorrect ? 'border-emerald-200 bg-emerald-50/20' : 'border-red-200 bg-red-50/20'
                }`}
              >
                {/* Status Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-slate-700">
                      #{item.questionNumber}
                    </span>
                    {item.topic && (
                      <span className="rounded bg-indigo-50 px-2.5 py-0.5 text-accent">
                        {item.topic}
                      </span>
                    )}
                  </div>

                  <span
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ${
                      isCorrect
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {isCorrect ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    {isCorrect ? 'Correct (+1 Mark)' : 'Incorrect (0 Marks)'}
                  </span>
                </div>

                {/* Question */}
                <h3 className="mt-4 font-display text-lg font-bold text-slate-900">
                  {item.question}
                </h3>

                {/* Answers Comparison */}
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div
                    className={`rounded-xl border p-3.5 text-xs ${
                      isCorrect
                        ? 'border-emerald-200 bg-emerald-50/60 text-emerald-900'
                        : 'border-red-200 bg-red-50/60 text-red-900'
                    }`}
                  >
                    <p className="font-bold uppercase tracking-wider text-slate-400">Your Answer</p>
                    <p className="mt-1 text-sm font-semibold">
                      {item.candidateAnswer || <em className="text-slate-400">Unanswered</em>}
                    </p>
                  </div>

                  <div className="rounded-xl border border-emerald-300 bg-emerald-50/80 p-3.5 text-xs text-emerald-900">
                    <p className="font-bold uppercase tracking-wider text-emerald-600">Correct Answer</p>
                    <p className="mt-1 text-sm font-bold">{item.correctAnswer}</p>
                  </div>
                </div>

                {/* Explanation */}
                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Technical Explanation</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{item.explanation}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6">
        <Link to="/assessment" className="btn-secondary">
          <ArrowLeft size={16} /> Return to Assessment Hub
        </Link>
        {passed && (
          <Link to="/assessment/interview" className="btn-primary bg-emerald-600 hover:bg-emerald-700">
            <Mic size={16} /> Proceed to Round 3 – AI Interview <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </div>
  );
}
