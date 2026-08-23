import { useDeferredValue, useEffect, useState } from "react";
import { ImageIcon, PlusIcon, RefreshCw, SearchIcon } from "lucide-react";
import api from "../../../api/admin/axios";
import { Button } from "../ui/Button";
import { Field, Input } from "../ui/Input";
import { Modal, ConfirmDialog } from "../ui/Modal";
import { Badge } from "../ui/Badge";
import { PageHeader } from "./PageHeader";
import { DataTable, type Column } from "./DataTable";
import { RowActions } from "./RowActions";
import { RichTextEditor } from "./RichTextEditor";
import { Thumb } from "./Thumb";

type Kind = "news" | "schemes";
type RecordItem = { id: string; _id: string; title: string; slug?: string; summary: string; content: string; image: string; createdAt: string; tags?: string | string[]; eligibility?: string; benefits?: string; applicationProcess?: string; requiredDocuments?: string };
type FormState = Omit<RecordItem, "id" | "_id" | "image" | "createdAt">;

const emptyForm = (kind: Kind): FormState => ({
  title: "", summary: "", content: "",
  ...(kind === "news" ? { slug: "" } : {
    tags: "",
    slug: "",
    benefits: "<h2>Benefits</h2><p><br></p>",
    eligibility: "<h2>Eligibility</h2><p><br></p>",
    applicationProcess: "<h2>Application Process</h2><p><br></p>",
    requiredDocuments: "<h2>Documents Required</h2><p><br></p>"
  })
});
const errorMessage = (error: unknown) => (error as { response?: { data?: { message?: string; error?: string } }; message?: string }).response?.data?.message || (error as { response?: { data?: { error?: string } } }).response?.data?.error || (error as { message?: string }).message || "Request failed";
const plain = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").trim();
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const withHeading = (value: string | undefined, heading: string) => {
  const content = value || "";
  if (!plain(content)) return `<h2>${heading}</h2><p><br></p>`;
  return plain(content).toLowerCase().includes(heading.toLowerCase()) ? content : `<h2>${heading}</h2>${content}`;
};

