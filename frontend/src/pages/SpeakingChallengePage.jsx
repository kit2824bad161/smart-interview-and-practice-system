import {
  ArrowLeft,
  ChevronRight,
  Clock3,
  Mic,
  ShieldCheck,
  Volume2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';
import VoiceRecorder from '../components/VoiceRecorder';
import { submitSpeakingChallenge } from '../services/api';

export default function SpeakingChallengePage() {
  const navigate = useNavigate();
  const challenge = JSON.parse(localStorage.getItem('smart_speaking_challenge') || 'null');
  const [preparation, setPreparation] = useState(challenge?.preparationSeconds || 10);
  const [ready, setReady] = useState(false);
  const [blob, setBlob] = useState(null);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!challenge) {
      navigate('/communication/challenge/setup');
      return undefined;
    }
    if (preparation <= 0) {
      setReady(true);
      return undefined;
    }
    const timer = window.setTimeout(() => setPreparation((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [challenge, navigate, preparation]);

  if (!challenge) return null;

  const submit = async () => {
    if (!blob) {
      setError('Record your spoken response before submitting.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const body = new FormData();
      body.append('audio', blob, 'speaking-challenge.webm');
      body.append('duration', String(duration));
      const result = await submitSpeakingChallenge(challenge.challengeId, body);
      localStorage.setItem('smart_speaking_result', JSON.stringify(result));
      navigate(`/communication/challenge/result/${challenge.challengeId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to analyze the challenge recording.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent" dot>Speaking Challenge</Badge>
          </div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
            Spontaneous Fluency Assessment
          </h1>
          <p className="text-xs text-slate-500">
            {challenge.durationLimit / 60}-minute timed response recording.
          </p>
        </div>

        <Link
          to="/communication"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft size={14} /> Exit Challenge
        </Link>
      </div>

      <Card className="p-6 md:p-10 text-center space-y-6">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Assigned Topic
        </span>

        <h2 className="mx-auto max-w-2xl font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
          {challenge.topic}
        </h2>

        {!ready ? (
          <div className="py-8">
            <div className="mx-auto flex h-28 w-28 flex-col items-center justify-center rounded-full bg-indigo-50 border-2 border-indigo-200 text-accent shadow-sm animate-pulse">
              <span className="font-display text-4xl font-bold">{preparation}</span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-accent">
                Seconds
              </span>
            </div>
            <p className="mt-4 text-xs font-semibold text-slate-500">
              Preparation window. Organize your talking points before recording starts.
            </p>
          </div>
        ) : (
          <div className="mx-auto max-w-md pt-4 space-y-5">
            <VoiceRecorder
              maxDuration={challenge.durationLimit}
              disabled={loading}
              onRecordingComplete={(audio, seconds) => {
                setBlob(audio);
                setDuration(seconds);
                setError('');
              }}
            />

            {blob && (
              <p className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-1">
                ✓ Audio recorded successfully ({duration}s). Ready to analyze.
              </p>
            )}

            <Button
              variant="primary"
              onClick={submit}
              disabled={!blob || loading}
              loading={loading}
              className="w-full py-3"
            >
              {loading ? 'Evaluating Speech Metrics...' : 'Submit Challenge Response'} <ChevronRight size={16} />
            </Button>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-700">
            {error}
          </div>
        )}

        <div className="flex items-center justify-center gap-2 pt-4 text-xs text-slate-400 border-t border-slate-100">
          <Clock3 size={14} className="text-slate-400" />
          <span>Microphone will conclude automatically upon duration limit.</span>
        </div>
      </Card>
    </div>
  );
}
