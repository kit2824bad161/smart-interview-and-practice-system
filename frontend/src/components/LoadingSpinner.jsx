import { LoaderCircle } from 'lucide-react';
export default function LoadingSpinner({ label = 'Loading your workspace...' }) { return <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 text-sm text-slate-500"><LoaderCircle className="animate-spin text-accent" size={28} /><span>{label}</span></div>; }
