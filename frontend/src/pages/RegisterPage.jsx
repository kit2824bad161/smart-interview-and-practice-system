import { Check, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

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

  const passwordChecks = [
    { label: 'At least 6 characters', valid: form.password.length >= 6 },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(form.password) },
    { label: 'One number', valid: /[0-9]/.test(form.password) },
  ];

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.name.trim()) {
      return setError('Please enter your full name.');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !emailRegex.test(form.email.trim())) {
      return setError('Please enter a valid email address.');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }
    if (!/[A-Z]/.test(form.password)) {
      return setError('Password must contain at least one uppercase letter.');
    }
    if (!/[0-9]/.test(form.password)) {
      return setError('Password must contain at least one number.');
    }
    if (form.password !== form.confirm) {
      return setError('Passwords do not match. Please re-enter your password.');
    }

    setError('');
    setLoading(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        college: form.college.trim(),
        experience: form.experience,
      });
      nav('/dashboard');
    } catch (err) {
      const backendMsg = err?.response?.data?.message;
      if (backendMsg) {
        setError(backendMsg);
      } else if (err?.response?.status === 409) {
        setError('An account with this email already exists.');
      } else if (err?.code === 'ERR_NETWORK' || err?.message === 'Network Error') {
        setError('Cannot connect to backend server. Make sure the backend is running and VITE_API_URL is configured in your deployment settings.');
      } else if (err?.response?.status === 400) {
        setError('Invalid registration details. Please review the form and try again.');
      } else if (err?.response?.status >= 500) {
        setError('Database or server error. Please try again later.');
      } else {
        setError(err?.message || 'Unable to create your account right now.');
      }
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
              {passwordChecks.map((item) => (
                <p key={item.label} className="flex items-center gap-2 py-1">
                  <Check
                    size={14}
                    className={item.valid ? 'text-emerald-500' : 'text-slate-300'}
                  />
                  <span className={item.valid ? 'text-emerald-600 font-medium' : 'text-slate-500'}>
                    {item.label}
                  </span>
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

