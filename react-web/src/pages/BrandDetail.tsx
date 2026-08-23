import { Link, useParams } from 'react-router-dom';
import { BadgeCheck, ChevronRight } from 'lucide-react';
import { Seo } from '../components/layout/Seo';
import { ProductGrid } from '../components/products/ProductGrid';
import { useAsync } from '../hooks/useAsync';
import { getProductsByBrand } from '../services/product.service';

export function BrandDetail() {
  const { slug: brandId = '' } = useParams();
  const resource = useAsync(() => getProductsByBrand(brandId), [brandId]);
  if (resource.loading) return <div className="container py-20 text-center text-muted-foreground">Loading...</div>;
  if (!resource.data) return <div className="container py-24 text-center"><h1 className="font-display text-2xl font-bold">Brand not found</h1><Link to="/brands" className="mt-4 inline-block text-primary">Back to brands</Link></div>;
  const { brand, products } = resource.data;
  return <><Seo title={brand.name} description={`Explore products from ${brand.name}.`} /><div className="border-b border-border bg-secondary/30"><nav className="container flex items-center gap-2 py-3 text-sm text-muted-foreground"><Link to="/brands" className="hover:text-primary">Brands</Link><ChevronRight className="h-4 w-4" /><span className="font-medium text-foreground">{brand.name}</span></nav></div><div className="bg-gradient-to-br from-primary/10 via-background to-emerald-50/60"><div className="container flex flex-col items-center gap-5 py-10 text-center sm:flex-row sm:text-left">{brand.image ? <img src={brand.image} alt={brand.name} className="h-28 w-28 rounded-3xl border border-border bg-white object-contain p-3 shadow-soft" /> : <span className="grid h-28 w-28 place-items-center rounded-3xl bg-primary/10 text-primary"><BadgeCheck className="h-10 w-10" /></span>}<div><p className="text-sm font-semibold text-primary">Verified brand</p><h1 className="mt-1 font-display text-3xl font-extrabold">{brand.name}</h1><p className="mt-2 text-sm text-muted-foreground">{products.length} products available</p></div></div></div><div className="container py-10"><h2 className="mb-6 font-display text-2xl font-bold">Products by {brand.name}</h2><ProductGrid products={products} loading={false} emptyLabel="No products found for this brand." /></div></>;
}
