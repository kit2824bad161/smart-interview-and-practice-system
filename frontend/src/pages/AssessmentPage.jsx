import {
  AlertCircle,
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code2,
  Lock,
  Mic,
  Play,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  TimerReset,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';
import { DashboardSkeleton } from '../components/LoadingSkeleton';
import { useAuth } from '../context/AuthContext';
import { getCurrentAssessment, startAssessment } from '../services/api';

export default function AssessmentPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const authLoading = auth?.authLoading || false;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [starting, setStarting] = useState(false);
  const [actionError, setActionError] = useState('');

  const [jobRole, setJobRole] = useState('Software Developer');
  const [experience, setExperience] = useState('Intermediate');

  const loadAssessment = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCurrentAssessment();
      if (!response || !response.assessment) {
        setAssessment(null);
        return;
      }
      const current = response.assessment;
      setAssessment(current);
      if (current?.jobRole) setJobRole(current.jobRole);
      if (current?.experience) setExperience(current.experience);
    } catch (err) {
      if (err.response?.status === 404) {
        setAssessment(null);
      } else {
        setError(err.response?.data?.message || 'Unable to load assessment.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      loadAssessment();
    }
  }, [authLoading]);

  const handleStartOrContinue = async () => {
    setStarting(true);
    setActionError('');
    try {
      const res = await startAssessment({ jobRole, experience });
      const current = res.assessment;
      setAssessment(current);

      const currentApt = current.aptitude?.status || current.aptitudeStatus;
      const currentTech = current.technical?.status || current.technicalStatus;
      const currentInterview = current.interview?.status || current.aiInterviewStatus;

      if (currentApt !== 'PASSED') {
        navigate('/assessment/aptitude');
      } else if (currentTech !== 'PASSED') {
        navigate('/assessment/technical');
      } else if (currentInterview !== 'PASSED') {
        navigate('/assessment/interview');
      } else {
        navigate('/assessment/result');
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Unable to start assessment.');
    } finally {
      setStarting(false);
    }
  };

  const handleReset = async () => {
    if (
      !window.confirm(
        'Are you sure you want to start a new assessment session? Previous progress will be reset.'
      )
    )
      return;
    setStarting(true);
    setActionError('');
    try {
      const res = await startAssessment({ jobRole, experience, reset: true });
      setAssessment(res.assessment);
      navigate('/assessment/aptitude');
    } catch (err) {
      setActionError(err.response?.data?.message || 'Unable to reset assessment.');
    } finally {
      setStarting(false);
    }
  };

  if (authLoading || loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mx-auto">
          <ShieldAlert size={28} />
        </div>
        <h2 className="mt-4 font-display text-xl font-bold text-slate-900">
          Unable to Load Assessment
        </h2>
        <p className="mt-1.5 text-xs text-slate-500">{error}</p>
        <div className="mt-6 flex justify-center">
          <Button onClick={loadAssessment} variant="primary">
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  // Extract round status
  const apt = assessment?.aptitude || {};
  const tech = assessment?.technical || {};
  const interview = assessment?.interview || {};

  const aptStatus = apt.status || assessment?.aptitudeStatus || 'NOT_STARTED';
  const techStatus =
    tech.status ||
    assessment?.technicalStatus ||
    (aptStatus === 'PASSED' ? 'NOT_STARTED' : 'LOCKED');
  const interviewStatus =
    interview.status ||
    assessment?.aiInterviewStatus ||
    (aptStatus === 'PASSED' && techStatus === 'PASSED' ? 'NOT_STARTED' : 'LOCKED');

  const aptPassed = aptStatus === 'PASSED' && Number(apt.score) >= 15;
  const aptFailed = aptStatus === 'FAILED';

  const techPassed = techStatus === 'PASSED' && Number(tech.score) >= 15;
  const techFailed = techStatus === 'FAILED';

  const interviewPassed = interviewStatus === 'PASSED';
  const interviewFailed = interviewStatus === 'FAILED';

  const isCompleted =
    assessment?.status === 'COMPLETED' ||
    assessment?.finalStatus === 'PASS' ||
    (aptPassed && techPassed && interviewPassed);

  const isAnyRoundFailed =
    aptFailed || techFailed || interviewFailed || assessment?.finalStatus === 'FAIL';

  return (
    <div className="space-y-8 pb-10">
      {/* Top Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="rounded-full bg-slate-900 text-white text-[11px] font-semibold px-3 py-1">
            AI HIRING ASSESSMENT
          </span>
          <span className="text-xs font-semibold text-slate-500">Official Evaluation Process</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Four-Stage Evaluation Pipeline
        </h1>
        <p className="mt-1 text-sm text-slate-500 max-w-3xl leading-relaxed">
          Standardized candidate assessment. Evaluation settings are locked and platform-enforced. Complete all rounds sequentially to generate your final hiring dossier.
        </p>

        {/* Progress Overview Bar */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className={`p-3 rounded-xl border ${aptPassed ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : aptStatus === 'IN_PROGRESS' ? 'bg-slate-50 border-slate-900 text-slate-900' : 'bg-white border-slate-200 text-slate-500'}`}>
            <span className="text-[10px] font-bold uppercase tracking-wider block">Round 1</span>
            <span className="text-xs font-bold mt-0.5 block">Aptitude</span>
            <span className="text-[11px] opacity-80 mt-1 block">{aptPassed ? 'Passed' : aptFailed ? 'Failed' : aptStatus === 'IN_PROGRESS' ? 'In Progress' : 'Pending'}</span>
          </div>

          <div className={`p-3 rounded-xl border ${techPassed ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : techStatus === 'IN_PROGRESS' ? 'bg-slate-50 border-slate-900 text-slate-900' : 'bg-white border-slate-200 text-slate-500'}`}>
            <span className="text-[10px] font-bold uppercase tracking-wider block">Round 2</span>
            <span className="text-xs font-bold mt-0.5 block">Technical MCQs</span>
            <span className="text-[11px] opacity-80 mt-1 block">{techPassed ? 'Passed' : techFailed ? 'Failed' : techStatus === 'IN_PROGRESS' ? 'In Progress' : !aptPassed ? 'Locked' : 'Pending'}</span>
          </div>

          <div className={`p-3 rounded-xl border ${techPassed ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-white border-slate-200 text-slate-500'}`}>
            <span className="text-[10px] font-bold uppercase tracking-wider block">Round 3</span>
            <span className="text-xs font-bold mt-0.5 block">Problem Solving</span>
            <span className="text-[11px] opacity-80 mt-1 block">{techPassed ? 'Qualified' : 'Locked'}</span>
          </div>

          <div className={`p-3 rounded-xl border ${interviewPassed ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : interviewStatus === 'IN_PROGRESS' ? 'bg-slate-50 border-slate-900 text-slate-900' : 'bg-white border-slate-200 text-slate-500'}`}>
            <span className="text-[10px] font-bold uppercase tracking-wider block">Round 4</span>
            <span className="text-xs font-bold mt-0.5 block">AI Interview</span>
            <span className="text-[11px] opacity-80 mt-1 block">{interviewPassed ? 'Passed' : interviewFailed ? 'Failed' : interviewStatus === 'IN_PROGRESS' ? 'In Progress' : !(aptPassed && techPassed) ? 'Locked' : 'Pending'}</span>
          </div>
        </div>
      </div>

      {actionError && (
        <div className="flex items-center gap-3 rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs font-bold text-rose-700">
          <ShieldAlert size={16} /> {actionError}
        </div>
      )}

      {/* Main Layout: Stages Roadmap on Left, Session Dossier on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Roadmap Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Round 1: Aptitude */}
          <StageCard
            roundNumber={1}
            title="Round 1 – Aptitude Assessment"
            subtitle="20 Questions • 25 Minutes • Fixed Moderate Difficulty • Passing: 15 / 20"
            icon={<Target size={20} />}
            status={aptStatus}
            scoreDisplay={
              aptStatus === 'PASSED' || aptStatus === 'FAILED'
                ? `${apt.score ?? 0} / 20`
                : null
            }
            isPassed={aptPassed}
            isFailed={aptFailed}
            isLocked={false}
            actionUrl="/assessment/aptitude"
            resultUrl={
              aptStatus === 'PASSED' || aptStatus === 'FAILED'
                ? '/assessment/aptitude/result'
                : null
            }
          />

          {/* Visual Step Connector */}
          <div className="flex justify-center py-1">
            <div className="h-4 w-0.5 bg-slate-200" />
          </div>

          {/* Round 2: Technical MCQs */}
          <StageCard
            roundNumber={2}
            title="Round 2 – Technical MCQs"
            subtitle="20 Questions • 25 Minutes • Programming, DSA, OOP, DBMS, OS, Networking • Passing: 15 / 20"
            icon={<Code2 size={20} />}
            status={techStatus}
            scoreDisplay={
              techStatus === 'PASSED' || techStatus === 'FAILED'
                ? `${tech.score ?? 0} / 20`
                : null
            }
            isPassed={techPassed}
            isFailed={techFailed}
            isLocked={!aptPassed}
            lockReason="Requires passing Round 1 (≥ 15/20)"
            actionUrl="/assessment/technical"
            resultUrl={
              techStatus === 'PASSED' || techStatus === 'FAILED'
                ? '/assessment/technical/result'
                : null
            }
          />

          {/* Visual Step Connector */}
          <div className="flex justify-center py-1">
            <div className="h-4 w-0.5 bg-slate-200" />
          </div>

          {/* Round 3: Problem Solving */}
          <StageCard
            roundNumber={3}
            title="Round 3 – Problem Solving"
            subtitle="Algorithmic Challenge • Clean Code & Runtime Efficiency • Hidden Test Cases"
            icon={<Sparkles size={20} />}
            status={techPassed ? (interviewPassed ? 'PASSED' : 'IN_PROGRESS') : 'LOCKED'}
            scoreDisplay={techPassed ? 'Qualified' : null}
            isPassed={techPassed}
            isFailed={false}
            isLocked={!techPassed}
            lockReason="Requires passing Round 2 (≥ 15/20)"
            actionUrl="/practice/problem-solving"
            resultUrl={null}
          />

          {/* Visual Step Connector */}
          <div className="flex justify-center py-1">
            <div className="h-4 w-0.5 bg-slate-200" />
          </div>

          {/* Round 4: One-on-One AI Interview */}
          <StageCard
            roundNumber={4}
            title="Round 4 – AI One-on-One Interview"
            subtitle="Interactive Voice Interview • Real-Time AI Speech & Evaluation • Passing: 60%"
            icon={<Mic size={20} />}
            status={interviewStatus}
            scoreDisplay={
              interviewStatus === 'PASSED' || interviewStatus === 'FAILED'
                ? `${interview.score ?? 0}%`
                : null
            }
            isPassed={interviewPassed}
            isFailed={interviewFailed}
            isLocked={!(aptPassed && techPassed)}
            lockReason="Requires passing Rounds 1 & 2 (≥ 15/20 each)"
            actionUrl="/assessment/interview"
            resultUrl={
              interviewStatus === 'PASSED' || interviewStatus === 'FAILED'
                ? '/assessment/result'
                : null
            }
          />
        </div>

        {/* Session Dossier Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 bg-white text-slate-900 border-slate-200/80 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Evaluation Dossier
              </span>
              <h2 className="mt-1 font-display text-lg font-bold text-slate-900">
                {isCompleted
                  ? 'Assessment Completed'
                  : aptFailed
                  ? 'Aptitude Round Failed'
                  : techFailed
                  ? 'Technical Round Failed'
                  : interviewFailed
                  ? 'AI Interview Failed'
                  : !assessment
                  ? 'Ready to Begin'
                  : aptPassed && techPassed && interviewStatus === 'IN_PROGRESS'
                  ? 'AI Interview In Progress'
                  : aptPassed && techPassed
                  ? 'Ready for Round 4'
                  : aptPassed && techStatus === 'IN_PROGRESS'
                  ? 'Technical MCQ In Progress'
                  : aptPassed
                  ? 'Ready for Round 2'
                  : aptStatus === 'IN_PROGRESS'
                  ? 'Round 1 In Progress'
                  : 'Round 1 Ready'}
              </h2>
            </div>

            {/* Session Parameters (Locked) */}
            <div className="space-y-3 border-y border-slate-100 py-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Evaluation Mode</span>
                <span className="font-semibold text-slate-800">Locked System</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Role</span>
                <strong className="text-slate-900">{jobRole}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Experience Tier</span>
                <strong className="text-slate-900">{experience}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Round 1 (Aptitude)</span>
                <span
                  className={`font-semibold ${
                    aptPassed
                      ? 'text-emerald-700'
                      : aptFailed
                      ? 'text-rose-700'
                      : 'text-slate-400'
                  }`}
                >
                  {aptPassed
                    ? `Passed (${apt.score ?? 0}/20)`
                    : aptFailed
                    ? `Failed (${apt.score ?? 0}/20)`
                    : aptStatus === 'IN_PROGRESS'
                    ? 'In Progress'
                    : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Round 2 (Technical)</span>
                <span
                  className={`font-semibold ${
                    techPassed
                      ? 'text-emerald-700'
                      : techFailed
                      ? 'text-rose-700'
                      : 'text-slate-400'
                  }`}
                >
                  {techPassed
                    ? `Passed (${tech.score ?? 0}/20)`
                    : techFailed
                    ? `Failed (${tech.score ?? 0}/20)`
                    : techStatus === 'IN_PROGRESS'
                    ? 'In Progress'
                    : !aptPassed
                    ? 'Locked'
                    : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Round 3 (Problem Solving)</span>
                <span
                  className={`font-semibold ${
                    techPassed ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  {techPassed ? 'Qualified' : 'Locked'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Round 4 (Interview)</span>
                <span
                  className={`font-semibold ${
                    interviewPassed
                      ? 'text-emerald-700'
                      : interviewFailed
                      ? 'text-rose-700'
                      : 'text-slate-400'
                  }`}
                >
                  {interviewPassed
                    ? `Passed (${interview.score ?? 0}%)`
                    : interviewFailed
                    ? `Failed (${interview.score ?? 0}%)`
                    : interviewStatus === 'IN_PROGRESS'
                    ? 'In Progress'
                    : !(aptPassed && techPassed)
                    ? 'Locked'
                    : 'Pending'}
                </span>
              </div>
            </div>

            {/* Action Triggers */}
            <div className="space-y-3 pt-1">
              {isCompleted ? (
                <Link to="/assessment/result" className="block">
                  <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 py-3 rounded-xl text-xs font-semibold">
                    <Award size={16} /> View Final Hiring Dossier
                  </Button>
                </Link>
              ) : isAnyRoundFailed ? (
                <Button
                  variant="danger"
                  onClick={handleReset}
                  loading={starting}
                  className="w-full py-3 rounded-xl text-xs font-semibold"
                >
                  <RotateCcw size={16} /> Reset & Start New Session
                </Button>
              ) : (
                <Button
                  onClick={handleStartOrContinue}
                  loading={starting}
                  className="w-full py-3 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-semibold shadow-sm"
                >
                  <Play size={15} fill="currentColor" />
                  {!assessment
                    ? 'Start Assessment Pipeline'
                    : aptStatus === 'IN_PROGRESS' ||
                      techStatus === 'IN_PROGRESS' ||
                      interviewStatus === 'IN_PROGRESS'
                    ? 'Resume Active Round'
                    : 'Continue Next Round'}
                </Button>
              )}

              {assessment && !isAnyRoundFailed && (
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={starting}
                  className="w-full text-center text-xs font-medium text-slate-400 hover:text-slate-600 transition py-1 flex items-center justify-center gap-1.5"
                >
                  <RotateCcw size={12} /> Reset & Restart Assessment
                </button>
              )}
            </div>
          </Card>

          {/* Assessment Protocol Notice */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 text-xs text-slate-600 shadow-sm space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-slate-900" /> Evaluation Protocol
            </h4>
            <ul className="space-y-1.5 text-slate-500 leading-relaxed text-[11px]">
              <li>• Rounds must be completed sequentially; passing scores are enforced.</li>
              <li>• Strict 25-minute timers per round with automatic submission.</li>
              <li>• Solutions and correct answers are hidden during the test.</li>
              <li>• Practice module results do not modify hiring records.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function StageCard({
  roundNumber,
  title,
  subtitle,
  icon,
  status,
  scoreDisplay,
  isPassed,
  isFailed,
  isLocked,
  lockReason,
  actionUrl,
  resultUrl,
}) {
  const isInProgress = status === 'IN_PROGRESS';

  return (
    <Card
      className={`p-6 transition-all border-2 ${
        isPassed
          ? 'border-emerald-200 bg-emerald-50/20'
          : isFailed
          ? 'border-rose-200 bg-rose-50/20'
          : isLocked
          ? 'border-slate-200 bg-slate-50/60 opacity-80'
          : isInProgress
          ? 'border-accent/40 bg-indigo-50/30 ring-1 ring-accent/20'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${
              isPassed
                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                : isFailed
                ? 'bg-rose-100 text-rose-700 border-rose-200'
                : isLocked
                ? 'bg-slate-100 text-slate-400 border-slate-200'
                : 'bg-indigo-50 text-accent border-indigo-100'
            }`}
          >
            {icon}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Round {roundNumber}
              </span>
              {scoreDisplay && (
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold ${
                    isPassed
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  Score: {scoreDisplay}
                </span>
              )}
            </div>

            <h3 className="mt-1 font-display text-base font-bold text-slate-900">{title}</h3>
            <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>

            {isLocked && lockReason && (
              <p className="mt-2 flex items-center gap-1 text-xs font-bold text-amber-700">
                <Lock size={12} /> {lockReason}
              </p>
            )}
          </div>
        </div>

        {/* Action / Status on Right */}
        <div className="shrink-0 self-end sm:self-center">
          {isPassed ? (
            <div className="flex items-center gap-2">
              <Badge variant="success">
                <CheckCircle2 size={13} /> Completed
              </Badge>
              {resultUrl && (
                <Link
                  to={resultUrl}
                  className="text-xs font-bold text-accent hover:underline ml-2"
                >
                  Results →
                </Link>
              )}
            </div>
          ) : isFailed ? (
            <div className="flex items-center gap-2">
              <Badge variant="danger">
                <XCircle size={13} /> Failed
              </Badge>
              {resultUrl && (
                <Link
                  to={resultUrl}
                  className="text-xs font-bold text-slate-600 hover:underline ml-2"
                >
                  Review →
                </Link>
              )}
            </div>
          ) : isLocked ? (
            <Badge variant="neutral">
              <Lock size={12} /> Locked
            </Badge>
          ) : isInProgress ? (
            <Link to={actionUrl}>
              <Button variant="primary" className="text-xs py-2">
                Resume Test <ArrowRight size={13} />
              </Button>
            </Link>
          ) : (
            <Link to={actionUrl}>
              <Button variant="primary" className="text-xs py-2">
                Start Round {roundNumber} <ArrowRight size={13} />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
