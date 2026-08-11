import React from 'react';
import { cn } from '../../utils/cn';

const base =
'w-full rounded-md border border-input bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-shadow focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring disabled:opacity-60';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) =>
  <input ref={ref} className={cn(base, 'h-9', className)} {...props} />

);
Input.displayName = 'Input';

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, rows = 4, ...props }, ref) =>
  <textarea ref={ref} rows={rows} className={cn(base, 'py-2 leading-relaxed', className)} {...props} />
);
Textarea.displayName = 'Textarea';

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) =>
  <select ref={ref} className={cn(base, 'h-9 pr-8', className)} {...props} />
);
Select.displayName = 'Select';

export function Field({
  label,
  hint,
  required,
  className,
  children






}: {label: string;hint?: string;required?: boolean;className?: string;children: React.ReactNode;}) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-1.5 flex items-center gap-1 text-xs font-medium text-foreground">
        {label}
        {required ? <span className="text-danger">*</span> : null}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span> : null}
    </label>);

}