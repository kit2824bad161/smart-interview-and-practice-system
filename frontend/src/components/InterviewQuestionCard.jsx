import {
  BrainCircuit,
  Clock,
  Mic,
  Send,
  SkipForward,
  Sparkles,
  Square,
} from 'lucide-react';
import Badge from './Badge';
import Button from './Button';
import Card from './Card';

export default function InterviewQuestionCard({
  question,
  answer,
  setAnswer,
  recording,
  setRecording,
  onSubmit,
  onSkip,
  loading,
  current,
  total,
  time,
}) {
  const progressPercent = (current / total) * 100;

  return (
    <div className="space-y-6">
      {/* Top Question Status Bar */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="accent">
              <BrainCircuit size={13} className="mr-1 inline" /> AI Evaluation
            </Badge>
            <span className="text-xs font-semibold text-slate-400">Mock Interview Round</span>
          </div>
          <p className="mt-1 font-display text-xl font-extrabold text-navy-900">
            Question {current} <span className="text-sm font-medium text-slate-400">of {total}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 font-mono text-xs font-bold text-navy-900 shadow-sm">
          <Clock size={15} className="text-brand-600" />
          <span>{time}</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="h-2 overflow-hidden rounded-full bg-slate-200/80">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-600 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Main Card */}
      <Card className="relative overflow-hidden p-6 md:p-9">
        {/* Subtle decorative gradient orb */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand-50/70 blur-2xl" />

        <div className="relative">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">
              {question.category}
            </span>
            <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
              {question.difficulty}
            </span>
          </div>

          {/* Question Text */}
          <h2 className="mt-6 max-w-3xl font-display text-xl font-bold leading-relaxed tracking-tight text-navy-900 md:text-3xl">
            {question.question}
          </h2>

          {/* Response Form */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Your Response
              </label>
              <span className="text-[11px] text-slate-400">
                {answer.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            <textarea
              rows={8}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Structure your answer clearly: outline the core concept, provide concrete examples or trade-offs, and summarize key benefits..."
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm leading-relaxed text-slate-900 placeholder-slate-400 shadow-inner transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
            />

            {/* Controls Bar */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRecording(!recording)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition-all ${
                    recording
                      ? 'border-red-200 bg-red-50 text-red-600 animate-pulse'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-600'
                  }`}
                >
                  {recording ? (
                    <>
                      <Square size={14} /> Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic size={14} /> Start Voice Input
                    </>
                  )}
                </button>

                {recording && (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                    Recording audio...
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button type="button" variant="secondary" onClick={onSkip}>
                  <SkipForward size={15} /> Skip
                </Button>
                <Button
                  type="button"
                  onClick={onSubmit}
                  loading={loading}
                  disabled={!answer.trim()}
                  className="bg-brand-500 hover:bg-brand-600 text-white"
                >
                  <Send size={15} /> {loading ? 'Evaluating...' : 'Submit Response'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
