import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/desk";
import { Button, Dialog, DialogContent, Field, Select } from "@/components/kit";
import { DataTable, Td, StatusBadge, EmptyState, Forbidden, ModuleOff } from "@/components/desk";
import { useAppStore } from "@/lib/store";
import { useHas, useModuleOn } from "@/lib/session";
import { formatDateTime, formatINR } from "@/lib/format";

export const Route = createFileRoute("/_app/payments/unmatched")({ component: UnmatchedPage });

function UnmatchedPage() {
  const canView = useHas("payments.view");
  const moduleOn = useModuleOn("payments");
  const items = useAppStore((s) => s.unmatched);
  const membersAll = useAppStore((s) => s.members);
  const members = membersAll.filter((m) => !m.deletedAt);
  const resolve = useAppStore((s) => s.resolveUnmatched);
  const ignore = useAppStore((s) => s.ignoreUnmatched);
  const [openId, setOpenId] = useState<string | null>(null);
  const [memberId, setMemberId] = useState("");

  if (!canView) return <Forbidden />;
  if (!moduleOn) return <ModuleOff name="payments" />;

  const open = items.filter((i) => i.status === "OPEN");

  return (
    <div className="enter">
      <PageHeader
        kicker="Reconciliation"
        title="Unmatched receipts"
        description="SMS and bank credits that could not be matched to a subscriber. Resolve by attaching a member, or ignore."
      />
      {open.length === 0 ? (
        <EmptyState title="Queue is clear" description="No open unmatched receipts." />
      ) : (
        <DataTable headers={["Received", "Amount", "Source", "Raw reference", ""]}>
          {open.map((u) => (
            <tr key={u.id}>
              <Td className="text-muted whitespace-nowrap">{formatDateTime(u.receivedAt)}</Td>
              <Td className="tabular-nums">{formatINR(u.amount)}</Td>
              <Td>
                <StatusBadge value={u.source} />
              </Td>
              <Td className="max-w-xs text-xs text-muted">{u.rawReference}</Td>
              <Td>
                <div className="flex gap-2">
                  <button type="button" className="text-sm text-primary" onClick={() => setOpenId(u.id)}>
                    Match
                  </button>
                  <button
                    type="button"
                    className="text-sm text-muted"
                    onClick={() => {
                      ignore(u.id);
                      toast.success("Ignored.");
                    }}
                  >
                    Ignore
                  </button>
                </div>
              </Td>
            </tr>
          ))}
        </DataTable>
      )}

      <Dialog open={!!openId} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent title="Match to member">
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!openId) return;
              const res = resolve(openId, memberId);
              if (!res.ok) toast.error(res.error);
              else {
                toast.success("Created a pending payment on that member.");
                setOpenId(null);
              }
            }}
          >
            <Field label="Member">
              <Select value={memberId} onChange={(e) => setMemberId(e.target.value)} required>
                <option value="">Select…</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName}
                  </option>
                ))}
              </Select>
            </Field>
            <Button type="submit">Create payment</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
