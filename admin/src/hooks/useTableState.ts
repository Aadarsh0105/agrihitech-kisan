import { useMemo, useState } from 'react';

export interface TableStateOptions<T> {
  data: T[];
  searchFields: (item: T) => string;
  pageSize?: number;
  filters?: Record<string, (item: T, value: string) => boolean>;
}

export interface TableState<T> {
  query: string;
  setQuery: (value: string) => void;
  filterValues: Record<string, string>;
  setFilter: (key: string, value: string) => void;
  resetFilters: () => void;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  pageItems: T[];
  filtered: T[];
  selected: string[];
  toggleSelected: (id: string) => void;
  toggleAllOnPage: () => void;
  clearSelection: () => void;
  isSelected: (id: string) => boolean;
}

export function useTableState<T extends {id: string;}>({
  data,
  searchFields,
  pageSize = 10,
  filters = {}
}: TableStateOptions<T>): TableState<T> {
  const [query, setQueryValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((item) => {
      if (q && !searchFields(item).toLowerCase().includes(q)) return false;
      return Object.entries(filterValues).every(([key, value]) => {
        if (!value || value === 'all') return true;
        const predicate = filters[key];
        return predicate ? predicate(item, value) : true;
      });
    });
  }, [data, query, filterValues, filters, searchFields]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return {
    query,
    setQuery: (value) => {
      setQueryValue(value);
      setPage(1);
    },
    filterValues,
    setFilter: (key, value) => {
      setFilterValues((prev) => ({ ...prev, [key]: value }));
      setPage(1);
    },
    resetFilters: () => {
      setFilterValues({});
      setQueryValue('');
      setPage(1);
    },
    page: safePage,
    setPage,
    pageSize,
    totalItems,
    totalPages,
    pageItems,
    filtered,
    selected,
    toggleSelected: (id) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]),
    toggleAllOnPage: () =>
    setSelected((prev) => {
      const ids = pageItems.map((item) => item.id);
      const allSelected = ids.every((id) => prev.includes(id));
      return allSelected ? prev.filter((id) => !ids.includes(id)) : Array.from(new Set([...prev, ...ids]));
    }),
    clearSelection: () => setSelected([]),
    isSelected: (id) => selected.includes(id)
  };
}