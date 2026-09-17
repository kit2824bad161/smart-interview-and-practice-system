import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Mic,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';
import VoiceRecorder from '../components/VoiceRecorder';
import { getCommunicationInterview, submitCommunicationAnswer } from '../services/api';

export default function CommunicationInterviewPage() {
  const navigate = useNavigate();
  const session = JSON.parse(localStorage.getItem('smart_communication_session') || 'null');
  const [interview, setInterview] = useState(null);
  const [recordingBlob, setRecordingBlob] = useState(null);
  const [duration, setDuration] = useState(0);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session?.interviewId) {
      navigate('/communication');
      return;
    }
    getCommunicationInterview(session.interviewId)
      .then(setInterview)
      .catch((err) =>
        setError(err.response?.data?.message || 'Unable to load communication interview.')
      );
  }, [navigate, session?.interviewId]);

  if (!interview) {
    return (
      <div className="mx-auto max-w-4xl p-12 text-center text-xs font-semibold text-slate-500">
        {error || 'Loading communication interview question...'}
      </div>
    );
  }

  const question = interview.questions[interview.currentIndex];
  if (!question) {
    navigate(`/communication/result/${interview._id}`);
    return null;
  }

  const submit = async () => {
    if (!recordingBlob) {
      setError('Please record your spoken response before submitting.');
      return;
    }
    setLoading(true);
    setError('');
    setAnalysis(null);
    try {
      const body = new FormData();
      body.append('audio', recordingBlob, `communication-${question._id}.webm`);
      body.append('questionId', question._id);
      body.append('duration', String(duration));
      const result = await submitCommunicationAnswer(interview._id, body);
      setAnalysis(result);
      if (result.isLastQuestion) {
        localStorage.setItem('smart_communication_result_id', interview._id);
      } else {
        setInterview(await getCommunicationInterview(interview._id));
      }
      setRecordingBlob(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to analyze the spoken response.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent" dot>AI Spoken Evaluation</Badge>
          </div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
            Communication Interview
          </h1>
          <p className="text-xs text-slate-500">
            {interview.jobRole} · {interview.experience} Tier
          </p>
        </div>

        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft size={14} /> Exit
        </Link>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>
            Question {interview.currentIndex + 1} of {interview.totalQuestions}
          </span>
          {interview.warnings > 0 && (
            <span className="text-amber-600">Warnings: {interview.warnings}</span>
          )}
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all duration-300"
            style={{
              width: `${((interview.currentIndex + 1) / interview.totalQuestions) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card className="p-6 md:p-8 space-y-6">
        <span className="inline-block rounded-lg bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-bold text-accent">
          {question.category || 'Behavioral Communication'}
        </span>

        <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed">
          {question.question}
        </h2>

        <p className="text-xs text-slate-500">
          Record your response clearly using your microphone. Maximum speech time: 90 seconds.
        </p>

        <div className="pt-2">
          <VoiceRecorder
            maxDuration={90}
            disabled={loading || Boolean(analysis)}
            onRecordingComplete={(blob, seconds) => {
              setRecordingBlob(blob);
              setDuration(seconds);
              setError('');
            }}
          />
        </div>

        {recordingBlob && !analysis && (
          <p className="text-center text-xs font-bold text-emerald-600 flex items-center justify-center gap-1">
            ✓ Audio recorded ({duration}s). Ready to analyze.
          </p>
        )}

        {analysis && <AnalysisPanel result={analysis} />}

        {!analysis && (
          <Button
            variant="primary"
            onClick={submit}
            disabled={loading || !recordingBlob}
            loading={loading}
            className="w-full py-3 text-sm"
          >
            {loading ? 'Evaluating Spoken Response...' : 'Submit Spoken Answer'} <ChevronRight size={16} />
          </Button>
        )}

        {analysis?.isLastQuestion && (
          <Button
            variant="primary"
            onClick={() => navigate(`/communication/result/${interview._id}`)}
            className="w-full py-3"
          >
            View Final Communication Dossier <ChevronRight size={16} />
          </Button>
        )}
      </Card>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-center text-xs font-bold text-rose-700">
          {error}
        </div>
      )}

      <div className="flex items-center justify-center gap-2 text-center text-xs text-slate-400">
        <ShieldCheck size={14} className="text-slate-400" />
        <span>Audio stream is securely transcribed and analyzed by AI.</span>
      </div>
    </div>
  );
}

function AnalysisPanel({ result }) {
  const evaluation = result.evaluation;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-4 text-xs">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <Sparkles size={14} className="text-accent" />
        <span className="font-bold text-slate-800">AI Speech Analysis</span>
      </div>

      {evaluation.warning && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs font-bold text-amber-800">
          Warning: {evaluation.warningReason || 'Your response may be off-topic.'}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <MetricCard label="Overall Score" value={evaluation.overallScore} highlight />
        <MetricCard label="Relevance" value={evaluation.relevance} />
        <MetricCard label="Correctness" value={evaluation.contentCorrectness} />
        <MetricCard label="Fluency" value={evaluation.fluency} />
        <MetricCard label="Grammar" value={evaluation.grammar} />
        <MetricCard label="Vocabulary" value={evaluation.vocabulary} />
      </div>

      {evaluation.feedback && (
        <div className="pt-2">
          <span className="font-bold text-slate-700 block mb-1">Feedback:</span>
          <p className="text-slate-600 leading-relaxed">{evaluation.feedback}</p>
        </div>
      )}

      {result.transcript && (
        <div className="pt-2 border-t border-slate-200/60">
          <span className="font-bold text-slate-700 block mb-1">Transcript:</span>
          <p className="text-slate-500 font-mono text-[11px] leading-relaxed">{result.transcript}</p>
        </div>
      )}

      {!result.isLastQuestion && (
        <Button
          variant="primary"
          onClick={() => window.location.reload()}
          className="w-full py-2.5 mt-2"
        >
          Proceed to Next Question <ChevronRight size={15} />
        </Button>
      )}
    </div>
  );
}

function MetricCard({ label, value, highlight = false }) {
  return (
    <div
      className={`rounded-xl border p-2.5 ${
        highlight
          ? 'border-indigo-200 bg-indigo-50/60 text-accent'
          : 'border-slate-200 bg-white text-slate-700'
      }`}
    >
      <span className="text-[10px] font-bold text-slate-400 block">{label}</span>
      <span className="font-display text-base font-bold mt-0.5 block">
        {value == null ? 'N/A' : `${value}%`}
      </span>
    </div>
  );
}
