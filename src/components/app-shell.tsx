import { useState, type ReactNode } from "react";
import { Link, Navigate, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  LayoutDashboard,
  Users,
  Layers,
  IndianRupee,
  BarChart3,
  Shield,
  ScrollText,
  Terminal,
  UserRound,
  LogOut,
  Menu,
  X,
  AlertCircle,
  CircleHelp,
  Database,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { useHas, useSessionUser } from "@/lib/session";
import { ROLE_LABELS } from "@/lib/permissions";
import { Button, Badge } from "@/components/kit";
import { initials } from "@/lib/format";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  show: boolean;
};

export function AppShell({ children }: { children: ReactNode }) {
  const user = useSessionUser();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const logout = useAppStore((s) => s.logout);
  const settings = useAppStore((s) => s.settings);
  const unmatchedOpen = useAppStore(
    (s) => s.unmatched.filter((u) => u.status === "OPEN").length,
  );
  const pendingActions = useAppStore(
    (s) => s.actions.filter((a) => a.status === "PENDING").length,
  );
  const canMembers = useHas("members.view");
  const canChits = useHas("chits.view");
  const canPayments = useHas("payments.view");
  const canReports = useHas("reports.view");
  const canUsers = useHas("users.view");
  const canAudit = useHas("audit.view");
  const unreadAlerts = useAppStore(
    (s) => (s.alerts ?? []).filter((a) => a.userId === user?.id && !a.read).length,
  );

  const items: NavItem[] = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, show: true },
    { to: "/members", label: "Members", icon: Users, show: canMembers },
    { to: "/chits", label: "Chits", icon: Layers, show: canChits },
    { to: "/payments", label: "Payments", icon: IndianRupee, show: canPayments },
    { to: "/reports", label: "Reports", icon: BarChart3, show: canReports },
    { to: "/users", label: "Users", icon: Shield, show: canUsers },
    { to: "/house", label: "House book", icon: Database, show: user?.role === "SUPER_ADMIN" },
    { to: "/roles", label: "Roles", icon: BookOpen, show: user?.role === "SUPER_ADMIN" },
    { to: "/audit", label: "Audit log", icon: ScrollText, show: canAudit },
    { to: "/developer", label: "Developer", icon: Terminal, show: canDev },
    { to: "/notifications", label: "Alerts", icon: Bell, show: true },
    { to: "/profile", label: "My profile", icon: UserRound, show: user?.role === "MEMBER" },
    { to: "/instructions", label: "Instructions", icon: CircleHelp, show: true },
  ];

  const visible = items.filter((i) => i.show);
  const brand = settings.site_name || "Nidhi";

  const nav = (
    <nav className="flex flex-1 flex-col gap-0.5 px-3">
      {visible.map((item) => {
        const active =
          pathname === item.to || (item.to !== "/dashboard" && pathname.startsWith(item.to));
        const Icon = item.icon;
        const badge =
          item.to === "/payments" && unmatchedOpen > 0
            ? unmatchedOpen
            : item.to === "/developer" && pendingActions > 0
              ? pendingActions
              : item.to === "/notifications" && unreadAlerts > 0
                ? unreadAlerts
                : 0;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={cn(
              "flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-150",
              active
                ? "bg-navy-2 text-navy-fg"
                : "text-navy-muted hover:bg-navy-2/60 hover:text-navy-fg",
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="flex-1">{item.label}</span>
            {badge > 0 ? (
              <span className="rounded-full bg-danger px-1.5 py-0.5 text-[10px] font-medium text-primary-fg tabular-nums">
                {badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-dvh bg-bg">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col bg-navy text-navy-fg lg:flex">
        <Link to="/dashboard" className="flex items-baseline gap-2 px-6 pt-6 pb-5">
          <span className="font-display text-2xl italic tracking-tight">{brand}</span>
          <span className="text-[10px] tracking-[0.16em] text-navy-muted uppercase">
            Chits
          </span>
        </Link>
        {nav}
        <div className="mt-auto border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-navy-2 text-xs font-medium">
              {user ? initials(user.username) : "—"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{user?.username}</p>
              <p className="truncate text-[11px] text-navy-muted">
                {user ? ROLE_LABELS[user.role] : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
              }}
              className="rounded-sm p-2 text-navy-muted hover:bg-navy-2 hover:text-navy-fg"
              aria-label="Log out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-bg/90 px-4 py-3 backdrop-blur-sm lg:hidden">
        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-md"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>
        <span className="font-display text-xl italic">{brand}</span>
        <div className="flex items-center gap-1">
          {unmatchedOpen > 0 && canPayments ? (
            <Link
              to="/payments/unmatched"
              className="flex size-11 items-center justify-center rounded-md text-warn"
              aria-label={`${unmatchedOpen} unmatched receipts`}
            >
              <AlertCircle className="size-5" />
            </Link>
          ) : null}
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-md"
            onClick={() => logout()}
            aria-label="Log out"
          >
            <LogOut className="size-5" />
          </button>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-navy text-navy-fg">
            <div className="flex items-center justify-between px-4 pt-4 pb-3">
              <span className="font-display text-2xl italic">{brand}</span>
              <button
                type="button"
                className="flex size-11 items-center justify-center"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>
            {nav}
            <div className="mt-auto border-t border-white/10 p-4 text-sm">
              <p>{user?.username}</p>
              <p className="text-navy-muted">{user ? ROLE_LABELS[user.role] : ""}</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="lg:pl-60">
        <div className="max-lg:hidden flex items-center justify-between px-8 pt-6 lg:flex">
          <div className="flex items-center gap-2 text-xs text-muted">
            {unmatchedOpen > 0 && canPayments ? (
              <Link
                to="/payments/unmatched"
                className="inline-flex items-center gap-1.5 rounded-full bg-warn-bg px-3 py-1 text-warn"
              >
                <AlertCircle className="size-3.5" />
                {unmatchedOpen} unmatched
              </Link>
            ) : null}
          </div>
          <Badge tone="navy">{user ? ROLE_LABELS[user.role] : ""}</Badge>
        </div>
        <main className="mx-auto min-w-0 max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:pt-4 lg:pb-12">{children}</main>
      </div>
    </div>
  );
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const hydrated = useAppStore((s) => s.hasHydrated);
  const user = useSessionUser();
  if (!hydrated) {
    return <div className="min-h-dvh bg-bg" aria-busy="true" />;
  }
  if (!user) return <Navigate to="/" />;
  if (!user.isActive) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3">
        <p>This account is disabled.</p>
        <Button onClick={() => useAppStore.getState().logout()}>Sign out</Button>
      </div>
    );
  }
  return <AppShell>{children}</AppShell>;
}
