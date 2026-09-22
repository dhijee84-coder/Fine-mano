import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  PERMISSIONS,
  ROLE_DEFAULTS,
  type ModuleKey,
  type RoleName,
} from "./permissions";
import { addMonthsISO, formatINR, nowISO, todayISO } from "./format";
import { createSeedState } from "./seed";
import type {
  AccountAlert,
  AlertKind,
  AppState,
  AuditLog,
  ChitInstallment,
  Member,
  OutboundSms,
  PaymentSource,
  SmsKind,
  UnmatchedStatus,
  User,
} from "./types";

export type Store = AppState & {
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  login: (username: string, password: string) => { ok: true } | { ok: false; error: string };
  loginAs: (username: string) => { ok: true } | { ok: false; error: string };
  logout: () => void;
  currentUser: () => User | null;
  effectivePermissions: (user?: User | null) => Set<string>;
  hasPermission: (code: string) => boolean;
  moduleEnabled: (key: ModuleKey) => boolean;
  visibleMembers: () => Member[];
  nextId: (prefix: string) => string;
  log: (
    entry: {
      action: string;
      module: string;
      recordType: string;
      recordId: string;
      reason?: string;
      oldValue?: string;
      newValue?: string;
      result?: AuditLog["result"];
    },
  ) => void;

  createMember: (data: { fullName: string; phone: string; email: string; address: string; city: string; assignedStaffId: string | null }) => { ok: true; id: string } | { ok: false; error: string };
  updateMember: (id: string, data: Partial<Pick<Member, "fullName" | "phone" | "email" | "address" | "city" | "assignedStaffId" | "isActive">>) => { ok: true } | { ok: false; error: string };
  softDeleteMember: (id: string, reason: string) => { ok: true } | { ok: false; error: string };

  createScheme: (data: { name: string; totalAmount: number; durationMonths: number; installmentAmount: number; startDate: string }) => { ok: true; id: string } | { ok: false; error: string };
  enrollMember: (schemeId: string, memberId: string) => { ok: true } | { ok: false; error: string };
  generateInstallments: (schemeId: string) => { ok: true; created: number } | { ok: false; error: string };

  createPayment: (data: { memberId: string; amount: number; reference: string; source?: PaymentSource }) => { ok: true; id: string } | { ok: false; error: string };
  allocatePayment: (paymentId: string, installmentId: string, amount: number) => { ok: true } | { ok: false; error: string };
  approvePayment: (paymentId: string) => { ok: true } | { ok: false; error: string };
  softDeletePayment: (paymentId: string, reason: string) => { ok: true } | { ok: false; error: string };
  resolveUnmatched: (id: string, memberId: string) => { ok: true } | { ok: false; error: string };
  ignoreUnmatched: (id: string) => { ok: true } | { ok: false; error: string };

  createUser: (data: { username: string; email: string; password: string; role: RoleName; memberId?: string | null }) => { ok: true; id: string } | { ok: false; error: string };
  issueMemberLogin: (memberId: string) => { ok: true; username: string; password: string } | { ok: false; error: string };
  disableUser: (id: string) => { ok: true } | { ok: false; error: string };
  enableUser: (id: string) => { ok: true } | { ok: false; error: string };
  changeRole: (id: string, role: RoleName) => { ok: true } | { ok: false; error: string };
  setOverride: (userId: string, permissionCode: string, grant: boolean, reason: string) => { ok: true } | { ok: false; error: string };
  setRolePermissions: (role: RoleName, codes: string[]) => { ok: true } | { ok: false; error: string };

  toggleModule: (key: ModuleKey, enabled: boolean) => { ok: true } | { ok: false; error: string };
  updateSettings: (patch: Record<string, string>) => void;
  updateWorkflow: (key: string, json: string) => { ok: true } | { ok: false; error: string };
  addCustomField: (data: { formKey: string; fieldName: string; label: string; fieldType: string; required: boolean; helpText: string }) => { ok: true } | { ok: false; error: string };
  addMenuItem: (data: { label: string; url: string; icon: string; requiredPermission: string }) => void;
  createApiClient: (name: string, scopes: string) => { ok: true } | { ok: false; error: string };
  revokeApiClient: (id: string) => void;
  setSmsDeviceStatus: (id: string, status: "APPROVED" | "DISABLED") => void;
  mockBankSync: () => { ok: true; fetched: number };
  requestDangerousAction: (actionType: string, reason: string, payload: string) => { ok: true } | { ok: false; error: string };
  decideAction: (id: string, approve: boolean) => { ok: true } | { ok: false; error: string };
  createBackup: (reason: string) => { ok: true } | { ok: false; error: string };
  sendReminder: (id: string) => void;
  processSms: (id: string) => { ok: true } | { ok: false; error: string };
  queueSms: (data: { toPhone: string; memberId?: string | null; kind: SmsKind; body: string; otp?: string }) => { ok: true; id: string; status: OutboundSms["status"]; otp: string };
  notifyAccount: (data: { userId: string; kind: AlertKind; title: string; body: string; href?: string }) => void;
  markAlertRead: (id: string) => void;
  markAllAlertsRead: () => void;
  requestPasswordReset: (phone: string, otp: string) => { ok: true; toPhone: string } | { ok: false; error: string };
  confirmPasswordReset: (phone: string, otp: string, newPassword: string) => { ok: true } | { ok: false; error: string };
  setUserPassword: (userId: string, password: string) => { ok: true } | { ok: false; error: string };
  sendDueReminders: () => { ok: true; sent: number } | { ok: false; error: string };
  resetDemo: () => void;
};

