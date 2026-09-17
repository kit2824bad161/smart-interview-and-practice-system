import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, BrainCircuit, CheckCircle2, Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react';
import Button from '../components/Button';
import { resetPassword } from '../services/api';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match. Please re-enter.');
    }

    setError('');
    setLoading(true);
    try {
      await resetPassword(token, { password });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      setError(err?.response?.data?.message || 'Password reset link is invalid or has expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen md:h-screen w-full bg-cover bg-center bg-no-repeat text-slate-100 flex flex-col items-center justify-center p-3 sm:p-4 overflow-x-hidden md:overflow-hidden"
      style={{ backgroundImage: "url('/images/login-office-background.jpg')" }}
    >
      {/* Subtle overlay */}
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
              Set New Password
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-200 leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
              Create a new secure password for your account.
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

          {success ? (
            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-emerald-500/50 bg-emerald-950/70 p-4 text-xs sm:text-sm text-emerald-100 backdrop-blur-md flex items-start gap-3">
                <CheckCircle2 size={22} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Password updated successfully.</p>
                  <p className="mt-1 text-slate-300 text-xs">
                    Your password has been changed. Redirecting to login page...
                  </p>
                </div>
              </div>

              <div className="pt-2 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-white transition underline underline-offset-4"
                >
                  <ArrowLeft size={14} /> Back to Sign In Now
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 w-full space-y-4">
              {/* New Password */}
              <div className="w-full text-left">
                <label htmlFor="new-password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  New Password
                </label>
                <div className="relative w-full">
                  <Lock
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-black z-10"
                    size={18}
                    aria-hidden="true"
                  />
                  <input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    style={{
                      background: 'rgba(255, 255, 255, 0.78)',
                      border: '1px solid rgba(15, 23, 42, 0.35)',
                      backdropFilter: 'blur(4px)',
                      WebkitBackdropFilter: 'blur(4px)',
                    }}
                    className="w-full rounded-xl pl-11 pr-11 py-2.5 text-sm text-slate-900 font-medium placeholder:text-slate-500 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30 shadow-sm"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10 text-black hover:text-slate-700 transition"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="w-full text-left">
                <label htmlFor="confirm-password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  Confirm New Password
                </label>
                <div className="relative w-full">
                  <Lock
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-black z-10"
                    size={18}
                    aria-hidden="true"
                  />
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    style={{
                      background: 'rgba(255, 255, 255, 0.78)',
                      border: '1px solid rgba(15, 23, 42, 0.35)',
                      backdropFilter: 'blur(4px)',
                      WebkitBackdropFilter: 'blur(4px)',
                    }}
                    className="w-full rounded-xl pl-11 pr-11 py-2.5 text-sm text-slate-900 font-medium placeholder:text-slate-500 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30 shadow-sm"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10 text-black hover:text-slate-700 transition"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="w-full py-3 text-xs font-bold uppercase tracking-wider shadow-glow"
              >
                {loading ? 'Updating Password...' : 'Reset Password'}
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
