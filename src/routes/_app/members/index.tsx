import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/desk";
import { Button } from "@/components/kit";
import { DataTable, Td, EmptyState, StatusBadge, Forbidden, ModuleOff } from "@/components/desk";
import { useAppStore } from "@/lib/store";
import { useHas, useModuleOn, useVisibleMembers } from "@/lib/session";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_app/members/")({ component: MembersPage });

function MembersPage() {
  const canView = useHas("members.view");
  const canCreate = useHas("members.create");
  const moduleOn = useModuleOn("member_management");
  const members = useVisibleMembers();
  const users = useAppStore((s) => s.users);
  const canPasswords = useHas("members.view_passwords");

  if (!canView) return <Forbidden reason="members.view is required." />;
  if (!moduleOn) return <ModuleOff name="member management" />;

  return (
    <div className="enter">
      <PageHeader
        kicker="Subscribers"
        title="Members"
        description="Every subscriber on the books. Soft-delete keeps financial history."
        actions={
          canCreate ? (
            <Button asChild>
              <Link to="/members/new">
                <Plus className="size-4" />
                New member
              </Link>
            </Button>
          ) : null
        }
      />
      {members.length === 0 ? (
        <EmptyState
          title="No members in this view"
          description="Create the first member."
          action={
            canCreate ? (
              <Button asChild>
                <Link to="/members/new">New member</Link>
              </Button>
            ) : null
          }
        />
      ) : (
        <DataTable
          headers={
            canPasswords
              ? ["Name", "Phone", "City", "User ID", "Password", ""]
              : ["Name", "Phone", "City", "Staff", "Since", ""]
          }
        >
          {members.map((m) => {
            const portal = users.find((u) => u.memberId === m.id);
            return (
            <tr key={m.id} className="hover:bg-surface-2/60">
              <Td className="font-medium">
                <Link to="/members/$memberId" params={{ memberId: m.id }} className="hover:text-primary">
                  {m.fullName}
                </Link>
                {!m.isActive ? (
                  <span className="ml-2">
                    <StatusBadge value="DISABLED" />
                  </span>
                ) : null}
              </Td>
              <Td className="font-mono text-xs">{m.phone}</Td>
              <Td className="text-muted">{m.city}</Td>
              {canPasswords ? (
                <>
                  <Td className="font-mono text-xs">{portal?.username ?? "—"}</Td>
                  <Td className="font-mono text-xs">{portal?.password ?? "no login"}</Td>
                </>
              ) : (
                <>
                  <Td className="text-muted">
                    {users.find((u) => u.id === m.assignedStaffId)?.username ?? "—"}
                  </Td>
                  <Td className="text-muted">{formatDate(m.createdAt)}</Td>
                </>
              )}
              <Td>
                <Link to="/members/$memberId" params={{ memberId: m.id }} className="text-sm text-primary">
                  Open
                </Link>
              </Td>
            </tr>
            );
          })}
        </DataTable>
      )}
    </div>
  );
}
