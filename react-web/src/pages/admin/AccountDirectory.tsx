import { useDeferredValue, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Power, PowerOff, SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/admin/shared/PageHeader";
import { RowActions } from "../../components/admin/shared/RowActions";
import { Badge, StatusBadge } from "../../components/admin/ui/Badge";
import { Button } from "../../components/admin/ui/Button";
import { Input, Select } from "../../components/admin/ui/Input";
import { getAdminAccounts, updateAdminAccountStatus, type AccountRole, type AdminAccount } from "../../services/admin-account.service";

const config: Record<AccountRole, { title: string; description: string; path: string }> = {
  B2B: { title: "Dealers / B2B", description: "Manage registered dealer accounts, assigned categories, and companies.", path: "/admin/dealers" },
  COMPANY: { title: "Companies", description: "Manage company accounts and their catalogue relationships.", path: "/admin/companies" },
  B2C: { title: "B2C Users", description: "Manage registered farmer and customer accounts.", path: "/admin/users" }
};
type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";
const nameOf = (account: AdminAccount) => account.firmName || account.companyName || account.proprietorName || account.contactPerson || `User ${account.mobile.slice(-4)}`;
const locationOf = (account: AdminAccount) => [account.location?.village, account.location?.district, account.location?.state].filter(Boolean).join(", ") || "Not provided";

export function AccountDirectory({ role }: { role: AccountRole }) {
  const meta = config[role];
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<AdminAccount[]>([]), [page, setPage] = useState(1), [totalPages, setTotalPages] = useState(1), [total, setTotal] = useState(0);
  const [search, setSearch] = useState(""), deferredSearch = useDeferredValue(search), [status, setStatus] = useState<StatusFilter>("ALL"), [loading, setLoading] = useState(true), [changingId, setChangingId] = useState(""), [error, setError] = useState("");
  const limit = 10;
  const load = () => {
    let active = true; setLoading(true); setError("");
    getAdminAccounts(role, page, limit, deferredSearch, status).then((data) => { if (!active) return; setAccounts(data.accounts); setTotal(data.pagination.total); setTotalPages(data.pagination.totalPages); }).catch((reason) => active && setError(reason?.response?.data?.message || "Unable to load accounts.")).finally(() => active && setLoading(false));
    return () => { active = false; };
  };
  useEffect(() => { setPage(1); }, [deferredSearch, role, status]);
  useEffect(load, [role, page, deferredSearch, status]);
  const toggleStatus = async (account: AdminAccount) => {
    setChangingId(account._id); setError("");
    try { const updated = await updateAdminAccountStatus(account._id, account.isActive === false); setAccounts((rows) => rows.map((row) => row._id === updated._id ? updated : row)); }
    catch (reason: any) { setError(reason?.response?.data?.message || "Unable to update account status."); }
    finally { setChangingId(""); }
  };

  return <>
    <PageHeader title={meta.title} description={meta.description} />
    <div className="my-4 flex flex-col gap-3 rounded-lg border border-border bg-surface p-3 sm:flex-row"><div className="relative flex-1 sm:max-w-md"><SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder={`Search ${meta.title.toLowerCase()}...`} /></div><Select className="sm:w-44" value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)}><option value="ALL">All accounts</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></Select></div>
    {error ? <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
    <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-card">
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-muted/60 text-[11px] uppercase tracking-wide text-muted-foreground"><tr><th className="px-4 py-3">Account</th><th className="px-4 py-3">Mobile</th><th className="px-4 py-3">Location</th><th className="px-4 py-3">Categories / Companies</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Joined</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-border">
        {loading ? <tr><td colSpan={7} className="px-4 py-14 text-center text-muted-foreground">Loading accounts...</td></tr> : accounts.length === 0 ? <tr><td colSpan={7} className="px-4 py-14 text-center text-muted-foreground">No accounts found.</td></tr> : accounts.map((account) => <tr key={account._id} className="hover:bg-muted/40"><td className="px-4 py-3"><p className="font-medium">{nameOf(account)}</p><Badge tone={account.isVerified ? "success" : "warning"}>{account.isVerified ? "Verified" : "Unverified"}</Badge></td><td className="px-4 py-3">{account.mobile}</td><td className="px-4 py-3 text-muted-foreground">{locationOf(account)}</td><td className="px-4 py-3 text-muted-foreground">{role === "B2B" ? `${account.categories?.length || 0} categories, ${account.dealerBrands?.length || 0} companies` : role === "COMPANY" ? "View catalogue" : "Farmer"}</td><td className="px-4 py-3"><StatusBadge status={account.isActive === false ? "inactive" : "active"} /></td><td className="px-4 py-3 text-muted-foreground">{new Date(account.createdAt).toLocaleDateString()}</td><td className="px-4 py-3 text-right"><div className="flex justify-end"><RowActions menuClassName="!bg-white shadow-xl" onView={() => navigate(`${meta.path}/${account._id}`)} extra={[{ label: changingId === account._id ? "Saving..." : account.isActive === false ? "Activate" : "Deactivate", icon: account.isActive === false ? <Power className="h-3.5 w-3.5" /> : <PowerOff className="h-3.5 w-3.5" />, danger: account.isActive !== false, onClick: () => { if (changingId !== account._id) void toggleStatus(account); } }]} /></div></td></tr>)}
      </tbody></table></div>
      {!loading && total > 0 ? <div className="flex items-center justify-between border-t border-border px-4 py-3"><span className="text-xs text-muted-foreground">{total} accounts</span><div className="flex items-center gap-2"><Button size="iconSm" variant="secondary" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}><ChevronLeft className="h-4 w-4" /></Button><span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span><Button size="iconSm" variant="secondary" disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)}><ChevronRight className="h-4 w-4" /></Button></div></div> : null}
    </div>
  </>;
}
