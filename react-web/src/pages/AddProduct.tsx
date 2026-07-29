











import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { CheckCircle2, PackagePlus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { brands, categories, cropsList } from '../data/mockData';
import { Seo } from '../components/layout/Seo';
import { Input, Textarea, Select, Label } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { FileDrop } from '../components/forms/FileDrop';

const schema = z.object({
  brandId: z.string().min(1, 'Select a brand'),
  name: z.string().min(2, 'Required'),
  categoryId: z.string().min(1, 'Select category'),
  subCategory: z.string().optional(),
  crop: z.string().min(1, 'Select crop'),
  description: z.string().min(10, 'Required'),
  benefits: z.string().optional(),
  usage: z.string().optional(),
  dosage: z.string().optional(),
  packaging: z.string().optional(),
  price: z.string().optional(),
  videoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  tags: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export function AddProduct() {
  const { t, tv } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const {
    register, handleSubmit, watch, formState: { errors, isSubmitting }
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const selectedCat = categories.find((c) => c.id === watch('categoryId'));

  const onSubmit = async (values: FormValues) => {
    await new Promise((r) => setTimeout(r, 800));
    // eslint-disable-next-line no-console
    console.log('add product', values); // POST /api/products
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="container py-20">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-md rounded-3xl border border-border bg-card p-10 text-center shadow-soft">
          <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
          <h1 className="mt-4 font-display text-2xl font-bold">Product published!</h1>
          <p className="mt-2 text-muted-foreground">Your product is now live for farmers to discover.</p>
          <Link to="/products" className="mt-4 inline-block text-primary hover:underline">{t('section.viewAll')}</Link>
        </motion.div>
      </div>);

  }

  return (
    <>
      <Seo title={t('addProduct.title')} description="List a new agricultural product on AgriMandi." />
      <div className="container max-w-3xl py-10">
        <div className="mb-8 flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground"><PackagePlus className="h-6 w-6" /></span>
          <div>
            <h1 className="font-display text-3xl font-extrabold text-foreground">{t('addProduct.title')}</h1>
            <p className="mt-1 text-muted-foreground">Fill in the details below to publish your product.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* brand step */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">{t('addProduct.selectBrand')}</h2>
              <Link to="/register-brand" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                <Plus className="h-4 w-4" /> {t('addProduct.createBrand')}
              </Link>
            </div>
            <Field error={errors.brandId?.message}>
              <Select {...register('brandId')}>
                <option value="">{t('addProduct.selectBrand')}</option>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </Select>
            </Field>
          </div>

          {/* product step */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h2 className="mb-4 font-display text-lg font-bold">Product Details</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Labeled label="Product Name" error={errors.name?.message}><Input {...register('name')} /></Labeled>
              <Labeled label={t('filters.category')} error={errors.categoryId?.message}>
                <Select {...register('categoryId')}>
                  <option value="">{t('filters.all')}</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{tv(c.name, c.nameHi)}</option>)}
                </Select>
              </Labeled>
              <Labeled label={t('product.subCategory')}>
                <Select {...register('subCategory')} disabled={!selectedCat?.subCategories.length}>
                  <option value="">{t('filters.all')}</option>
                  {selectedCat?.subCategories.map((s) => <option key={s.id} value={s.slug}>{tv(s.name, s.nameHi)}</option>)}
                </Select>
              </Labeled>
              <Labeled label={t('filters.crop')} error={errors.crop?.message}>
                <Select {...register('crop')}>
                  <option value="">{t('filters.all')}</option>
                  {cropsList.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
              </Labeled>
              <Labeled label={`${t('product.price')} (Optional)`}><Input type="number" {...register('price')} placeholder="₹" /></Labeled>
              <Labeled label="Video URL" error={errors.videoUrl?.message}><Input {...register('videoUrl')} placeholder="https://" /></Labeled>
            </div>

            <div className="mt-5 grid gap-5">
              <Labeled label="Description" error={errors.description?.message}><Textarea {...register('description')} /></Labeled>
              <div className="grid gap-5 sm:grid-cols-2">
                <Labeled label={t('product.benefits')}><Textarea {...register('benefits')} placeholder="One per line" /></Labeled>
                <Labeled label={t('product.usage')}><Textarea {...register('usage')} /></Labeled>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Labeled label={t('product.dosage')}><Input {...register('dosage')} /></Labeled>
                <Labeled label={t('product.packaging')}><Input {...register('packaging')} placeholder="250g, 500g, 1kg" /></Labeled>
              </div>
              <Labeled label="Tags"><Input {...register('tags')} placeholder="certified, organic, high-yield" /></Labeled>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              <FileDrop label="Product Images" />
              <FileDrop label={t('product.brochure')} />
              <FileDrop label={t('product.specSheet')} />
            </div>
          </div>

          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? t('common.loading') : t('addProduct.submit')}
          </Button>
        </form>
      </div>
    </>);

}

function Field({ error, children }: {error?: string;children: React.ReactNode;}) {
  return (
    <div>
      {children}
      {error && <p className="mt-1 text-xs font-medium text-destructive">{error}</p>}
    </div>);

}

function Labeled({ label, error, children }: {label: string;error?: string;children: React.ReactNode;}) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs font-medium text-destructive">{error}</p>}
    </div>);

}