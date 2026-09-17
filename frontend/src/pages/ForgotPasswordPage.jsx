import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BrainCircuit, CheckCircle2, Mail, Send } from 'lucide-react';
import Button from '../components/Button';
import { forgotPassword } from '../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return setError('Please enter your email address.');
    }
    setError('');
    setLoading(true);
    try {
      await forgotPassword({ email });
      setSubmitted(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen md:h-screen w-full bg-cover bg-center bg-no-repeat text-slate-100 flex flex-col items-center justify-center p-3 sm:p-4 overflow-x-hidden md:overflow-hidden"
      style={{ backgroundImage: "url('/images/login-office-background.jpg')" }}
    >
      {/* Background overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[#050a14]/35" />

      {/* Main Centered Container */}
      <div className="relative z-10 w-full max-w-[440px] mx-auto flex flex-col items-center">
        {/* Top Branding */}
        <div className="w-full mb-4 text-center drop-shadow-md">
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

        {/* Card */}
        <div
          className="w-full rounded-[22px] p-6 sm:p-7 text-white"
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '2px solid rgba(15, 23, 42, 0.85)',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.18)',
          }}
        >
          <div className="w-full text-left">
            <span className="eyebrow text-indigo-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] block text-xs">Candidate Portal</span>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
              Forgot Password
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-200 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
              Enter your registered email address and we'll send you a password reset link.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-4 w-full flex items-start gap-2.5 rounded-xl border border-red-500/50 bg-red-950/75 p-3 text-xs font-semibold text-red-200 shadow-inner backdrop-blur-md"
            >
              <span>{error}</span>
            </div>
          )}

          {submitted ? (
            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-emerald-500/50 bg-emerald-950/70 p-4 text-xs sm:text-sm text-emerald-100 backdrop-blur-md flex items-start gap-3">
                <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Reset Link Dispatched</p>
                  <p className="mt-1 text-slate-300 text-xs leading-relaxed">
                    If an account exists for <span className="font-bold text-white">{email}</span>, a password reset link has been sent. Please check your inbox and spam folder.
                  </p>
                </div>
              </div>

              <div className="pt-2 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-200 hover:text-white transition underline underline-offset-4"
                >
                  <ArrowLeft size={14} /> Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 w-full space-y-4">
              <div className="w-full text-left">
                <label htmlFor="reset-email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  Email address
                </label>
                <div className="relative w-full">
                  <Mail
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-black z-10"
                    size={18}
                    aria-hidden="true"
                  />
                  <input
                    id="reset-email"
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="w-full py-3 text-xs font-bold uppercase tracking-wider shadow-glow"
              >
                {loading ? 'Sending...' : 'Send Reset Link'} <Send size={14} className="ml-1" />
              </Button>

              <div className="pt-2 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-200 hover:text-white transition underline underline-offset-4"
                >
                  <ArrowLeft size={13} /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
