import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/desk";
import { Button, Card, CardTitle, Field, Input, Select, Textarea } from "@/components/kit";
import { DataTable, Td, StatusBadge, Forbidden, ModuleOff } from "@/components/desk";
import { useAppStore } from "@/lib/store";
import { useHas, useModuleOn, useSessionUser } from "@/lib/session";
import { MODULE_KEYS, MODULE_LABELS, type ModuleKey } from "@/lib/permissions";
import { formatDateTime, formatINR } from "@/lib/format";

export const Route = createFileRoute("/_app/developer/$section")({
  component: DevSection,
});

const TITLES: Record<string, [string, string]> = {
  modules: ["Modules", "Disabling a module blocks its routes, not just the menu."],
  settings: ["Website settings", "Branding and locale stored as data."],
  forms: ["Form builder", "Field types are allow-listed. Nothing here is executed as code."],
  menu: ["Menu builder", "Items hide unless the signed-in user has the required permission."],
  workflows: ["Workflows", "JSON configuration only."],
  api: ["API clients", "Secrets are hashed at rest and always masked in the UI."],
  bank: ["Bank providers", "Mock mode until live credentials are supplied. Bank API is the only automatic collection path."],
  database: ["Database inspector", "Allow-listed tables. No arbitrary SQL."],
  actions: ["Dangerous actions", "Developer requests; Super Admin decides."],
  monitoring: ["Monitoring", "System log, backups, scheduler slot."],
  notifications: ["Notifications", "Reminder queue. Scheduler is not wired in this desk."],
};

function DevSection() {
  const { section } = Route.useParams();
  const can = useHas("developer.view");
  const moduleOn = useModuleOn("developer_console");
  const meta = TITLES[section];

  if (!can) return <Forbidden reason="developer.view is required." />;
  if (!moduleOn) return <ModuleOff name="developer console" />;
  if (!meta) return <Forbidden reason="Unknown console section." />;

  return (
    <div className="enter">
      <p className="mb-3 text-sm">
        <Link to="/developer" className="text-muted hover:text-ink">
          Developer
        </Link>
        <span className="text-faint"> / {meta[0]}</span>
      </p>
      <PageHeader kicker="Developer console" title={meta[0]} description={meta[1]} />
      {section === "modules" && <ModulesPanel />}
      {section === "settings" && <SettingsPanel />}
      {section === "forms" && <FormsPanel />}
      {section === "menu" && <MenuPanel />}
      {section === "workflows" && <WorkflowsPanel />}
      {section === "api" && <ApiPanel />}
      {section === "bank" && <BankPanel />}
      {section === "database" && <DatabasePanel />}
      {section === "actions" && <ActionsPanel />}
      {section === "monitoring" && <MonitoringPanel />}
      {section === "notifications" && <NotifyPanel />}
    </div>
  );
}

function ModulesPanel() {
  const modules = useAppStore((s) => s.modules);
  const toggle = useAppStore((s) => s.toggleModule);
  const can = useHas("developer.modules");
  return (
    <DataTable headers={["Module", "Status", ""]}>
      {MODULE_KEYS.map((k) => (
        <tr key={k}>
          <Td>
            <div className="font-medium">{MODULE_LABELS[k]}</div>
            <div className="font-mono text-[11px] text-muted">{k}</div>
          </Td>
          <Td>
            <StatusBadge value={modules[k] ? "ENABLED" : "DISABLED"} />
          </Td>
          <Td>
            {can ? (
              <Button
                size="sm"
                variant={modules[k] ? "outline" : "default"}
                onClick={() => {
                  const res = toggle(k as ModuleKey, !modules[k]);
                  if (!res.ok) toast.error(res.error);
                  else toast.success(`${MODULE_LABELS[k]} ${modules[k] ? "disabled" : "enabled"}.`);
                }}
              >
                {modules[k] ? "Disable" : "Enable"}
              </Button>
            ) : (
              <span className="text-xs text-muted">No permission</span>
            )}
          </Td>
        </tr>
      ))}
    </DataTable>
  );
}

function SettingsPanel() {
  const settings = useAppStore((s) => s.settings);
  const update = useAppStore((s) => s.updateSettings);
  const [draft, setDraft] = useState(settings);
  const keys = [
    "site_name",
    "company_info",
    "contact_info",
    "currency",
    "timezone",
    "language",
    "footer_content",
  ];
  return (
    <Card className="max-w-xl">
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          update(draft);
          toast.success("Settings saved.");
        }}
      >
        {keys.map((k) => (
          <Field key={k} label={k.replace(/_/g, " ")}>
            <Input value={draft[k] ?? ""} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} />
          </Field>
        ))}
        <Button type="submit" className="w-fit">
          Save
        </Button>
      </form>
    </Card>
  );
}

