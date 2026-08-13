



import { useAsync } from '../hooks/useAsync';
import { useLanguage } from '../i18n/LanguageContext';
import { Seo } from '../components/layout/Seo';
import { BrandCard } from '../components/cards/BrandCard';
import { getPublicBrands } from '../services/brand.service';

export function Brands() {
  const { t } = useLanguage();
  const { data, loading } = useAsync(getPublicBrands, []);

  return (
    <>
      <Seo title={t('nav.brands')} description="Explore verified agricultural brands and manufacturers on AgriMandi." />
      <div className="border-b border-border bg-secondary/30">
        <div className="container py-8">
          <h1 className="font-display text-3xl font-extrabold text-foreground">{t('section.popularBrands')}</h1>
          <p className="mt-1 text-muted-foreground">{t('section.popularBrandsSub')}</p>
        </div>
      </div>
      <div className="container py-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {loading ?
          Array.from({ length: 10 }).map((_, i) => <div key={i} className="h-40 animate-pulse rounded-2xl bg-muted" />) :
          data?.map((b, i) => <BrandCard key={b.id} brand={b} index={i} />)}
        </div>
      </div>
    </>);

}
