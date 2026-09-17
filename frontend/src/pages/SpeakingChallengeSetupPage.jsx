import {
  ArrowRight,
  Clock,
  Mic,
  Radio,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';
import { startSpeakingChallenge } from '../services/api';

const roles = [
  'Software Developer',
  'Frontend Developer',
  'Backend Developer',
  'Data Analyst',
  'Data Scientist',
  'AI/ML Engineer',
];

export default function SpeakingChallengeSetupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    jobRole: roles[0],
    experience: 'Fresher',
    difficulty: 'Medium',
    durationLimit: 120,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const start = async () => {
    setLoading(true);
    setError('');
    try {
      const challenge = await startSpeakingChallenge(form);
      localStorage.setItem('smart_speaking_challenge', JSON.stringify(challenge));
      navigate('/communication/challenge');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to generate a speaking topic.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Top Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="accent">
            <Radio size={13} className="mr-1 inline" /> Spontaneous Speech
          </Badge>
          <span className="text-xs font-semibold text-slate-400">Extempore Fluency</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-navy-900 md:text-4xl">
          2–3 Minute Continuous Speaking Challenge
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-500 md:text-base">
          Test your spontaneous communication abilities. The AI generates a role-relevant prompt. You get
          a 10-second preparation countdown, then articulate your thoughts uninterrupted until the timer elapses.
        </p>
      </div>

      {/* Main Setup Card */}
      <Card className="max-w-2xl space-y-6 p-6 md:p-8">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Target Job Role
          </label>
          <select
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-navy-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            value={form.jobRole}
            onChange={(e) => setForm({ ...form, jobRole: e.target.value })}
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Continuous Speaking Duration
          </label>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {[
              { seconds: 120, label: '2 Minutes', desc: 'Standard extempore pace' },
              { seconds: 180, label: '3 Minutes', desc: 'Extended depth drill' },
            ].map((dur) => {
              const isSelected = form.durationLimit === dur.seconds;
              return (
                <button
                  key={dur.seconds}
                  type="button"
                  onClick={() => setForm({ ...form, durationLimit: dur.seconds })}
                  className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50/70 text-navy-900 ring-2 ring-brand-100'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold text-navy-900">{dur.label}</span>
                  <span className="mt-1 text-[11px] text-slate-400">{dur.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-xs leading-relaxed text-slate-600">
          <Clock size={17} className="mt-0.5 shrink-0 text-brand-600" />
          <span>
            The voice recording will terminate automatically when the chosen time limit is reached. Keep speaking continuously without long pauses to maximize your fluency index.
          </span>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        <Button
          className="w-full justify-center bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20"
          onClick={start}
          loading={loading}
        >
          <ArrowRight size={16} /> {loading ? 'Generating Topic Prompt...' : 'Generate Speaking Topic'}
        </Button>
      </Card>
    </div>
  );
}
