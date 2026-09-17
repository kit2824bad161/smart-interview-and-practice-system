import {
  ArrowRight,
  BarChart3,
  Bot,
  Calendar,
  CheckCircle2,
  Code2,
  History,
  Lock,
  Mic,
  ShieldCheck,
  Sparkles,
  Terminal,
  TimerReset,
  Trophy,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/Badge';
import Card from '../components/Card';
import { DashboardSkeleton } from '../components/LoadingSkeleton';
import { useAuth } from '../context/AuthContext';
import {
  getCurrentAssessment,
  getDsaStats,
  getInterviewHistory,
} from '../services/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState([]);
  const [assessment, setAssessment] = useState(null);
  const [dsaStats, setDsaStats] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      getInterviewHistory().catch(() => []),
      getCurrentAssessment().catch(() => null),
      getDsaStats().catch(() => null),
    ])
      .then(([historyData, assessmentData, statsData]) => {
        if (!isMounted) return;
        setInterviews(Array.isArray(historyData) ? historyData : []);
        if (assessmentData?.assessment) {
          setAssessment(assessmentData.assessment);
        }
        if (statsData) {
          setDsaStats(statsData);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  }, []);

  const performance = useMemo(() => {
    const scores = interviews.map((item) => Number(item.overallScore) || 0);
    const average = scores.length
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
      : 0;
    return { average };
  }, [interviews]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  const candidateFirstName = user?.name ? user.name.split(' ')[0] : 'Candidate';

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Welcome Header (Reference Style: Clean, Large, Light) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {greeting}, {candidateFirstName}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Continue your preparation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/practice"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition"
          >
            Practice Center
          </Link>
          <Link
            to="/assessment"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition"
          >
            Hiring Assessment <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* 4 Clean Practice Cards (Exact Section 6 Prompt Spec) */}
      <div>
        <div className="mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Practice Modules
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Aptitude Card */}
          <Card className="p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 hover:shadow-md transition-all">
            <div className="space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                <TimerReset size={18} />
              </div>
              <h2 className="font-display text-base font-bold text-slate-900">
                Aptitude
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Practice quantitative and logical reasoning questions.
              </p>
            </div>
            <div>
              <Link
                to="/practice/aptitude"
                className="inline-flex items-center text-xs font-bold text-slate-900 hover:text-indigo-600 transition"
              >
                Continue →
              </Link>
            </div>
          </Card>

          {/* Problem Solving Card */}
          <Card className="p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 hover:shadow-md transition-all">
            <div className="space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                <Terminal size={18} />
              </div>
              <h2 className="font-display text-base font-bold text-slate-900">
                Problem Solving
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Practice coding and algorithmic challenges.
              </p>
            </div>
            <div>
              <Link
                to="/problem-solving"
                className="inline-flex items-center text-xs font-bold text-slate-900 hover:text-indigo-600 transition"
              >
                Continue →
              </Link>
            </div>
          </Card>

          {/* Technical MCQs Card */}
          <Card className="p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 hover:shadow-md transition-all">
            <div className="space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                <Code2 size={18} />
              </div>
              <h2 className="font-display text-base font-bold text-slate-900">
                Technical MCQs
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Strengthen core computer science fundamentals.
              </p>
            </div>
            <div>
              <Link
                to="/practice/technical"
                className="inline-flex items-center text-xs font-bold text-slate-900 hover:text-indigo-600 transition"
              >
                Continue →
              </Link>
            </div>
          </Card>

          {/* Communication Card */}
          <Card className="p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 hover:shadow-md transition-all">
            <div className="space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                <Mic size={18} />
              </div>
              <h2 className="font-display text-base font-bold text-slate-900">
                Communication
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Improve speaking and interview communication.
              </p>
            </div>
            <div>
              <Link
                to="/communication"
                className="inline-flex items-center text-xs font-bold text-slate-900 hover:text-indigo-600 transition"
              >
                Continue →
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* AI Hiring System Card (Clearly Separated Locked Evaluation) */}
      <Card className="p-6 md:p-7 border-slate-200/80 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Locked Evaluation
              </span>
              <span className="text-xs text-slate-400">• Official Assessment Pipeline</span>
            </div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900">
              AI Hiring Assessment
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Standardized 4-stage evaluation designed to assess your problem-solving, fundamentals, and spoken communication for technical roles.
            </p>

            {/* 4 Stages Pill Indicator */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[11px] font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                1. Aptitude (20 Qs)
              </span>
              <span className="text-[11px] font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                2. Technical MCQs (20 Qs)
              </span>
              <span className="text-[11px] font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                3. Problem Solving
              </span>
              <span className="text-[11px] font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                4. AI Interview
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition"
            >
              Enter Hiring System <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </Card>

      {/* Two Columns: Left Progress & Right Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* YOUR PROGRESS (Section 6 Prompt Spec) */}
        <div className="lg:col-span-6 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Your Progress
          </span>

          <Card className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                  Problems Solved
                </span>
                <span className="font-display text-2xl font-bold text-slate-900 mt-1 block">
                  {dsaStats?.totalSolved ?? 0}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                  Interviews Taken
                </span>
                <span className="font-display text-2xl font-bold text-slate-900 mt-1 block">
                  {interviews.length}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                  Average Score
                </span>
                <span className="font-display text-2xl font-bold text-slate-900 mt-1 block">
                  {performance.average ? `${performance.average}%` : '—'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                  Streak
                </span>
                <span className="font-display text-2xl font-bold text-slate-900 mt-1 block">
                  {dsaStats?.streak ? `${dsaStats.streak} days` : '1 day'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Updated automatically from your activity</span>
              <Link to="/assessment/result" className="font-semibold text-slate-900 hover:underline">
                View Performance →
              </Link>
            </div>
          </Card>
        </div>

        {/* RECENT ACTIVITY (Section 6 Prompt Spec) */}
        <div className="lg:col-span-6 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Recent Activity
          </span>

          <Card className="p-6">
            {interviews.length === 0 && (!dsaStats?.recentAttempts || dsaStats.recentAttempts.length === 0) ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No recent activity recorded yet. Start a practice module above!
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {interviews.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {item.jobRole || 'Technical Interview'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })} • {item.interviewType || 'Mock Session'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {item.overallScore ? (
                        <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {item.overallScore}%
                        </span>
                      ) : null}
                      <Link
                        to={`/interview/history`}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
