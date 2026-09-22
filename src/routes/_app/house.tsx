import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader, DataTable, Td, StatusBadge, Forbidden } from "@/components/desk";
import { Button, Card, CardTitle } from "@/components/kit";
import { useSessionUser } from "@/lib/session";
import { useAppStore } from "@/lib/store";
import { ADMIN_SCREENS, ROLE_DEFAULTS } from "@/lib/permissions";
import { formatINR } from "@/lib/format";

export const Route = createFileRoute("/_app/house")({ component: HousePage });

function HousePage() {
  const user = useSessionUser();
  if (user?.role !== "SUPER_ADMIN") {
    return <Forbidden reason="Only Super Admin can open the house book." />;
  }
  return (
    <div className="enter flex flex-col gap-10">
      <PageHeader
        kicker="House"
        title="Book and Admin view"
        description="Every table, the matrix that decides what Admin sees, and in-app alerts — no SMS bill."
      />
      <AlertActions />
      <AdminMatrix />
      <BookTables />
    </div>
  );
}

function AlertActions() {
  const sendDue = useAppStore((s) => s.sendDueReminders);
  return (
    <Card>
      <CardTitle className="mb-1">In-app alerts</CardTitle>
      <p className="mb-4 text-sm text-muted">
        Each account has its own notification feed (bell). Web alerts are optional in the browser. Cheaper and faster than SMS.
      </p>
      <Button
        type="button"
        onClick={() => {
          const res = sendDue();
          if (!res.ok) toast.error(res.error);
          else toast.success(`${res.sent} overdue alerts posted to member accounts.`);
        }}
      >
        Notify overdue
      </Button>
    </Card>
  );
}

function AdminMatrix() {
  const rolePerms = useAppStore((s) => s.rolePerms);
  const setRolePermissions = useAppStore((s) => s.setRolePermissions);
  const adminCodes = useMemo(() => new Set(rolePerms.ADMIN ?? ROLE_DEFAULTS.ADMIN), [rolePerms]);

  function screenOn(codes: string[]) {
    return codes.every((c) => adminCodes.has(c));
  }

  function toggle(codes: string[], on: boolean) {
    const next = new Set(adminCodes);
    for (const c of codes) {
      if (on) next.add(c);
      else next.delete(c);
    }
    const res = setRolePermissions("ADMIN", [...next]);
    if (!res.ok) toast.error(res.error);
    else toast.success("Admin view updated.");
  }

  return (
    <div>
      <h2 className="font-display mb-2 text-xl">What Admin can see</h2>
      <p className="mb-3 text-sm text-muted">
        Turn a row off and that screen, column, or action disappears from the Admin desk. Super Admin always sees everything.
      </p>
      <DataTable headers={["Screen", "What it controls", "Admin"]}>
        {ADMIN_SCREENS.map((s) => {
          const on = screenOn(s.codes);
          return (
            <tr key={s.key}>
              <Td className="font-medium">{s.label}</Td>
              <Td className="text-muted">{s.hint}</Td>
              <Td>
                <label className="flex h-11 items-center gap-2 text-sm">
                  <input type="checkbox" checked={on} onChange={() => toggle(s.codes, !on)} />
                  {on ? "On" : "Off"}
                </label>
              </Td>
            </tr>
          );
        })}
      </DataTable>
    </div>
  );
}

function BookTables() {
  const members = useAppStore((s) => s.members);
  const users = useAppStore((s) => s.users);
  const schemes = useAppStore((s) => s.schemes);
  const payments = useAppStore((s) => s.payments);
  const enrollments = useAppStore((s) => s.enrollments);
  const [tab, setTab] = useState<"members" | "users" | "schemes" | "payments">("members");

  return (
    <div>
      <h2 className="font-display mb-2 text-xl">Entire book</h2>
      <p className="mb-3 text-sm text-muted">
        Super Admin read of every row. Member passwords are here so you can issue or check portal logins.
      </p>
      <div className="mb-3 flex flex-wrap gap-2">
        {(
          [
            ["members", "Members"],
            ["users", "Users"],
            ["schemes", "Schemes"],
            ["payments", "Payments"],
          ] as const
        ).map(([k, label]) => (
          <Button key={k} size="sm" variant={tab === k ? "default" : "outline"} onClick={() => setTab(k)}>
            {label}
          </Button>
        ))}
      </div>
      {tab === "members" ? (
        <DataTable headers={["Name", "Phone", "City", "User ID", "Password"]}>
          {members
            .filter((m) => !m.deletedAt)
            .map((m) => {
              const u = users.find((x) => x.memberId === m.id);
              return (
                <tr key={m.id}>
                  <Td className="font-medium">{m.fullName}</Td>
                  <Td className="font-mono text-xs">{m.phone}</Td>
                  <Td className="text-muted">{m.city}</Td>
                  <Td className="font-mono text-xs">{u?.username ?? "—"}</Td>
                  <Td className="font-mono text-xs">{u?.password ?? "no login"}</Td>
                </tr>
              );
            })}
        </DataTable>
      ) : null}
      {tab === "users" ? (
        <DataTable headers={["User ID", "Password", "Role", "Active"]}>
          {users.map((u) => (
            <tr key={u.id}>
              <Td className="font-mono text-sm">{u.username}</Td>
              <Td className="font-mono text-xs">{u.password}</Td>
              <Td>{u.role}</Td>
              <Td>
                <StatusBadge value={u.isActive ? "ACTIVE" : "DISABLED"} />
              </Td>
            </tr>
          ))}
        </DataTable>
      ) : null}
      {tab === "schemes" ? (
        <DataTable headers={["Scheme", "Corpus", "Enrolled", "Status"]}>
          {schemes.map((s) => (
            <tr key={s.id}>
              <Td className="font-medium">{s.name}</Td>
              <Td className="tabular-nums">{formatINR(s.totalAmount)}</Td>
              <Td className="tabular-nums">{enrollments.filter((e) => e.chitSchemeId === s.id).length}</Td>
              <Td>
                <StatusBadge value={s.status} />
              </Td>
            </tr>
          ))}
        </DataTable>
      ) : null}
      {tab === "payments" ? (
        <DataTable headers={["Amount", "Source", "Status", "Member"]}>
          {payments
            .filter((p) => !p.deletedAt)
            .slice(0, 40)
            .map((p) => (
              <tr key={p.id}>
                <Td className="tabular-nums">{formatINR(p.amount)}</Td>
                <Td>
                  <StatusBadge value={p.source} />
                </Td>
                <Td>
                  <StatusBadge value={p.status} />
                </Td>
                <Td>{members.find((m) => m.id === p.memberId)?.fullName ?? p.memberId}</Td>
              </tr>
            ))}
        </DataTable>
      ) : null}
    </div>
  );
}