export function EditorialManager({ kind }: { kind: Kind }) {
  const isNews = kind === "news";
  const label = isNews ? "News" : "Anudan Yojana";
  const [items, setItems] = useState<RecordItem[]>([]), [page, setPage] = useState(1), [totalPages, setTotalPages] = useState(1), [total, setTotal] = useState(0);
  const [search, setSearch] = useState(""), deferredSearch = useDeferredValue(search);
  const [loading, setLoading] = useState(true), [saving, setSaving] = useState(false), [error, setError] = useState("");
  const [open, setOpen] = useState(false), [editing, setEditing] = useState<RecordItem | null>(null), [pendingDelete, setPendingDelete] = useState<RecordItem | null>(null);
  const [form, setForm] = useState<FormState>(() => emptyForm(kind)), [file, setFile] = useState<File | null>(null), [preview, setPreview] = useState("");
  const limit = 8;
  const load = async () => {
    setLoading(true); setError("");
    try {
      const { data } = await api.get(`/${kind}`, { params: { page, limit, search: deferredSearch || undefined } });
      const records = (data?.[kind] ?? []).map((item: RecordItem) => ({ ...item, id: item._id }));
      setItems(records); setTotal(data?.pagination?.total ?? records.length); setTotalPages(data?.pagination?.totalPages ?? 1);
    } catch (reason) { setError(errorMessage(reason)); } finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, [kind, page, deferredSearch]);
  useEffect(() => { setPage(1); }, [deferredSearch]);
  useEffect(() => { if (!file) { setPreview(""); return; } const url = URL.createObjectURL(file); setPreview(url); return () => URL.revokeObjectURL(url); }, [file]);
  const set = (key: keyof FormState, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const startCreate = () => { setEditing(null); setForm(emptyForm(kind)); setFile(null); setOpen(true); };
  const startEdit = (item: RecordItem) => { setEditing(item); setForm({
    ...emptyForm(kind),
    ...item,
    tags: Array.isArray(item.tags) ? item.tags.join(", ") : item.tags,
    ...(!isNews ? {
      benefits: withHeading(item.benefits, "Benefits"),
      eligibility: withHeading(item.eligibility, "Eligibility"),
      applicationProcess: withHeading(item.applicationProcess, "Application Process"),
      requiredDocuments: withHeading(item.requiredDocuments, "Documents Required")
    } : {})
  }); setFile(null); setOpen(true); };
  const close = () => { setOpen(false); setEditing(null); setFile(null); };
  const save = async () => {
    if (!form.title.trim() || !plain(form.content) || (isNews && !editing && !file)) { setError(isNews ? "Complete all required fields and select an image." : "Title and details are required."); return; }
    setSaving(true); setError("");
    try {
      if (isNews) {
        const data = new FormData();
        data.append("title", form.title);
        data.append("slug", form.slug || "");
        data.append("content", form.content);
        if (file) data.append("image", file);
        const multipartConfig = { headers: { "Content-Type": "multipart/form-data" } };
        if (editing) await api.put(`/${kind}/${editing._id}`, data, multipartConfig);
        else await api.post(`/${kind}`, data, multipartConfig);
      } else {
        const schemePayload = {
          title: form.title,
          slug: form.slug,
          tags: form.tags,
          content: form.content,
          benefits: form.benefits,
          eligibility: form.eligibility,
          applicationProcess: form.applicationProcess,
          requiredDocuments: form.requiredDocuments
        };
        if (editing) await api.put(`/${kind}/${editing._id}`, schemePayload);
        else await api.post(`/${kind}`, schemePayload);
      }
      close(); if (page !== 1) setPage(1); else await load();
    } catch (reason) { setError(errorMessage(reason)); } finally { setSaving(false); }
  };
  const remove = async () => {
    if (!pendingDelete) return;
    try { await api.delete(`/${kind}/${pendingDelete._id}`); setPendingDelete(null); if (items.length === 1 && page > 1) setPage(page - 1); else await load(); }
    catch (reason) { setError(errorMessage(reason)); }
  };
  const columns: Column<RecordItem>[] = [
    { key: "content", header: isNews ? "Article" : "Scheme", render: (item) => <div className="flex items-center gap-3">{isNews ? <Thumb src={item.image} alt={item.title} size="lg" /> : null}<div className="min-w-0 max-w-md"><p className="truncate text-sm font-medium">{item.title}</p><p className="line-clamp-1 text-xs text-muted-foreground">{item.summary || plain(item.content)}</p></div></div> },
    ...(!isNews ? [{ key: "type", header: "Tags", render: (item: RecordItem) => <div className="flex max-w-xs flex-wrap gap-1">{(Array.isArray(item.tags) ? item.tags : []).slice(0, 3).map((tag) => <Badge key={tag} tone="primary">{tag}</Badge>)}</div> } as Column<RecordItem>] : []),
    { key: "created", header: "Latest first", render: (item) => <span className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</span> },
    { key: "actions", header: "", align: "right", render: (item) => <RowActions onEdit={() => startEdit(item)} onDelete={() => setPendingDelete(item)} /> }
  ];
  return <>
    <PageHeader title={`${label} Management`} description={`Create and manage ${label.toLowerCase()} content, newest entries first.`} actions={<><Button variant="secondary" onClick={() => void load()}><RefreshCw className="h-3.5 w-3.5" />Refresh</Button><Button variant="primary" onClick={startCreate}><PlusIcon className="h-3.5 w-3.5" />Add {isNews ? "article" : "scheme"}</Button></>} />
    <div className="my-4 flex flex-wrap gap-3 rounded-lg border border-border bg-surface p-3"><div className="relative min-w-60 flex-1"><SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${label.toLowerCase()}...`} className="pl-9" /></div></div>
    {error ? <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
    <DataTable columns={columns} items={items} isLoading={loading} page={page} totalPages={totalPages} totalItems={total} pageSize={limit} onPageChange={setPage} emptyTitle={`No ${label.toLowerCase()} found`} emptyMessage="Create the first entry or adjust the current filters." />
    <Modal open={open} onClose={close} size="xl" title={editing ? `Edit ${label}` : `Add ${label}`} description="Use the formatting toolbar for structured, readable content." footer={<><Button variant="secondary" onClick={close}>Cancel</Button><Button variant="primary" disabled={saving} onClick={() => void save()}>{saving ? "Saving..." : editing ? "Save changes" : "Create"}</Button></>}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title" required className="md:col-span-2"><Input value={form.title} onChange={(e) => { set("title", e.target.value); if (!form.slug || form.slug === slugify(form.title)) set("slug", slugify(e.target.value)); }} /></Field>
        {isNews ? <Field label="Slug" hint="Used in the public news URL" className="md:col-span-2"><Input value={form.slug || ""} onChange={(e) => set("slug", slugify(e.target.value))} placeholder="news-url-slug" /></Field> : <><Field label="Tags" hint="Comma separated, for example: Farmer, Loan, Financial"><Input value={String(form.tags || "")} onChange={(e) => set("tags", e.target.value)} /></Field><Field label="Slug" hint="Used in the public scheme URL"><Input value={form.slug || ""} onChange={(e) => set("slug", slugify(e.target.value))} placeholder="scheme-url-slug" /></Field></>}
        {isNews ? <><Field label={editing ? "Replace image" : "Image"} required={!editing}><Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></Field><div className="md:col-span-2">{preview || editing?.image ? <img src={preview || editing?.image} alt="Preview" className="h-40 w-full rounded-lg border border-border object-cover" /> : <div className="flex h-28 items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground"><ImageIcon className="mr-2 h-5 w-5" />Image preview</div>}</div></> : null}
        <Field label={isNews ? "Main content" : "Details"} required className={isNews ? "min-w-0 md:col-span-2" : "min-w-0"}><RichTextEditor value={form.content} onChange={(value) => set("content", value)} placeholder={isNews ? "Write the full content..." : "Explain the scheme details..."} /></Field>
        {!isNews ? <><Field label="Benefits" className="min-w-0"><RichTextEditor value={form.benefits || ""} onChange={(value) => set("benefits", value)} placeholder="Add details below the Benefits heading..." /></Field><Field label="Eligibility" className="min-w-0"><RichTextEditor value={form.eligibility || ""} onChange={(value) => set("eligibility", value)} placeholder="Add details below the Eligibility heading..." /></Field><Field label="Application process" className="min-w-0"><RichTextEditor value={form.applicationProcess || ""} onChange={(value) => set("applicationProcess", value)} placeholder="Add steps below the Application Process heading..." /></Field><Field label="Documents required" className="min-w-0"><RichTextEditor value={form.requiredDocuments || ""} onChange={(value) => set("requiredDocuments", value)} placeholder="Add items below the Documents Required heading..." /></Field></> : null}
      </div>
    </Modal>
    <ConfirmDialog open={Boolean(pendingDelete)} onClose={() => setPendingDelete(null)} onConfirm={() => void remove()} title={`Delete ${label}`} message={`This ${label.toLowerCase()} entry will be permanently removed.`} />
  </>;
}
