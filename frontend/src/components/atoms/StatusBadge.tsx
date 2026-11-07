import { clsx } from 'clsx';

type BadgeTone = 'emerald' | 'blue' | 'amber' | 'rose' | 'indigo';

interface StatusBadgeProps {
  label: string;
  tone?: BadgeTone;
  pulse?: boolean;
}

const TONE_STYLES: Record<BadgeTone, string> = {
  emerald: 'bg-emerald-500/12 text-emerald-500 border-emerald-500/30',
  blue: 'bg-blue-500/12 text-blue-500 border-blue-500/30',
  amber: 'bg-amber-500/12 text-amber-500 border-amber-500/30',
  rose: 'bg-rose-500/12 text-rose-500 border-rose-500/30',
  indigo: 'bg-indigo-500/12 text-indigo-400 border-indigo-500/30',
};

const DOT_STYLES: Record<BadgeTone, string> = {
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  indigo: 'bg-indigo-400',
};

export function StatusBadge({ label, tone = 'emerald', pulse = true }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border tracking-tight whitespace-nowrap',
        TONE_STYLES[tone],
      )}
    >
      <span
        aria-hidden="true"
        className={clsx('w-2 h-2 rounded-full', DOT_STYLES[tone], pulse && 'animate-pulse')}
      />
      {label}
    </span>
  );
}
