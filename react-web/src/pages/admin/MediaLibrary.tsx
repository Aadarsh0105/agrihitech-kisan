import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileTextIcon,
  FilmIcon,
  FolderIcon,
  ImageIcon,
  SearchIcon,
  Trash2Icon,
  UploadCloudIcon } from
'lucide-react';
import { PageHeader } from '../../components/admin/shared/PageHeader';
import { Card, CardBody } from '../../components/admin/ui/Card';
import { Button } from '../../components/admin/ui/Button';
import { Badge } from '../../components/admin/ui/Badge';
import { Input } from '../../components/admin/ui/Input';
import { EmptyState } from '../../components/admin/ui/EmptyState';
import { Modal, ConfirmDialog } from '../../components/admin/ui/Modal';
import { Skeleton } from '../../components/admin/ui/Skeleton';
import { useResource } from '../../hooks/admin/useResource';
import { mediaAssets, mediaFolders } from '../../data/admin/system';
import { formatDate } from '../../utils/admin/format';
import { cn } from '../../utils/admin/cn';
import type { MediaAsset } from '../../types/admin';

const typeIcon = { image: ImageIcon, pdf: FileTextIcon, video: FilmIcon };

export function MediaLibrary() {
  const resource = useResource<MediaAsset>({ endpoint: 'media', seed: mediaAssets });
  const [folder, setFolder] = useState('All');
  const [query, setQuery] = useState('');
  const [preview, setPreview] = useState<MediaAsset | null>(null);
  const [pendingDelete, setPendingDelete] = useState<MediaAsset | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  const visible = resource.items.filter(
    (asset) =>
    (folder === 'All' || asset.folder === folder) &&
    asset.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <>
      <PageHeader
        title="Media Library"
        description="Central store for images, brochures and videos referenced across the platform."
        actions={
        <Button variant="primary" onClick={() => setUploadOpen(true)}>
            <UploadCloudIcon className="h-3.5 w-3.5" />
            Upload files
          </Button>
        } />
      

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <Card className="h-fit">
          <CardBody className="space-y-1 p-2">
            {mediaFolders.map((name) => {
              const count =
              name === 'All' ?
              resource.items.length :
              resource.items.filter((a) => a.folder === name).length;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setFolder(name)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors',
                    folder === name ?
                    'bg-primary-subtle font-medium text-primary' :
                    'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}>
                  
                  <FolderIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{name}</span>
                  <span className="ml-auto text-[11px]">{count}</span>
                </button>);

            })}
          </CardBody>
        </Card>

        <div className="space-y-4">
          <div className="relative">
            <SearchIcon
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true" />
            
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search files by name…"
              aria-label="Search media files"
              className="pl-9" />
            
          </div>

          {resource.isLoading ?
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) =>
            <Skeleton key={index} className="h-40" />
            )}
            </div> :
          visible.length === 0 ?
          <Card>
              <EmptyState
              icon={ImageIcon}
              title="No files in this folder"
              message="Upload images, brochures or videos to make them available across the CMS."
              action={
              <Button variant="primary" size="sm" onClick={() => setUploadOpen(true)}>
                    <UploadCloudIcon className="h-3.5 w-3.5" />
                    Upload files
                  </Button>
              } />
            
            </Card> :

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {visible.map((asset, index) => {
              const Icon = typeIcon[asset.type];
              return (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, delay: Math.min(index * 0.02, 0.16) }}>
                  
                    <Card className="group overflow-hidden">
                      <button
                      type="button"
                      onClick={() => setPreview(asset)}
                      className="block aspect-[4/3] w-full bg-muted"
                      aria-label={`Preview ${asset.name}`}>
                      
                        {asset.type === 'image' ?
                      <img
                        src={asset.url}
                        alt={asset.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]" /> :


                      <span className="flex h-full w-full items-center justify-center">
                            <Icon className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                          </span>
                      }
                      </button>
                      <div className="flex items-start gap-2 border-t border-border p-2.5">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-foreground">{asset.name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {asset.size} · {asset.dimensions ?? asset.type.toUpperCase()}
                          </p>
                        </div>
                        <Button
                        variant="ghost"
                        size="iconSm"
                        aria-label={`Delete ${asset.name}`}
                        onClick={() => setPendingDelete(asset)}>
                        
                          <Trash2Icon className="h-3.5 w-3.5 text-danger" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>);

            })}
            </div>
          }
        </div>
      </div>

      <Modal
        open={Boolean(preview)}
        onClose={() => setPreview(null)}
        title={preview?.name ?? ''}
        description={`${preview?.folder} · uploaded ${preview ? formatDate(preview.uploadedAt) : ''}`}
        size="lg">
        
        {preview?.type === 'image' ?
        <img
          src={preview.url}
          alt={preview.name}
          className="w-full rounded-md border border-border object-contain" /> :


        <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-border py-12">
            <Badge tone="info">{preview?.type.toUpperCase()}</Badge>
            <p className="text-xs text-muted-foreground">
              Preview is not available for this file type.
            </p>
          </div>
        }
      </Modal>

      <Modal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Upload files"
        description="Images, PDFs and MP4 videos up to 100 MB each."
        footer={
        <>
            <Button variant="secondary" onClick={() => setUploadOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setUploadOpen(false)}>
              Upload
            </Button>
          </>
        }>
        
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border bg-muted/40 px-6 py-12 text-center transition-colors hover:border-primary/50">
          <UploadCloudIcon className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
          <span className="text-sm font-medium text-foreground">
            Drag files here or click to browse
          </span>
          <span className="text-[11px] text-muted-foreground">
            Uploads post to <span className="font-mono">POST /admin/media</span>
          </span>
          <input type="file" multiple className="sr-only" />
        </label>
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && resource.remove(pendingDelete.id)}
        title="Delete file"
        message={`“${pendingDelete?.name ?? ''}” will be removed from the media library. Any page referencing it will show a broken asset.`} />
      
    </>);

}