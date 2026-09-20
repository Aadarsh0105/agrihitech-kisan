import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FlameIcon, PackageIcon, PlusIcon, StarIcon, Trash2Icon } from "lucide-react";
import { PageHeader } from "../../components/admin/shared/PageHeader";
import { DataTable, type Column } from "../../components/admin/shared/DataTable";
import { FilterBar } from "../../components/admin/shared/FilterBar";
import { RowActions } from "../../components/admin/shared/RowActions";
import { Thumb } from "../../components/admin/shared/Thumb";
import { Button } from "../../components/admin/ui/Button";
import { StatusBadge } from "../../components/admin/ui/Badge";
import { ConfirmDialog, Modal } from "../../components/admin/ui/Modal";
import { Field, Input, Select, Textarea } from "../../components/admin/ui/Input";
import { useTableState } from "../../hooks/admin/useTableState";
import api from "../../api/admin/axios";
import { formatCurrency, formatDate } from "../../utils/admin/format";
import { t } from "../../utils/admin/i18n";
import type { Translated } from "../../types/admin";

type BrandOption = { _id: string; name: string };
type CategoryOption = { _id: string; name: string | Translated };
type ProductRow = {
  _id: string;
  id?: string;
  name: string | Translated;
  slug?: string;
  brand?: Array<{ _id: string; name: string; image?: string }> | { _id: string; name: string; image?: string }[];
  category?: { _id?: string; name?: string | Translated } | null;
  subCategory?: { _id?: string; name?: string | Translated } | null;
  price?: number;
  images?: { url: string }[];
  brandVariant?: string;
  qualityGrade?: string;
  suitableCrops?: string[];
  keyBenefits?: string[];
  safetyPrecautions?: string;
  specifications?: {
    activeIngredient?: string;
    targetPests?: string;
    safetyPeriod?: string;
    packSize?: string;
    storage?: string;
  };
  updatedAt?: string;
  status?: string;
  featured?: boolean;
  trending?: boolean;
};

const emptyDraft = {
  name: "",
  brand: "",
  category: "",
  subCategory: "",
  price: 0,
  description: "",
  quantity: 0,
  unit: "",
  brandVariant: "",
  qualityGrade: "",
  suitableCrops: "",
  keyBenefits: "",
  safetyPrecautions: "",
  activeIngredient: "",
  targetPests: "",
  safetyPeriod: "",
  packSize: "",
  storage: "",
  images: null as File[] | null
};

const fieldText = (value: string | Translated | undefined) =>
  typeof value === "string" ? value : t(value);

const apiError = (err: unknown, fallback: string) => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.error ?? err.response?.data?.message ?? err.message;
  }
  return err instanceof Error ? err.message : fallback;
};

