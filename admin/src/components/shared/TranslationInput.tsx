import React, { useState } from 'react';
import { LanguagesIcon } from 'lucide-react';
import type { LanguageCode, Translated } from '../../types';
import { LANGUAGES, translationCoverage } from '../../utils/i18n';
import { Input, Textarea } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';

/**
 * Multi-language content field. Values are stored as
 * `{ en: '…', hi: '…', mr: '…' }` so the storefront can pick the active locale.
 */
export function TranslationInput({
  label,
  value,
  onChange,
  multiline = false,
  required = false






}: {label: string;value: Translated;onChange: (next: Translated) => void;multiline?: boolean;required?: boolean;}) {
  const [active, setActive] = useState<LanguageCode>('en');
  const coverage = translationCoverage(value);
  const Control = multiline ? Textarea : Input;

  return (
    <div>
      <div className="mb-1.5 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-xs font-medium text-foreground">
          <LanguagesIcon className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          {label}
          {required ? <span className="text-danger">*</span> : null}
        </span>
        <Badge tone={coverage === 100 ? 'success' : coverage > 40 ? 'warning' : 'neutral'}>
          {coverage}% translated
        </Badge>
      </div>

      <div className="mb-2 flex flex-wrap gap-1">
        {LANGUAGES.map((lang) => {
          const filled = Boolean(value[lang.code]?.trim());
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setActive(lang.code)}
              className={cn(
                'rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors',
                active === lang.code ?
                'border-primary bg-primary-subtle text-primary' :
                filled ?
                'border-border bg-surface text-foreground hover:bg-muted' :
                'border-dashed border-border text-muted-foreground hover:bg-muted'
              )}
              title={lang.native}>
              
              {lang.code.toUpperCase()}
            </button>);

        })}
      </div>

      <Control
        value={value[active] ?? ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) =>
        onChange({ ...value, [active]: e.target.value })
        }
        placeholder={`${label} in ${LANGUAGES.find((l) => l.code === active)?.label}`}
        aria-label={`${label} (${active})`} />
      
    </div>);

}