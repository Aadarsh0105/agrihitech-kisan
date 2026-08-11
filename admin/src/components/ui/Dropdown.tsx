import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export function Dropdown({
  trigger,
  children,
  align = 'right',
  className





}: {trigger: (props: {open: boolean;toggle: () => void;}) => React.ReactNode;children: (props: {close: () => void;}) => React.ReactNode;align?: 'left' | 'right';className?: string;}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      {trigger({ open, toggle: () => setOpen((v) => !v) })}
      <AnimatePresence>
        {open ?
        <motion.div
          initial={{ opacity: 0, y: -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'absolute z-40 mt-1.5 min-w-[190px] rounded-lg border border-border bg-elevated p-1 shadow-pop',
            align === 'right' ? 'right-0' : 'left-0',
            className
          )}>
          
            {children({ close: () => setOpen(false) })}
          </motion.div> :
        null}
      </AnimatePresence>
    </div>);

}

export function DropdownItem({
  onClick,
  danger,
  children,
  className





}: {onClick?: () => void;danger?: boolean;children: React.ReactNode;className?: string;}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors',
        danger ?
        'text-danger hover:bg-danger-subtle' :
        'text-foreground hover:bg-muted',
        className
      )}>
      
      {children}
    </button>);

}

export function DropdownLabel({ children }: {children: React.ReactNode;}) {
  return (
    <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </div>);

}

export function DropdownSeparator() {
  return <div className="my-1 h-px bg-border" />;
}