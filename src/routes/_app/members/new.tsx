import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/desk";
import { Button, Card, Field, Input, Select } from "@/components/kit";
import { Forbidden, ModuleOff } from "@/components/desk";
import { useAppStore } from "@/lib/store";
import { useHas, useModuleOn } from "@/lib/session";

export const Route = createFileRoute("/_app/members/new")({ component: NewMemberPage });

function NewMemberPage() {
  const can = useHas("members.create");
  const moduleOn = useModuleOn("member_management");
  const navigate = useNavigate();
  const createMember = useAppStore((s) => s.createMember);
  const users = useAppStore((s) => s.users);
  const staff = users.filter((u) => u.role === "ADMIN" && u.isActive);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [assignedStaffId, setAssignedStaffId] = useState<string>("");

  if (!can) return <Forbidden reason="members.create is required." />;
  if (!moduleOn) return <ModuleOff name="member management" />;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = createMember({
      fullName,
      phone,
      email,
      address,
      city,
      assignedStaffId: assignedStaffId || null,
    });
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success("Member created.");
    navigate({ to: "/members/$memberId", params: { memberId: res.id } });
  }

  return (
    <div className="enter mx-auto max-w-xl">
      <PageHeader kicker="Members" title="New member" description="Phone must be unique. Assign an operator if someone on the floor owns this book." />
      <Card>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <Field label="Full name">
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </Field>
          <Field label="Phone">
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </Field>
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Address">
            <Input value={address} onChange={(e) => setAddress(e.target.value)} />
          </Field>
          <Field label="City">
            <Input value={city} onChange={(e) => setCity(e.target.value)} />
          </Field>
            <Field label="Assigned operator">
              <Select value={assignedStaffId} onChange={(e) => setAssignedStaffId(e.target.value)}>
                <option value="">Unassigned</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.username}
                  </option>
                ))}
              </Select>
            </Field>
          <div className="mt-2 flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="ghost" onClick={() => navigate({ to: "/members" })}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
