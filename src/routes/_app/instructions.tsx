import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/desk";
import { Card, CardTitle } from "@/components/kit";
import { DataTable, Td, StatusBadge } from "@/components/desk";
import { Button } from "@/components/kit";
import { useSessionUser } from "@/lib/session";
import { ROLE_LABELS, type RoleName } from "@/lib/permissions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/instructions")({ component: InstructionsPage });

type DeskFilter = "ALL" | RoleName;

function InstructionsPage() {
  const user = useSessionUser();
  const role = user?.role ?? "MEMBER";
  const [filter, setFilter] = useState<DeskFilter>(role === "SUPER_ADMIN" ? "ALL" : role);

  function show(keys: RoleName[]) {
    if (role === "SUPER_ADMIN") {
      if (filter === "ALL") return true;
      return keys.includes(filter);
    }
    if (role === "ADMIN") return keys.includes("ADMIN") || keys.includes("MEMBER");
    return keys.includes("MEMBER");
  }

  function showLogin(desk: RoleName) {
    if (role === "SUPER_ADMIN") return filter === "ALL" || filter === desk;
    if (role === "ADMIN") return desk === "ADMIN" || desk === "MEMBER";
    return desk === "MEMBER";
  }

  const toc = [
    { id: "desks", label: role === "MEMBER" ? "Your desk" : "Desks & logins", show: true },
    { id: "matrix", label: "Who can do what", show: show(["SUPER_ADMIN", "ADMIN"]) },
    { id: "signin", label: "Sign in", show: true },
    { id: role === "MEMBER" ? "member-screens" : "screens", label: "Screens", show: true },
    { id: "money", label: "How money moves", show: show(["SUPER_ADMIN", "ADMIN"]) },
    { id: "processes", label: "Playbooks", show: true },
    { id: "seed", label: "Seed book", show: show(["SUPER_ADMIN", "ADMIN"]) },
    { id: "developer", label: "Developer console", show: show(["SUPER_ADMIN"]) },
    { id: "glossary", label: "Status glossary", show: show(["SUPER_ADMIN", "ADMIN"]) },
  ].filter((t) => t.show);

  const chips: DeskFilter[] = role === "SUPER_ADMIN" ? ["ALL", "SUPER_ADMIN", "ADMIN", "MEMBER"] : [];

  return (
    <div className="enter mx-auto max-w-4xl">
      <PageHeader
        kicker="Desk manual"
        title="How Nidhi works"
        description={
          role === "SUPER_ADMIN"
            ? "Every screen, process, and login for all three desks."
            : role === "ADMIN"
              ? "Floor desk plus the member portal — Super Admin house chapters are hidden."
              : "Your own book only: sign in, dashboard, profile, and dues."
        }
      />

      <Card className="mb-6">
        <p className="text-[11px] tracking-[0.16em] text-muted uppercase">You are signed in as</p>
        <p className="font-display mt-1 text-2xl">{ROLE_LABELS[role]}</p>
        <p className="mt-2 max-w-xl text-sm text-muted">{deskBlurb(role)}</p>
      </Card>

      {chips.length > 0 ? (
        <div className="mb-6 flex flex-wrap gap-2">
          {chips.map((key) => (
            <Button
              key={key}
              type="button"
              size="sm"
              variant={filter === key ? "navy" : "outline"}
              onClick={() => setFilter(key)}
            >
              {key === "ALL" ? "All desks" : ROLE_LABELS[key]}
            </Button>
          ))}
        </div>
      ) : null}

      <nav className="mb-8 grid gap-2 sm:grid-cols-3">
        {toc.map((item) => (
          <button
            key={item.id}
            type="button"
            className="rounded-md bg-surface-2 px-3 py-2.5 text-left text-sm hover:bg-line"
            onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <Section id="desks" title={role === "MEMBER" ? "Your login" : "Desks & logins"}>
        <p className="mb-4 text-sm text-muted">
          {role === "SUPER_ADMIN"
            ? "All three desks. Demo password matches the username."
            : role === "ADMIN"
              ? "Your floor login and the member portal login. Super Admin credentials stay on the house desk."
              : "Sign in with the User ID issued on your member record. Password matches the username unless you reset it."}
        </p>
        <DataTable headers={["Desk", "Username", "Password", "Sees"]}>
          {showLogin("SUPER_ADMIN") ? (
            <tr>
              <Td className="font-medium">Super Admin</Td>
              <Td className="font-mono text-xs">superadmin</Td>
              <Td className="font-mono text-xs">superadmin</Td>
              <Td>Whole ledger + developer console</Td>
            </tr>
          ) : null}
          {showLogin("ADMIN") ? (
            <tr>
              <Td className="font-medium">Admin</Td>
              <Td className="font-mono text-xs">admin</Td>
              <Td className="font-mono text-xs">admin</Td>
              <Td>Whole subscriber book</Td>
            </tr>
          ) : null}
          {showLogin("MEMBER") ? (
            <tr>
              <Td className="font-medium">Member</Td>
              <Td className="font-mono text-xs">member</Td>
              <Td className="font-mono text-xs">member</Td>
              <Td>Lakshmi Iyer only</Td>
            </tr>
          ) : null}
        </DataTable>
        {show(["SUPER_ADMIN", "ADMIN"]) ? (
          <p className="mt-4 text-sm text-muted">
            Access is role defaults ± per-user overrides, then modules. Super Admin always has every permission and cannot be reduced.
            Admin can create Admin and Member logins only — never Super Admin. Members have no Users menu.
          </p>
        ) : (
          <p className="mt-4 text-sm text-muted">
            Forgot the password? Use “reset password with mobile” on the sign-in page with the number on your member record.
          </p>
        )}
      </Section>

      {show(["SUPER_ADMIN", "ADMIN"]) ? (
        <Section id="matrix" title="Who can do what">
          <DataTable
            headers={
              role === "SUPER_ADMIN"
                ? ["Capability", "Super Admin", "Admin", "Member"]
                : ["Capability", "Admin", "Member"]
            }
          >
            {MATRIX.map((row) => (
              <tr key={row.cap}>
                <Td className="font-medium">{row.cap}</Td>
                {role === "SUPER_ADMIN" ? (
                  <Td>
                    <Mark on={row.super} />
                  </Td>
                ) : null}
                <Td>
                  <Mark on={row.admin} />
                </Td>
                <Td>
                  <Mark on={row.member} />
                </Td>
              </tr>
            ))}
          </DataTable>
          <p className="mt-4 text-sm text-muted">
            Direct URLs still check permissions. A Member opening /members or /payments sees Access denied — the menu is not the only gate.
          </p>
        </Section>
      ) : null}

      <Section id="signin" title="Sign in">
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
          <li>Wait until the button reads Login — the ledger has opened.</li>
          <li>Click a desk card, or type username and password.</li>
          <li>Failed passwords count up; too many lock the account for a cooling-off period.</li>
          <li>Disabled accounts cannot enter.</li>
          <li>Log out from the sidebar (header menu on a phone).</li>
        </ol>
        <p className="mt-4 text-sm text-muted">
          There is no cloud save. The book lives in this browser. A version bump of the demo ledger restores the seed.
        </p>
      </Section>

      {show(["SUPER_ADMIN", "ADMIN"]) ? (
        <Section id="screens" title="Screens — house and floor">
          <ScreenBlock
            title="Dashboard"
            body="Super Admin sees House desk: collections plus module/API/error health and developer shortcuts. Admin sees Floor desk: members, schemes, booked collections, overdue, unmatched, and Record payment."
          />
          <ScreenBlock
            title="Members"
            body="List of subscribers. New member needs a unique phone. Optional assigned operator. Detail page: edit contact, enrollments, payments. Soft delete (Super Admin) needs a reason and keeps financial history."
          />
          <ScreenBlock
            title="Chits"
            body="A scheme has corpus, monthly installment, tenure, start date. Enroll a member, then Generate the installment book. Generate is additive — already-created numbers, including paid/locked rows, are left alone. Run it twice on a complete schedule and it creates 0."
          />
          <ScreenBlock
            title="Payments"
            body="Sources: MANUAL and BANK. Record lands PENDING. Approve, then Allocate onto an installment. A full hit marks the installment PAID and locks it. Super Admin can reverse a payment with a reason."
          />
          <ScreenBlock
            title="Unmatched"
            body="Bank credits that did not match a subscriber. Match creates a PENDING payment on the chosen book. Ignore closes without a payment. The Payments badge counts open unmatched rows."
          />
          <ScreenBlock
            title="Reports"
            body="Booked collections, pending receipts, overdue outstanding, source mix, and per-scheme enrolled / due / collected / gap."
          />
          <ScreenBlock
            title="Users"
            body="Create desk accounts. Super Admin can change role, disable, and set per-user permission overrides (grant or revoke) with a reason. Admin can create Admin or Member users, not Super Admin."
          />
        </Section>
      ) : null}

      {show(["MEMBER"]) ? (
        <Section id="member-screens" title="Screens — own book">
          <ScreenBlock
            title="Dashboard"
            body="My chit fund: total paid, active chits, overdue, next due, enrolled schemes, installment rows, and payment history. Only the linked subscriber."
          />
          <ScreenBlock
            title="My profile"
            body="Own contact and enrollments. There is no path to another subscriber’s book."
          />
        </Section>
      ) : null}

      {show(["SUPER_ADMIN"]) ? (
        <Section id="house-only" title="House-only screens">
          <ScreenBlock
            title="Roles"
            body="Starting grants per desk. Super Admin’s set is locked. Saves last for this browser session until the ledger is reset."
          />
          <ScreenBlock
            title="Audit log"
            body="Append-only. Login, create, edit, generate, allocate, approve, delete, deny, dangerous-action requests. No edit or delete path — including for Super Admin."
          />
        </Section>
      ) : null}

      {show(["SUPER_ADMIN", "ADMIN"]) ? (
        <Section id="money" title="How money moves">
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
          <li>
            A receipt is recorded against a member (manual form, matched unmatched row, or bank API). Status: PENDING.
          </li>
          <li>Approve → APPROVED. Still not applied to a month.</li>
          <li>
            Allocate to an installment. amountPaid increases. If it covers amountDue the row becomes PAID and locks. Otherwise PARTIAL.
          </li>
          <li>Locked (fully paid) rows cannot be edited without installments.edit_paid.</li>
          <li>Soft-delete reverses the payment. History stays.</li>
        </ol>
        <div className="mt-4 flex flex-wrap gap-2">
          {["PENDING", "APPROVED", "ALLOCATED", "REVERSED"].map((s) => (
            <StatusBadge key={s} value={s} />
          ))}
        </div>
      </Section>
      ) : null}

      <Section id="processes" title="Playbooks">
        {show(["SUPER_ADMIN", "ADMIN"]) ? (
          <>
            <Play
              title="A. New subscriber on a live chit"
              steps={[
                "Members → New member. Unique phone. Optionally assign an operator.",
                "Chits → open a scheme → Enroll that member.",
                "Generate installments. New rows are PENDING (future) or OVERDUE (past due dates). Paid rows already on the book are not overwritten.",
              ]}
            />
            <Play
              title="B. Collect cash / cheque / UPI"
              steps={[
                "Payments → Record payment (or Floor desk → Record payment).",
                "Pick the scheme, then a live subscriber enrolled in it. Amount defaults to the installment.",
                "Payment is PENDING.",
                "Approve it.",
                "Allocate to the right installment. Partial → PARTIAL. Full → PAID and locked.",
              ]}
            />
            <Play
              title="C. Bank credit with no member"
              steps={[
                "Open Unmatched from the Payments badge or the unmatched chip.",
                "Match → pick the subscriber → creates a PENDING payment.",
                "Approve + allocate as in B. Or Ignore if it is not a chit credit.",
              ]}
            />
            <Play
              title="D. Harvest 3L (empty schedule)"
              steps={[
                "Harvest 3L is enrolled (Arjun, Meena, Fatima) with 0 installment rows on purpose.",
                "Generate from the Chits list or the scheme page.",
                "First click creates 45 rows (3 × 15). Second click creates 0 — schedule already complete.",
              ]}
            />
          </>
        ) : null}
        {show(["SUPER_ADMIN"]) ? (
          <>
            <Play
              title="E. Dangerous action"
              steps={[
                "Developer → Dangerous actions (or the pending badge on Developer).",
                "A restore/write request sits PENDING.",
                "Approve or reject. The decision is audited.",
              ]}
            />
            <Play
              title="F. Soft delete"
              steps={[
                "Open the member or payment.",
                "Supply a reason. Payments become REVERSED. Members drop off the live list; installment history remains.",
              ]}
            />
          </>
        ) : null}
        {show(["MEMBER"]) ? (
          <Play
            title="Member: read your own book"
            steps={[
              "Dashboard shows your enrollments, next due, overdue, and receipts.",
              "Open My profile for contact details.",
              "There is no Members, Payments, Reports, or Users menu. Those URLs are denied.",
            ]}
          />
        ) : null}
      </Section>

      {show(["SUPER_ADMIN", "ADMIN"]) ? (
      <Section id="seed" title="Seed book">
        <p className="mb-3 text-sm text-muted">What you see on first open.</p>
        <DataTable headers={["Scheme", "Corpus", "Installment", "Tenure", "Schedule"]}>
          <tr>
            <Td>Aishwarya Gold 5L</Td>
            <Td className="tabular-nums">₹5,00,000</Td>
            <Td className="tabular-nums">₹25,000</Td>
            <Td>20 months · 5 enrolled</Td>
            <Td>Already generated</Td>
          </tr>
          <tr>
            <Td>Lakshmi Silver 2L</Td>
            <Td className="tabular-nums">₹2,00,000</Td>
            <Td className="tabular-nums">₹16,670</Td>
            <Td>12 months · 4 enrolled</Td>
            <Td>Already generated</Td>
          </tr>
          <tr>
            <Td>Harvest 3L</Td>
            <Td className="tabular-nums">₹3,00,000</Td>
            <Td className="tabular-nums">₹20,000</Td>
            <Td>15 months · 3 enrolled</Td>
            <Td>Empty until you generate</Td>
          </tr>
        </DataTable>
        <p className="mt-4 text-sm text-muted">
          Subscribers: Lakshmi Iyer, Ramesh Krishnan, Fatima Begum, Arjun Reddy, Meena Subramanian, Joseph D'Souza, Priya Nair, Venkatesh Rao. The Member login is Lakshmi Iyer. Two unmatched receipts sit open so reconciliation can be practised.
        </p>
      </Section>
      ) : null}

      {show(["SUPER_ADMIN"]) ? (
        <Section id="developer" title="Developer console">
          <p className="mb-4 text-sm text-muted">
            Super Admin only. Disabling a module blocks its routes, not just the menu. Financial records stay on this desk because Super Admin and Developer were merged.
          </p>
          <DataTable headers={["Section", "What it does"]}>
            {DEV_SECTIONS.map((row) => (
              <tr key={row.name}>
                <Td className="font-medium">{row.name}</Td>
                <Td>{row.body}</Td>
              </tr>
            ))}
          </DataTable>
        </Section>
      ) : (
        <div id="developer" />
      )}

      {show(["SUPER_ADMIN", "ADMIN"]) ? (
      <Section id="glossary" title="Status glossary">
        <dl className="grid gap-3 sm:grid-cols-2">
          <Gloss term="Scheme" value="ACTIVE / CLOSED / DRAFT" />
          <Gloss term="Enrollment" value="ACTIVE / CLOSED / DEFAULTED" />
          <Gloss term="Installment" value="PENDING / PARTIAL / PAID / OVERDUE — PAID locks" />
          <Gloss term="Payment" value="PENDING / APPROVED / ALLOCATED / REVERSED" />
          <Gloss term="Unmatched" value="OPEN / RESOLVED / IGNORED" />
          <Gloss term="Dangerous action" value="PENDING / APPROVED / REJECTED / EXECUTED" />
          <Gloss term="Money" value="Indian Rupees, en-IN · Asia/Kolkata" />
        </dl>
        <p className="mt-6 text-sm text-muted">
          Nidhi is an operations desk, not a bank. Collections are Manual or Bank API. Alerts are in-app (and optional browser). No SMS collector.
        </p>
      </Section>
      ) : null}
    </div>
  );
}

function deskBlurb(role: RoleName) {
  if (role === "SUPER_ADMIN") {
    return "House desk. Users, finance, modules, APIs, and approvals live here. Use the filter to read the floor or member chapters too. All three logins are listed above.";
  }
  if (role === "ADMIN") {
    return "Floor desk. Members, schemes, collections, and allocation. You can add Admin and Member users only — Super Admin is not on that list. Member portal chapters are included below.";
  }
  return "Your own chits, dues, and receipts. Nobody else’s book. There is no Users menu on this login.";
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10 scroll-mt-6">
      <h2 className="font-display mb-4 text-2xl">{title}</h2>
      {children}
    </section>
  );
}

function ScreenBlock({ title, body }: { title: string; body: string }) {
  return (
    <Card className="mb-3">
      <CardTitle className="mb-1">{title}</CardTitle>
      <p className="text-sm leading-relaxed text-muted">{body}</p>
    </Card>
  );
}

function Play({ title, steps }: { title: string; steps: string[] }) {
  return (
    <Card className="mb-3">
      <CardTitle className="mb-2">{title}</CardTitle>
      <ol className="list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-ink-soft">
        {steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
    </Card>
  );
}

function Gloss({ term, value }: { term: string; value: string }) {
  return (
    <div className="rounded-md bg-surface-2 px-4 py-3">
      <dt className="text-[11px] tracking-[0.14em] text-muted uppercase">{term}</dt>
      <dd className="mt-1 text-sm">{value}</dd>
    </div>
  );
}

function Mark({ on }: { on: boolean }) {
  return (
    <span className={cn("text-sm font-medium", on ? "text-ink" : "text-faint")}>{on ? "Yes" : "—"}</span>
  );
}

const MATRIX: { cap: string; super: boolean; admin: boolean; member: boolean }[] = [
  { cap: "Own dashboard", super: true, admin: true, member: true },
  { cap: "Members list & detail", super: true, admin: true, member: false },
  { cap: "Create / edit members", super: true, admin: true, member: false },
  { cap: "Soft-delete members", super: true, admin: false, member: false },
  { cap: "Chit schemes & enroll", super: true, admin: true, member: false },
  { cap: "Generate installments", super: true, admin: true, member: false },
  { cap: "Record / approve / allocate payments", super: true, admin: true, member: false },
  { cap: "Unmatched match / ignore", super: true, admin: true, member: false },
  { cap: "Reverse a payment", super: true, admin: false, member: false },
  { cap: "Reports", super: true, admin: true, member: false },
  { cap: "Users", super: true, admin: true, member: false },
  { cap: "Change roles & overrides", super: true, admin: false, member: false },
  { cap: "Roles catalogue", super: true, admin: false, member: false },
  { cap: "Audit log", super: true, admin: false, member: false },
  { cap: "Developer console", super: true, admin: false, member: false },
  { cap: "Toggle modules", super: true, admin: false, member: false },
  { cap: "Own chits, dues, receipts", super: true, admin: true, member: true },
  { cap: "Another subscriber’s book", super: true, admin: true, member: false },
];

const DEV_SECTIONS = [
  { name: "Modules", body: "Enable / disable route groups. Off = page shows module off, not just a hidden menu." },
  { name: "Website settings", body: "Site name, company, locale, currency, theme colour." },
  { name: "Form builder", body: "Allow-listed custom fields. Data only — never executed as code." },
  { name: "Menu builder", body: "Extra nav items gated by a permission code." },
  { name: "Workflows", body: "JSON config for approval, unmatched, reminders, bank sync. No code exec." },
  { name: "API clients", body: "Create clients. Secrets hashed at rest and always masked." },
  { name: "Bank providers", body: "Mock adapter until live credentials exist. Mock sync pulls sample credits. This is the automatic collection path." },
  { name: "Database inspector", body: "Allow-listed tables only. No arbitrary SQL." },
  { name: "Dangerous actions", body: "Restore / write queue. Super Admin approves or rejects." },
  { name: "Monitoring", body: "System log, backups, scheduler slot." },
  { name: "Notifications", body: "Reminder queue. Scheduler is not a running job in this desk." },
];
