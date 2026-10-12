import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { ArrowRight, Building2, ChevronDown, ShieldCheck } from 'lucide-react';
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
  categories: z.array(z.string()).min(1, 'Select one category').max(1, 'Only one category is allowed'),
  acceptedTerms: z.boolean().refine(Boolean, 'Accept the Terms & Conditions to continue'),
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
  const [otpSent, setOtpSent] = useState(false);
  const [registeredMobile, setRegisteredMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
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
    defaultValues: { companyName: '', contactPerson: '', mobile: '', email: '', categories: [], acceptedTerms: false },
  });
  const selectedCategories = watch('categories');

  const toggleCategory = (name: string) => {
    const checked = selectedCategories.includes(name);
    setValue(
      'categories',
      checked ? [] : [name],
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

      await api.post<RegisterResponse>('/auth/register-company', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
      });
      setRegisteredMobile(values.mobile);
      setOtpSent(true);
      await api.post('/auth/send-otp', { mobile: values.mobile, role: 'COMPANY' });
    } catch (error) {
      setRequestError(apiError(error));
    }
  };

  const verifyRegistrationOtp = async () => {
    if (!/^\d{4}$/.test(otp)) {
      setRequestError('Enter the 4-digit OTP');
      return;
    }

    setOtpLoading(true);
    setRequestError('');
    try {
      const { data } = await api.post<RegisterResponse>('/auth/verify-otp', {
        mobile: registeredMobile,
        otp,
        role: 'COMPANY',
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      localStorage.removeItem('ahk_admin_token');
      api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
      notifyAuthChanged();
      setShowSubscription(true);
    } catch (error) {
      setRequestError(apiError(error));
    } finally {
      setOtpLoading(false);
    }
  };

  const resendOtp = async () => {
    setOtpLoading(true);
    setRequestError('');
    try {
      await api.post('/auth/send-otp', { mobile: registeredMobile, role: 'COMPANY' });
    } catch (error) {
      setRequestError(apiError(error));
    } finally {
      setOtpLoading(false);
    }
  };

  if (otpSent && !showSubscription) {
    return <>
      <Seo title="Verify Company Mobile" description="Verify your company mobile number." />
      <div className="container flex min-h-[70vh] items-center justify-center py-12">
        <section className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-soft-lg">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground"><ShieldCheck className="h-6 w-6" /></span>
          <h1 className="mt-4 font-display text-2xl font-extrabold">Verify your number</h1>
          <p className="mt-2 text-sm text-muted-foreground">Enter the 4-digit OTP sent to +91 {registeredMobile}</p>
          <div className="mt-6 text-left">
            <Label>OTP</Label>
            <Input value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" maxLength={4} autoFocus placeholder="Enter 4-digit OTP" />
          </div>
          {requestError ? <p className="mt-4 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{requestError}</p> : null}
          <Button type="button" size="lg" className="mt-5 w-full" disabled={otpLoading || otp.length !== 4} onClick={verifyRegistrationOtp}>
            {otpLoading ? 'Please wait...' : 'Verify OTP'}{!otpLoading ? <ArrowRight className="h-4 w-4" /> : null}
          </Button>
          <button type="button" className="mt-4 text-sm font-semibold text-primary hover:underline" disabled={otpLoading} onClick={resendOtp}>Resend OTP</button>
        </section>
      </div>
    </>;
  }

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
          <Field label="Category (select only 1)" error={errors.categories?.message}>
            <details className="group relative">
              <summary className="flex h-11 cursor-pointer list-none items-center justify-between rounded-xl border border-input bg-background px-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <span className={selectedCategories.length ? '' : 'text-muted-foreground'}>{selectedCategories.length ? selectedCategories.join(', ') : categories.loading ? 'Loading categories...' : 'Select categories'}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition group-open:rotate-180" />
              </summary>
              <div className="absolute z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-border bg-card p-2 shadow-lg">
                {(categories.data ?? []).map((category) => {
                  const checked = selectedCategories.includes(category.name);
                  return <label key={category.id} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted">
                    <input type="radio" name="company-category" checked={checked} onChange={() => toggleCategory(category.name)} className="h-4 w-4 accent-primary" />
                    <span>{category.name}</span>
                  </label>;
                })}
              </div>
            </details>
          </Field>
        </div>
        <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
          <input type="checkbox" {...register('acceptedTerms')} className="mt-0.5 h-4 w-4 accent-primary" />
          <span>I agree to the <a href="/terms?role=COMPANY" target="_blank" rel="noreferrer" className="font-semibold text-primary hover:underline">Terms & Conditions</a>.</span>
        </label>
        {errors.acceptedTerms ? <p className="mt-1 text-xs font-medium text-destructive">{errors.acceptedTerms.message}</p> : null}

        {requestError ? <p className="mt-5 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{requestError}</p> : null}
        <Button type="submit" size="lg" className="mt-6 w-full" disabled={isSubmitting}>{isSubmitting ? 'Registering company...' : 'Register and verify OTP'}</Button>
      </form>
    </div>
    <SubscriptionChoiceModal open={showSubscription} onComplete={() => navigate('/company/dashboard', { replace: true })} />
  </>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div><Label>{label}</Label>{children}{error ? <p className="mt-1 text-xs font-medium text-destructive">{error}</p> : null}</div>;
}
