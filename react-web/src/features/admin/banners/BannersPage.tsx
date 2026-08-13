import { useEffect, useState } from "react";
import { ImageIcon, PlusIcon, RefreshCw, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../redux/admin";
import { createBanner, deleteBanner, fetchBanners, updateBanner } from "./slice";
import type { BannerRecord } from "./types";
import { Button } from "../../../components/admin/ui/Button";
import { PageHeader } from "../../../components/admin/shared/PageHeader";
import { DataTable, type Column } from "../../../components/admin/shared/DataTable";
import { Modal, ConfirmDialog } from "../../../components/admin/ui/Modal";
import { Thumb } from "../../../components/admin/shared/Thumb";
import { EmptyState } from "../../../components/admin/ui/EmptyState";

const columns: Column<BannerRecord>[] = [
  {
    key: "image",
    header: "Banner",
    render: (item) => (
      <div className="flex items-center gap-3">
        <Thumb src={item.image} alt="Banner preview" size="lg" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">Homepage banner</p>
          <p className="truncate text-[11px] text-muted-foreground">{item.image}</p>
        </div>
      </div>
    )
  },
  {
    key: "createdAt",
    header: "Created",
    render: (item) => (
      <span className="text-xs text-muted-foreground">
        {item.createdAt ? new Date(item.createdAt).toLocaleString() : "Unknown"}
      </span>
    )
  }
];

export function BannersPage() {
  const dispatch = useAppDispatch();
  const { items, loading, saving, error } = useAppSelector((state) => state.banners);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const editingItem = items.find((item) => item.id === selectedId) ?? null;

  useEffect(() => {
    void dispatch(fetchBanners());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedFile) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const openCreate = () => {
    setSelectedId(null);
    setSelectedFile(null);
    setIsEditorOpen(true);
  };

  const openEdit = (id: string) => {
    setSelectedId(id);
    setSelectedFile(null);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setSelectedId(null);
    setSelectedFile(null);
  };

  const onSave = async () => {
    if (!selectedFile && !editingItem) return;
    if (editingItem && selectedFile) {
      await dispatch(updateBanner({ id: editingItem._id, file: selectedFile }));
    } else if (selectedFile) {
      await dispatch(createBanner(selectedFile));
    }
    closeEditor();
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await dispatch(deleteBanner(pendingDelete));
    setPendingDelete(null);
  };

  return (
    <>
      <PageHeader
        title="Banner Management"
        description="Manage homepage banners from the live backend."
        actions={
          <>
            <Button variant="secondary" onClick={() => void dispatch(fetchBanners())}>
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
            <Button variant="primary" onClick={openCreate}>
              <PlusIcon className="h-3.5 w-3.5" />
              Add banner
            </Button>
          </>
        }
      />

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
                <Button variant="secondary" size="sm" onClick={() => openEdit(item.id)}>
                  Edit
                </Button>
                <Button variant="outlineDanger" size="sm" onClick={() => setPendingDelete(item._id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            )
          }
        ]}
        items={items}
        isLoading={loading}
        emptyTitle="No banners yet"
        emptyMessage="Upload your first banner to power the homepage hero."
        emptyAction={
          <Button variant="primary" size="sm" onClick={openCreate}>
            <PlusIcon className="h-3.5 w-3.5" />
            Add banner
          </Button>
        }
      />

      <Modal
        open={isEditorOpen}
        onClose={closeEditor}
        size="lg"
        title={editingItem ? "Edit banner" : "Add banner"}
        description="Upload a banner image and save it to the backend."
        footer={
          <>
            <Button variant="secondary" onClick={closeEditor}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => void onSave()}
              disabled={saving || (!editingItem && !selectedFile)}
            >
              {saving ? "Saving..." : editingItem ? "Save changes" : "Create banner"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Banner image
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              className="block w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </label>

          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Preview
            </p>
            {preview || editingItem?.image ? (
              <img
                src={preview || editingItem?.image || ""}
                alt="Banner preview"
                className="aspect-[16/7] w-full rounded-lg object-cover"
              />
            ) : (
              <EmptyState
                title="No image selected"
                message="Choose a banner image to preview it before saving."
                icon={ImageIcon}
              />
            )}
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => void confirmDelete()}
        title="Delete banner"
        message="This banner will be permanently removed from the backend."
      />
    </>
  );
}
