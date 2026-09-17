import {
  ArrowRight,
  BrainCircuit,
  Check,
  Code2,
  Cpu,
  Database,
  Layers3,
  Network,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import { startTechnicalPractice } from '../services/api';

const TOPICS = [
  { id: 'Programming Fundamentals', label: 'Programming', icon: Terminal, desc: 'Syntax, data types, control flow & logic' },
  { id: 'Data Structures & Algorithms', label: 'DSA', icon: BrainCircuit, desc: 'Arrays, trees, graphs, sorting & search' },
  { id: 'Object-Oriented Programming', label: 'OOP', icon: Layers3, desc: 'Classes, inheritance, polymorphism, encapsulation' },
  { id: 'DBMS & SQL', label: 'DBMS', icon: Database, desc: 'Relational models, normalization, queries & ACID' },
  { id: 'Operating Systems', label: 'Operating Systems', icon: Cpu, desc: 'Processes, threads, memory, paging & scheduling' },
  { id: 'Computer Networks', label: 'Networking', icon: Network, desc: 'OSI layers, TCP/IP, DNS, HTTP & sockets' },
  { id: 'All Topics', label: 'All Topics', icon: Sparkles, desc: 'Comprehensive mix across all engineering domains' },
];

const DIFFICULTIES = [
  { id: 'Easy', label: 'Easy' },
  { id: 'Medium', label: 'Medium' },
  { id: 'Hard', label: 'Hard' },
];

const COUNTS = [10, 20];

export default function TechnicalPracticeSetupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    topic: TOPICS[0].id,
    difficulty: 'Medium',
    numberOfQuestions: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const start = async () => {
    setLoading(true);
    setError('');
    try {
      const session = await startTechnicalPractice(form);
      localStorage.setItem('smart_technical_session', JSON.stringify(session));
      localStorage.removeItem('smart_technical_session_answers');
      localStorage.removeItem('smart_technical_result');
      navigate('/practice/technical/session');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to generate questions right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const estimatedMinutes = Math.round(form.numberOfQuestions * 1.5);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Practice Center</p>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">Technical MCQ Practice</h1>
        <p className="text-sm text-slate-500 mt-1">
          Strengthen programming and computer science fundamentals with instant feedback and explanations.
        </p>
      </div>

      {/* Main Setup Card */}
      <Card className="p-6 md:p-8 space-y-8 border-slate-200/80">
        {/* Step 1: Choose Topic */}
        <div>
          <div className="mb-3">
            <h2 className="text-sm font-bold text-slate-900">1. Choose Topic</h2>
            <p className="text-xs text-slate-500">Select a computer science pillar to practice.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {TOPICS.map((item) => {
              const Icon = item.icon;
              const isSelected = form.topic === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, topic: item.id }))}
                  className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
                    isSelected
                      ? 'border-slate-900 bg-slate-50 shadow-xs ring-1 ring-slate-900'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon size={16} />
                    </div>
                    {isSelected && <Check size={16} className="text-slate-900" />}
                  </div>
                  <span className="text-sm font-bold text-slate-900">{item.label}</span>
                  <span className="text-xs text-slate-500 mt-1 line-clamp-2">{item.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Controls */}
        <div className="border-t border-slate-100 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Question Count */}
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-2">Number of Questions</label>
            <div className="flex gap-2">
              {COUNTS.map((count) => {
                const isSelected = form.numberOfQuestions === count;
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, numberOfQuestions: count }))}
                    className={`flex-1 rounded-xl border py-2.5 px-4 text-xs font-semibold transition ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {count} Questions
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-2">Difficulty</label>
            <div className="flex gap-2">
              {DIFFICULTIES.map((diff) => {
                const isSelected = form.difficulty === diff.id;
                return (
                  <button
                    key={diff.id}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, difficulty: diff.id }))}
                    className={`flex-1 rounded-xl border py-2.5 px-4 text-xs font-semibold transition ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {diff.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer & Trigger */}
        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            Selected: <b className="text-slate-800">{form.topic}</b> &nbsp;•&nbsp;{' '}
            <b className="text-slate-800">{form.numberOfQuestions} Qs</b> &nbsp;•&nbsp;{' '}
            <b className="text-slate-800">{form.difficulty}</b> &nbsp;(~{estimatedMinutes} mins)
          </div>

          <Button
            onClick={start}
            loading={loading}
            className="w-full sm:w-auto px-7 py-2.5 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded-xl"
          >
            Start Practice <ArrowRight size={14} className="ml-1.5" />
          </Button>
        </div>

        {error && (
          <div className="rounded-xl bg-rose-50 p-3 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}
      </Card>
    </div>
  );
}