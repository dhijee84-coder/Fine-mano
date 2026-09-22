import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as ROLE_DEFAULTS, h as PERMISSIONS, o as useAppStore, v as ROLE_LABELS, y as ROLE_NAMES } from "./router-CzIu6ndy.mjs";
import { t as PageHeader } from "./page-header-BcO8feB4.mjs";
import { a as useSessionUser, n as cn, t as Button } from "./session-BhtPFwO2.mjs";
import { t as Forbidden } from "./forbidden-Ctx_Cupf.mjs";
import { n as CardTitle, t as Card } from "./card-Dh0onazs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/roles-DPh3-Sws.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RolesPage() {
	const user = useSessionUser();
	const setRolePermissions = useAppStore((s) => s.setRolePermissions);
	const [tick, setTick] = (0, import_react.useState)(0);
	const categories = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const [code, meta] of Object.entries(PERMISSIONS)) {
			const list = map.get(meta[0]) ?? [];
			list.push(code);
			map.set(meta[0], list);
		}
		return map;
	}, [tick]);
	if (user?.role !== "SUPER_ADMIN") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forbidden, { reason: "Only Super Admin can manage role defaults." });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "enter",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Access control",
			title: "Roles & permissions",
			description: "Three desks. Super Admin holds the house and the developer console. Admin runs the floor. Member sees only their own chits."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-4",
			children: ROLE_NAMES.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleCard, {
				role,
				categories,
				onSave: (codes) => {
					const res = setRolePermissions(role, codes);
					if (!res.ok) toast.error(res.error);
					else {
						toast.success(`Saved ${ROLE_LABELS[role]}.`);
						setTick((t) => t + 1);
					}
				}
			}, role))
		})]
	});
}
function RoleCard({ role, categories, onSave }) {
	const locked = role === "SUPER_ADMIN";
	const [selected, setSelected] = (0, import_react.useState)(() => new Set(role === "SUPER_ADMIN" ? Object.keys(PERMISSIONS) : ROLE_DEFAULTS[role]));
	function toggle(code) {
		if (locked) return;
		setSelected((prev) => {
			const next = new Set(prev);
			if (next.has(code)) next.delete(code);
			else next.add(code);
			return next;
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "mb-1",
			children: ROLE_LABELS[role]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 text-sm text-muted",
			children: locked ? "Always every permission." : `${selected.size} permissions selected.`
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: [...categories.entries()].map(([cat, codes]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-1.5 text-[11px] tracking-[0.14em] text-muted uppercase",
				children: cat
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-1",
				children: codes.map((code) => {
					const meta = PERMISSIONS[code];
					const on = selected.has(code);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: cn("flex cursor-pointer items-start gap-2 rounded-sm px-1 py-0.5 text-xs", locked && "cursor-default opacity-70"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							className: "mt-0.5",
							checked: on,
							disabled: locked,
							onChange: () => toggle(code)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono",
							children: code
						}), meta?.[3] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-1 text-danger",
							children: "danger"
						}) : null] })]
					}) }, code);
				})
			})] }, cat))
		}),
		locked ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			className: "mt-4",
			onClick: () => onSave([...selected]),
			children: ["Save ", ROLE_LABELS[role]]
		})
	] });
}
//#endregion
export { RolesPage as component };
