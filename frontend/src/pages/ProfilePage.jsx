import {
  Award,
  Bell,
  BookOpen,
  Briefcase,
  Check,
  CheckCircle2,
  Clock,
  Download,
  Edit3,
  GraduationCap,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  Mic,
  Moon,
  Phone,
  Plus,
  Save,
  Settings,
  ShieldCheck,
  Sliders,
  Sparkles,
  Sun,
  Trash2,
  User,
  UserCheck,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { getCurrentAssessment, getDsaStats } from '../services/api';

const DEFAULT_SKILLS = [
  'Data Structures & Algorithms',
  'Java',
  'Python',
  'C++',
  'System Design',
  'SQL',
  'Problem Solving',
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'settings' ? 'settings' : 'profile';

  const [editing, setEditing] = useState(false);
  const [skills, setSkills] = useState(DEFAULT_SKILLS);
  const [skillInput, setSkillInput] = useState('');
  const [assessment, setAssessment] = useState(null);
  const [dsaStats, setDsaStats] = useState(null);

  // Settings State
  const [notifications, setNotifications] = useState({
    emailAssessments: true,
    scoreAlerts: true,
    proctoringAudioCheck: true,
  });
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || 'Candidate',
    email: user?.email || 'candidate@domain.com',
    phone: '+1 (555) 019-2834',
    college: 'Computer Science & Engineering',
    experience: 'Intermediate',
    targetRole: 'Software Engineer',
  });

  useEffect(() => {
    getCurrentAssessment()
      .then((res) => setAssessment(res?.assessment || null))
      .catch(() => {});
    getDsaStats()
      .then((res) => setDsaStats(res || null))
      .catch(() => {});
  }, []);

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSaveSettings = () => {
    setSavedSettingsNotice(true);
    setTimeout(() => setSavedSettingsNotice(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="accent" dot>
              {activeTab === 'settings' ? 'Candidate Settings' : 'Candidate Profile'}
            </Badge>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {activeTab === 'settings' ? 'Account & Environment Settings' : 'Profile & Candidate Information'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {activeTab === 'settings'
              ? 'Configure interview hardware preferences, proctoring alerts, and account security.'
              : 'Manage your personal credentials, target engineering roles, and demonstrated competencies.'}
          </p>
        </div>

        {activeTab === 'profile' && (
          <Button
            variant={editing ? 'primary' : 'secondary'}
            onClick={() => setEditing(!editing)}
            className="self-start sm:self-auto"
          >
            {editing ? (
              <>
                <Save size={15} /> Save Changes
              </>
            ) : (
              <>
                <Edit3 size={15} /> Edit Profile
              </>
            )}
          </Button>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 space-x-6">
        <button
          onClick={() => setSearchParams({})}
          className={`flex items-center gap-2 pb-3 text-xs font-bold transition border-b-2 ${
            activeTab === 'profile'
              ? 'border-accent text-accent'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User size={15} /> Profile Information
        </button>
        <button
          onClick={() => setSearchParams({ tab: 'settings' })}
          className={`flex items-center gap-2 pb-3 text-xs font-bold transition border-b-2 ${
            activeTab === 'settings'
              ? 'border-accent text-accent'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings size={15} /> Account Settings
        </button>
      </div>

      {activeTab === 'profile' ? (
        /* Profile Tab Content */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Avatar Card & Account Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 bg-white text-slate-900 border-slate-200/80 shadow-sm space-y-6 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-xl font-bold text-white shadow-xs">
                  {form.name?.[0]?.toUpperCase() || 'C'}
                </div>
                <div className="min-w-0 text-center sm:text-left">
                  <h2 className="text-base font-bold text-slate-900 truncate">
                    {form.name}
                  </h2>
                  <p className="text-xs text-slate-500 truncate">{form.email}</p>
                  <span className="mt-1.5 inline-block rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                    Verified Candidate
                  </span>
                </div>
              </div>

              {/* Quick Details */}
              <div className="space-y-3 border-t border-slate-100 pt-5 text-xs text-slate-600">
                <div className="flex items-center gap-3">
                  <Briefcase size={15} className="text-slate-400 shrink-0" />
                  <span className="truncate font-medium">{form.targetRole}</span>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap size={15} className="text-slate-400 shrink-0" />
                  <span className="truncate font-medium">{form.college}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={15} className="text-slate-400 shrink-0" />
                  <span className="font-medium">{form.experience} Tier</span>
                </div>
              </div>

              {/* Assessment Status Pill */}
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80 text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="font-semibold">Hiring Status</span>
                  <span className="rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5">
                    Active Candidate
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-slate-500 leading-relaxed">
                  Assessment pipeline in progress. Complete rounds to qualify for enterprise recruiter review.
                </p>
              </div>
            </Card>

            {/* Performance Summary Snapshot */}
            <Card className="p-6 space-y-4">
              <h3 className="font-display text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles size={16} className="text-accent" /> Assessment Journey
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500">Aptitude Round</span>
                  <span className="font-bold text-slate-800">
                    {assessment?.aptitude?.status === 'PASSED'
                      ? 'Passed'
                      : assessment?.aptitude?.status || 'Pending'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500">Technical MCQs</span>
                  <span className="font-bold text-slate-800">
                    {assessment?.technical?.status === 'PASSED'
                      ? 'Passed'
                      : assessment?.technical?.status || 'Pending'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500">One-on-One AI Interview</span>
                  <span className="font-bold text-slate-800">
                    {assessment?.interview?.status === 'PASSED'
                      ? 'Passed'
                      : assessment?.interview?.status || 'Pending'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-500">DSA Problems Solved</span>
                  <span className="font-bold text-emerald-600">
                    {dsaStats?.totalSolved ?? 0} Solved
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Editable Profile Fields & Skills (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Personal Details Card */}
            <Card className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck size={18} className="text-accent" /> Personal Information
                </h3>
                {editing && (
                  <span className="text-xs text-amber-600 font-bold flex items-center gap-1">
                    <Edit3 size={13} /> Editing mode
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Full Name
                  </label>
                  <input
                    disabled={!editing}
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`input text-xs ${!editing && 'bg-slate-50/70 cursor-not-allowed text-slate-600'}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Email Address
                  </label>
                  <input
                    disabled
                    type="email"
                    value={form.email}
                    className="input text-xs bg-slate-50/70 cursor-not-allowed text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Target Role
                  </label>
                  <input
                    disabled={!editing}
                    type="text"
                    value={form.targetRole}
                    onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                    className={`input text-xs ${!editing && 'bg-slate-50/70 cursor-not-allowed text-slate-600'}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Experience Level
                  </label>
                  <select
                    disabled={!editing}
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    className={`input text-xs ${!editing && 'bg-slate-50/70 cursor-not-allowed text-slate-600'}`}
                  >
                    <option>Fresher / Graduate</option>
                    <option>Beginner (1-2 Years)</option>
                    <option>Intermediate (3-5 Years)</option>
                    <option>Advanced (5+ Years)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    College / Department
                  </label>
                  <input
                    disabled={!editing}
                    type="text"
                    value={form.college}
                    onChange={(e) => setForm({ ...form, college: e.target.value })}
                    className={`input text-xs ${!editing && 'bg-slate-50/70 cursor-not-allowed text-slate-600'}`}
                  />
                </div>
              </div>
            </Card>

            {/* Skills & Technical Tags Card */}
            <Card className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen size={18} className="text-accent" /> Technical Skills & Competencies
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Tags used to calibrate interview question depth and role simulations.
                  </p>
                </div>
              </div>

              {/* Skills Tags List */}
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:border-slate-300 transition"
                  >
                    {skill}
                    {editing && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-1 text-slate-400 hover:text-rose-600 transition"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {/* Add Skill Input (when editing) */}
              {editing && (
                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <input
                    type="text"
                    placeholder="Type new skill (e.g. Docker, Redis, Go)"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    className="input text-xs"
                  />
                  <Button variant="secondary" onClick={handleAddSkill} className="shrink-0 text-xs">
                    <Plus size={15} /> Add Skill
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      ) : (
        /* Account Settings Tab Content */
        <div className="space-y-6">
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
                <Bell size={18} className="text-accent" /> Notification & Reporting Preferences
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">Assessment Score Summaries</span>
                  <span className="text-slate-500 text-[11px]">
                    Receive an executive scorecard via email after each completed hiring stage.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailAssessments}
                  onChange={(e) =>
                    setNotifications({ ...notifications, emailAssessments: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">Practice Reminders & Streaks</span>
                  <span className="text-slate-500 text-[11px]">
                    Get daily alerts when your DSA coding streak is close to expiring.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.scoreAlerts}
                  onChange={(e) =>
                    setNotifications({ ...notifications, scoreAlerts: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent"
                />
              </label>
            </div>
          </Card>

          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
                <Mic size={18} className="text-accent" /> Hardware & Audio Diagnostics
              </h3>
            </div>

            <div className="text-xs space-y-3 text-slate-600">
              <p>
                The AI voice interviewer transcribes spoken answers locally before server evaluation. Ensure your primary microphone input is verified.
              </p>
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 border border-slate-200">
                <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-slate-800">Default System Audio Input Active</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
                <Lock size={18} className="text-accent" /> Account Security & Sessions
              </h3>
            </div>

            <div className="text-xs space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <div>
                  <span className="font-bold text-slate-800 block">Authentication Method</span>
                  <span className="text-slate-500 text-[11px]">{user?.email}</span>
                </div>
                <Badge variant="success">Secured</Badge>
              </div>

              <div className="flex justify-between items-center py-2">
                <div>
                  <span className="font-bold text-slate-800 block">Active JWT Session</span>
                  <span className="text-slate-500 text-[11px]">Valid in this browser</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">24h renewal</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              {savedSettingsNotice ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 size={15} /> Preferences saved successfully!
                </span>
              ) : (
                <span />
              )}
              <Button onClick={handleSaveSettings} className="text-xs">
                Save Preferences
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
