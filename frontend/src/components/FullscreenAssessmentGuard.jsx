import { AlertTriangle, ArrowLeft, Maximize2, RotateCcw, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useEffect, useRef } from 'react';
import Button from './Button';
import Card from './Card';

/**
 * FullscreenAssessmentGuard Component
 * 
 * Provides:
 * 1. Pre-Test Fullscreen Policy Notice with required user gesture
 * 2. Fullscreen Recovery Dialog (role="alertdialog") after violation or reload
 * 3. Restarting Overlay
 * 4. Restart Error state
 * 5. Fullscreen unsupported fallback notice
 */
export default function FullscreenAssessmentGuard({
  roundName = 'Aptitude Examination',
  roundNumber = 1,
  passingScore = 15,
  totalQuestions = 20,
  durationMinutes = 25,
  fullscreenSupported = true,
  isRestarting = false,
  restartError = '',
  showRecoveryModal = false,
  showReloadNotice = false,
  onStart = () => {},
  onRecovery = () => {},
  onRetryRestart = () => {},
  onBackToHub = () => {},
  starting = false,
}) {
  const recoveryButtonRef = useRef(null);

  // Auto-focus recovery button for accessibility when modal opens
  useEffect(() => {
    if (showRecoveryModal || showReloadNotice) {
      setTimeout(() => {
        recoveryButtonRef.current?.focus();
      }, 50);
    }
  }, [showRecoveryModal, showReloadNotice]);

  // 1. Restarting Blocking Overlay
  if (isRestarting) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/80 p-4 text-white backdrop-blur-md"
        role="status"
        aria-live="polite"
      >
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        <h2 className="mt-5 font-display text-2xl font-bold">Fullscreen Exited</h2>
        <p className="mt-2 text-sm text-slate-300">Restarting your assessment securely from Question 1...</p>
      </div>
    );
  }

  // 2. Restart Error State
  if (restartError) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <ShieldAlert className="mx-auto text-red-500" size={50} />
        <h2 className="mt-4 font-display text-2xl font-bold text-slate-900">
          Unable to restart assessment
        </h2>
        <p className="mt-2 text-sm text-slate-600">{restartError}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="secondary" onClick={onBackToHub}>
            Back to Assessment Hub
          </Button>
          <Button onClick={onRetryRestart}>
            <RotateCcw size={16} /> Retry
          </Button>
        </div>
      </div>
    );
  }

  // 3. Fullscreen Recovery Dialog (User Exited Fullscreen or Reloaded)
  if (showRecoveryModal || showReloadNotice) {
    const isReload = showReloadNotice && !showRecoveryModal;
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="fs-dialog-title"
        aria-describedby="fs-dialog-desc"
      >
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl md:p-8">
          <div className="flex items-center gap-3 text-amber-600">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
              <AlertTriangle size={28} />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Security Alert</span>
              <h3 id="fs-dialog-title" className="font-display text-xl font-bold text-slate-900">
                {isReload ? 'Fullscreen Required' : 'Fullscreen Exit Detected'}
              </h3>
            </div>
          </div>

          <div id="fs-dialog-desc" className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            {isReload ? (
              <p>
                Fullscreen mode is required to continue this examination. Your session and remaining timer have been restored.
              </p>
            ) : (
              <>
                <p className="font-semibold text-slate-800">
                  You exited fullscreen mode during an active assessment.
                </p>
                <p>
                  In accordance with examination security rules, your current round has been <strong className="text-red-600">restarted from Question 1</strong> with answers cleared and a reset 25-minute timer.
                </p>
                <p className="text-xs text-slate-500">
                  Your browser requires a manual click to re-enter fullscreen mode before you can continue.
                </p>
              </>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={onBackToHub}>
              Back to Hub
            </Button>
            <Button
              ref={recoveryButtonRef}
              onClick={onRecovery}
              className="bg-accent hover:bg-accent/90"
            >
              <Maximize2 size={16} />
              {isReload ? 'Re-enter Fullscreen & Continue' : 'Re-enter Fullscreen & Restart Test'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/**
 * PreTestFullscreenNotice Card
 * 
 * Displayed before candidate starts Round 1 or Round 2 to enforce user-gesture fullscreen initiation.
 */
export function PreTestFullscreenNotice({
  roundName = 'Aptitude Examination',
  roundNumber = 1,
  passingScore = 15,
  totalQuestions = 20,
  durationMinutes = 25,
  fullscreenSupported = true,
  onEnterFullscreenAndStart = () => {},
  onBackToHub = () => {},
  starting = false,
}) {
  return (
    <div className="mx-auto max-w-2xl py-8 md:py-12">
      <Card className="border-slate-200 p-6 md:p-10 shadow-lg">
        {/* Header Badge */}
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-accent">
            Round {roundNumber} of 3
          </span>
          <span className="text-xs font-semibold text-slate-400">
            Passing Threshold: {passingScore} / {totalQuestions}
          </span>
        </div>

        {/* Title */}
        <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          {roundName}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Formal candidate assessment for graduate and professional roles.
        </p>

        {/* Exam Specifications */}
        <div className="mt-6 grid grid-cols-3 gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4 text-center">
          <div>
            <p className="text-xs font-medium text-slate-400">Total Questions</p>
            <p className="mt-0.5 font-display text-xl font-bold text-slate-800">{totalQuestions}</p>
          </div>
          <div className="border-x border-slate-200">
            <p className="text-xs font-medium text-slate-400">Duration</p>
            <p className="mt-0.5 font-display text-xl font-bold text-slate-800">{durationMinutes} Mins</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Pass Mark</p>
            <p className="mt-0.5 font-display text-xl font-bold text-emerald-600">{passingScore} / {totalQuestions}</p>
          </div>
        </div>

        {/* Security Policy Notice Box */}
        <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/50 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 shrink-0 text-accent" size={22} />
            <div>
              <h2 className="font-semibold text-slate-900">Fullscreen Assessment Notice</h2>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                This assessment requires strict <strong>fullscreen mode</strong> for its entire duration to guarantee examination integrity.
              </p>
              <ul className="mt-2.5 space-y-1.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <strong>Fullscreen Exit Policy:</strong> If you exit fullscreen during the assessment, the current test will <strong className="text-red-700">automatically restart from Question 1</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    Your answers for the current attempt will be cleared when the round restarts, and the 25-minute timer will reset.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    Browsers require an explicit user gesture to enter fullscreen mode.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Unsupported Browser Warning Fallback */}
        {!fullscreenSupported && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
            <p className="font-bold">Fullscreen not supported in this browser</p>
            <p className="mt-1">
              Fullscreen mode is not available on this device/browser. We recommend using a desktop Chromium or Edge browser. You may continue in secure full-width mode.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-6">
          <Button variant="secondary" onClick={onBackToHub}>
            <ArrowLeft size={16} /> Back to Hub
          </Button>
          <Button
            onClick={onEnterFullscreenAndStart}
            loading={starting}
            className="bg-accent hover:bg-accent/90 shadow-md"
          >
            <Maximize2 size={16} />
            {fullscreenSupported ? 'Enter Fullscreen & Start Test' : 'Start Test in Full-Width Mode'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
