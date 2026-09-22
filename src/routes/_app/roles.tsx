import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/desk";
import { Button, Card, CardTitle } from "@/components/kit";
import { Forbidden } from "@/components/desk";
import { useSessionUser } from "@/lib/session";
import { useAppStore } from "@/lib/store";
import {
  PERMISSIONS,
  ROLE_DEFAULTS,
  ROLE_LABELS,
  ROLE_NAMES,
  type RoleName,
} from "@/lib/permissions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/roles")({ component: RolesPage });

function RolesPage() {
  const user = useSessionUser();
  const setRolePermissions = useAppStore((s) => s.setRolePermissions);
  const rolePerms = useAppStore((s) => s.rolePerms);
  const [tick, setTick] = useState(0);
  const categories = useMemo(() => {
    void tick;
    const map = new Map<string, string[]>();
    for (const [code, meta] of Object.entries(PERMISSIONS)) {
      const list = map.get(meta[0]) ?? [];
      list.push(code);
      map.set(meta[0], list);
    }
    return map;
  }, [tick]);

  if (user?.role !== "SUPER_ADMIN") {
    return <Forbidden reason="Only Super Admin can manage role defaults." />;
  }

  return (
    <div className="enter">
      <PageHeader
        kicker="Access control"
        title="Roles & permissions"
        description="Three desks. Super Admin holds the house and the developer console. Admin runs the floor. Member sees only their own chits."
      />
      <div className="flex flex-col gap-4">
        {ROLE_NAMES.map((role) => (
          <RoleCard
            key={role}
            role={role}
            categories={categories}
            onSave={(codes) => {
              const res = setRolePermissions(role, codes);
              if (!res.ok) toast.error(res.error);
              else {
                toast.success(`Saved ${ROLE_LABELS[role]}.`);
                setTick((t) => t + 1);
              }
            }}
            initial={rolePerms[role] ?? ROLE_DEFAULTS[role]}
          />
        ))}
      </div>
    </div>
  );
}

function RoleCard({
  role,
  categories,
  onSave,
  initial,
}: {
  role: RoleName;
  categories: Map<string, string[]>;
  onSave: (codes: string[]) => void;
  initial: string[];
}) {
  const locked = role === "SUPER_ADMIN";
  const [selected, setSelected] = useState<Set<string>>(() => new Set(initial));

  function toggle(code: string) {
    if (locked) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }

  return (
    <Card>
      <CardTitle className="mb-1">{ROLE_LABELS[role]}</CardTitle>
      <p className="mb-4 text-sm text-muted">
        {locked ? "Always every permission." : `${selected.size} permissions selected.`}
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...categories.entries()].map(([cat, codes]) => (
          <div key={cat}>
            <p className="mb-1.5 text-[11px] tracking-[0.14em] text-muted uppercase">{cat}</p>
            <ul className="flex flex-col gap-1">
              {codes.map((code) => {
                const meta = PERMISSIONS[code];
                const on = selected.has(code);
                return (
                  <li key={code}>
                    <label
                      className={cn(
                        "flex cursor-pointer items-start gap-2 rounded-sm px-1 py-0.5 text-xs",
                        locked && "cursor-default opacity-70",
                      )}
                    >
                      <input
                        type="checkbox"
                        className="mt-0.5"
                        checked={on}
                        disabled={locked}
                        onChange={() => toggle(code)}
                      />
                      <span>
                        <span className="font-mono">{code}</span>
                        {meta?.[3] ? <span className="ml-1 text-danger">danger</span> : null}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      {locked ? null : (
        <Button className="mt-4" onClick={() => onSave([...selected])}>
          Save {ROLE_LABELS[role]}
        </Button>
      )}
    </Card>
  );
}
