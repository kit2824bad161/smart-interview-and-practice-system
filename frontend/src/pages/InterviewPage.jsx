import {
  AlertCircle,
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Target,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';
import InterviewQuestionCard from '../components/InterviewQuestionCard';
import { completeInterview, getNextQuestion, submitAnswer } from '../services/api';

export default function InterviewPage() {
  const nav = useNavigate();
  const config = JSON.parse(localStorage.getItem('smart_interview_config') || '{}');
  const savedSession = JSON.parse(localStorage.getItem('smart_interview_session') || 'null');

  const [session] = useState(savedSession);
  const [question, setQuestion] = useState(savedSession?.currentQuestion || null);
  const [evaluation, setEvaluation] = useState(null);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [answers, setAnswers] = useState({});
  const [answer, setAnswer] = useState('');
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(!savedSession);
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(148);

  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!savedSession) {
      nav('/interview/setup');
      return;
    }
    setPageLoading(false);
  }, [nav, savedSession]);

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await submitAnswer(session.interviewId, {
        questionId: question.questionId,
        answer,
      });
      setAnswers((previous) => ({ ...previous, [question.questionId]: answer }));
      setEvaluation(result.evaluation);
      setIsLastQuestion(result.isLastQuestion);
      setAnswer('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to evaluate this answer.');
    } finally {
      setLoading(false);
    }
  };

  const advance = async () => {
    setLoading(true);
    setError('');
    try {
      if (isLastQuestion) {
        await completeInterview(session.interviewId);
        localStorage.setItem('smart_interview_id', session.interviewId);
        nav('/interview/result');
        return;
      }
      const next = await getNextQuestion(session.interviewId);
      setQuestion(next);
      setEvaluation(null);
      setIsLastQuestion(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load the next question.');
    } finally {
      setLoading(false);
    }
  };

  const skip = () => {
    setError('Please submit an answer so the AI interviewer can evaluate your response.');
  };

  const time = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  if (pageLoading || !question) {
    return (
      <div className="mx-auto flex min-h-[400px] max-w-5xl flex-col items-center justify-center p-12 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        <p className="mt-4 font-semibold text-slate-600">Initializing mock interview room...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="accent">
              <BrainCircuit size={13} className="mr-1 inline" /> AI Mock Interview
            </Badge>
            <span className="text-xs font-semibold text-slate-400">
              {config.type || 'Technical'} Round
            </span>
          </div>
          <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-navy-900 md:text-3xl">
            {config.role || 'Software Developer'}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 shadow-sm">
            <CheckCircle2 size={15} className="text-emerald-500" />
            <span>{Object.keys(answers).length} / {session.totalQuestions} Completed</span>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 transition hover:text-navy-900"
          >
            <ArrowLeft size={14} /> Exit
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      {!evaluation ? (
        <InterviewQuestionCard
          question={question}
          answer={answer}
          setAnswer={setAnswer}
          recording={recording}
          setRecording={setRecording}
          onSubmit={submit}
          onSkip={skip}
          loading={loading}
          current={question.questionNumber}
          total={session.totalQuestions}
          time={time}
        />
      ) : (
        <EvaluationPanel
          evaluation={evaluation}
          last={isLastQuestion}
          loading={loading}
          onNext={advance}
        />
      )}

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
          <AlertCircle size={16} className="shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

function EvaluationPanel({ evaluation, last, loading, onNext }) {
  const scores = [
    ['Technical Correctness', evaluation.technicalScore, 'bg-brand-500'],
    ['Relevance', evaluation.relevanceScore, 'bg-indigo-500'],
    ['Completeness', evaluation.completenessScore, 'bg-amber-500'],
    ['Communication', evaluation.communicationScore, 'bg-emerald-500'],
  ];

  return (
    <div className="space-y-6">
      {/* Top Evaluation Score Card */}
      <Card className="border-slate-800 bg-navy-950 p-7 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Instant AI Evaluation
          </span>
          <Badge variant="dark" className="border-white/10 bg-white/5 text-slate-300">
            {evaluation.answerQuality || 'Evaluated'}
          </Badge>
        </div>

        <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
          <span className="font-display text-5xl font-extrabold tracking-tight text-white">
            {evaluation.overallScore}%
          </span>
          <span className="text-sm font-semibold text-slate-400">Overall Response Score</span>
        </div>

        <p className="mt-4 max-w-3xl text-xs leading-relaxed text-slate-300">
          {evaluation.evaluationSummary}
        </p>
      </Card>

      {/* Competency Bars & Detailed Breakdowns */}
      <Card className="p-6 md:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {scores.map(([label, value, color]) => (
            <div key={label} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <div className="mb-2 flex justify-between text-xs font-bold">
                <span className="text-slate-600">{label}</span>
                <span className="text-navy-900">{value}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200/80">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <FeedbackList
            title="Strengths"
            items={evaluation.strengths}
            icon={<CheckCircle2 size={16} className="text-emerald-500" />}
            bgColor="bg-emerald-50/50 border-emerald-100"
          />
          <FeedbackList
            title="Areas for Improvement"
            items={evaluation.weaknesses}
            icon={<XCircle size={16} className="text-amber-500" />}
            bgColor="bg-amber-50/50 border-amber-100"
          />
          <FeedbackList
            title="Missing Concepts"
            items={evaluation.missingConcepts}
            icon={<Target size={16} className="text-rose-500" />}
            bgColor="bg-rose-50/50 border-rose-100"
          />
          <FeedbackList
            title="Improvement Suggestions"
            items={evaluation.improvementSuggestions}
            icon={<Sparkles size={16} className="text-brand-500" />}
            bgColor="bg-brand-50/50 border-brand-100"
          />
        </div>

        {evaluation.idealAnswer && (
          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50/80 p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Ideal Benchmark Answer
            </span>
            <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-slate-700">
              {evaluation.idealAnswer}
            </p>
          </div>
        )}

        <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
          <Button
            onClick={onNext}
            disabled={loading}
            className="bg-brand-500 hover:bg-brand-600 text-white"
          >
            {loading ? 'Processing...' : last ? 'Complete Interview' : 'Next Question'}
            <ChevronRight size={16} />
          </Button>
        </div>
      </Card>
    </div>
  );
}

function FeedbackList({ title, items = [], icon, bgColor }) {
  return (
    <div className={`rounded-xl border p-4.5 ${bgColor}`}>
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-display text-xs font-bold uppercase tracking-wider text-navy-900">
          {title}
        </h3>
      </div>
      <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-600">
        {items?.length > 0 ? (
          items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
              <span>{item}</span>
            </li>
          ))
        ) : (
          <li className="italic text-slate-400">No specific points noted.</li>
        )}
      </ul>
    </div>
  );
}
