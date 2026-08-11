import React, { useState } from 'react';
import { BoldIcon, FileTextIcon, ItalicIcon, LinkIcon, ListIcon, SaveIcon } from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { TranslationInput } from '../components/shared/TranslationInput';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Field, Input, Select, Textarea } from '../components/ui/Input';
import { StatusBadge } from '../components/ui/Badge';
import { useResource } from '../hooks/useResource';
import { staticPages } from '../data/system';
import { statusOptions } from '../config/options';
import { formatDate } from '../utils/format';
import { cn } from '../utils/cn';
import type { StaticPage } from '../types';

export function StaticPages() {
  const resource = useResource<StaticPage>({ endpoint: 'staticPages', seed: staticPages });
  const [activeId, setActiveId] = useState(staticPages[0].id);
  const active = resource.items.find((p) => p.id === activeId) ?? resource.items[0];

  if (!active) return null;

  return (
    <>
      <PageHeader
        title="Static Page CMS"
        description="Legal and informational pages with rich text content in every supported language."
        actions={
        <Button variant="primary">
            <SaveIcon className="h-3.5 w-3.5" />
            Save page
          </Button>
        } />
      

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <Card className="h-fit">
          <CardBody className="space-y-1 p-2">
            {resource.items.map((page) =>
            <button
              key={page.id}
              type="button"
              onClick={() => setActiveId(page.id)}
              className={cn(
                'flex w-full items-start gap-2 rounded-md px-2.5 py-2 text-left transition-colors',
                page.id === activeId ?
                'bg-primary-subtle text-primary' :
                'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}>
              
                <FileTextIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{page.title}</span>
                  <span className="block truncate font-mono text-[10px] opacity-70">/{page.slug}</span>
                </span>
              </button>
            )}
          </CardBody>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader
              title={active.title}
              description={`Last updated ${formatDate(active.updatedAt)}`}
              action={<StatusBadge status={active.status} />} />
            
            <CardBody className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Page title" required>
                  <Input
                    value={active.title}
                    onChange={(e) => resource.update(active.id, { title: e.target.value })} />
                  
                </Field>
                <Field label="Slug" required>
                  <Input
                    value={active.slug}
                    onChange={(e) => resource.update(active.id, { slug: e.target.value })} />
                  
                </Field>
              </div>

              <div>
                <div className="mb-1.5 flex items-center gap-1 rounded-md border border-border bg-muted/60 p-1">
                  {[BoldIcon, ItalicIcon, ListIcon, LinkIcon].map((Icon, index) =>
                  <Button
                    key={index}
                    variant="ghost"
                    size="iconSm"
                    aria-label={['Bold', 'Italic', 'Bullet list', 'Insert link'][index]}>
                    
                      <Icon className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <span className="ml-auto pr-2 text-[10px] text-muted-foreground">Rich text</span>
                </div>
                <TranslationInput
                  label="Page content"
                  multiline
                  value={active.content}
                  onChange={(next) => resource.update(active.id, { content: next })} />
                
              </div>

              <Field label="Status">
                <Select
                  value={active.status}
                  onChange={(e) =>
                  resource.update(active.id, { status: e.target.value as StaticPage['status'] })
                  }
                  className="sm:max-w-xs">
                  
                  {statusOptions.map((option) =>
                  <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  )}
                </Select>
              </Field>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Page SEO" description="Overrides the global defaults for this page." />
            <CardBody className="grid gap-4 sm:grid-cols-2">
              <Field label="Meta title" className="sm:col-span-2">
                <Input
                  value={active.seo.metaTitle}
                  onChange={(e) =>
                  resource.update(active.id, { seo: { ...active.seo, metaTitle: e.target.value } })
                  } />
                
              </Field>
              <Field label="Meta description" className="sm:col-span-2">
                <Textarea
                  value={active.seo.metaDescription}
                  onChange={(e) =>
                  resource.update(active.id, {
                    seo: { ...active.seo, metaDescription: e.target.value }
                  })
                  } />
                
              </Field>
              <Field label="Robots">
                <Select
                  value={active.seo.robots ?? 'index, follow'}
                  onChange={(e) =>
                  resource.update(active.id, { seo: { ...active.seo, robots: e.target.value } })
                  }>
                  
                  <option value="index, follow">index, follow</option>
                  <option value="noindex, follow">noindex, follow</option>
                  <option value="noindex, nofollow">noindex, nofollow</option>
                </Select>
              </Field>
              <Field label="Keywords" hint="Comma separated">
                <Input
                  value={active.seo.keywords.join(', ')}
                  onChange={(e) =>
                  resource.update(active.id, {
                    seo: {
                      ...active.seo,
                      keywords: e.target.value.split(',').map((v) => v.trim()).filter(Boolean)
                    }
                  })
                  } />
                
              </Field>
            </CardBody>
          </Card>
        </div>
      </div>
    </>);

}