import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { TableSkeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  align?: 'left' | 'right' | 'center';
  render: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  items: T[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
  selectable?: boolean;
  isSelected?: (id: string) => boolean;
  onToggleRow?: (id: string) => void;
  onToggleAll?: () => void;
  page?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  rowKey?: (item: T) => string;
}

export function DataTable<T extends {id: string;}>({
  columns,
  items,
  isLoading = false,
  emptyTitle = 'Nothing here yet',
  emptyMessage = 'Try adjusting your filters, or create the first record.',
  emptyAction,
  selectable = false,
  isSelected,
  onToggleRow,
  onToggleAll,
  page = 1,
  totalPages = 1,
  totalItems = items.length,
  pageSize = 10,
  onPageChange
}: DataTableProps<T>) {
  const allOnPageSelected =
  selectable && items.length > 0 && isSelected ? items.every((item) => isSelected(item.id)) : false;

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <TableSkeleton columns={Math.min(columns.length, 6)} />
      </div>);

  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface">
        <EmptyState title={emptyTitle} message={emptyMessage} action={emptyAction} />
      </div>);

  }

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/60">
              {selectable ?
              <th scope="col" className="w-10 px-4 py-2.5">
                  <input
                  type="checkbox"
                  aria-label="Select all rows on this page"
                  checked={allOnPageSelected}
                  onChange={() => onToggleAll?.()}
                  className="h-3.5 w-3.5 rounded border-input text-primary focus:ring-ring" />
                
                </th> :
              null}
              {columns.map((column) =>
              <th
                key={column.key}
                scope="col"
                className={cn(
                  'whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground',
                  column.align === 'right' && 'text-right',
                  column.align === 'center' && 'text-center',
                  !column.align && 'text-left',
                  column.className
                )}>
                
                  {column.header}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item, index) =>
            <motion.tr
              key={item.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, delay: Math.min(index * 0.015, 0.15) }}
              className={cn(
                'transition-colors hover:bg-muted/50',
                selectable && isSelected?.(item.id) && 'bg-primary-subtle/50'
              )}>
              
                {selectable ?
              <td className="px-4 py-3">
                    <input
                  type="checkbox"
                  aria-label={`Select row ${item.id}`}
                  checked={isSelected?.(item.id) ?? false}
                  onChange={() => onToggleRow?.(item.id)}
                  className="h-3.5 w-3.5 rounded border-input text-primary focus:ring-ring" />
                
                  </td> :
              null}
                {columns.map((column) =>
              <td
                key={column.key}
                className={cn(
                  'px-4 py-3 align-middle text-foreground',
                  column.align === 'right' && 'text-right',
                  column.align === 'center' && 'text-center',
                  column.className
                )}>
                
                    {column.render(item)}
                  </td>
              )}
              </motion.tr>
            )}
          </tbody>
        </table>
      </div>

      {onPageChange ?
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-medium text-foreground">{from}</span>–
            <span className="font-medium text-foreground">{to}</span> of{' '}
            <span className="font-medium text-foreground">{totalItems}</span>
          </p>
          <div className="flex items-center gap-1.5">
            <Button
            variant="secondary"
            size="iconSm"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}>
            
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <span className="px-2 text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
            variant="secondary"
            size="iconSm"
            aria-label="Next page"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}>
            
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div> :
      null}
    </div>);

}