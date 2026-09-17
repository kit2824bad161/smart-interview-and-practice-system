import { Inbox } from 'lucide-react';
import Button from './Button';
import Card from './Card';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'There is no data available to display at this moment.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <Card className={`flex flex-col items-center justify-center p-12 text-center ${className}`}>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50 text-slate-400">
        <Icon size={26} />
      </div>
      <h3 className="mt-4 font-display text-base font-bold text-slate-800">{title}</h3>
      <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-slate-500">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </Card>
  );
}
