import { useEffect, useState } from "react";
import { BadgeCheckIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { PageHeader } from "../../components/admin/shared/PageHeader";
import { DataTable, type Column } from "../../components/admin/shared/DataTable";
import { Thumb } from "../../components/admin/shared/Thumb";
import { Badge, StatusBadge } from "../../components/admin/ui/Badge";
import { Button } from "../../components/admin/ui/Button";
import { Modal, ConfirmDialog } from "../../components/admin/ui/Modal";
import { Field, Input, Select } from "../../components/admin/ui/Input";
import api from "../../api/admin/axios";
import { t } from "../../utils/admin/i18n";
import type { Translated } from "../../types/admin";

type CategoryOption = { _id: string; name: Translated };
type BrandRow = {
  _id: string;
  name: string;
  image?: string;
  category?: { _id?: string; name?: Translated } | string;
  productCount?: number;
  status?: string;
};

export function Brands() {
  const [items, setItems] = useState<BrandRow[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<BrandRow | null>(null);
  const [pendingDelete, setPendingDelete] = useState<BrandRow | null>(null);
  const [draft, setDraft] = useState({ name: "", category: "", image: null as File | null });

  const loadData = () => {
    setLoading(true);
    Promise.all([api.get("/brands"), api.get("/categories")])
      .then(([brandsRes, categoriesRes]) => {
        const brandRows = brandsRes.data?.brands ?? brandsRes.data?.data ?? [];
        const categoryRows = Array.isArray(categoriesRes.data)
          ? categoriesRes.data
          : categoriesRes.data?.categories ?? [];
        setItems(brandRows);
        setCategories(categoryRows);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load brands"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setDraft({ name: "", category: "", image: null });
    setError(null);
    setCreateOpen(true);
  };

  const openEdit = (item: BrandRow) => {
    setEditing(item);
    setDraft({
      name: item.name,
      category: typeof item.category === "string" ? item.category : item.category?._id ?? "",
      image: null
    });
    setError(null);
    setCreateOpen(true);
  };

  const saveBrand = async () => {
    if (!draft.name.trim() || !draft.category) return;
    if (!editing && !draft.image) return;

    setSaving(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", draft.name.trim());
      formData.append("category", draft.category);
      if (draft.image) formData.append("image", draft.image);

      if (editing) {
        await api.put(`/brands/${editing._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        await api.post("/brands/create", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      setCreateOpen(false);
      setEditing(null);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save brand");
    } finally {
      setSaving(false);
    }
  };

  const deleteBrand = async () => {
    if (!pendingDelete) return;
    setSaving(true);
    setError(null);
    try {
      await api.delete(`/brands/${pendingDelete._id}`);
      setPendingDelete(null);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete brand");
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<BrandRow>[] = [
    {
      key: "brand",
      header: "Brand",
      render: (item) => (
        <div className="flex items-center gap-3">
          <Thumb src={item.image ?? ""} alt={item.name} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
            <p className="truncate text-[11px] text-muted-foreground">
              {typeof item.category === "string" ? item.category : t(item.category?.name ?? { en: "" })}
            </p>
          </div>
        </div>
      )
    },
    {
      key: "verified",
      header: "Verification",
      render: () => <Badge tone="info">Live</Badge>
    },
    {
      key: "products",
      header: "Products",
      align: "right",
      render: (item) => <span className="text-xs font-medium">{item.productCount ?? 0}</span>
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={(item.status as any) ?? "draft"} />
    }
  ];

  return (
    <>
      <PageHeader
        title="Brand Management"
        description="Live brands from the backend with create, edit, and delete support."
        actions={
          <Button variant="primary" onClick={openCreate}>
            <PlusIcon className="h-3.5 w-3.5" />
            Add brand
          </Button>
        }
      />

      {error ? (
        <div className="mb-4 rounded-lg border border-danger/20 bg-danger-subtle px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      <DataTable
        columns={[
          ...columns,
          {
            key: "actions",
            header: "",
            align: "right",
            render: (item) => (
              <div className="flex justify-end gap-2">
                <Button variant="secondary" size="sm" onClick={() => openEdit(item)}>
                  Edit
                </Button>
                <Button variant="outlineDanger" size="sm" onClick={() => setPendingDelete(item)}>
                  <Trash2Icon className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            )
          }
        ]}
        items={items}
        isLoading={loading}
        emptyTitle="No brands found"
        emptyMessage="Brands will appear here from the backend API."
      />

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={editing ? "Edit brand" : "Add brand"}
        description="Create or update a brand using the existing backend routes."
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => void saveBrand()}
              disabled={saving || !draft.name.trim() || !draft.category || (!editing && !draft.image)}
            >
              {saving ? "Saving..." : editing ? "Save changes" : "Create brand"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Brand name" required>
            <Input
              value={draft.name}
              onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter brand name"
            />
          </Field>

          <Field label="Category" required>
            <Select
              value={draft.category}
              onChange={(e) => setDraft((prev) => ({ ...prev, category: e.target.value }))}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {t(cat.name)}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Brand image" required={!editing} hint={editing ? "Optional if you don't want to replace the current image" : "Upload a logo or brand image"}>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setDraft((prev) => ({ ...prev, image: e.target.files?.[0] ?? null }))}
            />
          </Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => void deleteBrand()}
        title="Delete brand"
        message="This brand will be permanently removed from the backend."
      />
    </>
  );
}
