import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { Store } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { indianStates } from '../data/mockData';
import { Seo } from '../components/layout/Seo';
import { Input, Select, Label } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAsync } from '../hooks/useAsync';
import { getPublicCategories } from '../services/category.service';
import api from '../api/axios';
import { notifyAuthChanged, type SessionUser } from '../services/auth-session';

const schema = z.object({
  firmName: z.string().trim().min(2, 'Firm name is required'),
  proprietorName: z.string().trim().min(2, 'Proprietor name is required'),
  mobile: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit phone number'),
  category: z.string().min(1, 'Select a category'),
  state: z.string().min(1, 'Select state'),
  district: z.string().trim().min(2, 'District is required'),
  village: z.string().trim().min(2, 'City or village is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
});

type FormValues = z.infer<typeof schema>;

interface RegisterResponse {
  token: string;
  user: SessionUser;
}

function apiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error ?? error.response?.data?.message ?? error.message;
  }
  return error instanceof Error ? error.message : 'Registration failed';
}

export function RegisterBrand() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [requestError, setRequestError] = useState('');
  const categories = useAsync(getPublicCategories, []);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { category: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setRequestError('');
    try {
      const { category, ...registration } = values;
      const { data } = await api.post<RegisterResponse>('/auth/register-b2b', {
        ...registration,
        categories: [category],
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
      notifyAuthChanged();
      navigate('/business/dashboard', { replace: true });
    } catch (error) {
      setRequestError(apiError(error));
    }
  };

  return (
    <>
      <Seo title={t('nav.registerBrand')} description="Register your agricultural business on AgriMandi and reach farmers across India." />
      <div className="container max-w-2xl py-10">
        <div className="mb-8 flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground"><Store className="h-6 w-6" /></span>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-foreground">{t('registerBrand.title')}</h1>
            {/* <p className="mt-1 text-muted-foreground">{t('registerBrand.subtitle')}</p> */}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Firm name" error={errors.firmName?.message}>
              <Input {...register('firmName')} />
            </Field>

            <Field label="Proprietor name" error={errors.proprietorName?.message}>
              <Input {...register('proprietorName')} />
            </Field>

            <Field label="Phone number" error={errors.mobile?.message}>
              <Input type="tel" inputMode="numeric" maxLength={10} {...register('mobile')} />
            </Field>

            <Field label="Category" error={errors.category?.message}>
              <Select {...register('category')} disabled={categories.loading}>
                <option value="">{categories.loading ? 'Loading categories...' : 'Select category'}</option>
                {(categories.data ?? []).map((category) => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </Select>
            </Field>

            <Field label="State" error={errors.state?.message}>
              <Select {...register('state')}>
                <option value="">Select state</option>
                {indianStates.map((state) => <option key={state} value={state}>{state}</option>)}
              </Select>
            </Field>

            <Field label="District" error={errors.district?.message}>
              <Input {...register('district')} />
            </Field>

            <Field label="City / Village" error={errors.village?.message}>
              <Input {...register('village')} />
            </Field>

            <Field label="Pincode" error={errors.pincode?.message}>
              <Input inputMode="numeric" maxLength={6} {...register('pincode')} />
            </Field>
          </div>

          {requestError ? <p className="mt-5 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{requestError}</p> : null}

          <Button type="submit" size="lg" className="mt-6 w-full" disabled={isSubmitting || categories.loading}>
            {isSubmitting ? t('common.loading') : t('registerBrand.submit')}
          </Button>
        </form>
      </div>
    </>
  );
}

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      {error ? <p className="mt-1 text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}
