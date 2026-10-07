import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button, Field, Input } from "@/components/kit";
import { useAppStore } from "@/lib/store";
import { generateOtp } from "@/lib/generate-otp";

export const Route = createFileRoute("/forgot")({ component: ForgotPage });

function ForgotPage() {
  const request = useAppStore((s) => s.requestPasswordReset);
  const confirm = useAppStore((s) => s.confirmPasswordReset);
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [issued, setIssued] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [busy, setBusy] = useState(false);

  async function onPhone(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { otp: code } = await generateOtp();
      const res = request(phone, code);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setIssued(code);
      setOtp(code);
      toast.success(`Code issued for ${res.toPhone}. Also in that account’s in-app alerts.`);
      setStep("otp");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not generate OTP.");
    } finally {
      setBusy(false);
    }
  }

  function onReset(e: FormEvent) {
    e.preventDefault();
    const res = confirm(phone, otp, password);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success("Password updated. Sign in with your User ID.");
    navigate({ to: "/" });
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 py-10">
      <p className="text-[11px] tracking-[0.16em] text-muted uppercase">Member portal</p>
      <h1 className="font-display mt-2 text-3xl">Reset password</h1>
      <p className="mt-2 mb-6 text-sm text-muted">
        Enter the mobile on your member record. A 6-digit OTP is generated on the server (Python locally, same CSPRNG in Node on Vercel). An in-app alert is also posted on that account.
      </p>
      {step === "phone" ? (
        <form onSubmit={onPhone} className="flex flex-col gap-3 rounded-xl bg-surface p-5 hairline">
          <Field label="Mobile number">
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="98400 11221"
              required
              inputMode="tel"
            />
          </Field>
          <Button type="submit" disabled={busy}>
            {busy ? "Generating code…" : "Send code"}
          </Button>
        </form>
      ) : (
        <form onSubmit={onReset} className="flex flex-col gap-3 rounded-xl bg-surface p-5 hairline">
          {issued ? (
            <p className="font-mono text-xs text-ink">OTP (shown here so you can test): {issued}</p>
          ) : null}
          <Field label="Code">
            <Input value={otp} onChange={(e) => setOtp(e.target.value)} required />
          </Field>
          <Field label="New password">
            <Input type="password" minLength={4} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Field>
          <Button type="submit">Set password</Button>
        </form>
      )}
      <Link to="/" className="mt-6 text-sm text-primary">
        Back to sign in
      </Link>
    </div>
  );
}
