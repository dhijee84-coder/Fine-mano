import { createServerFn } from "@tanstack/react-start";

export const generateOtp = createServerFn({ method: "POST" }).handler(async () => {
  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const path = await import("node:path");
  const execFileAsync = promisify(execFile);
  const script = path.join(process.cwd(), "python", "otp.py");
  const { stdout, stderr } = await execFileAsync("python3", [script, "6"], {
    timeout: 5000,
  });
  const otp = stdout.trim();
  if (!/^\d{6}$/.test(otp)) {
    throw new Error(stderr.trim() || "Python OTP generator failed.");
  }
  return { otp };
});
