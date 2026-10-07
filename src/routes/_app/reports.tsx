import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatCard } from "@/components/desk";
import { Card, CardTitle } from "@/components/kit";
import { DataTable, Td, Forbidden, ModuleOff } from "@/components/desk";
import { useAppStore } from "@/lib/store";
import { useHas, useModuleOn } from "@/lib/session";
import { formatINR } from "@/lib/format";

export const Route = createFileRoute("/_app/reports")({ component: ReportsPage });

function ReportsPage() {
  const can = useHas("reports.view");
  const moduleOn = useModuleOn("reports");
  const paymentsAll = useAppStore((s) => s.payments);
  const payments = paymentsAll.filter((p) => !p.deletedAt);
  const installments = useAppStore((s) => s.installments);
  const membersAll = useAppStore((s) => s.members);
  const members = membersAll.filter((m) => !m.deletedAt);
  const schemes = useAppStore((s) => s.schemes);
  const enrollments = useAppStore((s) => s.enrollments);

  if (!can) return <Forbidden />;
  if (!moduleOn) return <ModuleOff name="reports" />;

  const collected = payments
    .filter((p) => p.status === "APPROVED" || p.status === "ALLOCATED")
    .reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter((p) => p.status === "PENDING").reduce((s, p) => s + p.amount, 0);
  const overdueAmt = installments
    .filter((i) => i.status === "OVERDUE")
    .reduce((s, i) => s + (i.amountDue - i.amountPaid), 0);

  const bySource = ["MANUAL", "BANK"].map((src) => ({
    name: src,
    value: payments.filter((p) => p.source === src).reduce((s, p) => s + p.amount, 0),
  }));
  const sourceMax = Math.max(1, ...bySource.map((s) => s.value));

  const byScheme = schemes.map((s) => {
    const enr = enrollments.filter((e) => e.chitSchemeId === s.id);
    const inst = installments.filter((i) => enr.some((e) => e.id === i.memberChitId));
    const due = inst.reduce((a, i) => a + i.amountDue, 0);
    const paid = inst.reduce((a, i) => a + i.amountPaid, 0);
    return { name: s.name, enrolled: enr.length, due, paid, gap: due - paid };
  });

  return (
    <div className="enter">
      <PageHeader
        kicker="Books"
        title="Reports"
        description="Collection mix, overdue aging, and scheme fill. Export is a later cut — the numbers here are live."
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Booked" value={formatINR(collected)} />
        <StatCard label="Pending receipts" value={formatINR(pending)} />
        <StatCard label="Overdue outstanding" value={formatINR(overdueAmt)} />
        <StatCard label="Subscribers" value={members.length} />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardTitle className="mb-4">Source mix</CardTitle>
          <ul className="flex flex-col gap-3">
            {bySource.map((s) => (
              <li key={s.name}>
                <div className="mb-1 flex justify-between text-xs">
                  <span>{s.name}</span>
                  <span className="tabular-nums">{formatINR(s.value)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(s.value / sourceMax) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <div className="lg:col-span-3">
          <DataTable headers={["Scheme", "Enrolled", "Due", "Collected", "Gap"]}>
            {byScheme.map((r) => (
              <tr key={r.name}>
                <Td className="font-medium">{r.name}</Td>
                <Td className="tabular-nums">{r.enrolled}</Td>
                <Td className="tabular-nums">{formatINR(r.due)}</Td>
                <Td className="tabular-nums">{formatINR(r.paid)}</Td>
                <Td className="tabular-nums">{formatINR(r.gap)}</Td>
              </tr>
            ))}
          </DataTable>
        </div>
      </div>
    </div>
  );
}
