import { useState } from 'react';
import { MapPin, ShoppingCart } from 'lucide-react';
import { Button } from '../../components/admin/ui/Button';
import { Field, Input } from '../../components/admin/ui/Input';
import { Modal } from '../../components/admin/ui/Modal';
import { useDealerData } from '../../hooks/useDealerData';
import { dealerStore, type DealerListing } from '../../services/dealer-local.service';
import { BusinessEmpty, BusinessHeader } from './shared';

export function BusinessBuyProducts() {
  const listings = useDealerData(dealerStore.listings);
  const [selected, setSelected] = useState<DealerListing | null>(null);
  const [quantity, setQuantity] = useState(1);
  const buy = () => { if (selected && quantity > 0 && quantity <= selected.quantity) dealerStore.buy(selected, quantity); setSelected(null); };
  return <div className="space-y-6"><BusinessHeader title="Buy Products" description="Browse wholesale listings shared in the B2B marketplace." />{listings.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{listings.map((item) => <article key={item.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft"><div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-wide text-primary">{item.category || 'General'}</p><h2 className="mt-1 font-display text-lg font-bold">{item.productName}</h2></div><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">In stock</span></div><p className="mt-3 text-sm text-muted-foreground">Sold by {item.sellerName}</p><p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{item.location || 'Location not provided'}</p><div className="mt-5 flex items-end justify-between border-t border-border pt-4"><div><p className="font-display text-xl font-bold">INR {item.price.toLocaleString('en-IN')}</p><p className="text-xs text-muted-foreground">per {item.unit} · {item.quantity} available</p></div><Button variant="primary" size="sm" onClick={() => { setSelected(item); setQuantity(1); }}><ShoppingCart className="h-4 w-4" />Buy</Button></div></article>)}</div> : <BusinessEmpty text="No wholesale products are listed yet. Add a sell listing to populate the marketplace." />}<Modal open={Boolean(selected)} onClose={() => setSelected(null)} title="Place wholesale order" description={selected ? `${selected.productName} from ${selected.sellerName}` : ''} footer={<><Button onClick={() => setSelected(null)}>Cancel</Button><Button variant="primary" disabled={!selected || quantity < 1 || quantity > selected.quantity} onClick={buy}>Place order</Button></>}><Field label={`Quantity (${selected?.unit ?? 'units'})`} required><Input type="number" min="1" max={selected?.quantity} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} /></Field>{selected ? <p className="mt-4 text-sm text-muted-foreground">Order total: <strong className="text-foreground">INR {(selected.price * quantity).toLocaleString('en-IN')}</strong></p> : null}</Modal></div>;
}
