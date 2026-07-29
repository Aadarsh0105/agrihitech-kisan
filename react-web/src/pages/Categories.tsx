





import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { categories } from '../data/mockData';
import { Seo } from '../components/layout/Seo';
import { CategoryCard } from '../components/cards/CategoryCard';

export function Categories() {
  const { t } = useLanguage();
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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((c, i) =>
          <CategoryCard key={c.id} category={c} index={i} />
          )}
        </div>
      </div>
    </>);

}