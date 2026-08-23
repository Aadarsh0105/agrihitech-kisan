import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { ProductGrid } from '../../components/products/ProductGrid';
import { getAllProducts } from '../../services/product.service';
import { getFavouriteIds, USER_DATA_CHANGED } from '../../services/user-local.service';
import type { Product } from '../../types';

export function UserFavourites() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => { setLoading(true); const ids = getFavouriteIds(); try { setProducts((await getAllProducts()).filter((item) => ids.includes(item.id))); } finally { setLoading(false); } };
  useEffect(() => { void load(); const sync = () => void load(); window.addEventListener(USER_DATA_CHANGED, sync); return () => window.removeEventListener(USER_DATA_CHANGED, sync); }, []);
  return <div className="container min-h-[65vh] py-10"><div className="mb-8 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-red-50 text-red-500"><Heart className="h-5 w-5 fill-current" /></span><div><h1 className="font-display text-3xl font-extrabold">My Favourites</h1><p className="text-sm text-muted-foreground">Products you saved for later.</p></div></div><ProductGrid products={products} loading={loading} emptyLabel="You have not saved any products yet." /></div>;
}
