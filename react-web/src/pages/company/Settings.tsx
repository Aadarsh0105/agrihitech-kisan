import { useEffect, useState } from 'react';
import axios from 'axios';
import { Building2, Camera, CheckCircle2, LockKeyhole, MapPin, Save } from 'lucide-react';
import { Button } from '../../components/admin/ui/Button';
import { Field, Input, Select, Textarea } from '../../components/admin/ui/Input';
import { indianStates } from '../../data/mockData';
import { getCompanyProfile, updateCompanyProfile, type CompanyProfileApi, type CompanyProfileDraft } from '../../services/company.service';
import { notifyAuthChanged } from '../../services/auth-session';
import { Header } from './Brands';

const blank: CompanyProfileApi = { _id: '', mobile: '', companyName: '', contactPerson: '', email: '', gstNumber: '', address: '', location: {} };
const toDraft = (profile: CompanyProfileApi): CompanyProfileDraft => ({
  companyName: profile.companyName || '', contactPerson: profile.contactPerson || '', email: profile.email || '',
  gstNumber: profile.gstNumber || '', address: profile.address || '', profileimage: null,
  location: { state: profile.location?.state || '', district: profile.location?.district || '', village: profile.location?.village || '', pincode: profile.location?.pincode || '' },
});

function errorMessage(error: unknown) {
  if (axios.isAxiosError(error)) return error.response?.data?.message || error.response?.data?.error || error.message;
  return error instanceof Error ? error.message : 'Unable to update company profile';
}

