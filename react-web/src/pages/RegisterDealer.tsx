import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { ChevronDown, Store } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { indianStates } from '../data/mockData';
import { Seo } from '../components/layout/Seo';
import { Input, Select, Label } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAsync } from '../hooks/useAsync';
import { getPublicCategories } from '../services/category.service';
import { getPublicBrands } from '../services/brand.service';
import api from '../api/axios';
import { notifyAuthChanged, type SessionUser } from '../services/auth-session';
import { SubscriptionChoiceModal } from '../components/company/SubscriptionChoiceModal';

const schema = z.object({
  firmName: z.string().trim().min(2, 'Firm name is required'),
  proprietorName: z.string().trim().min(2, 'Proprietor name is required'),
  mobile: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit phone number'),
  categories: z.array(z.string()).min(1, 'Select at least one category').max(2, 'Select up to two categories'),
  dealerBrands: z.array(z.string()).min(1, 'Select at least one brand'),
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
  const [showSubscription, setShowSubscription] = useState(false);
  const categories = useAsync(getPublicCategories, []);
  const brands = useAsync(getPublicBrands, []);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { categories: [], dealerBrands: [] },
  });
  const selectedCategories = watch('categories');
  const selectedBrands = watch('dealerBrands');
  const selectedCategoryIds = (categories.data ?? [])
    .filter((category) => selectedCategories.includes(category.name))
    .map((category) => category.id);
  const availableBrands = (brands.data ?? []).filter((brand) =>
    brand.category?._id && selectedCategoryIds.includes(brand.category._id),
  );

  const toggleCategory = (name: string) => {
    const checked = selectedCategories.includes(name);
    if (!checked && selectedCategories.length >= 2) return;

    const nextCategories = checked
      ? selectedCategories.filter((category) => category !== name)
      : [...selectedCategories, name];
    const nextCategoryIds = (categories.data ?? [])
      .filter((category) => nextCategories.includes(category.name))
      .map((category) => category.id);
    const validBrandIds = new Set(
      (brands.data ?? [])
        .filter((brand) => brand.category?._id && nextCategoryIds.includes(brand.category._id))
        .map((brand) => brand._id),
    );

    setValue('categories', nextCategories, { shouldValidate: true });
    setValue('dealerBrands', selectedBrands.filter((id) => validBrandIds.has(id)), { shouldValidate: true });
  };

  const onSubmit = async (values: FormValues) => {
    setRequestError('');
    try {
      const { data } = await api.post<RegisterResponse>('/auth/register-b2b', values);
      localStorage.setItem('token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
      notifyAuthChanged();
      setShowSubscription(true);
    } catch (error) {
      setRequestError(apiError(error));
    }
  };

  if (showSubscription) {
    return <SubscriptionChoiceModal open accountLabel="business" onComplete={() => navigate('/business/dashboard', { replace: true })} />;
  }

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

            <Field label="Categories (maximum 2)" error={errors.categories?.message}>
              <details className="group relative">
                <summary className="flex h-11 cursor-pointer list-none items-center justify-between rounded-xl border border-input bg-background px-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <span className={selectedCategories.length ? '' : 'text-muted-foreground'}>
                    {selectedCategories.length ? selectedCategories.join(', ') : categories.loading ? 'Loading categories...' : 'Select categories'}
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition group-open:rotate-180" />
                </summary>
                <div className="absolute z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-border bg-card p-2 shadow-lg">
                  {(categories.data ?? []).map((category) => {
                    const checked = selectedCategories.includes(category.name);
                    const disabled = !checked && selectedCategories.length >= 2;
                    return (
                      <label key={category.id} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-muted'}`}>
                        <input type="checkbox" checked={checked} disabled={disabled} onChange={() => toggleCategory(category.name)} className="h-4 w-4 accent-primary" />
                        <span>{category.name}</span>
                      </label>
                    );
                  })}
                </div>
              </details>
            </Field>


            <Field label="Brands / Companies" error={errors.dealerBrands?.message}>
              <details className="group relative">
                <summary className="flex h-11 cursor-pointer list-none items-center justify-between rounded-xl border border-input bg-background px-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <span className={selectedBrands.length ? '' : 'text-muted-foreground'}>
                    {selectedBrands.length ? `${selectedBrands.length} brand${selectedBrands.length > 1 ? 's' : ''} selected` : !selectedCategories.length ? 'Select categories first' : brands.loading ? 'Loading brands...' : 'Select brands'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition group-open:rotate-180" />
                </summary>
                <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-border bg-card p-2 shadow-lg">
                  {availableBrands.map((brand) => {
                    const checked = selectedBrands.includes(brand._id);
                    return (
                      <label key={brand._id} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => setValue('dealerBrands', checked ? selectedBrands.filter((id) => id !== brand._id) : [...selectedBrands, brand._id], { shouldValidate: true })}
                          className="h-4 w-4 accent-primary"
                        />
                        <span>{brand.name}</span>
                      </label>
                    );
                  })}
                  {!brands.loading && selectedCategories.length > 0 && !availableBrands.length ? <p className="px-3 py-2 text-sm text-muted-foreground">No brands available for selected categories</p> : null}
                  {!selectedCategories.length ? <p className="px-3 py-2 text-sm text-muted-foreground">Select one or two categories first</p> : null}
                </div>
              </details>
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

          <Button type="submit" size="lg" className="mt-6 w-full" disabled={isSubmitting || categories.loading || brands.loading}>
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
