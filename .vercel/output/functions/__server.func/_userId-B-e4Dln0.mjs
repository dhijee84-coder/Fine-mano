import { i as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { h as PERMISSIONS, n as Route$1, o as useAppStore, v as ROLE_LABELS, y as ROLE_NAMES } from "./_ssr/router-CzIu6ndy.mjs";
import { t as PageHeader } from "./_ssr/page-header-BcO8feB4.mjs";
import { r as useHas, t as Button } from "./_ssr/session-BhtPFwO2.mjs";
import { t as Forbidden } from "./_ssr/forbidden-Ctx_Cupf.mjs";
import { n as CardTitle, t as Card } from "./_ssr/card-Dh0onazs.mjs";
import { n as Select, t as Field } from "./_ssr/field-CuxoslU4.mjs";
import { t as Input } from "./_ssr/input-CoJxW2XI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_userId-B-e4Dln0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function UserDetail() {
	const { userId } = Route$1.useParams();
	const canView = useHas("users.view");
	const canRoles = useHas("users.assign_roles");
	const canPerms = useHas("users.manage_permissions");
	const user = useAppStore((s) => s.users.find((u) => u.id === userId));
	const overrides = useAppStore((s) => s.overrides).filter((o) => o.userId === userId);
	const changeRole = useAppStore((s) => s.changeRole);
	const setOverride = useAppStore((s) => s.setOverride);
	const effective = user ? [...useAppStore.getState().effectivePermissions(user)].sort() : [];
	const [role, setRole] = (0, import_react.useState)(user?.role ?? "ADMIN");
	const [code, setCode] = (0, import_react.useState)("payments.approve");
	const [grant, setGrant] = (0, import_react.useState)("true");
	const [reason, setReason] = (0, import_react.useState)("");
	if (!canView) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forbidden, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forbidden, { reason: "User not found." });
	const codes = Object.keys(PERMISSIONS).sort();
	function onRole(e) {
		e.preventDefault();
		const res = changeRole(userId, role);
		if (!res.ok) toast.error(res.error);
		else toast.success("Role updated.");
	}
	function onOverride(e) {
		e.preventDefault();
		const res = setOverride(userId, code, grant === "true", reason);
		if (!res.ok) toast.error(res.error);
		else {
			toast.success("Override saved.");
			setReason("");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "enter",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "User",
				title: user.username,
				description: `${user.email} · ${ROLE_LABELS[user.role]}`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "mb-3",
					children: "Role"
				}), canRoles ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: onRole,
					className: "flex flex-col gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Role",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							value: role,
							onChange: (e) => setRole(e.target.value),
							children: ROLE_NAMES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: r,
								children: ROLE_LABELS[r]
							}, r))
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-fit",
						children: "Save role"
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: ROLE_LABELS[user.role]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "mb-3",
						children: "Permission override"
					}),
					canPerms ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: onOverride,
						className: "flex flex-col gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Permission",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
									value: code,
									onChange: (e) => setCode(e.target.value),
									children: codes.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: c,
										children: c
									}, c))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Action",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: grant,
									onChange: (e) => setGrant(e.target.value),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "true",
										children: "Grant (add on top of role)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "false",
										children: "Revoke (remove even if role has it)"
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Reason (required)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: reason,
									onChange: (e) => setReason(e.target.value),
									required: true
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "w-fit",
								children: "Save override"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "You cannot change individual grants."
					}),
					overrides.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-1 text-xs text-muted",
						children: overrides.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							o.grant ? "GRANT" : "REVOKE",
							" ",
							o.permissionCode,
							" — ",
							o.reason
						] }, o.id))
					}) : null
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "mb-3",
					children: [
						"Effective permissions (",
						effective.length,
						")"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: effective.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-sm bg-surface-2 px-2 py-1 font-mono text-[11px]",
						children: c
					}, c))
				})]
			})
		]
	});
}
//#endregion
export { UserDetail as component };
