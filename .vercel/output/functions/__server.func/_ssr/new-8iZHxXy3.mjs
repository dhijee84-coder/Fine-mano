import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as useAppStore } from "./router-5YFTNEBk.mjs";
import { c as Field, l as Input, n as Button, r as Card, u as Select } from "./kit-DQB8BDzZ.mjs";
import { a as PageHeader, i as ModuleOff, r as Forbidden } from "./desk-D9-W6dAi.mjs";
import { i as useVisibleMembers, n as useModuleOn, t as useHas } from "./session-MQtsOIYH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/new-8iZHxXy3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NewPaymentPage() {
	const can = useHas("payments.create");
	const moduleOn = useModuleOn("manual_payments");
	const navigate = useNavigate();
	const members = useVisibleMembers();
	const schemes = useAppStore((s) => s.schemes);
	const enrollments = useAppStore((s) => s.enrollments);
	const createPayment = useAppStore((s) => s.createPayment);
	const liveSchemes = (0, import_react.useMemo)(() => schemes.filter((s) => s.status !== "DRAFT").slice().sort((a, b) => Number(a.status !== "ACTIVE") - Number(b.status !== "ACTIVE") || a.name.localeCompare(b.name)), [schemes]);
	const [schemeId, setSchemeId] = (0, import_react.useState)(() => useAppStore.getState().schemes.find((s) => s.status === "ACTIVE")?.id ?? "");
	const schemeMembers = (0, import_react.useMemo)(() => {
		const ids = new Set(enrollments.filter((e) => e.chitSchemeId === schemeId && e.status === "ACTIVE").map((e) => e.memberId));
		return members.filter((m) => m.isActive && !m.deletedAt && ids.has(m.id));
	}, [
		enrollments,
		members,
		schemeId
	]);
	const selectedScheme = liveSchemes.find((s) => s.id === schemeId);
	const [memberId, setMemberId] = (0, import_react.useState)(schemeMembers[0]?.id ?? "");
	const [amount, setAmount] = (0, import_react.useState)(() => selectedScheme ? String(selectedScheme.installmentAmount) : "");
	const [reference, setReference] = (0, import_react.useState)("");
	if (!can) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forbidden, { reason: "payments.create is required." });
	if (!moduleOn) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleOff, { name: "manual payments" });
	function applyScheme(id) {
		setSchemeId(id);
		const next = enrollments.filter((e) => e.chitSchemeId === id && e.status === "ACTIVE").map((e) => e.memberId);
		const alive = members.filter((m) => m.isActive && !m.deletedAt && next.includes(m.id));
		setMemberId(alive[0]?.id ?? "");
		const scheme = schemes.find((s) => s.id === id);
		if (scheme) setAmount(String(scheme.installmentAmount));
	}
	function onSubmit(e) {
		e.preventDefault();
		if (!schemeId) {
			toast.error("Pick a scheme first.");
			return;
		}
		if (!memberId) {
			toast.error("Pick a live subscriber in this scheme.");
			return;
		}
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
			description: "Choose the scheme first. The member list only shows subscribers still enrolled and active in that scheme. The row stays pending."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "flex flex-col gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Chit scheme",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: schemeId,
						onChange: (e) => applyScheme(e.target.value),
						required: true,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							disabled: true,
							children: "Select scheme"
						}), liveSchemes.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: s.id,
							children: [s.name, s.status !== "ACTIVE" ? ` (${s.status})` : ""]
						}, s.id))]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Member in this scheme",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						value: memberId,
						onChange: (e) => setMemberId(e.target.value),
						required: true,
						disabled: !schemeId || schemeMembers.length === 0,
						children: schemeMembers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "No live subscribers in this scheme"
						}) : schemeMembers.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
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
						disabled: !memberId,
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
