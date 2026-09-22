import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { PageHeader, DataTable, Td, StatCard, StatusBadge, Forbidden, ModuleOff } from "@/components/desk";
import { Button, Card, CardTitle, Field, Input, Select } from "@/components/kit";
import { useAppStore } from "@/lib/store";
import { useHas, useModuleOn } from "@/lib/session";
import { formatDate, formatINR } from "@/lib/format";

export const Route = createFileRoute("/_app/chits/$schemeId")({ component: SchemePage });

function SchemePage() {
  const { schemeId } = Route.useParams();
  const canView = useHas("chits.view");
  const canEdit = useHas("chits.edit");
  const canCreateMember = useHas("members.create");
  const canGen = useHas("installments.generate");
  const moduleOn = useModuleOn("chit_management");
  const scheme = useAppStore((s) => s.schemes.find((x) => x.id === schemeId));
  const membersAll = useAppStore((s) => s.members);
  const members = membersAll.filter((m) => !m.deletedAt);
  const enrollmentsAll = useAppStore((s) => s.enrollments);
  const enrollments = enrollmentsAll.filter((e) => e.chitSchemeId === schemeId);
  const installments = useAppStore((s) => s.installments);
  const enrollMember = useAppStore((s) => s.enrollMember);
  const createMember = useAppStore((s) => s.createMember);
  const issueMemberLogin = useAppStore((s) => s.issueMemberLogin);
  const users = useAppStore((s) => s.users);
  const generate = useAppStore((s) => s.generateInstallments);
  const [memberId, setMemberId] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  if (!canView) return <Forbidden reason="chits.view is required." />;
  if (!moduleOn) return <ModuleOff name="chit management" />;
  if (!scheme) return <Forbidden reason="Scheme not found." />;

  const enrolledIds = new Set(enrollments.map((e) => e.memberId));
  const available = members.filter((m) => !enrolledIds.has(m.id));
  const inst = installments.filter((i) => enrollments.some((e) => e.id === i.memberChitId));
  const overdue = inst.filter((i) => i.status === "OVERDUE").length;
  const paid = inst.filter((i) => i.status === "PAID").length;

  function fillSchedule() {
    if (!canGen) return;
    const res = generate(schemeId);
    if (!res.ok) toast.error(res.error);
    else if (res.created) toast.success(`${res.created} installment rows added for this scheme.`);
  }

  function ensureLogin(id: string, name: string, forceToast: boolean) {
    const already = users.find((u) => u.memberId === id);
    if (already && !forceToast) return;
    const login = issueMemberLogin(id);
    if (!login.ok) {
      toast.error(login.error);
      return;
    }
    toast.success(
      `${name} can sign in with User ID ${login.username} and password ${login.password}.`,
    );
  }

  function onEnroll(e: FormEvent) {
    e.preventDefault();
    if (!memberId) return;
    const res = enrollMember(schemeId, memberId);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    const name = members.find((m) => m.id === memberId)?.fullName ?? "Member";
    toast.success("Member enrolled.");
    ensureLogin(memberId, name, false);
    setMemberId("");
    fillSchedule();
  }

  function onCreateAndEnroll(e: FormEvent) {
    e.preventDefault();
    const created = createMember({
      fullName,
      phone,
      email: "",
      address: "",
      city,
      assignedStaffId: null,
    });
    if (!created.ok) {
      toast.error(created.error);
      return;
    }
    const enrolled = enrollMember(schemeId, created.id);
    if (!enrolled.ok) {
      toast.error(enrolled.error);
      return;
    }
    ensureLogin(created.id, fullName.trim(), true);
    setFullName("");
    setPhone("");
    setCity("");
    fillSchedule();
  }

  return (
    <div className="enter">
      <PageHeader
        kicker="Chit scheme"
        title={scheme.name}
        description={`${formatINR(scheme.totalAmount)} corpus · ${scheme.durationMonths} months · started ${formatDate(scheme.startDate)}`}
        actions={
          canGen ? (
            <Button
              variant="outline"
              onClick={() => {
                const res = generate(scheme.id);
                if (!res.ok) toast.error(res.error);
                else toast.success(res.created ? `${res.created} installments generated.` : "Schedule already complete.");
              }}
            >
              Generate installments
            </Button>
          ) : null
        }
      />
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Installment" value={formatINR(scheme.installmentAmount)} />
        <StatCard label="Enrolled" value={enrollments.length} />
        <StatCard label="Paid rows" value={paid} />
        <StatCard label="Overdue rows" value={overdue} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle className="mb-3">Add to this scheme</CardTitle>
          {canEdit ? (
            <div className="flex flex-col gap-6">
              <form onSubmit={onEnroll} className="flex flex-col gap-3">
                <p className="text-xs tracking-[0.14em] text-muted uppercase">Existing subscriber</p>
                <Field label="Member already on the books">
                  <Select value={memberId} onChange={(e) => setMemberId(e.target.value)} required>
                    <option value="">Select…</option>
                    {available.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.fullName}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Button type="submit" disabled={!memberId}>
                  Enroll
                </Button>
              </form>
              {canCreateMember ? (
                <form onSubmit={onCreateAndEnroll} className="flex flex-col gap-3 border-t border-line pt-5">
                  <p className="text-xs tracking-[0.14em] text-muted uppercase">New subscriber</p>
                  <Field label="Full name">
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  </Field>
                  <Field label="Phone">
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </Field>
                  <Field label="City">
                    <Input value={city} onChange={(e) => setCity(e.target.value)} />
                  </Field>
                  <Button type="submit" disabled={!fullName.trim() || !phone.trim()}>
                    Create and enroll
                  </Button>
                  <p className="text-xs text-muted">
                    Creates the member, puts them on this roster, and opens their installment rows. Paid rows already on the book are not overwritten.
                  </p>
                </form>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-muted">Your role cannot enroll members.</p>
          )}
        </Card>
        <Card>
          <CardTitle className="mb-3">Roster</CardTitle>
          {enrollments.length === 0 ? (
            <p className="text-sm text-muted">Nobody enrolled yet.</p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {enrollments.map((e) => {
                const m = members.find((x) => x.id === e.memberId);
                return (
                  <li key={e.id} className="flex justify-between text-sm">
                    <Link
                      to="/members/$memberId"
                      params={{ memberId: e.memberId }}
                      className="hover:text-primary"
                    >
                      {m?.fullName ?? e.memberId}
                    </Link>
                    <StatusBadge value={e.status} />
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
      <h2 className="font-display mt-8 mb-3 text-xl">Installment book</h2>
      {inst.length === 0 ? (
        <p className="text-sm text-muted">No schedule yet. Enroll someone or generate installments to open the book.</p>
      ) : (
        <DataTable headers={["#", "Member", "Due", "Amount", "Paid", "Status"]}>
          {inst
            .slice()
            .sort((a, b) => a.dueDate.localeCompare(b.dueDate) || a.installmentNumber - b.installmentNumber)
            .slice(0, 40)
            .map((i) => {
              const enr = enrollments.find((e) => e.id === i.memberChitId);
              const m = members.find((x) => x.id === enr?.memberId);
              return (
                <tr key={i.id}>
                  <Td className="tabular-nums text-muted">{i.installmentNumber}</Td>
                  <Td>{m?.fullName ?? "—"}</Td>
                  <Td className="text-muted">{formatDate(i.dueDate)}</Td>
                  <Td className="tabular-nums">{formatINR(i.amountDue)}</Td>
                  <Td className="tabular-nums">{formatINR(i.amountPaid)}</Td>
                  <Td>
                    <StatusBadge value={i.status} />
                  </Td>
                </tr>
              );
            })}
        </DataTable>
      )}
    </div>
  );
}
