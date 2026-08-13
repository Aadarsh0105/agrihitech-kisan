




import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { useAsync } from '../hooks/useAsync';
import { useLanguage } from '../i18n/LanguageContext';
import { Seo } from '../components/layout/Seo';
import { ProductGrid } from '../components/products/ProductGrid';
import { ProductFilters, emptyFilters, type FilterState } from '../components/products/ProductFilters';
import { Button } from '../components/ui/Button';
import { getAllProducts } from '../services/product.service';

export function Products() {
  const { t } = useLanguage();
  const [params] = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    ...emptyFilters,
    search: params.get('search') ?? '',
    crop: params.get('crop') ?? '',
    categorySlug: params.get('category') ?? '',
    sort: params.get('sort') as FilterState['sort'] ?? ''
  });

  const query = useMemo(
    () => ({
      search: filters.search || undefined,
      categorySlug: filters.categorySlug || undefined,
      brandSlug: filters.brandSlug || undefined,
      crop: filters.crop || undefined,
      state: filters.state || undefined,
      district: filters.district || undefined,
      productType: filters.productType || undefined,
      sort: filters.sort || undefined
    }),
    [filters]
  );

  const { data, loading } = useAsync(getAllProducts, [JSON.stringify(query)]);

  return (
    <>
      <Seo title={t('nav.products')} description="Browse verified agricultural products by category, brand, crop and location." />
      <div className="border-b border-border bg-secondary/30">
        <div className="container py-8">
          <h1 className="font-display text-3xl font-extrabold text-foreground">{t('nav.products')}</h1>
          <p className="mt-1 text-muted-foreground">
            {loading ? t('common.loading') : `${data?.length ?? 0} ${t('filters.results')}`}
          </p>
        </div>
      </div>

      <div className="container grid gap-6 py-8">
        {/* desktop filters */}
        {/* <aside className="hidden lg:block">
          <div className="sticky top-32">
            <ProductFilters value={filters} onChange={setFilters} onClear={() => setFilters(emptyFilters)} />
          </div>
        </aside> */}

        {/* mobile filter trigger */}
        {/* <div className="lg:hidden">
          <Button variant="outline" className="w-full" onClick={() => setMobileOpen(true)}>
            <SlidersHorizontal className="h-4 w-4" /> {t('filters.title')}
          </Button>
        </div> */}

        <div>
          <ProductGrid products={data} loading={loading} emptyLabel={t('common.notFound')} />
        </div>
      </div>

      {/* mobile filter drawer */}
      <AnimatePresence>
        {mobileOpen &&
        <>
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-50 bg-black/50 lg:hidden" />
          
            <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 w-[86%] max-w-sm overflow-y-auto bg-background p-4 lg:hidden">
            
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold">{t('filters.title')}</h2>
                <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full border border-border">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <ProductFilters value={filters} onChange={setFilters} onClear={() => setFilters(emptyFilters)} />
              <Button className="mt-4 w-full" onClick={() => setMobileOpen(false)}>
                {t('search.button')}
              </Button>
            </motion.div>
          </>
        }
      </AnimatePresence>
    </>);

}
