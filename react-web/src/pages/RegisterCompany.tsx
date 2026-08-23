import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { Building2 } from 'lucide-react';
import { Seo } from '../components/layout/Seo';
import { Input, Label, Select } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { indianStates } from '../data/mockData';
import api from '../api/axios';
import { notifyAuthChanged, type SessionUser } from '../services/auth-session';
import { SubscriptionChoiceModal } from '../components/company/SubscriptionChoiceModal';

const schema = z.object({
  companyName: z.string().trim().min(2, 'Company name is required'),
  contactPerson: z.string().trim().min(2, 'Contact person is required'),
  mobile: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
  email: z.string().trim().email('Enter a valid email').or(z.literal('')),
  gstNumber: z.string().trim(),
  address: z.string().trim(),
  state: z.string().min(1, 'Select state'),
  district: z.string().trim().min(2, 'District is required'),
  village: z.string().trim().min(2, 'City or village is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
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
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: '', gstNumber: '', address: '', state: '' } });

  const onSubmit = async (values: FormValues) => {
    setRequestError('');
    try {
      const { data } = await api.post<RegisterResponse>('/auth/register-company', values);
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

  return <><Seo title="Register Company" description="Register your agricultural company on Agri HiTech Kisan." /><div className="container max-w-3xl py-10"><div className="mb-8 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground"><Building2 className="h-6 w-6" /></span><div><h1 className="font-display text-2xl font-extrabold">Register Company</h1><p className="mt-1 text-sm text-muted-foreground">Create your company account and select a subscription plan.</p></div></div><form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8"><div className="grid gap-5 sm:grid-cols-2"><Field label="Company name" error={errors.companyName?.message}><Input {...register('companyName')} /></Field><Field label="Contact person" error={errors.contactPerson?.message}><Input {...register('contactPerson')} /></Field><Field label="Mobile number" error={errors.mobile?.message}><Input type="tel" inputMode="numeric" maxLength={10} {...register('mobile')} /></Field><Field label="Email" error={errors.email?.message}><Input type="email" {...register('email')} /></Field><Field label="GST number" error={errors.gstNumber?.message}><Input className="uppercase" {...register('gstNumber')} /></Field><Field label="State" error={errors.state?.message}><Select {...register('state')}><option value="">Select state</option>{indianStates.map((state) => <option key={state} value={state}>{state}</option>)}</Select></Field><Field label="District" error={errors.district?.message}><Input {...register('district')} /></Field><Field label="City / Village" error={errors.village?.message}><Input {...register('village')} /></Field><Field label="Pincode" error={errors.pincode?.message}><Input inputMode="numeric" maxLength={6} {...register('pincode')} /></Field><Field label="Registered address" error={errors.address?.message}><Input {...register('address')} /></Field></div>{requestError ? <p className="mt-5 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{requestError}</p> : null}<Button type="submit" size="lg" className="mt-6 w-full" disabled={isSubmitting}>{isSubmitting ? 'Registering company...' : 'Register and choose subscription'}</Button></form></div><SubscriptionChoiceModal open={showSubscription} onComplete={() => navigate('/company/dashboard', { replace: true })} /></>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <div><Label>{label}</Label>{children}{error ? <p className="mt-1 text-xs font-medium text-destructive">{error}</p> : null}</div>; }
