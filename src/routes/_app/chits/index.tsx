import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/desk";
import { Button } from "@/components/kit";
import { DataTable, Td, StatusBadge, Forbidden, ModuleOff } from "@/components/desk";
import { useAppStore } from "@/lib/store";
import { useHas, useModuleOn } from "@/lib/session";
import { formatDate, formatINR } from "@/lib/format";

export const Route = createFileRoute("/_app/chits/")({ component: ChitsPage });

function ChitsPage() {
  const canView = useHas("chits.view");
  const canCreate = useHas("chits.create");
  const canGen = useHas("installments.generate");
  const moduleOn = useModuleOn("chit_management");
  const schemes = useAppStore((s) => s.schemes);
  const enrollments = useAppStore((s) => s.enrollments);
  const installments = useAppStore((s) => s.installments);
  const generate = useAppStore((s) => s.generateInstallments);

  if (!canView) return <Forbidden reason="chits.view is required." />;
  if (!moduleOn) return <ModuleOff name="chit management" />;

  return (
    <div className="enter">
      <PageHeader
        kicker="Schemes"
        title="Chit schemes"
        description="Foreman book of live chits. Harvest 3L is enrolled but has no installment schedule yet — generate it to watch the operation."
        actions={
          canCreate ? (
            <Button asChild>
              <Link to="/chits/new">
                <Plus className="size-4" />
                New scheme
              </Link>
            </Button>
          ) : null
        }
      />
      <DataTable headers={["Scheme", "Corpus", "Installment", "Tenure", "Enrolled", "Schedule", "Status", ""]}>
        {schemes.map((s) => {
          const enrolled = enrollments.filter((e) => e.chitSchemeId === s.id);
          const inst = installments.filter((i) => enrolled.some((e) => e.id === i.memberChitId));
          return (
            <tr key={s.id} className="hover:bg-surface-2/60">
              <Td className="font-medium">
                <Link to="/chits/$schemeId" params={{ schemeId: s.id }} className="hover:text-primary">
                  {s.name}
                </Link>
                <div className="text-xs text-muted">Starts {formatDate(s.startDate)}</div>
              </Td>
              <Td className="tabular-nums">{formatINR(s.totalAmount)}</Td>
              <Td className="tabular-nums">{formatINR(s.installmentAmount)}</Td>
              <Td>{s.durationMonths} mo</Td>
              <Td className="tabular-nums">{enrolled.length}</Td>
              <Td className="tabular-nums">{inst.length}</Td>
              <Td>
                <StatusBadge value={s.status} />
              </Td>
              <Td>
                <div className="flex flex-wrap gap-2">
                  <Link to="/chits/$schemeId" params={{ schemeId: s.id }} className="text-sm text-primary">
                    Open
                  </Link>
                  {canGen ? (
                    <button
                      type="button"
                      className="text-sm text-muted hover:text-ink"
                      onClick={() => {
                        const res = generate(s.id);
                        if (!res.ok) toast.error(res.error);
                        else toast.success(res.created ? `${res.created} installments generated.` : "Schedule already complete.");
                      }}
                    >
                      Generate
                    </button>
                  ) : null}
                </div>
              </Td>
            </tr>
          );
        })}
      </DataTable>
    </div>
  );
}
