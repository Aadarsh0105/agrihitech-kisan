














import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Button } from '../ui/Button';
import type { TranslationKey } from '../../i18n/translations';

type Mode = 'product' | 'brand' | 'category' | 'crop';

const TABS: {mode: Mode;label: TranslationKey;}[] = [
{ mode: 'product', label: 'search.byProduct' },
{ mode: 'brand', label: 'search.byBrand' },
{ mode: 'category', label: 'search.byCategory' },
{ mode: 'crop', label: 'search.byCrop' }];


export function GlobalSearch() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('product');
  const [value, setValue] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const param =
    mode === 'brand' ? 'brandSearch' :
    mode === 'category' ? 'categorySearch' :
    mode === 'crop' ? 'crop' :
    'search';
    navigate(`/products?${param}=${encodeURIComponent(value)}`);
  };

  return (
    <div className="container relative -mt-14 z-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-3xl border border-border bg-card p-4 shadow-soft-lg sm:p-5">
        
        <div className="mb-3 flex flex-wrap gap-1.5">
          {TABS.map((tab) =>
          <button
            key={tab.mode}
            type="button"
            onClick={() => setMode(tab.mode)}
            className={`relative rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
            mode === tab.mode ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`
            }>
            
              {mode === tab.mode &&
            <motion.span
              layoutId="search-tab"
              className="absolute inset-0 -z-10 rounded-full bg-primary"
              transition={{ type: 'spring', stiffness: 400, damping: 32 }} />

            }
              {t(tab.label)}
            </button>
          )}
        </div>
        <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`${t('search.button')} ${t(TABS.find((x) => x.mode === mode)!.label).toLowerCase()}…`}
              className="h-14 w-full rounded-full border border-input bg-background pl-12 pr-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={t('search.button')} />
            
          </div>
          <Button type="submit" size="lg" className="sm:px-10">
            <Search className="h-5 w-5" />
            {t('search.button')}
          </Button>
        </form>
      </motion.div>
    </div>);

}