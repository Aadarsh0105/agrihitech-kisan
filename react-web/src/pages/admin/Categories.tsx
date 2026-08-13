import { useEffect, useState } from "react";
import { FolderTreeIcon, PlusIcon } from "lucide-react";
import { PageHeader } from "../../components/admin/shared/PageHeader";
import { DataTable, type Column } from "../../components/admin/shared/DataTable";
import { Thumb } from "../../components/admin/shared/Thumb";
import { Badge, StatusBadge } from "../../components/admin/ui/Badge";
import { Button } from "../../components/admin/ui/Button";
import { Modal } from "../../components/admin/ui/Modal";
import { Field, Input } from "../../components/admin/ui/Input";
import { formatNumber } from "../../utils/admin/format";
import { t } from "../../utils/admin/i18n";
import api from "../../api/admin/axios";
import type { Translated } from "../../types/admin";

type CategoryRow = {
  _id: string;
  id?: string;
  name: Translated;
  slug?: string;
  description?: Translated;
  image?: string;
  icon?: string;
  featured?: boolean;
  order?: number;
  productCount?: number;
  status?: string;
  seo?: { metaDescription?: string };
};

export function Categories() {
  const [items, setItems] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = () => {
    setLoading(true);
    api.get("/categories")
      .then((res) => {
        const rows = Array.isArray(res.data) ? res.data : res.data?.categories ?? [];
        setItems(rows);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreate = () => {
    setName("");
    setImage(null);
    setError(null);
    setCreateOpen(true);
  };

  const saveCategory = async () => {
    if (!name.trim() || !image) return;
    setSaving(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("image", image);
      await api.post("/categories/create", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setCreateOpen(false);
      loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create category");
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<CategoryRow>[] = [
    {
      key: "category",
      header: "Category",
      render: (item) => (
        <div className="flex items-center gap-3">
          <Thumb src={item.image ?? ""} alt={t(item.name)} />
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 truncate text-sm font-medium text-foreground">
              {t(item.name)}
            </p>
            <p className="truncate font-mono text-[11px] text-muted-foreground">/{item.slug}</p>
          </div>
        </div>
      )
    },
    {
      key: "products",
      header: "Products",
      align: "right",
      render: (item) => <span className="text-xs font-medium">{formatNumber(item.productCount ?? 0)}</span>
    },
    {
      key: "seo",
      header: "SEO",
      render: (item) => (
        <Badge tone={item.seo?.metaDescription ? "success" : "warning"}>
          {item.seo?.metaDescription ? "Complete" : "Missing meta"}
        </Badge>
      )
    },
    {
      key: "order",
      header: "Order",
      align: "center",
      render: (item) => <span className="text-xs">{item.order ?? "-"}</span>
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
        title="Category Management"
        description="Live top-level catalogue categories from the backend."
        actions={
          <Button variant="primary" onClick={openCreate}>
            <PlusIcon className="h-3.5 w-3.5" />
            Add category
          </Button>
        }
      />
      {error ? (
        <div className="mb-4 rounded-lg border border-danger/20 bg-danger-subtle px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}
      <DataTable
        columns={columns}
        items={items}
        isLoading={loading}
        emptyTitle="No categories found"
        emptyMessage="Categories will appear here from the backend API."
      />

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Add category"
        description="Create a new top-level category in the backend."
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => void saveCategory()}
              disabled={saving || !name.trim() || !image}
            >
              {saving ? "Saving..." : "Create category"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Category name" required>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter category name" />
          </Field>
          <Field label="Category image" required hint="Choose an image file for the category">
            <Input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
          </Field>
        </div>
      </Modal>
    </>
  );
}
