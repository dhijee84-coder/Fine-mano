import { createServerFn } from "@tanstack/react-start";

export const generateOtp = createServerFn({ method: "POST" }).handler(async () => {
  const python = await (async () => {
    try {
      const { execFile } = await import("node:child_process");
      const { promisify } = await import("node:util");
      const path = await import("node:path");
      const execFileAsync = promisify(execFile);
      const script = path.join(process.cwd(), "python", "otp.py");
      const { stdout } = await execFileAsync("python3", [script, "6"], { timeout: 4000 });
      const otp = stdout.trim();
      return /^\d{6}$/.test(otp) ? otp : null;
    } catch {
      return null;
    }
  })();

  if (python) return { otp: python, via: "python" as const };

  const { randomInt } = await import("node:crypto");
  return { otp: String(randomInt(0, 1_000_000)).padStart(6, "0"), via: "node" as const };
});
