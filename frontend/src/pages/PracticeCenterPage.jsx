import {
  ArrowRight,
  Code2,
  Compass,
  Mic,
  Sparkles,
  Terminal,
  TimerReset,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '../components/Badge';
import Card from '../components/Card';

const PRACTICE_MODULES = [
  {
    id: 'aptitude',
    title: 'Aptitude',
    description: 'Practice quantitative and logical reasoning questions.',
    actionLabel: 'Start Practice',
    to: '/practice/aptitude',
    icon: TimerReset,
    tag: 'Math & Logic',
  },
  {
    id: 'problem-solving',
    title: 'Problem Solving',
    description: 'Practice coding and algorithmic problems across essential data structures.',
    actionLabel: 'Start Practice',
    to: '/problem-solving',
    icon: Terminal,
    tag: 'DSA & Coding',
  },
  {
    id: 'technical-mcqs',
    title: 'Technical MCQs',
    description: 'Practice programming and computer science fundamentals.',
    actionLabel: 'Start Practice',
    to: '/practice/technical',
    icon: Code2,
    tag: 'CS Fundamentals',
  },
  {
    id: 'communication',
    title: 'Communication',
    description: 'Improve speaking and interview communication with AI voice practice.',
    actionLabel: 'Practice',
    to: '/communication',
    icon: Mic,
    tag: 'Speech & Voice',
  },
];

export default function PracticeCenterPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Self-Paced Learning
          </span>
          <span className="rounded-full bg-slate-100 text-slate-600 px-2 py-0.5 text-[10px] font-semibold">
            Unrestricted
          </span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Practice Center
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-xl">
          Strengthen your skills with free, flexible practice. Customize questions, configure timers, and review detailed explanations.
        </p>
      </div>

      {/* 4 Clean Practice Cards (Exact Reference Design Spec) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {PRACTICE_MODULES.map((module) => {
          const Icon = module.icon;

          return (
            <Card
              key={module.id}
              className="p-6 md:p-7 flex flex-col justify-between space-y-6 hover:border-slate-300 hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                    <Icon size={20} />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                    {module.tag}
                  </span>
                </div>

                <div>
                  <h2 className="font-display text-lg font-bold text-slate-900">
                    {module.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                    {module.description}
                  </p>
                </div>
              </div>

              <div>
                <Link
                  to={module.to}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                >
                  {module.actionLabel} <ArrowRight size={14} />
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
