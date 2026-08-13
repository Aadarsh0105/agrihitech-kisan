import React from 'react';
import { QuoteIcon, StarIcon } from 'lucide-react';
import { CrudScreen, type FieldDef } from '../../components/admin/shared/CrudScreen';
import type { Column } from '../../components/admin/shared/DataTable';
import { Thumb } from '../../components/admin/shared/Thumb';
import { StatusBadge } from '../../components/admin/ui/Badge';
import { testimonials } from '../../data/admin/content';
import { statusFilter, statusOptions, newId } from '../../config/admin/options';
import { t } from '../../utils/admin/i18n';
import type { Testimonial } from '../../types/admin';

const columns: Column<Testimonial>[] = [
{
  key: 'person',
  header: 'Farmer',
  render: (item) =>
  <div className="flex items-center gap-3">
        <Thumb src={item.photo} alt={item.name} rounded="full" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
          <p className="truncate text-[11px] text-muted-foreground">
            {item.designation} · {item.location}
          </p>
        </div>
      </div>

},
{
  key: 'review',
  header: 'Review',
  render: (item) =>
  <p className="line-clamp-2 max-w-md text-xs leading-relaxed text-muted-foreground">
        {t(item.review)}
      </p>

},
{
  key: 'rating',
  header: 'Rating',
  render: (item) =>
  <div className="flex items-center gap-0.5" aria-label={`${item.rating} out of 5`}>
        {Array.from({ length: 5 }).map((_, index) =>
    <StarIcon
      key={index}
      className={
      index < item.rating ? 'h-3.5 w-3.5 fill-warning text-warning' : 'h-3.5 w-3.5 text-border'
      } />

    )}
      </div>

},
{ key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} /> }];


const fields: FieldDef[] = [
{ key: 'name', label: 'Name', type: 'text', required: true, group: 'Person' },
{ key: 'designation', label: 'Designation', type: 'text', group: 'Person' },
{ key: 'location', label: 'Location', type: 'text', group: 'Person' },
{ key: 'photo', label: 'Photo', type: 'image', group: 'Person' },
{ key: 'review', label: 'Review', type: 'translatedArea', full: true, group: 'Review' },
{ key: 'rating', label: 'Rating (1–5)', type: 'number', group: 'Review' },
{ key: 'status', label: 'Status', type: 'select', options: statusOptions, group: 'Review' }];


export function Testimonials() {
  return (
    <CrudScreen<Testimonial>
      title="Testimonial Management"
      description="Farmer and dealer reviews shown in the homepage testimonial carousel."
      endpoint="testimonials"
      seed={testimonials}
      columns={columns}
      fields={fields}
      createLabel="Add testimonial"
      emptyIcon={QuoteIcon}
      searchFields={(item) => `${item.name} ${item.designation} ${item.location} ${t(item.review)}`}
      filters={[statusFilter, { key: 'rating', label: 'Rating', options: [{ value: '5', label: '5 stars' }, { value: '4', label: '4 stars' }] }]}
      filterPredicates={{
        status: (item, value) => item.status === value,
        rating: (item, value) => String(item.rating) === value
      }}
      rowLabel={(item) => item.name}
      makeEmpty={() => ({
        id: newId('tst'),
        name: '',
        designation: '',
        photo: '',
        review: { en: '' },
        rating: 5,
        location: '',
        status: 'draft'
      })} />);


}