import { Mic, Square, Timer } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function VoiceRecorder({ onRecordingComplete, maxDuration = 90, disabled = false }) {
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const startedAtRef = useRef(0);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => () => streamRef.current?.getTracks().forEach(track => track.stop()), []);

  useEffect(() => {
    if (!recording) return undefined;
    const timer = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAtRef.current) / 1000);
      setSeconds(elapsed);
      if (elapsed >= maxDuration) stopRecording();
    }, 250);
    return () => window.clearInterval(timer);
  }, [recording, maxDuration]);

  const stopRecording = () => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
  };

  const startRecording = async () => {
    setError('');
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError('This browser does not support microphone recording.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find(type => MediaRecorder.isTypeSupported(type)) || '';
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      streamRef.current = stream;
      recorderRef.current = recorder;
      chunksRef.current = [];
      startedAtRef.current = Date.now();
      recorder.ondataavailable = event => { if (event.data.size > 0) chunksRef.current.push(event.data); };
      recorder.onerror = () => setError('Recording failed. Please try again.');
      recorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        const duration = Math.min(maxDuration, Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000)));
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        setRecording(false);
        if (!blob.size) setError('The recording was empty. Please try again.');
        else onRecordingComplete(blob, duration);
      };
      recorder.start();
      setSeconds(0);
      setRecording(true);
    } catch (err) {
      setError(err.name === 'NotAllowedError' ? 'Microphone permission was denied.' : 'Microphone is unavailable.');
    }
  };

  const time = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  return <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
    <div className="flex items-center justify-between text-sm font-bold text-slate-600"><span className="flex items-center gap-2"><Timer size={16} className="text-accent"/> {time}</span><span>Maximum {Math.floor(maxDuration / 60)}:{String(maxDuration % 60).padStart(2, '0')}</span></div>
    <button type="button" disabled={disabled} onClick={recording ? stopRecording : startRecording} className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${recording ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-ink text-white hover:bg-accent'} disabled:cursor-not-allowed disabled:opacity-50`}>
      {recording ? <><Square size={16} fill="currentColor"/> Stop recording</> : <><Mic size={17}/> Start recording</>}
    </button>
    {recording && <p className="mt-3 text-center text-xs font-semibold text-red-600">Recording microphone audio...</p>}
    {error && <p className="mt-3 text-center text-xs font-semibold text-red-600">{error}</p>}
  </div>;
}
