import { useEffect, useState } from "react";
import { ArrowLeft, Building2, MapPin, Package, Phone, Tags, UserRound } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "../../components/admin/ui/Badge";
import { Card } from "../../components/admin/ui/Card";
import { getAdminAccount, type AccountBrand, type AccountProduct, type AccountRole, type AdminAccount } from "../../services/admin-account.service";

const basePath: Record<AccountRole, string> = { B2B: "/admin/dealers", COMPANY: "/admin/companies", B2C: "/admin/users" };
const roleTitle: Record<AccountRole, string> = { B2B: "Dealer", COMPANY: "Company", B2C: "B2C User" };
const nameOf = (account: AdminAccount) => account.firmName || account.companyName || account.proprietorName || account.contactPerson || `User ${account.mobile.slice(-4)}`;
const brandsOf = (role: AccountRole, account: AdminAccount, ownedBrands: AccountBrand[]) => role === "B2B" ? account.dealerBrands || [] : role === "COMPANY" ? ownedBrands : [];

export function AccountDetail({ role }: { role: AccountRole }) {
  const { id = "" } = useParams();
  const [account, setAccount] = useState<AdminAccount | null>(null), [brands, setBrands] = useState<AccountBrand[]>([]), [products, setProducts] = useState<AccountProduct[]>([]);
  const [loading, setLoading] = useState(true), [error, setError] = useState("");
  useEffect(() => {
    let active = true; setLoading(true); setError("");
    getAdminAccount(id).then((data) => { if (!active) return; if (data.account.role !== role) throw new Error("Account role does not match this directory"); setAccount(data.account); setBrands(brandsOf(role, data.account, data.ownedBrands)); setProducts(data.products || []); }).catch((reason) => active && setError(reason?.response?.data?.message || reason?.message || "Unable to load account.")) .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [id, role]);

  if (loading) return <div className="grid min-h-72 place-items-center text-sm text-muted-foreground">Loading account details...</div>;
  if (error || !account) return <div className="space-y-4"><Link to={basePath[role]} className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft className="h-4 w-4" />Back</Link><Card className="p-10 text-center text-sm text-red-600">{error}</Card></div>;
  const location = [account.location?.village, account.location?.district, account.location?.state, account.location?.pincode].filter(Boolean).join(", ") || "Not provided";

  return <div className="space-y-5">
    <Link to={basePath[role]} className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft className="h-4 w-4" />Back to {roleTitle[role]}s</Link>
    <Card className="p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div className="flex items-center gap-4">{account.profileimage ? <img src={account.profileimage} alt={nameOf(account)} className="h-16 w-16 rounded-xl object-cover" /> : <span className="grid h-16 w-16 place-items-center rounded-xl bg-primary/10 text-primary">{role === "COMPANY" ? <Building2 className="h-7 w-7" /> : <UserRound className="h-7 w-7" />}</span>}<div><div className="flex flex-wrap items-center gap-2"><h1 className="text-xl font-bold">{nameOf(account)}</h1><Badge tone={account.isVerified ? "success" : "warning"}>{account.isVerified ? "Verified" : "Unverified"}</Badge></div><p className="mt-1 text-sm text-muted-foreground">{roleTitle[role]} account · Joined {new Date(account.createdAt).toLocaleDateString()}</p></div></div></div></Card>
    <div className="grid gap-5 lg:grid-cols-2">
      <Card className="p-5"><h2 className="font-semibold">Profile details</h2><dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2"><div><dt className="text-xs text-muted-foreground">Mobile</dt><dd className="mt-1 flex items-center gap-2 font-medium"><Phone className="h-3.5 w-3.5 text-primary" />{account.mobile}</dd></div><div><dt className="text-xs text-muted-foreground">Location</dt><dd className="mt-1 flex gap-2 font-medium"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />{location}</dd></div>{account.proprietorName ? <div><dt className="text-xs text-muted-foreground">Proprietor</dt><dd className="mt-1 font-medium">{account.proprietorName}</dd></div> : null}{account.contactPerson ? <div><dt className="text-xs text-muted-foreground">Contact person</dt><dd className="mt-1 font-medium">{account.contactPerson}</dd></div> : null}{account.email ? <div><dt className="text-xs text-muted-foreground">Email</dt><dd className="mt-1 font-medium">{account.email}</dd></div> : null}{account.gstNumber ? <div><dt className="text-xs text-muted-foreground">GST number</dt><dd className="mt-1 font-medium">{account.gstNumber}</dd></div> : null}</dl></Card>
      <Card className="p-5"><h2 className="font-semibold">Subscription</h2><div className="mt-4 text-sm"><p className="font-medium">{account.subscription?.planId?.name || "No active plan"}</p><p className="mt-1 text-muted-foreground">Payment: {account.subscription?.paymentStatus || "Not available"}</p>{account.subscription?.endDate ? <p className="mt-1 text-muted-foreground">Expires: {new Date(account.subscription.endDate).toLocaleDateString()}</p> : null}<Badge className="mt-3" tone={account.subscription?.isActive ? "success" : "neutral"}>{account.subscription?.isActive ? "Active" : "Inactive"}</Badge></div></Card>
    </div>
    {role === "B2B" ? <Card className="p-5"><h2 className="flex items-center gap-2 font-semibold"><Tags className="h-4 w-4 text-primary" />Registered categories</h2><div className="mt-4 flex flex-wrap gap-2">{account.categories?.length ? account.categories.map((category) => <Badge key={category} tone="primary">{category}</Badge>) : <span className="text-sm text-muted-foreground">No categories assigned.</span>}</div></Card> : null}
    {role !== "B2C" ? <Card className="p-5"><h2 className="font-semibold">{role === "B2B" ? "Assigned brands" : "Owned brands"} ({brands.length})</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{brands.length ? brands.map((brand) => <div key={brand._id} className="flex items-center gap-3 rounded-lg border border-border p-3">{brand.image ? <img src={brand.image} alt={brand.name} className="h-10 w-10 rounded-md object-cover" /> : <span className="h-10 w-10 rounded-md bg-muted" />}<div><p className="text-sm font-medium">{brand.name}</p><p className="text-xs text-muted-foreground">{brand.category?.name || "No category"}</p></div></div>) : <p className="text-sm text-muted-foreground">No brands found.</p>}</div></Card> : null}
    {role !== "B2C" ? <Card className="p-5"><h2 className="flex items-center gap-2 font-semibold"><Package className="h-4 w-4 text-primary" />Products ({products.length})</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{products.length ? products.map((product) => <div key={product._id} className="rounded-lg border border-border p-3"><p className="text-sm font-medium">{product.name}</p><p className="mt-1 text-xs text-muted-foreground">{product.category?.name || "No category"} · Quantity {product.quantity ?? 0}</p></div>) : <p className="text-sm text-muted-foreground">No products found.</p>}</div></Card> : null}
  </div>;
}
