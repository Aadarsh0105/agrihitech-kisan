import { useEffect, useState } from 'react';
import { MapPin, Phone, Plus, Store, Trash2 } from 'lucide-react';
import { Button } from '../../components/admin/ui/Button';
import { Field, Input } from '../../components/admin/ui/Input';
import { ConfirmDialog, Modal } from '../../components/admin/ui/Modal';
import { assignCompanyDealer, getCompanyDealers, removeCompanyDealer, setCompanyDealerStatus, type CompanyDealerApi } from '../../services/company.service';
import { Empty, Header } from './Brands';

export function CompanyDealers() {
  const [dealers, setDealers] = useState<CompanyDealerApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [remove, setRemove] = useState<CompanyDealerApi | null>(null);
  const load = () => getCompanyDealers().then(setDealers).catch((reason) => setError(reason.response?.data?.message || reason.message)).finally(() => setLoading(false));
  useEffect(() => {
    void load();
  }, []);
  const assign = async () => { setError(''); try { await assignCompanyDealer(mobile); setOpen(false); setMobile(''); await load(); } catch (reason: any) { setError(reason.response?.data?.message || reason.message); } };
  const toggle = async (dealer: CompanyDealerApi) => { await setCompanyDealerStatus(dealer._id, dealer.companyDealerStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'); await load(); };
  return <div className="space-y-6"><Header title="My Dealers" description="Directly assign and manage B2B dealers in your company network." action={<Button variant="primary" onClick={() => setOpen(true)}><Plus className="h-4 w-4" />Add dealer</Button>} />{error ? <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}{loading ? <div className="h-56 animate-pulse rounded-2xl bg-muted" /> : dealers.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{dealers.map((dealer) => <article key={dealer._id} className="rounded-2xl border border-border bg-card p-5 shadow-soft"><div className="flex justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><Store className="h-5 w-5" /></span><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{dealer.companyDealerStatus}</span></div><h2 className="mt-4 font-display text-lg font-bold">{dealer.firmName || 'Dealer firm'}</h2><p className="text-sm text-muted-foreground">{dealer.proprietorName}</p><p className="mt-3 flex gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4" />{dealer.mobile}</p><p className="mt-2 flex gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{[dealer.location?.village, dealer.location?.district, dealer.location?.state].filter(Boolean).join(', ') || 'Location unavailable'}</p><div className="mt-4 flex gap-2"><Button className="flex-1" variant={dealer.companyDealerStatus === 'ACTIVE' ? 'outlineDanger' : 'primary'} onClick={() => toggle(dealer)}>{dealer.companyDealerStatus === 'ACTIVE' ? 'Suspend' : 'Activate'}</Button><Button variant="outlineDanger" onClick={() => setRemove(dealer)}><Trash2 className="h-4 w-4" /></Button></div></article>)}</div> : <Empty text="No dealers are assigned to this company." />}<Modal open={open} onClose={() => setOpen(false)} title="Assign B2B dealer" description="Enter the registered mobile number of an existing B2B dealer." footer={<><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary" disabled={!/^\d{10}$/.test(mobile)} onClick={assign}>Assign dealer</Button></>}><Field label="Dealer mobile number" required><Input inputMode="numeric" maxLength={10} value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))} /></Field></Modal><ConfirmDialog open={Boolean(remove)} onClose={() => setRemove(null)} onConfirm={async () => { if (remove) { await removeCompanyDealer(remove._id); await load(); } }} title="Remove dealer" message="The dealer will be disconnected. Existing company products remain with the company." /></div>;
}
