








import React, { useState } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { Label } from '../ui/Input';

export function FileDrop({ label, onChange }: {label: string;onChange?: (file: File | null) => void;}) {
  const [name, setName] = useState<string>('');

  const handle = (file: File | null) => {
    setName(file?.name ?? '');
    onChange?.(file);
  };

  return (
    <div>
      <Label>{label}</Label>
      <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border bg-secondary/40 px-4 py-6 text-center transition hover:border-primary hover:bg-primary-50/50">
        {name ?
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
            {name}
            <button type="button" onClick={(e) => {e.preventDefault();handle(null);}} aria-label="Remove">
              <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </button>
          </span> :

        <>
            <UploadCloud className="h-6 w-6 text-primary" />
            <span className="text-sm text-muted-foreground">Click to upload</span>
          </>
        }
        <input type="file" className="hidden" onChange={(e) => handle(e.target.files?.[0] ?? null)} />
      </label>
    </div>);

}