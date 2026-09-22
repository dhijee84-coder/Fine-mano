import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as cn } from "./session-BhtPFwO2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-Cpi4ltG3.js
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase", {
	variants: { tone: {
		default: "bg-surface-2 text-ink-soft",
		navy: "bg-navy text-navy-fg",
		primary: "bg-info-bg text-primary",
		success: "bg-success-bg text-success",
		warn: "bg-warn-bg text-warn",
		danger: "bg-danger-bg text-danger"
	} },
	defaultVariants: { tone: "default" }
});
function Badge({ className, tone, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ tone }), className),
		...props
	});
}
//#endregion
export { Badge as t };
