import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/desk";
import { Button, Dialog, DialogContent, Field, Input, Select } from "@/components/kit";
import { DataTable, Td, StatusBadge, Forbidden, ModuleOff } from "@/components/desk";
import { useAppStore } from "@/lib/store";
import { useHas, useModuleOn } from "@/lib/session";
import { formatDate, formatINR } from "@/lib/format";

export const Route = createFileRoute("/_app/payments/")({ component: PaymentsPage });

function PaymentsPage() {
  const canView = useHas("payments.view");
  const canCreate = useHas("payments.create");
  const canApprove = useHas("payments.approve");
  const canAlloc = useHas("payments.allocate");
  const canDelete = useHas("payments.delete");
  const moduleOn = useModuleOn("payments");
  const paymentsAll = useAppStore((s) => s.payments);
  const payments = paymentsAll.filter((p) => !p.deletedAt);
  const members = useAppStore((s) => s.members);
  const enrollments = useAppStore((s) => s.enrollments);
  const installments = useAppStore((s) => s.installments);
  const approve = useAppStore((s) => s.approvePayment);
  const allocate = useAppStore((s) => s.allocatePayment);
  const del = useAppStore((s) => s.softDeletePayment);
  const unmatchedAll = useAppStore((s) => s.unmatched);
  const unmatched = unmatchedAll.filter((u) => u.status === "OPEN").length;

  const [allocFor, setAllocFor] = useState<string | null>(null);
  const [instId, setInstId] = useState("");
  const [amount, setAmount] = useState("");
  const [delFor, setDelFor] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  if (!canView) return <Forbidden reason="payments.view is required." />;
  if (!moduleOn) return <ModuleOff name="payments" />;

  const payment = payments.find((p) => p.id === allocFor);
  const memberInst = payment
    ? installments.filter((i) => {
        const enr = enrollments.find((e) => e.id === i.memberChitId);
        return enr?.memberId === payment.memberId && !i.locked;
      })
    : [];

  return (
    <div className="enter">
      <PageHeader
        kicker="Collections"
        title="Payments"
        description="Manual and bank receipts. Allocate to an installment, approve, or soft-delete with a reason."
        actions={
          <>
            {unmatched > 0 ? (
              <Button asChild variant="outline">
                <Link to="/payments/unmatched">Unmatched ({unmatched})</Link>
              </Button>
            ) : (
              <Button asChild variant="outline">
                <Link to="/payments/unmatched">Unmatched</Link>
              </Button>
            )}
            {canCreate ? (
              <Button asChild>
                <Link to="/payments/new">
                  <Plus className="size-4" />
                  Record payment
                </Link>
              </Button>
            ) : null}
          </>
        }
      />
      <DataTable headers={["When", "Member", "Amount", "Source", "Ref", "Status", ""]}>
        {payments.map((p) => {
          const m = members.find((x) => x.id === p.memberId);
          return (
            <tr key={p.id}>
              <Td className="text-muted whitespace-nowrap">{formatDate(p.createdAt)}</Td>
              <Td>{m?.fullName ?? p.memberId}</Td>
              <Td className="tabular-nums">{formatINR(p.amount)}</Td>
              <Td>
                <StatusBadge value={p.source} />
              </Td>
              <Td className="max-w-[140px] truncate font-mono text-xs">{p.reference || "—"}</Td>
              <Td>
                <StatusBadge value={p.status} />
              </Td>
              <Td>
                <div className="flex flex-wrap gap-2">
                  {canApprove && p.status === "PENDING" ? (
                    <button
                      type="button"
                      className="text-sm text-primary"
                      onClick={() => {
                        const res = approve(p.id);
                        if (!res.ok) toast.error(res.error);
                        else toast.success("Approved.");
                      }}
                    >
                      Approve
                    </button>
                  ) : null}
                  {canAlloc && p.status !== "REVERSED" && p.status !== "ALLOCATED" ? (
                    <button
                      type="button"
                      className="text-sm text-primary"
                      onClick={() => {
                        setAllocFor(p.id);
                        setAmount(String(p.amount));
                        setInstId("");
                      }}
                    >
                      Allocate
                    </button>
                  ) : null}
                  {canDelete ? (
                    <button
                      type="button"
                      className="text-sm text-danger"
                      onClick={() => {
                        setDelFor(p.id);
                        setReason("");
                      }}
                    >
                      Delete
                    </button>
                  ) : null}
                </div>
              </Td>
            </tr>
          );
        })}
      </DataTable>

      <Dialog open={!!allocFor} onOpenChange={(o) => !o && setAllocFor(null)}>
        <DialogContent title="Allocate to installment">
          <p className="mb-3 text-sm text-muted">
            Locked (fully paid) installments cannot be edited without installments.edit_paid.
          </p>
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!allocFor) return;
              const res = allocate(allocFor, instId, Number(amount));
              if (!res.ok) toast.error(res.error);
              else {
                toast.success("Allocated.");
                setAllocFor(null);
              }
            }}
          >
            <Field label="Installment">
              <Select value={instId} onChange={(e) => setInstId(e.target.value)} required>
                <option value="">Select…</option>
                {memberInst.map((i) => (
                  <option key={i.id} value={i.id}>
                    #{i.installmentNumber} · due {formatDate(i.dueDate)} · {i.status} · paid {formatINR(i.amountPaid)} /{" "}
                    {formatINR(i.amountDue)}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Amount">
              <Input type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </Field>
            <Button type="submit">Allocate</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!delFor} onOpenChange={(o) => !o && setDelFor(null)}>
        <DialogContent title="Soft-delete payment">
          <p className="mb-3 text-sm text-muted">Never a hard delete. Reason is required and audit-logged.</p>
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!delFor) return;
              const res = del(delFor, reason);
              if (!res.ok) toast.error(res.error);
              else {
                toast.success("Payment reversed (soft delete).");
                setDelFor(null);
              }
            }}
          >
            <Field label="Reason">
              <Input value={reason} onChange={(e) => setReason(e.target.value)} required />
            </Field>
            <Button type="submit" variant="danger">
              Confirm
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
