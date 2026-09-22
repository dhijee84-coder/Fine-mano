import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, DataTable, Td, StatusBadge, Forbidden, ModuleOff } from "@/components/desk";
import { useAppStore } from "@/lib/store";
import { useHas, useModuleOn } from "@/lib/session";
import { formatDateTime } from "@/lib/format";
import { ROLE_LABELS } from "@/lib/permissions";

export const Route = createFileRoute("/_app/audit")({ component: AuditPage });

function AuditPage() {
  const can = useHas("audit.view");
  const moduleOn = useModuleOn("audit_logs");
  const audit = useAppStore((s) => s.audit);
  const users = useAppStore((s) => s.users);

  if (!can) return <Forbidden reason="audit.view is required." />;
  if (!moduleOn) return <ModuleOff name="audit logs" />;

  return (
    <div className="enter">
      <PageHeader
        kicker="Security"
        title="Audit log"
        description="Append-only. There is no edit or delete path — including for Super Admin."
      />
      <DataTable headers={["When", "Who", "Action", "Record", "Result", "Reason"]}>
        {audit.map((a) => (
          <tr key={a.id}>
            <Td className="whitespace-nowrap text-muted">{formatDateTime(a.timestamp)}</Td>
            <Td>
              <div>{users.find((u) => u.id === a.userId)?.username ?? "—"}</div>
              <div className="text-[11px] text-muted">{a.roleName ? ROLE_LABELS[a.roleName] : ""}</div>
            </Td>
            <Td className="font-mono text-xs">{a.action}</Td>
            <Td className="text-xs text-muted">
              {a.recordType} {a.recordId}
            </Td>
            <Td>
              <StatusBadge value={a.result} />
            </Td>
            <Td className="max-w-[220px] truncate text-xs text-muted">{a.reason || a.newValue || "—"}</Td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
