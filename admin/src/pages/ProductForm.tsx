import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon, SaveIcon, Trash2Icon } from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { TranslationInput } from '../components/shared/TranslationInput';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Field, Input, Select, Textarea } from '../components/ui/Input';
import { Switch } from '../components/ui/Switch';
import { Tabs } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { brands, categories, products, productAttributes, subCategories } from '../data/catalogue';
import { availabilityOptions, statusOptions, newId } from '../config/options';
import { slugify } from '../utils/format';
import { t } from '../utils/i18n';
import type { Product, Translated } from '../types';

const emptyProduct = (): Product => ({
  id: newId('prd'),
  name: { en: '' },
  slug: '',
  categoryId: categories[0].id,
  categoryName: t(categories[0].name),
  subCategoryId: subCategories[0].id,
  subCategoryName: t(subCategories[0].name),
  brandId: brands[0].id,
  brandName: brands[0].name,
  shortDescription: { en: '' },
  fullDescription: { en: '' },
  benefits: [],
  technicalDetails: '',
  specifications: [],
  usage: { en: '' },
  packing: '',
  image: '',
  gallery: [],
  brochureUrl: '',
  videoUrl: '',
  price: 0,
  mrp: 0,
  discount: 0,
  availability: 'in_stock',
  featured: false,
  trending: false,
  attributes: [],
  status: 'draft',
  seo: { metaTitle: '', metaDescription: '', keywords: [], robots: 'index, follow' },
  updatedAt: new Date().toISOString()
});

const tabs = [
{ key: 'general', label: 'General' },
{ key: 'content', label: 'Content' },
{ key: 'media', label: 'Media' },
{ key: 'pricing', label: 'Pricing' },
{ key: 'attributes', label: 'Attributes' },
{ key: 'seo', label: 'SEO' }];


