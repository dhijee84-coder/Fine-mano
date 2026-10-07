import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button, Field, Input } from "@/components/kit";
import { DEMO_ACCOUNTS } from "@/lib/seed";
import { useAppStore } from "@/lib/store";
import { useSessionUser } from "@/lib/session";
import { ROLE_BLURBS, ROLE_LABELS } from "@/lib/permissions";

export const Route = createFileRoute("/")({ component: LoginPage });

function LoginPage() {
  const user = useSessionUser();
  const navigate = useNavigate();
  const login = useAppStore((s) => s.login);
  const loginAs = useAppStore((s) => s.loginAs);
  const settings = useAppStore((s) => s.settings);
  const hydrated = useAppStore((s) => s.hasHydrated);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (hydrated && user) return <Navigate to="/dashboard" />;

  function enter(name: string) {
    const res = loginAs(name);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    navigate({ to: "/dashboard" });
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const res = login(username, password);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    navigate({ to: "/dashboard" });
  }

  const brand = settings.site_name || "Nidhi";

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-navy text-navy-fg lg:flex lg:flex-col lg:justify-between">
        <div className="ledger-grid absolute inset-0 opacity-60" />
        <div className="relative px-12 pt-12">
          <p className="text-[11px] tracking-[0.22em] text-navy-muted uppercase">
            Chit fund operations
          </p>
          <h1 className="font-display mt-6 max-w-md text-5xl leading-[1.1] font-medium tracking-tight italic">
            {brand}
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-navy-muted">
            Three desks: the house, the floor, and the subscriber. Pick a role
            and operate the book.
          </p>
        </div>
        <dl className="relative grid grid-cols-3 gap-px border-t border-white/10 bg-white/5">
          {[
            ["3", "Roles"],
            ["Soft", "Deletes"],
            ["Own", "Books"],
          ].map(([k, v]) => (
            <div key={v} className="px-6 py-5">
              <dt className="font-display text-2xl">{k}</dt>
              <dd className="mt-1 text-[11px] tracking-[0.14em] text-navy-muted uppercase">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="flex min-h-dvh flex-col justify-center px-5 py-10 sm:px-10">
        <div className="mx-auto w-full max-w-md">
          <p className="font-display text-3xl italic lg:hidden">{brand}</p>
          <h2 className="font-display mt-2 text-3xl font-medium tracking-tight">Sign in</h2>
          <p className="mt-1 mb-6 text-sm text-muted">
            Desk cards for Super Admin and Admin. Subscribers type the User ID and password issued on their member record.
          </p>

          <div className="mb-8 grid grid-cols-1 gap-2">
            {DEMO_ACCOUNTS.map((a) => (
              <button
                key={a.username}
                type="button"
                onClick={() => enter(a.username)}
                className="rounded-lg bg-surface p-3.5 text-left hairline transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-card-hover)]"
              >
                <span className="block text-sm font-medium text-ink">{ROLE_LABELS[a.role]}</span>
                <span className="mt-2 grid grid-cols-[4.5rem_1fr] gap-x-2 gap-y-0.5 font-mono text-[11px]">
                  <span className="text-faint">User ID</span>
                  <span className="text-ink">{a.username}</span>
                  <span className="text-faint">Password</span>
                  <span className="text-ink">{a.password}</span>
                </span>
                <span className="mt-1.5 block text-xs leading-snug text-faint">{ROLE_BLURBS[a.role]}</span>
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="rounded-xl bg-surface p-5 hairline">
            <div className="flex flex-col gap-3">
              <Field label="User ID">
                <Input
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Field>
              <Field label="Password">
                <Input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>
              {error ? <p className="text-sm text-danger">{error}</p> : null}
              <Button type="submit" className="mt-1 w-full">
                Login
              </Button>
              <Link to="/forgot" className="text-center text-sm text-primary">
                Member: reset password with mobile
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
