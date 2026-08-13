import { useCallback, useEffect, useMemo, useState } from 'react';
import type { EndpointKey } from '../../api/admin/endpoints';

/**
 * The single swap point between hardcoded development data and the live API.
 *
 * Today  : `useResource({ endpoint: 'products', seed: products })`
 * Later  : the same hook dispatches a Redux Toolkit thunk that calls
 *          `apiClient.get(endpoints.products)` — components stay untouched
 *          because the returned contract never changes.
 */
export interface ResourceState<T> {
  items: T[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  create: (item: T) => void;
  update: (id: string, patch: Partial<T>) => void;
  remove: (id: string) => void;
  removeMany: (ids: string[]) => void;
  replaceAll: (items: T[]) => void;
}

export function useResource<T extends {id: string;}>({
  endpoint,
  seed,
  latency = 320




}: {endpoint: EndpointKey;seed: T[];latency?: number;}): ResourceState<T> {
  const [items, setItems] = useState<T[]>(seed);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    const timer = window.setTimeout(() => {
      if (!active) return;
      setItems(seed);
      setIsLoading(false);
    }, latency);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
    // `endpoint` identifies the resource; `nonce` forces a manual refetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, nonce]);

  const create = useCallback((item: T) => setItems((prev) => [item, ...prev]), []);

  const update = useCallback(
    (id: string, patch: Partial<T>) =>
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, ...patch } : item)),
    []
  );

  const remove = useCallback(
    (id: string) => setItems((prev) => prev.filter((item) => item.id !== id)),
    []
  );

  const removeMany = useCallback(
    (ids: string[]) => setItems((prev) => prev.filter((item) => !ids.includes(item.id))),
    []
  );

  const refetch = useCallback(() => setNonce((n) => n + 1), []);

  return useMemo(
    () => ({
      items,
      isLoading,
      error,
      refetch,
      create,
      update,
      remove,
      removeMany,
      replaceAll: setItems
    }),
    [items, isLoading, error, refetch, create, update, remove, removeMany]
  );
}