export function ProductForm() {
  const { id } = useParams<{id: string;}>();
  const navigate = useNavigate();
  const existing = products.find((p) => p.id === id);
  const [draft, setDraft] = useState<Product>(existing ?? emptyProduct());
  const [tab, setTab] = useState('general');

  const set = <K extends keyof Product,>(key: K, value: Product[K]) =>
  setDraft((prev) => ({ ...prev, [key]: value }));

  const relevantAttributes = useMemo(
    () =>
    productAttributes.filter(
      (attribute) =>
      attribute.status === 'active' && attribute.appliesTo.includes(draft.categoryName)
    ),
    [draft.categoryName]
  );

  const attributeValue = (attributeId: string) =>
  draft.attributes.find((a) => a.attributeId === attributeId)?.value ?? '';

  const setAttribute = (attributeId: string, label: string, value: string) =>
  setDraft((prev) => {
    const rest = prev.attributes.filter((a) => a.attributeId !== attributeId);
    return { ...prev, attributes: [...rest, { attributeId, label, value }] };
  });

  return (
    <>
      <PageHeader
        title={existing ? t(existing.name) : 'New product'}
        description={
        existing ?
        'Update catalogue details, media and specifications.' :
        'Create a catalogue entry. Fields marked with * are required before publishing.'
        }
        actions={
        <>
            <Button variant="secondary" onClick={() => navigate('/products')}>
              <ArrowLeftIcon className="h-3.5 w-3.5" />
              Back to list
            </Button>
            <Button variant="primary" onClick={() => navigate('/products')}>
              <SaveIcon className="h-3.5 w-3.5" />
              Save product
            </Button>
          </>
        } />
      

      <Card>
        <div className="px-4 pt-2">
          <Tabs idPrefix="product" items={tabs} value={tab} onChange={setTab} />
        </div>

        <CardBody className="space-y-5">
          {tab === 'general' ?
          <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <TranslationInput
                label="Product name"
                required
                value={draft.name}
                onChange={(next: Translated) => {
                  set('name', next);
                  if (!existing) set('slug', slugify(next.en));
                }} />
              
              </div>
              <Field label="Slug" required hint="Auto-generated from the English name">
                <Input value={draft.slug} onChange={(e) => set('slug', e.target.value)} />
              </Field>
              <Field label="Packing">
                <Input
                value={draft.packing}
                placeholder="e.g. 1 kg pouch"
                onChange={(e) => set('packing', e.target.value)} />
              
              </Field>
              <Field label="Category" required>
                <Select
                value={draft.categoryId}
                onChange={(e) => {
                  const category = categories.find((c) => c.id === e.target.value);
                  if (!category) return;
                  set('categoryId', category.id);
                  set('categoryName', t(category.name));
                }}>
                
                  {categories.map((category) =>
                <option key={category.id} value={category.id}>
                      {t(category.name)}
                    </option>
                )}
                </Select>
              </Field>
              <Field label="Sub category">
                <Select
                value={draft.subCategoryId}
                onChange={(e) => {
                  const sub = subCategories.find((s) => s.id === e.target.value);
                  if (!sub) return;
                  set('subCategoryId', sub.id);
                  set('subCategoryName', t(sub.name));
                }}>
                
                  {subCategories.
                filter((s) => s.parentCategoryId === draft.categoryId).
                map((sub) =>
                <option key={sub.id} value={sub.id}>
                        {t(sub.name)}
                      </option>
                )}
                </Select>
              </Field>
              <Field label="Brand" required>
                <Select
                value={draft.brandId}
                onChange={(e) => {
                  const brand = brands.find((b) => b.id === e.target.value);
                  if (!brand) return;
                  set('brandId', brand.id);
                  set('brandName', brand.name);
                }}>
                
                  {brands.map((brand) =>
                <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                )}
                </Select>
              </Field>
              <Field label="Status">
                <Select
                value={draft.status}
                onChange={(e) => set('status', e.target.value as Product['status'])}>
                
                  {statusOptions.map((option) =>
                <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                )}
                </Select>
              </Field>
              <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
                <span className="text-xs font-medium text-foreground">Featured product</span>
                <Switch
                label="Featured product"
                checked={draft.featured}
                onChange={(next) => set('featured', next)} />
              
              </div>
              <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
                <span className="text-xs font-medium text-foreground">Trending</span>
                <Switch
                label="Trending"
                checked={draft.trending}
                onChange={(next) => set('trending', next)} />
              
              </div>
            </div> :
          null}

          {tab === 'content' ?
          <div className="space-y-5">
              <TranslationInput
              label="Short description"
              value={draft.shortDescription}
              onChange={(next) => set('shortDescription', next)}
              multiline />
            
              <TranslationInput
              label="Full description"
              value={draft.fullDescription}
              onChange={(next) => set('fullDescription', next)}
              multiline />
            
              <TranslationInput
              label="Usage instructions"
              value={draft.usage}
              onChange={(next) => set('usage', next)}
              multiline />
            
              <Field label="Benefits" hint="Comma separated bullet points">
                <Input
                value={draft.benefits.join(', ')}
                onChange={(e) =>
                set(
                  'benefits',
                  e.target.value.split(',').map((v) => v.trim()).filter(Boolean)
                )
                } />
              
              </Field>
              <Field label="Technical details">
                <Textarea
                value={draft.technicalDetails}
                onChange={(e) => set('technicalDetails', e.target.value)} />
              
              </Field>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">Specifications</span>
                  <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                  set('specifications', [...draft.specifications, { label: '', value: '' }])
                  }>
                  
                    <PlusIcon className="h-3.5 w-3.5" />
                    Add row
                  </Button>
                </div>
                <div className="space-y-2">
                  {draft.specifications.length === 0 ?
                <p className="rounded-md border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
                      No specification rows yet.
                    </p> :

                draft.specifications.map((spec, index) =>
                <div key={index} className="flex items-center gap-2">
                        <Input
                    value={spec.label}
                    placeholder="Label"
                    aria-label={`Specification label ${index + 1}`}
                    onChange={(e) => {
                      const next = [...draft.specifications];
                      next[index] = { ...spec, label: e.target.value };
                      set('specifications', next);
                    }} />
                  
                        <Input
                    value={spec.value}
                    placeholder="Value"
                    aria-label={`Specification value ${index + 1}`}
                    onChange={(e) => {
                      const next = [...draft.specifications];
                      next[index] = { ...spec, value: e.target.value };
                      set('specifications', next);
                    }} />
                  
                        <Button
                    variant="ghost"
                    size="iconSm"
                    aria-label={`Remove specification ${index + 1}`}
                    onClick={() =>
                    set(
                      'specifications',
                      draft.specifications.filter((_, i) => i !== index)
                    )
                    }>
                    
                          <Trash2Icon className="h-3.5 w-3.5 text-danger" />
                        </Button>
                      </div>
                )
                }
                </div>
              </div>
            </div> :
          null}

          {tab === 'media' ?
          <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Primary image URL">
                  <Input value={draft.image} onChange={(e) => set('image', e.target.value)} />
                </Field>
                {draft.image ?
              <img
                src={draft.image}
                alt="Primary product"
                className="mt-3 h-40 w-40 rounded-md border border-border object-cover" /> :

              null}
              </div>
              <Field label="Gallery images" hint="Comma separated URLs">
                <Input
                value={draft.gallery.join(', ')}
                onChange={(e) =>
                set('gallery', e.target.value.split(',').map((v) => v.trim()).filter(Boolean))
                } />
              
              </Field>
              <Field label="Brochure PDF">
                <Input value={draft.brochureUrl} onChange={(e) => set('brochureUrl', e.target.value)} />
              </Field>
              <Field label="Video URL">
                <Input value={draft.videoUrl} onChange={(e) => set('videoUrl', e.target.value)} />
              </Field>
            </div> :
          null}

          {tab === 'pricing' ?
          <div className="grid gap-4 sm:grid-cols-2">
              <Field label="MRP (₹)">
                <Input
                type="number"
                value={draft.mrp}
                onChange={(e) => set('mrp', Number(e.target.value))} />
              
              </Field>
              <Field label="Selling price (₹)">
                <Input
                type="number"
                value={draft.price}
                onChange={(e) => {
                  const price = Number(e.target.value);
                  set('price', price);
                  if (draft.mrp > 0) {
                    set('discount', Math.max(0, Math.round((draft.mrp - price) / draft.mrp * 100)));
                  }
                }} />
              
              </Field>
              <Field label="Discount (%)" hint="Calculated automatically from MRP">
                <Input
                type="number"
                value={draft.discount}
                onChange={(e) => set('discount', Number(e.target.value))} />
              
              </Field>
              <Field label="Availability">
                <Select
                value={draft.availability}
                onChange={(e) => set('availability', e.target.value as Product['availability'])}>
                
                  {availabilityOptions.map((option) =>
                <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                )}
                </Select>
              </Field>
            </div> :
          null}

          {tab === 'attributes' ?
          <div>
              <p className="mb-4 text-xs text-muted-foreground">
                Showing attributes configured for{' '}
                <Badge tone="primary">{draft.categoryName}</Badge>. Manage the schema under
                Catalogue → Attributes.
              </p>
              {relevantAttributes.length === 0 ?
            <EmptyState
              title="No attributes for this category"
              message="Add an attribute and scope it to this category to see it here." /> :


            <div className="grid gap-4 sm:grid-cols-2">
                  {relevantAttributes.map((attribute) =>
              <Field
                key={attribute.id}
                label={`${attribute.name}${attribute.unit ? ` (${attribute.unit})` : ''}`}
                required={attribute.required}>
                
                      {attribute.inputType === 'select' || attribute.inputType === 'multiselect' ?
                <Select
                  value={attributeValue(attribute.id)}
                  onChange={(e) => setAttribute(attribute.id, attribute.name, e.target.value)}>
                  
                          <option value="">Select…</option>
                          {attribute.options.map((option) =>
                  <option key={option} value={option}>
                              {option}
                            </option>
                  )}
                        </Select> :
                attribute.inputType === 'boolean' ?
                <Select
                  value={attributeValue(attribute.id)}
                  onChange={(e) => setAttribute(attribute.id, attribute.name, e.target.value)}>
                  
                          <option value="">Select…</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Select> :

                <Input
                  type={attribute.inputType === 'number' ? 'number' : 'text'}
                  value={attributeValue(attribute.id)}
                  onChange={(e) => setAttribute(attribute.id, attribute.name, e.target.value)} />

                }
                    </Field>
              )}
                </div>
            }
            </div> :
          null}

          {tab === 'seo' ?
          <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Meta title" className="sm:col-span-2">
                <Input
                value={draft.seo.metaTitle}
                onChange={(e) => set('seo', { ...draft.seo, metaTitle: e.target.value })} />
              
              </Field>
              <Field label="Meta description" className="sm:col-span-2">
                <Textarea
                value={draft.seo.metaDescription}
                onChange={(e) => set('seo', { ...draft.seo, metaDescription: e.target.value })} />
              
              </Field>
              <Field label="Keywords" hint="Comma separated">
                <Input
                value={draft.seo.keywords.join(', ')}
                onChange={(e) =>
                set('seo', {
                  ...draft.seo,
                  keywords: e.target.value.split(',').map((v) => v.trim()).filter(Boolean)
                })
                } />
              
              </Field>
              <Field label="Canonical URL">
                <Input
                value={draft.seo.canonicalUrl ?? ''}
                onChange={(e) => set('seo', { ...draft.seo, canonicalUrl: e.target.value })} />
              
              </Field>
            </div> :
          null}
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="API readiness"
          description="This form posts a single Product payload — no UI change is needed when the endpoint is wired." />
        
        <CardBody>
          <pre className="overflow-x-auto rounded-md border border-border bg-muted/60 p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
{`POST /api/v1/admin/products
PUT  /api/v1/admin/products/${draft.id}`}
          </pre>
        </CardBody>
      </Card>
    </>);

}