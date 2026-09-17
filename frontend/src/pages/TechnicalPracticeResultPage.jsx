import {
  ArrowLeft,
  CheckCircle2,
  Code2,
  RotateCcw,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import Card from '../components/Card';

export default function TechnicalPracticeResultPage() {
  const navigate = useNavigate();
  const result = JSON.parse(localStorage.getItem('smart_technical_result') || 'null');

  if (!result) {
    return (
      <div className="mx-auto max-w-4xl p-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <Code2 size={26} />
        </div>
        <h2 className="mt-4 font-display text-xl font-bold text-navy-900">No Result Found</h2>
        <p className="mt-2 text-xs text-slate-500">
          No completed technical practice session was found in this browser.
        </p>
        <div className="mt-6">
          <Link to="/practice/technical" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={16} /> Start New Practice
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="success">
              <CheckCircle2 size={13} className="mr-1 inline" /> Practice Complete
            </Badge>
            <span className="text-xs font-semibold text-slate-400">Session Review</span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-navy-900 md:text-4xl">
            Performance Breakdown
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Review detailed solution breakdowns to reinforce core computer science fundamentals.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/practice/technical"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft size={15} /> All Topics
          </Link>
          <button
            type="button"
            className="btn-primary inline-flex items-center gap-2 text-xs"
            onClick={() => navigate('/practice/technical')}
          >
            <RotateCcw size={15} /> Practice Again
          </button>
        </div>
      </div>

      {/* Top Scorecard Grid */}
      <div className="grid gap-6 lg:grid-cols-[.75fr_1.25fr]">
        {/* Clean Light Primary Score Card */}
        <Card className="p-7 border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Practice Score
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              {result.difficulty}
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-bold tracking-tight text-slate-900">
              {result.score}
            </span>
            <span className="text-base font-medium text-slate-400">
              / {result.totalQuestions}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
              {result.accuracy}% Accuracy
            </span>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Topic:</span> {result.topic}
          </div>
        </Card>

        {/* Stats & Practice Disclaimer Card */}
        <Card className="flex flex-col justify-between p-7">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                Correct Answers
              </span>
              <p className="mt-2 font-display text-3xl font-extrabold text-emerald-700">
                {result.correctAnswers}
              </p>
            </div>

            <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                Incorrect Answers
              </span>
              <p className="mt-2 font-display text-3xl font-extrabold text-rose-700">
                {result.wrongAnswers}
              </p>
            </div>

            <div className="rounded-xl border border-brand-100 bg-brand-50/50 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
                Total Questions
              </span>
              <p className="mt-2 font-display text-3xl font-extrabold text-brand-700">
                {result.totalQuestions}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-xs leading-relaxed text-amber-800">
            <strong className="font-bold">Self-Practice Note:</strong> This practice session was conducted
            for concept reinforcement. It does not alter your qualification status or scores in the official 3-stage AI hiring rounds.
          </div>
        </Card>
      </div>

      {/* Solutions & In-Depth Explanations */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <Sparkles size={15} />
          </div>
          <h2 className="font-display text-lg font-bold text-navy-900">
            Question Explanations & Solutions
          </h2>
        </div>

        <div className="space-y-4">
          {result.questions.map((item, index) => (
            <Card key={item.questionId || index} className="p-6 md:p-8">
              {/* Question Top Meta */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Question {index + 1}
                  </span>
                  <h3 className="mt-1 font-display text-base font-bold leading-relaxed text-navy-900 md:text-lg">
                    {item.question}
                  </h3>
                </div>
                {item.isCorrect ? (
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    <CheckCircle2 size={14} /> Correct
                  </span>
                ) : (
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">
                    <XCircle size={14} /> Incorrect
                  </span>
                )}
              </div>

              {/* Answer comparison */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div
                  className={`rounded-xl border p-4 text-xs ${
                    item.isCorrect
                      ? 'border-emerald-200 bg-emerald-50/50 text-emerald-900'
                      : 'border-rose-200 bg-rose-50/50 text-rose-900'
                  }`}
                >
                  <span className="block font-bold uppercase tracking-wider text-slate-500">
                    Your Selected Answer
                  </span>
                  <p className="mt-1.5 font-semibold leading-relaxed">
                    {item.selectedAnswer || 'Not answered'}
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 text-xs text-emerald-900">
                  <span className="block font-bold uppercase tracking-wider text-emerald-700">
                    Correct Answer
                  </span>
                  <p className="mt-1.5 font-semibold leading-relaxed">
                    {item.correctAnswer}
                  </p>
                </div>
              </div>

              {/* In-depth explanation */}
              {item.explanation && (
                <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-xs leading-relaxed text-slate-700">
                  <span className="block font-bold uppercase tracking-wider text-slate-400">
                    Explanation
                  </span>
                  <p className="mt-1.5 leading-relaxed text-slate-600">{item.explanation}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}