import type { Product } from '../../types';
import { ProductCard } from '../cards/ProductCard';

export function ProductGrid({
  products,
  loading,
}: {products: Product[] | null;loading?: boolean;emptyLabel?: string;}) {
  if (loading) {
    return (
      <div
  className="
    grid
    grid-cols-2
    gap-4
    sm:gap-5
    md:grid-cols-3
    lg:grid-cols-4
    2xl:grid-cols-5
  "
>
  {Array.from({ length: 10 }).map((_, i) => (
    <div
      key={i}
      className="
        overflow-hidden
        rounded-[28px]
        border
        border-gray-200
        bg-white
        shadow-sm
      "
    >
      <div className="aspect-square animate-pulse bg-gradient-to-br from-gray-100 to-gray-50" />

      <div className="space-y-3 p-5">

        <div className="h-3 w-24 animate-pulse rounded-full bg-gray-200" />

        <div className="h-5 w-full animate-pulse rounded bg-gray-200" />

        <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />

        <div className="h-px bg-gray-100" />

        <div className="h-6 w-28 animate-pulse rounded bg-gray-200" />

        <div className="h-11 w-full animate-pulse rounded-2xl bg-gray-200" />

      </div>

    </div>
  ))}
</div>);

  }

  if (!products || products.length === 0) {
    return (
      <div
  className="
    rounded-[32px]
    border-2
    border-dashed
    border-primary/20
    bg-gradient-to-br
    from-primary-50
    to-white
    py-24
    text-center
  "
>
  <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-4xl">
    🌾
  </div>

  <h3 className="text-xl font-bold text-gray-900">
    No Products Found
  </h3>

  <p className="mx-auto mt-3 max-w-md text-gray-500">
    We couldn't find any products matching your search. Try changing your filters or browse another category.
  </p>
</div>);

  }

  return (
    <div
  className="
    grid
    grid-cols-2
    gap-4
    sm:gap-5
    md:grid-cols-3
    lg:grid-cols-4
    xl:gap-6
    2xl:grid-cols-5
  "
>
      {products.map((p, i) =>
      <ProductCard key={p.id} product={p} index={i} />
      )}
    </div>);

}