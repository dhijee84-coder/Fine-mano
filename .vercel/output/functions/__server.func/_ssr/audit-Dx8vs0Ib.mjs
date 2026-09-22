import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { l as formatDateTime, o as useAppStore, v as ROLE_LABELS } from "./router-CzIu6ndy.mjs";
import { t as PageHeader } from "./page-header-BcO8feB4.mjs";
import { i as useModuleOn, r as useHas } from "./session-BhtPFwO2.mjs";
import { n as Td, t as DataTable } from "./data-table-uQ5ostzh.mjs";
import { t as StatusBadge } from "./status-badge-BwE5ze5p.mjs";
import { n as ModuleOff, t as Forbidden } from "./forbidden-Ctx_Cupf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/audit-Dx8vs0Ib.js
var import_jsx_runtime = require_jsx_runtime();
function AuditPage() {
	const can = useHas("audit.view");
	const moduleOn = useModuleOn("audit_logs");
	const audit = useAppStore((s) => s.audit);
	const users = useAppStore((s) => s.users);
	if (!can) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forbidden, { reason: "audit.view is required." });
	if (!moduleOn) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleOff, { name: "audit logs" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "enter",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Security",
			title: "Audit log",
			description: "Append-only. There is no edit or delete path — including for Super Admin."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
			headers: [
				"When",
				"Who",
				"Action",
				"Record",
				"Result",
				"Reason"
			],
			children: audit.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "whitespace-nowrap text-muted",
					children: formatDateTime(a.timestamp)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: users.find((u) => u.id === a.userId)?.username ?? "—" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] text-muted",
					children: a.roleName ? ROLE_LABELS[a.roleName] : ""
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "font-mono text-xs",
					children: a.action
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, {
					className: "text-xs text-muted",
					children: [
						a.recordType,
						" ",
						a.recordId
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: a.result }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "max-w-[220px] truncate text-xs text-muted",
					children: a.reason || a.newValue || "—"
				})
			] }, a.id))
		})]
	});
}
//#endregion
export { AuditPage as component };
