import { Check, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
const requirements=['At least 6 characters','One uppercase letter','One number'];
import { Check, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const requirements = ['At least 6 characters', 'One uppercase letter', 'One number'];

export default function RegisterPage() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    college: '',
    experience: 'Beginner',
  });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || form.password.length < 6 || form.password !== form.confirm) {
      return setError('Complete the required fields and make sure both passwords match.');
    }
    setError('');
    setLoading(true);
    try {
      await register(form);
      nav('/dashboard');
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (err?.message === 'Network Error'
          ? 'Cannot connect to backend server. Make sure VITE_API_URL is configured in your deployment settings.'
          : err?.message || 'Unable to create your account right now.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas px-5 py-8">
      <div className="mx-auto max-w-2xl">
        <Link to="/" className="font-display text-xl font-bold">
          SmartInterview <span className="text-accent">AI</span>
        </Link>
        <div className="mt-10 grid gap-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft md:p-10">
          <div>
            <p className="eyebrow">Start your progress</p>
            <h1 className="mt-3 font-display text-3xl font-bold">Create your candidate profile</h1>
            <p className="mt-2 text-sm text-slate-500">
              A few details help us shape a more relevant practice room.
            </p>
          </div>
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}
          <form onSubmit={submit} className="grid gap-5 md:grid-cols-2">
            <label className="md:col-span-2">
              <span className="mb-2 block text-sm font-bold">Full name *</span>
              <input
                className="input"
                placeholder="Alex Morgan"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold">Email *</span>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold">College / university</span>
              <input
                className="input"
                placeholder="Optional"
                value={form.college}
                onChange={(e) => setForm({ ...form, college: e.target.value })}
              />
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold">Password *</span>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  className="input pr-11"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute right-4 top-3.5 text-slate-400"
                  onClick={() => setShow(!show)}
                >
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold">Confirm password *</span>
              <input
                type="password"
                className="input"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              />
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold">Experience level</span>
              <select
                className="input"
                value={form.experience}
                onChange={(e) => setForm({ ...form, experience: e.target.value })}
              >
                {['Beginner', 'Intermediate', 'Advanced'].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <div className="rounded-xl bg-slate-50 p-4 text-xs font-semibold text-slate-500">
              <p className="mb-2 text-slate-700">Password checklist</p>
              {requirements.map((x) => (
                <p key={x} className="flex items-center gap-2 py-1">
                  <Check
                    size={14}
                    className={form.password.length >= 6 ? 'text-emerald-500' : 'text-slate-300'}
                  />
                  {x}
                </p>
              ))}
            </div>
            <div className="md:col-span-2">
              <Button type="submit" loading={loading} className="w-full">
                Create account
              </Button>
              <p className="mt-5 text-center text-sm text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-accent">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

