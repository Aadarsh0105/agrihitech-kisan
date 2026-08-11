import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FlameIcon, PackageIcon, PlusIcon, StarIcon, Trash2Icon, UploadIcon } from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { DataTable, type Column } from '../components/shared/DataTable';
import { FilterBar } from '../components/shared/FilterBar';
import { RowActions } from '../components/shared/RowActions';
import { Thumb } from '../components/shared/Thumb';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/Badge';
import { ConfirmDialog } from '../components/ui/Modal';
import { useResource } from '../hooks/useResource';
import { useTableState } from '../hooks/useTableState';
import { brands, categories, products } from '../data/catalogue';
import { availabilityOptions, statusOptions } from '../config/options';
import { formatCurrency, formatDate } from '../utils/format';
import { t } from '../utils/i18n';
import type { Product } from '../types';

export function Products() {
  const navigate = useNavigate();
  const resource = useResource<Product>({ endpoint: 'products', seed: products });
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);
  const [bulkDelete, setBulkDelete] = useState(false);

  const table = useTableState<Product>({
    data: resource.items,
    pageSize: 8,
    searchFields: (item) =>
    `${t(item.name)} ${item.slug} ${item.brandName} ${item.categoryName} ${item.subCategoryName}`,
    filters: {
      status: (item, value) => item.status === value,
      category: (item, value) => item.categoryId === value,
      brand: (item, value) => item.brandId === value,
      availability: (item, value) => item.availability === value
    }
  });

  const columns: Column<Product>[] = [
  {
    key: 'product',
    header: 'Product',
    render: (item) =>
    <div className="flex items-center gap-3">
          <Thumb src={item.image} alt={t(item.name)} size="lg" />
          <div className="min-w-0 max-w-xs">
            <Link
          to={`/products/${item.id}`}
          className="flex items-center gap-1.5 truncate text-sm font-medium text-foreground hover:text-primary">
          
              {t(item.name)}
              {item.featured ?
          <StarIcon className="h-3 w-3 shrink-0 fill-warning text-warning" aria-label="Featured" /> :
          null}
              {item.trending ?
          <FlameIcon className="h-3 w-3 shrink-0 text-danger" aria-label="Trending" /> :
          null}
            </Link>
            <p className="truncate font-mono text-[11px] text-muted-foreground">/{item.slug}</p>
          </div>
        </div>

  },
  {
    key: 'taxonomy',
    header: 'Category',
    render: (item) =>
    <div>
          <p className="text-xs font-medium text-foreground">{item.categoryName}</p>
          <p className="text-[11px] text-muted-foreground">{item.subCategoryName}</p>
        </div>

  },
  { key: 'brand', header: 'Brand', render: (item) => <span className="text-xs">{item.brandName}</span> },
  {
    key: 'price',
    header: 'Price',
    align: 'right',
    render: (item) =>
    <div>
          <p className="text-xs font-medium text-foreground">{formatCurrency(item.price)}</p>
          <p className="text-[11px] text-muted-foreground line-through">{formatCurrency(item.mrp)}</p>
        </div>

  },
  {
    key: 'availability',
    header: 'Availability',
    render: (item) => <StatusBadge status={item.availability} />
  },
  {
    key: 'updated',
    header: 'Updated',
    render: (item) => <span className="text-xs text-muted-foreground">{formatDate(item.updatedAt)}</span>
  },
  { key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} /> },
  {
    key: 'actions',
    header: '',
    align: 'right',
    className: 'w-12',
    render: (item) =>
    <RowActions
      onView={() => navigate(`/products/${item.id}`)}
      onEdit={() => navigate(`/products/${item.id}`)}
      onDelete={() => setPendingDelete(item)}
      extra={[
      {
        label: item.featured ? 'Remove from featured' : 'Mark as featured',
        icon: <StarIcon className="h-3.5 w-3.5" />,
        onClick: () => resource.update(item.id, { featured: !item.featured })
      }]
      } />


  }];


  return (
    <>
      <PageHeader
        title="Product Management"
        description="The full catalogue — pricing, availability, media and dynamic specifications."
        actions={
        <>
            <Button variant="secondary">
              <UploadIcon className="h-3.5 w-3.5" />
              Bulk import
            </Button>
            <Link to="/products/new">
              <Button variant="primary">
                <PlusIcon className="h-3.5 w-3.5" />
                Add product
              </Button>
            </Link>
          </>
        } />
      

      <FilterBar
        query={table.query}
        onQueryChange={table.setQuery}
        placeholder="Search products, slugs or brands…"
        filters={[
        { key: 'category', label: 'Category', options: categories.map((c) => ({ value: c.id, label: t(c.name) })) },
        { key: 'brand', label: 'Brand', options: brands.map((b) => ({ value: b.id, label: b.name })) },
        { key: 'availability', label: 'Availability', options: availabilityOptions },
        { key: 'status', label: 'Status', options: statusOptions }]
        }
        values={table.filterValues}
        onFilterChange={table.setFilter}
        onReset={table.resetFilters}
        selectedCount={table.selected.length}
        onClearSelection={table.clearSelection}
        bulkActions={
        <>
            <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              table.selected.forEach((id) => resource.update(id, { status: 'active' }));
              table.clearSelection();
            }}>
            
              Publish
            </Button>
            <Button variant="outlineDanger" size="sm" onClick={() => setBulkDelete(true)}>
              <Trash2Icon className="h-3.5 w-3.5" />
              Delete
            </Button>
          </>
        } />
      

      <DataTable
        columns={columns}
        items={table.pageItems}
        isLoading={resource.isLoading}
        selectable
        isSelected={table.isSelected}
        onToggleRow={table.toggleSelected}
        onToggleAll={table.toggleAllOnPage}
        page={table.page}
        totalPages={table.totalPages}
        totalItems={table.totalItems}
        pageSize={table.pageSize}
        onPageChange={table.setPage}
        emptyTitle="No products match these filters"
        emptyMessage="Try clearing filters, or add the first product to this catalogue."
        emptyAction={
        <Link to="/products/new">
            <Button variant="primary" size="sm">
              <PackageIcon className="h-3.5 w-3.5" />
              Add product
            </Button>
          </Link>
        } />
      

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && resource.remove(pendingDelete.id)}
        title="Delete product"
        message={`“${pendingDelete ? t(pendingDelete.name) : ''}” will be removed from the catalogue and storefront.`} />
      
      <ConfirmDialog
        open={bulkDelete}
        onClose={() => setBulkDelete(false)}
        onConfirm={() => {
          resource.removeMany(table.selected);
          table.clearSelection();
        }}
        title="Delete selected products"
        message={`${table.selected.length} products will be permanently removed.`} />
      
    </>);

}