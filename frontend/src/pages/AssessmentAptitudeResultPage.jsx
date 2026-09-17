import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Lock,
  RotateCcw,
  Target,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import { getAssessmentAptitudeResult } from '../services/api';

export default function AssessmentAptitudeResultPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('smart_aptitude_result') || 'null');
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(!result);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    getAssessmentAptitudeResult()
      .then((data) => {
        if (!isMounted) return;
        setResult(data);
        sessionStorage.setItem('smart_aptitude_result', JSON.stringify(data));
      })
      .catch((err) => {
        if (!isMounted) return;
        if (!result) {
          setError(err.response?.data?.message || 'Unable to load aptitude result.');
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
        <p className="mt-4 font-semibold text-slate-600">Calculating your official score...</p>
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
              Round 1 Result
            </span>
            <span className="text-xs text-slate-400">Official Evaluation</span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Aptitude Assessment Result
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Passing threshold is strictly 15 out of 20 marks to qualify for the Technical Round.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/assessment" className="btn-secondary">
            <ArrowLeft size={16} /> Assessment Hub
          </Link>
          {passed ? (
            <Link to="/assessment/technical" className="btn-primary bg-emerald-600 hover:bg-emerald-700">
              Proceed to Round 2 <ArrowRight size={16} />
            </Link>
          ) : (
            <Button variant="secondary" disabled className="opacity-60">
              <Lock size={16} /> Round 2 Locked
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
              <h3 className="font-display text-lg font-bold">PASSED — Qualified for Round 2!</h3>
              <p className="mt-1 text-sm leading-relaxed text-emerald-800">
                Congratulations! You scored <strong>{score} / 20</strong>, meeting the 15/20 qualification threshold.
                Round 2 (Technical MCQ) is now unlocked on your account.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-4 rounded-2xl border border-red-200 bg-red-50/80 p-5 text-red-900">
            <XCircle className="mt-0.5 shrink-0 text-red-600" size={24} />
            <div>
              <h3 className="font-display text-lg font-bold">FAILED — Did Not Meet Passing Criteria</h3>
              <p className="mt-1 text-sm leading-relaxed text-red-800">
                Minimum 15 out of 20 is required to qualify for the Technical Round. Your score was{' '}
                <strong>{score} / 20</strong>. Round 2 remains locked. Review the detailed explanations below to improve your skills.
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
            <span className="text-xs font-bold uppercase tracking-wider text-mint">Final Score</span>
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
          <p className="mt-2 text-xs text-slate-500">1 mark per correct answer</p>
        </Card>

        {/* Wrong Answers */}
        <Card className="p-6">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Wrong / Skipped</span>
            <XCircle className="text-red-500" size={20} />
          </div>
          <p className="mt-4 font-display text-4xl font-bold text-red-600">{incorrectCount}</p>
          <p className="mt-2 text-xs text-slate-500">No negative marking</p>
        </Card>
      </div>

      {/* Secondary Details */}
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
          <span className="text-slate-400">Passing Threshold:</span>
          <span className="sm:ml-2 sm:font-display sm:text-base sm:text-slate-800">{passingScore} / 20 (75%)</span>
        </div>
      </div>

      {/* Question-by-Question Review */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">Detailed Answer Review</h2>
            <p className="text-xs text-slate-500">
              Review every question with your selected choice, correct answer, and detailed solution.
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
                {/* Status bar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-slate-700">
                      #{item.questionNumber}
                    </span>
                    <span className="text-slate-500">{item.category || 'Aptitude'}</span>
                    {item.topic && (
                      <span className="rounded bg-indigo-50 px-2 py-0.5 text-accent">
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

                {/* Question Text */}
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
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Explanation</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{item.explanation}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6">
        <Link to="/assessment" className="btn-secondary">
          <ArrowLeft size={16} /> Return to Assessment Hub
        </Link>
        {passed && (
          <Link to="/assessment/technical" className="btn-primary bg-emerald-600 hover:bg-emerald-700">
            Proceed to Round 2 – Technical MCQ <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </div>
  );
}
