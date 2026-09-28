import { Link, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BadgeCheck, ChevronRight, Leaf } from 'lucide-react';
import { useAsync } from '../hooks/useAsync';
import { useLanguage } from '../i18n/LanguageContext';
import { Seo } from '../components/layout/Seo';
import { getCategoryBrands, getCategoryById, getSubCategories } from '../services/category.service';

export function CategoryDetail() {
  const { slug: categoryId = '' } = useParams<{ slug: string }>();
  const [params] = useSearchParams();
  const { t } = useLanguage();
  const category = useAsync(() => getCategoryById(categoryId), [categoryId]);
  const isMedicine = /medicine/i.test(category.data?.name || '');
  const subCategoryId = params.get('subCategory') || '';
  const subCategoryName = params.get('subCategoryName') || '';
  const subCategories = useAsync(
    () => category.data && !isMedicine ? getSubCategories(categoryId) : Promise.resolve([]),
    [categoryId, category.data?.name, isMedicine],
  );
  const showBrands = isMedicine || Boolean(subCategoryId);
  const brands = useAsync(
    () => category.data && showBrands ? getCategoryBrands(categoryId, subCategoryId || undefined) : Promise.resolve([]),
    [categoryId, category.data?.name, showBrands, subCategoryId],
  );

  if (category.loading) return <div className="container py-20 text-center text-muted-foreground">{t('common.loading')}</div>;
  if (!category.data) return <div className="container py-24 text-center"><h1 className="font-display text-2xl font-bold">{t('common.notFound')}</h1><Link to="/categories" className="mt-4 inline-block text-primary hover:underline">{t('common.backHome')}</Link></div>;

  const categoryName = category.data.name;
  const rows = showBrands ? brands.data ?? [] : subCategories.data ?? [];
  const loading = showBrands ? brands.loading : subCategories.loading;

  return <>
    <Seo title={categoryName} description={`Browse ${categoryName} products from verified brands on AgriMandi.`} />
    <div className="relative h-44 w-full overflow-hidden bg-primary-600 md:h-56">
      {category.data.image ? <img src={category.data.image} alt="" className="h-full w-full object-cover" /> : null}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-primary-700/40" />
      <div className="container relative flex h-full flex-col justify-end pb-6">
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-extrabold text-white md:text-4xl">{showBrands && subCategoryName ? subCategoryName : categoryName}</motion.h1>
        <p className="text-white/80">{loading ? t('common.loading') : `${rows.length} ${showBrands ? 'brands / companies' : 'subcategories'}`}</p>
      </div>
    </div>
    <div className="container py-8">
      {showBrands && !isMedicine ? <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground"><Link to={`/categories/${categoryId}`} className="hover:text-primary">{categoryName}</Link><ChevronRight className="h-4 w-4" /><span className="font-medium text-foreground">{subCategoryName}</span></nav> : null}
      <h2 className="mb-5 font-display text-2xl font-bold">{showBrands ? 'Choose a brand or company' : 'Choose a subcategory'}</h2>
      {loading ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <div key={index} className="h-48 animate-pulse rounded-2xl bg-muted" />)}</div> : rows.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {showBrands ? (brands.data ?? []).map((brand) => <Link key={brand._id} to={`/brands/${brand._id}?categoryId=${categoryId}${subCategoryId ? `&subCategory=${subCategoryId}&subCategoryName=${encodeURIComponent(subCategoryName)}` : ''}`} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-lg"><div className="grid aspect-square place-items-center bg-muted/40 p-4">{brand.image ? <img src={brand.image} alt={brand.name} className="h-full w-full object-contain" /> : <BadgeCheck className="h-12 w-12 text-primary/50" />}</div><div className="p-4"><h3 className="line-clamp-2 font-display font-bold group-hover:text-primary">{brand.name}</h3>{brand.productCount != null ? <p className="mt-1 text-xs text-muted-foreground">{brand.productCount} products</p> : null}</div></Link>) : (subCategories.data ?? []).map((item) => <Link key={item._id} to={`/categories/${categoryId}?subCategory=${item._id}&subCategoryName=${encodeURIComponent(item.name)}`} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-lg"><div className="grid aspect-square place-items-center bg-primary/5">{item.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" /> : <Leaf className="h-12 w-12 text-primary/50" />}</div><h3 className="p-4 text-center font-display font-bold group-hover:text-primary">{item.name}</h3></Link>)}
        </div>
      ) : <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center text-muted-foreground">{showBrands ? 'No brands or companies found.' : 'No subcategories found.'}</div>}
    </div>
  </>;
}
