










import { useEffect } from 'react';

/**
 * Lightweight document-head manager. In a Next.js port this maps directly to
 * the App Router `metadata` export / generateMetadata; here it sets title +
 * meta description imperatively so every page stays SEO friendly.
 */
export function Seo({ title, description }: {title: string;description?: string;}) {
  useEffect(() => {
    document.title = `${title} · AgriMandi`;
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', 'description');
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', description);
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [title, description]);

  return null;
}