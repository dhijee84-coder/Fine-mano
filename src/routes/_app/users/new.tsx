import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/desk";
import { Button, Card, Field, Input, Select } from "@/components/kit";
import { Forbidden } from "@/components/desk";
import { useAppStore } from "@/lib/store";
import { useHas } from "@/lib/session";
import { ROLE_LABELS, ROLE_NAMES, type RoleName } from "@/lib/permissions";

export const Route = createFileRoute("/_app/users/new")({ component: NewUserPage });

function NewUserPage() {
  const can = useHas("users.create");
  const navigate = useNavigate();
  const createUser = useAppStore((s) => s.createUser);
  const members = useAppStore((s) => s.members);
  const users = useAppStore((s) => s.users);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RoleName>("ADMIN");
  const [memberId, setMemberId] = useState("");

  if (!can) return <Forbidden reason="users.create is required." />;

  const linked = new Set(users.map((u) => u.memberId).filter(Boolean));
  const freeMembers = members.filter((m) => !m.deletedAt && !linked.has(m.id));

  function onSubmit(e: FormEvent) {
    e.preventDefault();
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
    toast.success("User created.");
    navigate({ to: "/users" });
  }

  return (
    <div className="enter mx-auto max-w-xl">
      <PageHeader kicker="Users" title="New user" />
      <Card>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <Field label="Username">
            <Input value={username} onChange={(e) => setUsername(e.target.value)} required />
          </Field>
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
          <Field label="Password">
            <Input type="password" minLength={4} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Field>
          <Field label="Role">
            <Select value={role} onChange={(e) => setRole(e.target.value as RoleName)}>
              {ROLE_NAMES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </Select>
          </Field>
          {role === "MEMBER" ? (
            <Field label="Link to subscriber">
              <Select value={memberId} onChange={(e) => setMemberId(e.target.value)} required>
                <option value="">Select…</option>
                {freeMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName}
                  </option>
                ))}
              </Select>
            </Field>
          ) : null}
          <div className="mt-2 flex gap-2">
            <Button type="submit">Create</Button>
            <Button type="button" variant="ghost" onClick={() => navigate({ to: "/users" })}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
