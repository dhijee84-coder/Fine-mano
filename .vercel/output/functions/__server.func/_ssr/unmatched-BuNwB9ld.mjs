import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { l as formatDateTime, o as useAppStore, u as formatINR } from "./router-CzIu6ndy.mjs";
import { t as PageHeader } from "./page-header-BcO8feB4.mjs";
import { i as useModuleOn, r as useHas, t as Button } from "./session-BhtPFwO2.mjs";
import { n as Td, t as DataTable } from "./data-table-uQ5ostzh.mjs";
import { t as StatusBadge } from "./status-badge-BwE5ze5p.mjs";
import { n as ModuleOff, t as Forbidden } from "./forbidden-Ctx_Cupf.mjs";
import { n as Select, t as Field } from "./field-CuxoslU4.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-CKMFVqYj.mjs";
import { t as EmptyState } from "./empty-state-DiqQB2zi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/unmatched-BuNwB9ld.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function UnmatchedPage() {
	const canView = useHas("payments.view");
	const moduleOn = useModuleOn("payments");
	const items = useAppStore((s) => s.unmatched);
	const members = useAppStore((s) => s.members).filter((m) => !m.deletedAt);
	const resolve = useAppStore((s) => s.resolveUnmatched);
	const ignore = useAppStore((s) => s.ignoreUnmatched);
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const [memberId, setMemberId] = (0, import_react.useState)("");
	if (!canView) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forbidden, {});
	if (!moduleOn) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleOff, { name: "payments" });
	const open = items.filter((i) => i.status === "OPEN");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "enter",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "Reconciliation",
				title: "Unmatched receipts",
				description: "SMS and bank credits that could not be matched to a subscriber. Resolve by attaching a member, or ignore."
			}),
			open.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "Queue is clear",
				description: "No open unmatched receipts."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				headers: [
					"Received",
					"Amount",
					"Source",
					"Raw reference",
					""
				],
				children: open.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "text-muted whitespace-nowrap",
						children: formatDateTime(u.receivedAt)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "tabular-nums",
						children: formatINR(u.amount)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: u.source }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "max-w-xs text-xs text-muted",
						children: u.rawReference
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-sm text-primary",
							onClick: () => setOpenId(u.id),
							children: "Match"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-sm text-muted",
							onClick: () => {
								ignore(u.id);
								toast.success("Ignored.");
							},
							children: "Ignore"
						})]
					}) })
				] }, u.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!openId,
				onOpenChange: (o) => !o && setOpenId(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					title: "Match to member",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "flex flex-col gap-3",
						onSubmit: (e) => {
							e.preventDefault();
							if (!openId) return;
							const res = resolve(openId, memberId);
							if (!res.ok) toast.error(res.error);
							else {
								toast.success("Created a pending payment on that member.");
								setOpenId(null);
							}
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Member",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: memberId,
								onChange: (e) => setMemberId(e.target.value),
								required: true,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Select…"
								}), members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: m.id,
									children: m.fullName
								}, m.id))]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "Create payment"
						})]
					})
				})
			})
		]
	});
}
//#endregion
export { UnmatchedPage as component };
