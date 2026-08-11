import React from 'react';
import { FolderTreeIcon, StarIcon } from 'lucide-react';
import { CrudScreen, type FieldDef } from '../components/shared/CrudScreen';
import type { Column } from '../components/shared/DataTable';
import { Thumb } from '../components/shared/Thumb';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { categories } from '../data/catalogue';
import { statusFilter, statusOptions, newId } from '../config/options';
import { formatNumber } from '../utils/format';
import { t } from '../utils/i18n';
import type { Category } from '../types';

const columns: Column<Category>[] = [
{
  key: 'category',
  header: 'Category',
  render: (item) =>
  <div className="flex items-center gap-3">
        <Thumb src={item.image} alt={t(item.name)} />
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 truncate text-sm font-medium text-foreground">
            {t(item.name)}
            {item.featured ?
        <StarIcon className="h-3 w-3 fill-warning text-warning" aria-label="Featured" /> :
        null}
          </p>
          <p className="truncate font-mono text-[11px] text-muted-foreground">/{item.slug}</p>
        </div>
      </div>

},
{
  key: 'products',
  header: 'Products',
  align: 'right',
  render: (item) => <span className="text-xs font-medium">{formatNumber(item.productCount)}</span>
},
{
  key: 'seo',
  header: 'SEO',
  render: (item) =>
  <Badge tone={item.seo.metaDescription ? 'success' : 'warning'}>
        {item.seo.metaDescription ? 'Complete' : 'Missing meta'}
      </Badge>

},
{ key: 'order', header: 'Order', align: 'center', render: (item) => <span className="text-xs">{item.order}</span> },
{ key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} /> }];


const fields: FieldDef[] = [
{ key: 'name', label: 'Name', type: 'translated', required: true, full: true, group: 'Details' },
{ key: 'slug', label: 'Slug', type: 'text', required: true, group: 'Details' },
{ key: 'icon', label: 'Lucide icon name', type: 'text', group: 'Details' },
{ key: 'description', label: 'Description', type: 'translatedArea', full: true, group: 'Details' },
{ key: 'image', label: 'Category image', type: 'image', full: true, group: 'Media' },
{ key: 'featured', label: 'Featured on homepage', type: 'switch', group: 'Placement' },
{ key: 'order', label: 'Display order', type: 'number', group: 'Placement' },
{ key: 'status', label: 'Status', type: 'select', options: statusOptions, group: 'Placement' }];


export function Categories() {
  return (
    <CrudScreen<Category>
      title="Category Management"
      description="Top-level catalogue taxonomy powering navigation, filters and SEO landing pages."
      endpoint="categories"
      seed={categories}
      columns={columns}
      fields={fields}
      createLabel="Add category"
      emptyIcon={FolderTreeIcon}
      searchFields={(item) => `${t(item.name)} ${item.slug} ${t(item.description)}`}
      filters={[
      statusFilter,
      { key: 'featured', label: 'Featured', options: [{ value: 'yes', label: 'Featured' }, { value: 'no', label: 'Not featured' }] }]
      }
      filterPredicates={{
        status: (item, value) => item.status === value,
        featured: (item, value) => value === 'yes' ? item.featured : !item.featured
      }}
      rowLabel={(item) => t(item.name)}
      makeEmpty={() => ({
        id: newId('cat'),
        name: { en: '' },
        slug: '',
        description: { en: '' },
        image: '',
        icon: 'Sprout',
        featured: false,
        order: categories.length + 1,
        productCount: 0,
        status: 'draft',
        seo: { metaTitle: '', metaDescription: '', keywords: [], robots: 'index, follow' }
      })} />);


}