import React, { useState } from 'react';
import { DownloadIcon, MapPinIcon, PlusIcon, UploadIcon } from 'lucide-react';
import { PageHeader } from '../../components/admin/shared/PageHeader';
import { DataTable, type Column } from '../../components/admin/shared/DataTable';
import { FilterBar } from '../../components/admin/shared/FilterBar';
import { RowActions } from '../../components/admin/shared/RowActions';
import { Card, CardBody } from '../../components/admin/ui/Card';
import { Button } from '../../components/admin/ui/Button';
import { StatusBadge } from '../../components/admin/ui/Badge';
import { Tabs } from '../../components/admin/ui/Tabs';
import { Modal } from '../../components/admin/ui/Modal';
import { Field, Textarea } from '../../components/admin/ui/Input';
import { useResource } from '../../hooks/admin/useResource';
import { useTableState } from '../../hooks/admin/useTableState';
import { cities, districts, states } from '../../data/admin/locations';
import { formatNumber } from '../../utils/admin/format';
import type { CityRecord, DistrictRecord, StateRecord } from '../../types/admin';

const stateColumns: Column<StateRecord>[] = [
{ key: 'name', header: 'State', render: (item) => <span className="text-sm font-medium">{item.name}</span> },
{ key: 'code', header: 'Code', render: (item) => <span className="font-mono text-xs">{item.code}</span> },
{ key: 'districts', header: 'Districts', align: 'right', render: (item) => <span className="text-xs">{formatNumber(item.districtCount)}</span> },
{ key: 'cities', header: 'Cities', align: 'right', render: (item) => <span className="text-xs">{formatNumber(item.cityCount)}</span> },
{ key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} /> },
{ key: 'actions', header: '', align: 'right', className: 'w-12', render: () => <RowActions onEdit={() => undefined} onDelete={() => undefined} /> }];


const districtColumns: Column<DistrictRecord>[] = [
{ key: 'name', header: 'District', render: (item) => <span className="text-sm font-medium">{item.name}</span> },
{ key: 'state', header: 'State', render: (item) => <span className="text-xs text-muted-foreground">{item.stateName}</span> },
{ key: 'cities', header: 'Cities', align: 'right', render: (item) => <span className="text-xs">{item.cityCount}</span> },
{ key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} /> },
{ key: 'actions', header: '', align: 'right', className: 'w-12', render: () => <RowActions onEdit={() => undefined} onDelete={() => undefined} /> }];


const cityColumns: Column<CityRecord>[] = [
{ key: 'name', header: 'City', render: (item) => <span className="text-sm font-medium">{item.name}</span> },
{ key: 'district', header: 'District', render: (item) => <span className="text-xs text-muted-foreground">{item.districtName}</span> },
{ key: 'state', header: 'State', render: (item) => <span className="text-xs text-muted-foreground">{item.stateName}</span> },
{ key: 'pincode', header: 'Pincode', render: (item) => <span className="font-mono text-xs">{item.pincode}</span> },
{ key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} /> },
{ key: 'actions', header: '', align: 'right', className: 'w-12', render: () => <RowActions onEdit={() => undefined} onDelete={() => undefined} /> }];


