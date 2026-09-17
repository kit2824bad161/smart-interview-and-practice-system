import {
  ArrowRight,
  Bot,
  Check,
  Clock,
  Mic,
  Radio,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import { startCommunicationInterview } from '../services/api';

const CONTEXT_OPTIONS = [
  {
    id: 'java',
    title: 'Java Interview',
    description: 'OOP, JVM, collections, concurrency, and Java fundamentals.',
    jobRole: 'Java Developer',
    interviewType: 'Communication + Technical',
  },
  {
    id: 'hr',
    title: 'HR Interview',
    description: 'Behavioral questions, teamwork, conflict resolution, and career goals.',
    jobRole: 'General Candidate',
    interviewType: 'Communication + Behavioral',
  },
  {
    id: 'technical',
    title: 'Technical Interview',
    description: 'System design, data structures, debugging, and web technologies.',
    jobRole: 'Software Developer',
    interviewType: 'Communication + Technical',
  },
  {
    id: 'general',
    title: 'General Interview',
    description: 'Self-introduction, situational scenarios, and communication clarity.',
    jobRole: 'General Candidate',
    interviewType: 'General Communication',
  },
];

export default function CommunicationInterviewSetupPage() {
  const navigate = useNavigate();
  const [selectedContext, setSelectedContext] = useState(CONTEXT_OPTIONS[0]);
  const [loadingVoice, setLoadingVoice] = useState(false);
  const [errorVoice, setErrorVoice] = useState('');

  const handleStartAiConversation = async () => {
    setLoadingVoice(true);
    setErrorVoice('');
    try {
      const session = await startCommunicationInterview({
        jobRole: selectedContext.jobRole,
        experience: 'Fresher',
        difficulty: 'Medium',
        interviewType: selectedContext.interviewType,
        numberOfQuestions: 5,
      });
      localStorage.setItem('smart_communication_session', JSON.stringify(session));
      navigate('/communication/interview');
    } catch (err) {
      setErrorVoice(err.response?.data?.message || 'Unable to start AI conversation. Please try again.');
    } finally {
      setLoadingVoice(false);
    }
  };

  const handleStartExtempore = () => {
    navigate('/communication/challenge/setup');
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Practice Center</p>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">Communication Practice</h1>
        <p className="text-sm text-slate-500 mt-1">
          Improve your spoken clarity, articulation, and conversational confidence. Choose between spontaneous speech or interactive AI interviews.
        </p>
      </div>

      {/* Two Clearly Separated Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* CARD 1: EXTEMPORE */}
        <Card className="p-6 md:p-8 flex flex-col justify-between border-slate-200/80 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-slate-100 text-slate-900">
                <Radio size={20} />
              </div>
              <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200/60">
                Spontaneous Speaking
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">Extempore Practice</h2>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Speak on a randomly generated topic to build spontaneous thinking, structure, and speaking confidence.
              </p>
            </div>

            {/* Preparation and Speaking Time parameters */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                <p className="text-xs font-medium text-slate-400">Preparation Time</p>
                <div className="mt-1 flex items-center gap-1.5 text-slate-800 font-bold text-base">
                  <Clock size={15} className="text-slate-500" />
                  <span>30 seconds</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                <p className="text-xs font-medium text-slate-400">Speaking Time</p>
                <div className="mt-1 flex items-center gap-1.5 text-slate-800 font-bold text-base">
                  <Volume2 size={15} className="text-slate-500" />
                  <span>2 minutes</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50/50 border border-slate-100 p-3.5 text-xs text-slate-500 leading-relaxed">
              Real-time speech intelligence evaluates your pace (WPM), filler words, vocabulary, and coherence upon completion.
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Button
              onClick={handleStartExtempore}
              className="w-full justify-center bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold py-3 rounded-xl"
            >
              Start Extempore <ArrowRight size={14} className="ml-1.5" />
            </Button>
          </div>
        </Card>

        {/* CARD 2: AI VOICE PRACTICE */}
        <Card className="p-6 md:p-8 flex flex-col justify-between border-slate-200/80 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-slate-100 text-slate-900">
                <Bot size={20} />
              </div>
              <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200/60">
                Interactive Voice AI
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">AI Voice Practice</h2>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Practice a real conversation with an AI voice interviewer. The AI asks questions, listens to your responses, and provides contextual follow-ups.
              </p>
            </div>

            {/* Choose Context */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">Choose Context</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CONTEXT_OPTIONS.map((ctx) => {
                  const isSelected = selectedContext.id === ctx.id;
                  return (
                    <button
                      key={ctx.id}
                      type="button"
                      onClick={() => setSelectedContext(ctx)}
                      className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                        isSelected
                          ? 'border-slate-900 bg-slate-50 shadow-xs ring-1 ring-slate-900'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-slate-900">{ctx.title}</span>
                        {isSelected && <Check size={14} className="text-slate-900" />}
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1 line-clamp-2">{ctx.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            {errorVoice && (
              <div className="rounded-xl bg-rose-50 p-2.5 border border-rose-200 text-rose-700 text-xs">
                {errorVoice}
              </div>
            )}

            <Button
              onClick={handleStartAiConversation}
              loading={loadingVoice}
              className="w-full justify-center bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold py-3 rounded-xl"
            >
              {loadingVoice ? 'Connecting AI Interviewer...' : 'Start AI Conversation'} <ArrowRight size={14} className="ml-1.5" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
