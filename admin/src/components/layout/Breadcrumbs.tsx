import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from 'lucide-react';
import { flatNavigation } from '../../config/navigation';

function labelFor(segment: string, path: string): string {
  const match = flatNavigation.find((item) => item.path === path);
  if (match) return match.label;
  return segment.
  replace(/-/g, ' ').
  replace(/\b\w/g, (c) => c.toUpperCase());
}

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex items-center gap-1 text-xs text-muted-foreground">
        <li>
          <Link
            to="/"
            className="flex items-center gap-1 rounded px-1 py-0.5 transition-colors hover:text-foreground">
            
            <HomeIcon className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Dashboard</span>
          </Link>
        </li>
        {segments.map((segment, index) => {
          const path = `/${segments.slice(0, index + 1).join('/')}`;
          const isLast = index === segments.length - 1;
          return (
            <li key={path} className="flex min-w-0 items-center gap-1">
              <ChevronRightIcon className="h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden="true" />
              {isLast ?
              <span className="truncate font-medium text-foreground" aria-current="page">
                  {labelFor(segment, path)}
                </span> :

              <Link to={path} className="truncate transition-colors hover:text-foreground">
                  {labelFor(segment, path)}
                </Link>
              }
            </li>);

        })}
      </ol>
    </nav>);

}