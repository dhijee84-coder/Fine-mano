import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/desk";
import { Button, Card, CardTitle, Field, Input, Select } from "@/components/kit";
import { Forbidden } from "@/components/desk";
import { useAppStore } from "@/lib/store";
import { useHas, useSessionUser } from "@/lib/session";
import { PERMISSIONS, ROLE_LABELS, assignableRoles, type RoleName } from "@/lib/permissions";

export const Route = createFileRoute("/_app/users/$userId")({ component: UserDetail });

function UserDetail() {
  const { userId } = Route.useParams();
  const canView = useHas("users.view");
  const canRoles = useHas("users.assign_roles");
  const canPerms = useHas("users.manage_permissions");
  const actor = useSessionUser();
  const roles = assignableRoles(actor?.role);
  const user = useAppStore((s) => s.users.find((u) => u.id === userId));
  const overridesAll = useAppStore((s) => s.overrides);
  const overrides = overridesAll.filter((o) => o.userId === userId);
  const changeRole = useAppStore((s) => s.changeRole);
  const setOverride = useAppStore((s) => s.setOverride);
  const effective = user ? [...useAppStore.getState().effectivePermissions(user)].sort() : [];
  const [role, setRole] = useState<RoleName>(user?.role ?? "ADMIN");
  const [code, setCode] = useState("payments.approve");
  const [grant, setGrant] = useState("true");
  const [reason, setReason] = useState("");

  if (!canView) return <Forbidden />;
  if (!user) return <Forbidden reason="User not found." />;

  const codes = Object.keys(PERMISSIONS).sort();

  function onRole(e: FormEvent) {
    e.preventDefault();
    const res = changeRole(userId, role);
    if (!res.ok) toast.error(res.error);
    else toast.success("Role updated.");
  }

  function onOverride(e: FormEvent) {
    e.preventDefault();
    const res = setOverride(userId, code, grant === "true", reason);
    if (!res.ok) toast.error(res.error);
    else {
      toast.success("Override saved.");
      setReason("");
    }
  }

  return (
    <div className="enter">
      <PageHeader
        kicker="User"
        title={user.username}
        description={`${user.email} · ${ROLE_LABELS[user.role]}`}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle className="mb-3">Role</CardTitle>
          {canRoles ? (
            <form onSubmit={onRole} className="flex flex-col gap-3">
              <Field label="Role">
                <Select value={role} onChange={(e) => setRole(e.target.value as RoleName)}>
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </option>
                  ))}
                </Select>
              </Field>
              <Button type="submit" className="w-fit">
                Save role
              </Button>
            </form>
          ) : (
            <p className="text-sm text-muted">{ROLE_LABELS[user.role]}</p>
          )}
        </Card>
        <Card>
          <CardTitle className="mb-3">Permission override</CardTitle>
          {canPerms ? (
            <form onSubmit={onOverride} className="flex flex-col gap-3">
              <Field label="Permission">
                <Select value={code} onChange={(e) => setCode(e.target.value)}>
                  {codes.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Action">
                <Select value={grant} onChange={(e) => setGrant(e.target.value)}>
                  <option value="true">Grant (add on top of role)</option>
                  <option value="false">Revoke (remove even if role has it)</option>
                </Select>
              </Field>
              <Field label="Reason (required)">
                <Input value={reason} onChange={(e) => setReason(e.target.value)} required />
              </Field>
              <Button type="submit" className="w-fit">
                Save override
              </Button>
            </form>
          ) : (
            <p className="text-sm text-muted">You cannot change individual grants.</p>
          )}
          {overrides.length > 0 ? (
            <ul className="mt-4 space-y-1 text-xs text-muted">
              {overrides.map((o) => (
                <li key={o.id}>
                  {o.grant ? "GRANT" : "REVOKE"} {o.permissionCode} — {o.reason}
                </li>
              ))}
            </ul>
          ) : null}
        </Card>
      </div>
      <Card className="mt-4">
        <CardTitle className="mb-3">Effective permissions ({effective.length})</CardTitle>
        <div className="flex flex-wrap gap-1.5">
          {effective.map((c) => (
            <span key={c} className="rounded-sm bg-surface-2 px-2 py-1 font-mono text-[11px]">
              {c}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}
