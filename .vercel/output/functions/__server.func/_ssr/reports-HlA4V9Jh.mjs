import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { o as useAppStore, u as formatINR } from "./router-5YFTNEBk.mjs";
import { i as CardTitle, r as Card } from "./kit-DQB8BDzZ.mjs";
import { a as PageHeader, c as Td, i as ModuleOff, o as StatCard, r as Forbidden, t as DataTable } from "./desk-D9-W6dAi.mjs";
import { n as useModuleOn, t as useHas } from "./session-MQtsOIYH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-HlA4V9Jh.js
var import_jsx_runtime = require_jsx_runtime();
function ReportsPage() {
	const can = useHas("reports.view");
	const moduleOn = useModuleOn("reports");
	const payments = useAppStore((s) => s.payments).filter((p) => !p.deletedAt);
	const installments = useAppStore((s) => s.installments);
	const members = useAppStore((s) => s.members).filter((m) => !m.deletedAt);
	const schemes = useAppStore((s) => s.schemes);
	const enrollments = useAppStore((s) => s.enrollments);
	if (!can) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forbidden, {});
	if (!moduleOn) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleOff, { name: "reports" });
	const collected = payments.filter((p) => p.status === "APPROVED" || p.status === "ALLOCATED").reduce((s, p) => s + p.amount, 0);
	const pending = payments.filter((p) => p.status === "PENDING").reduce((s, p) => s + p.amount, 0);
	const overdueAmt = installments.filter((i) => i.status === "OVERDUE").reduce((s, i) => s + (i.amountDue - i.amountPaid), 0);
	const bySource = ["MANUAL", "BANK"].map((src) => ({
		name: src,
		value: payments.filter((p) => p.source === src).reduce((s, p) => s + p.amount, 0)
	}));
	const sourceMax = Math.max(1, ...bySource.map((s) => s.value));
	const byScheme = schemes.map((s) => {
		const enr = enrollments.filter((e) => e.chitSchemeId === s.id);
		const inst = installments.filter((i) => enr.some((e) => e.id === i.memberChitId));
		const due = inst.reduce((a, i) => a + i.amountDue, 0);
		const paid = inst.reduce((a, i) => a + i.amountPaid, 0);
		return {
			name: s.name,
			enrolled: enr.length,
			due,
			paid,
			gap: due - paid
		};
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "enter",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "Books",
				title: "Reports",
				description: "Collection mix, overdue aging, and scheme fill. Export is a later cut — the numbers here are live."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Booked",
						value: formatINR(collected)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Pending receipts",
						value: formatINR(pending)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Overdue outstanding",
						value: formatINR(overdueAmt)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Subscribers",
						value: members.length
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "mb-4",
						children: "Source mix"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "flex flex-col gap-3",
						children: bySource.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1 flex justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: formatINR(s.value)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-2 overflow-hidden rounded-full bg-surface-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-primary",
								style: { width: `${s.value / sourceMax * 100}%` }
							})
						})] }, s.name))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
						headers: [
							"Scheme",
							"Enrolled",
							"Due",
							"Collected",
							"Gap"
						],
						children: byScheme.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
								className: "font-medium",
								children: r.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
								className: "tabular-nums",
								children: r.enrolled
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
								className: "tabular-nums",
								children: formatINR(r.due)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
								className: "tabular-nums",
								children: formatINR(r.paid)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
								className: "tabular-nums",
								children: formatINR(r.gap)
							})
						] }, r.name))
					})
				})]
			})
		]
	});
}
//#endregion
export { ReportsPage as component };
