import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquareText } from 'lucide-react';
import { getEnquiries, USER_DATA_CHANGED, type UserEnquiry } from '../../services/user-local.service';

export function UserEnquiries() {
  const [items, setItems] = useState<UserEnquiry[]>(getEnquiries);
  useEffect(() => { const sync = () => setItems(getEnquiries()); window.addEventListener(USER_DATA_CHANGED, sync); return () => window.removeEventListener(USER_DATA_CHANGED, sync); }, []);
  return <div className="container min-h-[65vh] py-10"><div className="mb-8 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><MessageSquareText className="h-5 w-5" /></span><div><h1 className="font-display text-3xl font-extrabold">My Enquiries</h1><p className="text-sm text-muted-foreground">Track product enquiries submitted from your account.</p></div></div>{items.length ? <div className="space-y-3">{items.map((item) => <article key={item.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft"><div className="flex flex-wrap items-start justify-between gap-3"><div><Link to={`/products/${item.productId}`} className="font-display text-lg font-bold hover:text-primary">{item.productName}</Link><p className="mt-2 text-sm text-muted-foreground">{item.message}</p></div><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Submitted</span></div><p className="mt-4 text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString('en-IN')}</p></article>)}</div> : <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center"><MessageSquareText className="mx-auto h-10 w-10 text-primary/40" /><h2 className="mt-4 font-display text-lg font-bold">No enquiries yet</h2><p className="mt-1 text-sm text-muted-foreground">Open a product to send your first enquiry.</p></div>}</div>;
}
