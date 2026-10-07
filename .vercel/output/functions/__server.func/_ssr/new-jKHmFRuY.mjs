import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as useAppStore, x as assignableRoles, y as ROLE_LABELS } from "./router-5YFTNEBk.mjs";
import { c as Field, f as cn, l as Input, n as Button, r as Card, u as Select } from "./kit-DQB8BDzZ.mjs";
import { a as PageHeader, r as Forbidden } from "./desk-D9-W6dAi.mjs";
import { r as useSessionUser, t as useHas } from "./session-MQtsOIYH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/new-jKHmFRuY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ROLE_HINT = {
	SUPER_ADMIN: "House desk — users, modules, APIs, approvals.",
	ADMIN: "Floor desk — members, schemes, collections, reports.",
	MEMBER: "Portal login tied to one live subscriber. They only see their own chits."
};
function NewUserPage() {
	const can = useHas("users.create");
	const actor = useSessionUser();
	const roles = assignableRoles(actor?.role);
	const navigate = useNavigate();
	const createUser = useAppStore((s) => s.createUser);
	const members = useAppStore((s) => s.members);
	const users = useAppStore((s) => s.users);
	const [username, setUsername] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)(roles.includes("ADMIN") ? "ADMIN" : roles[0] ?? "ADMIN");
	const [memberId, setMemberId] = (0, import_react.useState)("");
	if (!can) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forbidden, { reason: "users.create is required." });
	if (roles.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forbidden, { reason: "Members cannot create desk logins." });
	const linked = new Set(users.map((u) => u.memberId).filter(Boolean));
	const freeMembers = members.filter((m) => m.isActive && !m.deletedAt && !linked.has(m.id));
	const house = actor?.role === "SUPER_ADMIN";
	function onSubmit(e) {
		e.preventDefault();
		if (!roles.includes(role)) {
			toast.error("That role is not allowed from this desk.");
			return;
		}
		const res = createUser({
			username,
			email,
			password,
			role,
			memberId: role === "MEMBER" ? memberId : null
		});
		if (!res.ok) {
			toast.error(res.error);
			return;
		}
		toast.success(`${ROLE_LABELS[role]} login created.`);
		navigate({ to: "/users" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "enter mx-auto max-w-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Users",
			title: house ? "New login" : "Add Admin or Member",
			description: house ? "House, floor, or member portal. Pick the desk first." : "This desk can add a floor Admin or a member portal login. Super Admin cannot be created here."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "flex flex-col gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium tracking-wide text-muted",
					children: "Login type"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-2",
					children: roles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setRole(r),
						className: cn("rounded-lg px-4 py-3 text-left hairline transition-colors", role === r ? "bg-navy text-navy-fg" : "bg-surface-2 hover:bg-line"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm font-medium",
							children: ROLE_LABELS[r]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("mt-0.5 block text-xs", role === r ? "text-navy-fg/80" : "text-muted"),
							children: ROLE_HINT[r]
						})]
					}, r))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "User ID",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: username,
						onChange: (e) => setUsername(e.target.value),
						required: true,
						autoComplete: "off",
						placeholder: role === "MEMBER" ? "lakshmi" : "floor.admin"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Email",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "email",
						value: email,
						onChange: (e) => setEmail(e.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Password",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "password",
						minLength: 4,
						value: password,
						onChange: (e) => setPassword(e.target.value),
						required: true
					})
				}),
				role === "MEMBER" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Subscriber (alive, no portal yet)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: memberId,
						onChange: (e) => setMemberId(e.target.value),
						required: true,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select the person this login belongs to"
						}), freeMembers.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: m.id,
							children: [
								m.fullName,
								" · ",
								m.phone
							]
						}, m.id))]
					})
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						children: ["Create ", ROLE_LABELS[role]]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						onClick: () => navigate({ to: "/users" }),
						children: "Cancel"
					})]
				})
			]
		}) })]
	});
}
//#endregion
export { NewUserPage as component };
