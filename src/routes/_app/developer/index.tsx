import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Boxes,
  Settings,
  FormInput,
  Menu,
  GitBranch,
  KeyRound,
  ScrollText,
  Landmark,
  Database,
  Skull,
  Activity,
  Bell,
} from "lucide-react";
import { PageHeader } from "@/components/desk";
import { Card } from "@/components/kit";
import { StatusBadge, Forbidden, ModuleOff } from "@/components/desk";
import { useAppStore } from "@/lib/store";
import { useHas, useModuleOn } from "@/lib/session";
import { MODULE_LABELS, type ModuleKey } from "@/lib/permissions";
import { formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/_app/developer/")({ component: DevOverview });

const LINKS: { to: string; label: string; hint: string; icon: typeof Boxes }[] = [
  { to: "/developer/modules", label: "Modules", hint: "Enable / disable route access", icon: Boxes },
  { to: "/developer/settings", label: "Website settings", hint: "Name, locale, company", icon: Settings },
  { to: "/developer/forms", label: "Form builder", hint: "Data-only custom fields", icon: FormInput },
  { to: "/developer/menu", label: "Menu builder", hint: "Nav items + required permission", icon: Menu },
  { to: "/developer/workflows", label: "Workflows", hint: "JSON config, no code exec", icon: GitBranch },
  { to: "/developer/api", label: "API clients", hint: "Secrets always masked", icon: KeyRound },
  { to: "/developer/bank", label: "Bank providers", hint: "Mock adapter until live creds", icon: Landmark },
  { to: "/developer/database", label: "Database inspector", hint: "Allow-listed tables only", icon: Database },
  { to: "/developer/actions", label: "Dangerous actions", hint: "Needs Super Admin approval", icon: Skull },
  { to: "/developer/monitoring", label: "Monitoring", hint: "Logs and backups", icon: Activity },
  { to: "/developer/notifications", label: "Notifications", hint: "Reminder queue", icon: Bell },
];

function DevOverview() {
  const can = useHas("developer.view");
  const moduleOn = useModuleOn("developer_console");
  const modules = useAppStore((s) => s.modules);
  const logs = useAppStore((s) => s.systemLogs);
  const errors = logs.filter((l) => l.level === "ERROR").slice(0, 8);
  const actions = useAppStore((s) => s.actions);
  const pending = actions.filter((a) => a.status === "PENDING").length;

  if (!can) return <Forbidden reason="developer.view is required." />;
  if (!moduleOn) return <ModuleOff name="developer console" />;

  return (
    <div className="enter">
      <PageHeader
        kicker="Developer console"
        title="Overview"
        description="Technical controls. Disabling a module blocks its routes, not just the menu. Financial records stay off-limits unless Super Admin grants developer.financial_access."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {LINKS.map((l) => {
          const Icon = l.icon;
          return (
            <Link
              key={l.to}
              to="/developer/$section"
              params={{ section: l.to.replace("/developer/", "") }}
              className="flex items-start gap-3 rounded-xl bg-surface p-4 hairline transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-card-hover)]"
            >
              <span className="flex size-9 items-center justify-center rounded-md bg-surface-2 text-ink-soft">
                <Icon className="size-4" />
              </span>
              <span>
                <span className="block text-sm font-medium">
                  {l.label}
                  {l.to === "/developer/actions" && pending > 0 ? (
                    <span className="ml-2 text-xs text-warn">({pending} pending)</span>
                  ) : null}
                </span>
                <span className="mt-0.5 block text-xs text-muted">{l.hint}</span>
              </span>
            </Link>
          );
        })}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="font-display mb-3 text-lg">Module status</h3>
          <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {(Object.keys(modules) as ModuleKey[]).map((k) => (
              <li key={k} className="flex items-center justify-between text-sm">
                <span>{MODULE_LABELS[k]}</span>
                <StatusBadge value={modules[k] ? "ENABLED" : "DISABLED"} />
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h3 className="font-display mb-3 text-lg">Recent errors</h3>
          {errors.length === 0 ? (
            <p className="text-sm text-muted">No recent errors logged.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {errors.map((e) => (
                <li key={e.id}>
                  <span className="text-xs text-muted">{formatDateTime(e.timestamp)}</span>
                  <span className="ml-2 font-mono text-xs">{e.source}</span>
                  <p>{e.message}</p>
                </li>
              ))}
            </ul>
          )}
          <Link
            to="/developer/$section"
            params={{ section: "monitoring" }}
            className="mt-3 inline-flex items-center gap-1 text-sm text-primary"
          >
            <ScrollText className="size-4" />
            Full log
          </Link>
        </Card>
      </div>
    </div>
  );
}
