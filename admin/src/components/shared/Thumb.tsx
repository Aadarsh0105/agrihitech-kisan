import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { cn } from '../../utils/cn';

export function Thumb({
  src,
  alt,
  size = 'md',
  rounded = 'md',
  previewable = true






}: {src?: string;alt: string;size?: 'sm' | 'md' | 'lg';rounded?: 'md' | 'full';previewable?: boolean;}) {
  const [open, setOpen] = useState(false);
  const dimension = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-14 w-14' }[size];
  const radius = rounded === 'full' ? 'rounded-full' : 'rounded-md';

  if (!src) {
    return (
      <div
        className={cn(
          'flex shrink-0 items-center justify-center border border-border bg-muted',
          dimension,
          radius
        )}>
        
        <ImageIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      </div>);

  }

  return (
    <>
      <button
        type="button"
        onClick={() => previewable && setOpen(true)}
        className={cn(
          'shrink-0 overflow-hidden border border-border bg-muted transition-opacity',
          dimension,
          radius,
          previewable ? 'cursor-zoom-in hover:opacity-85' : 'cursor-default'
        )}
        aria-label={previewable ? `Preview ${alt}` : alt}>
        
        <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
      </button>
      {previewable ?
      <Modal open={open} onClose={() => setOpen(false)} title={alt} size="lg">
          <img src={src} alt={alt} className="w-full rounded-md border border-border object-contain" />
        </Modal> :
      null}
    </>);

}