









import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { CheckCircle2, Store } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { indianStates } from '../data/mockData';
import { Seo } from '../components/layout/Seo';
import { Input, Textarea, Select, Label } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { FileDrop } from '../components/forms/FileDrop';

const schema = z.object({
  brandName: z.string().min(2, 'Required'),
  companyName: z.string().min(2, 'Required'),
  gst: z.string().min(15, 'Enter valid GST').max(15),
  pan: z.string().min(10, 'Enter valid PAN').max(10),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Enter valid phone'),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  address: z.string().min(4, 'Required'),
  state: z.string().min(1, 'Select state'),
  district: z.string().min(2, 'Required'),
  description: z.string().min(10, 'Tell us more')
});

type FormValues = z.infer<typeof schema>;

export function RegisterBrand() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const {
    register, handleSubmit, formState: { errors, isSubmitting }
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    // POST /api/brands — replace with real endpoint later.
    await new Promise((r) => setTimeout(r, 800));
    // eslint-disable-next-line no-console
    console.log('register brand', values);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="container py-20">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-md rounded-3xl border border-border bg-card p-10 text-center shadow-soft">
          <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
          <h1 className="mt-4 font-display text-2xl font-bold">Registration submitted!</h1>
          <p className="mt-2 text-muted-foreground">Our team will verify your brand and get back to you shortly.</p>
        </motion.div>
      </div>);

  }

  return (
    <>
      <Seo title={t('nav.registerBrand')} description="Register your agricultural brand on AgriMandi and reach farmers across India." />
      <div className="container max-w-3xl py-10">
        <div className="mb-8 flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground"><Store className="h-6 w-6" /></span>
          <div>
            <h1 className="font-display text-3xl font-extrabold text-foreground">{t('registerBrand.title')}</h1>
            <p className="mt-1 text-muted-foreground">{t('registerBrand.subtitle')}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Brand Name" error={errors.brandName?.message}><Input {...register('brandName')} /></Field>
            <Field label="Company Name" error={errors.companyName?.message}><Input {...register('companyName')} /></Field>
            <Field label="GST Number" error={errors.gst?.message}><Input {...register('gst')} placeholder="22AAAAA0000A1Z5" /></Field>
            <Field label="PAN" error={errors.pan?.message}><Input {...register('pan')} placeholder="ABCDE1234F" /></Field>
            <Field label={t('common.email')} error={errors.email?.message}><Input type="email" {...register('email')} /></Field>
            <Field label="Phone" error={errors.phone?.message}><Input {...register('phone')} /></Field>
            <Field label="Website" error={errors.website?.message}><Input {...register('website')} placeholder="https://" /></Field>
            <Field label="Address" error={errors.address?.message}><Input {...register('address')} /></Field>
            <Field label={t('filters.state')} error={errors.state?.message}>
              <Select {...register('state')}>
                <option value="">{t('filters.all')}</option>
                {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </Field>
            <Field label={t('filters.district')} error={errors.district?.message}><Input {...register('district')} /></Field>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <FileDrop label="Logo Upload" />
            <FileDrop label="Banner Upload" />
          </div>

          <div className="mt-5">
            <Field label="Description" error={errors.description?.message}><Textarea {...register('description')} /></Field>
          </div>

          <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto" disabled={isSubmitting}>
            {isSubmitting ? t('common.loading') : t('registerBrand.submit')}
          </Button>
        </form>
      </div>
    </>);

}

function Field({ label, error, children }: {label: string;error?: string;children: React.ReactNode;}) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs font-medium text-destructive">{error}</p>}
    </div>);

}