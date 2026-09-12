import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { Building2, ChevronDown } from 'lucide-react';
import { Seo } from '../components/layout/Seo';
import { Input, Label } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import api from '../api/axios';
import { notifyAuthChanged, type SessionUser } from '../services/auth-session';
import { SubscriptionChoiceModal } from '../components/company/SubscriptionChoiceModal';
import { useAsync } from '../hooks/useAsync';
import { getPublicCategories } from '../services/category.service';

const schema = z.object({
  companyName: z.string().trim().min(2, 'Company name is required'),
  contactPerson: z.string().trim().min(2, 'Contact person is required'),
  mobile: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
  email: z.union([z.literal(''), z.string().trim().email('Enter a valid email')]),
  categories: z.array(z.string()).min(1, 'Select at least one category').max(2, 'Select up to two categories'),
});

type FormValues = z.infer<typeof schema>;
interface RegisterResponse { token: string; user: SessionUser; }

function apiError(error: unknown) {
  if (axios.isAxiosError(error)) return error.response?.data?.error ?? error.response?.data?.message ?? error.message;
  return error instanceof Error ? error.message : 'Company registration failed';
}

export function RegisterCompany() {
  const navigate = useNavigate();
  const [requestError, setRequestError] = useState('');
  const [showSubscription, setShowSubscription] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const categories = useAsync(getPublicCategories, []);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { companyName: '', contactPerson: '', mobile: '', email: '', categories: [] },
  });
  const selectedCategories = watch('categories');

  const toggleCategory = (name: string) => {
    const checked = selectedCategories.includes(name);
    if (!checked && selectedCategories.length >= 2) return;
    setValue(
      'categories',
      checked ? selectedCategories.filter((category) => category !== name) : [...selectedCategories, name],
      { shouldValidate: true },
    );
  };

  const onSubmit = async (values: FormValues) => {
    setRequestError('');
    if (!logo) {
      setRequestError('Company logo is required');
      return;
    }

    try {
      const form = new FormData();
      form.append('companyName', values.companyName.trim());
      form.append('contactPerson', values.contactPerson.trim());
      form.append('mobile', values.mobile);
      if (values.email.trim()) form.append('email', values.email.trim());
      values.categories.forEach((category) => form.append('categories', category));
      form.append('profileimage', logo);

      const { data } = await api.post<RegisterResponse>('/auth/register-company', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      localStorage.removeItem('ahk_admin_token');
      api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
      notifyAuthChanged();
      setShowSubscription(true);
    } catch (error) {
      setRequestError(apiError(error));
    }
  };

  return <>
    <Seo title="Register Company" description="Register your agricultural company on Agri HiTech Kisan." />
    <div className="container max-w-3xl py-10">
      <div className="mb-8 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground"><Building2 className="h-6 w-6" /></span>
        <div><h1 className="font-display text-2xl font-extrabold">Register Company</h1><p className="mt-1 text-sm text-muted-foreground">Create your company account and select a subscription plan.</p></div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Company name" error={errors.companyName?.message}><Input {...register('companyName')} /></Field>
          <Field label="Company logo"><Input type="file" accept="image/*" onChange={(event) => setLogo(event.target.files?.[0] ?? null)} /></Field>
          <Field label="Contact person" error={errors.contactPerson?.message}><Input {...register('contactPerson')} /></Field>
          <Field label="Mobile number" error={errors.mobile?.message}><Input type="tel" inputMode="numeric" maxLength={10} {...register('mobile')} /></Field>
          <Field label="Email (optional)" error={errors.email?.message}><Input type="email" {...register('email')} /></Field>
          <Field label="Categories (maximum 2)" error={errors.categories?.message}>
            <details className="group relative">
              <summary className="flex h-11 cursor-pointer list-none items-center justify-between rounded-xl border border-input bg-background px-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <span className={selectedCategories.length ? '' : 'text-muted-foreground'}>{selectedCategories.length ? selectedCategories.join(', ') : categories.loading ? 'Loading categories...' : 'Select categories'}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition group-open:rotate-180" />
              </summary>
              <div className="absolute z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-border bg-card p-2 shadow-lg">
                {(categories.data ?? []).map((category) => {
                  const checked = selectedCategories.includes(category.name);
                  const disabled = !checked && selectedCategories.length >= 2;
                  return <label key={category.id} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-muted'}`}>
                    <input type="checkbox" checked={checked} disabled={disabled} onChange={() => toggleCategory(category.name)} className="h-4 w-4 accent-primary" />
                    <span>{category.name}</span>
                  </label>;
                })}
              </div>
            </details>
          </Field>
        </div>
        {requestError ? <p className="mt-5 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{requestError}</p> : null}
        <Button type="submit" size="lg" className="mt-6 w-full" disabled={isSubmitting}>{isSubmitting ? 'Registering company...' : 'Register and choose subscription'}</Button>
      </form>
    </div>
    <SubscriptionChoiceModal open={showSubscription} onComplete={() => navigate('/company/dashboard', { replace: true })} />
  </>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div><Label>{label}</Label>{children}{error ? <p className="mt-1 text-xs font-medium text-destructive">{error}</p> : null}</div>;
}
