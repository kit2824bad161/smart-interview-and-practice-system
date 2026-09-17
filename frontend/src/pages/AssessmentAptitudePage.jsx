import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  Send,
  ShieldAlert,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import FullscreenAssessmentGuard, { PreTestFullscreenNotice } from '../components/FullscreenAssessmentGuard';
import useAssessmentFullscreen from '../hooks/useAssessmentFullscreen';
import {
  getAptitudeSession,
  restartAssessmentRound,
  saveAssessmentAptitudeProgress,
  startAssessmentAptitude,
  submitAssessmentAptitude,
} from '../services/api';

function formatTimer(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function AssessmentAptitudePage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');
  const [noActiveSession, setNoActiveSession] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const selectedAnswersRef = useRef(selectedAnswers);
  selectedAnswersRef.current = selectedAnswers;

  const timerRef = useRef(null);
  const targetEndTimeRef = useRef(null);
  const autoSubmittedRef = useRef(false);

  // Reusable Fullscreen Security Hook
  const {
    isFullscreen,
    fullscreenSupported,
    assessmentActive,
    setAssessmentActive,
    isRestarting,
    restartError,
    setRestartError,
    showRecoveryModal,
    setShowRecoveryModal,
    showReloadNotice,
    setShowReloadNotice,
    intentionalExitRef,
    requestFullscreenSafe,
    exitFullscreenSafe,
    handleManualRecovery,
    handleFullscreenViolation,
  } = useAssessmentFullscreen({
    round: 'aptitude',
    onRestart: async () => {
      console.log('[FULLSCREEN] Restarting aptitude round on backend...');
      const res = await restartAssessmentRound('aptitude', { reason: 'FULLSCREEN_EXIT' });
      const session = res?.session || res;
      setQuestions(session.questions || []);
      setSelectedAnswers({});
      setCurrentIndex(0);
      const remaining = Number(session.remainingSeconds) || 25 * 60;
      setSecondsRemaining(remaining);
      targetEndTimeRef.current = Date.now() + remaining * 1000;
    },
  });

  // Submit test to backend
  const handleFinalSubmit = useCallback(async () => {
    if (submitting || autoSubmittedRef.current) return;
    autoSubmittedRef.current = true;
    setSubmitting(true);
    setShowConfirmModal(false);

    try {
      // Mark completion before exiting fullscreen to prevent violation trigger
      intentionalExitRef.current = true;
      setAssessmentActive(false);

      const currentAnswers = selectedAnswersRef.current || {};
      const responses = Object.entries(currentAnswers).map(([qNum, ans]) => ({
        questionNumber: Number(qNum),
        selectedAnswer: ans,
      }));

      const result = await submitAssessmentAptitude({ responses });
      sessionStorage.setItem('smart_aptitude_result', JSON.stringify(result));

      // Intentionally exit fullscreen
      await exitFullscreenSafe();

      navigate('/assessment/aptitude/result');
    } catch (err) {
      console.error('Submit error:', err);
      if (err.response?.status === 409) {
        await exitFullscreenSafe();
        navigate('/assessment/aptitude/result');
      } else {
        setError(err.response?.data?.message || 'Unable to submit your test. Please try again.');
        setSubmitting(false);
        autoSubmittedRef.current = false;
        intentionalExitRef.current = false;
      }
    }
  }, [exitFullscreenSafe, intentionalExitRef, navigate, setAssessmentActive, submitting]);

  const handleFinalSubmitRef = useRef(handleFinalSubmit);
  handleFinalSubmitRef.current = handleFinalSubmit;

  // Restore existing session on mount
  const loadAssessment = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setNoActiveSession(false);
      console.log('[APTITUDE] Restoring session...');

      const response = await getAptitudeSession();
      console.log('[APTITUDE] API response:', response);
      const session = response?.session;
      console.log('[APTITUDE] Session:', session);
      console.log('[APTITUDE] Status:', session?.status);
      console.log('[APTITUDE] expiresAt:', session?.expiresAt);

      if (!session) {
        console.log('[APTITUDE] No active session found');
        setNoActiveSession(true);
        setAssessmentActive(false);
        return;
      }

      if (session.status === 'PASSED' || session.status === 'FAILED') {
        intentionalExitRef.current = true;
        setAssessmentActive(false);
        await exitFullscreenSafe();
        navigate('/assessment/aptitude/result');
        return;
      }

      if (Array.isArray(session.questions) && session.questions.length > 0) {
        setQuestions(session.questions);
      }

      if (session.savedAnswers) {
        setSelectedAnswers(session.savedAnswers);
      } else if (Array.isArray(session.responses)) {
        const answersMap = {};
        session.responses.forEach((r) => {
          if (r.selectedAnswer) answersMap[r.questionNumber] = r.selectedAnswer;
        });
        setSelectedAnswers(answersMap);
      }

      let remaining = 25 * 60;
      if (session.expiresAt) {
        remaining = Math.max(
          0,
          Math.floor((new Date(session.expiresAt).getTime() - Date.now()) / 1000)
        );
      } else if (session.remainingSeconds !== undefined) {
        remaining = Math.max(0, Number(session.remainingSeconds) || 0);
      }

      setSecondsRemaining(remaining);
      targetEndTimeRef.current = Date.now() + remaining * 1000;

      if (remaining <= 0) {
        console.log('[APTITUDE] Timer expired on load; auto-submitting once');
        handleFinalSubmitRef.current();
        return;
      }

      // Mark assessment active and check if fullscreen re-entry is needed after page reload
      setAssessmentActive(true);
      if (!document.fullscreenElement && fullscreenSupported) {
        setShowReloadNotice(true);
      }
    } catch (err) {
      console.error(
        '[APTITUDE] Restore failed:',
        err?.response?.status,
        err?.response?.data,
        err
      );
      if (err?.response?.status === 409) {
        navigate('/assessment/aptitude/result');
        return;
      }
      setError(err?.response?.data?.message || 'Unable to restore Aptitude Assessment.');
    } finally {
      setLoading(false);
    }
  }, [exitFullscreenSafe, fullscreenSupported, intentionalExitRef, navigate, setAssessmentActive, setShowReloadNotice]);

  useEffect(() => {
    console.log('[APTITUDE] Component mounted');
    loadAssessment();
  }, [loadAssessment]);

  // Start new aptitude test with user-gesture fullscreen entry
  const handleEnterFullscreenAndStart = async () => {
    try {
      setStarting(true);
      setError('');

      // 1. Enter fullscreen directly from user click gesture
      await requestFullscreenSafe();

      // 2. Call backend start API
      const data = await startAssessmentAptitude();
      const session = data?.session || data;

      setQuestions(session?.questions || data?.questions || []);
      setSelectedAnswers(session?.savedAnswers || data?.savedAnswers || {});
      setCurrentIndex(0);

      const remaining = Math.max(
        0,
        Number(session?.remainingSeconds || data?.remainingSeconds) || 25 * 60
      );
      setSecondsRemaining(remaining);
      targetEndTimeRef.current = Date.now() + remaining * 1000;
      setNoActiveSession(false);
      setAssessmentActive(true);
    } catch (err) {
      if (err.response?.status === 409) {
        navigate('/assessment/aptitude/result');
        return;
      }
      setError(err.response?.data?.message || 'Failed to start Aptitude test.');
    } finally {
      setStarting(false);
    }
  };

  // Countdown timer resilient to tab inactive / drift
  useEffect(() => {
    if (loading || secondsRemaining <= 0 || submitting || !questions.length) return;

    timerRef.current = setInterval(() => {
      if (!targetEndTimeRef.current) return;
      const left = Math.max(0, Math.ceil((targetEndTimeRef.current - Date.now()) / 1000));
      setSecondsRemaining(left);

      if (left <= 0) {
        clearInterval(timerRef.current);
        handleFinalSubmitRef.current();
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [loading, questions.length, secondsRemaining, submitting]);

  // Save selected option and sync progress to server
  const handleSelectOption = (option) => {
    if (submitting || isRestarting) return;
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const updated = {
      ...selectedAnswers,
      [currentQ.questionNumber]: option,
    };
    setSelectedAnswers(updated);

    saveAssessmentAptitudeProgress({
      responses: [{ questionNumber: currentQ.questionNumber, selectedAnswer: option }],
    }).catch(() => {});
  };

  const answeredCount = Object.keys(selectedAnswers).filter(
    (k) => selectedAnswers[k] && selectedAnswers[k].trim() !== ''
  ).length;
  const totalQuestions = questions.length || 20;
  const unansweredCount = Math.max(0, totalQuestions - answeredCount);
  const currentQ = questions[currentIndex];
  const isTimeCritical = secondsRemaining < 300; // < 5 mins

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[500px] max-w-4xl flex-col items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        <p className="mt-4 font-semibold text-slate-600">Loading Aptitude Assessment...</p>
        <p className="mt-1 text-xs text-slate-400">Restoring your timer and question session</p>
      </div>
    );
  }

  if (error && !questions.length) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <ShieldAlert className="mx-auto text-red-500" size={48} />
        <h2 className="mt-4 font-display text-2xl font-bold text-slate-800">
          Unable to restore Aptitude Assessment
        </h2>
        <p className="mt-2 text-sm text-slate-600">{error}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="secondary" onClick={() => navigate('/assessment')}>
            Back to Assessment
          </Button>
          <Button onClick={loadAssessment}>Retry</Button>
        </div>
      </div>
    );
  }

  // Pre-test notice before test starts
  if (noActiveSession && !questions.length) {
    return (
      <PreTestFullscreenNotice
        roundName="Round 1 – Aptitude Examination"
        roundNumber={1}
        passingScore={15}
        totalQuestions={20}
        durationMinutes={25}
        fullscreenSupported={fullscreenSupported}
        onEnterFullscreenAndStart={handleEnterFullscreenAndStart}
        onBackToHub={() => navigate('/assessment')}
        starting={starting}
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-4 md:py-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-accent">
              Round 1 of 3
            </span>
            <span className="text-xs font-semibold text-slate-400">Passing: 15 / 20</span>
          </div>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Aptitude Examination
          </h1>
          <p className="text-xs text-slate-500">
            Answers and detailed explanations are revealed after final test submission.
          </p>
        </div>

        {/* 25-Minute Countdown Timer */}
        <div
          className={`flex items-center gap-3 rounded-2xl px-5 py-3 shadow-sm transition ${
            isTimeCritical
              ? 'animate-pulse border border-red-300 bg-red-50 text-red-700'
              : 'border border-slate-200 bg-white text-slate-900'
          }`}
        >
          <Clock className={isTimeCritical ? 'text-red-600' : 'text-accent'} size={22} />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Time Left</p>
            <span className="font-mono text-2xl font-black">{formatTimer(secondsRemaining)}</span>
          </div>
        </div>
      </div>

      {/* Progress & Stat Bar */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-slate-500">
        <div className="flex items-center gap-2">
          <span>Question {currentIndex + 1} of {totalQuestions}</span>
          <span className="text-slate-300">•</span>
          <span className="text-accent">{answeredCount} Answered</span>
          <span className="text-slate-300">•</span>
          <span>{unansweredCount} Left</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
            {currentQ?.category || 'General'}
          </span>
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-accent">
            {currentQ?.topic || 'Aptitude'}
          </span>
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full bg-accent transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      {currentQ && (
        <Card className="mt-6 p-6 md:p-9">
          <div className="flex items-start justify-between gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-sm font-bold text-accent">
              Q{currentQ.questionNumber}
            </span>
            <div className="flex-1">
              <h2 className="font-display text-xl font-bold leading-relaxed text-slate-900 md:text-2xl">
                {currentQ.question}
              </h2>
            </div>
          </div>

          {/* Options (Radio Style, Clean Slate / Accent, NO GREEN/RED) */}
          <div className="mt-8 space-y-3">
            {currentQ.options?.map((opt, optIndex) => {
              const isSelected = selectedAnswers[currentQ.questionNumber] === opt;
              const optionLetter = String.fromCharCode(65 + optIndex);

              return (
                <button
                  key={optIndex}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  className={`flex w-full items-center justify-between rounded-xl border p-4 text-left text-sm font-medium transition ${
                    isSelected
                      ? 'border-accent bg-indigo-50/70 text-slate-900 ring-2 ring-indigo-200'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition ${
                        isSelected
                          ? 'bg-accent text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {optionLetter}
                    </span>
                    <span className="leading-snug">{opt}</span>
                  </div>
                  {isSelected && <CheckCircle className="text-accent shrink-0" size={18} />}
                </button>
              );
            })}
          </div>

          {/* Action Navigation Buttons */}
          <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6">
            <Button
              variant="secondary"
              onClick={() => setCurrentIndex((idx) => Math.max(0, idx - 1))}
              disabled={currentIndex === 0}
            >
              <ArrowLeft size={16} /> Previous
            </Button>

            <div className="flex items-center gap-3">
              {currentIndex < totalQuestions - 1 ? (
                <Button onClick={() => setCurrentIndex((idx) => Math.min(totalQuestions - 1, idx + 1))}>
                  Next <ArrowRight size={16} />
                </Button>
              ) : (
                <Button onClick={() => setShowConfirmModal(true)} className="bg-emerald-600 hover:bg-emerald-700">
                  <Send size={16} /> Submit Test
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Question Navigator Grid */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Question Navigator (1 to 20)
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-md bg-indigo-600" /> Answered
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-md border border-slate-300 bg-white" /> Unanswered
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-md border-2 border-accent" /> Active
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-10 md:grid-cols-20">
          {questions.map((q, idx) => {
            const hasAnswer = Boolean(selectedAnswers[q.questionNumber]);
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.questionNumber}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`flex h-10 w-full items-center justify-center rounded-xl text-xs font-bold transition ${
                  isCurrent
                    ? 'border-2 border-accent text-accent ring-2 ring-indigo-100'
                    : hasAnswer
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'border border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-200'
                }`}
              >
                {q.questionNumber}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex justify-end border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="text-xs font-bold text-slate-500 hover:text-accent"
          >
            Ready to finish? Click here to Submit Test →
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertTriangle size={24} />
              <h3 className="font-display text-lg font-bold text-slate-900">Confirm Submission</h3>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {unansweredCount > 0 ? (
                <>
                  You still have <strong className="text-amber-700">{unansweredCount} unanswered questions</strong> out of 20.
                  Are you sure you want to submit your test now?
                </>
              ) : (
                'Are you sure you want to submit your test? You cannot change your answers after submission.'
              )}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="secondary"
                disabled={submitting}
                onClick={() => setShowConfirmModal(false)}
              >
                Continue Test
              </Button>
              <Button
                onClick={handleFinalSubmit}
                loading={submitting}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Confirm & Submit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Security Guard (Recovery Dialog, Reload Notice, Restarting Overlay) */}
      <FullscreenAssessmentGuard
        roundName="Aptitude Examination"
        roundNumber={1}
        passingScore={15}
        totalQuestions={20}
        durationMinutes={25}
        fullscreenSupported={fullscreenSupported}
        isRestarting={isRestarting}
        restartError={restartError}
        showRecoveryModal={showRecoveryModal}
        showReloadNotice={showReloadNotice}
        onRecovery={handleManualRecovery}
        onRetryRestart={handleFullscreenViolation}
        onBackToHub={() => {
          intentionalExitRef.current = true;
          setAssessmentActive(false);
          exitFullscreenSafe();
          navigate('/assessment');
        }}
      />
    </div>
  );
}
