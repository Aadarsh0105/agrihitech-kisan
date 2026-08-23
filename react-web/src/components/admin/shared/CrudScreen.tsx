import React, { useMemo, useState } from "react";
import { PlusIcon, Trash2Icon, BoxIcon } from "lucide-react";
import { EndpointKey } from "../../../api/admin/endpoints";
import { Translated } from "../../../types/admin";
import { useResource } from "../../../hooks/admin/useResource";
import { useTableState } from "../../../hooks/admin/useTableState";
import { PageHeader } from "./PageHeader";
import { DataTable, Column } from "./DataTable";
import { FilterBar, FilterDefinition } from "./FilterBar";
import { TranslationInput } from "./TranslationInput";
import { RowActions } from "./RowActions";
import { Button } from "../ui/Button";
import { Field, Input, Select, Textarea } from "../ui/Input";
import { Switch } from "../ui/Switch";
import { Modal, ConfirmDialog } from "../ui/Modal";
export type FieldType = 'text' | 'number' | 'textarea' | 'translated' | 'translatedArea' | 'select' | 'switch' | 'image' | 'tags' | 'url';
export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: {
    value: string;
    label: string;
  }[];
  hint?: string;
  required?: boolean;
  full?: boolean;
  group?: string;
}
export interface CrudScreenProps<T extends {
  id: string;
}> {
  title: string;
  description: string;
  endpoint: EndpointKey;
  seed: T[];
  columns: Column<T>[];
  searchFields: (item: T) => string;
  filters?: FilterDefinition[];
  filterPredicates?: Record<string, (item: T, value: string) => boolean>;
  fields: FieldDef[];
  emptyIcon?: BoxIcon;
  createLabel?: string;
  makeEmpty: () => T;
  rowLabel: (item: T) => string;
  headerExtra?: React.ReactNode;
  pageSize?: number;
  /** Renders extra content above the table, e.g. a stats strip. */
  children?: React.ReactNode;
}
type Draft = Record<string, unknown>;
export function CrudScreen<T extends {
  id: string;
}>({
  title,
  description,
  endpoint,
  seed,
  columns,
  searchFields,
  filters = [],
  filterPredicates = {},
  fields,
  createLabel = 'Add new',
  makeEmpty,
  rowLabel,
  headerExtra,
  pageSize = 8,
  children
}: CrudScreenProps<T>) {
  const resource = useResource<T>({
    endpoint,
    seed
  });
  const table = useTableState<T>({
    data: resource.items,
    searchFields,
    filters: filterPredicates,
    pageSize
  });
  const [editing, setEditing] = useState<T | null>(null);
  const [draft, setDraft] = useState<Draft>({});
  const [isNew, setIsNew] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);
  const [bulkDelete, setBulkDelete] = useState(false);
  const groups = useMemo(() => {
    const map = new Map<string, FieldDef[]>();
    fields.forEach((field) => {
      const key = field.group ?? 'Details';
      map.set(key, [...(map.get(key) ?? []), field]);
    });
    return Array.from(map.entries());
  }, [fields]);
  const openCreate = () => {
    const empty = makeEmpty();
    setEditing(empty);
    setDraft(empty as unknown as Draft);
    setIsNew(true);
  };
  const openEdit = (item: T) => {
    setEditing(item);
    setDraft({
      ...(item as unknown as Draft)
    });
    setIsNew(false);
  };
  const close = () => {
    setEditing(null);
    setDraft({});
  };
  const save = () => {
    if (!editing) return;
    if (isNew) resource.create(draft as unknown as T);else resource.update(editing.id, draft as Partial<T>);
    close();
  };
  const set = (key: string, value: unknown) => setDraft((prev) => ({
    ...prev,
    [key]: value
  }));
  const tableColumns: Column<T>[] = [...columns, {
    key: '__actions',
    header: '',
    align: 'right',
    className: 'w-12',
    render: (item) => <RowActions onEdit={() => openEdit(item)} onDelete={() => setPendingDelete(item)} />
  }];
  return <>
      <PageHeader title={title} description={description} actions={<>
            {headerExtra}
            <Button variant="primary" onClick={openCreate}>
              <PlusIcon className="h-3.5 w-3.5" />
              {createLabel}
            </Button>
          </>} />

      {children}

      <FilterBar query={table.query} onQueryChange={table.setQuery} placeholder={`Search ${title.toLowerCase()}…`} filters={filters} values={table.filterValues} onFilterChange={table.setFilter} onReset={table.resetFilters} selectedCount={table.selected.length} onClearSelection={table.clearSelection} bulkActions={<Button variant="outlineDanger" size="sm" onClick={() => setBulkDelete(true)}>
            <Trash2Icon className="h-3.5 w-3.5" />
            Delete selected
          </Button>} />

      <DataTable columns={tableColumns} items={table.pageItems} isLoading={resource.isLoading} selectable isSelected={table.isSelected} onToggleRow={table.toggleSelected} onToggleAll={table.toggleAllOnPage} page={table.page} totalPages={table.totalPages} totalItems={table.totalItems} pageSize={table.pageSize} onPageChange={table.setPage} emptyTitle={`No ${title.toLowerCase()} found`} emptyMessage="Adjust your filters, or create the first record to get started." emptyAction={<Button variant="primary" size="sm" onClick={openCreate}>
            <PlusIcon className="h-3.5 w-3.5" />
            {createLabel}
          </Button>} />

      <Modal open={Boolean(editing)} onClose={close} size="lg" title={isNew ? createLabel : `Edit ${rowLabel(editing ?? {} as T)}`} description="Changes are stored locally until the API layer is connected." footer={<>
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button variant="primary" onClick={save}>
              {isNew ? 'Create' : 'Save changes'}
            </Button>
          </>}>
        <div className="space-y-6">
          {groups.map(([groupName, groupFields]) => <fieldset key={groupName}>
              <legend className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {groupName}
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                {groupFields.map((field) => <div key={field.key} className={field.full ? 'sm:col-span-2' : undefined}>
                    <FieldControl field={field} value={draft[field.key]} onChange={set} />
                  </div>)}
              </div>
            </fieldset>)}
        </div>
      </Modal>

      <ConfirmDialog open={Boolean(pendingDelete)} onClose={() => setPendingDelete(null)} onConfirm={() => pendingDelete && resource.remove(pendingDelete.id)} title="Delete record" message={`“${pendingDelete ? rowLabel(pendingDelete) : ''}” will be permanently removed. This cannot be undone.`} />

      <ConfirmDialog open={bulkDelete} onClose={() => setBulkDelete(false)} onConfirm={() => {
      resource.removeMany(table.selected);
      table.clearSelection();
    }} title="Delete selected records" message={`${table.selected.length} records will be permanently removed. This cannot be undone.`} />
    </>;
}
function FieldControl({
  field,
  value,
  onChange




}: {field: FieldDef;value: unknown;onChange: (key: string, value: unknown) => void;}) {
  switch (field.type) {
    case 'translated':
    case 'translatedArea':
      return <TranslationInput label={field.label} required={field.required} multiline={field.type === 'translatedArea'} value={value as Translated ?? {
        en: ''
      }} onChange={(next) => onChange(field.key, next)} />;
    case 'textarea':
      return <Field label={field.label} hint={field.hint} required={field.required}>
          <Textarea value={String(value ?? '')} onChange={(e) => onChange(field.key, e.target.value)} />
        </Field>;
    case 'select':
      return <Field label={field.label} hint={field.hint} required={field.required}>
          <Select value={String(value ?? '')} onChange={(e) => onChange(field.key, e.target.value)}>
            {(field.options ?? []).map((option) => <option key={option.value} value={option.value}>
                {option.label}
              </option>)}
          </Select>
        </Field>;
    case 'switch':
      return <div className="flex h-full items-center justify-between rounded-md border border-border px-3 py-2.5">
          <span className="text-xs font-medium text-foreground">{field.label}</span>
          <Switch label={field.label} checked={Boolean(value)} onChange={(next) => onChange(field.key, next)} />
        </div>;
    case 'number':
      return <Field label={field.label} hint={field.hint} required={field.required}>
          <Input type="number" value={Number(value ?? 0)} onChange={(e) => onChange(field.key, Number(e.target.value))} />
        </Field>;
    case 'image':
      return <Field label={field.label} hint={field.hint ?? 'Paste a media library URL'}>
          <div className="flex items-center gap-2">
            {value ? <img src={String(value)} alt="" className="h-9 w-9 shrink-0 rounded-md border border-border object-cover" /> : null}
            <Input value={String(value ?? '')} placeholder="https://…" onChange={(e) => onChange(field.key, e.target.value)} />
          </div>
        </Field>;
    case 'tags':
      return <Field label={field.label} hint={field.hint ?? 'Comma separated'}>
          <Input value={Array.isArray(value) ? (value as string[]).join(', ') : String(value ?? '')} onChange={(e) => onChange(field.key, e.target.value.split(',').map((v) => v.trim()).filter(Boolean))} />
        </Field>;
    default:
      return <Field label={field.label} hint={field.hint} required={field.required}>
          <Input type={field.type === 'url' ? 'url' : 'text'} value={String(value ?? '')} onChange={(e) => onChange(field.key, e.target.value)} />
        </Field>;
  }
}
