import { useLanguage } from '../i18n/LanguageContext';
import { Seo } from '../components/layout/Seo';
import { CategoryCard } from '../components/cards/CategoryCard';
import { useAsync } from '../hooks/useAsync';
import { getPublicCategories } from '../services/category.service';

export function Categories() {
  const { t } = useLanguage();
  const categories = useAsync(getPublicCategories, []);
  return (
    <>
      <Seo title={t('nav.categories')} description="Browse all agricultural input categories on AgriMandi." />
      <div className="border-b border-border bg-secondary/30">
        <div className="container py-8">
          <h1 className="font-display text-3xl font-extrabold text-foreground">{t('section.popularCategories')}</h1>
          <p className="mt-1 text-muted-foreground">{t('section.popularCategoriesSub')}</p>
        </div>
      </div>
      <div className="container py-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {(categories.data ?? []).map((c, i) =>
          <CategoryCard key={c.id} category={c} index={i} />
          )}
        </div>
      </div>
    </>);

}
