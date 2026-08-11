import React from 'react';
import { ImageIcon } from 'lucide-react';
import { CrudScreen, type FieldDef } from '../components/shared/CrudScreen';
import type { Column } from '../components/shared/DataTable';
import { Thumb } from '../components/shared/Thumb';
import { StatusBadge } from '../components/ui/Badge';
import { banners } from '../data/content';
import { statusFilter, statusOptions, newId } from '../config/options';
import { t } from '../utils/i18n';
import type { Banner } from '../types';

const columns: Column<Banner>[] = [
{
  key: 'banner',
  header: 'Banner',
  render: (item) =>
  <div className="flex items-center gap-3">
        <Thumb src={item.desktopImage} alt={t(item.title)} size="lg" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{t(item.title)}</p>
          <p className="truncate text-[11px] text-muted-foreground">{t(item.subtitle)}</p>
        </div>
      </div>

},
{
  key: 'cta',
  header: 'Call to action',
  render: (item) =>
  <div>
        <p className="text-xs font-medium text-foreground">{t(item.buttonText)}</p>
        <p className="font-mono text-[11px] text-muted-foreground">{item.buttonUrl}</p>
      </div>

},
{ key: 'order', header: 'Order', align: 'center', render: (item) => <span className="text-xs">{item.order}</span> },
{ key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} /> }];


const fields: FieldDef[] = [
{ key: 'title', label: 'Title', type: 'translated', required: true, full: true, group: 'Content' },
{ key: 'subtitle', label: 'Subtitle', type: 'translatedArea', full: true, group: 'Content' },
{ key: 'buttonText', label: 'Button text', type: 'translated', group: 'Content' },
{ key: 'buttonUrl', label: 'Button URL', type: 'url', group: 'Content' },
{ key: 'desktopImage', label: 'Desktop image', type: 'image', hint: '1920×640 recommended', group: 'Media' },
{ key: 'mobileImage', label: 'Mobile image', type: 'image', hint: '750×900 recommended', group: 'Media' },
{ key: 'order', label: 'Display order', type: 'number', group: 'Placement' },
{ key: 'status', label: 'Status', type: 'select', options: statusOptions, group: 'Placement' }];


export function Banners() {
  return (
    <CrudScreen<Banner>
      title="Banner Management"
      description="Hero slides shown at the top of the homepage, in display order."
      endpoint="banners"
      seed={banners}
      columns={columns}
      fields={fields}
      createLabel="Add banner"
      emptyIcon={ImageIcon}
      searchFields={(item) => `${t(item.title)} ${t(item.subtitle)} ${item.buttonUrl}`}
      filters={[statusFilter]}
      filterPredicates={{ status: (item, value) => item.status === value }}
      rowLabel={(item) => t(item.title)}
      makeEmpty={() => ({
        id: newId('ban'),
        title: { en: '' },
        subtitle: { en: '' },
        desktopImage: '',
        mobileImage: '',
        buttonText: { en: '' },
        buttonUrl: '',
        order: banners.length + 1,
        status: 'draft'
      })} />);


}