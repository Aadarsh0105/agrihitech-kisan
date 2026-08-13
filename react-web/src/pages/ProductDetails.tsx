



import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BadgeCheck, Sprout, FileText, BookOpen, FileDown, Check, ChevronRight, MapPin } from
'lucide-react';
import { useAsync } from '../hooks/useAsync';
import { useLanguage } from '../i18n/LanguageContext';
import { Seo } from '../components/layout/Seo';
import { ProductGallery } from '../components/products/ProductGallery';
import { NearestDealers } from '../components/products/NearestDealers';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { getProductById } from '../services/product.service';
import { useLocation as useUserLocation } from '../context/LocationContext';

export function ProductDetails() {
  const { slug } = useParams<{slug: string;}>();
  const { t, tv } = useLanguage();
  const { latitude, longitude, loading: locationLoading, getCurrentLocation } = useUserLocation();
  const details = useAsync(
    () => getProductById(
      slug ?? '',
      latitude !== null && longitude !== null ? { latitude, longitude } : undefined,
    ),
    [slug, latitude, longitude],
  );
  const product = details.data?.product ?? null;
  const loading = details.loading;

  if (loading) {
    return <div className="container py-20 text-center text-muted-foreground">{t('common.loading')}</div>;
  }
  if (!product) {
    return (
      <div className="container py-24 text-center">
        <h1 className="font-display text-2xl font-bold">{t('common.notFound')}</h1>
        <Link to="/products" className="mt-4 inline-block text-primary hover:underline">
          {t('common.backHome')}
        </Link>
      </div>);

  }

  const price = product.price ?
  `₹${product.price.toLocaleString('en-IN')}` :
  t('product.priceOnRequest');

  return (
    <>
      <Seo title={tv(product.name, product.nameHi)} description={tv(product.shortDescription, product.shortDescriptionHi)} />

      {/* breadcrumb */}
      <div className="border-b border-border bg-secondary/30">
        <nav className="container flex items-center gap-1.5 py-3 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary">{t('nav.home')}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to={`/categories/${product.categoryId}`} className="hover:text-primary">{product.categoryName}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="truncate font-medium text-foreground">{tv(product.name, product.nameHi)}</span>
        </nav>
      </div>

      <div className="container py-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <ProductGallery images={product.images} alt={tv(product.name, product.nameHi)} />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex flex-wrap items-center gap-2">
              <Link to={`/brands`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                <BadgeCheck className="h-4 w-4" /> {product.brandName}
              </Link>
              <Badge variant="muted">{product.categoryName}</Badge>
              {product.subCategory && <Badge variant="outline">{product.subCategory}</Badge>}
            </div>

            <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
              {tv(product.name, product.nameHi)}
            </h1>
            <p className="mt-3 text-muted-foreground">{tv(product.shortDescription, product.shortDescriptionHi)}</p>

            <div className="mt-5 flex items-baseline gap-2">
              <span className="font-display text-3xl font-extrabold text-foreground">{price}</span>
            </div>

            {/* suitable crops */}
            <div className="mt-5">
              <h3 className="mb-2 text-sm font-semibold text-foreground">{t('product.suitableCrops')}</h3>
              <div className="flex flex-wrap gap-2">
                {product.suitableCrops.map((crop) =>
                <span key={crop} className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-900/30">
                    <Sprout className="h-3.5 w-3.5" /> {crop}
                  </span>
                )}
              </div>
            </div>

            {/* packaging */}
            <div className="mt-5">
              <h3 className="mb-2 text-sm font-semibold text-foreground">{t('product.packaging')}</h3>
              <div className="flex flex-wrap gap-2">
                {product.packagingSizes.map((size) =>
                <span key={size} className="rounded-xl border border-border px-3 py-1.5 text-sm font-medium text-foreground">
                    {size}
                  </span>
                )}
              </div>
            </div>

            <a href="#dealers" className="mt-6 block">
              <Button size="lg" className="w-full sm:w-auto">
                <MapPin className="h-4 w-4" /> {t('product.findDealers')}
              </Button>
            </a>

            {/* downloads */}
            {product.downloads &&
            <div className="mt-6">
                <h3 className="mb-2 text-sm font-semibold text-foreground">{t('product.downloads')}</h3>
                <div className="flex flex-wrap gap-2">
                  {product.downloads.brochure &&
                <DownloadPill href={product.downloads.brochure} icon={<FileText className="h-4 w-4" />} label={t('product.brochure')} />
                }
                  {product.downloads.manual &&
                <DownloadPill href={product.downloads.manual} icon={<BookOpen className="h-4 w-4" />} label={t('product.manual')} />
                }
                  {product.downloads.specPdf &&
                <DownloadPill href={product.downloads.specPdf} icon={<FileDown className="h-4 w-4" />} label={t('product.specSheet')} />
                }
                </div>
              </div>
            }
          </motion.div>
        </div>

        {/* usage / dosage / benefits + specs */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <InfoBlock title={t('product.usage')} text={product.usage} />
            <InfoBlock title={t('product.dosage')} text={product.dosage} />
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h3 className="mb-3 font-display text-lg font-bold text-foreground">{t('product.benefits')}</h3>
              <ul className="grid gap-2 sm:grid-cols-2">
                {product.benefits.map((b) =>
                <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {b}
                  </li>
                )}
              </ul>
            </div>
          </div>

          {product.specifications &&
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h3 className="mb-3 font-display text-lg font-bold text-foreground">{t('product.specifications')}</h3>
              <dl className="divide-y divide-border">
                {product.specifications.map((s) =>
              <div key={s.label} className="flex justify-between gap-4 py-2.5 text-sm">
                    <dt className="text-muted-foreground">{s.label}</dt>
                    <dd className="text-right font-medium text-foreground">{s.value}</dd>
                  </div>
              )}
              </dl>
            </div>
          }
        </div>

        {/* MOST IMPORTANT: nearest dealers */}
        <div className="mt-14">
          <NearestDealers
            dealers={details.data?.nearestDealers ?? null}
            loading={details.loading || locationLoading}
            hasLocation={latitude !== null && longitude !== null}
            onUseLocation={getCurrentLocation}
          />
        </div>
      </div>
    </>);

}

function InfoBlock({ title, text }: {title: string;text?: string;}) {
  if (!text) return null;
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <h3 className="mb-2 font-display text-lg font-bold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>);

}

function DownloadPill({ href, icon, label }: {href: string;icon: React.ReactNode;label: string;}) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-primary-100">
      
      {icon} {label}
    </a>);

}
