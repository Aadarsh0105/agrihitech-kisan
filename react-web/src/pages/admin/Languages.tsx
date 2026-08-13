import React, { useState } from 'react';
import { LanguagesIcon, SaveIcon } from 'lucide-react';
import { PageHeader } from '../../components/admin/shared/PageHeader';
import { DataTable, type Column } from '../../components/admin/shared/DataTable';
import { FilterBar } from '../../components/admin/shared/FilterBar';
import { Card, CardBody, CardHeader } from '../../components/admin/ui/Card';
import { Button } from '../../components/admin/ui/Button';
import { Badge } from '../../components/admin/ui/Badge';
import { Input } from '../../components/admin/ui/Input';
import { Modal } from '../../components/admin/ui/Modal';
import { useResource } from '../../hooks/admin/useResource';
import { useTableState } from '../../hooks/admin/useTableState';
import { translationEntries } from '../../data/admin/system';
import { LANGUAGES } from '../../utils/admin/i18n';
import { cn } from '../../utils/admin/cn';
import type { LanguageCode, TranslationEntry } from '../../types/admin';

const modules = ['Categories', 'Products', 'Banners', 'Benefits', 'FAQs', 'Schemes'];

export function Languages() {
  const resource = useResource<TranslationEntry>({ endpoint: 'translations', seed: translationEntries });
  const [editing, setEditing] = useState<TranslationEntry | null>(null);
  const [draft, setDraft] = useState<Partial<Record<LanguageCode, string>>>({});

  const table = useTableState<TranslationEntry>({
    data: resource.items,
    pageSize: 8,
    searchFields: (item) => `${item.reference} ${item.module} ${item.field}`,
    filters: { module: (item, value) => item.module === value }
  });

  const coverageFor = (code: LanguageCode) => {
    const filled = resource.items.filter((entry) => Boolean(entry.values[code]?.trim())).length;
    return Math.round(filled / Math.max(resource.items.length, 1) * 100);
  };

  const columns: Column<TranslationEntry>[] = [
  {
    key: 'reference',
    header: 'Content',
    render: (item) =>
    <div className="max-w-sm">
          <p className="truncate text-sm font-medium text-foreground">{item.reference}</p>
          <p className="text-[11px] text-muted-foreground">
            {item.module} · <span className="font-mono">{item.field}</span>
          </p>
        </div>

  },
  {
    key: 'languages',
    header: 'Translations',
    render: (item) =>
    <div className="flex flex-wrap gap-1">
          {LANGUAGES.map((language) => {
        const filled = Boolean(item.values[language.code]?.trim());
        return (
          <span
            key={language.code}
            title={`${language.label}${filled ? '' : ' — missing'}`}
            className={cn(
              'rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase',
              filled ?
              'bg-success-subtle text-success' :
              'border border-dashed border-border text-muted-foreground'
            )}>
            
                {language.code}
              </span>);

      })}
        </div>

  },
  {
    key: 'coverage',
    header: 'Coverage',
    align: 'right',
    render: (item) => {
      const filled = LANGUAGES.filter((l) => Boolean(item.values[l.code]?.trim())).length;
      const percent = Math.round(filled / LANGUAGES.length * 100);
      return (
        <Badge tone={percent === 100 ? 'success' : percent > 40 ? 'warning' : 'danger'}>
            {percent}%
          </Badge>);

    }
  },
  {
    key: 'actions',
    header: '',
    align: 'right',
    className: 'w-24',
    render: (item) =>
    <Button
      variant="secondary"
      size="sm"
      onClick={() => {
        setEditing(item);
        setDraft({ ...item.values });
      }}>
      
          Translate
        </Button>

  }];


  return (
    <>
      <PageHeader
        title="Language Management"
        description="The admin panel stays in English. Content fields are stored per language and served to the storefront." />
      

      <Card>
        <CardHeader
          title="Language coverage"
          description="Percentage of tracked content fields translated per language." />
        
        <CardBody className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {LANGUAGES.map((language) => {
            const percent = coverageFor(language.code);
            return (
              <div key={language.code} className="rounded-md border border-border p-3">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-foreground">{language.label}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{language.native}</p>
                  </div>
                  <span className="font-mono text-[10px] uppercase text-muted-foreground">
                    {language.code}
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      percent === 100 ? 'bg-success' : percent > 40 ? 'bg-warning' : 'bg-danger'
                    )}
                    style={{ width: `${Math.max(percent, 3)}%` }} />
                  
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground">{percent}% complete</p>
              </div>);

          })}
        </CardBody>
      </Card>

      <FilterBar
        query={table.query}
        onQueryChange={table.setQuery}
        placeholder="Search content references…"
        filters={[{ key: 'module', label: 'Module', options: modules.map((m) => ({ value: m, label: m })) }]}
        values={table.filterValues}
        onFilterChange={table.setFilter}
        onReset={table.resetFilters} />
      

      <DataTable
        columns={columns}
        items={table.pageItems}
        isLoading={resource.isLoading}
        page={table.page}
        totalPages={table.totalPages}
        totalItems={table.totalItems}
        pageSize={table.pageSize}
        onPageChange={table.setPage}
        emptyTitle="No translatable content"
        emptyMessage="Content appears here as soon as it is created in any CMS module." />
      

      <Card className="border-dashed bg-muted/40">
        <CardBody className="flex items-start gap-3">
          <LanguagesIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div>
            <p className="text-xs font-medium text-foreground">Storage format</p>
            <pre className="mt-1.5 overflow-x-auto font-mono text-[11px] leading-relaxed text-muted-foreground">
{`{ "name": { "en": "Seeds", "hi": "बीज", "mr": "बियाणे" } }`}
            </pre>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Adding a future language only requires appending it to the language list — no schema change.
            </p>
          </div>
        </CardBody>
      </Card>

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={`Translate · ${editing?.reference ?? ''}`}
        description={`${editing?.module} → ${editing?.field}`}
        size="lg"
        footer={
        <>
            <Button variant="secondary" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button
            variant="primary"
            onClick={() => {
              if (editing) resource.update(editing.id, { values: draft });
              setEditing(null);
            }}>
            
              <SaveIcon className="h-3.5 w-3.5" />
              Save translations
            </Button>
          </>
        }>
        
        <div className="grid gap-3 sm:grid-cols-2">
          {LANGUAGES.map((language) =>
          <label key={language.code} className="block">
              <span className="mb-1 flex items-center justify-between text-xs font-medium text-foreground">
                {language.label}
                <span className="font-mono text-[10px] uppercase text-muted-foreground">
                  {language.code}
                </span>
              </span>
              <Input
              value={draft[language.code] ?? ''}
              placeholder={language.native}
              onChange={(e) => setDraft({ ...draft, [language.code]: e.target.value })} />
            
            </label>
          )}
        </div>
      </Modal>
    </>);

}