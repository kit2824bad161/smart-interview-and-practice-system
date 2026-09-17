import { AlertCircle, RotateCcw } from 'lucide-react';
import Button from './Button';
import Card from './Card';

export default function ErrorState({
  title = 'Something went wrong',
  description = "We couldn't load this information right now. Please try again.",
  onRetry,
  className = '',
}) {
  return (
    <Card className={`flex flex-col items-center justify-center p-8 text-center border-rose-100 bg-rose-50/30 ${className}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
        <AlertCircle size={24} />
      </div>
      <h3 className="mt-4 font-display text-base font-bold text-slate-800">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-slate-500 leading-relaxed">{description}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="mt-4 text-xs">
          <RotateCcw size={14} /> Try Again
        </Button>
      )}
    </Card>
  );
}
