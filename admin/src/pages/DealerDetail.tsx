import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  BanIcon,
  CheckCircle2Icon,
  FileTextIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  XCircleIcon } from
'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { Thumb } from '../components/shared/Thumb';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/Modal';
import { dealerRequests, dealers } from '../data/dealers';
import { formatDate } from '../utils/format';
import type { Dealer, DealerStatus } from '../types';

const tabs = [
{ key: 'business', label: 'Business details' },
{ key: 'documents', label: 'Documents' },
{ key: 'products', label: 'Products' }];


export function DealerDetail() {
  const { id } = useParams<{id: string;}>();
  const navigate = useNavigate();
  const record = [...dealers, ...dealerRequests].find((d) => d.id === id);
  const [status, setStatus] = useState<DealerStatus>(record?.status ?? 'pending');
  const [tab, setTab] = useState('business');
  const [confirm, setConfirm] = useState<null | 'reject' | 'suspend'>(null);

  if (!record) {
    return (
      <Card>
        <EmptyState
          title="Dealer not found"
          message="This dealer may have been removed. Return to the dealer list to continue."
          action={
          <Link to="/dealers">
              <Button variant="primary" size="sm">
                Back to dealers
              </Button>
            </Link>
          } />
        
      </Card>);

  }

  const dealer: Dealer = { ...record, status };

  return (
    <>
      <PageHeader
        title={dealer.businessName}
        description={`${dealer.ownerName} · ${dealer.city}, ${dealer.state}`}
        actions={
        <>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              <ArrowLeftIcon className="h-3.5 w-3.5" />
              Back
            </Button>
            {status !== 'approved' ?
          <Button variant="primary" onClick={() => setStatus('approved')}>
                <CheckCircle2Icon className="h-3.5 w-3.5" />
                Approve
              </Button> :

          <Button variant="outlineDanger" onClick={() => setConfirm('suspend')}>
                <BanIcon className="h-3.5 w-3.5" />
                Suspend
              </Button>
          }
            {status !== 'rejected' ?
          <Button variant="secondary" onClick={() => setConfirm('reject')}>
                <XCircleIcon className="h-3.5 w-3.5" />
                Reject
              </Button> :
          null}
          </>
        } />
      

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardBody className="space-y-4">
            <div className="flex items-center gap-3">
              <Thumb src={dealer.logo} alt={dealer.businessName} size="lg" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{dealer.businessName}</p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <StatusBadge status={status} />
                  {dealer.verified ? <Badge tone="info">KYC verified</Badge> : null}
                </div>
              </div>
            </div>

            <dl className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <PhoneIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <dd className="text-foreground">{dealer.phone}</dd>
              </div>
              <div className="flex items-start gap-2">
                <MailIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <dd className="truncate text-foreground">{dealer.email}</dd>
              </div>
              <div className="flex items-start gap-2">
                <MapPinIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <dd className="leading-relaxed text-foreground">
                  {dealer.address}, {dealer.city}, {dealer.district}, {dealer.state} – {dealer.pincode}
                </dd>
              </div>
            </dl>

            <div className="rounded-md border border-border bg-muted/50 p-3">
              <p className="text-[11px] text-muted-foreground">Geo coordinates</p>
              <p className="font-mono text-xs text-foreground">
                {dealer.latitude}, {dealer.longitude}
              </p>
            </div>

            <div>
              <p className="mb-1.5 text-[11px] text-muted-foreground">Deals in</p>
              <div className="flex flex-wrap gap-1">
                {dealer.categories.map((category) =>
                <Badge key={category} tone="primary">
                    {category}
                  </Badge>
                )}
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <div className="px-4 pt-2">
            <Tabs idPrefix="dealer" items={tabs} value={tab} onChange={setTab} />
          </div>
          <CardBody>
            {tab === 'business' ?
            <dl className="grid gap-4 sm:grid-cols-2">
                {[
              ['Business name', dealer.businessName],
              ['Owner name', dealer.ownerName],
              ['GST number', dealer.gstNumber],
              ['Trade licence', dealer.licenseNumber],
              ['Applied on', formatDate(dealer.appliedAt)],
              ['Listed products', String(dealer.productCount)]].
              map(([label, value]) =>
              <div key={label} className="rounded-md border border-border px-3 py-2.5">
                    <dt className="text-[11px] text-muted-foreground">{label}</dt>
                    <dd className="mt-0.5 text-sm font-medium text-foreground">{value}</dd>
                  </div>
              )}
              </dl> :
            null}

            {tab === 'documents' ?
            <ul className="divide-y divide-border">
                {dealer.documents.map((document) =>
              <li key={document.id} className="flex items-center gap-3 py-3 first:pt-0">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
                      <FileTextIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{document.name}</p>
                      <p className="text-[11px] uppercase text-muted-foreground">{document.type}</p>
                    </div>
                    <Badge tone={document.verified ? 'success' : 'warning'}>
                      {document.verified ? 'Verified' : 'Pending review'}
                    </Badge>
                    <Button variant="secondary" size="sm">
                      View
                    </Button>
                  </li>
              )}
              </ul> :
            null}

            {tab === 'products' ?
            dealer.productCount === 0 ?
            <EmptyState
              title="No products listed yet"
              message="This dealer has not published any catalogue items. Products appear here once approved." /> :


            <div className="rounded-md border border-dashed border-border p-6 text-center">
                  <p className="text-sm font-medium text-foreground">
                    {dealer.productCount} products listed
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Dealer-specific catalogue loads from{' '}
                    <span className="font-mono">GET /admin/dealers/{dealer.id}/products</span>
                  </p>
                </div> :

            null}
          </CardBody>
        </Card>
      </div>

      <ConfirmDialog
        open={confirm === 'reject'}
        onClose={() => setConfirm(null)}
        onConfirm={() => setStatus('rejected')}
        title="Reject dealer application"
        confirmLabel="Reject"
        message="The dealer will be notified by email and can re-apply with corrected documents." />
      
      <ConfirmDialog
        open={confirm === 'suspend'}
        onClose={() => setConfirm(null)}
        onConfirm={() => setStatus('suspended')}
        title="Suspend dealer"
        confirmLabel="Suspend"
        message="The dealer will be hidden from the storefront directory until reinstated." />
      
    </>);

}