export function Locations() {
  const [tab, setTab] = useState('states');
  const [importOpen, setImportOpen] = useState(false);

  const statesResource = useResource<StateRecord>({ endpoint: 'states', seed: states });
  const districtsResource = useResource<DistrictRecord>({ endpoint: 'districts', seed: districts });
  const citiesResource = useResource<CityRecord>({ endpoint: 'cities', seed: cities });

  const stateTable = useTableState<StateRecord>({ data: statesResource.items, searchFields: (i) => `${i.name} ${i.code}` });
  const districtTable = useTableState<DistrictRecord>({ data: districtsResource.items, searchFields: (i) => `${i.name} ${i.stateName}` });
  const cityTable = useTableState<CityRecord>({ data: citiesResource.items, searchFields: (i) => `${i.name} ${i.districtName} ${i.pincode}` });

  const activeTable = tab === 'states' ? stateTable : tab === 'districts' ? districtTable : cityTable;

  return (
    <>
      <PageHeader
        title="Location Management"
        description="States, districts and cities powering dealer search and district-level availability."
        actions={
        <>
            <Button variant="secondary" onClick={() => setImportOpen(true)}>
              <UploadIcon className="h-3.5 w-3.5" />
              Import JSON
            </Button>
            <Button variant="secondary">
              <DownloadIcon className="h-3.5 w-3.5" />
              Export JSON
            </Button>
            <Button variant="primary">
              <PlusIcon className="h-3.5 w-3.5" />
              Add location
            </Button>
          </>
        } />
      

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">States</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{statesResource.items.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Districts mapped</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {formatNumber(statesResource.items.reduce((sum, s) => sum + s.districtCount, 0))}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Cities mapped</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">
            {formatNumber(statesResource.items.reduce((sum, s) => sum + s.cityCount, 0))}
          </p>
        </Card>
      </div>

      <Tabs
        idPrefix="locations"
        value={tab}
        onChange={setTab}
        items={[
        { key: 'states', label: 'States', count: statesResource.items.length },
        { key: 'districts', label: 'Districts', count: districtsResource.items.length },
        { key: 'cities', label: 'Cities', count: citiesResource.items.length }]
        } />
      

      <FilterBar
        query={activeTable.query}
        onQueryChange={activeTable.setQuery}
        placeholder={`Search ${tab}…`}
        onReset={activeTable.resetFilters} />
      

      {tab === 'states' ?
      <DataTable
        columns={stateColumns}
        items={stateTable.pageItems}
        isLoading={statesResource.isLoading}
        page={stateTable.page}
        totalPages={stateTable.totalPages}
        totalItems={stateTable.totalItems}
        pageSize={stateTable.pageSize}
        onPageChange={stateTable.setPage}
        emptyTitle="No states found"
        emptyMessage="Import a location JSON file to bootstrap the hierarchy." /> :

      null}

      {tab === 'districts' ?
      <DataTable
        columns={districtColumns}
        items={districtTable.pageItems}
        isLoading={districtsResource.isLoading}
        page={districtTable.page}
        totalPages={districtTable.totalPages}
        totalItems={districtTable.totalItems}
        pageSize={districtTable.pageSize}
        onPageChange={districtTable.setPage}
        emptyTitle="No districts found"
        emptyMessage="Select a different state or import district data." /> :

      null}

      {tab === 'cities' ?
      <DataTable
        columns={cityColumns}
        items={cityTable.pageItems}
        isLoading={citiesResource.isLoading}
        page={cityTable.page}
        totalPages={cityTable.totalPages}
        totalItems={cityTable.totalItems}
        pageSize={cityTable.pageSize}
        onPageChange={cityTable.setPage}
        emptyTitle="No cities found"
        emptyMessage="Import city data to enable pincode-level dealer search." /> :

      null}

      <Modal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        title="Import locations from JSON"
        description="Paste an array of location objects. Existing records are matched by code."
        footer={
        <>
            <Button variant="secondary" onClick={() => setImportOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setImportOpen(false)}>
              Import
            </Button>
          </>
        }>
        
        <Field label="JSON payload" hint="Maximum 5 MB">
          <Textarea
            rows={10}
            className="font-mono text-xs"
            defaultValue={'[\n  { "name": "Bihar", "code": "BR", "status": "active" }\n]'} />
          
        </Field>
      </Modal>

      <Card className="border-dashed bg-muted/40">
        <CardBody className="flex items-start gap-3">
          <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            Location data is read-heavy and rarely changes. When the API is connected, cache these three
            endpoints aggressively and invalidate only on import.
          </p>
        </CardBody>
      </Card>
    </>);

}