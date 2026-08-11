import React from 'react';
import { SparklesIcon } from 'lucide-react';
import { CrudScreen, type FieldDef } from '../components/shared/CrudScreen';
import type { Column } from '../components/shared/DataTable';
import { StatusBadge } from '../components/ui/Badge';
import { platformFeatures } from '../data/content';
import { statusFilter, statusOptions, newId } from '../config/options';
import { t } from '../utils/i18n';
import type { PlatformFeature } from '../types';

const columns: Column<PlatformFeature>[] = [
{
  key: 'feature',
  header: 'Feature card',
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
{ key: 'route', header: 'Route', render: (item) => <span className="font-mono text-xs text-muted-foreground">{item.route}</span> },
{ key: 'order', header: 'Order', align: 'center', render: (item) => <span className="text-xs">{item.order}</span> },
{ key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} /> }];


const fields: FieldDef[] = [
{ key: 'title', label: 'Title', type: 'translated', required: true, full: true, group: 'Content' },
{ key: 'description', label: 'Description', type: 'translatedArea', full: true, group: 'Content' },
{ key: 'icon', label: 'Lucide icon name', type: 'text', hint: 'e.g. Search, Store, LineChart', group: 'Behaviour' },
{ key: 'route', label: 'Route', type: 'text', hint: 'Storefront path the card links to', group: 'Behaviour' },
{ key: 'order', label: 'Display order', type: 'number', group: 'Behaviour' },
{ key: 'status', label: 'Status', type: 'select', options: statusOptions, group: 'Behaviour' }];


export function PlatformFeatures() {
  return (
    <CrudScreen<PlatformFeature>
      title="Platform Features"
      description="Feature cards rendered directly below the homepage hero."
      endpoint="platformFeatures"
      seed={platformFeatures}
      columns={columns}
      fields={fields}
      createLabel="Add feature"
      emptyIcon={SparklesIcon}
      searchFields={(item) => `${t(item.title)} ${t(item.description)} ${item.route}`}
      filters={[statusFilter]}
      filterPredicates={{ status: (item, value) => item.status === value }}
      rowLabel={(item) => t(item.title)}
      makeEmpty={() => ({
        id: newId('pf'),
        icon: 'Sparkles',
        title: { en: '' },
        description: { en: '' },
        route: '/',
        order: platformFeatures.length + 1,
        status: 'draft'
      })} />);


}