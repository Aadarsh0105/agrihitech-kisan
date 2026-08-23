import { useEffect, useState } from 'react';
import axios from 'axios';
import { Camera, CheckCircle2, LockKeyhole, MapPin, Save, Store } from 'lucide-react';
import { Button } from '../../components/admin/ui/Button';
import { Field, Input, Select } from '../../components/admin/ui/Input';
import { indianStates } from '../../data/mockData';
import { getBusinessProfile, updateBusinessProfile, type BusinessProfile, type BusinessProfileDraft } from '../../services/business.service';
import { notifyAuthChanged } from '../../services/auth-session';
import { BusinessHeader } from './shared';

const blank: BusinessProfile = { _id: '', mobile: '', location: {} };
const toDraft = (profile: BusinessProfile): BusinessProfileDraft => ({ firmName: profile.firmName || '', proprietorName: profile.proprietorName || '', email: profile.email || '', profileimage: null, location: { state: profile.location?.state || '', district: profile.location?.district || '', village: profile.location?.village || '', pincode: profile.location?.pincode || '' } });
const messageOf = (error: unknown) => axios.isAxiosError(error) ? error.response?.data?.message ?? error.response?.data?.error ?? error.message : error instanceof Error ? error.message : 'Unable to update business profile';

export function BusinessSettings() {
  const [profile, setProfile] = useState(blank);
  const [draft, setDraft] = useState<BusinessProfileDraft>(toDraft(blank));
  const [initial, setInitial] = useState('');
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { getBusinessProfile().then((data) => { const next = toDraft(data); setProfile(data); setDraft(next); setInitial(JSON.stringify(next)); setPreview(data.profileimage || ''); }).catch((reason) => setError(messageOf(reason))).finally(() => setLoading(false)); }, []);
  const set = (key: 'firmName' | 'proprietorName' | 'email', value: string) => { setError(''); setSuccess(''); setDraft((old) => ({ ...old, [key]: value })); };
  const setLocation = (key: keyof BusinessProfileDraft['location'], value: string) => { setError(''); setSuccess(''); setDraft((old) => ({ ...old, location: { ...old.location, [key]: value } })); };
  const changed = initial !== JSON.stringify(draft, (_key, value) => value instanceof File ? value.name : value);
  const valid = draft.firmName.trim().length >= 2 && draft.proprietorName.trim().length >= 2 && (!draft.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) && (!draft.location.pincode || /^\d{6}$/.test(draft.location.pincode));
  const save = async () => { setSaving(true); setError(''); setSuccess(''); try { const updated = await updateBusinessProfile(draft); const next = toDraft(updated); setProfile(updated); setDraft(next); setInitial(JSON.stringify(next)); setPreview(updated.profileimage || preview); localStorage.setItem('auth_user', JSON.stringify(updated)); localStorage.removeItem('ahk_dealer_profile'); notifyAuthChanged(); setSuccess('Business profile updated successfully.'); } catch (reason) { setError(messageOf(reason)); } finally { setSaving(false); } };

  return <div className="space-y-6">
    <BusinessHeader title="Profile & Settings" description="Manage your business identity, contact person, and service location." />
    {error ? <p className="rounded-xl bg-destructive/10 p-4 text-sm font-medium text-destructive">{error}</p> : null}{success ? <p className="flex items-center gap-2 rounded-xl bg-primary/10 p-4 text-sm font-medium text-primary"><CheckCircle2 className="h-4 w-4" />{success}</p> : null}
    {loading ? <div className="h-[500px] animate-pulse rounded-3xl bg-muted" /> : <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
      <aside className="h-fit rounded-3xl border border-border bg-card p-6 text-center shadow-soft"><div className="relative mx-auto h-28 w-28"><div className="grid h-full w-full overflow-hidden rounded-3xl border border-border bg-primary/10 text-primary">{preview ? <img src={preview} alt="" className="h-full w-full object-cover" /> : <Store className="m-auto h-11 w-11" />}</div><label className="absolute -bottom-2 -right-2 grid h-10 w-10 cursor-pointer place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg"><Camera className="h-4 w-4" /><input type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0] || null; setDraft((old) => ({ ...old, profileimage: file })); if (file) setPreview(URL.createObjectURL(file)); }} /></label></div><h2 className="mt-5 font-display text-xl font-bold">{draft.firmName || 'Business account'}</h2><p className="mt-1 text-sm text-muted-foreground">{draft.proprietorName || 'Proprietor'}</p><div className="mt-5 rounded-xl bg-muted/60 px-3 py-2 text-xs font-medium text-muted-foreground">B2B dealer profile</div>{profile.categories?.length ? <div className="mt-4 flex flex-wrap justify-center gap-2">{profile.categories.map((category) => <span key={category} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{category}</span>)}</div> : null}</aside>
      <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft"><div className="border-b border-border px-6 py-5"><h2 className="font-display text-lg font-bold">Business information</h2><p className="mt-1 text-sm text-muted-foreground">Keep dealer information accurate for marketplace buyers.</p></div><div className="grid gap-5 p-6 sm:grid-cols-2"><Field label="Firm name" required><Input value={draft.firmName} onChange={(e) => set('firmName', e.target.value)} /></Field><Field label="Proprietor name" required><Input value={draft.proprietorName} onChange={(e) => set('proprietorName', e.target.value)} /></Field><Field label="Email"><Input type="email" value={draft.email} onChange={(e) => set('email', e.target.value)} placeholder="dealer@example.com" /></Field><Field label="Mobile number"><div className="relative"><Input value={profile.mobile} disabled className="pr-10" /><LockKeyhole className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" /></div><p className="mt-1 text-xs text-muted-foreground">Registered mobile cannot be changed.</p></Field></div>
        <div className="border-y border-border bg-muted/30 px-6 py-4"><div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /><h2 className="font-display font-bold">Service location</h2></div></div><div className="grid gap-5 p-6 sm:grid-cols-2"><Field label="State"><Select value={draft.location.state} onChange={(e) => setLocation('state', e.target.value)}><option value="">Select state</option>{indianStates.map((state) => <option key={state} value={state}>{state}</option>)}</Select></Field><Field label="District"><Input value={draft.location.district} onChange={(e) => setLocation('district', e.target.value)} /></Field><Field label="City / Village"><Input value={draft.location.village} onChange={(e) => setLocation('village', e.target.value)} /></Field><Field label="Pincode"><Input inputMode="numeric" maxLength={6} value={draft.location.pincode} onChange={(e) => setLocation('pincode', e.target.value.replace(/\D/g, ''))} />{draft.location.pincode && !/^\d{6}$/.test(draft.location.pincode) ? <p className="mt-1 text-xs font-medium text-destructive">Enter a valid 6-digit pincode.</p> : null}</Field></div>
        <div className="flex items-center justify-end border-t border-border bg-muted/20 px-6 py-4"><Button variant="primary" disabled={saving || !changed || !valid} onClick={() => void save()}><Save className="h-4 w-4" />{saving ? 'Saving changes...' : changed ? 'Save changes' : 'Up to date'}</Button></div></section>
    </div>}
  </div>;
}
