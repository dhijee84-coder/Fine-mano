import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as useAppStore, v as ROLE_LABELS, y as ROLE_NAMES } from "./router-CzIu6ndy.mjs";
import { t as PageHeader } from "./page-header-BcO8feB4.mjs";
import { r as useHas, t as Button } from "./session-BhtPFwO2.mjs";
import { t as Forbidden } from "./forbidden-Ctx_Cupf.mjs";
import { t as Card } from "./card-Dh0onazs.mjs";
import { n as Select, t as Field } from "./field-CuxoslU4.mjs";
import { t as Input } from "./input-CoJxW2XI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/new-DSKeUe2I.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NewUserPage() {
	const can = useHas("users.create");
	const navigate = useNavigate();
	const createUser = useAppStore((s) => s.createUser);
	const [username, setUsername] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)("ADMIN");
	if (!can) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forbidden, { reason: "users.create is required." });
	function onSubmit(e) {
		e.preventDefault();
		const res = createUser({
			username,
			email,
			password,
			role
		});
		if (!res.ok) {
			toast.error(res.error);
			return;
		}
		toast.success("User created.");
		navigate({ to: "/users" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "enter mx-auto max-w-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Users",
			title: "New user"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "flex flex-col gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Username",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: username,
						onChange: (e) => setUsername(e.target.value),
						required: true
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Role",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						value: role,
						onChange: (e) => setRole(e.target.value),
						children: ROLE_NAMES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: r,
							children: ROLE_LABELS[r]
						}, r))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Create"
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
