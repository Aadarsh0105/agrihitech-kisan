import React, { useState } from 'react';
import { SaveIcon, SearchCheckIcon } from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { DataTable, type Column } from '../components/shared/DataTable';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Field, Input, Select, Textarea } from '../components/ui/Input';
import { Switch } from '../components/ui/Switch';
import { Tabs } from '../components/ui/Tabs';
import { RowActions } from '../components/shared/RowActions';
import { globalSeo, pageSeoRows, type PageSeoRow } from '../data/settings';
import { cn } from '../utils/cn';

const columns: Column<PageSeoRow>[] = [
{
  key: 'page',
  header: 'Page',
  render: (item) =>
  <div>
        <p className="text-sm font-medium text-foreground">{item.page}</p>
        <p className="font-mono text-[11px] text-muted-foreground">{item.path}</p>
      </div>

},
{
  key: 'meta',
  header: 'Meta',
  render: (item) =>
  <div className="max-w-md">
        <p className="truncate text-xs text-foreground">{item.metaTitle}</p>
        {item.metaDescription ?
    <p className="truncate text-[11px] text-muted-foreground">{item.metaDescription}</p> :

    <p className="text-[11px] font-medium text-danger">Missing meta description</p>
    }
      </div>

},
{
  key: 'score',
  header: 'Score',
  align: 'center',
  render: (item) =>
  <div className="inline-flex items-center gap-2">
        <span
      className={cn(
        'text-xs font-semibold',
        item.score >= 85 ? 'text-success' : item.score >= 70 ? 'text-warning' : 'text-danger'
      )}>
      
          {item.score}
        </span>
        <span className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
          <span
        className={cn(
          'block h-full rounded-full',
          item.score >= 85 ? 'bg-success' : item.score >= 70 ? 'bg-warning' : 'bg-danger'
        )}
        style={{ width: `${item.score}%` }} />
      
        </span>
      </div>

},
{
  key: 'indexed',
  header: 'Indexing',
  render: (item) =>
  <Badge tone={item.indexed ? 'success' : 'neutral'}>
        {item.indexed ? 'Indexed' : 'No-index'}
      </Badge>

},
{
  key: 'actions',
  header: '',
  align: 'right',
  className: 'w-12',
  render: () => <RowActions onEdit={() => undefined} />
}];


export function Seo() {
  const [tab, setTab] = useState('global');
  const [seo, setSeo] = useState(globalSeo);

  const missing = pageSeoRows.filter((row) => !row.metaDescription).length;
  const average = Math.round(
    pageSeoRows.reduce((sum, row) => sum + row.score, 0) / pageSeoRows.length
  );

  return (
    <>
      <PageHeader
        title="SEO Management"
        description="Global defaults, per-page overrides, structured data and sitemap configuration."
        actions={
        <Button variant="primary">
            <SaveIcon className="h-3.5 w-3.5" />
            Save SEO settings
          </Button>
        } />
      

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Average page score</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{average}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Pages missing meta</p>
          <p className="mt-1 text-2xl font-semibold text-danger">{missing}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Sitemap</p>
          <p className="mt-2">
            <Badge tone={seo.sitemapEnabled ? 'success' : 'neutral'}>
              {seo.sitemapEnabled ? `Enabled · ${seo.sitemapFrequency}` : 'Disabled'}
            </Badge>
          </p>
        </Card>
      </div>

      <Tabs
        idPrefix="seo"
        value={tab}
        onChange={setTab}
        items={[
        { key: 'global', label: 'Global SEO' },
        { key: 'pages', label: 'Page SEO', count: pageSeoRows.length },
        { key: 'social', label: 'Social & schema' },
        { key: 'sitemap', label: 'Sitemap & robots' }]
        } />
      

      {tab === 'global' ?
      <Card>
          <CardHeader title="Global defaults" description="Applied to any page without an override." />
          <CardBody className="grid gap-4 sm:grid-cols-2">
            <Field label="Meta title" className="sm:col-span-2">
              <Input value={seo.metaTitle} onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })} />
            </Field>
            <Field label="Meta description" className="sm:col-span-2">
              <Textarea
              value={seo.metaDescription}
              onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })} />
            
            </Field>
            <Field label="Keywords" hint="Comma separated">
              <Input value={seo.keywords} onChange={(e) => setSeo({ ...seo, keywords: e.target.value })} />
            </Field>
            <Field label="Canonical base URL">
              <Input
              value={seo.canonicalBase}
              onChange={(e) => setSeo({ ...seo, canonicalBase: e.target.value })} />
            
            </Field>
          </CardBody>
        </Card> :
      null}

      {tab === 'pages' ?
      <DataTable
        columns={columns}
        items={pageSeoRows}
        totalItems={pageSeoRows.length}
        emptyTitle="No pages tracked"
        emptyMessage="Pages appear here once they are published on the storefront." /> :

      null}

      {tab === 'social' ?
      <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader title="Open Graph & Twitter" description="Preview cards on shared links." />
            <CardBody className="space-y-4">
              <Field label="Default OG image">
                <Input value={seo.ogImage} onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })} />
              </Field>
              <Field label="Twitter handle">
                <Input
                value={seo.twitterHandle}
                onChange={(e) => setSeo({ ...seo, twitterHandle: e.target.value })} />
              
              </Field>
              <div className="rounded-md border border-border p-3">
                <div className="h-24 w-full rounded bg-muted" />
                <p className="mt-2 truncate text-xs font-medium text-foreground">{seo.metaTitle}</p>
                <p className="line-clamp-2 text-[11px] text-muted-foreground">{seo.metaDescription}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">{seo.canonicalBase}</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Schema JSON-LD" description="Injected into the storefront <head>." />
            <CardBody>
              <Textarea
              rows={14}
              className="font-mono text-xs"
              value={seo.schemaJson}
              onChange={(e) => setSeo({ ...seo, schemaJson: e.target.value })}
              aria-label="Schema JSON" />
            
            </CardBody>
          </Card>
        </div> :
      null}

      {tab === 'sitemap' ?
      <Card>
          <CardHeader title="Sitemap & robots" description="Controls crawler behaviour platform-wide." />
          <CardBody className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5 sm:col-span-2">
              <div>
                <p className="text-xs font-medium text-foreground">Auto-generate sitemap.xml</p>
                <p className="text-[11px] text-muted-foreground">
                  Includes categories, products, dealers, news and schemes.
                </p>
              </div>
              <Switch
              label="Enable sitemap"
              checked={seo.sitemapEnabled}
              onChange={(next) => setSeo({ ...seo, sitemapEnabled: next })} />
            
            </div>
            <Field label="Change frequency">
              <Select
              value={seo.sitemapFrequency}
              onChange={(e) => setSeo({ ...seo, sitemapFrequency: e.target.value })}>
              
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </Select>
            </Field>
            <Field label="Default robots directive">
              <Select value={seo.robots} onChange={(e) => setSeo({ ...seo, robots: e.target.value })}>
                <option value="index, follow">index, follow</option>
                <option value="noindex, follow">noindex, follow</option>
                <option value="noindex, nofollow">noindex, nofollow</option>
              </Select>
            </Field>
            <div className="sm:col-span-2">
              <Card className="border-dashed bg-muted/40">
                <CardBody className="flex items-start gap-3">
                  <SearchCheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Sitemap regeneration runs server-side on publish. The admin panel only stores the
                    configuration.
                  </p>
                </CardBody>
              </Card>
            </div>
          </CardBody>
        </Card> :
      null}
    </>);

}