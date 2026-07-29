// import { format } from "date-fns";

// import { DATE_FORMAT } from "../constants/mandi";

// export function formatPrice(price: number) {
//   return new Intl.NumberFormat("en-IN").format(price);
// }

// export function formatDate(date: string) {
//   return format(new Date(date), DATE_FORMAT);
// }

// export function capitalize(value: string) {
//   return value
//     .trim()
//     .toLowerCase()
//     .replace(/\b\w/g, (char) => char.toUpperCase());
// }

// export function unique(values: string[]) {
//   return [...new Set(values)].sort();
// }

// export function isEmpty(value?: string) {
//   return !value || value.trim() === "";
// }

// export function buildQuery(filters: Record<string, unknown>) {
//   const params = new URLSearchParams();

//   Object.entries(filters).forEach(([key, value]) => {
//     if (
//       value !== undefined &&
//       value !== null &&
//       value !== ""
//     ) {
//       params.append(key, String(value));
//     }
//   });

//   return params.toString();
// }
import { format, parse, isValid } from "date-fns";

import { DATE_FORMAT } from "../constants/mandi";

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN").format(price);
}

export function formatDate(date?: string) {
  if (!date) return "-";

  const parsed = parse(
    date,
    "dd/MM/yyyy",
    new Date()
  );

  if (!isValid(parsed)) {
    return date;
  }

  return format(parsed, DATE_FORMAT);
}

export function capitalize(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());
}

export function unique(values: string[]) {
  return [...new Set(values)].sort();
}

export function isEmpty(value?: string) {
  return !value || value.trim() === "";
}

export function buildQuery(filters: Record<string, unknown>) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      params.append(key, String(value));
    }
  });

  return params.toString();
}