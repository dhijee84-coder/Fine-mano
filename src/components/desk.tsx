import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldOff } from "lucide-react";
import { Badge, Button } from "@/components/kit";
import { cn } from "@/lib/utils";

export function PageHeader({
  kicker,
  title,
  description,
  actions,
}: {
  kicker?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {kicker ? (
          <p className="mb-1 text-[11px] font-medium tracking-[0.16em] text-muted uppercase">
            {kicker}
          </p>
        ) : null}
        <h1 className="font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm text-muted">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl bg-surface p-4 hairline sm:p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-medium tracking-[0.14em] text-muted uppercase">{label}</p>
        {icon ? <span className="text-faint">{icon}</span> : null}
      </div>
      <p className="mt-2 font-display text-2xl font-medium tracking-tight tabular-nums text-ink sm:text-3xl">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl bg-surface px-6 py-14 text-center hairline">
      <p className="font-display text-xl text-ink">{title}</p>
      {description ? <p className="mx-auto mt-2 max-w-md text-sm text-muted">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

const TONE: Record<string, "default" | "success" | "warn" | "danger" | "primary" | "navy"> = {
  ACTIVE: "success",
  PAID: "success",
  APPROVED: "success",
  ALLOCATED: "primary",
  SENT: "success",
  MATCHED: "success",
  RESOLVED: "success",
  ENABLED: "success",
  PENDING: "warn",
  PARTIAL: "warn",
  OPEN: "warn",
  DRAFT: "default",
  OVERDUE: "danger",
  REVERSED: "danger",
  FAILED: "danger",
  DENIED: "danger",
  DISABLED: "danger",
  CLOSED: "default",
  IGNORED: "default",
  DEFAULTED: "danger",
  EXECUTED: "success",
  REJECTED: "danger",
  PARSED: "success",
  UNMATCHED: "warn",
  MANUAL: "default",
  SMS: "primary",
  BANK: "navy",
  SUCCESS: "success",
  ERROR: "danger",
  WARNING: "warn",
  INFO: "primary",
};

export function StatusBadge({ value }: { value: string }) {
  const tone = TONE[value] ?? "default";
  return <Badge tone={tone}>{value.replace(/_/g, " ")}</Badge>;
}

export function DataTable({
  headers,
  children,
  className,
}: {
  headers: ReactNode[];
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0 overflow-x-auto rounded-xl bg-surface hairline", className)}>
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left">
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-3 text-[11px] font-medium tracking-[0.12em] text-muted uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  );
}

export function Td({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <td className={cn("px-4 py-3 align-middle text-ink", className)}>{children}</td>;
}

export function Forbidden({
  reason = "You do not have permission to open this page.",
}: {
  reason?: string;
}) {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <ShieldOff className="mx-auto mb-4 size-8 text-danger" />
      <h1 className="font-display text-3xl">Access denied</h1>
      <p className="mt-2 text-sm text-muted">{reason}</p>
      <Button asChild className="mt-6">
        <Link to="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  );
}

export function ModuleOff({ name }: { name: string }) {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="font-display text-3xl">Module disabled</h1>
      <p className="mt-2 text-sm text-muted">
        The {name} module is switched off in the Developer Console. Super Admin can re-enable it under Modules.
      </p>
      <Button asChild className="mt-6" variant="outline">
        <Link to="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  );
}
