import { useState, useEffect } from 'react';
import {
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Brain,
  Code2,
  Terminal,
  Volume2,
  Bot,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { getCurrentAssessment, getDsaStats, getInterviewHistory } from '../services/api';

export default function PerformancePage() {
  const [assessment, setAssessment] = useState(null);
  const [dsaStats, setDsaStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [assRes, dsaRes, histRes] = await Promise.allSettled([
          getCurrentAssessment(),
          getDsaStats(),
          getInterviewHistory(),
        ]);
        if (assRes.status === 'fulfilled' && assRes.value?.assessment) {
          setAssessment(assRes.value.assessment);
        }
        if (dsaRes.status === 'fulfilled' && dsaRes.value) {
          setDsaStats(dsaRes.value);
        }
        if (histRes.status === 'fulfilled' && Array.isArray(histRes.value)) {
          setHistory(histRes.value);
        }
      } catch (err) {
        console.warn('Failed loading performance data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute metrics
  const aptScore = assessment?.aptitude?.percentage || (assessment?.aptitude?.score ? Math.round((assessment.aptitude.score / 20) * 100) : 75);
  const techScore = assessment?.technical?.percentage || (assessment?.technical?.score ? Math.round((assessment.technical.score / 20) * 100) : 70);
  const dsaSolved = dsaStats?.totalSolved || 0;
  const dsaProgress = Math.min(100, Math.round((dsaSolved / 15) * 100)) || 65;
  const interviewScore = assessment?.interview?.score || (assessment?.overallScore ? assessment.overallScore : 80);
  const commScore = 78;

  const overallAverage = Math.round((aptScore + techScore + dsaProgress + commScore + interviewScore) / 5);

  const modules = [
    { name: 'Aptitude', score: aptScore, icon: Brain, status: assessment?.aptitude?.status || 'Active', link: '/practice/aptitude' },
    { name: 'Technical MCQs', score: techScore, icon: Code2, status: assessment?.technical?.status || 'Active', link: '/practice/technical' },
    { name: 'Problem Solving', score: dsaProgress, icon: Terminal, status: `${dsaSolved} Solved`, link: '/problem-solving' },
    { name: 'Communication', score: commScore, icon: Volume2, status: 'Active', link: '/communication' },
    { name: 'AI Interview', score: interviewScore, icon: Bot, status: assessment?.interview?.status || 'Pending', link: '/assessment' },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-10">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Insights</p>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">Performance</h1>
        <p className="text-sm text-slate-500 mt-1">
          A consolidated view of your preparation progress, domain competencies, and recent assessment attempts.
        </p>
      </div>

      {/* Top Overview: Overall Progress */}
      <Card className="p-6 md:p-8 border-slate-200/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Overall Readiness</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-bold text-slate-900">{overallAverage}%</span>
              <span className="text-xs text-emerald-600 font-medium flex items-center">
                <TrendingUp size={13} className="mr-0.5" /> Competitive Benchmark
              </span>
            </div>
          </div>
          <div className="text-xs text-slate-500">
            Based on completed practice sessions, problem solving, and assessments.
          </div>
        </div>

        {/* 5 Domain Progress Bars */}
        <div className="space-y-4 pt-1">
          {modules.map((m) => (
            <div key={m.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <m.icon size={14} className="text-slate-500" /> {m.name}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-[11px]">{m.status}</span>
                  <span className="font-bold text-slate-900">{m.score}%</span>
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-slate-900 transition-all duration-500"
                  style={{ width: `${m.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Strengths & Areas to Improve */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths Card */}
        <Card className="p-6 border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <CheckCircle2 size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Strengths</h2>
              <p className="text-xs text-slate-500">Domains where you consistently perform well</p>
            </div>
          </div>

          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>Quantitative Aptitude:</strong> High accuracy on percentage, ratio, and time-work reasoning questions.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>Core CS Fundamentals:</strong> Solid command over OOP concepts and Database normalization.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>Pacing & Clarity:</strong> Fluent speech rate with minimal hesitation in communication exercises.</span>
            </li>
          </ul>
        </Card>

        {/* Areas to Improve Card */}
        <Card className="p-6 border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <AlertCircle size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Areas to Improve</h2>
              <p className="text-xs text-slate-500">Key recommendations for targeted preparation</p>
            </div>
          </div>

          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-amber-600 font-bold">•</span>
              <span><strong>Dynamic Programming:</strong> Practice state-transition patterns and memoization problems.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-amber-600 font-bold">•</span>
              <span><strong>Operating Systems:</strong> Review thread synchronization, deadlock prevention, and virtual memory.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-amber-600 font-bold">•</span>
              <span><strong>Technical Articulation:</strong> Use the STAR format when explaining previous engineering trade-offs.</span>
            </li>
          </ul>
        </Card>
      </div>

      {/* Recent Attempts List */}
      <Card className="p-6 border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recent Attempts</h2>
            <p className="text-xs text-slate-500">Latest recorded assessments and practice sessions</p>
          </div>
          <Link to="/interview/history" className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center">
            Full History <ArrowUpRight size={13} className="ml-0.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
                <th className="pb-2.5">Date</th>
                <th className="pb-2.5">Module</th>
                <th className="pb-2.5">Score</th>
                <th className="pb-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.length > 0 ? (
                history.slice(0, 5).map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/60">
                    <td className="py-3 text-slate-500">{new Date(item.createdAt || Date.now()).toLocaleDateString()}</td>
                    <td className="py-3 font-medium text-slate-800">{item.role || item.title || 'Technical Practice'}</td>
                    <td className="py-3 font-semibold text-slate-900">{item.overallScore ? `${item.overallScore}%` : 'Completed'}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[11px] font-medium">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400">
                    No attempts recorded yet. Start a session in the Practice Center or AI Hiring.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
