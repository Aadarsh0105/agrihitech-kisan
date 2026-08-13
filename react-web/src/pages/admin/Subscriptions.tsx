import { useEffect, useState } from "react";
import { LandmarkIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { PageHeader } from "../../components/admin/shared/PageHeader";
import { DataTable, type Column } from "../../components/admin/shared/DataTable";
import { StatusBadge, Badge } from "../../components/admin/ui/Badge";
import { Button } from "../../components/admin/ui/Button";
import { ConfirmDialog, Modal } from "../../components/admin/ui/Modal";
import { Field, Input, Select, Textarea } from "../../components/admin/ui/Input";
import api from "../../api/admin/axios";

type PlanRow = {
  _id: string;
  name: string;
  type: "MONTHLY" | "YEARLY";
  price: number;
  currency?: string;
  isRecommended?: boolean;
  duration: number;
  trialDays?: number;
  features?: string[];
  isActive?: boolean;
};

const emptyDraft = {
  name: "",
  type: "MONTHLY" as PlanRow["type"],
  price: 0,
  currency: "INR",
  isRecommended: false,
  duration: 30,
  trialDays: 0,
  featuresText: "",
  isActive: true
};

export function Subscriptions() {
  const [items, setItems] = useState<PlanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<PlanRow | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PlanRow | null>(null);
  const [draft, setDraft] = useState({ ...emptyDraft });

  const loadPlans = () => {
    setLoading(true);
    api.get("/subscription")
      .then((res) => {
        const plans = Array.isArray(res.data) ? res.data : res.data?.plans ?? [];
        setItems(plans);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load plans"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setDraft({ ...emptyDraft });
    setError(null);
    setCreateOpen(true);
  };

  const openEdit = (item: PlanRow) => {
    setEditing(item);
    setDraft({
      name: item.name,
      type: item.type,
      price: item.price,
      currency: item.currency ?? "INR",
      isRecommended: Boolean(item.isRecommended),
      duration: item.duration,
      trialDays: item.trialDays ?? 0,
      featuresText: item.features?.join(", ") ?? "",
      isActive: item.isActive ?? true
    });
    setError(null);
    setCreateOpen(true);
  };

  const savePlan = async () => {
    if (!draft.name.trim() || !draft.type || draft.price <= 0 || draft.duration <= 0) return;

    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: draft.name.trim(),
        type: draft.type,
        price: draft.price,
        currency: draft.currency.trim() || "INR",
        isRecommended: draft.isRecommended,
        duration: draft.duration,
        trialDays: draft.trialDays,
        features: draft.featuresText
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
        isActive: draft.isActive
      };

      if (editing) {
        await api.put(`/subscription/${editing._id}`, payload);
      } else {
        await api.post("/subscription/create", payload);
      }

      setCreateOpen(false);
      setEditing(null);
      loadPlans();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save plan");
    } finally {
      setSaving(false);
    }
  };

  const deletePlan = async () => {
    if (!pendingDelete) return;
    setSaving(true);
    setError(null);
    try {
      await api.delete(`/subscription/${pendingDelete._id}`);
      setPendingDelete(null);
      loadPlans();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete plan");
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<PlanRow>[] = [
    { key: "name", header: "Plan", render: (item) => <div><div className="font-medium">{item.name}</div><div className="text-[11px] text-muted-foreground">{item.type}</div></div> },
    { key: "price", header: "Price", render: (item) => <span className="text-xs">{item.currency ?? "INR"} {item.price}</span> },
    { key: "duration", header: "Duration", render: (item) => <span className="text-xs">{item.duration} days</span> },
    { key: "recommended", header: "Plan", render: (item) => item.isRecommended ? <Badge tone="success">Recommended</Badge> : <Badge tone="neutral">Standard</Badge> },
    { key: "status", header: "Status", render: (item) => <StatusBadge status={item.isActive ? "active" : "draft"} /> }
  ];

  return (
    <>
      <PageHeader
        title="Subscription Management"
        description="Manage subscription plans from the live backend."
        actions={
          <Button variant="primary" onClick={openCreate}>
            <PlusIcon className="h-3.5 w-3.5" />
            Add plan
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
        emptyTitle="No subscription plans"
        emptyMessage="Plans from the backend will appear here."
      />

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={editing ? "Edit plan" : "Add plan"}
        description="Create or update a subscription plan using the existing backend routes."
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => void savePlan()}
              disabled={saving || !draft.name.trim() || draft.price <= 0 || draft.duration <= 0}
            >
              {saving ? "Saving..." : editing ? "Save changes" : "Create plan"}
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Plan name" required>
            <Input value={draft.name} onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))} placeholder="Monthly / Yearly" />
          </Field>
          <Field label="Type" required>
            <Select value={draft.type} onChange={(e) => setDraft((p) => ({ ...p, type: e.target.value as PlanRow["type"] }))}>
              <option value="MONTHLY">MONTHLY</option>
              <option value="YEARLY">YEARLY</option>
            </Select>
          </Field>
          <Field label="Price" required>
            <Input type="number" value={draft.price} onChange={(e) => setDraft((p) => ({ ...p, price: Number(e.target.value) }))} />
          </Field>
          <Field label="Currency">
            <Input value={draft.currency} onChange={(e) => setDraft((p) => ({ ...p, currency: e.target.value }))} />
          </Field>
          <Field label="Duration (days)" required>
            <Input type="number" value={draft.duration} onChange={(e) => setDraft((p) => ({ ...p, duration: Number(e.target.value) }))} />
          </Field>
          <Field label="Trial days">
            <Input type="number" value={draft.trialDays} onChange={(e) => setDraft((p) => ({ ...p, trialDays: Number(e.target.value) }))} />
          </Field>
          <Field label="Features" className="sm:col-span-2" hint="Comma separated list">
            <Textarea value={draft.featuresText} onChange={(e) => setDraft((p) => ({ ...p, featuresText: e.target.value }))} />
          </Field>
          <Field label="Active">
            <Select value={draft.isActive ? "yes" : "no"} onChange={(e) => setDraft((p) => ({ ...p, isActive: e.target.value === "yes" }))}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Select>
          </Field>
          <Field label="Recommended">
            <Select value={draft.isRecommended ? "yes" : "no"} onChange={(e) => setDraft((p) => ({ ...p, isRecommended: e.target.value === "yes" }))}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Select>
          </Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => void deletePlan()}
        title="Delete plan"
        message="This subscription plan will be permanently removed from the backend."
      />
    </>
  );
}
