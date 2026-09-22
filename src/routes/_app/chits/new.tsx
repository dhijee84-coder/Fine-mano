import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/desk";
import { Button, Card, Field, Input } from "@/components/kit";
import { Forbidden, ModuleOff } from "@/components/desk";
import { useAppStore } from "@/lib/store";
import { useHas, useModuleOn } from "@/lib/session";
import { todayISO } from "@/lib/format";

export const Route = createFileRoute("/_app/chits/new")({ component: NewChitPage });

function NewChitPage() {
  const can = useHas("chits.create");
  const moduleOn = useModuleOn("chit_management");
  const navigate = useNavigate();
  const createScheme = useAppStore((s) => s.createScheme);
  const [name, setName] = useState("");
  const [total, setTotal] = useState("500000");
  const [months, setMonths] = useState("20");
  const [inst, setInst] = useState("25000");
  const [start, setStart] = useState(todayISO());

  if (!can) return <Forbidden reason="chits.create is required." />;
  if (!moduleOn) return <ModuleOff name="chit management" />;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = createScheme({
      name,
      totalAmount: Number(total),
      durationMonths: Number(months),
      installmentAmount: Number(inst),
      startDate: start,
    });
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success("Scheme created.");
    navigate({ to: "/chits/$schemeId", params: { schemeId: res.id } });
  }

  return (
    <div className="enter mx-auto max-w-xl">
      <PageHeader kicker="Chits" title="New scheme" description="Corpus, tenure, and monthly installment. Enroll members after creating." />
      <Card>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Aishwarya Gold 5L" />
          </Field>
          <Field label="Total amount (₹)">
            <Input type="number" min={1} value={total} onChange={(e) => setTotal(e.target.value)} required />
          </Field>
          <Field label="Duration (months)">
            <Input type="number" min={1} value={months} onChange={(e) => setMonths(e.target.value)} required />
          </Field>
          <Field label="Installment amount (₹)">
            <Input type="number" min={1} value={inst} onChange={(e) => setInst(e.target.value)} required />
          </Field>
          <Field label="Start date">
            <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} required />
          </Field>
          <div className="mt-2 flex gap-2">
            <Button type="submit">Create</Button>
            <Button type="button" variant="ghost" onClick={() => navigate({ to: "/chits" })}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
