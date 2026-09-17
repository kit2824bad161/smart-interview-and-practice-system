import {
  ArrowRight,
  Clock,
  SlidersHorizontal,
  Target,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { startAptitude } from '../services/api';

const ALL_TOPICS = [
  'All Topics',
  'Analogy',
  'Profit & Loss',
  'Number System',
  'Arithmetic',
  'Time & Work',
  'Time, Speed & Distance',
  'Series',
  'Number Series',
  'Coding & Decoding',
  'Classification',
  'Blood Relations',
  'Logical Relations',
  'Cube & Dice',
  'Squares & Cubes',
  'Percentage',
  'Ratio & Proportion',
  'Average',
  'Simple Interest',
  'Compound Interest',
  'Problems on Ages',
  'Partnership',
  'Mixtures & Alligation',
  'HCF & LCM',
  'Simplification',
  'Data Interpretation',
  'Logical Reasoning',
];

const TIME_OPTIONS = [10, 15, 20, 25, 30];

export default function AptitudePracticeSetupPage() {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState('All Topics');
  const [difficulty, setDifficulty] = useState('Moderate');
  const [numberOfQuestions, setNumberOfQuestions] = useState(15);
  const [timeLimit, setTimeLimit] = useState(18);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const start = async () => {
    setLoading(true);
    setError('');

    const backendTopic = selectedTopic === 'All Topics' ? 'Mixed' : selectedTopic;
    const backendDiff = difficulty === 'Moderate' ? 'Medium' : difficulty === 'Advanced' ? 'Hard' : 'Easy';

    const config = {
      mode: 'practice',
      category: 'Mixed Aptitude',
      topic: backendTopic,
      difficulty: backendDiff,
      numberOfQuestions,
      timeLimit,
    };

    try {
      const session = await startAptitude(config);
      localStorage.setItem('smart_aptitude_session', JSON.stringify(session));
      localStorage.setItem('smart_aptitude_config', JSON.stringify({
        ...config,
        selectedTopic,
        displayDifficulty: difficulty,
      }));
      navigate('/aptitude');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to start practice. Please check connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
          Aptitude Practice
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure a focused quantitative and reasoning session at your own pace.
        </p>
      </div>

      {/* Simple Clean Card (Reference Inspired) */}
      <Card className="p-6 sm:p-8 space-y-6">
        {/* Number of Questions */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
            Number of Questions
          </label>
          <div className="flex gap-2.5">
            {[10, 15, 20].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => {
                  setNumberOfQuestions(num);
                  setTimeLimit(num === 10 ? 12 : num === 15 ? 18 : 25);
                }}
                className={`flex-1 rounded-xl py-2.5 px-4 text-xs font-bold transition ${
                  numberOfQuestions === num
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {num} Questions
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
            Difficulty
          </label>
          <div className="flex gap-2.5">
            {['Easy', 'Moderate', 'Advanced'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setDifficulty(lvl)}
                className={`flex-1 rounded-xl py-2.5 px-4 text-xs font-bold transition ${
                  difficulty === lvl
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Topic */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Topic
          </label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none transition focus:border-slate-400"
          >
            {ALL_TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {topic === 'All Topics' ? 'All Topics (Mixed)' : topic}
              </option>
            ))}
          </select>
        </div>

        {/* Time */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Practice Time
          </label>
          <select
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none transition focus:border-slate-400"
          >
            {TIME_OPTIONS.map((min) => (
              <option key={min} value={min}>
                {min} minutes
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="rounded-xl bg-rose-50 p-3 text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        {/* Start Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={start}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow-xs transition hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? 'Starting...' : 'Start Practice'} <ArrowRight size={14} />
          </button>
        </div>
      </Card>
    </div>
  );
}
