import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700 shadow-sm shadow-blue-600/25 border border-blue-500/40',
  secondary: 'bg-indigo-600/15 text-indigo-400 hover:bg-indigo-600/25 border border-indigo-500/30',
  accent:
    'bg-orange-600 text-white hover:bg-orange-500 active:bg-orange-700 shadow-sm shadow-orange-600/25 border border-orange-500/40',
  outline: 'surface-card hover:border-blue-500/50 text-[var(--text-primary)]',
  ghost:
    'bg-transparent hover:bg-slate-500/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
  danger: 'bg-rose-600/15 text-rose-400 hover:bg-rose-600/25 border border-rose-500/30',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'min-h-[38px] px-3.5 py-1.5 text-xs font-semibold rounded-lg gap-1.5',
  md: 'min-h-[44px] px-4 py-2.5 text-sm font-semibold rounded-xl gap-2',
  lg: 'min-h-[48px] px-6 py-3 text-sm font-bold rounded-xl gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        'inline-flex items-center justify-center cursor-pointer transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
