import { LoaderCircle } from 'lucide-react';

const VARIANTS = {
  primary: 'inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:bg-indigo-600 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50',
  secondary: 'inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent hover:bg-slate-50 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50',
  outline: 'inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-transparent px-4 py-2 text-sm font-bold text-slate-700 transition-all hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50',
  ghost: 'inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all disabled:cursor-not-allowed disabled:opacity-50',
  danger: 'inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-rose-700 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50',
  success: 'inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50',
  dark: 'inline-flex items-center justify-center gap-2 rounded-xl bg-navy-900 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-navy-800 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50',
};

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  className = '',
  ...props
}) {
  const baseStyle = VARIANTS[variant] || VARIANTS.primary;

  return (
    <button
      className={`${baseStyle} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <LoaderCircle size={15} className="animate-spin shrink-0" />}
      {children}
    </button>
  );
}
