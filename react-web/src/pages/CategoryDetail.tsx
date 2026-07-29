







import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { useAsync } from '../hooks/useAsync';
import { useLanguage } from '../i18n/LanguageContext';
import { Seo } from '../components/layout/Seo';
import { ProductGrid } from '../components/products/ProductGrid';
import { ProductFilters, emptyFilters, type FilterState } from '../components/products/ProductFilters';

export function CategoryDetail() {
  const { slug } = useParams<{slug: string;}>();
  const { t, tv } = useLanguage();
  const { data: category, loading } = useAsync(() => api.getCategoryBySlug(slug ?? ''), [slug]);
  const [activeSub, setActiveSub] = useState<string>('');
  const [filters, setFilters] = useState<FilterState>(emptyFilters);

  const query = useMemo(
    () => ({
      categorySlug: slug,
      search: filters.search || undefined,
      brandSlug: filters.brandSlug || undefined,
      crop: filters.crop || undefined,
      sort: filters.sort || undefined
    }),
    [slug, filters]
  );
  const { data: products, loading: pLoading } = useAsync(() => api.getProducts(query), [JSON.stringify(query)]);

  if (loading) return <div className="container py-20 text-center text-muted-foreground">{t('common.loading')}</div>;
  if (!category)
  return (
    <div className="container py-24 text-center">
        <h1 className="font-display text-2xl font-bold">{t('common.notFound')}</h1>
        <Link to="/categories" className="mt-4 inline-block text-primary hover:underline">{t('common.backHome')}</Link>
      </div>);


  return (
    <>
      <Seo title={tv(category.name, category.nameHi)} description={`Browse ${category.name} from verified brands on AgriMandi.`} />

      {/* banner */}
      <div className="relative h-44 w-full overflow-hidden bg-primary-600 md:h-56">
        {category.bannerImage && <img src={category.bannerImage} alt="" className="h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-primary-700/40" />
        <div className="container relative flex h-full flex-col justify-end pb-6">
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-extrabold text-white md:text-4xl">
            {tv(category.name, category.nameHi)}
          </motion.h1>
          <p className="text-white/80">{category.productCount.toLocaleString('en-IN')}+ {t('category.products')}</p>
        </div>
      </div>

      {/* sub categories */}
      {category.subCategories.length > 0 &&
      <div className="border-b border-border bg-secondary/30">
          <div className="container flex items-center gap-2 overflow-x-auto py-4 no-scrollbar">
            <button
            type="button"
            onClick={() => setActiveSub('')}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition ${activeSub === '' ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:text-foreground'}`}>
            
              {t('filters.all')}
            </button>
            {category.subCategories.map((sub) =>
          <button
            key={sub.id}
            type="button"
            onClick={() => setActiveSub(sub.slug)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition ${activeSub === sub.slug ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:text-foreground'}`}>
            
                {tv(sub.name, sub.nameHi)}
              </button>
          )}
          </div>
        </div>
      }

      <div className="container grid gap-6 py-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <ProductFilters value={filters} onChange={setFilters} onClear={() => setFilters(emptyFilters)} />
          </div>
        </aside>
        <ProductGrid products={products} loading={pLoading} emptyLabel={t('common.notFound')} />
      </div>
    </>);

}