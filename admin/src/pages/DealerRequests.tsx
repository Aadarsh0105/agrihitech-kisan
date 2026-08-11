import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2Icon, FileTextIcon, InboxIcon, XCircleIcon } from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { FilterBar } from '../components/shared/FilterBar';
import { Thumb } from '../components/shared/Thumb';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal, ConfirmDialog } from '../components/ui/Modal';
import { CardSkeleton } from '../components/ui/Skeleton';
import { useResource } from '../hooks/useResource';
import { useTableState } from '../hooks/useTableState';
import { dealerRequests } from '../data/dealers';
import { states } from '../data/locations';
import { relativeTime } from '../utils/format';
import type { Dealer } from '../types';

export function DealerRequests() {
  const resource = useResource<Dealer>({ endpoint: 'dealerRequests', seed: dealerRequests });
  const [documentsFor, setDocumentsFor] = useState<Dealer | null>(null);
  const [pendingReject, setPendingReject] = useState<Dealer | null>(null);

  const table = useTableState<Dealer>({
    data: resource.items,
    pageSize: 20,
    searchFields: (item) => `${item.businessName} ${item.ownerName} ${item.city} ${item.state}`,
    filters: { state: (item, value) => item.state === value }
  });

  return (
    <>
      <PageHeader
        title="Dealer Requests"
        description="Verify documents and approve new dealers joining the network."
        actions={
        <Link to="/dealers">
            <Button variant="secondary">View approved dealers</Button>
          </Link>
        } />
      

      <FilterBar
        query={table.query}
        onQueryChange={table.setQuery}
        placeholder="Search pending applications…"
        filters={[{ key: 'state', label: 'State', options: states.map((s) => ({ value: s.name, label: s.name })) }]}
        values={table.filterValues}
        onFilterChange={table.setFilter}
        onReset={table.resetFilters}
        trailing={<Badge tone="warning">{table.totalItems} pending</Badge>} />
      

      {resource.isLoading ?
      <div className="grid gap-3 md:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div> :
      table.pageItems.length === 0 ?
      <Card>
          <EmptyState
          icon={InboxIcon}
          title="No pending requests"
          message="Every dealer application has been reviewed. New submissions will appear here." />
        
        </Card> :

      <div className="grid gap-3 md:grid-cols-2">
          {table.pageItems.map((request, index) =>
        <motion.div
          key={request.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.04 }}>
          
              <Card>
                <CardBody className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Thumb src={request.logo} alt={request.businessName} size="lg" />
                    <div className="min-w-0 flex-1">
                      <Link
                    to={`/dealers/${request.id}`}
                    className="block truncate text-sm font-semibold text-foreground hover:text-primary">
                    
                        {request.businessName}
                      </Link>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {request.ownerName} · {request.city}, {request.state}
                      </p>
                    </div>
                    <Badge tone="warning">{relativeTime(request.appliedAt)}</Badge>
                  </div>

                  <dl className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="rounded-md border border-border px-2.5 py-1.5">
                      <dt className="text-muted-foreground">GST</dt>
                      <dd className="font-mono text-foreground">{request.gstNumber}</dd>
                    </div>
                    <div className="rounded-md border border-border px-2.5 py-1.5">
                      <dt className="text-muted-foreground">Licence</dt>
                      <dd className="font-mono text-foreground">{request.licenseNumber}</dd>
                    </div>
                  </dl>

                  <div className="flex flex-wrap gap-1">
                    {request.categories.map((category) =>
                <Badge key={category} tone="primary">
                        {category}
                      </Badge>
                )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setDocumentsFor(request)}>
                      <FileTextIcon className="h-3.5 w-3.5" />
                      {request.documents.length} documents
                    </Button>
                    <div className="ml-auto flex items-center gap-2">
                      <Button variant="outlineDanger" size="sm" onClick={() => setPendingReject(request)}>
                        <XCircleIcon className="h-3.5 w-3.5" />
                        Reject
                      </Button>
                      <Button variant="primary" size="sm" onClick={() => resource.remove(request.id)}>
                        <CheckCircle2Icon className="h-3.5 w-3.5" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
        )}
        </div>
      }

      <Modal
        open={Boolean(documentsFor)}
        onClose={() => setDocumentsFor(null)}
        title={`Documents · ${documentsFor?.businessName ?? ''}`}
        description="Verify each document before approving the application."
        size="md">
        
        <ul className="divide-y divide-border">
          {documentsFor?.documents.map((document) =>
          <li key={document.id} className="flex items-center gap-3 py-3 first:pt-0">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
                <FileTextIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{document.name}</p>
                <p className="text-[11px] uppercase text-muted-foreground">{document.type}</p>
              </div>
              <Badge tone={document.verified ? 'success' : 'warning'}>
                {document.verified ? 'Verified' : 'Pending'}
              </Badge>
            </li>
          )}
        </ul>
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingReject)}
        onClose={() => setPendingReject(null)}
        onConfirm={() => pendingReject && resource.remove(pendingReject.id)}
        title="Reject application"
        confirmLabel="Reject"
        message={`${pendingReject?.businessName ?? ''} will be notified by email and can re-apply with corrected documents.`} />
      
    </>);

}