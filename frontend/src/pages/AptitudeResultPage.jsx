import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { getAptitudeResult } from '../services/api';

const SESSION_KEY = 'smart_aptitude_session';

function formatTime(seconds) {
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

export default function AptitudeResultPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    if (!session?.sessionId) {
      setError('No aptitude attempt record was found.');
      return;
    }
    getAptitudeResult(session.sessionId)
      .then((nextResult) => {
        setResult(nextResult);
      })
      .catch((err) =>
        setError(err.response?.data?.message || 'Unable to load aptitude result.')
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
        <div className="mt-6">
          <Link to="/practice/aptitude" className="btn-primary inline-flex items-center gap-2">
            Try Aptitude Practice
          </Link>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="mx-auto flex min-h-[400px] max-w-5xl flex-col items-center justify-center p-12 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        <p className="mt-4 font-semibold text-slate-600">Compiling aptitude report...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="success">
              <CheckCircle2 size={13} className="mr-1 inline" /> Practice Complete
            </Badge>
            <span className="text-xs font-semibold text-slate-400">Aptitude Evaluation</span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-navy-900 md:text-4xl">
            Aptitude Assessment Dossier
          </h1>
          <p className="mt-1 text-xs text-slate-500 md:text-sm">
            {result.status === 'expired'
              ? 'Session ended automatically when time limit elapsed.'
              : 'Quantitative, logical reasoning, and verbal aptitude breakdown.'}
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
            to="/practice/aptitude"
            className="btn-primary inline-flex items-center gap-2 text-xs"
          >
            <RotateCcw size={15} /> Practice Again
          </Link>
        </div>
      </div>

      {/* Selected Practice Metadata Card */}
      <Card className="p-6">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Session Parameters
        </span>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetaItem label="Category" value={result.category} />
          <MetaItem label="Topic" value={result.topic} />
          <MetaItem label="Difficulty" value={result.difficulty} />
          <MetaItem label="Time Limit" value={`${result.timeLimit} mins`} />
        </div>
      </Card>

      {/* Score and Counters Grid (Clean Light Style) */}
      <div className="grid gap-6 lg:grid-cols-[.75fr_1.25fr]">
        <Card className="p-6 md:p-7 space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Score
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-5xl font-bold tracking-tight text-slate-900">
              {result.totalScore}
            </span>
            <span className="text-sm font-semibold text-slate-400">/ {result.totalQuestions}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Accuracy</span>
              <p className="mt-0.5 font-display text-lg font-bold text-slate-900">
                {result.accuracy}%
              </p>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Time Taken</span>
              <p className="mt-0.5 font-display text-lg font-bold text-slate-900">
                {formatTime(result.timeTakenSeconds)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <StatBox
              icon={<CheckCircle2 className="text-emerald-500" size={20} />}
              label="Correct Answers"
              value={result.correctAnswers}
            />
            <StatBox
              icon={<XCircle className="text-rose-500" size={20} />}
              label="Incorrect Answers"
              value={result.incorrectAnswers}
            />
            <StatBox
              icon={<Target className="text-brand-500" size={20} />}
              label="Unattempted"
              value={result.unattempted}
            />
            <StatBox
              icon={<Clock className="text-amber-500" size={20} />}
              label="Time Expended"
              value={formatTime(result.timeTakenSeconds)}
            />
          </div>
        </Card>
      </div>

      {/* Section Performance Bars */}
      <Card className="p-6 md:p-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <TrendingUp size={17} />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-navy-900">
              Sectional Performance
            </h2>
            <p className="text-xs text-slate-400">Detailed accuracy breakdown by sub-domain</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {result.sections?.map((section) => (
            <div key={section.category}>
              <ProgressBar
                label={`${section.category} (${section.correct} / ${section.total})`}
                value={section.total ? Math.round((section.correct / section.total) * 100) : 0}
                color={
                  section.category === 'Logical Reasoning'
                    ? 'bg-amber-500'
                    : section.category === 'Verbal Ability'
                    ? 'bg-emerald-500'
                    : 'bg-brand-500'
                }
              />
            </div>
          ))}
        </div>

        {result.topicPerformance?.length > 0 && (
          <div className="mt-8 border-t border-slate-100 pt-6">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-slate-400">
              Granular Topic Distribution
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {result.topicPerformance.map((item) => (
                <span
                  key={item.topic}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700"
                >
                  {item.topic}: <strong className="text-brand-600">{item.correct}</strong>/{item.total}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-7 grid gap-4 border-t border-slate-100 pt-6 text-xs sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5">
            <TrendingUp className="mt-0.5 text-emerald-600 shrink-0" size={17} />
            <div>
              <strong className="text-emerald-900">Strongest Section:</strong>
              <p className="mt-0.5 text-emerald-800">{result.strongest || 'Sufficient data collected'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/50 p-3.5">
            <TrendingDown className="mt-0.5 text-amber-600 shrink-0" size={17} />
            <div>
              <strong className="text-amber-900">Recommended Focus Section:</strong>
              <p className="mt-0.5 text-amber-800">{result.weakest || 'Consistent performance across sections'}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* AI Qualitative Feedback */}
      <Card className="p-6 md:p-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <Sparkles size={17} />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-navy-900">
              AI Assessment Feedback
            </h2>
            <p className="text-xs text-slate-400">Automated candidate recommendation</p>
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-slate-700 md:text-sm">
          {result.feedback ||
            'Review missed questions in your weakest section to boost your baseline accuracy and speed.'}
        </p>
      </Card>

      {/* Comprehensive Question Review with Explanations */}
      {result.reviewQuestions && result.reviewQuestions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-navy-900">
              Detailed Question Explanations & Review
            </h2>
            <span className="text-xs text-slate-500 font-semibold">
              {result.reviewQuestions.length} Questions Reviewed
            </span>
          </div>

          <div className="space-y-4">
            {result.reviewQuestions.map((q) => {
              const isCorrect = q.isCorrect;
              const notAttempted = q.selectedAnswer === 'Not Attempted';

              return (
                <Card
                  key={q.questionNumber}
                  className={`p-5 md:p-6 border transition ${
                    isCorrect
                      ? 'border-emerald-200/80 bg-emerald-50/20'
                      : notAttempted
                      ? 'border-slate-200 bg-slate-50/40'
                      : 'border-rose-200/80 bg-rose-50/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                          isCorrect
                            ? 'bg-emerald-600 text-white'
                            : notAttempted
                            ? 'bg-slate-300 text-slate-700'
                            : 'bg-rose-600 text-white'
                        }`}
                      >
                        Q{q.questionNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {q.topic || q.category}
                      </span>
                    </div>

                    <Badge variant={isCorrect ? 'success' : notAttempted ? 'secondary' : 'danger'}>
                      {isCorrect ? 'Correct' : notAttempted ? 'Unattempted' : 'Incorrect'}
                    </Badge>
                  </div>

                  <p className="mt-3.5 text-sm md:text-base font-semibold text-navy-900">
                    {q.question}
                  </p>

                  {/* Answers Comparison */}
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 text-xs">
                    <div
                      className={`p-3 rounded-xl border ${
                        isCorrect
                          ? 'border-emerald-200 bg-emerald-50/60 text-emerald-900'
                          : notAttempted
                          ? 'border-slate-200 bg-slate-100 text-slate-600'
                          : 'border-rose-200 bg-rose-50/60 text-rose-900'
                      }`}
                    >
                      <span className="block font-bold text-[10px] uppercase tracking-wider mb-1 opacity-75">
                        Your Answer
                      </span>
                      <span className="font-semibold">{q.selectedAnswer}</span>
                    </div>

                    <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/80 text-emerald-900">
                      <span className="block font-bold text-[10px] uppercase tracking-wider text-emerald-700 mb-1">
                        Correct Answer
                      </span>
                      <span className="font-bold">{q.correctAnswer}</span>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="mt-4 rounded-xl bg-slate-100/80 p-3.5 text-xs text-slate-700 border border-slate-200/60">
                    <strong className="text-navy-900 block mb-1">Explanation:</strong>
                    <p className="leading-relaxed">{q.explanation}</p>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-center pt-4">
            <Link
              to="/practice/aptitude"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm shadow-md"
            >
              <RotateCcw size={16} /> Start Another Practice Session
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function MetaItem({ label, value }) {
  return (
    <div>
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
      <p className="mt-1 font-display text-sm font-bold text-navy-900">{value}</p>
    </div>
  );
}

function StatBox({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
      <div className="shrink-0">{icon}</div>
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
        <p className="mt-0.5 font-display text-2xl font-extrabold text-navy-900">{value}</p>
      </div>
    </div>
  );
}
