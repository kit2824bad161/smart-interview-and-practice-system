import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Check,
  Clock3,
  Layers3,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';
import { ROLE_OPTIONS } from '../data/mockQuestions';
import { startInterview } from '../services/api';

const OPTIONS = {
  experience: ['Beginner', 'Intermediate', 'Advanced'],
  type: ['Technical', 'Behavioral', 'Mixed'],
  difficulty: ['Easy', 'Medium', 'Hard', 'Adaptive'],
  count: [5, 10, 15, 20],
};

function Choice({ value, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3.5 py-2.5 text-left text-xs font-bold transition flex items-center justify-between ${
        active
          ? 'border-accent bg-indigo-50 text-accent ring-1 ring-accent/20'
          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
      }`}
    >
      <span>{value}</span>
      {active && <Check size={14} className="text-accent" />}
    </button>
  );
}

export default function InterviewSetupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    role: 'Software Developer',
    experience: 'Intermediate',
    type: 'Technical',
    difficulty: 'Adaptive',
    count: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key, value) => setForm({ ...form, [key]: value });

  const start = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await startInterview({
        jobRole: form.role,
        experience: form.experience,
        difficulty: form.difficulty,
        interviewType: form.type,
        numberOfQuestions: form.count,
      });
      localStorage.setItem('smart_interview_config', JSON.stringify(form));
      localStorage.setItem('smart_interview_session', JSON.stringify(result));
      navigate('/interview');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to start the interview session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <Badge variant="accent" dot>AI Mock Interview Studio</Badge>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Configure Your Practice Interview
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Customize your role focus, difficulty level, and question count for tailored AI evaluation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Options (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Role Focus */}
          <Card className="p-6 md:p-7 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-accent font-bold text-xs">
                1
              </div>
              <h2 className="font-display text-base font-bold text-slate-900">
                Target Engineering Role
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ROLE_OPTIONS.map((r) => (
                <Choice
                  key={r}
                  value={r}
                  active={form.role === r}
                  onClick={() => set('role', r)}
                />
              ))}
            </div>
          </Card>

          {/* Step 2: Experience & Type */}
          <Card className="p-6 md:p-7 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-accent font-bold text-xs">
                2
              </div>
              <h2 className="font-display text-base font-bold text-slate-900">
                Format & Experience Tier
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Experience Tier
                </label>
                <select
                  className="input text-xs"
                  value={form.experience}
                  onChange={(e) => set('experience', e.target.value)}
                >
                  {OPTIONS.experience.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Interview Format
                </label>
                <select
                  className="input text-xs"
                  value={form.type}
                  onChange={(e) => set('type', e.target.value)}
                >
                  {OPTIONS.type.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Step 3: Difficulty & Length */}
          <Card className="p-6 md:p-7 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-accent font-bold text-xs">
                3
              </div>
              <h2 className="font-display text-base font-bold text-slate-900">
                Challenge Level & Session Length
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Difficulty
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {OPTIONS.difficulty.map((d) => (
                    <Choice
                      key={d}
                      value={d}
                      active={form.difficulty === d}
                      onClick={() => set('difficulty', d)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Question Count
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {OPTIONS.count.map((c) => (
                    <Choice
                      key={c}
                      value={`${c} Questions`}
                      active={form.count === c}
                      onClick={() => set('count', c)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Session Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 bg-navy-950 text-white border-navy-800 shadow-xl space-y-6 lg:sticky lg:top-24">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-mint">
                Session Blueprint
              </span>
              <h3 className="mt-2 font-display text-xl font-bold text-white">
                Ready to Initialize
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Your AI interviewer will formulate tailored questions based on these parameters.
              </p>
            </div>

            <div className="space-y-3 border-y border-slate-800 py-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Target Role</span>
                <strong className="text-slate-100">{form.role}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Experience</span>
                <strong className="text-slate-100">{form.experience}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Format</span>
                <strong className="text-slate-100">{form.type}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Difficulty</span>
                <strong className="text-slate-100">{form.difficulty}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Length</span>
                <strong className="text-slate-100">{form.count} Questions</strong>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock3 size={15} className="text-mint shrink-0" />
              <span>Estimated duration: ~{Math.round(form.count * 2.5)} minutes</span>
            </div>

            {error && (
              <div className="rounded-xl bg-rose-900/40 border border-rose-700/60 p-3 text-xs text-rose-300 font-bold">
                {error}
              </div>
            )}

            <Button
              variant="primary"
              onClick={start}
              loading={loading}
              className="w-full py-3 bg-white text-navy-950 hover:bg-slate-100 shadow-md font-bold"
            >
              <Bot size={16} /> {loading ? 'Initializing Session...' : 'Start AI Interview'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
