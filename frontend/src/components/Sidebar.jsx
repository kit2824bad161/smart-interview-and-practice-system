import {
  BarChart3,
  Bot,
  BrainCircuit,
  ChevronRight,
  Code2,
  Compass,
  FileCode,
  History,
  LayoutDashboard,
  LogOut,
  Mic,
  Settings,
  ShieldCheck,
  Sparkles,
  Terminal,
  TimerReset,
  User,
  Volume2,
  X,
} from 'lucide-react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_GROUPS = [
  {
    label: 'OVERVIEW',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'PRACTICE CENTER',
    items: [
      { to: '/practice', label: 'Practice Hub', icon: Compass },
      { to: '/practice/aptitude', label: 'Aptitude', icon: TimerReset },
      { to: '/problem-solving', label: 'Problem Solving', icon: Terminal, badge: 'DSA' },
      { to: '/practice/technical', label: 'Technical MCQs', icon: Code2 },
      {
        to: '/communication',
        label: 'Communication',
        icon: Mic,
        children: [
          { to: '/communication/challenge/setup', label: 'Extempore', icon: Volume2 },
          { to: '/communication', label: 'AI Voice Practice', icon: Bot },
        ],
      },
    ],
  },
  {
    label: 'AI HIRING',
    items: [
      { to: '/assessment', label: 'Hiring Assessment', icon: Sparkles, badge: '4-Stage' },
    ],
  },
  {
    label: 'INTERVIEW',
    items: [
      { to: '/interview/history', label: 'Interview History', icon: History },
    ],
  },
  {
    label: 'INSIGHTS',
    items: [
      { to: '/assessment/result', label: 'Performance', icon: BarChart3 },
    ],
  },
  {
    label: 'ACCOUNT',
    items: [
      { to: '/profile', label: 'Profile', icon: User },
    ],
  },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      {/* Clean Minimalist White Sidebar Container (Inspired by Reference UI) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200/80 bg-white text-slate-700 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          open ? 'translate-x-0 shadow-xl' : '-translate-x-full'
        }`}
      >
        {/* Header Branding */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <Link to="/dashboard" onClick={onClose} className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs transition group-hover:scale-105">
              <BrainCircuit size={17} />
            </div>
            <div>
              <span className="font-display text-sm font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                SmartInterview <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">AI</span>
              </span>
              <span className="block text-[9px] font-medium text-slate-400 tracking-wider uppercase">
                Candidate Portal
              </span>
            </div>
          </Link>

          {/* Close trigger for mobile */}
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition lg:hidden"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5">
          {NAV_GROUPS.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              <span className="px-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {group.label}
              </span>

              <div className="space-y-0.5 pt-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const itemPath = item.to.split('?')[0];
                  const itemQuery = item.to.split('?')[1];
                  const isActive =
                    itemQuery
                      ? location.pathname === itemPath && location.search.includes(itemQuery)
                      : location.pathname === itemPath ||
                        (itemPath !== '/dashboard' &&
                          itemPath !== '/practice' &&
                          location.pathname.startsWith(itemPath) &&
                          !location.search);

                  if (item.children) {
                    const isParentActive = location.pathname.startsWith('/communication');

                    return (
                      <div key={item.to} className="space-y-0.5">
                        <NavLink
                          to={item.to}
                          onClick={onClose}
                          className={`group flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-semibold transition-all ${
                            location.pathname === item.to
                              ? 'bg-slate-100 text-slate-900 font-bold'
                              : isParentActive
                              ? 'text-indigo-600 bg-indigo-50/60 font-semibold'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon
                              size={16}
                              className={`shrink-0 ${
                                isParentActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                              }`}
                            />
                            <span className="truncate">{item.label}</span>
                          </div>
                        </NavLink>

                        {/* Indented Sub-Activities */}
                        <div className="ml-4 pl-2.5 border-l border-slate-200/80 space-y-0.5 py-0.5">
                          {item.children.map((child) => {
                            const ChildIcon = child.icon;
                            const isChildActive = location.pathname === child.to;
                            return (
                              <NavLink
                                key={child.to}
                                to={child.to}
                                onClick={onClose}
                                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] font-medium transition-all ${
                                  isChildActive
                                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                              >
                                <ChildIcon size={13} className={isChildActive ? 'text-indigo-600' : 'text-slate-400'} />
                                <span className="truncate">{child.label}</span>
                              </NavLink>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={onClose}
                      className={`group flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-slate-100 text-slate-900 font-bold shadow-xs'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          size={16}
                          className={`shrink-0 transition ${
                            isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wide ${
                            isActive
                              ? 'bg-slate-200 text-slate-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Clean Light Candidate Footer Card (Reference UI Style) */}
        <div className="border-t border-slate-100 p-3">
          <div className="flex items-center justify-between rounded-xl bg-slate-50/80 p-2.5 border border-slate-200/60">
            <Link to="/profile" className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-80 transition">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold uppercase">
                {user?.name?.[0] || 'C'}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-900">
                  {user?.name || 'Candidate'}
                </p>
                <p className="truncate text-[10px] text-slate-400">
                  Verified Candidate
                </p>
              </div>
            </Link>

            <button
              onClick={logout}
              title="Sign Out"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
