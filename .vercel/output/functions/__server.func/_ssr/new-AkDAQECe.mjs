import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as useAppStore } from "./router-CzIu6ndy.mjs";
import { t as PageHeader } from "./page-header-BcO8feB4.mjs";
import { i as useModuleOn, r as useHas, t as Button } from "./session-BhtPFwO2.mjs";
import { n as ModuleOff, t as Forbidden } from "./forbidden-Ctx_Cupf.mjs";
import { t as Card } from "./card-Dh0onazs.mjs";
import { n as Select, t as Field } from "./field-CuxoslU4.mjs";
import { t as Input } from "./input-CoJxW2XI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/new-AkDAQECe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NewMemberPage() {
	const can = useHas("members.create");
	const moduleOn = useModuleOn("member_management");
	const navigate = useNavigate();
	const createMember = useAppStore((s) => s.createMember);
	const staff = useAppStore((s) => s.users).filter((u) => u.role === "ADMIN" && u.isActive);
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [address, setAddress] = (0, import_react.useState)("");
	const [city, setCity] = (0, import_react.useState)("");
	const [assignedStaffId, setAssignedStaffId] = (0, import_react.useState)("");
	if (!can) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forbidden, { reason: "members.create is required." });
	if (!moduleOn) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleOff, { name: "member management" });
	function onSubmit(e) {
		e.preventDefault();
		const res = createMember({
			fullName,
			phone,
			email,
			address,
			city,
			assignedStaffId: assignedStaffId || null
		});
		if (!res.ok) {
			toast.error(res.error);
			return;
		}
		toast.success("Member created.");
		navigate({
			to: "/members/$memberId",
			params: { memberId: res.id }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "enter mx-auto max-w-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Members",
			title: "New member",
			description: "Phone must be unique. Assign an operator if someone on the floor owns this book."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "flex flex-col gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Full name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: fullName,
						onChange: (e) => setFullName(e.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Phone",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: phone,
						onChange: (e) => setPhone(e.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Email",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "email",
						value: email,
						onChange: (e) => setEmail(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Address",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: address,
						onChange: (e) => setAddress(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "City",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: city,
						onChange: (e) => setCity(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Assigned operator",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: assignedStaffId,
						onChange: (e) => setAssignedStaffId(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Unassigned"
						}), staff.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s.id,
							children: s.username
						}, s.id))]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Save"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						onClick: () => navigate({ to: "/members" }),
						children: "Cancel"
					})]
				})
			]
		}) })]
	});
}
//#endregion
export { NewMemberPage as component };
