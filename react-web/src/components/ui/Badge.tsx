




import React from 'react';
import { cn } from '../../lib/utils';

type Variant = 'default' | 'success' | 'accent' | 'muted' | 'outline';

const variants: Record<Variant, string> = {
  default: 'bg-primary text-primary-foreground',
  success: 'bg-primary-100 text-primary-700',
  accent: 'bg-accent-100 text-accent-600',
  muted: 'bg-muted text-muted-foreground',
  outline: 'border border-border text-foreground'
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variants[variant],
        className
      )}
      {...props} />);


}