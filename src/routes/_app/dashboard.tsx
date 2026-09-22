import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  Layers,
  IndianRupee,
  AlertTriangle,
  ArrowRight,
  Terminal,
} from "lucide-react";
import { PageHeader, StatCard, StatusBadge, DataTable, Td } from "@/components/desk";
import { Card, CardTitle, Button } from "@/components/kit";
import { useAppStore } from "@/lib/store";
import { useSessionUser } from "@/lib/session";
import { ROLE_LABELS } from "@/lib/permissions";
import { formatDate, formatINR } from "@/lib/format";

export const Route = createFileRoute("/_app/dashboard")({ component: DashboardPage });

function DashboardPage() {
  const user = useSessionUser();
  if (!user) return null;
  if (user.role === "MEMBER") return <MemberDash />;
  if (user.role === "SUPER_ADMIN") return <SuperDash />;
  return <OpsDash />;
}

function monthLabel(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", { month: "short" });
}

function useKpis() {
  const membersAll = useAppStore((s) => s.members);
  const schemesAll = useAppStore((s) => s.schemes);
  const paymentsAll = useAppStore((s) => s.payments);
  const installments = useAppStore((s) => s.installments);
  const unmatchedAll = useAppStore((s) => s.unmatched);
  const members = membersAll.filter((m) => !m.deletedAt && m.isActive);
  const schemes = schemesAll.filter((s) => s.status === "ACTIVE");
  const payments = paymentsAll.filter((p) => !p.deletedAt);
  const unmatched = unmatchedAll.filter((u) => u.status === "OPEN");
  const overdue = installments.filter((i) => i.status === "OVERDUE");
  const collected = payments
    .filter((p) => p.status === "APPROVED" || p.status === "ALLOCATED")
    .reduce((s, p) => s + p.amount, 0);
  const pendingPay = payments.filter((p) => p.status === "PENDING");
  const chart = lastSixMonths(payments);
  return { members, schemes, payments, overdue, unmatched, collected, pendingPay, chart, installments };
}

function lastSixMonths(payments: { amount: number; status: string; createdAt: string; deletedAt: string | null }[]) {
  const buckets: { label: string; amount: number }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const amount = payments
      .filter((p) => !p.deletedAt && p.createdAt.startsWith(key) && p.status !== "REVERSED")
      .reduce((s, p) => s + p.amount, 0);
    buckets.push({ label: monthLabel(d.toISOString()), amount });
  }
  return buckets;
}

