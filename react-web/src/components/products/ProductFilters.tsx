







import React from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { categories, brands, cropsList, indianStates } from '../../data/mockData';
import { Label, Select, Input } from '../ui/Input';
import { Button } from '../ui/Button';

export interface FilterState {
  search: string;
  categorySlug: string;
  brandSlug: string;
  crop: string;
  state: string;
  district: string;
  productType: string;
  sort: 'newest' | 'popular' | '';
}

export const emptyFilters: FilterState = {
  search: '', categorySlug: '', brandSlug: '', crop: '', state: '', district: '', productType: '', sort: ''
};

export function ProductFilters({
  value,
  onChange,
  onClear




}: {value: FilterState;onChange: (next: FilterState) => void;onClear: () => void;}) {
  const { t, tv } = useLanguage();
  const set = <K extends keyof FilterState,>(key: K, v: FilterState[K]) => onChange({ ...value, [key]: v });

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-foreground">
          <SlidersHorizontal className="h-4 w-4 text-primary" /> {t('filters.title')}
        </h2>
        <button type="button" onClick={onClear} className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-destructive">
          <X className="h-3.5 w-3.5" /> {t('filters.clear')}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <Label>{t('filters.search')}</Label>
          <Input value={value.search} onChange={(e) => set('search', e.target.value)} placeholder={t('filters.search')} />
        </div>

        <FilterSelect label={t('filters.category')} value={value.categorySlug} onChange={(v) => set('categorySlug', v)} allLabel={t('filters.all')}
        options={categories.map((c) => ({ value: c.slug, label: tv(c.name, c.nameHi) }))} />

        <FilterSelect label={t('filters.brand')} value={value.brandSlug} onChange={(v) => set('brandSlug', v)} allLabel={t('filters.all')}
        options={brands.map((b) => ({ value: b.slug, label: b.name }))} />

        <FilterSelect label={t('filters.crop')} value={value.crop} onChange={(v) => set('crop', v)} allLabel={t('filters.all')}
        options={cropsList.map((c) => ({ value: c, label: c }))} />

        <FilterSelect label={t('filters.state')} value={value.state} onChange={(v) => set('state', v)} allLabel={t('filters.all')}
        options={indianStates.map((s) => ({ value: s, label: s }))} />

        <div>
          <Label>{t('filters.district')}</Label>
          <Input value={value.district} onChange={(e) => set('district', e.target.value)} placeholder={t('filters.district')} />
        </div>

        <FilterSelect label={t('filters.productType')} value={value.productType} onChange={(v) => set('productType', v)} allLabel={t('filters.all')}
        options={[{ value: 'organic', label: 'Organic' }, { value: 'chemical', label: 'Chemical' }, { value: 'bio', label: 'Bio' }]} />

        <FilterSelect label={t('filters.sort')} value={value.sort} onChange={(v) => set('sort', v as FilterState['sort'])} allLabel={t('filters.all')}
        options={[{ value: 'newest', label: t('filters.newest') }, { value: 'popular', label: t('filters.popular') }]} />
      </div>
    </div>);

}

function FilterSelect({
  label, value, onChange, options, allLabel






}: {label: string;value: string;onChange: (v: string) => void;options: {value: string;label: string;}[];allLabel: string;}) {
  return (
    <div>
      <Label>{label}</Label>
      <Select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{allLabel}</option>
        {options.map((o) =>
        <option key={o.value} value={o.value}>{o.label}</option>
        )}
      </Select>
    </div>);

}