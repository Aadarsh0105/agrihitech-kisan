
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes with conditional logic, dedupe conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a distance in km for dealer cards. */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

/** Slugify a string for routing. */
export function slugify(input: string): string {
  return input.
  toLowerCase().
  trim().
  replace(/[^a-z0-9]+/g, '-').
  replace(/(^-|-$)/g, '');
}