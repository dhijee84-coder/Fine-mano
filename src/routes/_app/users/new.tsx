import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/desk";
import { Button, Card, Field, Input, Select } from "@/components/kit";
import { Forbidden } from "@/components/desk";
import { useAppStore } from "@/lib/store";
import { useHas, useSessionUser } from "@/lib/session";
import { ROLE_LABELS, assignableRoles, type RoleName } from "@/lib/permissions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/users/new")({ component: NewUserPage });

const ROLE_HINT: Record<RoleName, string> = {
  SUPER_ADMIN: "House desk — users, modules, APIs, approvals.",
  ADMIN: "Floor desk — members, schemes, collections, reports.",
  MEMBER: "Portal login tied to one live subscriber. They only see their own chits.",
};

function NewUserPage() {
  const can = useHas("users.create");
  const actor = useSessionUser();
  const roles = assignableRoles(actor?.role);
  const navigate = useNavigate();
  const createUser = useAppStore((s) => s.createUser);
  const members = useAppStore((s) => s.members);
  const users = useAppStore((s) => s.users);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RoleName>(roles.includes("ADMIN") ? "ADMIN" : (roles[0] ?? "ADMIN"));
  const [memberId, setMemberId] = useState("");

  if (!can) return <Forbidden reason="users.create is required." />;
  if (roles.length === 0) return <Forbidden reason="Members cannot create desk logins." />;

  const linked = new Set(users.map((u) => u.memberId).filter(Boolean));
  const freeMembers = members.filter((m) => m.isActive && !m.deletedAt && !linked.has(m.id));
  const house = actor?.role === "SUPER_ADMIN";

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!roles.includes(role)) {
      toast.error("That role is not allowed from this desk.");
      return;
    }
    const res = createUser({
      username,
      email,
      password,
      role,
      memberId: role === "MEMBER" ? memberId : null,
    });
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(`${ROLE_LABELS[role]} login created.`);
    navigate({ to: "/users" });
  }

  return (
    <div className="enter mx-auto max-w-xl">
      <PageHeader
        kicker="Users"
        title={house ? "New login" : "Add Admin or Member"}
        description={
          house
            ? "House, floor, or member portal. Pick the desk first."
            : "This desk can add a floor Admin or a member portal login. Super Admin cannot be created here."
        }
      />
      <Card>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <p className="mb-2 text-xs font-medium tracking-wide text-muted">Login type</p>
            <div className="grid gap-2">
              {roles.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={cn(
                    "rounded-lg px-4 py-3 text-left hairline transition-colors",
                    role === r ? "bg-navy text-navy-fg" : "bg-surface-2 hover:bg-line",
                  )}
                >
                  <span className="block text-sm font-medium">{ROLE_LABELS[r]}</span>
                  <span className={cn("mt-0.5 block text-xs", role === r ? "text-navy-fg/80" : "text-muted")}>
                    {ROLE_HINT[r]}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <Field label="User ID">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="off"
              placeholder={role === "MEMBER" ? "lakshmi" : "floor.admin"}
            />
          </Field>
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
          <Field label="Password">
            <Input type="password" minLength={4} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Field>
          {role === "MEMBER" ? (
            <Field label="Subscriber (alive, no portal yet)">
              <Select value={memberId} onChange={(e) => setMemberId(e.target.value)} required>
                <option value="">Select the person this login belongs to</option>
                {freeMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} · {m.phone}
                  </option>
                ))}
              </Select>
            </Field>
          ) : null}
          <div className="mt-1 flex gap-2">
            <Button type="submit">Create {ROLE_LABELS[role]}</Button>
            <Button type="button" variant="ghost" onClick={() => navigate({ to: "/users" })}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
