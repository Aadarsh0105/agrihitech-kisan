import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { cn } from '../../../utils/admin/cn';
import { Button } from './Button';

export function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  size = 'md',
  children








}: {open: boolean;onClose: () => void;title: string;description?: string;footer?: React.ReactNode;size?: 'sm' | 'md' | 'lg' | 'xl';children: React.ReactNode;}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const widths = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl'
  };

  return createPortal(
    <AnimatePresence>
      {open ?
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-6">
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-[2px]"
          onClick={onClose} />
        
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ opacity: 0, y: 12, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.99 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'relative my-6 w-full rounded-lg border border-border bg-[hsl(var(--surface))] shadow-pop',
            widths[size]
          )}>
          
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-foreground">{title}</h2>
                {description ?
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p> :
              null}
              </div>
              <Button variant="ghost" size="iconSm" onClick={onClose} aria-label="Close dialog">
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="max-h-[65vh] overflow-y-auto px-5 py-4">{children}</div>
            {footer ?
          <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3">
                {footer}
              </div> :
          null}
          </motion.div>
        </div> :
      null}
    </AnimatePresence>,
    document.body
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Delete',
  destructive = true








}: {open: boolean;onClose: () => void;onConfirm: () => void;title: string;message: string;confirmLabel?: string;destructive?: boolean;}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
      <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
          variant={destructive ? 'danger' : 'primary'}
          onClick={() => {
            onConfirm();
            onClose();
          }}>
          
            {confirmLabel}
          </Button>
        </>
      }>
      
      <p className="text-sm text-muted-foreground">{message}</p>
    </Modal>);

}
