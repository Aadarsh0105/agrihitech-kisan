import React from 'react';
import { LandmarkIcon, StarIcon, ExternalLinkIcon } from 'lucide-react';
import { CrudScreen, type FieldDef } from '../../components/admin/shared/CrudScreen';
import type { Column } from '../../components/admin/shared/DataTable';
import { Badge, StatusBadge } from '../../components/admin/ui/Badge';
import { schemes } from '../../data/admin/content';
import { states } from '../../data/admin/locations';
import { statusFilter, statusOptions, newId } from '../../config/admin/options';
import { t } from '../../utils/admin/i18n';
import type { GovernmentScheme } from '../../types/admin';

const levelOptions = [
{ value: 'central', label: 'Central' },
{ value: 'state', label: 'State' }];


const columns: Column<GovernmentScheme>[] = [
{
  key: 'scheme',
  header: 'Scheme',
  render: (item) =>
  <div className="max-w-md">
        <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          {t(item.name)}
          {item.featured ?
      <StarIcon className="h-3 w-3 fill-warning text-warning" aria-label="Featured" /> :
      null}
        </p>
        <p className="truncate text-[11px] text-muted-foreground">{item.department}</p>
      </div>

},
{
  key: 'level',
  header: 'Level',
  render: (item) =>
  <Badge tone={item.level === 'central' ? 'info' : 'primary'}>
        {item.level === 'central' ? 'Central' : item.state}
      </Badge>

},
{
  key: 'eligibility',
  header: 'Eligibility',
  render: (item) =>
  <span className="text-xs text-muted-foreground">{item.eligibility.length} criteria</span>

},
{
  key: 'link',
  header: 'Apply',
  render: (item) =>
  <a
    href={item.applyLink}
    target="_blank"
    rel="noreferrer"
    className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
    
        Portal
        <ExternalLinkIcon className="h-3 w-3" />
      </a>

},
{ key: 'order', header: 'Order', align: 'center', render: (item) => <span className="text-xs">{item.order}</span> },
{ key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} /> }];


const fields: FieldDef[] = [
{ key: 'name', label: 'Scheme name', type: 'translated', required: true, full: true, group: 'Overview' },
{ key: 'department', label: 'Department', type: 'text', group: 'Overview' },
{ key: 'level', label: 'Level', type: 'select', options: levelOptions, group: 'Overview' },
{ key: 'state', label: 'State', type: 'select', options: [{ value: 'All India', label: 'All India' }, ...states.map((s) => ({ value: s.name, label: s.name }))], group: 'Overview' },
{ key: 'description', label: 'Description', type: 'translatedArea', full: true, group: 'Overview' },
{ key: 'eligibility', label: 'Eligibility criteria', type: 'tags', full: true, hint: 'Comma separated list', group: 'Details' },
{ key: 'benefits', label: 'Benefits', type: 'tags', full: true, hint: 'Comma separated list', group: 'Details' },
{ key: 'requiredDocuments', label: 'Required documents', type: 'tags', full: true, hint: 'Comma separated list', group: 'Details' },
{ key: 'officialWebsite', label: 'Official website', type: 'url', group: 'Links' },
{ key: 'applyLink', label: 'Apply link', type: 'url', group: 'Links' },
{ key: 'featured', label: 'Featured', type: 'switch', group: 'Placement' },
{ key: 'order', label: 'Display order', type: 'number', group: 'Placement' },
{ key: 'status', label: 'Status', type: 'select', options: statusOptions, group: 'Placement' }];


export function Schemes() {
  return (
    <CrudScreen<GovernmentScheme>
      title="Government Schemes"
      description="Central and state agriculture schemes with eligibility, benefits and apply links."
      endpoint="schemes"
      seed={schemes}
      columns={columns}
      fields={fields}
      createLabel="Add scheme"
      emptyIcon={LandmarkIcon}
      searchFields={(item) => `${t(item.name)} ${item.department} ${item.state}`}
      filters={[
      statusFilter,
      { key: 'level', label: 'Level', options: levelOptions },
      { key: 'state', label: 'State', options: states.map((s) => ({ value: s.name, label: s.name })) }]
      }
      filterPredicates={{
        status: (item, value) => item.status === value,
        level: (item, value) => item.level === value,
        state: (item, value) => item.state === value
      }}
      rowLabel={(item) => t(item.name)}
      makeEmpty={() => ({
        id: newId('sch'),
        name: { en: '' },
        department: '',
        level: 'central',
        state: 'All India',
        description: { en: '' },
        eligibility: [],
        benefits: [],
        requiredDocuments: [],
        officialWebsite: '',
        applyLink: '',
        featured: false,
        order: schemes.length + 1,
        status: 'draft'
      })} />);


}