export function CompanySettings() {
  const [profile, setProfile] = useState(blank);
  const [draft, setDraft] = useState<CompanyProfileDraft>(toDraft(blank));
  const [initial, setInitial] = useState('');
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getCompanyProfile().then((data) => {
      const next = toDraft(data); setProfile(data); setDraft(next); setPreview(data.profileimage || ''); setInitial(JSON.stringify(next));
    }).catch((reason) => setError(errorMessage(reason))).finally(() => setLoading(false));
  }, []);

  const set = (key: keyof Omit<CompanyProfileDraft, 'location' | 'profileimage'>, value: string) => {
    setError(''); setSuccess(''); setDraft((old) => ({ ...old, [key]: value }));
  };
  const setLocation = (key: keyof CompanyProfileDraft['location'], value: string) => {
    setError(''); setSuccess(''); setDraft((old) => ({ ...old, location: { ...old.location, [key]: value } }));
  };
  const serialized = JSON.stringify(draft, (_key, value) => value instanceof File ? value.name : value);
  const changed = initial !== serialized;
  const valid = draft.companyName.trim().length >= 2 && draft.contactPerson.trim().length >= 2
    && (!draft.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email))
    && (!draft.location.pincode || /^\d{6}$/.test(draft.location.pincode));

  const save = async () => {
    setSaving(true); setError(''); setSuccess('');
    try {
      const updated = await updateCompanyProfile({ ...draft, gstNumber: draft.gstNumber.toUpperCase() });
      const next = toDraft(updated); setProfile(updated); setDraft(next); setPreview(updated.profileimage || preview); setInitial(JSON.stringify(next));
      localStorage.setItem('auth_user', JSON.stringify(updated)); localStorage.removeItem('ahk_company_profile'); notifyAuthChanged();
      setSuccess('Company profile updated successfully.');
    } catch (reason) { setError(errorMessage(reason)); } finally { setSaving(false); }
  };

  return <div className="space-y-6">
    <Header title="Profile & Settings" description="Keep your company identity, contact details, and registered location up to date." />
    {error ? <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{error}</p> : null}
    {success ? <p className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary"><CheckCircle2 className="h-4 w-4" />{success}</p> : null}
    {loading ? <div className="h-[520px] animate-pulse rounded-3xl bg-muted" /> : <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
      <aside className="h-fit rounded-3xl border border-border bg-card p-6 text-center shadow-soft">
        <div className="relative mx-auto h-28 w-28"><div className="grid h-full w-full overflow-hidden rounded-3xl border border-border bg-primary/10 text-primary">{preview ? <img src={preview} alt={profile.companyName} className="h-full w-full object-cover" /> : <Building2 className="m-auto h-11 w-11" />}</div><label className="absolute -bottom-2 -right-2 grid h-10 w-10 cursor-pointer place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg" title="Change company logo"><Camera className="h-4 w-4" /><input type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0] || null; setDraft((old) => ({ ...old, profileimage: file })); if (file) setPreview(URL.createObjectURL(file)); }} /></label></div>
        <h2 className="mt-5 font-display text-xl font-bold">{draft.companyName || 'Company account'}</h2><p className="mt-1 text-sm text-muted-foreground">{draft.contactPerson || 'Contact person'}</p>
        <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-muted/60 px-3 py-2 text-xs font-medium text-muted-foreground"><LockKeyhole className="h-4 w-4 text-primary" />Secure company profile</div><p className="mt-4 text-xs leading-5 text-muted-foreground">Use a square logo for the best display across the dashboard.</p>
      </aside>
      <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
        <SectionTitle title="Company information" text="Details shown across your company workspace." />
        <div className="grid gap-5 p-6 sm:grid-cols-2">
          <Field label="Company name" required><Input value={draft.companyName} onChange={(e) => set('companyName', e.target.value)} /></Field>
          <Field label="Contact person" required><Input value={draft.contactPerson} onChange={(e) => set('contactPerson', e.target.value)} /></Field>
          <Field label="Company email"><Input type="email" value={draft.email} onChange={(e) => set('email', e.target.value)} placeholder="company@example.com" /></Field>
          <Field label="Mobile number"><div className="relative"><Input value={profile.mobile} disabled className="pr-10" /><LockKeyhole className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" /></div><p className="mt-1 text-xs text-muted-foreground">The registered mobile number cannot be changed.</p></Field>
          <Field label="GST number"><Input value={draft.gstNumber} maxLength={15} onChange={(e) => set('gstNumber', e.target.value.toUpperCase())} placeholder="Optional GSTIN" /></Field>
          <Field label="Registered address" className="sm:col-span-2"><Textarea value={draft.address} onChange={(e) => set('address', e.target.value)} placeholder="Building, street, landmark" /></Field>
        </div>
        <div className="border-y border-border bg-muted/30 px-6 py-4"><div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /><h2 className="font-display font-bold">Registered location</h2></div></div>
        <div className="grid gap-5 p-6 sm:grid-cols-2">
          <Field label="State"><Select value={draft.location.state} onChange={(e) => setLocation('state', e.target.value)}><option value="">Select state</option>{indianStates.map((state) => <option key={state} value={state}>{state}</option>)}</Select></Field>
          <Field label="District"><Input value={draft.location.district} onChange={(e) => setLocation('district', e.target.value)} /></Field>
          <Field label="City / Village"><Input value={draft.location.village} onChange={(e) => setLocation('village', e.target.value)} /></Field>
          <Field label="Pincode"><Input inputMode="numeric" maxLength={6} value={draft.location.pincode} onChange={(e) => setLocation('pincode', e.target.value.replace(/\D/g, ''))} />{draft.location.pincode && !/^\d{6}$/.test(draft.location.pincode) ? <p className="mt-1 text-xs font-medium text-destructive">Enter a valid 6-digit pincode.</p> : null}</Field>
        </div>
        <div className="flex flex-col gap-3 border-t border-border bg-muted/20 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-muted-foreground">Review your changes before saving.</p><Button variant="primary" disabled={saving || !changed || !valid} onClick={save}><Save className="h-4 w-4" />{saving ? 'Saving changes...' : changed ? 'Save changes' : 'Up to date'}</Button></div>
      </section>
    </div>}
  </div>;
}

function SectionTitle({ title, text }: { title: string; text: string }) {
  return <div className="border-b border-border px-6 py-5"><h2 className="font-display text-lg font-bold">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{text}</p></div>;
}
