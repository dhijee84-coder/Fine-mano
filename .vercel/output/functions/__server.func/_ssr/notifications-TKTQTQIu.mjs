import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { l as formatDateTime, o as useAppStore } from "./router-5YFTNEBk.mjs";
import { n as Button, r as Card } from "./kit-DQB8BDzZ.mjs";
import { a as PageHeader, n as EmptyState, s as StatusBadge } from "./desk-D9-W6dAi.mjs";
import { r as useSessionUser } from "./session-MQtsOIYH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-TKTQTQIu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AlertsPage() {
	const user = useSessionUser();
	const raw = useAppStore((s) => s.alerts);
	const mark = useAppStore((s) => s.markAlertRead);
	const markAll = useAppStore((s) => s.markAllAlertsRead);
	const alerts = (0, import_react.useMemo)(() => (raw ?? []).filter((a) => a.userId === user?.id), [raw, user?.id]);
	const unread = alerts.filter((a) => !a.read).length;
	async function enableWeb() {
		if (typeof Notification === "undefined") {
			toast.error("This browser does not support web alerts.");
			return;
		}
		if (await Notification.requestPermission() === "granted") toast.success("Web alerts on for this browser.");
		else toast.error("Permission denied — in-app alerts still work.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "enter",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Alerts",
			title: "Your notifications",
			description: "In-app and optional web alerts for this account. No SMS cost — each desk sees only its own feed.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: enableWeb,
					children: "Enable web alerts"
				}), unread > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => markAll(),
					children: "Mark all read"
				}) : null]
			})
		}), alerts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No alerts yet",
			description: "Payments, dues, and password resets will land here."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex flex-col gap-2",
			children: alerts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: a.read ? "opacity-70" : "",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: a.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: a.body
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-faint",
							children: formatDateTime(a.createdAt)
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: a.kind }),
							!a.read ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-sm text-primary",
								onClick: () => mark(a.id),
								children: "Read"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: a.href,
								className: "text-sm text-primary",
								children: "Open"
							})
						]
					})]
				})
			}) }, a.id))
		})]
	});
}
//#endregion
export { AlertsPage as component };
