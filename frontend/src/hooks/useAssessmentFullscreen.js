import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Custom hook to enforce fullscreen security during AI Hiring Assessments.
 * 
 * @param {Object} options
 * @param {string} options.round - 'aptitude' | 'technical'
 * @param {Function} options.onRestart - async callback invoked when fullscreen exit triggers round restart
 */
export function useAssessmentFullscreen({ round = 'aptitude', onRestart } = {}) {
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));
  const [fullscreenSupported, setFullscreenSupported] = useState(true);
  const [assessmentActive, setAssessmentActive] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [restartError, setRestartError] = useState('');
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [showReloadNotice, setShowReloadNotice] = useState(false);

  const intentionalExitRef = useRef(false);
  const handlingViolationRef = useRef(false);
  const assessmentActiveRef = useRef(false);
  assessmentActiveRef.current = assessmentActive;

  const onRestartRef = useRef(onRestart);
  onRestartRef.current = onRestart;

  // Check browser fullscreen support on mount
  useEffect(() => {
    const supported = Boolean(
      document.fullscreenEnabled &&
      document.documentElement &&
      typeof document.documentElement.requestFullscreen === 'function'
    );
    setFullscreenSupported(supported);
  }, []);

  // Request fullscreen on real user gesture
  const requestFullscreenSafe = useCallback(async () => {
    console.log('[FULLSCREEN] Requesting fullscreen');
    if (!fullscreenSupported || !document.documentElement?.requestFullscreen) {
      return false;
    }
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
      setIsFullscreen(true);
      console.log('[FULLSCREEN] Entered fullscreen');
      return true;
    } catch (err) {
      console.warn('[FULLSCREEN] Fullscreen request rejected or failed:', err);
      return false;
    }
  }, [fullscreenSupported]);

  // Safe intentional exit (used on test submit / completion)
  const exitFullscreenSafe = useCallback(async () => {
    intentionalExitRef.current = true;
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
      setIsFullscreen(false);
    } catch (err) {
      console.warn('[FULLSCREEN] Safe exit failed:', err);
    }
  }, []);

  // Handler for fullscreen violation: call backend restart and attempt recovery
  const handleFullscreenViolation = useCallback(async () => {
    if (handlingViolationRef.current) return;
    handlingViolationRef.current = true;
    setIsRestarting(true);
    setRestartError('');

    console.log('[FULLSCREEN] Fullscreen exited');
    console.log('[FULLSCREEN] Sending restart request');

    try {
      if (onRestartRef.current) {
        await onRestartRef.current();
      }
      console.log('[FULLSCREEN] Assessment restarted');

      // Attempt automatic re-entry safely once
      let autoEntered = false;
      try {
        if (document.documentElement?.requestFullscreen) {
          await document.documentElement.requestFullscreen();
          autoEntered = true;
          setIsFullscreen(true);
          console.log('[FULLSCREEN] Automatic fullscreen re-entry succeeded');
        }
      } catch {
        console.log('[FULLSCREEN] Browser blocked automatic fullscreen');
      }

      if (!autoEntered) {
        // Browser requires a user gesture; show blocking recovery dialog
        setShowRecoveryModal(true);
      }
    } catch (err) {
      console.error('[FULLSCREEN] Restart failed:', err);
      setRestartError(err.response?.data?.message || 'Unable to restart assessment.');
    } finally {
      setIsRestarting(false);
      handlingViolationRef.current = false;
    }
  }, []);

  // Manual recovery clicked by candidate on the recovery dialog
  const handleManualRecovery = useCallback(async () => {
    console.log('[FULLSCREEN] Manual fullscreen recovery');
    const entered = await requestFullscreenSafe();
    if (entered || !fullscreenSupported) {
      setShowRecoveryModal(false);
      setShowReloadNotice(false);
      setRestartError('');
    }
  }, [fullscreenSupported, requestFullscreenSafe]);

  // Listen for fullscreenchange events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const currentlyFullscreen = Boolean(document.fullscreenElement);
      setIsFullscreen(currentlyFullscreen);

      if (!currentlyFullscreen) {
        // Fullscreen was exited
        if (assessmentActiveRef.current && !intentionalExitRef.current) {
          // Real violation detected!
          handleFullscreenViolation();
        }
      } else {
        // Restored fullscreen
        setShowRecoveryModal(false);
        setShowReloadNotice(false);
      }
    };

    const handleFullscreenError = (e) => {
      console.warn('[FULLSCREEN] fullscreenerror event:', e);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('fullscreenerror', handleFullscreenError);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('fullscreenerror', handleFullscreenError);
    };
  }, [handleFullscreenViolation]);

  return {
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
  };
}

export default useAssessmentFullscreen;
