import { ArrowRight, BrainCircuit, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { GoogleIcon, GitHubIcon } from '../components/Icons';

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const errParam = searchParams.get('error');
    if (errParam) {
      setError(decodeURIComponent(errParam));
    }
  }, [searchParams]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || form.password.length < 6) {
      return setError('Enter a valid email and a password with at least 6 characters.');
    }
    setError('');
    setLoading(true);
    try {
      await login(form);
      nav('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to sign in right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setError('');
    const backendBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.location.href = `${backendBase}/auth/google`;
  };

  const handleGithubLogin = () => {
    setError('');
    const backendBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.location.href = `${backendBase}/auth/github`;
  };

  return (
    <div
      className="relative min-h-screen md:h-screen w-full bg-cover bg-center bg-no-repeat text-slate-100 flex flex-col items-center justify-center p-3 sm:p-4 overflow-x-hidden md:overflow-hidden"
      style={{ backgroundImage: "url('/images/login-office-background.jpg')" }}
    >
      {/* Subtle background overlay to keep conference room visible while keeping login form sharp */}
      <div className="pointer-events-none absolute inset-0 bg-[#050a14]/35" />

      {/* ============================================================ */}
      {/* UNIFIED CENTERED CONTAINER: ANCHORED TO THE LOGIN CARD       */}
      {/* ============================================================ */}
      <div className="relative z-10 w-full max-w-[440px] mx-auto flex flex-col items-center">
        {/* Top Branding Header */}
        <div className="w-full mb-3 text-center drop-shadow-md">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink/90 border border-white/20 text-white shadow-md transition group-hover:scale-105 backdrop-blur-md">
              <BrainCircuit size={20} className="text-mint" />
            </span>
            <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              SmartInterview <span className="text-mint">AI</span>
            </span>
          </Link>
          <p className="mt-1 text-[11px] font-bold tracking-wider text-slate-200 uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            AI-Powered Candidate Assessment Platform
          </p>
        </div>

        {/* Card Wrapper (Positioning context for desktop mascot) */}
        <div className="relative w-full">
          {/* ONE TRANSPARENT GLASS LOGIN CARD WITH PROMINENT DARK BORDER */}
          <div
            className="w-full rounded-[22px] p-5 sm:p-6 text-white"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '2px solid rgba(15, 23, 42, 0.85)',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.18)',
            }}
          >
            {/* Header section inside transparent card */}
            <div className="w-full text-left">
              <span className="eyebrow text-indigo-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] block text-xs">
                Candidate Portal
              </span>
              <h1 className="mt-0.5 font-display text-2xl font-bold tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
                Welcome back
              </h1>
              <p className="mt-1 text-xs text-slate-200 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                Sign in to continue your interview preparation and assessments.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-3 w-full flex items-start gap-2 rounded-xl border border-red-500/50 bg-red-950/75 p-2.5 text-xs font-semibold text-red-200 shadow-inner backdrop-blur-md"
              >
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={submit} className="mt-4 w-full space-y-3">
              {/* Email Field */}
              <div className="w-full text-left">
                <label htmlFor="email" className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  Email address
                </label>
                <div className="relative w-full">
                  <Mail
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-black z-10"
                    size={18}
                    aria-hidden="true"
                  />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    style={{
                      background: 'rgba(255, 255, 255, 0.78)',
                      border: '1px solid rgba(15, 23, 42, 0.35)',
                      backdropFilter: 'blur(4px)',
                      WebkitBackdropFilter: 'blur(4px)',
                    }}
                    className="w-full rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-900 font-medium placeholder:text-slate-500 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30 shadow-sm"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="w-full text-left">
                <label htmlFor="password" className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  Password
                </label>
                <div className="relative w-full">
                  <Lock
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-black z-10"
                    size={18}
                    aria-hidden="true"
                  />
                  <input
                    id="password"
                    type={show ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    style={{
                      background: 'rgba(255, 255, 255, 0.78)',
                      border: '1px solid rgba(15, 23, 42, 0.35)',
                      backdropFilter: 'blur(4px)',
                      WebkitBackdropFilter: 'blur(4px)',
                    }}
                    className="w-full rounded-xl pl-11 pr-11 py-2.5 text-sm text-slate-900 font-medium placeholder:text-slate-500 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30 shadow-sm"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                  />
                  <button
                    type="button"
                    aria-label={show ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10 text-black hover:text-slate-700 transition"
                    onClick={() => setShow(!show)}
                  >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password Row */}
              <div className="flex w-full items-center justify-between text-xs font-medium text-slate-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border-slate-500 bg-white/70 text-accent focus:ring-accent/30"
                  />
                  <span>Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-indigo-300 hover:text-white transition drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="w-full py-2.5 text-xs font-bold uppercase tracking-wider shadow-glow"
              >
                Sign in to workspace <ArrowRight size={15} />
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-3 flex items-center justify-center">
              <div className="w-full border-t border-white/20" />
              <span className="absolute bg-[#12192b]/90 px-3 text-[10px] font-bold tracking-widest text-slate-300 uppercase backdrop-blur-md rounded">
                OR
              </span>
            </div>

            {/* Interactive Social Logins (Real Google & GitHub OAuth) */}
            <div className="flex justify-center items-center gap-3.5">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 border border-white/30 shadow-sm transition hover:scale-105 hover:bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/40 active:scale-95"
                title="Sign in with Google"
                aria-label="Sign in with Google"
              >
                <GoogleIcon className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={handleGithubLogin}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e232a]/95 border border-slate-700/80 shadow-sm transition hover:scale-105 hover:bg-[#252c36] cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/40 active:scale-95"
                title="Sign in with GitHub"
                aria-label="Sign in with GitHub"
              >
                <GitHubIcon className="h-5 w-5 fill-white" />
              </button>
            </div>

            {/* Create account link (inside card) */}
            <div className="mt-3.5 pt-2.5 border-t border-white/15 text-center text-xs text-slate-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              New to SmartInterview?{' '}
              <Link
                to="/register"
                className="font-bold text-accent hover:text-indigo-300 transition underline underline-offset-4"
              >
                Create an account
              </Link>
            </div>
          </div>

          {/* Desktop Mascot: preserved beside card */}
          <div className="hidden md:block pointer-events-none absolute -right-28 lg:-right-32 bottom-0 z-20 select-none">
            <img
              src="/images/login-mascot-hq.png"
              alt="Cartoon candidate mascot standing beside login panel"
              className="h-[380px] lg:h-[410px] w-auto object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.85)] filter"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
