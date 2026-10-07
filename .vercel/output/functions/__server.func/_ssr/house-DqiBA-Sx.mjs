import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as useAppStore, p as ADMIN_SCREENS, u as formatINR, v as ROLE_DEFAULTS } from "./router-5YFTNEBk.mjs";
import { i as CardTitle, n as Button, r as Card } from "./kit-DQB8BDzZ.mjs";
import { a as PageHeader, c as Td, r as Forbidden, s as StatusBadge, t as DataTable } from "./desk-D9-W6dAi.mjs";
import { r as useSessionUser } from "./session-MQtsOIYH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/house-DqiBA-Sx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HousePage() {
	if (useSessionUser()?.role !== "SUPER_ADMIN") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forbidden, { reason: "Only Super Admin can open the house book." });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "enter flex flex-col gap-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "House",
				title: "Book and Admin view",
				description: "Every table, the matrix that decides what Admin sees, and in-app alerts — no SMS bill."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertActions, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminMatrix, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookTables, {})
		]
	});
}
function AlertActions() {
	const sendDue = useAppStore((s) => s.sendDueReminders);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "mb-1",
			children: "In-app alerts"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 text-sm text-muted",
			children: "Each account has its own notification feed (bell). Web alerts are optional in the browser. Cheaper and faster than SMS."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "button",
			onClick: () => {
				const res = sendDue();
				if (!res.ok) toast.error(res.error);
				else toast.success(`${res.sent} overdue alerts posted to member accounts.`);
			},
			children: "Notify overdue"
		})
	] });
}
function AdminMatrix() {
	const rolePerms = useAppStore((s) => s.rolePerms);
	const setRolePermissions = useAppStore((s) => s.setRolePermissions);
	const adminCodes = (0, import_react.useMemo)(() => new Set(rolePerms.ADMIN ?? ROLE_DEFAULTS.ADMIN), [rolePerms]);
	function screenOn(codes) {
		return codes.every((c) => adminCodes.has(c));
	}
	function toggle(codes, on) {
		const next = new Set(adminCodes);
		for (const c of codes) if (on) next.add(c);
		else next.delete(c);
		const res = setRolePermissions("ADMIN", [...next]);
		if (!res.ok) toast.error(res.error);
		else toast.success("Admin view updated.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display mb-2 text-xl",
			children: "What Admin can see"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-3 text-sm text-muted",
			children: "Turn a row off and that screen, column, or action disappears from the Admin desk. Super Admin always sees everything."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
			headers: [
				"Screen",
				"What it controls",
				"Admin"
			],
			children: ADMIN_SCREENS.map((s) => {
				const on = screenOn(s.codes);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "font-medium",
						children: s.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "text-muted",
						children: s.hint
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex h-11 items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: on,
							onChange: () => toggle(s.codes, !on)
						}), on ? "On" : "Off"]
					}) })
				] }, s.key);
			})
		})
	] });
}
function BookTables() {
	const members = useAppStore((s) => s.members);
	const users = useAppStore((s) => s.users);
	const schemes = useAppStore((s) => s.schemes);
	const payments = useAppStore((s) => s.payments);
	const enrollments = useAppStore((s) => s.enrollments);
	const [tab, setTab] = (0, import_react.useState)("members");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display mb-2 text-xl",
			children: "Entire book"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-3 text-sm text-muted",
			children: "Super Admin read of every row. Member passwords are here so you can issue or check portal logins."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-3 flex flex-wrap gap-2",
			children: [
				["members", "Members"],
				["users", "Users"],
				["schemes", "Schemes"],
				["payments", "Payments"]
			].map(([k, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: tab === k ? "default" : "outline",
				onClick: () => setTab(k),
				children: label
			}, k))
		}),
		tab === "members" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
			headers: [
				"Name",
				"Phone",
				"City",
				"User ID",
				"Password"
			],
			children: members.filter((m) => !m.deletedAt).map((m) => {
				const u = users.find((x) => x.memberId === m.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "font-medium",
						children: m.fullName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "font-mono text-xs",
						children: m.phone
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "text-muted",
						children: m.city
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "font-mono text-xs",
						children: u?.username ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "font-mono text-xs",
						children: u?.password ?? "no login"
					})
				] }, m.id);
			})
		}) : null,
		tab === "users" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
			headers: [
				"User ID",
				"Password",
				"Role",
				"Active"
			],
			children: users.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "font-mono text-sm",
					children: u.username
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "font-mono text-xs",
					children: u.password
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: u.role }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: u.isActive ? "ACTIVE" : "DISABLED" }) })
			] }, u.id))
		}) : null,
		tab === "schemes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
			headers: [
				"Scheme",
				"Corpus",
				"Enrolled",
				"Status"
			],
			children: schemes.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "font-medium",
					children: s.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "tabular-nums",
					children: formatINR(s.totalAmount)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "tabular-nums",
					children: enrollments.filter((e) => e.chitSchemeId === s.id).length
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: s.status }) })
			] }, s.id))
		}) : null,
		tab === "payments" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
			headers: [
				"Amount",
				"Source",
				"Status",
				"Member"
			],
			children: payments.filter((p) => !p.deletedAt).slice(0, 40).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "tabular-nums",
					children: formatINR(p.amount)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: p.source }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: p.status }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: members.find((m) => m.id === p.memberId)?.fullName ?? p.memberId })
			] }, p.id))
		}) : null
	] });
}
//#endregion
export { HousePage as component };
