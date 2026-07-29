

import React from 'react';
import { cn } from '../../lib/utils';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent' | 'destructive';
type Size = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-700 shadow-soft',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-primary-100',
  outline: 'border border-border bg-transparent hover:bg-secondary text-foreground',
  ghost: 'bg-transparent hover:bg-secondary text-foreground',
  accent: 'bg-accent text-accent-foreground hover:bg-accent-600 shadow-soft',
  destructive: 'bg-destructive text-destructive-foreground hover:opacity-90'
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-7 text-base',
  icon: 'h-10 w-10'
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) =>
  <button
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]',
      variants[variant],
      sizes[size],
      className
    )}
    {...props} />


);
Button.displayName = 'Button';