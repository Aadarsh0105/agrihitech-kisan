import React from 'react';
import { SlidersHorizontalIcon } from 'lucide-react';
import { CrudScreen, type FieldDef } from '../components/shared/CrudScreen';
import type { Column } from '../components/shared/DataTable';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { productAttributes, categories } from '../data/catalogue';
import { statusFilter, statusOptions, newId } from '../config/options';
import { t } from '../utils/i18n';
import type { ProductAttribute } from '../types';

const inputTypeOptions = [
{ value: 'text', label: 'Text' },
{ value: 'number', label: 'Number' },
{ value: 'select', label: 'Single select' },
{ value: 'multiselect', label: 'Multi select' },
{ value: 'boolean', label: 'Yes / No' }];


const columns: Column<ProductAttribute>[] = [
{
  key: 'name',
  header: 'Attribute',
  render: (item) =>
  <div>
        <p className="text-sm font-medium text-foreground">
          {item.name}
          {item.unit ? <span className="text-muted-foreground"> ({item.unit})</span> : null}
        </p>
        <p className="font-mono text-[11px] text-muted-foreground">{item.code}</p>
      </div>

},
{
  key: 'type',
  header: 'Input type',
  render: (item) => <Badge tone="info">{item.inputType}</Badge>
},
{
  key: 'options',
  header: 'Options',
  render: (item) =>
  item.options.length ?
  <span className="text-xs text-muted-foreground">
          {item.options.slice(0, 3).join(', ')}
          {item.options.length > 3 ? ` +${item.options.length - 3}` : ''}
        </span> :

  <span className="text-xs text-muted-foreground">—</span>

},
{
  key: 'appliesTo',
  header: 'Applies to',
  render: (item) =>
  <div className="flex flex-wrap gap-1">
        {item.appliesTo.map((scope) =>
    <Badge key={scope}>{scope}</Badge>
    )}
      </div>

},
{
  key: 'required',
  header: 'Required',
  align: 'center',
  render: (item) => item.required ? <Badge tone="warning">Required</Badge> : <span className="text-xs text-muted-foreground">Optional</span>
},
{ key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} /> }];


const fields: FieldDef[] = [
{ key: 'name', label: 'Attribute name', type: 'text', required: true, group: 'Definition' },
{ key: 'code', label: 'Field code', type: 'text', hint: 'snake_case key sent to the API', required: true, group: 'Definition' },
{ key: 'inputType', label: 'Input type', type: 'select', options: inputTypeOptions, group: 'Definition' },
{ key: 'unit', label: 'Unit', type: 'text', hint: 'e.g. kg, HP, litres', group: 'Definition' },
{ key: 'options', label: 'Options', type: 'tags', hint: 'Comma separated, for select types', full: true, group: 'Definition' },
{ key: 'appliesTo', label: 'Applies to categories', type: 'tags', full: true, group: 'Scope' },
{ key: 'required', label: 'Required on product form', type: 'switch', group: 'Scope' },
{ key: 'order', label: 'Display order', type: 'number', group: 'Scope' },
{ key: 'status', label: 'Status', type: 'select', options: statusOptions, group: 'Scope' }];


export function Attributes() {
  return (
    <CrudScreen<ProductAttribute>
      title="Product Attributes"
      description="Dynamic specification fields rendered on the product form per category."
      endpoint="productAttributes"
      seed={productAttributes}
      columns={columns}
      fields={fields}
      createLabel="Add attribute"
      emptyIcon={SlidersHorizontalIcon}
      searchFields={(item) => `${item.name} ${item.code} ${item.appliesTo.join(' ')}`}
      filters={[
      statusFilter,
      { key: 'inputType', label: 'Type', options: inputTypeOptions },
      { key: 'scope', label: 'Category', options: categories.map((c) => ({ value: t(c.name), label: t(c.name) })) }]
      }
      filterPredicates={{
        status: (item, value) => item.status === value,
        inputType: (item, value) => item.inputType === value,
        scope: (item, value) => item.appliesTo.includes(value)
      }}
      rowLabel={(item) => item.name}
      makeEmpty={() => ({
        id: newId('atr'),
        name: '',
        code: '',
        inputType: 'text',
        unit: '',
        options: [],
        appliesTo: [],
        required: false,
        order: productAttributes.length + 1,
        status: 'active'
      })}>
      
      <Card className="border-dashed bg-muted/40 p-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Attributes are schema-driven. Adding a new attribute here makes it available on the product
          form for every category listed in <span className="font-medium text-foreground">Applies to</span> —
          no code change or deployment required.
        </p>
      </Card>
    </CrudScreen>);

}