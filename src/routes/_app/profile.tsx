import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/desk";
import { Card } from "@/components/kit";
import { DataTable, Td, StatusBadge, Forbidden, ModuleOff } from "@/components/desk";
import { useAppStore } from "@/lib/store";
import { useModuleOn, useSessionUser } from "@/lib/session";
import { formatDate, formatINR } from "@/lib/format";

export const Route = createFileRoute("/_app/profile")({ component: ProfilePage });

function ProfilePage() {
  const user = useSessionUser();
  const moduleOn = useModuleOn("member_portal");
  const member = useAppStore((s) => s.members.find((m) => m.id === user?.memberId));
  const enrollmentsAll = useAppStore((s) => s.enrollments);
  const enrollments = enrollmentsAll.filter((e) => e.memberId === user?.memberId);
  const schemes = useAppStore((s) => s.schemes);
  const installments = useAppStore((s) => s.installments);

  if (user?.role !== "MEMBER") {
    return <Forbidden reason="Member profile is only available on a Member-role account." />;
  }
  if (!moduleOn) return <ModuleOff name="member portal" />;
  if (!member) return <Forbidden reason="No member record is linked to this account." />;

  const myInst = installments.filter((i) => enrollments.some((e) => e.id === i.memberChitId));

  return (
    <div className="enter">
      <PageHeader kicker="Self-service" title={member.fullName} description="Your own record. The URL never accepts another member’s id." />
      <Card className="mb-6">
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-[11px] tracking-[0.14em] text-muted uppercase">Phone</dt>
            <dd className="mt-1">{member.phone}</dd>
          </div>
          <div>
            <dt className="text-[11px] tracking-[0.14em] text-muted uppercase">Email</dt>
            <dd className="mt-1">{member.email}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-[11px] tracking-[0.14em] text-muted uppercase">Address</dt>
            <dd className="mt-1">
              {member.address}, {member.city}
            </dd>
          </div>
        </dl>
      </Card>
      <h2 className="font-display mb-3 text-xl">Upcoming & overdue</h2>
      <DataTable headers={["Scheme", "#", "Due", "Amount", "Paid", "Status"]}>
        {myInst
          .filter((i) => i.status === "PENDING" || i.status === "OVERDUE" || i.status === "PARTIAL")
          .map((i) => {
            const enr = enrollments.find((e) => e.id === i.memberChitId);
            const s = schemes.find((x) => x.id === enr?.chitSchemeId);
            return (
              <tr key={i.id}>
                <Td>{s?.name}</Td>
                <Td className="tabular-nums">{i.installmentNumber}</Td>
                <Td>{formatDate(i.dueDate)}</Td>
                <Td className="tabular-nums">{formatINR(i.amountDue)}</Td>
                <Td className="tabular-nums">{formatINR(i.amountPaid)}</Td>
                <Td>
                  <StatusBadge value={i.status} />
                </Td>
              </tr>
            );
          })}
      </DataTable>
    </div>
  );
}
