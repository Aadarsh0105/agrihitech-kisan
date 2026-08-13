import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BanIcon, CheckCircle2Icon, StoreIcon } from 'lucide-react';
import { PageHeader } from '../../components/admin/shared/PageHeader';
import { DataTable, type Column } from '../../components/admin/shared/DataTable';
import { FilterBar } from '../../components/admin/shared/FilterBar';
import { RowActions } from '../../components/admin/shared/RowActions';
import { Thumb } from '../../components/admin/shared/Thumb';
import { Card } from '../../components/admin/ui/Card';
import { Button } from '../../components/admin/ui/Button';
import { Badge, StatusBadge } from '../../components/admin/ui/Badge';
import { ConfirmDialog } from '../../components/admin/ui/Modal';
import { useResource } from '../../hooks/admin/useResource';
import { useTableState } from '../../hooks/admin/useTableState';
import { dealers } from '../../data/admin/dealers';
import { states } from '../../data/admin/locations';
import { dealerStatusOptions } from '../../config/admin/options';
import { formatDate, formatNumber } from '../../utils/admin/format';
import type { Dealer } from '../../types/admin';

export function Dealers() {
  const navigate = useNavigate();
  const resource = useResource<Dealer>({ endpoint: 'dealers', seed: dealers });
  const [pendingSuspend, setPendingSuspend] = useState<Dealer | null>(null);

  const table = useTableState<Dealer>({
    data: resource.items,
    pageSize: 8,
    searchFields: (item) =>
    `${item.businessName} ${item.ownerName} ${item.city} ${item.state} ${item.gstNumber} ${item.phone}`,
    filters: {
      status: (item, value) => item.status === value,
      state: (item, value) => item.state === value,
      verified: (item, value) => value === 'yes' ? item.verified : !item.verified
    }
  });

  const counts = {
    approved: resource.items.filter((d) => d.status === 'approved').length,
    suspended: resource.items.filter((d) => d.status === 'suspended').length,
    rejected: resource.items.filter((d) => d.status === 'rejected').length
  };

  const columns: Column<Dealer>[] = [
  {
    key: 'dealer',
    header: 'Dealer',
    render: (item) =>
    <div className="flex items-center gap-3">
          <Thumb src={item.logo} alt={item.businessName} size="lg" />
          <div className="min-w-0 max-w-xs">
            <Link
          to={`/dealers/${item.id}`}
          className="flex items-center gap-1.5 truncate text-sm font-medium text-foreground hover:text-primary">
          
              {item.businessName}
              {item.verified ?
          <CheckCircle2Icon className="h-3.5 w-3.5 shrink-0 text-info" aria-label="Verified" /> :
          null}
            </Link>
            <p className="truncate text-[11px] text-muted-foreground">{item.ownerName}</p>
          </div>
        </div>

  },
  {
    key: 'location',
    header: 'Location',
    render: (item) =>
    <div>
          <p className="text-xs font-medium text-foreground">{item.city}</p>
          <p className="text-[11px] text-muted-foreground">
            {item.district}, {item.state}
          </p>
        </div>

  },
  {
    key: 'contact',
    header: 'Contact',
    render: (item) =>
    <div>
          <p className="text-xs text-foreground">{item.phone}</p>
          <p className="truncate text-[11px] text-muted-foreground">{item.email}</p>
        </div>

  },
  {
    key: 'categories',
    header: 'Deals in',
    render: (item) =>
    <div className="flex flex-wrap gap-1">
          {item.categories.map((category) =>
      <Badge key={category}>{category}</Badge>
      )}
        </div>

  },
  {
    key: 'products',
    header: 'Products',
    align: 'right',
    render: (item) => <span className="text-xs font-medium">{formatNumber(item.productCount)}</span>
  },
  {
    key: 'joined',
    header: 'Joined',
    render: (item) => <span className="text-xs text-muted-foreground">{formatDate(item.appliedAt)}</span>
  },
  { key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} /> },
  {
    key: 'actions',
    header: '',
    align: 'right',
    className: 'w-12',
    render: (item) =>
    <RowActions
      onView={() => navigate(`/dealers/${item.id}`)}
      extra={[
      item.status === 'suspended' ?
      {
        label: 'Reinstate dealer',
        icon: <CheckCircle2Icon className="h-3.5 w-3.5" />,
        onClick: () => resource.update(item.id, { status: 'approved' })
      } :
      {
        label: 'Suspend dealer',
        icon: <BanIcon className="h-3.5 w-3.5" />,
        danger: true,
        onClick: () => setPendingSuspend(item)
      }]
      } />


  }];


  return (
    <>
      <PageHeader
        title="Dealer Management"
        description="Verified retail partners listed on the storefront dealer directory."
        actions={
        <Link to="/dealer-requests">
            <Button variant="primary">Review pending requests</Button>
          </Link>
        } />
      

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Total dealers</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{resource.items.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Approved</p>
          <p className="mt-1 text-2xl font-semibold text-success">{counts.approved}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Suspended</p>
          <p className="mt-1 text-2xl font-semibold text-danger">{counts.suspended}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Rejected</p>
          <p className="mt-1 text-2xl font-semibold text-muted-foreground">{counts.rejected}</p>
        </Card>
      </div>

      <FilterBar
        query={table.query}
        onQueryChange={table.setQuery}
        placeholder="Search by business, owner, GST or city…"
        filters={[
        { key: 'status', label: 'Status', options: dealerStatusOptions },
        { key: 'state', label: 'State', options: states.map((s) => ({ value: s.name, label: s.name })) },
        { key: 'verified', label: 'Verification', options: [{ value: 'yes', label: 'Verified' }, { value: 'no', label: 'Unverified' }] }]
        }
        values={table.filterValues}
        onFilterChange={table.setFilter}
        onReset={table.resetFilters} />
      

      <DataTable
        columns={columns}
        items={table.pageItems}
        isLoading={resource.isLoading}
        page={table.page}
        totalPages={table.totalPages}
        totalItems={table.totalItems}
        pageSize={table.pageSize}
        onPageChange={table.setPage}
        emptyTitle="No dealers found"
        emptyMessage="Try a different state or clear the filters."
        emptyAction={
        <Link to="/dealer-requests">
            <Button variant="primary" size="sm">
              <StoreIcon className="h-3.5 w-3.5" />
              Review requests
            </Button>
          </Link>
        } />
      

      <ConfirmDialog
        open={Boolean(pendingSuspend)}
        onClose={() => setPendingSuspend(null)}
        onConfirm={() => pendingSuspend && resource.update(pendingSuspend.id, { status: 'suspended' })}
        title="Suspend dealer"
        confirmLabel="Suspend"
        message={`${pendingSuspend?.businessName ?? ''} will be hidden from the storefront directory until reinstated.`} />
      
    </>);

}