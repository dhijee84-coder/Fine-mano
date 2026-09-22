import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
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
  const createPayment = useAppStore((s) => s.createPayment);
  const [memberId, setMemberId] = useState(members[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");

  if (!can) return <Forbidden reason="payments.create is required." />;
  if (!moduleOn) return <ModuleOff name="manual payments" />;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
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
        description="Staff can enter a receipt; they cannot approve or allocate it. The row stays pending."
      />
      <Card>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <Field label="Member">
            <Select value={memberId} onChange={(e) => setMemberId(e.target.value)} required>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.fullName}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Amount (₹)">
            <Input type="number" min={1} step="1" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </Field>
          <Field label="Reference">
            <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="CASH-CHN-0928" />
          </Field>
          <div className="mt-2 flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="ghost" onClick={() => navigate({ to: "/payments" })}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
