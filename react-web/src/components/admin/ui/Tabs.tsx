import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/admin/cn';

export interface TabItem {
  key: string;
  label: string;
  count?: number;
}

export function Tabs({
  items,
  value,
  onChange,
  className,
  idPrefix = 'tab'






}: {items: TabItem[];value: string;onChange: (key: string) => void;className?: string;idPrefix?: string;}) {
  return (
    <div role="tablist" className={cn('flex gap-1 overflow-x-auto border-b border-border', className)}>
      {items.map((item) => {
        const selected = item.key === value;
        return (
          <button
            key={item.key}
            role="tab"
            id={`${idPrefix}-${item.key}`}
            aria-selected={selected}
            onClick={() => onChange(item.key)}
            className={cn(
              'relative whitespace-nowrap px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              selected ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}>
            
            <span className="flex items-center gap-1.5">
              {item.label}
              {typeof item.count === 'number' ?
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {item.count}
                </span> :
              null}
            </span>
            {selected ?
            <motion.span
              layoutId={`${idPrefix}-underline`}
              className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary"
              transition={{ type: 'spring', stiffness: 500, damping: 40 }} /> :

            null}
          </button>);

      })}
    </div>);

}