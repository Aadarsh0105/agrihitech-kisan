import React from 'react';
import { BadgeCheckIcon, StarIcon } from 'lucide-react';
import { CrudScreen, type FieldDef } from '../components/shared/CrudScreen';
import type { Column } from '../components/shared/DataTable';
import { Thumb } from '../components/shared/Thumb';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { brands } from '../data/catalogue';
import { statusFilter, statusOptions, newId } from '../config/options';
import { formatNumber } from '../utils/format';
import type { Brand } from '../types';

const columns: Column<Brand>[] = [
{
  key: 'brand',
  header: 'Brand',
  render: (item) =>
  <div className="flex items-center gap-3">
        <Thumb src={item.logo} alt={item.name} />
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 truncate text-sm font-medium text-foreground">
            {item.name}
            {item.featured ?
        <StarIcon className="h-3 w-3 fill-warning text-warning" aria-label="Featured" /> :
        null}
          </p>
          <p className="truncate font-mono text-[11px] text-muted-foreground">/{item.slug}</p>
        </div>
      </div>

},
{
  key: 'verified',
  header: 'Verification',
  render: (item) =>
  item.verified ? <Badge tone="info">Verified</Badge> : <Badge tone="neutral">Unverified</Badge>
},
{
  key: 'website',
  header: 'Website',
  render: (item) =>
  <a
    href={item.website}
    target="_blank"
    rel="noreferrer"
    className="truncate text-xs text-primary hover:underline">
    
        {item.website.replace('https://', '')}
      </a>

},
{
  key: 'products',
  header: 'Products',
  align: 'right',
  render: (item) => <span className="text-xs font-medium">{formatNumber(item.productCount)}</span>
},
{ key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} /> }];


const fields: FieldDef[] = [
{ key: 'name', label: 'Brand name', type: 'text', required: true, group: 'Details' },
{ key: 'slug', label: 'Slug', type: 'text', required: true, group: 'Details' },
{ key: 'description', label: 'Description', type: 'translatedArea', full: true, group: 'Details' },
{ key: 'website', label: 'Website', type: 'url', group: 'Details' },
{ key: 'logo', label: 'Logo', type: 'image', group: 'Media' },
{ key: 'banner', label: 'Banner', type: 'image', group: 'Media' },
{ key: 'verified', label: 'Verified brand', type: 'switch', group: 'Placement' },
{ key: 'featured', label: 'Featured on homepage', type: 'switch', group: 'Placement' },
{ key: 'status', label: 'Status', type: 'select', options: statusOptions, group: 'Placement' }];


export function Brands() {
  return (
    <CrudScreen<Brand>
      title="Brand Management"
      description="Manufacturer profiles displayed in the trusted brands strip and product pages."
      endpoint="brands"
      seed={brands}
      columns={columns}
      fields={fields}
      createLabel="Add brand"
      emptyIcon={BadgeCheckIcon}
      searchFields={(item) => `${item.name} ${item.slug} ${item.website}`}
      filters={[
      statusFilter,
      { key: 'verified', label: 'Verification', options: [{ value: 'yes', label: 'Verified' }, { value: 'no', label: 'Unverified' }] }]
      }
      filterPredicates={{
        status: (item, value) => item.status === value,
        verified: (item, value) => value === 'yes' ? item.verified : !item.verified
      }}
      rowLabel={(item) => item.name}
      makeEmpty={() => ({
        id: newId('brd'),
        name: '',
        slug: '',
        logo: '',
        banner: '',
        description: { en: '' },
        website: '',
        verified: false,
        featured: false,
        productCount: 0,
        status: 'draft',
        seo: { metaTitle: '', metaDescription: '', keywords: [], robots: 'index, follow' }
      })} />);


}