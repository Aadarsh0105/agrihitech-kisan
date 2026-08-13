import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ExternalLinkIcon,
  EyeIcon,
  LayoutTemplateIcon,
  SettingsIcon
} from
  'lucide-react';
import { PageHeader } from '../../components/admin/shared/PageHeader';
import { Card, CardHeader } from '../../components/admin/ui/Card';
import { Button } from '../../components/admin/ui/Button';
import { Badge } from '../../components/admin/ui/Badge';
import { Switch } from '../../components/admin/ui/Switch';
import { Modal } from '../../components/admin/ui/Modal';
import { useResource } from '../../hooks/admin/useResource';
import { homeSections } from '../../data/admin/content';
import type { HomeSection } from '../../types/admin';

export function HomeCms() {
  const resource = useResource<HomeSection>({ endpoint: 'homeSections', seed: homeSections });
  const [preview, setPreview] = useState<HomeSection | null>(null);

  const ordered = [...resource.items].sort((a, b) => a.order - b.order);
  const enabledCount = ordered.filter((s) => s.enabled).length;

  const move = (section: HomeSection, direction: -1 | 1) => {
    const index = ordered.findIndex((s) => s.id === section.id);
    const swap = ordered[index + direction];
    if (!swap) return;
    resource.update(section.id, { order: swap.order } as Partial<HomeSection>);
    resource.update(swap.id, { order: section.order } as Partial<HomeSection>);
  };

  return (
    <>
      <PageHeader
        title="Home Page CMS"
        description="Control which sections appear on the storefront homepage and in what order."
        actions={
          <Button variant="primary">Publish layout</Button>
        } />

      <Card>
        <CardHeader
          title="Homepage sections"
          description="Drag order is reflected top to bottom on the storefront." />

        <ul className="divide-y divide-border">
          {ordered.map((section, index) =>
            <motion.li
              key={section.id}
              layout
              className="flex flex-wrap items-center gap-3 px-5 py-3.5">

              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-[11px] font-semibold text-muted-foreground">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                  {section.name}
                  <Badge tone={section.enabled ? 'success' : 'neutral'}>
                    {section.enabled ? 'Live' : 'Hidden'}
                  </Badge>
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {section.description} · {section.itemCount} items
                </p>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="iconSm"
                  aria-label={`Move ${section.name} up`}
                  disabled={index === 0}
                  onClick={() => move(section, -1)}>

                  <ArrowUpIcon className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="iconSm"
                  aria-label={`Move ${section.name} down`}
                  disabled={index === ordered.length - 1}
                  onClick={() => move(section, 1)}>

                  <ArrowDownIcon className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="iconSm" aria-label={`Preview ${section.name}`} onClick={() => setPreview(section)}>
                  <EyeIcon className="h-3.5 w-3.5" />
                </Button>
                <Link to={section.managePath}>
                  <Button variant="ghost" size="iconSm" aria-label={`Manage ${section.name}`}>
                    <SettingsIcon className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Switch
                  label={`Enable ${section.name}`}
                  checked={section.enabled}
                  onChange={(next) => resource.update(section.id, { enabled: next } as Partial<HomeSection>)} />

              </div>
            </motion.li>
          )}
        </ul>
      </Card>

      <Modal
        open={Boolean(preview)}
        onClose={() => setPreview(null)}
        title={`${preview?.name ?? ''} preview`}
        description="Wireframe representation of how this section renders on the storefront."
        size="lg"
        footer={
          <Link to={preview?.managePath ?? '/'}>
            <Button variant="primary">
              Manage section
              <ExternalLinkIcon className="h-3.5 w-3.5" />
            </Button>
          </Link>
        }>

        <div className="rounded-md border border-dashed border-border bg-muted/40 p-6">
          <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
            <LayoutTemplateIcon className="h-4 w-4" aria-hidden="true" />
            {preview?.name} · {preview?.itemCount} items
          </div>
          <div className="space-y-3">
            <div className="h-6 w-1/3 rounded bg-border" />
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: Math.min(preview?.itemCount ?? 3, 6) }).map((_, index) =>
                <div key={index} className="h-20 rounded-md border border-border bg-surface" />
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>);

}