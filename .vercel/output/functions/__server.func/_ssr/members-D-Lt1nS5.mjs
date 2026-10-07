import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { f as Plus } from "../_libs/lucide-react.mjs";
import { c as formatDate, o as useAppStore } from "./router-5YFTNEBk.mjs";
import { n as Button } from "./kit-DQB8BDzZ.mjs";
import { a as PageHeader, c as Td, i as ModuleOff, n as EmptyState, r as Forbidden, s as StatusBadge, t as DataTable } from "./desk-D9-W6dAi.mjs";
import { i as useVisibleMembers, n as useModuleOn, t as useHas } from "./session-MQtsOIYH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/members-D-Lt1nS5.js
var import_jsx_runtime = require_jsx_runtime();
function MembersPage() {
	const canView = useHas("members.view");
	const canCreate = useHas("members.create");
	const moduleOn = useModuleOn("member_management");
	const members = useVisibleMembers();
	const users = useAppStore((s) => s.users);
	const canPasswords = useHas("members.view_passwords");
	if (!canView) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forbidden, { reason: "members.view is required." });
	if (!moduleOn) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleOff, { name: "member management" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "enter",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Subscribers",
			title: "Members",
			description: "Every subscriber on the books. Soft-delete keeps financial history.",
			actions: canCreate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/members/new",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "New member"]
				})
			}) : null
		}), members.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No members in this view",
			description: "Create the first member.",
			action: canCreate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/members/new",
					children: "New member"
				})
			}) : null
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
			headers: canPasswords ? [
				"Name",
				"Phone",
				"City",
				"User ID",
				"Password",
				""
			] : [
				"Name",
				"Phone",
				"City",
				"Staff",
				"Since",
				""
			],
			children: members.map((m) => {
				const portal = users.find((u) => u.memberId === m.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "hover:bg-surface-2/60",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, {
							className: "font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/members/$memberId",
								params: { memberId: m.id },
								className: "hover:text-primary",
								children: m.fullName
							}), !m.isActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: "DISABLED" })
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "font-mono text-xs",
							children: m.phone
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "text-muted",
							children: m.city
						}),
						canPasswords ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "font-mono text-xs",
							children: portal?.username ?? "—"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "font-mono text-xs",
							children: portal?.password ?? "no login"
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "text-muted",
							children: users.find((u) => u.id === m.assignedStaffId)?.username ?? "—"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "text-muted",
							children: formatDate(m.createdAt)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/members/$memberId",
							params: { memberId: m.id },
							className: "text-sm text-primary",
							children: "Open"
						}) })
					]
				}, m.id);
			})
		})]
	});
}
//#endregion
export { MembersPage as component };
