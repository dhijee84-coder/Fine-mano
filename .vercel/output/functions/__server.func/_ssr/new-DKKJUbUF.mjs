import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as useAppStore } from "./router-CzIu6ndy.mjs";
import { t as PageHeader } from "./page-header-BcO8feB4.mjs";
import { i as useModuleOn, o as useVisibleMembers, r as useHas, t as Button } from "./session-BhtPFwO2.mjs";
import { n as ModuleOff, t as Forbidden } from "./forbidden-Ctx_Cupf.mjs";
import { t as Card } from "./card-Dh0onazs.mjs";
import { n as Select, t as Field } from "./field-CuxoslU4.mjs";
import { t as Input } from "./input-CoJxW2XI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/new-DKKJUbUF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NewPaymentPage() {
	const can = useHas("payments.create");
	const moduleOn = useModuleOn("manual_payments");
	const navigate = useNavigate();
	const members = useVisibleMembers();
	const createPayment = useAppStore((s) => s.createPayment);
	const [memberId, setMemberId] = (0, import_react.useState)(members[0]?.id ?? "");
	const [amount, setAmount] = (0, import_react.useState)("");
	const [reference, setReference] = (0, import_react.useState)("");
	if (!can) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forbidden, { reason: "payments.create is required." });
	if (!moduleOn) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleOff, { name: "manual payments" });
	function onSubmit(e) {
		e.preventDefault();
		const res = createPayment({
			memberId,
			amount: Number(amount),
			reference,
			source: "MANUAL"
		});
		if (!res.ok) {
			toast.error(res.error);
			return;
		}
		toast.success("Payment recorded as pending.");
		navigate({ to: "/payments" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "enter mx-auto max-w-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Payments",
			title: "Record manual payment",
			description: "Staff can enter a receipt; they cannot approve or allocate it. The row stays pending."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "flex flex-col gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Member",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						value: memberId,
						onChange: (e) => setMemberId(e.target.value),
						required: true,
						children: members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: m.id,
							children: m.fullName
						}, m.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Amount (₹)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: 1,
						step: "1",
						value: amount,
						onChange: (e) => setAmount(e.target.value),
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Reference",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: reference,
						onChange: (e) => setReference(e.target.value),
						placeholder: "CASH-CHN-0928"
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
						onClick: () => navigate({ to: "/payments" }),
						children: "Cancel"
					})]
				})
			]
		}) })]
	});
}
//#endregion
export { NewPaymentPage as component };
