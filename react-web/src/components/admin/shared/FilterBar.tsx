import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchIcon, XIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';

export interface FilterDefinition {
  key: string;
  label: string;
  options: {value: string;label: string;}[];
}

export function FilterBar({
  query,
  onQueryChange,
  placeholder = 'Search…',
  filters = [],
  values = {},
  onFilterChange,
  onReset,
  selectedCount = 0,
  bulkActions,
  onClearSelection,
  trailing












}: {query: string;onQueryChange: (value: string) => void;placeholder?: string;filters?: FilterDefinition[];values?: Record<string, string>;onFilterChange?: (key: string, value: string) => void;onReset?: () => void;selectedCount?: number;bulkActions?: React.ReactNode;onClearSelection?: () => void;trailing?: React.ReactNode;}) {
  const hasActiveFilters =
  query.length > 0 || Object.values(values).some((v) => v && v !== 'all');

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <SearchIcon
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true" />
          
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
            className="pl-9" />
          
        </div>
        {filters.map((filter) =>
        <Select
          key={filter.key}
          aria-label={filter.label}
          value={values[filter.key] ?? 'all'}
          onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
          className="w-auto min-w-[150px]">
          
            <option value="all">{filter.label}: All</option>
            {filter.options.map((option) =>
          <option key={option.value} value={option.value}>
                {option.label}
              </option>
          )}
          </Select>
        )}
        {hasActiveFilters && onReset ?
        <Button variant="ghost" size="md" onClick={onReset}>
            <XIcon className="h-3.5 w-3.5" />
            Clear
          </Button> :
        null}
        {trailing ? <div className="ml-auto flex items-center gap-2">{trailing}</div> : null}
      </div>

      <AnimatePresence>
        {selectedCount > 0 ?
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.18 }}
          className="overflow-hidden">
          
            <div className="flex flex-wrap items-center gap-2 rounded-md border border-primary/30 bg-primary-subtle px-3 py-2">
              <span className="text-xs font-medium text-primary">
                {selectedCount} selected
              </span>
              <div className="ml-auto flex items-center gap-2">
                {bulkActions}
                <Button variant="ghost" size="sm" onClick={onClearSelection}>
                  Clear
                </Button>
              </div>
            </div>
          </motion.div> :
        null}
      </AnimatePresence>
    </div>);

}