const BADGE_VARIANTS = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  warning: 'bg-amber-50 text-amber-700 border-amber-200/80',
  danger: 'bg-rose-50 text-rose-700 border-rose-200/80',
  info: 'bg-blue-50 text-blue-700 border-blue-200/80',
  accent: 'bg-indigo-50 text-accent border-indigo-200/80',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200/80',
  dark: 'bg-navy-900 text-white border-navy-700',
};

const BADGE_DOTS = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
  info: 'bg-blue-500',
  accent: 'bg-accent',
  neutral: 'bg-slate-400',
  dark: 'bg-mint',
};

export default function Badge({
  children,
  variant = 'neutral',
  dot = false,
  size = 'sm',
  className = '',
}) {
  const variantClass = BADGE_VARIANTS[variant] || BADGE_VARIANTS.neutral;
  const dotColor = BADGE_DOTS[variant] || BADGE_DOTS.neutral;
  const sizeClass = size === 'xs' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-bold uppercase tracking-wider ${variantClass} ${sizeClass} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />}
      {children}
    </span>
  );
}
