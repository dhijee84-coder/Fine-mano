import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/desk";
import { Button } from "@/components/kit";
import { DataTable, Td, StatusBadge, Forbidden } from "@/components/desk";
import { useAppStore } from "@/lib/store";
import { useHas, useSessionUser } from "@/lib/session";
import { ROLE_LABELS } from "@/lib/permissions";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_app/users/")({ component: UsersPage });

function UsersPage() {
  const canView = useHas("users.view");
  const canCreate = useHas("users.create");
  const canDisable = useHas("users.delete");
  const actor = useSessionUser();
  const house = actor?.role === "SUPER_ADMIN";
  const users = useAppStore((s) => s.users);
  const members = useAppStore((s) => s.members);
  const disableUser = useAppStore((s) => s.disableUser);
  const enableUser = useAppStore((s) => s.enableUser);

  if (!canView) return <Forbidden reason="users.view is required." />;

  return (
    <div className="enter">
      <PageHeader
        kicker="Access"
        title="Users"
        description={
          house
            ? "House, floor, and member portal logins."
            : canCreate
              ? "Add a floor Admin or a member portal login. Super Admin cannot be added from this desk."
              : "Desk logins."
        }
        actions={
          canCreate ? (
            <Button asChild>
              <Link to="/users/new">
                <Plus className="size-4" />
                {house ? "New login" : "Add Admin or Member"}
              </Link>
            </Button>
          ) : null
        }
      />
      <DataTable headers={["Username", "Email", "Role", "Subscriber", "Status", "Since", ""]}>
        {users.map((u) => (
          <tr key={u.id}>
            <Td className="font-medium">
              <Link to="/users/$userId" params={{ userId: u.id }} className="hover:text-primary">
                {u.username}
              </Link>
            </Td>
            <Td className="text-muted">{u.email}</Td>
            <Td>{ROLE_LABELS[u.role]}</Td>
            <Td className="text-muted">
              {u.memberId
                ? (members.find((m) => m.id === u.memberId)?.fullName ?? u.memberId)
                : "—"}
            </Td>
            <Td>
              <StatusBadge value={u.isActive ? "ACTIVE" : "DISABLED"} />
            </Td>
            <Td className="text-muted">{formatDate(u.createdAt)}</Td>
            <Td>
              <div className="flex gap-2">
                <Link to="/users/$userId" params={{ userId: u.id }} className="text-sm text-primary">
                  Open
                </Link>
                {canDisable && u.isActive ? (
                  <button
                    type="button"
                    className="text-sm text-danger"
                    onClick={() => {
                      const res = disableUser(u.id);
                      if (!res.ok) toast.error(res.error);
                      else toast.success("Disabled.");
                    }}
                  >
                    Disable
                  </button>
                ) : null}
                {canDisable && !u.isActive ? (
                  <button
                    type="button"
                    className="text-sm text-primary"
                    onClick={() => enableUser(u.id)}
                  >
                    Enable
                  </button>
                ) : null}
              </div>
            </Td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