function deny(msg: string): { ok: false; error: string } {
  return { ok: false, error: msg };
}

function fireWebAlert(title: string, body: string) {
  if (typeof window === "undefined" || typeof Notification === "undefined") return;
  if (Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, icon: "/favicon.svg" });
  } catch {
    /* ignore */
  }
}

function slugUsername(fullName: string, existing: { username: string }[]) {
  const parts = fullName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  let base = parts[0] || "member";
  if (existing.some((u) => u.username === base) && parts[1]) {
    base = `${parts[0]}.${parts[1]}`;
  }
  let n = base;
  let i = 2;
  while (existing.some((u) => u.username === n)) {
    n = `${base}${i}`;
    i += 1;
  }
  return n;
}

export const useAppStore = create<Store>()(
  persist(
    (set, get) => {
      const seed = createSeedState();

      const currentUser = () => {
        const id = get().sessionUserId;
        if (!id) return null;
        return get().users.find((u) => u.id === id) ?? null;
      };

      const effectivePermissions = (user?: User | null) => {
        const u = user === undefined ? currentUser() : user;
        if (!u) return new Set<string>();
        if (u.role === "SUPER_ADMIN") return new Set(Object.keys(PERMISSIONS));
        const codes = new Set(get().rolePerms?.[u.role] ?? ROLE_DEFAULTS[u.role] ?? []);
        for (const ov of get().overrides.filter((o) => o.userId === u.id)) {
          if (ov.grant) codes.add(ov.permissionCode);
          else codes.delete(ov.permissionCode);
        }
        return codes;
      };

      const hasPermission = (code: string) => effectivePermissions().has(code);

      const requirePerm = (code: string) => {
        if (!hasPermission(code)) {
          get().log({
            action: "DENIED",
            module: code.split(".")[0] ?? "app",
            recordType: "",
            recordId: "",
            result: "DENIED",
            reason: `missing ${code}`,
            oldValue: "",
            newValue: "",
          });
          return false;
        }
        return true;
      };

      const nextId = (prefix: string) => {
        const n = get().seq[prefix] ?? 1;
        set({ seq: { ...get().seq, [prefix]: n + 1 } });
        return `${prefix}-${n}`;
      };

      const log: Store["log"] = (entry) => {
        const u = currentUser();
        const row: AuditLog = {
          id: nextId("a"),
          userId: u?.id ?? null,
          roleName: u?.role ?? null,
          timestamp: nowISO(),
          result: entry.result ?? "SUCCESS",
          action: entry.action,
          module: entry.module,
          recordType: entry.recordType,
          recordId: String(entry.recordId),
          reason: entry.reason ?? "",
          oldValue: entry.oldValue ?? "",
          newValue: entry.newValue ?? "",
        };
        set({ audit: [row, ...get().audit].slice(0, 200) });
      };

      return {
        ...seed,
        hasHydrated: false,
        setHasHydrated: (v) => set({ hasHydrated: v }),
        currentUser,
        effectivePermissions,
        hasPermission,
        moduleEnabled: (key) => get().modules[key] !== false,
        nextId,
        log,

        visibleMembers: () => {
          const u = currentUser();
          const all = get().members.filter((m) => !m.deletedAt);
          if (!u) return [];
          if (u.role === "MEMBER") return all.filter((m) => m.id === u.memberId);
          return all;
        },

        login: (username, password) => {
          if (!get().hasHydrated) return deny("Still opening the ledger.");
          const user = get().users.find(
            (u) => u.username.toLowerCase() === username.trim().toLowerCase(),
          );
          if (!user) return deny("Unknown username.");
          if (!user.isActive) return deny("This account is disabled.");
          if (user.lockedUntil && new Date(user.lockedUntil).getTime() > Date.now()) {
            return deny("Account locked after repeated failures. Try again later.");
          }
          if (user.password !== password) {
            const fails = user.failedLoginCount + 1;
            const lockedUntil = fails >= 5 ? new Date(Date.now() + 5 * 60 * 1000).toISOString() : null;
            set({
              users: get().users.map((u) =>
                u.id === user.id ? { ...u, failedLoginCount: fails, lockedUntil } : u,
              ),
            });
            log({
              action: "LOGIN",
              module: "auth",
              recordType: "User",
              recordId: user.id,
              result: "DENIED",
              reason: "bad password",
              oldValue: "",
              newValue: "",
            });
            return deny(lockedUntil ? "Too many attempts. Locked for 5 minutes." : "Incorrect password.");
          }
          set({
            sessionUserId: user.id,
            users: get().users.map((u) =>
              u.id === user.id ? { ...u, failedLoginCount: 0, lockedUntil: null } : u,
            ),
          });
          log({
            action: "LOGIN",
            module: "auth",
            recordType: "User",
            recordId: user.id,
            result: "SUCCESS",
            reason: "",
            oldValue: "",
            newValue: "",
          });
          return { ok: true };
        },

        loginAs: (username) => {
          if (!get().hasHydrated) return deny("Still opening the ledger.");
          const user = get().users.find((u) => u.username === username);
          if (!user || !user.isActive) return deny("Account unavailable.");
          set({ sessionUserId: user.id });
          log({
            action: "LOGIN",
            module: "auth",
            recordType: "User",
            recordId: user.id,
            result: "SUCCESS",
            reason: "demo quick-enter",
            oldValue: "",
            newValue: "",
          });
          return { ok: true };
        },

        logout: () => {
          const u = currentUser();
          if (u) {
            log({
              action: "LOGOUT",
              module: "auth",
              recordType: "User",
              recordId: u.id,
              result: "SUCCESS",
              reason: "",
              oldValue: "",
              newValue: "",
            });
          }
          set({ sessionUserId: null });
        },

        createMember: (data) => {
          if (!requirePerm("members.create")) return deny("You cannot create members.");
          if (!get().modules.member_management) return deny("Member module is disabled.");
          if (get().members.some((m) => m.phone === data.phone && !m.deletedAt)) {
            return deny("A member with this phone already exists.");
          }
          const id = nextId("m");
          const member: Member = {
            id,
            fullName: data.fullName.trim(),
            phone: data.phone.trim(),
            email: data.email.trim(),
            address: data.address.trim(),
            city: data.city.trim(),
            assignedStaffId: data.assignedStaffId,
            isActive: true,
            createdAt: nowISO(),
            deletedAt: null,
          };
          set({ members: [member, ...get().members] });
          log({
            action: "CREATE_MEMBER",
            module: "members",
            recordType: "Member",
            recordId: id,
            reason: "",
            oldValue: "",
            newValue: member.fullName,
          });
          return { ok: true, id };
        },

        updateMember: (id, data) => {
          if (!requirePerm("members.edit")) return deny("You cannot edit members.");
          const existing = get().visibleMembers().find((m) => m.id === id);
          if (!existing) return deny("Member not found or not accessible.");
          set({
            members: get().members.map((m) => (m.id === id ? { ...m, ...data } : m)),
          });
          log({
            action: "EDIT_MEMBER",
            module: "members",
            recordType: "Member",
            recordId: id,
            reason: "",
            oldValue: existing.fullName,
            newValue: data.fullName ?? existing.fullName,
          });
          return { ok: true };
        },

        softDeleteMember: (id, reason) => {
          if (!requirePerm("members.delete")) return deny("You cannot delete members.");
          if (!reason.trim()) return deny("A reason is required to delete a member.");
          set({
            members: get().members.map((m) =>
              m.id === id ? { ...m, deletedAt: nowISO(), isActive: false } : m,
            ),
          });
          log({
            action: "DELETE_MEMBER",
            module: "members",
            recordType: "Member",
            recordId: id,
            reason: reason.trim(),
            oldValue: "",
            newValue: "soft-deleted",
          });
          return { ok: true };
        },

        createScheme: (data) => {
          if (!requirePerm("chits.create")) return deny("You cannot create schemes.");
          if (!get().modules.chit_management) return deny("Chit module is disabled.");
          const id = nextId("s");
          set({
            schemes: [
              {
                id,
                name: data.name.trim(),
                totalAmount: data.totalAmount,
                durationMonths: data.durationMonths,
                installmentAmount: data.installmentAmount,
                startDate: data.startDate,
                status: "ACTIVE",
                createdBy: currentUser()?.id ?? "",
                createdAt: nowISO(),
              },
              ...get().schemes,
            ],
          });
          log({
            action: "CREATE_CHIT",
            module: "chits",
            recordType: "ChitScheme",
            recordId: id,
            reason: "",
            oldValue: "",
            newValue: data.name,
          });
          return { ok: true, id };
        },

        enrollMember: (schemeId, memberId) => {
          if (!requirePerm("chits.edit")) return deny("You cannot enroll members.");
          if (get().enrollments.some((e) => e.chitSchemeId === schemeId && e.memberId === memberId)) {
            return deny("Member is already enrolled in this scheme.");
          }
          const id = nextId("mc");
          set({
            enrollments: [
              {
                id,
                memberId,
                chitSchemeId: schemeId,
                enrolledAt: nowISO(),
                status: "ACTIVE",
              },
              ...get().enrollments,
            ],
          });
          log({
            action: "ENROLL_MEMBER_IN_CHIT",
            module: "chits",
            recordType: "MemberChit",
            recordId: id,
            reason: "",
            oldValue: "",
            newValue: `${memberId} → ${schemeId}`,
          });
          return { ok: true };
        },

        generateInstallments: (schemeId) => {
          if (!requirePerm("installments.generate")) return deny("You cannot generate installments.");
          if (!get().modules.installments) return deny("Installments module is disabled.");
          const scheme = get().schemes.find((s) => s.id === schemeId);
          if (!scheme) return deny("Scheme not found.");
          const enrollments = get().enrollments.filter((e) => e.chitSchemeId === schemeId);
          const existing = get().installments;
          const created: ChitInstallment[] = [];
          for (const enr of enrollments) {
            const have = new Set(
              existing.filter((i) => i.memberChitId === enr.id).map((i) => i.installmentNumber),
            );
            for (let n = 1; n <= scheme.durationMonths; n++) {
              if (have.has(n)) continue;
              const dueDate = addMonthsISO(scheme.startDate, n - 1);
              created.push({
                id: nextId("i"),
                memberChitId: enr.id,
                installmentNumber: n,
                dueDate,
                amountDue: scheme.installmentAmount,
                amountPaid: 0,
                status: dueDate < todayISO() ? "OVERDUE" : "PENDING",
                locked: false,
              });
            }
          }
          set({ installments: [...get().installments, ...created] });
          log({
            action: "GENERATE_INSTALLMENTS",
            module: "installments",
            recordType: "ChitScheme",
            recordId: schemeId,
            reason: "",
            oldValue: "",
            newValue: `created=${created.length}`,
          });
          return { ok: true, created: created.length };
        },

        createPayment: (data) => {
          if (!requirePerm("payments.create")) return deny("You cannot record payments.");
          if (!get().modules.manual_payments && (data.source ?? "MANUAL") === "MANUAL") {
            return deny("Manual payments module is disabled.");
          }
          const id = nextId("p");
          set({
            payments: [
              {
                id,
                memberId: data.memberId,
                amount: data.amount,
                source: data.source ?? "MANUAL",
                reference: data.reference.trim(),
                status: "PENDING",
                recordedBy: currentUser()?.id ?? "",
                createdAt: nowISO(),
                deletedAt: null,
              },
              ...get().payments,
            ],
          });
          log({
            action: "CREATE_PAYMENT",
            module: "payments",
            recordType: "Payment",
            recordId: id,
            reason: "",
            oldValue: "",
            newValue: String(data.amount),
          });
          const member = get().members.find((m) => m.id === data.memberId);
          if (member) {
            const portal = get().users.find((u) => u.memberId === member.id && u.isActive);
            if (portal) {
              get().notifyAccount({
                userId: portal.id,
                kind: "PAYMENT",
                title: "Payment recorded",
                body: `A ${data.source ?? "MANUAL"} payment of ${formatINR(data.amount)} is on your book.`,
                href: "/profile",
              });
            }
          }
          return { ok: true, id };
        },

        allocatePayment: (paymentId, installmentId, amount) => {
          if (!requirePerm("payments.allocate")) return deny("You cannot allocate payments.");
          const payment = get().payments.find((p) => p.id === paymentId && !p.deletedAt);
          if (!payment) return deny("Payment not found.");
          const inst = get().installments.find((i) => i.id === installmentId);
          if (!inst) return deny("Installment not found.");
          if (inst.locked) {
            return deny("Installment is locked (already paid). Editing it needs approval.");
          }
          const newPaid = inst.amountPaid + amount;
          const status = newPaid >= inst.amountDue ? "PAID" : "PARTIAL";
          const locked = status === "PAID";
          set({
            allocations: [
              {
                id: nextId("al"),
                paymentId,
                installmentId,
                amount,
                allocatedBy: currentUser()?.id ?? "",
                allocatedAt: nowISO(),
              },
              ...get().allocations,
            ],
            installments: get().installments.map((i) =>
              i.id === installmentId
                ? { ...i, amountPaid: newPaid, status, locked }
                : i,
            ),
            payments: get().payments.map((p) =>
              p.id === paymentId ? { ...p, status: "ALLOCATED" } : p,
            ),
          });
          log({
            action: "ALLOCATE_PAYMENT",
            module: "payments",
            recordType: "Payment",
            recordId: paymentId,
            reason: "",
            oldValue: "",
            newValue: `installment=${installmentId}, amount=${amount}`,
          });
          return { ok: true };
        },

        approvePayment: (paymentId) => {
          if (!requirePerm("payments.approve")) return deny("You cannot approve payments.");
          set({
            payments: get().payments.map((p) =>
              p.id === paymentId ? { ...p, status: "APPROVED" } : p,
            ),
          });
          log({
            action: "APPROVE_PAYMENT",
            module: "payments",
            recordType: "Payment",
            recordId: paymentId,
            reason: "",
            oldValue: "PENDING",
            newValue: "APPROVED",
          });
          return { ok: true };
        },

        softDeletePayment: (paymentId, reason) => {
          if (!requirePerm("payments.delete")) return deny("You cannot delete payments.");
          if (!reason.trim()) return deny("A reason is required to delete a payment.");
          set({
            payments: get().payments.map((p) =>
              p.id === paymentId ? { ...p, deletedAt: nowISO(), status: "REVERSED" } : p,
            ),
          });
          log({
            action: "DELETE_PAYMENT",
            module: "payments",
            recordType: "Payment",
            recordId: paymentId,
            reason: reason.trim(),
            oldValue: "",
            newValue: "soft-deleted",
          });
          return { ok: true };
        },

        resolveUnmatched: (id, memberId) => {
          const perms = effectivePermissions();
          if (!perms.has("payments.approve") && !perms.has("payments.allocate") && !perms.has("payments.create")) {
            return deny("You cannot resolve unmatched payments.");
          }
          const item = get().unmatched.find((u) => u.id === id);
          if (!item) return deny("Not found.");
          const pid = nextId("p");
          set({
            payments: [
              {
                id: pid,
                memberId,
                amount: item.amount,
                source: item.source,
                reference: item.rawReference.slice(0, 80),
                status: "PENDING",
                recordedBy: currentUser()?.id ?? "",
                createdAt: nowISO(),
                deletedAt: null,
              },
              ...get().payments,
            ],
            unmatched: get().unmatched.map((u) =>
              u.id === id ? { ...u, status: "RESOLVED" as UnmatchedStatus, resolvedPaymentId: pid } : u,
            ),
          });
          log({
            action: "RESOLVE_UNMATCHED",
            module: "payments",
            recordType: "UnmatchedPayment",
            recordId: id,
            reason: "",
            oldValue: "OPEN",
            newValue: memberId,
          });
          return { ok: true };
        },

        ignoreUnmatched: (id) => {
          set({
            unmatched: get().unmatched.map((u) =>
              u.id === id ? { ...u, status: "IGNORED" as UnmatchedStatus } : u,
            ),
          });
          return { ok: true };
        },

        createUser: (data) => {
          if (!requirePerm("users.create")) return deny("You cannot create users.");
          if (data.role === "SUPER_ADMIN" && !hasPermission("users.assign_superadmin")) {
            return deny("Only a Super Admin can create another Super Admin.");
          }
          if (data.role === "MEMBER") {
            if (!data.memberId) return deny("A Member login must be linked to a subscriber.");
            if (!get().members.some((m) => m.id === data.memberId && !m.deletedAt)) {
              return deny("Linked member not found.");
            }
            if (get().users.some((u) => u.memberId === data.memberId)) {
              return deny("This subscriber already has a portal login.");
            }
          }
          if (get().users.some((u) => u.username === data.username || u.email === data.email)) {
            return deny("Username or email already exists.");
          }
          const id = nextId("u");
          set({
            users: [
              ...get().users,
              {
                id,
                username: data.username.trim(),
                email: data.email.trim(),
                password: data.password,
                role: data.role,
                isActive: true,
                failedLoginCount: 0,
                lockedUntil: null,
                memberId: data.role === "MEMBER" ? data.memberId ?? null : null,
                createdAt: nowISO(),
              },
            ],
          });
          log({
            action: "CREATE_USER",
            module: "users",
            recordType: "User",
            recordId: id,
            reason: "",
            oldValue: "",
            newValue: `${data.username}, ${data.role}`,
          });
          return { ok: true, id };
        },

        issueMemberLogin: (memberId) => {
          if (!requirePerm("users.create")) return deny("You cannot issue a portal login.");
          const member = get().members.find((m) => m.id === memberId && !m.deletedAt);
          if (!member) return deny("Member not found.");
          const existing = get().users.find((u) => u.memberId === memberId);
          if (existing) {
            return { ok: true, username: existing.username, password: existing.password };
          }
          const username = slugUsername(member.fullName, get().users);
          const password = username;
          const created = get().createUser({
            username,
            email: `${username}@nidhi.local`,
            password,
            role: "MEMBER",
            memberId,
          });
          if (!created.ok) return created;
          get().notifyAccount({
            userId: created.id,
            kind: "LOGIN",
            title: "Portal login issued",
            body: `User ID ${username}. Open Sign in with the password shown to the floor.`,
            href: "/profile",
          });
          log({
            action: "ISSUE_MEMBER_LOGIN",
            module: "users",
            recordType: "User",
            recordId: created.id,
            reason: "",
            oldValue: "",
            newValue: `${username} → ${memberId}`,
          });
          return { ok: true, username, password };
        },

        disableUser: (id) => {
          if (!requirePerm("users.delete")) return deny("You cannot disable users.");
          const target = get().users.find((u) => u.id === id);
          if (!target) return deny("User not found.");
          if (target.role === "SUPER_ADMIN" && currentUser()?.role !== "SUPER_ADMIN") {
            return deny("Cannot disable a Super Admin.");
          }
          if (id === currentUser()?.id) return deny("You cannot disable your own session.");
          set({
            users: get().users.map((u) => (u.id === id ? { ...u, isActive: false } : u)),
          });
          log({
            action: "DISABLE_USER",
            module: "users",
            recordType: "User",
            recordId: id,
            reason: "",
            oldValue: "active",
            newValue: "disabled",
          });
          return { ok: true };
        },

        enableUser: (id) => {
          if (!requirePerm("users.edit")) return deny("You cannot enable users.");
          set({
            users: get().users.map((u) => (u.id === id ? { ...u, isActive: true, failedLoginCount: 0, lockedUntil: null } : u)),
          });
          return { ok: true };
        },

        changeRole: (id, role) => {
          if (!requirePerm("users.assign_roles")) return deny("You cannot change roles.");
          if (role === "SUPER_ADMIN" && !hasPermission("users.assign_superadmin")) {
            return deny("Only Super Admin can grant the Super Admin role.");
          }
          const target = get().users.find((u) => u.id === id);
          if (!target) return deny("User not found.");
          if (target.role === "SUPER_ADMIN" && currentUser()?.role !== "SUPER_ADMIN") {
            return deny("Only Super Admin can change a Super Admin's role.");
          }
          set({ users: get().users.map((u) => (u.id === id ? { ...u, role } : u)) });
          log({
            action: "CHANGE_ROLE",
            module: "users",
            recordType: "User",
            recordId: id,
            reason: "",
            oldValue: target.role,
            newValue: role,
          });
          return { ok: true };
        },

        setOverride: (userId, permissionCode, grant, reason) => {
          if (!requirePerm("users.manage_permissions")) return deny("You cannot manage permissions.");
          if (!reason.trim()) return deny("A reason is required.");
          const existing = get().overrides.find(
            (o) => o.userId === userId && o.permissionCode === permissionCode,
          );
          if (existing) {
            set({
              overrides: get().overrides.map((o) =>
                o.id === existing.id
                  ? { ...o, grant, reason: reason.trim(), grantedBy: currentUser()?.id ?? "", createdAt: nowISO() }
                  : o,
              ),
            });
          } else {
            set({
              overrides: [
                ...get().overrides,
                {
                  id: nextId("ov"),
                  userId,
                  permissionCode,
                  grant,
                  reason: reason.trim(),
                  grantedBy: currentUser()?.id ?? "",
                  createdAt: nowISO(),
                },
              ],
            });
          }
          log({
            action: "SET_USER_PERMISSION",
            module: "users",
            recordType: "User",
            recordId: userId,
            reason: reason.trim(),
            oldValue: "",
            newValue: `${permissionCode}=${grant}`,
          });
          return { ok: true };
        },

        setRolePermissions: (role, codes) => {
          if (currentUser()?.role !== "SUPER_ADMIN") return deny("Only Super Admin can edit role defaults.");
          if (role === "SUPER_ADMIN") return deny("Super Admin's permission set cannot be reduced.");
          ROLE_DEFAULTS[role] = [...codes];
          set({
            rolePerms: { ...get().rolePerms, [role]: [...codes] },
          });
          log({
            action: "UPDATE_ROLE_PERMISSIONS",
            module: "roles",
            recordType: "Role",
            recordId: role,
            reason: "",
            oldValue: "",
            newValue: codes.join(","),
          });
          set({ seq: { ...get().seq } });
          return { ok: true };
        },

        toggleModule: (key, enabled) => {
          if (!requirePerm("developer.modules")) return deny("You cannot toggle modules.");
          if (key === "developer_console" && !enabled && currentUser()?.role !== "SUPER_ADMIN") {
            return deny("Only Super Admin may disable the Developer Console.");
          }
          set({ modules: { ...get().modules, [key]: enabled } });
          log({
            action: "TOGGLE_MODULE",
            module: "developer",
            recordType: "ModuleSetting",
            recordId: key,
            reason: "",
            oldValue: String(!enabled),
            newValue: String(enabled),
          });
          return { ok: true };
        },

        updateSettings: (patch) => {
          set({ settings: { ...get().settings, ...patch } });
          log({
            action: "UPDATE_WEBSITE_SETTINGS",
            module: "developer",
            recordType: "SystemSetting",
            recordId: "settings",
            reason: "",
            oldValue: "",
            newValue: Object.keys(patch).join(","),
          });
        },

        updateWorkflow: (key, json) => {
          try {
            JSON.parse(json);
          } catch {
            return deny("Config must be valid JSON.");
          }
          set({ workflows: { ...get().workflows, [key]: json } });
          return { ok: true };
        },

        addCustomField: (data) => {
          const allowed = new Set(["text", "number", "date", "select", "checkbox", "textarea", "email", "phone"]);
          if (!allowed.has(data.fieldType)) return deny("Unsupported field type.");
          set({
            customFields: [
              ...get().customFields,
              {
                id: nextId("cf"),
                formKey: data.formKey,
                fieldName: data.fieldName,
                label: data.label,
                fieldType: data.fieldType,
                required: data.required,
                visible: true,
                orderIndex: get().customFields.length,
                helpText: data.helpText,
              },
            ],
          });
          return { ok: true };
        },

        addMenuItem: (data) => {
          set({
            menuItems: [
              ...get().menuItems,
              {
                id: nextId("mi"),
                label: data.label,
                url: data.url,
                icon: data.icon,
                orderIndex: get().menuItems.length,
                requiredPermission: data.requiredPermission,
                visible: true,
              },
            ],
          });
        },

        createApiClient: (name, scopes) => {
          if (!requirePerm("developer.api")) return deny("You cannot manage API clients.");
          const suffix = Math.random().toString(16).slice(2, 6);
          set({
            apiClients: [
              ...get().apiClients,
              {
                id: nextId("ac"),
                name,
                clientId: `cli_${suffix}`,
                secretMasked: `••••••••${suffix}`,
                scopes,
                isActive: true,
                rateLimitPerMinute: 60,
                createdAt: nowISO(),
                revokedAt: null,
              },
            ],
          });
          return { ok: true };
        },

        revokeApiClient: (id) => {
          set({
            apiClients: get().apiClients.map((c) =>
              c.id === id ? { ...c, isActive: false, revokedAt: nowISO() } : c,
            ),
          });
        },

        setSmsDeviceStatus: (id, status) => {
          set({
            smsDevices: get().smsDevices.map((d) => (d.id === id ? { ...d, status } : d)),
          });
        },

        mockBankSync: () => {
          const fetched = 1;
          set({
            systemLogs: [
              {
                id: nextId("sl"),
                level: "INFO",
                source: "bank",
                message: "Mock bank sync completed.",
                timestamp: nowISO(),
              },
              ...get().systemLogs,
            ],
            bankConnections: get().bankConnections.map((c) => ({
              ...c,
              lastSyncAt: nowISO(),
            })),
          });
          return { ok: true, fetched };
        },

        requestDangerousAction: (actionType, reason, payload) => {
          if (!reason.trim()) return deny("A reason is required.");
          const id = nextId("da");
          set({
            actions: [
              {
                id,
                requestedBy: currentUser()?.id ?? "",
                actionType,
                payload,
                reason: reason.trim(),
                status: "PENDING",
                approvedBy: null,
                createdAt: nowISO(),
                decidedAt: null,
              },
              ...get().actions,
            ],
          });
          log({
            action: "REQUEST_DANGEROUS_ACTION",
            module: "developer",
            recordType: "DeveloperAction",
            recordId: id,
            reason: reason.trim(),
            oldValue: "",
            newValue: actionType,
          });
          return { ok: true };
        },

        decideAction: (id, approve) => {
          if (currentUser()?.role !== "SUPER_ADMIN") {
            return deny("Only Super Admin can approve dangerous actions.");
          }
          set({
            actions: get().actions.map((a) =>
              a.id === id
                ? {
                    ...a,
                    status: approve ? "APPROVED" : "REJECTED",
                    approvedBy: currentUser()?.id ?? null,
                    decidedAt: nowISO(),
                  }
                : a,
            ),
          });
          log({
            action: approve ? "APPROVE_DANGEROUS_ACTION" : "REJECT_DANGEROUS_ACTION",
            module: "developer",
            recordType: "DeveloperAction",
            recordId: id,
            reason: "",
            oldValue: "PENDING",
            newValue: approve ? "APPROVED" : "REJECTED",
          });
          return { ok: true };
        },

        createBackup: (reason) => {
          if (!requirePerm("developer.backup")) return deny("You cannot create backups.");
          const stamp = todayISO();
          set({
            backups: [
              {
                id: nextId("bk"),
                filename: `nidhi-${stamp}.db`,
                sizeBytes: 400000 + Math.floor(Math.random() * 80000),
                createdBy: currentUser()?.id ?? "",
                createdAt: nowISO(),
                reason: reason || "Manual snapshot",
              },
              ...get().backups,
            ],
          });
          return { ok: true };
        },

        sendReminder: (id) => {
          const reminder = get().reminders.find((r) => r.id === id);
          set({
            reminders: get().reminders.map((r) =>
              r.id === id ? { ...r, status: "SENT", sentAt: nowISO() } : r,
            ),
          });
          if (reminder) {
            const portal = get().users.find((u) => u.memberId === reminder.memberId && u.isActive);
            if (portal) {
              get().notifyAccount({
                userId: portal.id,
                kind: "DUE",
                title: "Collection reminder",
                body: reminder.message,
                href: "/profile",
              });
            }
          }
        },

        queueSms: (data) => {
          const sid = get().settings.twilio_account_sid?.trim();
          const token = get().settings.twilio_auth_token?.trim();
          const from = get().settings.twilio_from_number?.trim();
          const status: OutboundSms["status"] = sid && token && from ? "QUEUED" : "DEMO";
          const id = nextId("sms");
          const row: OutboundSms = {
            id,
            toPhone: data.toPhone,
            memberId: data.memberId ?? null,
            kind: data.kind,
            body: data.body,
            status,
            provider: "twilio",
            otp: data.otp ?? "",
            createdAt: nowISO(),
          };
          set({ smsOutbox: [row, ...(get().smsOutbox ?? [])].slice(0, 200) });
          return { ok: true, id, status, otp: data.otp ?? "" };
        },

        notifyAccount: (data) => {
          const row: AccountAlert = {
            id: nextId("n"),
            userId: data.userId,
            kind: data.kind,
            title: data.title,
            body: data.body,
            href: data.href ?? "/dashboard",
            read: false,
            createdAt: nowISO(),
          };
          set({ alerts: [row, ...(get().alerts ?? [])].slice(0, 300) });
          if (get().sessionUserId === data.userId) fireWebAlert(data.title, data.body);
        },

        markAlertRead: (id) => {
          set({
            alerts: (get().alerts ?? []).map((a) => (a.id === id ? { ...a, read: true } : a)),
          });
        },

        markAllAlertsRead: () => {
          const uid = currentUser()?.id;
          if (!uid) return;
          set({
            alerts: (get().alerts ?? []).map((a) => (a.userId === uid ? { ...a, read: true } : a)),
          });
        },

        requestPasswordReset: (phone, otp) => {
          const d = phone.replace(/\D/g, "").slice(-10);
          if (d.length < 10) return deny("Enter the 10-digit mobile on the member record.");
          if (!/^\d{6}$/.test(otp)) return deny("OTP generator failed. Try again.");
          const member = get().members.find((m) => !m.deletedAt && m.phone.replace(/\D/g, "").slice(-10) === d);
          if (!member) return deny("No subscriber with that mobile.");
          const portal = get().users.find((u) => u.memberId === member.id && u.isActive);
          if (!portal) return deny("No portal login on this mobile yet. Ask the floor to issue one.");
          const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
          const id = nextId("pr");
          set({
            passwordResets: [
              {
                id,
                memberId: member.id,
                phone: member.phone,
                otp,
                expiresAt,
                used: false,
                createdAt: nowISO(),
              },
              ...(get().passwordResets ?? []),
            ].slice(0, 50),
          });
          get().notifyAccount({
            userId: portal.id,
            kind: "OTP",
            title: "Password reset code",
            body: `A 6-digit code was issued for this account. It expires in 10 minutes.`,
            href: "/forgot",
          });
          log({
            action: "PASSWORD_RESET_OTP",
            module: "auth",
            recordType: "Member",
            recordId: member.id,
            reason: "python otp",
            oldValue: "",
            newValue: "in-app",
          });
          return { ok: true, toPhone: member.phone };
        },

        confirmPasswordReset: (phone, otp, newPassword) => {
          if (newPassword.trim().length < 4) return deny("Password must be at least 4 characters.");
          const d = phone.replace(/\D/g, "").slice(-10);
          const reset = (get().passwordResets ?? []).find(
            (r) => !r.used && r.phone.replace(/\D/g, "").slice(-10) === d && r.otp === otp.trim(),
          );
          if (!reset) return deny("Invalid or expired code.");
          if (new Date(reset.expiresAt).getTime() < Date.now()) return deny("That code has expired. Request a new one.");
          const portal = get().users.find((u) => u.memberId === reset.memberId);
          if (!portal) return deny("Portal login not found.");
          set({
            users: get().users.map((u) =>
              u.id === portal.id ? { ...u, password: newPassword.trim(), failedLoginCount: 0, lockedUntil: null } : u,
            ),
            passwordResets: get().passwordResets.map((r) => (r.id === reset.id ? { ...r, used: true } : r)),
          });
          log({
            action: "PASSWORD_RESET",
            module: "auth",
            recordType: "User",
            recordId: portal.id,
            reason: "mobile otp",
            oldValue: "",
            newValue: portal.username,
          });
          return { ok: true };
        },

        setUserPassword: (userId, password) => {
          if (!hasPermission("users.reset_password") && !hasPermission("users.edit")) {
            return deny("You cannot reset passwords.");
          }
          if (password.trim().length < 4) return deny("Password must be at least 4 characters.");
          const target = get().users.find((u) => u.id === userId);
          if (!target) return deny("User not found.");
          set({
            users: get().users.map((u) => (u.id === userId ? { ...u, password: password.trim() } : u)),
          });
          if (target.memberId) {
            get().notifyAccount({
              userId: target.id,
              kind: "LOGIN",
              title: "Password changed by the house",
              body: `Your portal password was reset. User ID ${target.username}.`,
              href: "/profile",
            });
          }
          return { ok: true };
        },

        sendDueReminders: () => {
          if (!requirePerm("reminders.send")) return deny("You cannot send reminders.");
          const overdue = get().installments.filter((i) => i.status === "OVERDUE");
          let sent = 0;
          const seen = new Set<string>();
          for (const inst of overdue) {
            const enr = get().enrollments.find((e) => e.id === inst.memberChitId);
            if (!enr) continue;
            const member = get().members.find((m) => m.id === enr.memberId && !m.deletedAt);
            const scheme = get().schemes.find((s) => s.id === enr.chitSchemeId);
            if (!member) continue;
            const key = `${member.id}:${inst.id}`;
            if (seen.has(key)) continue;
            seen.add(key);
            const portal = get().users.find((u) => u.memberId === member.id && u.isActive);
            if (!portal) continue;
            get().notifyAccount({
              userId: portal.id,
              kind: "DUE",
              title: "Overdue installment",
              body: `Installment #${inst.installmentNumber} on ${scheme?.name ?? "your chit"} is overdue. Please remit ${formatINR(inst.amountDue - inst.amountPaid)}.`,
              href: "/profile",
            });
            sent += 1;
          }
          return { ok: true, sent };
        },

        processSms: (id) => {
          const txn = get().smsTxns.find((t) => t.id === id);
          if (!txn || txn.parsedAmount == null) return deny("Cannot process this SMS.");
          const umId = nextId("um");
          set({
            unmatched: [
              {
                id: umId,
                amount: txn.parsedAmount,
                source: "SMS",
                rawReference: txn.rawText.slice(0, 120),
                receivedAt: nowISO(),
                status: "OPEN",
                resolvedPaymentId: null,
              },
              ...get().unmatched,
            ],
            smsTxns: get().smsTxns.map((t) =>
              t.id === id ? { ...t, parseStatus: "PARSED" } : t,
            ),
          });
          return { ok: true };
        },

        resetDemo: () => {
          const fresh = createSeedState();
          set({ ...fresh, hasHydrated: true, sessionUserId: null });
        },
      };
    },
    {
      name: "nidhi-chit-desk-v3",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      skipHydration: true,
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AppState>;
        return {
          ...current,
          ...p,
          smsOutbox: p.smsOutbox ?? current.smsOutbox ?? [],
          passwordResets: p.passwordResets ?? current.passwordResets ?? [],
          alerts: p.alerts ?? current.alerts ?? [],
          rolePerms: p.rolePerms ?? current.rolePerms,
          settings: { ...current.settings, ...(p.settings ?? {}) },
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (s) => {
        const { hasHydrated: _h, ...rest } = s;
        void _h;
        const omit = new Set([
          "login",
          "loginAs",
          "logout",
          "currentUser",
          "effectivePermissions",
          "hasPermission",
          "moduleEnabled",
          "visibleMembers",
          "nextId",
          "log",
          "createMember",
          "updateMember",
          "softDeleteMember",
          "createScheme",
          "enrollMember",
          "generateInstallments",
          "createPayment",
          "allocatePayment",
          "approvePayment",
          "softDeletePayment",
          "resolveUnmatched",
          "ignoreUnmatched",
          "createUser",
          "issueMemberLogin",
          "disableUser",
          "enableUser",
          "changeRole",
          "setOverride",
          "setRolePermissions",
          "toggleModule",
          "updateSettings",
          "updateWorkflow",
          "addCustomField",
          "addMenuItem",
          "createApiClient",
          "revokeApiClient",
          "setSmsDeviceStatus",
          "mockBankSync",
          "requestDangerousAction",
          "decideAction",
          "createBackup",
          "sendReminder",
          "processSms",
          "queueSms",
          "notifyAccount",
          "markAlertRead",
          "markAllAlertsRead",
          "requestPasswordReset",
          "confirmPasswordReset",
          "setUserPassword",
          "sendDueReminders",
          "resetDemo",
          "setHasHydrated",
        ]);
        const data: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(rest)) {
          if (!omit.has(k) && typeof v !== "function") data[k] = v;
        }
        return data as unknown as AppState;
      },
    },
  ),
);
