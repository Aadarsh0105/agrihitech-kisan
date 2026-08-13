import React from 'react';
import { ShieldCheckIcon } from 'lucide-react';
import { CrudScreen, type FieldDef } from '../../components/admin/shared/CrudScreen';
import type { Column } from '../../components/admin/shared/DataTable';
import { StatusBadge } from '../../components/admin/ui/Badge';
import { benefits } from '../../data/admin/content';
import { statusFilter, statusOptions, newId } from '../../config/admin/options';
import { t } from '../../utils/admin/i18n';
import type { Benefit } from '../../types/admin';

const columns: Column<Benefit>[] = [
{
  key: 'benefit',
  header: 'Benefit',
  render: (item) =>
  <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-subtle font-mono text-[10px] font-semibold text-primary">
          {item.icon.slice(0, 2)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{t(item.title)}</p>
          <p className="truncate text-[11px] text-muted-foreground">{t(item.description)}</p>
        </div>
      </div>

},
{ key: 'icon', header: 'Icon', render: (item) => <span className="font-mono text-xs">{item.icon}</span> },
{ key: 'order', header: 'Order', align: 'center', render: (item) => <span className="text-xs">{item.order}</span> },
{ key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} /> }];


const fields: FieldDef[] = [
{ key: 'title', label: 'Title', type: 'translated', required: true, full: true, group: 'Content' },
{ key: 'description', label: 'Description', type: 'translatedArea', full: true, group: 'Content' },
{ key: 'icon', label: 'Lucide icon name', type: 'text', group: 'Placement' },
{ key: 'order', label: 'Display order', type: 'number', group: 'Placement' },
{ key: 'status', label: 'Status', type: 'select', options: statusOptions, group: 'Placement' }];


export function Benefits() {
  return (
    <CrudScreen<Benefit>
      title="Benefits Management"
      description="“Why farmers choose us” points on the homepage benefits strip."
      endpoint="benefits"
      seed={benefits}
      columns={columns}
      fields={fields}
      createLabel="Add benefit"
      emptyIcon={ShieldCheckIcon}
      searchFields={(item) => `${t(item.title)} ${t(item.description)}`}
      filters={[statusFilter]}
      filterPredicates={{ status: (item, value) => item.status === value }}
      rowLabel={(item) => t(item.title)}
      makeEmpty={() => ({
        id: newId('bn'),
        icon: 'ShieldCheck',
        title: { en: '' },
        description: { en: '' },
        order: benefits.length + 1,
        status: 'draft'
      })} />);


}