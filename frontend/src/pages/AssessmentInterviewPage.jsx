import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronRight,
  Keyboard,
  Lock,
  Mic,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  XCircle,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import VoiceRecorder from '../components/VoiceRecorder';
import {
  completeAssessmentInterview,
  getAssessmentInterviewSession,
  startAssessmentInterview,
  submitAssessmentInterviewAnswer,
} from '../services/api';
import { speakText, stopSpeech } from '../utils/textToSpeech';

export default function AssessmentInterviewPage() {
  const navigate = useNavigate();

  // Connection & Screen States
  const [loading, setLoading] = useState(true);
  const [loadingState, setLoadingState] = useState('PREPARING_INTERVIEW');
  const [loadingMessage, setLoadingMessage] = useState('Preparing your interview...');
  const [submitting, setSubmitting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [initError, setInitError] = useState('');
  const [error, setError] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [lockedReason, setLockedReason] = useState('');

  // Real MongoDB Interview Document ID
  const [interviewId, setInterviewId] = useState(null);

  // Active Question & Session State
  const [question, setQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [recordingBlob, setRecordingBlob] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

  // Text Input Fallback
  const [useTextInput, setUseTextInput] = useState(false);
  const [textAnswer, setTextAnswer] = useState('');

  // Completed Final Evaluation State
  const [finalResult, setFinalResult] = useState(null);

  const playbackRef = useRef(false);

  // Initialize or resume interview session on mount
  const initInterview = async () => {
    try {
      setLoading(true);
      setInitError('');
      setError('');
      setIsLocked(false);
      setLoadingState('PREPARING_INTERVIEW');
      setLoadingMessage('AI is preparing your first question...');

      const data = await startAssessmentInterview();

      if (data.interviewId) {
        setInterviewId(data.interviewId);
      }

      setTotalQuestions(data.totalQuestions || 5);
      if (data.currentQuestion) {
        setQuestion(data.currentQuestion);
        setQuestionNumber(data.currentQuestion.questionNumber || data.questionNumber || 1);
      }
      setLoadingState('AI_SPEAKING');
    } catch (err) {
      console.error('Failed to start interview:', err);
      if (err.response?.status === 403) {
        setIsLocked(true);
        setLockedReason(
          err.response?.data?.message ||
            'You must pass both Aptitude (15/20) and Technical MCQ (15/20) before entering the AI Interview.'
        );
      } else if (err.response?.status === 409) {
        // Interview already finished, fetch final report
        const finishedId = err.response?.data?.interviewId || interviewId;
        completeInterviewSession(finishedId);
      } else {
        setInitError(
          err.response?.data?.message ||
            'Failed to connect to the AI Interview service. Please check your connection and retry.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initInterview();
    return () => {
      stopSpeech();
    };
  }, []);

  // Text-to-Speech speaking when question changes
  useEffect(() => {
    if (!question?.question || finalResult || loading || isLocked) return;

    playbackRef.current = true;
    setLoadingState('AI_SPEAKING');

    speakText(question.question, {
      onStart: () => setLoadingState('AI_SPEAKING'),
      onEnd: () => setLoadingState('WAITING_FOR_ANSWER'),
      onError: () => setLoadingState('WAITING_FOR_ANSWER'),
    });

    return () => {
      stopSpeech();
    };
  }, [question?.question, finalResult, loading, isLocked]);

  const replayQuestionAudio = () => {
    if (!question?.question) return;
    setLoadingState('AI_SPEAKING');
    speakText(question.question, {
      onStart: () => setLoadingState('AI_SPEAKING'),
      onEnd: () => setLoadingState('WAITING_FOR_ANSWER'),
      onError: () => setLoadingState('WAITING_FOR_ANSWER'),
    });
  };

  // Submit candidate answer (audio or typed)
  const handleSubmitAnswer = async () => {
    if (submitting || completing) return;
    setError('');

    const hasAudio = Boolean(recordingBlob);
    const hasText = Boolean(textAnswer.trim());

    if (!hasAudio && !hasText) {
      setError('Please record your spoken response or type your answer before submitting.');
      return;
    }

    setSubmitting(true);
    stopSpeech();

    if (hasAudio) {
      setLoadingState('TRANSCRIBING');
      setLoadingMessage('Transcribing your voice response...');
    } else {
      setLoadingState('EVALUATING');
      setLoadingMessage('AI is evaluating your response...');
    }

    try {
      let response;
      if (hasAudio) {
        const formData = new FormData();
        formData.append('audio', recordingBlob, `interview-q${questionNumber}.webm`);
        formData.append('questionNumber', String(questionNumber));
        formData.append('duration', String(recordingDuration));
        if (hasText) formData.append('textAnswer', textAnswer.trim());

        response = await submitAssessmentInterviewAnswer(interviewId, formData, true);
      } else {
        response = await submitAssessmentInterviewAnswer(interviewId, {
          questionNumber,
          textAnswer: textAnswer.trim(),
        });
      }

      setRecordingBlob(null);
      setRecordingDuration(0);
      setTextAnswer('');

      if (response.isLastQuestion || !response.nextQuestion) {
        // Last question answered, proceed to final evaluation
        await completeInterviewSession(interviewId);
      } else {
        // Real next question generated adaptively by backend AI
        setLoadingState('GENERATING_NEXT_QUESTION');
        setQuestion(response.nextQuestion);
        setQuestionNumber(response.nextQuestion.questionNumber);
        setLoadingState('AI_SPEAKING');
      }
    } catch (err) {
      console.error('Answer submission error:', err);
      setLoadingState('WAITING_FOR_ANSWER');
      setError(err.response?.data?.message || 'Failed to submit your response. Please check and retry.');
    } finally {
      setSubmitting(false);
    }
  };

  // Complete interview and generate full comprehensive evaluation
  const completeInterviewSession = async (targetId) => {
    setCompleting(true);
    setLoadingState('EVALUATING');
    setLoadingMessage('AI is compiling your comprehensive interview evaluation report...');
    stopSpeech();

    try {
      const activeId = targetId || interviewId;
      const data = await completeAssessmentInterview(activeId);
      setFinalResult(data);
      setLoadingState('COMPLETED');
    } catch (err) {
      console.error('Interview completion error:', err);
      setLoadingState('WAITING_FOR_ANSWER');
      setError(err.response?.data?.message || 'Failed to finalize interview evaluation. Please retry.');
    } finally {
      setCompleting(false);
    }
  };

  // 1. Initial Loading Screen
  if (loading) {
    return (
      <div className="mx-auto flex min-h-[500px] max-w-2xl flex-col items-center justify-center px-4 text-center">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-accent border-t-transparent" />
          <Sparkles className="absolute text-accent" size={24} />
        </div>
        <h2 className="mt-6 font-display text-xl font-bold text-slate-900">
          Connecting to One-on-One AI Interviewer...
        </h2>
        <p className="mt-2 text-sm text-slate-500">{loadingMessage}</p>
        <p className="mt-1 text-xs text-slate-400">Verifying qualifications and preparing your interview</p>
      </div>
    );
  }

  // 2. Initial Connection Error Screen (Never stuck on loading!)
  if (initError) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600">
          <AlertCircle size={32} />
        </div>
        <h2 className="mt-5 font-display text-2xl font-bold text-slate-900">
          Unable to Start AI Interview
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{initError}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/assessment" className="btn-secondary">
            <ArrowLeft size={16} /> Assessment Hub
          </Link>
          <button type="button" onClick={initInterview} className="btn-primary">
            <RefreshCw size={16} /> Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // 3. Locked State Banner
  if (isLocked) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
          <Lock size={32} />
        </div>
        <h2 className="mt-5 font-display text-2xl font-bold text-slate-900">
          Round 3 — One-on-One AI Interview is Locked
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{lockedReason}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/assessment" className="btn-secondary">
            <ArrowLeft size={16} /> Assessment Hub
          </Link>
          <Link to="/assessment/aptitude" className="btn-primary">
            Start Aptitude Test
          </Link>
        </div>
      </div>
    );
  }

  // 4. Final Evaluation Result Screen
  if (finalResult) {
    const passed = finalResult.passed;
    const score = finalResult.overallInterviewScore ?? 0;
    const evalData = finalResult.evaluation || {};

    return (
      <div className="mx-auto max-w-4xl px-4 py-6 md:py-8">
        <div className="border-b border-slate-200 pb-5">
          <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-accent">
            Round 3 Complete
          </span>
          <h1 className="mt-2 font-display text-3xl font-bold text-slate-900 md:text-4xl">
            One-on-One AI Interview Evaluation
          </h1>
          <p className="text-sm text-slate-500">
            Comprehensive multi-competency evaluation from your live AI interview.
          </p>
        </div>

        {/* Qualification Status */}
        <div className="mt-6">
          {passed ? (
            <div className="flex items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 text-emerald-900">
              <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={24} />
              <div>
                <h3 className="font-display text-lg font-bold">PASSED — AI Interview Completed Successfully!</h3>
                <p className="mt-1 text-sm leading-relaxed text-emerald-800">
                  Congratulations! You achieved an overall score of <strong>{score} / 100</strong>, exceeding the 60% qualification standard.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-4 rounded-2xl border border-red-200 bg-red-50/80 p-5 text-red-900">
              <XCircle className="mt-0.5 shrink-0 text-red-600" size={24} />
              <div>
                <h3 className="font-display text-lg font-bold">Interview Result: Needs Improvement</h3>
                <p className="mt-1 text-sm leading-relaxed text-red-800">
                  Your overall interview score was <strong>{score} / 100</strong> (minimum 60 required). Review your performance breakdown below.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Competency Ratings Card */}
        <Card className="mt-6 p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Performance Breakdown</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <ScoreMetric label="Technical Knowledge" value={evalData.technicalScore} />
            <ScoreMetric label="Communication & Articulation" value={evalData.communicationScore} />
            <ScoreMetric label="Answer Relevance" value={evalData.relevanceScore} />
            <ScoreMetric label="Clarity & Structure" value={evalData.clarityScore} />
            <ScoreMetric label="Problem Solving" value={evalData.problemSolvingScore} />
            <ScoreMetric label="Overall Interview Score" value={score} highlight />
          </div>

          {/* Feedback Summary */}
          {evalData.overallFeedback && (
            <div className="mt-6 rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Interviewer Summary</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{evalData.overallFeedback}</p>
            </div>
          )}

          {/* Strengths & Weaknesses */}
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
              <h4 className="flex items-center gap-2 font-display text-sm font-bold text-emerald-900">
                <CheckCircle2 size={16} className="text-emerald-600" /> Key Strengths
              </h4>
              <ul className="mt-3 list-inside list-disc space-y-2 text-xs leading-relaxed text-emerald-800">
                {evalData.strengths?.length > 0 ? (
                  evalData.strengths.map((s, i) => <li key={i}>{s}</li>)
                ) : (
                  <li>Demonstrated readiness to engage with complex technical questions.</li>
                )}
              </ul>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5">
              <h4 className="flex items-center gap-2 font-display text-sm font-bold text-amber-900">
                <AlertCircle size={16} className="text-amber-600" /> Areas for Growth
              </h4>
              <ul className="mt-3 list-inside list-disc space-y-2 text-xs leading-relaxed text-amber-800">
                {evalData.weaknesses?.length > 0 ? (
                  evalData.weaknesses.map((w, i) => <li key={i}>{w}</li>)
                ) : (
                  <li>Focus on backing architectural choices with concrete performance trade-offs.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8 border-t border-slate-100 pt-6">
            <Link to="/assessment/result" className="btn-primary w-full justify-center text-base">
              <Award size={18} /> View Consolidated Hiring Assessment Result <ArrowRight size={18} />
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // 5. In-Progress Live Interview Interface
  return (
    <div className="mx-auto max-w-4xl px-4 py-4 md:py-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-accent">
              Round 3 of 3
            </span>
            <span className="text-xs font-semibold text-slate-400">One-on-One AI Interview</span>
          </div>
          <h1 className="mt-1 font-display text-xl font-bold text-slate-900 md:text-2xl">
            Live AI Technical Interview
          </h1>
        </div>

        <Link to="/assessment" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800">
          <ArrowLeft size={14} /> Exit
        </Link>
      </div>

      {/* Question Card & Status */}
      <Card className="mt-6 p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
          <span className="text-accent">
            Question {questionNumber} of {totalQuestions}
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider ${
                loadingState === 'AI_SPEAKING'
                  ? 'animate-pulse bg-amber-100 text-amber-800'
                  : loadingState === 'TRANSCRIBING'
                  ? 'bg-indigo-100 text-accent animate-pulse'
                  : loadingState === 'EVALUATING' || loadingState === 'GENERATING_NEXT_QUESTION'
                  ? 'bg-purple-100 text-purple-800 animate-pulse'
                  : loadingState === 'RECORDING'
                  ? 'bg-red-100 text-red-700 animate-pulse'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {loadingState === 'AI_SPEAKING'
                ? '🔊 AI Interviewer Speaking...'
                : loadingState === 'RECORDING'
                ? '🔴 Recording Answer...'
                : loadingState === 'TRANSCRIBING'
                ? '✍️ Transcribing Voice...'
                : loadingState === 'EVALUATING'
                ? '🧠 Evaluating Answer...'
                : loadingState === 'GENERATING_NEXT_QUESTION'
                ? '⚡ Preparing Next Question...'
                : '🎙️ Ready for Answer'}
            </span>
          </div>
        </div>

        {/* Question Content */}
        <div className="mt-6">
          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-600">
            {question?.category || 'Technical Question'}
          </span>
          <h2 className="mt-3 font-display text-xl font-bold leading-relaxed text-slate-900 md:text-2xl">
            {question?.question || 'Waiting for the interviewer to formulate the question...'}
          </h2>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={replayQuestionAudio}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              <Volume2 size={15} /> Replay Question
            </button>
            <button
              type="button"
              onClick={stopSpeech}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              <VolumeX size={15} /> Stop Audio
            </button>
          </div>
        </div>

        {/* Candidate Response Section */}
        <div className="mt-8 border-t border-slate-100 pt-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Your Response ({useTextInput ? 'Text Mode' : 'Microphone Mode'})
            </p>
            <button
              type="button"
              onClick={() => setUseTextInput(!useTextInput)}
              className="flex items-center gap-1.5 text-xs font-bold text-accent hover:underline"
            >
              {useTextInput ? <Mic size={14} /> : <Keyboard size={14} />}
              {useTextInput ? 'Switch to Voice Recording' : 'Switch to Text Input'}
            </button>
          </div>

          {/* Voice Mode */}
          {!useTextInput ? (
            <div className="mt-4">
              <VoiceRecorder
                maxDuration={120}
                disabled={submitting || completing}
                onRecordingStart={() => setLoadingState('RECORDING')}
                onRecordingComplete={(blob, duration) => {
                  setRecordingBlob(blob);
                  setRecordingDuration(duration);
                  setLoadingState('WAITING_FOR_ANSWER');
                  setError('');
                }}
              />
              {recordingBlob && (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  Voice response recorded ({recordingDuration}s). Ready to submit.
                </div>
              )}
            </div>
          ) : (
            /* Text Mode Fallback */
            <div className="mt-4">
              <textarea
                rows={5}
                className="input w-full resize-y text-sm leading-relaxed"
                placeholder="Type your structured answer here (explain core concepts, trade-offs, and concrete examples)..."
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                disabled={submitting || completing}
              />
            </div>
          )}

          {/* Active Processing Message */}
          {(submitting || completing) && (
            <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-indigo-50 p-3.5 text-xs font-semibold text-accent">
              <RefreshCw size={16} className="animate-spin" />
              {loadingMessage}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3.5 text-xs font-bold text-red-600">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          {/* Submit Response Button */}
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSubmitAnswer}
              loading={submitting || completing}
              disabled={submitting || completing || (!recordingBlob && !textAnswer.trim())}
              className="w-full justify-center sm:w-auto"
            >
              {questionNumber >= totalQuestions ? 'Submit Final Answer & Complete' : 'Submit Answer & Next'}
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ScoreMetric({ label, value, highlight = false }) {
  const displayVal = value !== null && value !== undefined ? `${value}%` : 'N/A';
  return (
    <div
      className={`rounded-2xl border p-4 ${
        highlight
          ? 'border-indigo-200 bg-indigo-50 text-accent'
          : 'border-slate-200 bg-white text-slate-800'
      }`}
    >
      <p className="text-[11px] font-bold uppercase tracking-wider opacity-70">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold">{displayVal}</p>
    </div>
  );
}
