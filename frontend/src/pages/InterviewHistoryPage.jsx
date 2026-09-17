import {
  CalendarDays,
  ChevronRight,
  Filter,
  History,
  Search,
  SlidersHorizontal,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/Badge';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import { Skeleton } from '../components/LoadingSkeleton';
import { ROLE_OPTIONS } from '../data/mockQuestions';
import { getInterviewHistory } from '../services/api';

export default function InterviewHistoryPage() {
  const [interviews, setInterviews] = useState([]);
  const [role, setRole] = useState('All roles');
  const [score, setScore] = useState('Any score');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    getInterviewHistory()
      .then((data) => {
        if (active) setInterviews(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setError('Unable to load interview history.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return interviews.filter((item) => {
      const matchesRole = role === 'All roles' || item.jobRole === role;
      const matchesScore =
        score === 'Any score' ||
        (score === '80+' ? item.overallScore >= 80 : item.overallScore < 80);
      const matchesQuery =
        !query.trim() ||
        item.jobRole?.toLowerCase().includes(query.toLowerCase()) ||
        item.interviewType?.toLowerCase().includes(query.toLowerCase());
      return matchesRole && matchesScore && matchesQuery;
    });
  }, [interviews, role, score, query]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="accent" dot>Practice Archive</Badge>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Interview History & Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review your past mock sessions, AI evaluations, voice metrics, and score trajectory.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs">
          <SlidersHorizontal size={14} className="text-accent" />
          <span>{filtered.length} {filtered.length === 1 ? 'Record' : 'Records'}</span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              className="input pl-9 text-xs"
              placeholder="Search by role or type..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div>
            <select
              className="input text-xs"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option>All roles</option>
              {ROLE_OPTIONS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              className="input text-xs"
              value={score}
              onChange={(e) => setScore(e.target.value)}
            >
              <option>Any score</option>
              <option>80+ (High Performance)</option>
              <option>Below 80</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              setRole('All roles');
              setScore('Any score');
              setQuery('');
            }}
            className="btn-secondary text-xs"
          >
            <Filter size={14} /> Reset Filters
          </button>
        </div>
      </Card>

      {/* History Table / Records View */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-xs font-bold text-rose-700">
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={History}
          title="No interview records found"
          description={
            interviews.length === 0
              ? 'Complete your first AI mock interview to generate your historical records.'
              : 'No records match your selected filter criteria. Try resetting filters.'
          }
          actionLabel={interviews.length === 0 ? 'Start AI Mock Interview' : undefined}
          onAction={interviews.length === 0 ? () => window.location.assign('/interview/setup') : undefined}
        />
      ) : (
        <Card className="overflow-hidden p-0 border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-3.5">Engineering Role</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Interview Type</th>
                  <th className="px-6 py-3.5">Overall Score</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{item.jobRole}</p>
                      <p className="text-[11px] text-slate-400">
                        {item.difficulty || 'Medium'} difficulty
                      </p>
                    </td>

                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={14} className="text-slate-400" />
                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {item.interviewType || 'Comprehensive'}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`font-display text-base font-bold ${
                          Number(item.overallScore) >= 80
                            ? 'text-emerald-600'
                            : 'text-amber-600'
                        }`}
                      >
                        {item.overallScore}%
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <Badge variant="success">Completed</Badge>
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Link
                        to={`/interview/result?id=${item._id}`}
                        onClick={() => localStorage.setItem('smart_interview_id', item._id)}
                        className="inline-flex items-center gap-1 font-bold text-accent hover:text-indigo-700 transition"
                      >
                        <span>View Dossier</span>
                        <ChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
