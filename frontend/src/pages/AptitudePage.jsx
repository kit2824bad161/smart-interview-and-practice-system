import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Send,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import {
  completeAptitude,
  getAptitudeQuestion,
  submitAptitudeAnswer,
} from '../services/api';

const SESSION_KEY = 'smart_aptitude_session';
const CONFIG_KEY = 'smart_aptitude_config';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function AptitudePage() {
  const navigate = useNavigate();
  const [session, setSession] = useState(() => JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'));
  const [config, setConfig] = useState(() => JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}'));
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [questionStatuses, setQuestionStatuses] = useState([]);
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submittingTest, setSubmittingTest] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session?.sessionId) {
      navigate('/practice/aptitude');
    }
  }, [navigate, session?.sessionId]);

  const fetchQuestion = async (index) => {
    if (!session?.sessionId) return;
    setLoading(true);
    setError('');
    try {
      const data = await getAptitudeQuestion(session.sessionId, index);
      setQuestion(data);
      setSelectedAnswer(data.selectedAnswer || '');
      setCurrentIndex(data.currentIndex ?? index);
      setSeconds(data.remainingSeconds);
      if (data.questionStatuses) {
        setQuestionStatuses(data.questionStatuses);
      }
    } catch (err) {
      if (err.response?.status === 410) {
        navigate('/aptitude/result');
      } else {
        setError(err.response?.data?.message || 'Unable to load question.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.sessionId) {
      fetchQuestion(currentIndex);
    }
  }, [currentIndex, session?.sessionId]);

  useEffect(() => {
    if (seconds <= 0 || !question) return;
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds, question]);

  const handleSelectOption = async (option) => {
    if (!question || loading) return;
    setSelectedAnswer(option);

    try {
      await submitAptitudeAnswer(session.sessionId, {
        questionId: question.questionId,
        selectedAnswer: option,
      });

      setQuestionStatuses((prev) =>
        prev.map((q, idx) =>
          idx === currentIndex ? { ...q, answered: true } : q
        )
      );
    } catch (err) {
      console.warn('Failed to save answer auto-progress:', err);
    }
  };

  const handleFinishTest = async () => {
    if (!session?.sessionId || submittingTest) return;
    setSubmittingTest(true);
    try {
      await completeAptitude(session.sessionId);
      navigate('/aptitude/result');
    } catch (err) {
      navigate('/aptitude/result');
    } finally {
      setSubmittingTest(false);
    }
  };

  if (!session?.sessionId) return null;

  if (loading && !question) {
    return (
      <div className="mx-auto flex min-h-[400px] max-w-2xl flex-col items-center justify-center p-12 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
        <p className="mt-4 text-xs font-semibold text-slate-600">Loading questions...</p>
      </div>
    );
  }

  const totalQuestions = question?.totalQuestions || session?.totalQuestions || 15;
  const answeredCount = questionStatuses.filter((q) => q.answered).length;

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      {/* Top Header: Unobtrusive Timer & Status */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Aptitude Practice
          </span>
          <h1 className="font-display text-lg font-bold text-slate-900">
            Question {currentIndex + 1} of {totalQuestions}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Unobtrusive Timer */}
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-mono font-semibold text-slate-700">
            <Clock size={13} className="text-slate-400" />
            <span>{formatTime(seconds)}</span>
          </div>

          <button
            type="button"
            onClick={handleFinishTest}
            disabled={submittingTest}
            className="rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
          >
            Finish Practice
          </button>
        </div>
      </div>

      {/* Main Question Card (Section 8 Simple Spec) */}
      <Card className="p-6 sm:p-8 space-y-6">
        {/* Question text */}
        <p className="text-base text-slate-900 font-medium leading-relaxed">
          {question?.question}
        </p>

        {/* Options with clean radio circle (○ Option A) */}
        <div className="space-y-2.5 pt-2">
          {question?.options?.map((option, idx) => {
            const isSelected = selectedAnswer === option;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(option)}
                className={`w-full text-left p-3.5 rounded-xl border transition flex items-center gap-3 group ${
                  isSelected
                    ? 'border-slate-900 bg-slate-50 text-slate-900 font-semibold'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 text-slate-700'
                }`}
              >
                {/* Circular radio indicator */}
                <span
                  className={`h-4 w-4 shrink-0 rounded-full border flex items-center justify-center transition ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900'
                      : 'border-slate-300 bg-white group-hover:border-slate-400'
                  }`}
                >
                  {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </span>
                <span className="text-xs sm:text-sm">{option}</span>
              </button>
            );
          })}
        </div>

        {error && (
          <div className="rounded-xl bg-rose-50 p-3 text-xs text-rose-700">
            {error}
          </div>
        )}

        {/* Bottom Controls: Previous & Next */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-5">
          <button
            type="button"
            disabled={currentIndex === 0 || loading}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={15} /> Previous
          </button>

          <span className="text-xs text-slate-400 font-medium">
            {answeredCount} of {totalQuestions} answered
          </span>

          {currentIndex < totalQuestions - 1 ? (
            <button
              type="button"
              disabled={loading}
              onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
            >
              Next <ChevronRight size={15} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinishTest}
              disabled={submittingTest}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
            >
              Finish Practice <Send size={12} />
            </button>
          )}
        </div>
      </Card>

      {/* Clean Question Navigator Grid */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Question Navigator
          </span>
          <span className="text-xs font-semibold text-slate-500">
            {answeredCount}/{totalQuestions} Answered
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {Array.from({ length: totalQuestions }, (_, i) => {
            const isCurrent = currentIndex === i;
            const isAnswered = questionStatuses[i]?.answered || (currentIndex === i && Boolean(selectedAnswer));

            return (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                className={`h-8 w-8 rounded-lg text-xs font-semibold transition ${
                  isCurrent
                    ? 'bg-slate-900 text-white font-bold'
                    : isAnswered
                    ? 'bg-slate-100 text-slate-800 border border-slate-300'
                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
