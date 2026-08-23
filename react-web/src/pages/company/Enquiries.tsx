import { MailOpen } from 'lucide-react';
import { Button } from '../../components/admin/ui/Button';
import { useCompanyData } from '../../hooks/useCompanyData';
import { companyStore } from '../../services/company-local.service';
import { Empty, Header } from './Brands';

export function CompanyEnquiries() { const enquiries = useCompanyData(companyStore.enquiries); return <div className="space-y-6"><Header title="Enquiries" description="Messages received from dealers and platform users." />{enquiries.length ? <div className="space-y-3">{enquiries.map((item) => <article key={item.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft"><div className="flex flex-wrap justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-primary">{item.from}</p><h2 className="mt-1 font-display text-lg font-bold">{item.subject}</h2></div>{item.status === 'new' ? <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">New</span> : null}</div><p className="mt-3 text-sm leading-6 text-muted-foreground">{item.message}</p>{item.status === 'new' ? <Button className="mt-4" size="sm" onClick={() => companyStore.readEnquiry(item.id)}><MailOpen className="h-4 w-4" />Mark as read</Button> : null}</article>)}</div> : <Empty text="No enquiries received yet." />}</div>; }
