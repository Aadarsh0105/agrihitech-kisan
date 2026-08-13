import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAsync } from '../hooks/useAsync';
import { useLanguage } from '../i18n/LanguageContext';
import { Seo } from '../components/layout/Seo';
import { ProductGrid } from '../components/products/ProductGrid';
import { getCategoryById } from '../services/category.service';
import { getProductsByCategory } from '../services/product.service';

export function CategoryDetail() {
  const { slug: categoryId = '' } = useParams<{ slug: string }>();
  const { t } = useLanguage();
  const category = useAsync(() => getCategoryById(categoryId), [categoryId]);
  const products = useAsync(() => getProductsByCategory(categoryId), [categoryId]);

  if (category.loading) {
    return <div className="container py-20 text-center text-muted-foreground">{t('common.loading')}</div>;
  }

  if (!category.data) {
    return (
      <div className="container py-24 text-center">
        <h1 className="font-display text-2xl font-bold">{t('common.notFound')}</h1>
        <Link to="/categories" className="mt-4 inline-block text-primary hover:underline">
          {t('common.backHome')}
        </Link>
      </div>
    );
  }

  const categoryName = category.data.name;

  return (
    <>
      <Seo title={categoryName} description={`Browse ${categoryName} products from verified brands on AgriMandi.`} />

      <div className="relative h-44 w-full overflow-hidden bg-primary-600 md:h-56">
        {category.data.image ? (
          <img src={category.data.image} alt="" className="h-full w-full object-cover" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-primary-700/40" />
        <div className="container relative flex h-full flex-col justify-end pb-6">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl font-extrabold text-white md:text-4xl"
          >
            {categoryName}
          </motion.h1>
          <p className="text-white/80">
            {products.loading ? t('common.loading') : `${products.data?.length ?? 0} ${t('category.products')}`}
          </p>
        </div>
      </div>

      <div className="container py-8">
        <ProductGrid products={products.data} loading={products.loading} emptyLabel={t('common.notFound')} />
      </div>
    </>
  );
}
