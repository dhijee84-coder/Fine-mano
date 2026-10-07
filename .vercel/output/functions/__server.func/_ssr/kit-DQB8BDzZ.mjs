import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as X } from "../_libs/lucide-react.mjs";
import { a as DialogPortal, c as Slot, i as DialogOverlay, n as DialogClose, o as DialogTitle, r as DialogContent$1, s as DialogTrigger$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kit-DQB8BDzZ.js
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
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	type,
	className: cn("flex h-11 w-full rounded-md bg-surface px-3 text-sm text-ink shadow-[0_0_0_1px_var(--color-line)] transition-[box-shadow] duration-150 placeholder:text-faint file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50", className),
	ref,
	...props
}));
Input.displayName = "Input";
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
	ref,
	className: cn("text-xs font-medium tracking-wide text-muted", className),
	...props
}));
Label.displayName = "Label";
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
	className: cn("flex min-h-24 w-full rounded-md bg-surface px-3 py-2 text-sm text-ink shadow-[0_0_0_1px_var(--color-line)] transition-[box-shadow] duration-150 placeholder:text-faint focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50", className),
	ref,
	...props
}));
Textarea.displayName = "Textarea";
function Field({ label, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: cn("flex flex-col gap-1.5", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
function Select({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		className: cn("flex h-11 w-full appearance-none rounded-md bg-surface bg-[length:12px] bg-[right_12px_center] bg-no-repeat px-3 pr-9 text-sm text-ink shadow-[0_0_0_1px_var(--color-line)] focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--color-primary)]", className),
		style: { backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'><path d='M1 1.5L6 6.5L11 1.5' stroke='%235e6675' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>")` },
		...props
	});
}
function Card({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-xl bg-surface p-5 hairline", className),
		...props
	});
}
function CardTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
		className: cn("font-display text-lg font-medium tracking-tight text-ink", className),
		...props
	});
}
var badgeVariants = cva("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase", {
	variants: { tone: {
		default: "bg-surface-2 text-ink-soft",
		navy: "bg-navy text-navy-fg",
		primary: "bg-info-bg text-primary",
		success: "bg-success-bg text-success",
		warn: "bg-warn-bg text-warn",
		danger: "bg-danger-bg text-danger"
	} },
	defaultVariants: { tone: "default" }
});
function Badge({ className, tone, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ tone }), className),
		...props
	});
}
var Dialog = Dialog$1;
var DialogTrigger = DialogTrigger$1;
function DialogContent({ className, children, title, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-ink/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface p-6 shadow-[0_16px_48px_rgba(16,25,43,0.2)] focus:outline-none", className),
		...props,
		children: [
			title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "font-display mb-4 text-xl font-medium tracking-tight",
				children: title
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "sr-only",
				children: "Dialog"
			}),
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
				className: "absolute top-4 right-4 rounded-sm p-1 text-muted hover:bg-surface-2 hover:text-ink",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sr-only",
					children: "Close"
				})]
			})
		]
	})] });
}
//#endregion
export { Dialog as a, Field as c, Textarea as d, cn as f, CardTitle as i, Input as l, Button as n, DialogContent as o, Card as r, DialogTrigger as s, Badge as t, Select as u };
