import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeft, Building2, ChevronRight, MapPin, Package, Phone, RefreshCw, ShoppingBag, Store } from 'lucide-react';
import { Button } from '../../components/admin/ui/Button';
import { Modal } from '../../components/admin/ui/Modal';
import { useLocation } from '../../context/LocationContext';
import { getMarketplaceBrands, getMarketplaceCategories, getMarketplaceProductSeller, getMarketplaceProducts, type MarketplaceBrand, type MarketplaceCategory, type MarketplaceProduct, type MarketplaceSeller } from '../../services/business.service';
import { BusinessHeader } from './shared';

const messageOf = (error: unknown) => axios.isAxiosError(error)
  ? error.response?.data?.error ?? error.response?.data?.message ?? error.message
  : error instanceof Error ? error.message : 'Unable to load marketplace';

export function BusinessMarketplace() {
  const location = useLocation();
  const [categories, setCategories] = useState<MarketplaceCategory[]>([]);
  const [brands, setBrands] = useState<MarketplaceBrand[]>([]);
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [category, setCategory] = useState<MarketplaceCategory | null>(null);
  const [brand, setBrand] = useState<MarketplaceBrand | null>(null);
  const [selected, setSelected] = useState<MarketplaceProduct | null>(null);
  const [seller, setSeller] = useState<MarketplaceSeller | null>(null);
  const [loading, setLoading] = useState(true);
  const [sellerLoading, setSellerLoading] = useState(false);
  const [waitingForLocation, setWaitingForLocation] = useState(false);
  const [error, setError] = useState('');

  const loadCategories = async () => {
    setLoading(true); setError('');
    try { setCategories(await getMarketplaceCategories()); }
    catch (reason) { setError(messageOf(reason)); }
    finally { setLoading(false); }
  };
  useEffect(() => { void loadCategories(); }, []);

  const selectCategory = async (item: MarketplaceCategory) => {
    setCategory(item); setBrand(null); setProducts([]); setLoading(true); setError('');
    try { setBrands(await getMarketplaceBrands(item._id)); }
    catch (reason) { setError(messageOf(reason)); }
    finally { setLoading(false); }
  };
  const selectBrand = async (item: MarketplaceBrand) => {
    setBrand(item); setLoading(true); setError('');
    try { setProducts(await getMarketplaceProducts(item._id)); }
    catch (reason) { setError(messageOf(reason)); }
    finally { setLoading(false); }
  };
  const openProduct = async (item: MarketplaceProduct) => {
    setSelected(item); setSeller(null); setSellerLoading(true); setError('');
    if (location.latitude === null || location.longitude === null) {
      setWaitingForLocation(true); location.getCurrentLocation(); setSellerLoading(false); return;
    }
    try {
      const details = await getMarketplaceProductSeller(item._id, { latitude: location.latitude, longitude: location.longitude });
      setSelected(details.product); setSeller(details.seller || null);
    } catch (reason) { setError(messageOf(reason)); }
    finally { setSellerLoading(false); }
  };
  useEffect(() => {
    if (waitingForLocation && selected && location.latitude !== null && location.longitude !== null) {
      setWaitingForLocation(false);
      void openProduct(selected);
    }
  }, [waitingForLocation, selected, location.latitude, location.longitude]);
  const back = () => { setError(''); if (brand) { setBrand(null); setProducts([]); } else { setCategory(null); setBrands([]); } };

  const title = brand ? brand.name : category ? category.name : 'B2B Marketplace';
  const description = brand ? 'Products offered by other B2B dealers under this brand.' : category ? 'Choose a brand to explore dealer products.' : 'Browse products from other B2B dealers by category and brand.';

  return <div className="space-y-6">
    <div className="flex items-start gap-3">{category ? <Button size="sm" onClick={back}><ArrowLeft className="h-4 w-4" />Back</Button> : null}<div className="flex-1"><BusinessHeader title={title} description={description} /></div></div>
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><span className={!category ? 'font-semibold text-primary' : ''}>Categories</span>{category ? <><ChevronRight className="h-3.5 w-3.5" /><span className={!brand ? 'font-semibold text-primary' : ''}>{category.name}</span></> : null}{brand ? <><ChevronRight className="h-3.5 w-3.5" /><span className="font-semibold text-primary">{brand.name}</span></> : null}</div>
    {error ? <div className="rounded-xl bg-destructive/10 p-4 text-sm font-medium text-destructive">{error}</div> : null}
    {loading ? <LoadingCards /> : !category ? <CategoryGrid rows={categories} select={selectCategory} /> : !brand ? <BrandGrid rows={brands} select={selectBrand} /> : <ProductGrid rows={products} select={openProduct} />}

    <Modal open={Boolean(selected)} onClose={() => { setSelected(null); setSeller(null); }} title={selected?.name || 'Product details'} size="lg" footer={<Button onClick={() => { setSelected(null); setSeller(null); }}>Close</Button>}>
      {selected ? <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <div className="grid h-52 place-items-center overflow-hidden rounded-2xl bg-muted/60">{selected.images?.[0]?.url ? <img src={selected.images[0].url} alt={selected.name} className="h-full w-full object-contain p-3" /> : <Package className="h-12 w-12 text-muted-foreground/40" />}</div>
        <div><p className="text-sm leading-6 text-muted-foreground">{selected.description || 'No product description provided.'}</p><div className="mt-4 grid grid-cols-2 gap-3"><Info label="Price" value={`INR ${(selected.price || 0).toLocaleString('en-IN')}`} /><Info label="Available" value={`${selected.quantity || 0} ${selected.unit || 'units'}`} /></div></div>
        <section className="rounded-2xl border border-border bg-muted/30 p-5 md:col-span-2"><div className="flex items-center gap-2"><Store className="h-5 w-5 text-primary" /><h3 className="font-display text-lg font-bold">Seller details</h3></div>{sellerLoading || location.loading ? <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><RefreshCw className="h-4 w-4 animate-spin" />Getting seller and distance...</div> : seller ? <div className="mt-4 grid gap-4 sm:grid-cols-2"><div><p className="font-display text-xl font-bold">{seller.firmName || 'Dealer firm'}</p><p className="mt-1 text-sm text-muted-foreground">{seller.proprietorName || 'Registered B2B dealer'}</p><p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{[seller.location?.village, seller.location?.district, seller.location?.state, seller.location?.pincode].filter(Boolean).join(', ') || 'Location unavailable'}</p>{seller.distanceInKm !== undefined ? <p className="mt-2 text-sm font-semibold text-primary">{seller.distanceInKm.toFixed(1)} km away</p> : null}</div><div className="flex items-end sm:justify-end">{seller.mobile ? <a href={`tel:${seller.mobile}`} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground"><Phone className="h-4 w-4" />Call {seller.mobile}</a> : <p className="rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">Seller contact requires an active subscription.</p>}</div></div> : <div className="mt-4"><p className="text-sm text-muted-foreground">Enable location access to calculate distance and load seller details.</p><Button className="mt-3" onClick={() => { setWaitingForLocation(true); location.getCurrentLocation(); }}><MapPin className="h-4 w-4" />Use current location</Button></div>}</section>
      </div> : null}
    </Modal>
  </div>;
}

function CategoryGrid({ rows, select }: { rows: MarketplaceCategory[]; select: (row: MarketplaceCategory) => void }) { return rows.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{rows.map((row) => <button key={row._id} onClick={() => void select(row)} className="group overflow-hidden rounded-2xl border border-border bg-card text-left shadow-soft transition hover:-translate-y-1 hover:border-primary/30"><div className="grid h-36 place-items-center bg-primary/5">{row.image ? <img src={row.image} alt="" className="h-full w-full object-contain p-3" /> : <ShoppingBag className="h-10 w-10 text-primary/40" />}</div><div className="p-4"><h2 className="font-display font-bold">{row.name}</h2><p className="mt-1 text-xs text-muted-foreground">{row.totalBrands || 0} brands</p></div></button>)}</div> : <Empty text="No marketplace categories are available for your business." />; }
function BrandGrid({ rows, select }: { rows: MarketplaceBrand[]; select: (row: MarketplaceBrand) => void }) { return rows.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{rows.map((row) => <button key={row._id} onClick={() => void select(row)} className="overflow-hidden rounded-2xl border border-border bg-card text-left shadow-soft transition hover:-translate-y-1 hover:border-primary/30"><div className="grid h-36 place-items-center bg-muted/50">{row.image ? <img src={row.image} alt="" className="h-full w-full object-contain p-3" /> : <Building2 className="h-10 w-10 text-primary/40" />}</div><div className="p-4"><h2 className="font-display font-bold">{row.name}</h2><p className="mt-1 text-xs text-muted-foreground">{row.productCount || 0} dealer products</p></div></button>)}</div> : <Empty text="No brands currently have products from other B2B dealers." />; }
function ProductGrid({ rows, select }: { rows: MarketplaceProduct[]; select: (row: MarketplaceProduct) => void }) { return rows.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{rows.map((row) => <button key={row._id} onClick={() => void select(row)} className="overflow-hidden rounded-2xl border border-border bg-card text-left shadow-soft transition hover:-translate-y-1 hover:border-primary/30"><div className="grid h-40 place-items-center bg-muted/50">{row.images?.[0]?.url ? <img src={row.images[0].url} alt="" className="h-full w-full object-contain p-3" /> : <Package className="h-10 w-10 text-primary/40" />}</div><div className="p-4"><h2 className="font-display font-bold">{row.name}</h2><p className="mt-2 font-display text-lg font-extrabold">INR {(row.price || 0).toLocaleString('en-IN')}</p><p className="mt-1 text-xs text-muted-foreground">{row.quantity || 0} {row.unit || 'units'} available</p></div></button>)}</div> : <Empty text="No products from other B2B dealers are available under this brand." />; }
function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-muted/60 p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-semibold">{value}</p></div>; }
function LoadingCards() { return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-56 animate-pulse rounded-2xl bg-muted" />)}</div>; }
function Empty({ text }: { text: string }) { return <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center text-sm text-muted-foreground">{text}</div>; }
