import React from 'react';
import { cn } from '../../../utils/admin/cn';

export function Switch({
  checked,
  onChange,
  label,
  disabled,
  className






}: {checked: boolean;onChange: (next: boolean) => void;label: string;disabled?: boolean;className?: string;}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50',
        checked ? 'bg-primary' : 'bg-border',
        className
      )}>
      
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-[18px]' : 'translate-x-0.5'
        )} />
      
    </button>);

}