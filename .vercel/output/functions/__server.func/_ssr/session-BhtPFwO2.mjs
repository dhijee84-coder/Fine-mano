import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as Slot } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { o as useAppStore } from "./router-CzIu6ndy.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/session-BhtPFwO2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[opacity,transform,background-color,box-shadow] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-fg hover:bg-primary-hover shadow-[0_1px_0_rgba(21,32,51,0.12)]",
			secondary: "bg-surface-2 text-ink hover:bg-line",
			outline: "bg-surface text-ink shadow-[0_0_0_1px_var(--color-line)] hover:shadow-[0_0_0_1px_var(--color-line-strong)]",
			ghost: "bg-transparent text-ink-soft hover:bg-surface-2 hover:text-ink",
			navy: "bg-navy text-navy-fg hover:bg-navy-2",
			danger: "bg-danger text-primary-fg hover:opacity-90",
			link: "text-primary underline-offset-4 hover:underline px-0 h-auto"
		},
		size: {
			sm: "h-9 rounded-sm px-3 text-sm",
			md: "h-11 rounded-md px-4 text-sm",
			lg: "h-12 rounded-md px-5 text-base",
			icon: "size-11 rounded-md",
			"icon-sm": "size-9 rounded-sm"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "md"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
function useSessionUser() {
	const sessionUserId = useAppStore((s) => s.sessionUserId);
	return useAppStore((s) => s.users).find((u) => u.id === sessionUserId) ?? null;
}
function useHas(code) {
	const user = useSessionUser();
	useAppStore((s) => s.overrides);
	if (!user) return false;
	return useAppStore.getState().effectivePermissions(user).has(code);
}
function useModuleOn(key) {
	return useAppStore((s) => s.modules[key] !== false);
}
function useVisibleMembers() {
	const members = useAppStore((s) => s.members);
	const sessionUserId = useAppStore((s) => s.sessionUserId);
	const overrides = useAppStore((s) => s.overrides);
	const users = useAppStore((s) => s.users);
	return (0, import_react.useMemo)(() => useAppStore.getState().visibleMembers(), [
		members,
		sessionUserId,
		overrides,
		users
	]);
}
//#endregion
export { useSessionUser as a, useModuleOn as i, cn as n, useVisibleMembers as o, useHas as r, Button as t };
