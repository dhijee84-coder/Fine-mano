import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as useNavigate, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as useAppStore } from "./router-5YFTNEBk.mjs";
import { c as Field, l as Input, n as Button } from "./kit-DQB8BDzZ.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forgot-aGa0QcbW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var generateOtp = createServerFn({ method: "POST" }).handler(createSsrRpc("5ddacd0ee13ee28c036dc38abd288c2a2431b983f56a9e369aa6f9829762aa34"));
function ForgotPage() {
	const request = useAppStore((s) => s.requestPasswordReset);
	const confirm = useAppStore((s) => s.confirmPasswordReset);
	const navigate = useNavigate();
	const [phone, setPhone] = (0, import_react.useState)("");
	const [otp, setOtp] = (0, import_react.useState)("");
	const [issued, setIssued] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [step, setStep] = (0, import_react.useState)("phone");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onPhone(e) {
		e.preventDefault();
		setBusy(true);
		try {
			const { otp: code } = await generateOtp();
			const res = request(phone, code);
			if (!res.ok) {
				toast.error(res.error);
				return;
			}
			setIssued(code);
			setOtp(code);
			toast.success(`Code issued for ${res.toPhone}. Also in that account’s in-app alerts.`);
			setStep("otp");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not generate OTP.");
		} finally {
			setBusy(false);
		}
	}
	function onReset(e) {
		e.preventDefault();
		const res = confirm(phone, otp, password);
		if (!res.ok) {
			toast.error(res.error);
			return;
		}
		toast.success("Password updated. Sign in with your User ID.");
		navigate({ to: "/" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] tracking-[0.16em] text-muted uppercase",
				children: "Member portal"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-2 text-3xl",
				children: "Reset password"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 mb-6 text-sm text-muted",
				children: "Enter the mobile on your member record. A 6-digit OTP is generated on the server (Python locally, same CSPRNG in Node on Vercel). An in-app alert is also posted on that account."
			}),
			step === "phone" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: onPhone,
				className: "flex flex-col gap-3 rounded-xl bg-surface p-5 hairline",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Mobile number",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: phone,
						onChange: (e) => setPhone(e.target.value),
						placeholder: "98400 11221",
						required: true,
						inputMode: "tel"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: busy,
					children: busy ? "Generating code…" : "Send code"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: onReset,
				className: "flex flex-col gap-3 rounded-xl bg-surface p-5 hairline",
				children: [
					issued ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-xs text-ink",
						children: ["OTP (shown here so you can test): ", issued]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Code",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: otp,
							onChange: (e) => setOtp(e.target.value),
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "New password",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "password",
							minLength: 4,
							value: password,
							onChange: (e) => setPassword(e.target.value),
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Set password"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-6 text-sm text-primary",
				children: "Back to sign in"
			})
		]
	});
}
//#endregion
export { ForgotPage as component };
