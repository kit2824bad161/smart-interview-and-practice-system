import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthData } = useAuth();
  const [statusMessage, setStatusMessage] = useState('Verifying your credentials...');

  useEffect(() => {
    const token = searchParams.get('token');
    const userRaw = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      navigate(`/login?error=${encodeURIComponent(error)}`, { replace: true });
      return;
    }

    if (token && userRaw) {
      try {
        const user = JSON.parse(decodeURIComponent(userRaw));
        setStatusMessage('Authentication successful. Redirecting to workspace...');
        if (setAuthData) {
          setAuthData(token, user);
        } else {
          localStorage.setItem('smart_interview_token', token);
          localStorage.setItem('smart_interview_user', JSON.stringify(user));
        }

        // Brief delay to ensure state and storage sync cleanly
        const timer = setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 300);
        return () => clearTimeout(timer);
      } catch (err) {
        console.error('OAuth token parse error:', err);
        navigate(
          `/login?error=${encodeURIComponent('Authentication payload was invalid. Please try signing in again.')}`,
          { replace: true }
        );
      }
    } else {
      // Direct navigation without params -> return to login
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate, setAuthData]);

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat text-slate-100 flex flex-col items-center justify-center p-4 overflow-hidden"
      style={{ backgroundImage: "url('/images/login-office-background.jpg')" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[#050a14]/40" />

      <div className="relative z-10 w-full max-w-[380px] mx-auto text-center">
        <div
          className="w-full rounded-[22px] p-8 text-white flex flex-col items-center"
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '2px solid rgba(15, 23, 42, 0.85)',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.18)',
          }}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink/90 border border-white/20 text-white shadow-lg mb-4">
            <BrainCircuit size={26} className="text-mint" />
          </span>

          <h2 className="font-display text-xl font-bold tracking-tight text-white mb-2">
            SmartInterview AI
          </h2>

          <div className="mt-4 flex items-center justify-center gap-2.5 text-sm text-slate-200">
            <Loader2 size={18} className="animate-spin text-accent" />
            <span>{statusMessage}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