function MonthBars({ data }: { data: { label: string; amount: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.amount));
  return (
    <div className="flex h-48 items-end gap-2">
      {data.map((d) => (
        <div key={d.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <p className="text-[10px] tabular-nums text-muted">{d.amount ? formatINR(d.amount) : "\u00a0"}</p>
          <div className="flex h-36 w-full items-end rounded-sm bg-surface-2">
            <div
              className="w-full rounded-sm bg-primary"
              style={{ height: `${Math.max(d.amount ? 8 : 0, (d.amount / max) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-muted">{d.label}</p>
        </div>
      ))}
    </div>
  );
}

function SuperDash() {
  const user = useSessionUser()!;
  const k = useKpis();
  const modules = useAppStore((s) => s.modules);
  const logs = useAppStore((s) => s.systemLogs);
  const actionsAll = useAppStore((s) => s.actions);
  const apiClients = useAppStore((s) => s.apiClients);
  const errors = logs.filter((l) => l.level === "ERROR");
  const pending = actionsAll.filter((a) => a.status === "PENDING");
  const clients = apiClients.filter((c) => c.isActive);
  const on = Object.values(modules).filter(Boolean).length;

  return (
    <div className="enter">
      <PageHeader
        kicker={ROLE_LABELS[user.role]}
        title="House desk"
        description="Users, finance, modules, and the developer console live on this one role."
        actions={
          <Button asChild variant="navy">
            <Link to="/developer">
              <Terminal className="size-4" />
              Developer console
            </Link>
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard label="Active members" value={k.members.length} icon={<Users className="size-4" />} />
        <StatCard label="Live schemes" value={k.schemes.length} icon={<Layers className="size-4" />} />
        <StatCard
          label="Booked collections"
          value={formatINR(k.collected)}
          hint="Allocated + approved"
          icon={<IndianRupee className="size-4" />}
        />
        <StatCard
          label="Overdue installments"
          value={k.overdue.length}
          hint={k.unmatched.length ? `${k.unmatched.length} unmatched receipts` : "Aging dues"}
          icon={<AlertTriangle className="size-4" />}
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Modules on" value={`${on}/${Object.keys(modules).length}`} />
        <StatCard label="Active API clients" value={clients.length} />
        <StatCard label="Pending approvals" value={pending.length} hint="Dangerous actions" />
        <StatCard label="Error log" value={errors.length} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardTitle className="mb-4">Collections by month</CardTitle>
          <MonthBars data={k.chart} />
        </Card>
        <Card className="lg:col-span-2">
          <CardTitle className="mb-3">Quick paths</CardTitle>
          <div className="flex flex-col gap-2">
            <DashLink to="/users" label="Manage users" />
            <DashLink to="/roles" label="Roles & permissions" />
            <DashLink to="/developer" label="Developer console" extra={pending.length ? `${pending.length} pending` : undefined} />
            <DashLink to="/developer/modules" label="Enable / disable modules" />
            <DashLink to="/developer/database" label="Database inspector" />
            <DashLink to="/audit" label="Audit log" />
          </div>
        </Card>
      </div>

      <PendingPayments rows={k.pendingPay} />
    </div>
  );
}

function OpsDash() {
  const user = useSessionUser()!;
  const k = useKpis();
  return (
    <div className="enter">
      <PageHeader
        kicker={ROLE_LABELS[user.role]}
        title="Floor desk"
        description="Members, schemes, collections, and allocation — the old admin, staff, and accountant desks in one."
        actions={
          <Button asChild>
            <Link to="/payments/new">Record payment</Link>
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard label="Active members" value={k.members.length} icon={<Users className="size-4" />} />
        <StatCard label="Live schemes" value={k.schemes.length} icon={<Layers className="size-4" />} />
        <StatCard
          label="Booked collections"
          value={formatINR(k.collected)}
          hint="Allocated + approved"
          icon={<IndianRupee className="size-4" />}
        />
        <StatCard
          label="Overdue installments"
          value={k.overdue.length}
          hint={k.unmatched.length ? `${k.unmatched.length} unmatched receipts` : "Aging dues"}
          icon={<AlertTriangle className="size-4" />}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardTitle className="mb-4">Collections by month</CardTitle>
          <MonthBars data={k.chart} />
        </Card>
        <Card className="lg:col-span-2">
          <CardTitle className="mb-3">Quick paths</CardTitle>
          <div className="flex flex-col gap-2">
            <DashLink to="/members" label="Manage members" />
            <DashLink to="/chits" label="Chit schemes" />
            <DashLink to="/payments" label="Review payments" extra={`${k.pendingPay.length} pending`} />
            <DashLink to="/payments/unmatched" label="Unmatched receipts" extra={String(k.unmatched.length)} />
            <DashLink to="/reports" label="Reports" />
          </div>
        </Card>
      </div>

      <PendingPayments rows={k.pendingPay} />
    </div>
  );
}

function PendingPayments({
  rows,
}: {
  rows: { id: string; createdAt: string; memberId: string; amount: number; source: string; status: string }[];
}) {
  return (
    <>
      <h2 className="font-display mt-8 mb-3 text-xl">Pending payments</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-muted">No payments waiting on approval.</p>
      ) : (
        <DataTable headers={["When", "Member", "Amount", "Source", "Status"]}>
          {rows.slice(0, 6).map((p) => (
            <tr key={p.id}>
              <Td className="text-muted">{formatDate(p.createdAt)}</Td>
              <Td>{memberName(p.memberId)}</Td>
              <Td className="tabular-nums">{formatINR(p.amount)}</Td>
              <Td>
                <StatusBadge value={p.source} />
              </Td>
              <Td>
                <StatusBadge value={p.status} />
              </Td>
            </tr>
          ))}
        </DataTable>
      )}
    </>
  );
}

function MemberDash() {
  const user = useSessionUser()!;
  const members = useAppStore((s) => s.members);
  const member = members.find((m) => m.id === user.memberId);
  const enrollmentsAll = useAppStore((s) => s.enrollments);
  const enrollments = enrollmentsAll.filter((e) => e.memberId === user.memberId);
  const schemes = useAppStore((s) => s.schemes);
  const installments = useAppStore((s) => s.installments);
  const paymentsAll = useAppStore((s) => s.payments);
  const payments = paymentsAll.filter((p) => p.memberId === user.memberId && !p.deletedAt);
  const myInst = installments.filter((i) => enrollments.some((e) => e.id === i.memberChitId));
  const overdue = myInst.filter((i) => i.status === "OVERDUE");
  const upcoming = [...myInst.filter((i) => i.status === "PENDING")].sort((a, b) =>
    a.dueDate.localeCompare(b.dueDate),
  )[0];
  const totalPaid = payments
    .filter((p) => p.status === "ALLOCATED" || p.status === "APPROVED")
    .reduce((s, p) => s + p.amount, 0);

  if (!member) {
    return (
      <div className="enter">
        <PageHeader title="My chit fund" description="No member profile is linked to this account yet." />
      </div>
    );
  }

  return (
    <div className="enter">
      <PageHeader
        kicker={member.fullName}
        title="My chit fund"
        description="Your enrollments, dues, and receipts only. There is no path to another subscriber’s book."
        actions={
          <Button asChild variant="outline">
            <Link to="/profile">Profile</Link>
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total paid" value={formatINR(totalPaid)} />
        <StatCard label="Active chits" value={enrollments.length} />
        <StatCard label="Overdue" value={overdue.length} />
        <StatCard
          label="Next due"
          value={upcoming ? formatINR(upcoming.amountDue) : "—"}
          hint={upcoming ? `Due ${formatDate(upcoming.dueDate)}` : "Nothing pending"}
        />
      </div>
      <h2 className="font-display mt-8 mb-3 text-xl">Enrolled schemes</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {enrollments.map((e) => {
          const s = schemes.find((x) => x.id === e.chitSchemeId);
          const inst = myInst.filter((i) => i.memberChitId === e.id);
          const paid = inst.filter((i) => i.status === "PAID").length;
          return (
            <Card key={e.id}>
              <p className="text-xs tracking-[0.14em] text-muted uppercase">{e.status}</p>
              <p className="font-display mt-1 text-xl">{s?.name}</p>
              <p className="mt-2 text-sm text-muted">
                {paid}/{s?.durationMonths} installments paid · {formatINR(s?.installmentAmount ?? 0)} / month
              </p>
            </Card>
          );
        })}
      </div>
      <h2 className="font-display mt-8 mb-3 text-xl">Installments</h2>
      <DataTable headers={["#", "Scheme", "Due", "Amount", "Paid", "Status"]}>
        {myInst
          .slice()
          .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
          .slice(0, 24)
          .map((i) => {
            const enr = enrollments.find((e) => e.id === i.memberChitId);
            const s = schemes.find((x) => x.id === enr?.chitSchemeId);
            return (
              <tr key={i.id}>
                <Td className="tabular-nums text-muted">{i.installmentNumber}</Td>
                <Td>{s?.name ?? "—"}</Td>
                <Td className="text-muted">{formatDate(i.dueDate)}</Td>
                <Td className="tabular-nums">{formatINR(i.amountDue)}</Td>
                <Td className="tabular-nums">{formatINR(i.amountPaid)}</Td>
                <Td>
                  <StatusBadge value={i.status} />
                </Td>
              </tr>
            );
          })}
      </DataTable>
      <h2 className="font-display mt-8 mb-3 text-xl">Payment history</h2>
      <DataTable headers={["Date", "Amount", "Status", "Reference"]}>
        {payments.map((p) => (
          <tr key={p.id}>
            <Td className="text-muted">{formatDate(p.createdAt)}</Td>
            <Td className="tabular-nums">{formatINR(p.amount)}</Td>
            <Td>
              <StatusBadge value={p.status} />
            </Td>
            <Td className="font-mono text-xs">{p.reference}</Td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}

function DashLink({ to, label, extra }: { to: string; label: string; extra?: string }) {
  return (
    <Link
      to={to as "/dashboard"}
      className="flex h-12 items-center justify-between rounded-md bg-surface-2 px-4 text-sm hover:bg-line"
    >
      <span>{label}</span>
      <span className="flex items-center gap-2 text-muted">
        {extra ? <span className="text-xs tabular-nums">{extra}</span> : null}
        <ArrowRight className="size-4" />
      </span>
    </Link>
  );
}

function memberName(id: string) {
  return useAppStore.getState().members.find((m) => m.id === id)?.fullName ?? id;
}
