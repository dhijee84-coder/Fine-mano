import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/desk";
import { Button, Card, CardTitle, Field, Input } from "@/components/kit";
import { DataTable, Td, StatusBadge } from "@/components/desk";
import { Dialog, DialogContent, DialogTrigger } from "@/components/kit";
import { Forbidden, ModuleOff } from "@/components/desk";
import { useAppStore } from "@/lib/store";
import { useHas, useModuleOn, useVisibleMembers } from "@/lib/session";
import { formatDate, formatINR } from "@/lib/format";

export const Route = createFileRoute("/_app/members/$memberId")({ component: MemberDetail });

function MemberDetail() {
  const { memberId } = Route.useParams();
  const canView = useHas("members.view");
  const canEdit = useHas("members.edit");
  const canDelete = useHas("members.delete");
  const moduleOn = useModuleOn("member_management");
  const navigate = useNavigate();
  const member = useVisibleMembers().find((m) => m.id === memberId);
  const allMember = useAppStore((s) => s.members.find((m) => m.id === memberId));
  const schemes = useAppStore((s) => s.schemes);
  const enrollmentsAll = useAppStore((s) => s.enrollments);
  const enrollments = enrollmentsAll.filter((e) => e.memberId === memberId);
  const paymentsAll = useAppStore((s) => s.payments);
  const payments = paymentsAll.filter((p) => p.memberId === memberId && !p.deletedAt);
  const updateMember = useAppStore((s) => s.updateMember);
  const softDeleteMember = useAppStore((s) => s.softDeleteMember);
  const issueMemberLogin = useAppStore((s) => s.issueMemberLogin);
  const canIssueLogin = useHas("users.create");
  const users = useAppStore((s) => s.users);
  const portal = users.find((u) => u.memberId === memberId);

  const [fullName, setFullName] = useState(member?.fullName ?? "");
  const [phone, setPhone] = useState(member?.phone ?? "");
  const [email, setEmail] = useState(member?.email ?? "");
  const [address, setAddress] = useState(member?.address ?? "");
  const [city, setCity] = useState(member?.city ?? "");
  const [reason, setReason] = useState("");
  const [open, setOpen] = useState(false);

  if (!canView) return <Forbidden reason="members.view is required." />;
  if (!moduleOn) return <ModuleOff name="member management" />;
  if (!member) {
    return (
      <Forbidden
        reason={
          allMember
            ? "This member is not on your assigned book."
            : "Member not found."
        }
      />
    );
  }

  function onSave(e: FormEvent) {
    e.preventDefault();
    const res = updateMember(memberId, { fullName, phone, email, address, city });
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success("Member updated.");
  }

  function onDelete(e: FormEvent) {
    e.preventDefault();
    const res = softDeleteMember(memberId, reason);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success("Member soft-deleted.");
    setOpen(false);
    navigate({ to: "/members" });
  }

  return (
    <div className="enter">
      <PageHeader
        kicker="Member"
        title={member.fullName}
        description={`${member.city} · ${member.phone}`}
        actions={
          canDelete ? (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="danger">Soft delete</Button>
              </DialogTrigger>
              <DialogContent title="Delete member">
                <p className="mb-3 text-sm text-muted">
                  Soft delete only. Financial history stays. A reason is required and is written to the audit log.
                </p>
                <form onSubmit={onDelete} className="flex flex-col gap-3">
                  <Field label="Reason">
                    <Input value={reason} onChange={(e) => setReason(e.target.value)} required />
                  </Field>
                  <Button type="submit" variant="danger">
                    Confirm delete
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          ) : null
        }
      />

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardTitle className="mb-3">Record</CardTitle>
          <form onSubmit={onSave} className="flex flex-col gap-3">
            <Field label="Full name">
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={!canEdit} />
            </Field>
            <Field label="Phone">
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!canEdit} />
            </Field>
            <Field label="Email">
              <Input value={email} onChange={(e) => setEmail(e.target.value)} disabled={!canEdit} />
            </Field>
            <Field label="Address">
              <Input value={address} onChange={(e) => setAddress(e.target.value)} disabled={!canEdit} />
            </Field>
            <Field label="City">
              <Input value={city} onChange={(e) => setCity(e.target.value)} disabled={!canEdit} />
            </Field>
            {canEdit ? (
              <Button type="submit" className="mt-1 w-fit">
                Save changes
              </Button>
            ) : (
              <p className="text-xs text-muted">Read-only for your role.</p>
            )}
          </form>
        </Card>
        <div className="flex flex-col gap-4 lg:col-span-3">
          <Card>
            <CardTitle className="mb-3">Portal login</CardTitle>
            {portal ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted">
                  Give these to the subscriber. They type them on Sign in — not a role card.
                </p>
                <dl className="grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-1 font-mono text-sm">
                  <dt className="text-faint">User ID</dt>
                  <dd>{portal.username}</dd>
                  <dt className="text-faint">Password</dt>
                  <dd>{portal.password}</dd>
                </dl>
              </div>
            ) : canIssueLogin ? (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-muted">
                  This subscriber has no login yet. Issue one so they can open their own chits, dues, and receipts.
                </p>
                <Button
                  type="button"
                  className="w-fit"
                  onClick={() => {
                    const res = issueMemberLogin(memberId);
                    if (!res.ok) toast.error(res.error);
                    else toast.success(`Portal login: ${res.username} / ${res.password}`);
                  }}
                >
                  Create portal login
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted">No portal login on this record.</p>
            )}
          </Card>
          <Card>
            <CardTitle className="mb-3">Enrolled chits</CardTitle>
            {enrollments.length === 0 ? (
              <p className="text-sm text-muted">Not enrolled in any scheme.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {enrollments.map((e) => {
                  const s = schemes.find((x) => x.id === e.chitSchemeId);
                  return (
                    <li key={e.id} className="flex items-center justify-between rounded-md bg-surface-2 px-3 py-2 text-sm">
                      <span>{s?.name ?? e.chitSchemeId}</span>
                      <StatusBadge value={e.status} />
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
          <div>
            <h2 className="font-display mb-3 text-xl">Payments</h2>
            {payments.length === 0 ? (
              <p className="text-sm text-muted">No payments recorded.</p>
            ) : (
              <DataTable headers={["Date", "Amount", "Source", "Status"]}>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <Td className="text-muted">{formatDate(p.createdAt)}</Td>
                    <Td className="tabular-nums">{formatINR(p.amount)}</Td>
                    <Td>
                      <StatusBadge value={p.source} />
                    </Td>
                    <Td>
                      <StatusBadge value={p.status} />
                    </Td>
                  </tr>
                ))}
              </DataTable>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
