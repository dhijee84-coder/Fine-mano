import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/desk";
import { Button, Card, Field, Input, Select } from "@/components/kit";
import { Forbidden, ModuleOff } from "@/components/desk";
import { useAppStore } from "@/lib/store";
import { useHas, useModuleOn, useVisibleMembers } from "@/lib/session";

export const Route = createFileRoute("/_app/payments/new")({ component: NewPaymentPage });

function NewPaymentPage() {
  const can = useHas("payments.create");
  const moduleOn = useModuleOn("manual_payments");
  const navigate = useNavigate();
  const members = useVisibleMembers();
  const schemes = useAppStore((s) => s.schemes);
  const enrollments = useAppStore((s) => s.enrollments);
  const createPayment = useAppStore((s) => s.createPayment);

  const liveSchemes = useMemo(
    () =>
      schemes
        .filter((s) => s.status !== "DRAFT")
        .slice()
        .sort((a, b) => Number(a.status !== "ACTIVE") - Number(b.status !== "ACTIVE") || a.name.localeCompare(b.name)),
    [schemes],
  );

  const [schemeId, setSchemeId] = useState(
    () => useAppStore.getState().schemes.find((s) => s.status === "ACTIVE")?.id ?? "",
  );
  const schemeMembers = useMemo(() => {
    const ids = new Set(
      enrollments
        .filter((e) => e.chitSchemeId === schemeId && e.status === "ACTIVE")
        .map((e) => e.memberId),
    );
    return members.filter((m) => m.isActive && !m.deletedAt && ids.has(m.id));
  }, [enrollments, members, schemeId]);

  const selectedScheme = liveSchemes.find((s) => s.id === schemeId);
  const [memberId, setMemberId] = useState(schemeMembers[0]?.id ?? "");
  const [amount, setAmount] = useState(() =>
    selectedScheme ? String(selectedScheme.installmentAmount) : "",
  );
  const [reference, setReference] = useState("");

  if (!can) return <Forbidden reason="payments.create is required." />;
  if (!moduleOn) return <ModuleOff name="manual payments" />;

  function applyScheme(id: string) {
    setSchemeId(id);
    const next = enrollments
      .filter((e) => e.chitSchemeId === id && e.status === "ACTIVE")
      .map((e) => e.memberId);
    const alive = members.filter((m) => m.isActive && !m.deletedAt && next.includes(m.id));
    setMemberId(alive[0]?.id ?? "");
    const scheme = schemes.find((s) => s.id === id);
    if (scheme) setAmount(String(scheme.installmentAmount));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!schemeId) {
      toast.error("Pick a scheme first.");
      return;
    }
    if (!memberId) {
      toast.error("Pick a live subscriber in this scheme.");
      return;
    }
    const res = createPayment({ memberId, amount: Number(amount), reference, source: "MANUAL" });
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success("Payment recorded as pending.");
    navigate({ to: "/payments" });
  }

  return (
    <div className="enter mx-auto max-w-xl">
      <PageHeader
        kicker="Payments"
        title="Record manual payment"
        description="Choose the scheme first. The member list only shows subscribers still enrolled and active in that scheme. The row stays pending."
      />
      <Card>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <Field label="Chit scheme">
            <Select value={schemeId} onChange={(e) => applyScheme(e.target.value)} required>
              <option value="" disabled>
                Select scheme
              </option>
              {liveSchemes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                  {s.status !== "ACTIVE" ? ` (${s.status})` : ""}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Member in this scheme">
            <Select
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              required
              disabled={!schemeId || schemeMembers.length === 0}
            >
              {schemeMembers.length === 0 ? (
                <option value="">No live subscribers in this scheme</option>
              ) : (
                schemeMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName}
                  </option>
                ))
              )}
            </Select>
          </Field>
          <Field label="Amount (₹)">
            <Input type="number" min={1} step="1" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </Field>
          <Field label="Reference">
            <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="CASH-CHN-0928" />
          </Field>
          <div className="mt-2 flex gap-2">
            <Button type="submit" disabled={!memberId}>
              Save
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate({ to: "/payments" })}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
