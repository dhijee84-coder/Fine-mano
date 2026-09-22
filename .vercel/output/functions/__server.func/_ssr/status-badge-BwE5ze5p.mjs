import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Badge } from "./badge-Cpi4ltG3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-badge-BwE5ze5p.js
var import_jsx_runtime = require_jsx_runtime();
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
	SMS: "primary",
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
//#endregion
export { StatusBadge as t };
