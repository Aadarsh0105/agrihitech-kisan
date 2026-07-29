




import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BadgeCheck, Globe, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { api } from '../services/api';
import { useAsync } from '../hooks/useAsync';
import { useLanguage } from '../i18n/LanguageContext';
import { Seo } from '../components/layout/Seo';
import { ProductGrid } from '../components/products/ProductGrid';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Section } from '../components/ui/Section';

export function BrandDetail() {
  const { slug } = useParams<{slug: string;}>();
  const { t, tv } = useLanguage();
  const { data: brand, loading } = useAsync(() => api.getBrandBySlug(slug ?? ''), [slug]);
  const { data: products, loading: pLoading } = useAsync(
    () => api.getProducts({ brandSlug: slug }),
    [slug]
  );

  if (loading) return <div className="container py-20 text-center text-muted-foreground">{t('common.loading')}</div>;
  if (!brand)
  return (
    <div className="container py-24 text-center">
        <h1 className="font-display text-2xl font-bold">{t('common.notFound')}</h1>
        <Link to="/brands" className="mt-4 inline-block text-primary hover:underline">{t('common.backHome')}</Link>
      </div>);


  return (
    <>
      <Seo title={brand.name} description={tv(brand.description, brand.descriptionHi)} />

      {/* banner */}
      <div className="relative h-48 w-full overflow-hidden bg-primary-100 md:h-64">
        {brand.banner && <img src={brand.banner} alt="" className="h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative -mt-16 flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft-lg md:flex-row md:items-center">
          
          <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl border border-border bg-white">
            <img src={brand.logo} alt={brand.name} className="h-20 w-20 object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-extrabold text-foreground md:text-3xl">{brand.name}</h1>
              {brand.verified &&
              <Badge variant="success"><BadgeCheck className="h-3.5 w-3.5" /> {t('brand.verified')}</Badge>
              }
            </div>
            <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{tv(brand.description, brand.descriptionHi)}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
              {brand.contact?.address &&
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> {brand.contact.address}</span>
              }
              {brand.contact?.phone &&
              <a href={`tel:${brand.contact.phone}`} className="inline-flex items-center gap-1.5 hover:text-primary"><Phone className="h-4 w-4 text-primary" /> {brand.contact.phone}</a>
              }
              {brand.contact?.email &&
              <a href={`mailto:${brand.contact.email}`} className="inline-flex items-center gap-1.5 hover:text-primary"><Mail className="h-4 w-4 text-primary" /> {brand.contact.email}</a>
              }
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-2">
            {brand.website &&
            <a href={brand.website} target="_blank" rel="noreferrer">
                <Button className="w-full"><Globe className="h-4 w-4" /> {t('brand.visitWebsite')}</Button>
              </a>
            }
            <div className="flex gap-2">
              {[Facebook, Instagram, Youtube].map((Icon, i) =>
              <a key={i} href="#" aria-label="Social" className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-primary hover:text-primary">
                  <Icon className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <Section title={t('brand.allProducts')} subtitle={`${brand.productCount} ${t('brand.products')}`}>
        <ProductGrid products={products} loading={pLoading} />
      </Section>
    </>);

}