export function Products() {
  const [items, setItems] = useState<ProductRow[]>([]);
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [subCategories, setSubCategories] = useState<Array<{ _id: string; name: string }>>([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ProductRow | null>(null);
  const [draft, setDraft] = useState({ ...emptyDraft });

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.get("/products"),
      api.get("/categories", { params: { page: 1, limit: 100 } })
    ])
      .then(([productsRes, categoriesRes]) => {
        setItems(productsRes.data?.products ?? []);
        setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : categoriesRes.data?.categories ?? []);
      })
      .catch((err) => setError(apiError(err, "Failed to load products")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadSubCategories = async (categoryId: string) => {
    if (!categoryId) { setSubCategories([]); return; }
    try {
      const response = await api.get('/subcategories', { params: { categoryId } });
      setSubCategories(response.data.subCategories || []);
    } catch { setSubCategories([]); }
  };

  const loadBrandsForCategory = async (categoryId: string) => {
    if (!categoryId) {
      setBrands([]);
      return;
    }

    setLoadingBrands(true);
    try {
      const response = await api.get(`/categories/${categoryId}/brands`, {
        params: { page: 1, limit: 100 }
      });
      setBrands(response.data?.brands ?? []);
    } catch (err) {
      setBrands([]);
      setError(apiError(err, "Failed to load brands for this category"));
    } finally {
      setLoadingBrands(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setBrands([]);
    setDraft({ ...emptyDraft });
    setError(null);
    setCreateOpen(true);
  };

  const openEdit = (item: ProductRow) => {
    const brandId = Array.isArray(item.brand) ? item.brand?.[0]?._id ?? "" : "";
    const categoryId = item.category?._id ?? "";
    setEditing(item);
    setDraft({
      name: typeof item.name === "string" ? item.name : t(item.name),
      brand: brandId,
      category: categoryId,
      subCategory: item.subCategory?._id ?? "",
      price: item.price ?? 0,
      description: "",
      quantity: 0,
      unit: "",
      brandVariant: item.brandVariant ?? "",
      qualityGrade: item.qualityGrade ?? "",
      suitableCrops: item.suitableCrops?.join(", ") ?? "",
      keyBenefits: item.keyBenefits?.join(", ") ?? "",
      safetyPrecautions: item.safetyPrecautions ?? "",
      activeIngredient: item.specifications?.activeIngredient ?? "",
      targetPests: item.specifications?.targetPests ?? "",
      safetyPeriod: item.specifications?.safetyPeriod ?? "",
      packSize: item.specifications?.packSize ?? "",
      storage: item.specifications?.storage ?? "",
      images: null
    });
    setError(null);
    setCreateOpen(true);
    void loadBrandsForCategory(categoryId);
    void loadSubCategories(categoryId);
  };

  const saveProduct = async () => {
    if (!draft.name.trim() || !draft.category || !draft.brand || (subCategories.length && !draft.subCategory)) return;
    if (!editing && !draft.images?.length) return;

    setSaving(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", draft.name.trim());
      formData.append("category", draft.category);
      if (draft.subCategory) formData.append("subCategory", draft.subCategory);
      formData.append("price", String(draft.price || 0));
      formData.append("description", draft.description);
      formData.append("quantity", String(draft.quantity || 0));
      formData.append("unit", draft.unit);
      formData.append("brandVariant", draft.brandVariant);
      formData.append("qualityGrade", draft.qualityGrade);
      formData.append("safetyPrecautions", draft.safetyPrecautions);
      formData.append("specifications[activeIngredient]", draft.activeIngredient);
      formData.append("specifications[targetPests]", draft.targetPests);
      formData.append("specifications[safetyPeriod]", draft.safetyPeriod);
      formData.append("specifications[packSize]", draft.packSize);
      formData.append("specifications[storage]", draft.storage);
      draft.suitableCrops.split(",").map((value) => value.trim()).filter(Boolean)
        .forEach((value) => formData.append("suitableCrops[]", value));
      draft.keyBenefits.split(",").map((value) => value.trim()).filter(Boolean)
        .forEach((value) => formData.append("keyBenefits[]", value));
      if (editing) {
        formData.append("brand", draft.brand);
      } else {
        formData.append("brand[]", draft.brand);
      }
      if (draft.images?.length) {
        draft.images.forEach((file) => formData.append("images", file));
      }

      if (editing) {
        await api.put(`/products/${editing._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        await api.post("/products/create", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      setCreateOpen(false);
      setEditing(null);
      loadData();
    } catch (err) {
      setError(apiError(err, "Failed to save product"));
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async () => {
    if (!pendingDelete) return;
    setSaving(true);
    setError(null);
    try {
      await api.delete(`/products/${pendingDelete._id}`);
      setPendingDelete(null);
      loadData();
    } catch (err) {
      setError(apiError(err, "Failed to delete product"));
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<ProductRow>[] = [
    {
      key: "product",
      header: "Product",
      render: (item) => (
        <div className="flex items-center gap-3">
          <Thumb src={item.images?.[0]?.url ?? ""} alt={typeof item.name === "string" ? item.name : t(item.name)} size="lg" />
          <div className="min-w-0 max-w-xs">
            <p className="flex items-center gap-1.5 truncate text-sm font-medium text-foreground">
              {typeof item.name === "string" ? item.name : t(item.name)}
              {item.featured ? <StarIcon className="h-3 w-3 fill-warning text-warning" /> : null}
              {item.trending ? <FlameIcon className="h-3 w-3 text-danger" /> : null}
            </p>
            <p className="truncate font-mono text-[11px] text-muted-foreground">/{item.slug ?? ""}</p>
          </div>
        </div>
      )
    },
    {
      key: "category",
      header: "Category",
      render: (item) => <span className="text-xs">{item.category ? fieldText(item.category.name) : "-"}</span>
    },
    {
      key: "brand",
      header: "Brand",
      render: (item) => <span className="text-xs">{Array.isArray(item.brand) ? item.brand.map((b) => b.name).join(", ") : "-"}</span>
    },
    {
      key: "price",
      header: "Price",
      align: "right",
      render: (item) => (
        <div>
          <p className="text-xs font-medium text-foreground">{formatCurrency(item.price ?? 0)}</p>
        </div>
      )
    },
    { key: "updated", header: "Updated", render: (item) => <span className="text-xs text-muted-foreground">{formatDate(item.updatedAt ?? "")}</span> },
    { key: "status", header: "Status", render: (item) => <StatusBadge status={(item.status as any) ?? "draft"} /> }
  ];

  const table = useTableState<ProductRow>({
    data: items,
    pageSize: 8,
    searchFields: (item) => `${typeof item.name === "string" ? item.name : t(item.name)} ${item.slug ?? ""}`,
    filters: {
      status: (item, value) => item.status === value
    }
  });

  const filteredColumns = useMemo(
    () => [
      ...columns,
      {
        key: "actions",
        header: "",
        align: "right" as const,
        className: "w-12",
        render: (item: ProductRow) => (
          <RowActions
            onEdit={() => openEdit(item)}
            onDelete={() => setPendingDelete(item)}
          />
        )
      }
    ],
    [items]
  );

  return (
    <>
      <PageHeader
        title="Product Management"
        description="Live product catalogue with backend CRUD support."
        actions={
          <Button variant="primary" onClick={openCreate}>
            <PlusIcon className="h-3.5 w-3.5" />
            Add product
          </Button>
        }
      />

      {error ? <div className="mb-4 rounded-lg border border-danger/20 bg-danger-subtle px-4 py-3 text-sm text-danger">{error}</div> : null}

      <FilterBar
        query={table.query}
        onQueryChange={table.setQuery}
        placeholder="Search products..."
        filters={[]}
        values={table.filterValues}
        onFilterChange={table.setFilter}
        onReset={table.resetFilters}
        selectedCount={table.selected.length}
        onClearSelection={table.clearSelection}
        bulkActions={<Button variant="outlineDanger" size="sm" onClick={() => setPendingDelete(table.pageItems[0] ?? null)}>Delete selected</Button>}
      />

      <DataTable
        columns={filteredColumns as Column<ProductRow>[]}
        items={table.pageItems}
        isLoading={loading}
        selectable
        isSelected={table.isSelected}
        onToggleRow={table.toggleSelected}
        onToggleAll={table.toggleAllOnPage}
        page={table.page}
        totalPages={table.totalPages}
        totalItems={table.totalItems}
        pageSize={table.pageSize}
        onPageChange={table.setPage}
        emptyTitle="No products found"
        emptyMessage="Products will appear here from the backend API."
      />

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={editing ? "Edit product" : "Add product"}
        description="Create or update a product using the existing backend routes."
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => void saveProduct()}
              disabled={saving || !draft.name.trim() || !draft.category || !draft.brand || (!editing && !draft.images?.length)}
            >
              {saving ? "Saving..." : editing ? "Save changes" : "Create product"}
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Product name" required><Input value={draft.name} onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))} /></Field>
          <Field label="Category" required>
            <Select
              value={draft.category}
              onChange={(e) => {
                const category = e.target.value;
                setDraft((p) => ({ ...p, category, brand: "", subCategory: "" }));
                setError(null);
                void loadBrandsForCategory(category);
                void loadSubCategories(category);
              }}
            >
              <option value="">Select category</option>
              {categories.map((cat) => <option key={cat._id} value={cat._id}>{fieldText(cat.name)}</option>)}
            </Select>
          </Field>
          {subCategories.length > 0 && <Field label="Subcategory" required>
            <Select value={draft.subCategory} onChange={(e) => setDraft((p) => ({ ...p, subCategory: e.target.value }))}>
              <option value="">Select subcategory</option>
              {subCategories.map(item => <option key={item._id} value={item._id}>{item.name}</option>)}
            </Select>
          </Field>}          <Field label="Brand" required hint={!draft.category ? "Select a category first" : undefined}>
            <Select
              value={draft.brand}
              disabled={!draft.category || loadingBrands}
              onChange={(e) => setDraft((p) => ({ ...p, brand: e.target.value }))}
            >
              <option value="">{loadingBrands ? "Loading brands..." : "Select brand"}</option>
              {brands.map((brand) => <option key={brand._id} value={brand._id}>{brand.name}</option>)}
            </Select>
          </Field>
          <Field label="Quantity"><Input type="number" value={draft.quantity} onChange={(e) => setDraft((p) => ({ ...p, quantity: Number(e.target.value) }))} /></Field>
          <Field label="Unit"><Input value={draft.unit} onChange={(e) => setDraft((p) => ({ ...p, unit: e.target.value }))} /></Field>
          <Field label="Price"><Input type="number" value={draft.price} onChange={(e) => setDraft((p) => ({ ...p, price: Number(e.target.value) }))} /></Field>
          <Field label="Brand variant"><Input value={draft.brandVariant} onChange={(e) => setDraft((p) => ({ ...p, brandVariant: e.target.value }))} /></Field>
          <Field label="Quality grade"><Input value={draft.qualityGrade} onChange={(e) => setDraft((p) => ({ ...p, qualityGrade: e.target.value }))} /></Field>
          <Field label="Description" className="sm:col-span-2"><Textarea value={draft.description} onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))} /></Field>
          <Field label="Suitable crops" hint="Comma-separated values"><Input value={draft.suitableCrops} onChange={(e) => setDraft((p) => ({ ...p, suitableCrops: e.target.value }))} /></Field>
          <Field label="Key benefits" hint="Comma-separated values"><Input value={draft.keyBenefits} onChange={(e) => setDraft((p) => ({ ...p, keyBenefits: e.target.value }))} /></Field>
          <Field label="Active ingredient"><Input value={draft.activeIngredient} onChange={(e) => setDraft((p) => ({ ...p, activeIngredient: e.target.value }))} /></Field>
          <Field label="Target pests"><Input value={draft.targetPests} onChange={(e) => setDraft((p) => ({ ...p, targetPests: e.target.value }))} /></Field>
          <Field label="Safety period"><Input value={draft.safetyPeriod} onChange={(e) => setDraft((p) => ({ ...p, safetyPeriod: e.target.value }))} /></Field>
          <Field label="Pack size"><Input value={draft.packSize} onChange={(e) => setDraft((p) => ({ ...p, packSize: e.target.value }))} /></Field>
          <Field label="Storage"><Input value={draft.storage} onChange={(e) => setDraft((p) => ({ ...p, storage: e.target.value }))} /></Field>
          <Field label="Safety precautions"><Textarea value={draft.safetyPrecautions} onChange={(e) => setDraft((p) => ({ ...p, safetyPrecautions: e.target.value }))} /></Field>
          <Field label="Product images" required={!editing} hint="Choose up to 5 images">
            <Input type="file" accept="image/*" multiple onChange={(e) => setDraft((p) => ({ ...p, images: e.target.files ? Array.from(e.target.files) : null }))} />
          </Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => void deleteProduct()}
        title="Delete product"
        message="This product will be permanently removed from the backend."
      />
    </>
  );
}
