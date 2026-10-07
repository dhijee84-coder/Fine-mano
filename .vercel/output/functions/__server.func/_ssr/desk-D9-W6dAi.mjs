import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as ShieldOff } from "../_libs/lucide-react.mjs";
import { f as cn, n as Button, t as Badge } from "./kit-DQB8BDzZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/desk-D9-W6dAi.js
var import_jsx_runtime = require_jsx_runtime();
function PageHeader({ kicker, title, description, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [
				kicker ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1 text-[11px] font-medium tracking-[0.16em] text-muted uppercase",
					children: kicker
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl",
					children: title
				}),
				description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 max-w-2xl text-sm text-muted",
					children: description
				}) : null
			]
		}), actions ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap items-center gap-2",
			children: actions
		}) : null]
	});
}
function StatCard({ label, value, hint, icon, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-xl bg-surface p-4 hairline sm:p-5", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium tracking-[0.14em] text-muted uppercase",
					children: label
				}), icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-faint",
					children: icon
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-display text-2xl font-medium tracking-tight tabular-nums text-ink sm:text-3xl",
				children: value
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted",
				children: hint
			}) : null
		]
	});
}
function EmptyState({ title, description, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-surface px-6 py-14 text-center hairline",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-xl text-ink",
				children: title
			}),
			description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-2 max-w-md text-sm text-muted",
				children: description
			}) : null,
			action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5",
				children: action
			}) : null
		]
	});
}
var TONE = {
	ACTIVE: "success",
	PAID: "success",
	APPROVED: "success",
	ALLOCATED: "primary",
	SENT: "success",
	MATCHED: "success",
	RESOLVED: "success",
	ENABLED: "success",
	PENDING: "warn",
	PARTIAL: "warn",
	OPEN: "warn",
	DRAFT: "default",
	OVERDUE: "danger",
	REVERSED: "danger",
	FAILED: "danger",
	DENIED: "danger",
	DISABLED: "danger",
	CLOSED: "default",
	IGNORED: "default",
	DEFAULTED: "danger",
	EXECUTED: "success",
	REJECTED: "danger",
	PARSED: "success",
	UNMATCHED: "warn",
	MANUAL: "default",
	BANK: "navy",
	SUCCESS: "success",
	ERROR: "danger",
	WARNING: "warn",
	INFO: "primary"
};
function StatusBadge({ value }) {
	const tone = TONE[value] ?? "default";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone,
		children: value.replace(/_/g, " ")
	});
}
function DataTable({ headers, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("min-w-0 overflow-x-auto rounded-xl bg-surface hairline", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-[640px] border-collapse text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
				className: "border-b border-line text-left",
				children: headers.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "px-4 py-3 text-[11px] font-medium tracking-[0.12em] text-muted uppercase",
					children: h
				}, i))
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
				className: "divide-y divide-line",
				children
			})]
		})
	});
}
function Td({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
		className: cn("px-4 py-3 align-middle text-ink", className),
		children
	});
}
function Forbidden({ reason = "You do not have permission to open this page." }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldOff, { className: "mx-auto mb-4 size-8 text-danger" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Access denied"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: reason
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/dashboard",
					children: "Back to dashboard"
				})
			})
		]
	});
}
function ModuleOff({ name }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Module disabled"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: [
					"The ",
					name,
					" module is switched off in the Developer Console. Super Admin can re-enable it under Modules."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-6",
				variant: "outline",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/dashboard",
					children: "Back to dashboard"
				})
			})
		]
	});
}
//#endregion
export { PageHeader as a, Td as c, ModuleOff as i, EmptyState as n, StatCard as o, Forbidden as r, StatusBadge as s, DataTable as t };
