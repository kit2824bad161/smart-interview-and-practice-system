import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROUTE_NAMES = {
  '/dashboard': { title: 'Dashboard', breadcrumb: 'Overview' },
  '/practice': { title: 'Practice Center', breadcrumb: 'Practice / Overview' },
  '/assessment': { title: 'AI Hiring Assessment', breadcrumb: 'AI Hiring System' },
  '/assessment/aptitude': { title: 'Aptitude Assessment', breadcrumb: 'Hiring / Round 1 Aptitude' },
  '/assessment/technical': { title: 'Technical MCQ Assessment', breadcrumb: 'Hiring / Round 2 Technical' },
  '/assessment/problem-solving': { title: 'Problem Solving Assessment', breadcrumb: 'Hiring / Round 3 Problem Solving' },
  '/assessment/interview': { title: 'AI One-on-One Interview', breadcrumb: 'Hiring / Round 4 AI Interview' },
  '/assessment/result': { title: 'Final Evaluation Dossier', breadcrumb: 'Hiring / Evaluation' },
  '/problem-solving': { title: 'Problem Solving Practice', breadcrumb: 'Practice Center / Problem Solving' },
  '/practice/aptitude': { title: 'Aptitude Practice', breadcrumb: 'Practice Center / Aptitude' },
  '/aptitude': { title: 'Aptitude Practice Session', breadcrumb: 'Practice Center / Aptitude' },
  '/aptitude/result': { title: 'Aptitude Practice Review', breadcrumb: 'Practice Center / Aptitude' },
  '/practice/technical': { title: 'Technical MCQ Practice', breadcrumb: 'Practice Center / Technical' },
  '/practice/technical/session': { title: 'Technical Practice Session', breadcrumb: 'Practice Center / Technical' },
  '/practice/technical/result': { title: 'Technical Practice Review', breadcrumb: 'Practice Center / Technical' },
  '/communication': { title: 'AI Voice Conversation Practice', breadcrumb: 'Practice Center / Communication' },
  '/communication/challenge/setup': { title: 'Extempore Practice', breadcrumb: 'Practice Center / Communication' },
  '/interview/setup': { title: 'AI Mock Interview', breadcrumb: 'Interview' },
  '/interview/history': { title: 'Interview History', breadcrumb: 'Interview' },
  '/performance': { title: 'Performance Insights', breadcrumb: 'Insights / Performance' },
  '/profile': { title: 'Candidate Profile', breadcrumb: 'Account' },
};

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  const routeMeta = ROUTE_NAMES[location.pathname] || {
    title: 'SmartInterview AI',
    breadcrumb: 'Portal',
  };

  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const todayStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/70 bg-white/90 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
      {/* Left Area: Mobile Menu Toggle + Breadcrumbs / Title */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={onMenuClick}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 lg:hidden"
        >
          <Menu size={16} />
        </button>

        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
            <span>{todayStr}</span>
            <span>•</span>
            <span className="text-slate-500 font-medium">{routeMeta.breadcrumb}</span>
          </div>
          <h1 className="font-display text-sm sm:text-base font-bold text-slate-900 leading-tight">
            {routeMeta.title}
          </h1>
        </div>
      </div>

      {/* Right Area: Search + Notifications + User Avatar Menu (Reference Style) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Status indicator badge */}
        <div className="hidden md:flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Active Session</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/80 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
            title="Notifications"
          >
            <Bell size={15} />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-indigo-600" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 px-1">
                <span className="text-xs font-bold text-slate-800">Notifications</span>
                <span className="text-[10px] font-bold text-indigo-600">1 New</span>
              </div>
              <div className="mt-2 space-y-2">
                <div className="rounded-xl bg-slate-50 p-2.5 text-xs">
                  <p className="font-bold text-slate-800 flex items-center gap-1">
                    <Sparkles size={12} className="text-indigo-600" /> Assessment Ready
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Your 4-stage AI hiring evaluation is available to attend.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white p-1 pr-2 transition hover:border-slate-300 hover:bg-slate-50/50"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white font-display text-xs font-bold shadow-xs">
              {user?.name?.[0]?.toUpperCase() || 'C'}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold text-slate-800 leading-tight">
                {user?.name || 'Candidate'}
              </p>
            </div>
            <ChevronDown size={13} className="text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg z-50">
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Candidate'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email || 'candidate@domain.com'}</p>
              </div>

              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
                >
                  <User size={14} /> Profile & Skills
                </Link>
                <Link
                  to="/assessment"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
                >
                  <ShieldCheck size={14} /> Hiring Assessment
                </Link>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
                >
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
