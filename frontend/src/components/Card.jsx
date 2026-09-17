export default function Card({
  children,
  className = '',
  hover = false,
  ...props
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white shadow-card transition-all ${
        hover ? 'hover:border-slate-300 hover:shadow-card-hover hover:-translate-y-0.5' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