function FormsPanel() {
  const fields = useAppStore((s) => s.customFields);
  const add = useAppStore((s) => s.addCustomField);
  const [formKey, setFormKey] = useState("member_form");
  const [fieldName, setFieldName] = useState("");
  const [label, setLabel] = useState("");
  const [fieldType, setFieldType] = useState("text");
  const [required, setRequired] = useState(false);
  const [helpText, setHelpText] = useState("");
  const visible = fields.filter((f) => f.formKey === formKey);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = add({ formKey, fieldName, label, fieldType, required, helpText });
    if (!res.ok) toast.error(res.error);
    else {
      toast.success("Field added.");
      setFieldName("");
      setLabel("");
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardTitle className="mb-3">Add field</CardTitle>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <Field label="Form">
            <Select value={formKey} onChange={(e) => setFormKey(e.target.value)}>
              <option value="member_form">member_form</option>
              <option value="chit_form">chit_form</option>
              <option value="payment_form">payment_form</option>
            </Select>
          </Field>
          <Field label="Field name">
            <Input value={fieldName} onChange={(e) => setFieldName(e.target.value)} required />
          </Field>
          <Field label="Label">
            <Input value={label} onChange={(e) => setLabel(e.target.value)} required />
          </Field>
          <Field label="Type">
            <Select value={fieldType} onChange={(e) => setFieldType(e.target.value)}>
              {["text", "number", "date", "select", "checkbox", "textarea", "email", "phone"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </Select>
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={required} onChange={(e) => setRequired(e.target.checked)} />
            Required
          </label>
          <Field label="Help text">
            <Input value={helpText} onChange={(e) => setHelpText(e.target.value)} />
          </Field>
          <Button type="submit">Add</Button>
        </form>
      </Card>
      <div className="lg:col-span-3">
        <DataTable headers={["Name", "Label", "Type", "Required"]}>
          {visible.map((f) => (
            <tr key={f.id}>
              <Td className="font-mono text-xs">{f.fieldName}</Td>
              <Td>{f.label}</Td>
              <Td>{f.fieldType}</Td>
              <Td>{f.required ? "Yes" : "No"}</Td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  );
}

function MenuPanel() {
  const items = useAppStore((s) => s.menuItems);
  const add = useAppStore((s) => s.addMenuItem);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("/");
  const [perm, setPerm] = useState("");
  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            add({ label, url, icon: "Circle", requiredPermission: perm });
            toast.success("Menu item added.");
            setLabel("");
          }}
        >
          <Field label="Label">
            <Input value={label} onChange={(e) => setLabel(e.target.value)} required />
          </Field>
          <Field label="URL">
            <Input value={url} onChange={(e) => setUrl(e.target.value)} required />
          </Field>
          <Field label="Required permission">
            <Input value={perm} onChange={(e) => setPerm(e.target.value)} placeholder="members.view" />
          </Field>
          <Button type="submit">Add</Button>
        </form>
      </Card>
      <div className="lg:col-span-3">
        <DataTable headers={["Label", "URL", "Permission"]}>
          {items.map((i) => (
            <tr key={i.id}>
              <Td>{i.label}</Td>
              <Td className="font-mono text-xs">{i.url}</Td>
              <Td className="font-mono text-xs">{i.requiredPermission || "—"}</Td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  );
}

function WorkflowsPanel() {
  const workflows = useAppStore((s) => s.workflows);
  const update = useAppStore((s) => s.updateWorkflow);
  const [key, setKey] = useState(Object.keys(workflows)[0] ?? "payment_approval");
  const [json, setJson] = useState(workflows[key] ?? "{}");
  return (
    <Card className="max-w-2xl">
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          const res = update(key, json);
          if (!res.ok) toast.error(res.error);
          else toast.success("Workflow saved.");
        }}
      >
        <Field label="Workflow">
          <Select
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
              setJson(workflows[e.target.value] ?? "{}");
            }}
          >
            {Object.keys(workflows).map((k) => (
              <option key={k}>{k}</option>
            ))}
          </Select>
        </Field>
        <Field label="Config JSON">
          <Textarea rows={8} className="font-mono text-xs" value={json} onChange={(e) => setJson(e.target.value)} />
        </Field>
        <Button type="submit" className="w-fit">
          Save
        </Button>
      </form>
    </Card>
  );
}

function ApiPanel() {
  const clients = useAppStore((s) => s.apiClients);
  const logs = useAppStore((s) => s.apiLogs);
  const create = useAppStore((s) => s.createApiClient);
  const revoke = useAppStore((s) => s.revokeApiClient);
  const [name, setName] = useState("");
  const [scopes, setScopes] = useState("bank.webhook");
  return (
    <div className="flex flex-col gap-6">
      <Card className="max-w-xl">
        <CardTitle className="mb-3">New client</CardTitle>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            const res = create(name, scopes);
            if (!res.ok) toast.error(res.error);
            else {
              toast.success("Client created. Secret shown once as masked.");
              setName("");
            }
          }}
        >
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Scopes">
            <Input value={scopes} onChange={(e) => setScopes(e.target.value)} />
          </Field>
          <Button type="submit" className="w-fit">
            Create
          </Button>
        </form>
      </Card>
      <DataTable headers={["Name", "Client ID", "Secret", "Scopes", "Status", ""]}>
        {clients.map((c) => (
          <tr key={c.id}>
            <Td>{c.name}</Td>
            <Td className="font-mono text-xs">{c.clientId}</Td>
            <Td className="font-mono text-xs">{c.secretMasked}</Td>
            <Td className="text-xs">{c.scopes}</Td>
            <Td>
              <StatusBadge value={c.isActive ? "ACTIVE" : "DISABLED"} />
            </Td>
            <Td>
              {c.isActive ? (
                <button type="button" className="text-sm text-danger" onClick={() => revoke(c.id)}>
                  Revoke
                </button>
              ) : null}
            </Td>
          </tr>
        ))}
      </DataTable>
      <h2 className="font-display text-xl">API logs</h2>
      <DataTable headers={["When", "Client", "Method", "Endpoint", "Status"]}>
        {logs.map((l) => (
          <tr key={l.id}>
            <Td className="text-muted">{formatDateTime(l.timestamp)}</Td>
            <Td className="font-mono text-xs">{l.clientId}</Td>
            <Td>{l.method}</Td>
            <Td className="font-mono text-xs">{l.endpoint}</Td>
            <Td className="tabular-nums">{l.statusCode}</Td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}

function BankPanel() {
  const connections = useAppStore((s) => s.bankConnections);
  const txns = useAppStore((s) => s.bankTxns);
  const sync = useAppStore((s) => s.mockBankSync);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">BANK_PROVIDER_MODE = mock. Live adapters need real bank credentials.</p>
        <Button
          onClick={() => {
            const res = sync();
            toast.success(`Mock sync finished (${res.fetched} fetched).`);
          }}
        >
          Run mock sync
        </Button>
      </div>
      <DataTable headers={["Provider", "Account", "Enabled", "Last sync"]}>
        {connections.map((c) => (
          <tr key={c.id}>
            <Td className="font-mono">{c.providerName}</Td>
            <Td>
              {c.accountName}
              <div className="font-mono text-xs text-muted">{c.accountMasked}</div>
            </Td>
            <Td>
              <StatusBadge value={c.isEnabled ? "ENABLED" : "DISABLED"} />
            </Td>
            <Td className="text-muted">{c.lastSyncAt ? formatDateTime(c.lastSyncAt) : "—"}</Td>
          </tr>
        ))}
      </DataTable>
      <DataTable headers={["Date", "Amount", "Reference", "Status"]}>
        {txns.map((t) => (
          <tr key={t.id}>
            <Td>{t.transactionDate}</Td>
            <Td className="tabular-nums">{formatINR(t.amount)}</Td>
            <Td className="font-mono text-xs">{t.reference}</Td>
            <Td>
              <StatusBadge value={t.status} />
            </Td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}

function DatabasePanel() {
  const state = useAppStore();
  const tables = useMemo(
    () => [
      ["members", state.members.length],
      ["chit_schemes", state.schemes.length],
      ["member_chits", state.enrollments.length],
      ["chit_installments", state.installments.length],
      ["payments", state.payments.length],
      ["unmatched_payments", state.unmatched.length],
      ["users", state.users.length],
      ["audit_logs", state.audit.length],
      ["api_clients", state.apiClients.length],
      ["bank_transactions", state.bankTxns.length],
    ],
    [state],
  );
  return (
    <div>
      <p className="mb-4 max-w-xl text-sm text-muted">
        Read-only counts. Arbitrary SQL is not offered — that is the point of the allow-list.
      </p>
      <DataTable headers={["Table", "Rows"]}>
        {tables.map(([name, n]) => (
          <tr key={String(name)}>
            <Td className="font-mono text-sm">{name}</Td>
            <Td className="tabular-nums">{n}</Td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}

function ActionsPanel() {
  const user = useSessionUser();
  const actions = useAppStore((s) => s.actions);
  const users = useAppStore((s) => s.users);
  const request = useAppStore((s) => s.requestDangerousAction);
  const decide = useAppStore((s) => s.decideAction);
  const [type, setType] = useState("database_restore");
  const [reason, setReason] = useState("");
  const [payload, setPayload] = useState("");
  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardTitle className="mb-3">Request</CardTitle>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            const res = request(type, reason, payload);
            if (!res.ok) toast.error(res.error);
            else {
              toast.success("Queued for Super Admin.");
              setReason("");
            }
          }}
        >
          <Field label="Action type">
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              {["database_restore", "database_migration", "disable_module_core", "delete_financial_records", "change_bank_credentials"].map(
                (t) => (
                  <option key={t}>{t}</option>
                ),
              )}
            </Select>
          </Field>
          <Field label="Payload">
            <Input value={payload} onChange={(e) => setPayload(e.target.value)} />
          </Field>
          <Field label="Reason">
            <Input value={reason} onChange={(e) => setReason(e.target.value)} required />
          </Field>
          <Button type="submit">Submit</Button>
        </form>
      </Card>
      <div className="lg:col-span-3">
        <DataTable headers={["Type", "By", "Status", "Reason", ""]}>
          {actions.map((a) => (
            <tr key={a.id}>
              <Td className="font-mono text-xs">{a.actionType}</Td>
              <Td>{users.find((u) => u.id === a.requestedBy)?.username}</Td>
              <Td>
                <StatusBadge value={a.status} />
              </Td>
              <Td className="max-w-[180px] truncate text-xs">{a.reason}</Td>
              <Td>
                {a.status === "PENDING" && user?.role === "SUPER_ADMIN" ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-sm text-primary"
                      onClick={() => {
                        const res = decide(a.id, true);
                        if (!res.ok) toast.error(res.error);
                        else toast.success("Approved.");
                      }}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="text-sm text-danger"
                      onClick={() => decide(a.id, false)}
                    >
                      Reject
                    </button>
                  </div>
                ) : null}
              </Td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  );
}

function MonitoringPanel() {
  const logs = useAppStore((s) => s.systemLogs);
  const backups = useAppStore((s) => s.backups);
  const createBackup = useAppStore((s) => s.createBackup);
  const resetDemo = useAppStore((s) => s.resetDemo);
  const users = useAppStore((s) => s.users);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => {
            const res = createBackup("Manual snapshot from monitoring");
            if (!res.ok) toast.error(res.error);
            else toast.success("Backup recorded.");
          }}
        >
          Create backup
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            resetDemo();
            toast.success("Demo data reset. Sign in again.");
          }}
        >
          Reset demo data
        </Button>
      </div>
      <Card>
        <CardTitle className="mb-2">Scheduler</CardTitle>
        <p className="text-sm text-muted">APScheduler is not wired in this desk. Reminder sending is manual from Notifications.</p>
      </Card>
      <h2 className="font-display text-xl">Backups</h2>
      <DataTable headers={["File", "Size", "By", "When"]}>
        {backups.map((b) => (
          <tr key={b.id}>
            <Td className="font-mono text-xs">{b.filename}</Td>
            <Td className="tabular-nums">{Math.round(b.sizeBytes / 1024)} KB</Td>
            <Td>{users.find((u) => u.id === b.createdBy)?.username}</Td>
            <Td className="text-muted">{formatDateTime(b.createdAt)}</Td>
          </tr>
        ))}
      </DataTable>
      <h2 className="font-display text-xl">System log</h2>
      <DataTable headers={["When", "Level", "Source", "Message"]}>
        {logs.map((l) => (
          <tr key={l.id}>
            <Td className="whitespace-nowrap text-muted">{formatDateTime(l.timestamp)}</Td>
            <Td>
              <StatusBadge value={l.level} />
            </Td>
            <Td className="font-mono text-xs">{l.source}</Td>
            <Td>{l.message}</Td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}

function NotifyPanel() {
  const reminders = useAppStore((s) => s.reminders);
  const members = useAppStore((s) => s.members);
  const send = useAppStore((s) => s.sendReminder);
  return (
    <DataTable headers={["Member", "Channel", "Status", "Message", ""]}>
      {reminders.map((r) => (
        <tr key={r.id}>
          <Td>{members.find((m) => m.id === r.memberId)?.fullName}</Td>
          <Td>{r.channel}</Td>
          <Td>
            <StatusBadge value={r.status} />
          </Td>
          <Td className="max-w-sm text-xs text-muted">{r.message}</Td>
          <Td>
            {r.status === "PENDING" ? (
              <button
                type="button"
                className="text-sm text-primary"
                onClick={() => {
                  send(r.id);
                  toast.success("In-app reminder posted to that member’s alerts.");
                }}
              >
                Send now
              </button>
            ) : null}
          </Td>
        </tr>
      ))}
    </DataTable>
  );
}
