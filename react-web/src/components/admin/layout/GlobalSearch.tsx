import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { CornerDownLeftIcon, SearchIcon } from 'lucide-react';
import { flatNavigation } from '../../../config/admin/navigation';
import { Input } from '../ui/Input';
import { cn } from '../../../utils/admin/cn';

export function GlobalSearch({ open, onClose }: {open: boolean;onClose: () => void;}) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ?
    flatNavigation.filter(
      (item) =>
      item.label.toLowerCase().includes(q) || item.group.toLowerCase().includes(q)
    ) :
    flatNavigation.slice(0, 8);
    return list.slice(0, 10);
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((i) => Math.min(i + 1, results.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
      }
      if (e.key === 'Enter' && results[active]) {
        navigate(results[active].path);
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, results, active, navigate, onClose]);

  return createPortal(
    <AnimatePresence>
      {open ?
      <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[12vh]">
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-[2px]"
          onClick={onClose} />
        
          <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-label="Global search"
          className="relative w-full max-w-lg overflow-hidden rounded-lg border border-border bg-elevated shadow-pop">
          
            <div className="flex items-center gap-2 border-b border-border px-3">
              <SearchIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              placeholder="Search modules, products, dealers…"
              aria-label="Search modules"
              className="h-11 border-0 bg-transparent px-0 focus:ring-0" />
            
            </div>
            <ul className="max-h-80 overflow-y-auto p-1.5">
              {results.length === 0 ?
            <li className="px-3 py-6 text-center text-xs text-muted-foreground">
                  No matches for “{query}”
                </li> :

            results.map((item, index) =>
            <li key={item.path}>
                    <button
                type="button"
                onMouseEnter={() => setActive(index)}
                onClick={() => {
                  navigate(item.path);
                  onClose();
                }}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors',
                  index === active ? 'bg-muted text-foreground' : 'text-muted-foreground'
                )}>
                
                      <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="truncate font-medium text-foreground">{item.label}</span>
                      <span className="ml-auto text-[11px] text-muted-foreground">{item.group}</span>
                      {index === active ?
                <CornerDownLeftIcon className="h-3.5 w-3.5" aria-hidden="true" /> :
                null}
                    </button>
                  </li>
            )
            }
            </ul>
          </motion.div>
        </div> :
      null}
    </AnimatePresence>,
    document.body
  );
}