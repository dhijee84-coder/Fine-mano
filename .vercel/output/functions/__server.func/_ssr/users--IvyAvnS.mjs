import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { f as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as formatDate, o as useAppStore, y as ROLE_LABELS } from "./router-5YFTNEBk.mjs";
import { n as Button } from "./kit-DQB8BDzZ.mjs";
import { a as PageHeader, c as Td, r as Forbidden, s as StatusBadge, t as DataTable } from "./desk-D9-W6dAi.mjs";
import { r as useSessionUser, t as useHas } from "./session-MQtsOIYH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/users--IvyAvnS.js
var import_jsx_runtime = require_jsx_runtime();
function UsersPage() {
	const canView = useHas("users.view");
	const canCreate = useHas("users.create");
	const canDisable = useHas("users.delete");
	const house = useSessionUser()?.role === "SUPER_ADMIN";
	const users = useAppStore((s) => s.users);
	const members = useAppStore((s) => s.members);
	const disableUser = useAppStore((s) => s.disableUser);
	const enableUser = useAppStore((s) => s.enableUser);
	if (!canView) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forbidden, { reason: "users.view is required." });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "enter",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Access",
			title: "Users",
			description: house ? "House, floor, and member portal logins." : canCreate ? "Add a floor Admin or a member portal login. Super Admin cannot be added from this desk." : "Desk logins.",
			actions: canCreate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/users/new",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), house ? "New login" : "Add Admin or Member"]
				})
			}) : null
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
			headers: [
				"Username",
				"Email",
				"Role",
				"Subscriber",
				"Status",
				"Since",
				""
			],
			children: users.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "font-medium",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/users/$userId",
						params: { userId: u.id },
						className: "hover:text-primary",
						children: u.username
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "text-muted",
					children: u.email
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: ROLE_LABELS[u.role] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "text-muted",
					children: u.memberId ? members.find((m) => m.id === u.memberId)?.fullName ?? u.memberId : "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: u.isActive ? "ACTIVE" : "DISABLED" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "text-muted",
					children: formatDate(u.createdAt)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/users/$userId",
							params: { userId: u.id },
							className: "text-sm text-primary",
							children: "Open"
						}),
						canDisable && u.isActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-sm text-danger",
							onClick: () => {
								const res = disableUser(u.id);
								if (!res.ok) toast.error(res.error);
								else toast.success("Disabled.");
							},
							children: "Disable"
						}) : null,
						canDisable && !u.isActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-sm text-primary",
							onClick: () => enableUser(u.id),
							children: "Enable"
						}) : null
					]
				}) })
			] }, u.id))
		})]
	});
}
//#endregion
export { UsersPage as component };
