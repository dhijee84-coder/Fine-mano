import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { g as ROLE_BLURBS, o as useAppStore, s as DEMO_ACCOUNTS, v as ROLE_LABELS } from "./router-CzIu6ndy.mjs";
import { a as useSessionUser, t as Button } from "./session-BhtPFwO2.mjs";
import { t as Field } from "./field-CuxoslU4.mjs";
import { t as Input } from "./input-CoJxW2XI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BrsqlJ_J.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const user = useSessionUser();
	const navigate = useNavigate();
	const login = useAppStore((s) => s.login);
	const loginAs = useAppStore((s) => s.loginAs);
	const settings = useAppStore((s) => s.settings);
	const hydrated = useAppStore((s) => s.hasHydrated);
	const [username, setUsername] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/dashboard" });
	function enter(name) {
		const res = loginAs(name);
		if (!res.ok) {
			toast.error(res.error);
			return;
		}
		navigate({ to: "/dashboard" });
	}
	function onSubmit(e) {
		e.preventDefault();
		setError("");
		const res = login(username, password);
		if (!res.ok) {
			setError(res.error);
			return;
		}
		navigate({ to: "/dashboard" });
	}
	const brand = settings.site_name || "Nidhi";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh lg:grid lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative hidden overflow-hidden bg-navy text-navy-fg lg:flex lg:flex-col lg:justify-between",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ledger-grid absolute inset-0 opacity-60" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative px-12 pt-12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] tracking-[0.22em] text-navy-muted uppercase",
							children: "Chit fund operations"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display mt-6 max-w-md text-5xl leading-[1.1] font-medium tracking-tight italic",
							children: brand
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-sm text-sm leading-relaxed text-navy-muted",
							children: "Three desks: the house, the floor, and the subscriber. Pick a role and operate the book."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "relative grid grid-cols-3 gap-px border-t border-white/10 bg-white/5",
					children: [
						["3", "Roles"],
						["Soft", "Deletes"],
						["Own", "Books"]
					].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-6 py-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "font-display text-2xl",
							children: k
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 text-[11px] tracking-[0.14em] text-navy-muted uppercase",
							children: v
						})]
					}, v))
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "flex min-h-dvh flex-col justify-center px-5 py-10 sm:px-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto w-full max-w-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl italic lg:hidden",
						children: brand
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display mt-2 text-3xl font-medium tracking-tight",
						children: "Sign in"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 mb-6 text-sm text-muted",
						children: "Pick a desk. Demo password matches the username. After you sign in, open Instructions in the menu for the full desk manual."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-8 grid grid-cols-1 gap-2",
						children: DEMO_ACCOUNTS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: !hydrated,
							onClick: () => enter(a.username),
							className: "rounded-lg bg-surface p-3.5 text-left hairline transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-card-hover)] disabled:opacity-60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-sm font-medium text-ink",
									children: ROLE_LABELS[a.role]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 block font-mono text-[11px] text-muted",
									children: a.username
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1.5 block text-xs leading-snug text-faint",
									children: ROLE_BLURBS[a.role]
								})
							]
						}, a.username))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
						onSubmit,
						className: "rounded-xl bg-surface p-5 hairline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Username",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										autoComplete: "username",
										value: username,
										onChange: (e) => setUsername(e.target.value),
										required: true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Password",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "password",
										autoComplete: "current-password",
										value: password,
										onChange: (e) => setPassword(e.target.value),
										required: true
									})
								}),
								error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-danger",
									children: error
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "mt-1 w-full",
									disabled: !hydrated,
									children: hydrated ? "Login" : "Opening ledger…"
								})
							]
						})
					})
				]
			})
		})]
	});
}
//#endregion
export { LoginPage as component };
