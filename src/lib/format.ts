import { format, parseISO, isValid } from "date-fns";

export function formatINR(n: number, fraction = 0) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: fraction,
    minimumFractionDigits: fraction,
  }).format(n);
}

export function formatCompactINR(n: number) {
  if (Math.abs(n) >= 10_000_000) {
    return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  }
  if (Math.abs(n) >= 100_000) {
    return `₹${(n / 100_000).toFixed(2)} L`;
  }
  return formatINR(n);
}

export function formatDate(iso: string) {
  try {
    const d = parseISO(iso);
    if (!isValid(d)) return iso;
    return format(d, "d MMM yyyy");
  } catch {
    return iso;
  }
}

export function formatDateTime(iso: string) {
  try {
    const d = parseISO(iso);
    if (!isValid(d)) return iso;
    return format(d, "d MMM yyyy, h:mm a");
  } catch {
    return iso;
  }
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function nowISO() {
  return new Date().toISOString();
}

export function addMonthsISO(isoDate: string, months: number) {
  const d = new Date(`${isoDate}T00:00:00`);
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);
  if (d.getDate() < day) d.setDate(0);
  return d.toISOString().slice(0, 10);
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
