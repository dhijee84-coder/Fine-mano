import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { A as Activity, E as Boxes, O as Bell, S as Database, d as ScrollText, f as RectangleEllipsis, m as Menu, o as Smartphone, s as Skull, u as Settings, v as Landmark, x as GitBranch, y as KeyRound } from "../_libs/lucide-react.mjs";
import { l as formatDateTime, m as MODULE_LABELS, o as useAppStore } from "./router-CzIu6ndy.mjs";
import { t as PageHeader } from "./page-header-BcO8feB4.mjs";
import { i as useModuleOn, r as useHas } from "./session-BhtPFwO2.mjs";
import { t as StatusBadge } from "./status-badge-BwE5ze5p.mjs";
import { n as ModuleOff, t as Forbidden } from "./forbidden-Ctx_Cupf.mjs";
import { t as Card } from "./card-Dh0onazs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/developer-BJ1UBg4N.js
var import_jsx_runtime = require_jsx_runtime();
var LINKS = [
	{
		to: "/developer/modules",
		label: "Modules",
		hint: "Enable / disable route access",
		icon: Boxes
	},
	{
		to: "/developer/settings",
		label: "Website settings",
		hint: "Name, locale, company",
		icon: Settings
	},
	{
		to: "/developer/forms",
		label: "Form builder",
		hint: "Data-only custom fields",
		icon: RectangleEllipsis
	},
	{
		to: "/developer/menu",
		label: "Menu builder",
		hint: "Nav items + required permission",
		icon: Menu
	},
	{
		to: "/developer/workflows",
		label: "Workflows",
		hint: "JSON config, no code exec",
		icon: GitBranch
	},
	{
		to: "/developer/api",
		label: "API clients",
		hint: "Secrets always masked",
		icon: KeyRound
	},
	{
		to: "/developer/sms",
		label: "SMS devices",
		hint: "Collector approval",
		icon: Smartphone
	},
	{
		to: "/developer/bank",
		label: "Bank providers",
		hint: "Mock adapter until live creds",
		icon: Landmark
	},
	{
		to: "/developer/database",
		label: "Database inspector",
		hint: "Allow-listed tables only",
		icon: Database
	},
	{
		to: "/developer/actions",
		label: "Dangerous actions",
		hint: "Needs Super Admin approval",
		icon: Skull
	},
	{
		to: "/developer/monitoring",
		label: "Monitoring",
		hint: "Logs and backups",
		icon: Activity
	},
	{
		to: "/developer/notifications",
		label: "Notifications",
		hint: "Reminder queue",
		icon: Bell
	}
];
function DevOverview() {
	const can = useHas("developer.view");
	const moduleOn = useModuleOn("developer_console");
	const modules = useAppStore((s) => s.modules);
	const errors = useAppStore((s) => s.systemLogs).filter((l) => l.level === "ERROR").slice(0, 8);
	const pending = useAppStore((s) => s.actions).filter((a) => a.status === "PENDING").length;
	if (!can) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forbidden, { reason: "developer.view is required." });
	if (!moduleOn) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleOff, { name: "developer console" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "enter",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "Developer console",
				title: "Overview",
				description: "Technical controls. Disabling a module blocks its routes, not just the menu. Financial records stay off-limits unless Super Admin grants developer.financial_access."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: LINKS.map((l) => {
					const Icon = l.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/developer/$section",
						params: { section: l.to.replace("/developer/", "") },
						className: "flex items-start gap-3 rounded-xl bg-surface p-4 hairline transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-card-hover)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex size-9 items-center justify-center rounded-md bg-surface-2 text-ink-soft",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block text-sm font-medium",
							children: [l.label, l.to === "/developer/actions" && pending > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-2 text-xs text-warn",
								children: [
									"(",
									pending,
									" pending)"
								]
							}) : null]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 block text-xs text-muted",
							children: l.hint
						})] })]
					}, l.to);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display mb-3 text-lg",
					children: "Module status"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid grid-cols-1 gap-1.5 sm:grid-cols-2",
					children: Object.keys(modules).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: MODULE_LABELS[k] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: modules[k] ? "ENABLED" : "DISABLED" })]
					}, k))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display mb-3 text-lg",
						children: "Recent errors"
					}),
					errors.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "No recent errors logged."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2 text-sm",
						children: errors.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: formatDateTime(e.timestamp)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2 font-mono text-xs",
								children: e.source
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: e.message })
						] }, e.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/developer/$section",
						params: { section: "monitoring" },
						className: "mt-3 inline-flex items-center gap-1 text-sm text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollText, { className: "size-4" }), "Full log"]
					})
				] })]
			})
		]
	});
}
//#endregion
export { DevOverview as component };
