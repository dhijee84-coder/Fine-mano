import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { f as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as formatDate, o as useAppStore, u as formatINR } from "./router-5YFTNEBk.mjs";
import { n as Button } from "./kit-DQB8BDzZ.mjs";
import { a as PageHeader, c as Td, i as ModuleOff, r as Forbidden, s as StatusBadge, t as DataTable } from "./desk-D9-W6dAi.mjs";
import { n as useModuleOn, t as useHas } from "./session-MQtsOIYH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chits-ZU6h-AwV.js
var import_jsx_runtime = require_jsx_runtime();
function ChitsPage() {
	const canView = useHas("chits.view");
	const canCreate = useHas("chits.create");
	const canGen = useHas("installments.generate");
	const moduleOn = useModuleOn("chit_management");
	const schemes = useAppStore((s) => s.schemes);
	const enrollments = useAppStore((s) => s.enrollments);
	const installments = useAppStore((s) => s.installments);
	const generate = useAppStore((s) => s.generateInstallments);
	if (!canView) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forbidden, { reason: "chits.view is required." });
	if (!moduleOn) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleOff, { name: "chit management" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "enter",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Schemes",
			title: "Chit schemes",
			description: "Foreman book of live chits. Harvest 3L is enrolled but has no installment schedule yet — generate it to watch the operation.",
			actions: canCreate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/chits/new",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "New scheme"]
				})
			}) : null
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
			headers: [
				"Scheme",
				"Corpus",
				"Installment",
				"Tenure",
				"Enrolled",
				"Schedule",
				"Status",
				""
			],
			children: schemes.map((s) => {
				const enrolled = enrollments.filter((e) => e.chitSchemeId === s.id);
				const inst = installments.filter((i) => enrolled.some((e) => e.id === i.memberChitId));
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "hover:bg-surface-2/60",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, {
							className: "font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/chits/$schemeId",
								params: { schemeId: s.id },
								className: "hover:text-primary",
								children: s.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted",
								children: ["Starts ", formatDate(s.startDate)]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "tabular-nums",
							children: formatINR(s.totalAmount)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "tabular-nums",
							children: formatINR(s.installmentAmount)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, { children: [s.durationMonths, " mo"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "tabular-nums",
							children: enrolled.length
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "tabular-nums",
							children: inst.length
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: s.status }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/chits/$schemeId",
								params: { schemeId: s.id },
								className: "text-sm text-primary",
								children: "Open"
							}), canGen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-sm text-muted hover:text-ink",
								onClick: () => {
									const res = generate(s.id);
									if (!res.ok) toast.error(res.error);
									else toast.success(res.created ? `${res.created} installments generated.` : "Schedule already complete.");
								},
								children: "Generate"
							}) : null]
						}) })
					]
				}, s.id);
			})
		})]
	});
}
//#endregion
export { ChitsPage as component };
