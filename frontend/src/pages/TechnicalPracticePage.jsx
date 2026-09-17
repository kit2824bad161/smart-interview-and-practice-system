import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Code2,
  Send,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';
import { completeTechnicalPractice, getTechnicalPractice } from '../services/api';

const KEY = 'smart_technical_session';

export default function TechnicalPracticePage() {
  const navigate = useNavigate();
  const [session, setSession] = useState(() => JSON.parse(localStorage.getItem(KEY) || 'null'));
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState(() => JSON.parse(localStorage.getItem(`${KEY}_answers`) || '{}'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session?.sessionId) {
      navigate('/practice/technical');
      return;
    }
    if (!session.questions?.length) {
      getTechnicalPractice(session.sessionId)
        .then(setSession)
        .catch(() => setError('Unable to load this practice session.'));
    }
  }, [navigate, session?.sessionId, session?.questions?.length]);

  useEffect(() => {
    localStorage.setItem(`${KEY}_answers`, JSON.stringify(answers));
  }, [answers]);

  if (!session?.questions?.length) {
    return (
      <div className="mx-auto flex min-h-[400px] max-w-4xl flex-col items-center justify-center p-12 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        <p className="mt-4 font-semibold text-slate-600">Loading technical practice questions...</p>
      </div>
    );
  }

  const question = session.questions[index];
  const answered = session.questions.filter(
    (item) => typeof answers[item.questionId] === 'string' && answers[item.questionId]
  ).length;

  const submit = async () => {
    if (loading) return;
    if (answered !== session.totalQuestions) {
      setError(`Please answer all questions before submitting (${session.totalQuestions - answered} remaining).`);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await completeTechnicalPractice(
        session.sessionId,
        session.questions.map((item) => ({
          questionId: item.questionId,
          selectedAnswer: answers[item.questionId],
        }))
      );
      localStorage.setItem('smart_technical_result', JSON.stringify(result));
      localStorage.removeItem(`${KEY}_answers`);
      navigate('/practice/technical/result');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to submit this practice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = ((index + 1) / session.totalQuestions) * 100;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="info">
              <Code2 size={13} className="mr-1 inline" /> Technical Practice
            </Badge>
            <span className="text-xs font-semibold text-slate-400">Self-Evaluation</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-navy-900 md:text-3xl">
            {session.topic}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Select an answer for each question. Jump between questions freely using the navigator below.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-navy-900 shadow-sm">
            <span className="text-brand-600">{answered}</span> / {session.totalQuestions} Answered
          </span>
        </div>
      </div>

      {/* Progress & Question Position */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>Question {index + 1} of {session.totalQuestions}</span>
          <span className="text-slate-400">{Math.round(progressPercent)}% Progress</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200/80">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card className="p-6 md:p-9">
        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">
            {question.topic}
          </span>
          <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
            {question.difficulty}
          </span>
        </div>

        {/* Question Title */}
        <h2 className="mt-6 font-display text-xl font-bold leading-relaxed text-navy-900 md:text-2xl">
          {question.question}
        </h2>

        {/* Options List */}
        <div className="mt-8 space-y-3">
          {question.options.map((option, optionIndex) => {
            const isSelected = answers[question.questionId] === option;
            const optionLetter = String.fromCharCode(65 + optionIndex);

            return (
              <button
                key={option}
                type="button"
                onClick={() =>
                  setAnswers((current) => ({
                    ...current,
                    [question.questionId]: option,
                  }))
                }
                className={`flex w-full items-center justify-between rounded-xl border p-4 text-left text-sm font-medium transition-all ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50/70 text-navy-900 ring-2 ring-brand-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-brand-500 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {optionLetter}
                  </span>
                  <span className="leading-snug">{option}</span>
                </div>
                {isSelected && <CheckCircle2 className="shrink-0 text-brand-600" size={18} />}
              </button>
            );
          })}
        </div>

        {/* Actions bar */}
        <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6">
          <Button
            variant="secondary"
            onClick={() => setIndex((val) => Math.max(0, val - 1))}
            disabled={index === 0}
          >
            <ArrowLeft size={16} /> Previous
          </Button>

          <div className="flex items-center gap-3">
            {index < session.totalQuestions - 1 ? (
              <Button onClick={() => setIndex((val) => val + 1)}>
                Next <ArrowRight size={16} />
              </Button>
            ) : (
              <Button
                onClick={submit}
                loading={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Send size={16} /> Submit Practice
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Error notification */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
          <AlertCircle size={16} className="shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Question Navigator Grid */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Question Navigator (1 to {session.totalQuestions})
          </span>
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-brand-600" /> Answered
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm border border-slate-300 bg-white" /> Unanswered
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {session.questions.map((item, itemIndex) => {
            const hasAnswer = Boolean(answers[item.questionId]);
            const isCurrent = index === itemIndex;

            return (
              <button
                key={item.questionId}
                type="button"
                onClick={() => setIndex(itemIndex)}
                className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                  isCurrent
                    ? 'border-2 border-brand-500 bg-white text-brand-600 ring-2 ring-brand-100 shadow-sm'
                    : hasAnswer
                    ? 'bg-brand-600 text-white shadow-sm hover:bg-brand-700'
                    : 'border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                }`}
              >
                {itemIndex + 1}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}