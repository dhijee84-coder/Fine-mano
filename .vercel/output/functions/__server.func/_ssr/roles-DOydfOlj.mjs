import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { b as ROLE_NAMES, g as PERMISSIONS, o as useAppStore, v as ROLE_DEFAULTS, y as ROLE_LABELS } from "./router-5YFTNEBk.mjs";
import { f as cn, i as CardTitle, n as Button, r as Card } from "./kit-DQB8BDzZ.mjs";
import { a as PageHeader, r as Forbidden } from "./desk-D9-W6dAi.mjs";
import { r as useSessionUser } from "./session-MQtsOIYH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/roles-DOydfOlj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RolesPage() {
	const user = useSessionUser();
	const setRolePermissions = useAppStore((s) => s.setRolePermissions);
	const rolePerms = useAppStore((s) => s.rolePerms);
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
				},
				initial: rolePerms[role] ?? ROLE_DEFAULTS[role]
			}, role))
		})]
	});
}
function RoleCard({ role, categories, onSave, initial }) {
	const locked = role === "SUPER_ADMIN";
	const [selected, setSelected] = (0, import_react.useState)(() => new Set(initial));
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
