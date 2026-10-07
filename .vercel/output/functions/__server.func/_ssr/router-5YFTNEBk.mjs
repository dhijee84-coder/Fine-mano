import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as useRouter, _ as lazyRouteComponent, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, v as createFileRoute, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { n as format, r as isValid, t as parseISO } from "../_libs/date-fns.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-5YFTNEBk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var ROLE_NAMES = [
	"SUPER_ADMIN",
	"ADMIN",
	"MEMBER"
];
var ROLE_LABELS = {
	SUPER_ADMIN: "Super Admin",
	ADMIN: "Admin",
	MEMBER: "Member"
};
function assignableRoles(actor) {
	if (actor === "SUPER_ADMIN") return [
		"SUPER_ADMIN",
		"ADMIN",
		"MEMBER"
	];
	if (actor === "ADMIN") return ["ADMIN", "MEMBER"];
	return [];
}
var ROLE_BLURBS = {
	SUPER_ADMIN: "House desk — users, finance, modules, APIs, and approvals in one place.",
	ADMIN: "Floor desk — members, schemes, collections, allocation, and reports.",
	MEMBER: "Your own chits, dues, and receipts. Nobody else's book."
};
/** code -> [category, description, isFinancial, isDangerous] */
var PERMISSIONS = {
	"users.view": [
		"users",
		"View user accounts",
		false,
		false
	],
	"users.create": [
		"users",
		"Create user accounts",
		false,
		false
	],
	"users.edit": [
		"users",
		"Edit user accounts",
		false,
		false
	],
	"users.delete": [
		"users",
		"Delete/disable user accounts",
		false,
		true
	],
	"users.assign_roles": [
		"users",
		"Change a user's role",
		false,
		true
	],
	"users.assign_superadmin": [
		"users",
		"Promote a user to Super Admin",
		false,
		true
	],
	"users.reset_password": [
		"users",
		"Reset another user's password",
		false,
		true
	],
	"users.manage_permissions": [
		"users",
		"Grant/revoke individual permissions",
		false,
		true
	],
	"members.view": [
		"members",
		"View member records",
		false,
		false
	],
	"members.view_all": [
		"members",
		"View all members, not just assigned",
		false,
		false
	],
	"members.view_passwords": [
		"members",
		"See member portal passwords",
		false,
		true
	],
	"members.create": [
		"members",
		"Create members",
		false,
		false
	],
	"members.edit": [
		"members",
		"Edit members",
		false,
		false
	],
	"members.delete": [
		"members",
		"Delete members",
		false,
		true
	],
	"members.export": [
		"members",
		"Export member data",
		false,
		false
	],
	"chits.view": [
		"chits",
		"View chit schemes",
		false,
		false
	],
	"chits.create": [
		"chits",
		"Create chit schemes",
		false,
		false
	],
	"chits.edit": [
		"chits",
		"Edit chit schemes",
		false,
		false
	],
	"chits.delete": [
		"chits",
		"Delete chit schemes",
		false,
		true
	],
	"installments.view": [
		"installments",
		"View installments",
		false,
		false
	],
	"installments.create": [
		"installments",
		"Create installments",
		true,
		false
	],
	"installments.edit": [
		"installments",
		"Edit installments",
		true,
		false
	],
	"installments.edit_paid": [
		"installments",
		"Edit an already-paid installment",
		true,
		true
	],
	"installments.generate": [
		"installments",
		"Auto-generate installment schedules",
		true,
		false
	],
	"payments.view": [
		"payments",
		"View payments",
		true,
		false
	],
	"payments.create": [
		"payments",
		"Record manual payments",
		true,
		false
	],
	"payments.edit": [
		"payments",
		"Edit payments",
		true,
		false
	],
	"payments.delete": [
		"payments",
		"Delete payments",
		true,
		true
	],
	"payments.approve": [
		"payments",
		"Approve unmatched/pending payments",
		true,
		false
	],
	"payments.allocate": [
		"payments",
		"Allocate payments to installments",
		true,
		false
	],
	"payments.refund": [
		"payments",
		"Process refunds",
		true,
		true
	],
	"bank.view": [
		"bank",
		"View bank transactions",
		true,
		false
	],
	"bank.connect": [
		"bank",
		"Create bank connections",
		false,
		true
	],
	"bank.sync": [
		"bank",
		"Trigger bank synchronization",
		false,
		false
	],
	"bank.manage_providers": [
		"bank",
		"Configure bank provider adapters",
		false,
		true
	],
	"bank.manage_webhooks": [
		"bank",
		"Configure bank webhook endpoints",
		false,
		false
	],
	"bank.view_credentials": [
		"bank",
		"View bank credentials (masked)",
		false,
		true
	],
	"reports.view": [
		"reports",
		"View reports",
		false,
		false
	],
	"reports.export": [
		"reports",
		"Export reports",
		false,
		false
	],
	"reminders.view": [
		"reminders",
		"View reminders",
		false,
		false
	],
	"reminders.create": [
		"reminders",
		"Create reminders",
		false,
		false
	],
	"reminders.edit": [
		"reminders",
		"Edit reminders",
		false,
		false
	],
	"reminders.send": [
		"reminders",
		"Send reminders now",
		false,
		false
	],
	"reconciliation.view": [
		"reconciliation",
		"View reconciliation reports",
		true,
		false
	],
	"receipts.view": [
		"receipts",
		"View/download receipts",
		false,
		false
	],
	"developer.view": [
		"developer",
		"Access the Developer Console",
		false,
		false
	],
	"developer.settings": [
		"developer",
		"Change website configuration",
		false,
		false
	],
	"developer.modules": [
		"developer",
		"Enable/disable modules",
		false,
		true
	],
	"developer.forms": [
		"developer",
		"Configure the form builder",
		false,
		false
	],
	"developer.dashboard": [
		"developer",
		"Configure dashboard builder / menus",
		false,
		false
	],
	"developer.workflow": [
		"developer",
		"Configure workflow settings",
		false,
		false
	],
	"developer.api": [
		"developer",
		"Manage API clients/endpoints",
		false,
		false
	],
	"developer.api_secrets_view": [
		"developer",
		"View secrets (always masked)",
		false,
		true
	],
	"developer.database": [
		"developer",
		"Access read-only database inspector",
		false,
		false
	],
	"developer.database_write": [
		"developer",
		"Run approved write/maintenance ops",
		false,
		true
	],
	"developer.logs": [
		"developer",
		"View system/error logs",
		false,
		false
	],
	"developer.backup": [
		"developer",
		"Create database backups",
		false,
		true
	],
	"developer.restore": [
		"developer",
		"Restore database backups",
		false,
		true
	],
	"developer.scheduler": [
		"developer",
		"View/manage scheduler & background jobs",
		false,
		false
	],
	"developer.financial_access": [
		"developer",
		"Extra grant allowing a Developer to touch financial records",
		true,
		true
	],
	"audit.view": [
		"audit",
		"View audit logs",
		false,
		false
	],
	"audit.export": [
		"audit",
		"Export audit logs",
		false,
		false
	],
	"settings.security": [
		"settings",
		"Change core security settings",
		false,
		true
	],
	"settings.branding": [
		"settings",
		"Change branding/UI settings",
		false,
		false
	]
};
var ROLE_DEFAULTS = {
	SUPER_ADMIN: Object.keys(PERMISSIONS),
	ADMIN: [
		"members.view",
		"members.view_all",
		"members.view_passwords",
		"members.create",
		"members.edit",
		"members.export",
		"chits.view",
		"chits.create",
		"chits.edit",
		"installments.view",
		"installments.create",
		"installments.generate",
		"installments.edit",
		"payments.view",
		"payments.create",
		"payments.edit",
		"payments.approve",
		"payments.allocate",
		"bank.view",
		"bank.sync",
		"reports.view",
		"reports.export",
		"reminders.view",
		"reminders.create",
		"reminders.edit",
		"reminders.send",
		"reconciliation.view",
		"receipts.view",
		"users.view",
		"users.create",
		"users.edit"
	],
	MEMBER: ["receipts.view"]
};
var ADMIN_SCREENS = [
	{
		key: "members",
		label: "Members",
		hint: "List and open subscribers",
		codes: ["members.view", "members.view_all"]
	},
	{
		key: "members_edit",
		label: "Edit members",
		hint: "Create and change member records",
		codes: ["members.create", "members.edit"]
	},
	{
		key: "passwords",
		label: "Member passwords",
		hint: "See portal User ID and password",
		codes: ["members.view_passwords"]
	},
	{
		key: "chits",
		label: "Chit schemes",
		hint: "Schemes, enroll, generate installments",
		codes: [
			"chits.view",
			"chits.create",
			"chits.edit",
			"installments.view",
			"installments.generate",
			"installments.create",
			"installments.edit"
		]
	},
	{
		key: "payments",
		label: "Payments",
		hint: "Record, approve, allocate collections",
		codes: [
			"payments.view",
			"payments.create",
			"payments.edit",
			"payments.approve",
			"payments.allocate"
		]
	},
	{
		key: "reports",
		label: "Reports",
		hint: "Collections and overdue",
		codes: [
			"reports.view",
			"reports.export",
			"reconciliation.view"
		]
	},
	{
		key: "users",
		label: "Users",
		hint: "Desk logins",
		codes: [
			"users.view",
			"users.create",
			"users.edit"
		]
	},
	{
		key: "audit",
		label: "Audit log",
		hint: "Who changed what",
		codes: ["audit.view"]
	},
	{
		key: "reminders",
		label: "Reminders",
		hint: "Send and view reminder queue",
		codes: [
			"reminders.view",
			"reminders.send",
			"reminders.create"
		]
	}
];
var MODULE_KEYS = [
	"member_management",
	"chit_management",
	"installments",
	"payments",
	"bank_api",
	"manual_payments",
	"payment_allocation",
	"reminders",
	"reports",
	"receipts",
	"reconciliation",
	"audit_logs",
	"member_portal",
	"developer_console"
];
var MODULE_LABELS = {
	member_management: "Member management",
	chit_management: "Chit schemes",
	installments: "Installments",
	payments: "Payments",
	bank_api: "Bank API",
	manual_payments: "Manual payments",
	payment_allocation: "Payment allocation",
	reminders: "Reminders",
	reports: "Reports",
	receipts: "Receipts",
	reconciliation: "Reconciliation",
	audit_logs: "Audit logs",
	member_portal: "Member portal",
	developer_console: "Developer console"
};
function formatINR(n, fraction = 0) {
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: fraction,
		minimumFractionDigits: fraction
	}).format(n);
}
function formatDate(iso) {
	try {
		const d = parseISO(iso);
		if (!isValid(d)) return iso;
		return format(d, "d MMM yyyy");
	} catch {
		return iso;
	}
}
function formatDateTime(iso) {
	try {
		const d = parseISO(iso);
		if (!isValid(d)) return iso;
		return format(d, "d MMM yyyy, h:mm a");
	} catch {
		return iso;
	}
}
function todayISO() {
	return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function nowISO() {
	return (/* @__PURE__ */ new Date()).toISOString();
}
function addMonthsISO(isoDate, months) {
	const d = /* @__PURE__ */ new Date(`${isoDate}T00:00:00`);
	const day = d.getDate();
	d.setMonth(d.getMonth() + months);
	if (d.getDate() < day) d.setDate(0);
	return d.toISOString().slice(0, 10);
}
function initials(name) {
	return name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
}
function monthsAgo(n) {
	const d = /* @__PURE__ */ new Date();
	d.setMonth(d.getMonth() - n);
	d.setDate(1);
	return d.toISOString().slice(0, 10);
}
function daysAgo(n) {
	const d = /* @__PURE__ */ new Date();
	d.setDate(d.getDate() - n);
	return d.toISOString();
}
function dateDaysAgo(n) {
	return daysAgo(n).slice(0, 10);
}
var TODAY = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
function buildInstallments(opts) {
	const items = [];
	for (let n = 1; n <= opts.months; n++) {
		const dueDate = addMonthsISO(opts.start, n - 1);
		let status = "PENDING";
		let amountPaid = 0;
		let locked = false;
		if (n <= opts.paidThrough) {
			status = "PAID";
			amountPaid = opts.amount;
			locked = true;
		} else if (n === opts.paidThrough + 1 && opts.partial) {
			status = "PARTIAL";
			amountPaid = opts.partial;
		} else if (dueDate < TODAY) status = "OVERDUE";
		items.push({
			id: `i-${opts.memberChitId}-${n}`,
			memberChitId: opts.memberChitId,
			installmentNumber: n,
			dueDate,
			amountDue: opts.amount,
			amountPaid,
			status,
			locked
		});
	}
	return items;
}
var USERS = [
	{
		id: "u-super",
		username: "superadmin",
		email: "superadmin@nidhi.local",
		password: "superadmin",
		role: "SUPER_ADMIN",
		isActive: true,
		failedLoginCount: 0,
		lockedUntil: null,
		memberId: null,
		createdAt: daysAgo(400)
	},
	{
		id: "u-admin",
		username: "admin",
		email: "admin@nidhi.local",
		password: "admin",
		role: "ADMIN",
		isActive: true,
		failedLoginCount: 0,
		lockedUntil: null,
		memberId: null,
		createdAt: daysAgo(380)
	},
	{
		id: "u-member",
		username: "member",
		email: "lakshmi@example.com",
		password: "member",
		role: "MEMBER",
		isActive: true,
		failedLoginCount: 0,
		lockedUntil: null,
		memberId: "m-1",
		createdAt: daysAgo(200)
	}
];
var MEMBERS = [
	{
		id: "m-1",
		fullName: "Lakshmi Iyer",
		phone: "+91 98400 11221",
		email: "lakshmi@example.com",
		address: "14 Luz Church Road, Mylapore",
		city: "Chennai",
		assignedStaffId: "u-admin",
		isActive: true,
		createdAt: daysAgo(200),
		deletedAt: null
	},
	{
		id: "m-2",
		fullName: "Ramesh Krishnan",
		phone: "+91 98840 22011",
		email: "ramesh.k@example.com",
		address: "8 Gandhi Nagar, Adyar",
		city: "Chennai",
		assignedStaffId: "u-admin",
		isActive: true,
		createdAt: daysAgo(190),
		deletedAt: null
	},
	{
		id: "m-3",
		fullName: "Fatima Begum",
		phone: "+91 94444 33120",
		email: "fatima.b@example.com",
		address: "22 Triplicane High Road",
		city: "Chennai",
		assignedStaffId: "u-admin",
		isActive: true,
		createdAt: daysAgo(180),
		deletedAt: null
	},
	{
		id: "m-4",
		fullName: "Arjun Reddy",
		phone: "+91 90000 44551",
		email: "arjun.reddy@example.com",
		address: "Banjara Hills, Road No. 12",
		city: "Hyderabad",
		assignedStaffId: "u-admin",
		isActive: true,
		createdAt: daysAgo(170),
		deletedAt: null
	},
	{
		id: "m-5",
		fullName: "Meena Subramanian",
		phone: "+91 97909 55662",
		email: "meena.s@example.com",
		address: "Race Course, Coimbatore",
		city: "Coimbatore",
		assignedStaffId: "u-admin",
		isActive: true,
		createdAt: daysAgo(160),
		deletedAt: null
	},
	{
		id: "m-6",
		fullName: "Joseph D'Souza",
		phone: "+91 98200 66773",
		email: "joseph.ds@example.com",
		address: "Fort Kochi, Princess Street",
		city: "Kochi",
		assignedStaffId: null,
		isActive: true,
		createdAt: daysAgo(140),
		deletedAt: null
	},
	{
		id: "m-7",
		fullName: "Priya Nair",
		phone: "+91 98950 77884",
		email: "priya.nair@example.com",
		address: "Pattom, Thiruvananthapuram",
		city: "Thiruvananthapuram",
		assignedStaffId: null,
		isActive: true,
		createdAt: daysAgo(120),
		deletedAt: null
	},
	{
		id: "m-8",
		fullName: "Venkatesh Rao",
		phone: "+91 99000 88995",
		email: "venkat.rao@example.com",
		address: "Jayanagar 4th Block",
		city: "Bengaluru",
		assignedStaffId: null,
		isActive: true,
		createdAt: daysAgo(100),
		deletedAt: null
	}
];
var GOLD_START = monthsAgo(17);
var SILVER_START = monthsAgo(8);
var HARVEST_START = monthsAgo(3);
var INSTALLMENTS = [
	...buildInstallments({
		memberChitId: "mc-1",
		start: GOLD_START,
		months: 20,
		amount: 25e3,
		paidThrough: 15,
		partial: 1e4
	}),
	...buildInstallments({
		memberChitId: "mc-2",
		start: GOLD_START,
		months: 20,
		amount: 25e3,
		paidThrough: 17
	}),
	...buildInstallments({
		memberChitId: "mc-3",
		start: GOLD_START,
		months: 20,
		amount: 25e3,
		paidThrough: 14
	}),
	...buildInstallments({
		memberChitId: "mc-4",
		start: GOLD_START,
		months: 20,
		amount: 25e3,
		paidThrough: 16
	}),
	...buildInstallments({
		memberChitId: "mc-5",
		start: GOLD_START,
		months: 20,
		amount: 25e3,
		paidThrough: 13
	}),
	...buildInstallments({
		memberChitId: "mc-6",
		start: SILVER_START,
		months: 12,
		amount: 16670,
		paidThrough: 7
	}),
	...buildInstallments({
		memberChitId: "mc-7",
		start: SILVER_START,
		months: 12,
		amount: 16670,
		paidThrough: 8
	}),
	...buildInstallments({
		memberChitId: "mc-8",
		start: SILVER_START,
		months: 12,
		amount: 16670,
		paidThrough: 6,
		partial: 5e3
	}),
	...buildInstallments({
		memberChitId: "mc-9",
		start: SILVER_START,
		months: 12,
		amount: 16670,
		paidThrough: 8
	})
];
var PAYMENTS = [
	{
		id: "p-1",
		memberId: "m-1",
		amount: 25e3,
		source: "BANK",
		reference: "NEFT/SBIN/4419821",
		status: "APPROVED",
		recordedBy: "u-admin",
		createdAt: daysAgo(40),
		deletedAt: null
	},
	{
		id: "p-2",
		memberId: "m-1",
		amount: 1e4,
		source: "MANUAL",
		reference: "CASH-CHN-0921",
		status: "ALLOCATED",
		recordedBy: "u-admin",
		createdAt: daysAgo(12),
		deletedAt: null
	},
	{
		id: "p-3",
		memberId: "m-2",
		amount: 25e3,
		source: "BANK",
		reference: "UPI/44120933",
		status: "APPROVED",
		recordedBy: "u-admin",
		createdAt: daysAgo(18),
		deletedAt: null
	},
	{
		id: "p-4",
		memberId: "m-3",
		amount: 25e3,
		source: "MANUAL",
		reference: "CHQ-33219",
		status: "PENDING",
		recordedBy: "u-admin",
		createdAt: daysAgo(4),
		deletedAt: null
	},
	{
		id: "p-5",
		memberId: "m-4",
		amount: 25e3,
		source: "BANK",
		reference: "IMPS/HDFC/998122",
		status: "ALLOCATED",
		recordedBy: "u-admin",
		createdAt: daysAgo(22),
		deletedAt: null
	},
	{
		id: "p-6",
		memberId: "m-6",
		amount: 16670,
		source: "BANK",
		reference: "UPI/PRIYA-NAIR",
		status: "PENDING",
		recordedBy: "u-admin",
		createdAt: daysAgo(2),
		deletedAt: null
	},
	{
		id: "p-7",
		memberId: "m-8",
		amount: 16670,
		source: "MANUAL",
		reference: "CASH-BLR-0811",
		status: "APPROVED",
		recordedBy: "u-admin",
		createdAt: daysAgo(28),
		deletedAt: null
	},
	{
		id: "p-8",
		memberId: "m-5",
		amount: 2e4,
		source: "BANK",
		reference: "NEFT/IOB/120994",
		status: "PENDING",
		recordedBy: "u-admin",
		createdAt: daysAgo(1),
		deletedAt: null
	}
];
var AUDIT = [
	{
		id: "a-1",
		userId: "u-super",
		roleName: "SUPER_ADMIN",
		action: "LOGIN",
		module: "auth",
		recordType: "User",
		recordId: "u-super",
		timestamp: daysAgo(1),
		result: "SUCCESS",
		reason: "",
		oldValue: "",
		newValue: ""
	},
	{
		id: "a-2",
		userId: "u-admin",
		roleName: "ADMIN",
		action: "CREATE_MEMBER",
		module: "members",
		recordType: "Member",
		recordId: "m-8",
		timestamp: daysAgo(100),
		result: "SUCCESS",
		reason: "",
		oldValue: "",
		newValue: "Venkatesh Rao"
	},
	{
		id: "a-3",
		userId: "u-admin",
		roleName: "ADMIN",
		action: "CREATE_PAYMENT",
		module: "payments",
		recordType: "Payment",
		recordId: "p-4",
		timestamp: daysAgo(4),
		result: "SUCCESS",
		reason: "",
		oldValue: "",
		newValue: "25000 MANUAL"
	},
	{
		id: "a-4",
		userId: "u-super",
		roleName: "SUPER_ADMIN",
		action: "REQUEST_DANGEROUS_ACTION",
		module: "developer",
		recordType: "DeveloperAction",
		recordId: "da-1",
		timestamp: daysAgo(3),
		result: "SUCCESS",
		reason: "Need to restore last week's backup after a bad import",
		oldValue: "",
		newValue: "database_restore"
	},
	{
		id: "a-5",
		userId: "u-member",
		roleName: "MEMBER",
		action: "LOGIN",
		module: "auth",
		recordType: "User",
		recordId: "u-member",
		timestamp: daysAgo(.2),
		result: "SUCCESS",
		reason: "",
		oldValue: "",
		newValue: ""
	},
	{
		id: "a-6",
		userId: "u-admin",
		roleName: "ADMIN",
		action: "ALLOCATE_PAYMENT",
		module: "payments",
		recordType: "Payment",
		recordId: "p-2",
		timestamp: daysAgo(12),
		result: "SUCCESS",
		reason: "",
		oldValue: "PENDING",
		newValue: "ALLOCATED 10000"
	}
];
function createSeedState() {
	return {
		sessionUserId: null,
		users: USERS,
		overrides: [],
		members: MEMBERS,
		schemes: [
			{
				id: "s-gold",
				name: "Aishwarya Gold 5L",
				totalAmount: 5e5,
				durationMonths: 20,
				installmentAmount: 25e3,
				startDate: GOLD_START,
				status: "ACTIVE",
				createdBy: "u-admin",
				createdAt: daysAgo(520)
			},
			{
				id: "s-silver",
				name: "Lakshmi Silver 2L",
				totalAmount: 2e5,
				durationMonths: 12,
				installmentAmount: 16670,
				startDate: SILVER_START,
				status: "ACTIVE",
				createdBy: "u-admin",
				createdAt: daysAgo(250)
			},
			{
				id: "s-harvest",
				name: "Harvest 3L",
				totalAmount: 3e5,
				durationMonths: 15,
				installmentAmount: 2e4,
				startDate: HARVEST_START,
				status: "ACTIVE",
				createdBy: "u-super",
				createdAt: daysAgo(95)
			}
		],
		enrollments: [
			{
				id: "mc-1",
				memberId: "m-1",
				chitSchemeId: "s-gold",
				enrolledAt: daysAgo(510),
				status: "ACTIVE"
			},
			{
				id: "mc-2",
				memberId: "m-2",
				chitSchemeId: "s-gold",
				enrolledAt: daysAgo(510),
				status: "ACTIVE"
			},
			{
				id: "mc-3",
				memberId: "m-3",
				chitSchemeId: "s-gold",
				enrolledAt: daysAgo(500),
				status: "ACTIVE"
			},
			{
				id: "mc-4",
				memberId: "m-4",
				chitSchemeId: "s-gold",
				enrolledAt: daysAgo(490),
				status: "ACTIVE"
			},
			{
				id: "mc-5",
				memberId: "m-5",
				chitSchemeId: "s-gold",
				enrolledAt: daysAgo(480),
				status: "ACTIVE"
			},
			{
				id: "mc-6",
				memberId: "m-6",
				chitSchemeId: "s-silver",
				enrolledAt: daysAgo(240),
				status: "ACTIVE"
			},
			{
				id: "mc-7",
				memberId: "m-7",
				chitSchemeId: "s-silver",
				enrolledAt: daysAgo(240),
				status: "ACTIVE"
			},
			{
				id: "mc-8",
				memberId: "m-8",
				chitSchemeId: "s-silver",
				enrolledAt: daysAgo(230),
				status: "ACTIVE"
			},
			{
				id: "mc-9",
				memberId: "m-1",
				chitSchemeId: "s-silver",
				enrolledAt: daysAgo(220),
				status: "ACTIVE"
			},
			{
				id: "mc-10",
				memberId: "m-4",
				chitSchemeId: "s-harvest",
				enrolledAt: daysAgo(90),
				status: "ACTIVE"
			},
			{
				id: "mc-11",
				memberId: "m-5",
				chitSchemeId: "s-harvest",
				enrolledAt: daysAgo(88),
				status: "ACTIVE"
			},
			{
				id: "mc-12",
				memberId: "m-3",
				chitSchemeId: "s-harvest",
				enrolledAt: daysAgo(85),
				status: "ACTIVE"
			}
		],
		installments: INSTALLMENTS,
		payments: PAYMENTS,
		allocations: [{
			id: "al-1",
			paymentId: "p-2",
			installmentId: "i-mc-1-16",
			amount: 1e4,
			allocatedBy: "u-admin",
			allocatedAt: daysAgo(12)
		}, {
			id: "al-2",
			paymentId: "p-5",
			installmentId: "i-mc-4-17",
			amount: 25e3,
			allocatedBy: "u-admin",
			allocatedAt: daysAgo(22)
		}],
		unmatched: [{
			id: "um-1",
			amount: 25e3,
			source: "BANK",
			rawReference: "ICICI NEFT: INR 25000 credited from UNKNOWN/UPI",
			receivedAt: daysAgo(3),
			status: "OPEN",
			resolvedPaymentId: null
		}, {
			id: "um-2",
			amount: 5e3,
			source: "BANK",
			rawReference: "HDFC NEFT 4412 — no member match",
			receivedAt: daysAgo(6),
			status: "OPEN",
			resolvedPaymentId: null
		}],
		audit: AUDIT,
		systemLogs: [
			{
				id: "sl-1",
				level: "INFO",
				source: "scheduler",
				message: "Reminder job skipped — APScheduler not wired in this demo.",
				timestamp: daysAgo(1)
			},
			{
				id: "sl-2",
				level: "WARNING",
				source: "bank",
				message: "Bank webhook: unmatched credit routed to the queue.",
				timestamp: daysAgo(3)
			},
			{
				id: "sl-3",
				level: "ERROR",
				source: "bank",
				message: "Mock adapter: HDFC sync delayed 12s (simulated).",
				timestamp: daysAgo(6)
			}
		],
		apiClients: [{
			id: "ac-2",
			name: "Mock bank webhook",
			clientId: "bank_wh_22c1",
			secretMasked: "••••••••e04b",
			scopes: "bank.webhook",
			isActive: true,
			rateLimitPerMinute: 120,
			createdAt: daysAgo(140),
			revokedAt: null
		}],
		apiLogs: [{
			id: "al-api-3",
			clientId: "bank_wh_22c1",
			endpoint: "/api/bank/webhook",
			method: "POST",
			statusCode: 200,
			timestamp: daysAgo(6),
			errorMessage: ""
		}],
		smsDevices: [],
		smsTxns: [],
		bankConnections: [{
			id: "bc-1",
			providerName: "mock",
			isEnabled: true,
			accountMasked: "XXXX4412",
			accountName: "Nidhi Chits — Collections",
			syncFrequencyMinutes: 60,
			lastSyncAt: daysAgo(.5)
		}],
		bankTxns: [{
			id: "bt-1",
			connectionId: "bc-1",
			amount: 5e3,
			reference: "HDFC NEFT 4412",
			transactionDate: dateDaysAgo(6),
			status: "UNMATCHED",
			processedPaymentId: null
		}, {
			id: "bt-2",
			connectionId: "bc-1",
			amount: 25e3,
			reference: "NEFT/SBIN/4419821",
			transactionDate: dateDaysAgo(40),
			status: "MATCHED",
			processedPaymentId: "p-1"
		}],
		actions: [{
			id: "da-1",
			requestedBy: "u-super",
			actionType: "database_restore",
			payload: "backup nidhi-2026-09-01.db",
			reason: "Need to restore last week's backup after a bad import",
			status: "PENDING",
			approvedBy: null,
			createdAt: daysAgo(3),
			decidedAt: null
		}],
		backups: [{
			id: "bk-1",
			filename: "nidhi-2026-09-01.db",
			sizeBytes: 482110,
			createdBy: "u-super",
			createdAt: daysAgo(7),
			reason: "Weekly snapshot"
		}],
		customFields: [{
			id: "cf-1",
			formKey: "member_form",
			fieldName: "aadhaar_last4",
			label: "Aadhaar (last 4)",
			fieldType: "text",
			required: false,
			visible: true,
			orderIndex: 10,
			helpText: "Stored as last four only"
		}, {
			id: "cf-2",
			formKey: "member_form",
			fieldName: "nominee_name",
			label: "Nominee",
			fieldType: "text",
			required: true,
			visible: true,
			orderIndex: 11,
			helpText: ""
		}],
		menuItems: [
			{
				id: "mi-1",
				label: "Dashboard",
				url: "/dashboard",
				icon: "LayoutDashboard",
				orderIndex: 0,
				requiredPermission: "",
				visible: true
			},
			{
				id: "mi-2",
				label: "Members",
				url: "/members",
				icon: "Users",
				orderIndex: 1,
				requiredPermission: "members.view",
				visible: true
			},
			{
				id: "mi-3",
				label: "Chits",
				url: "/chits",
				icon: "Layers",
				orderIndex: 2,
				requiredPermission: "chits.view",
				visible: true
			},
			{
				id: "mi-4",
				label: "Payments",
				url: "/payments",
				icon: "IndianRupee",
				orderIndex: 3,
				requiredPermission: "payments.view",
				visible: true
			}
		],
		reminders: [{
			id: "rm-1",
			memberId: "m-3",
			installmentId: "i-mc-3-16",
			channel: "IN_APP",
			message: "Nidhi: installment overdue on Aishwarya Gold 5L. Please remit ₹25,000.",
			status: "PENDING",
			scheduledFor: daysAgo(-1),
			sentAt: null
		}],
		modules: Object.fromEntries(MODULE_KEYS.map((k) => [k, true])),
		settings: {
			site_name: "Nidhi",
			company_info: "Nidhi Chits Pvt. Ltd.",
			contact_info: "operations@nidhi.local · +91 44 4000 1200",
			currency: "INR",
			date_format: "d MMM yyyy",
			timezone: "Asia/Kolkata",
			language: "en-IN",
			theme: "ledger",
			primary_color: "#1B4F8A",
			color_mode: "light",
			footer_content: "Chit operations desk — not a bank.",
			twilio_account_sid: "",
			twilio_auth_token: "",
			twilio_from_number: ""
		},
		smsOutbox: [],
		passwordResets: [],
		rolePerms: {
			SUPER_ADMIN: [...ROLE_DEFAULTS.SUPER_ADMIN],
			ADMIN: [...ROLE_DEFAULTS.ADMIN],
			MEMBER: [...ROLE_DEFAULTS.MEMBER]
		},
		alerts: [
			{
				id: "n-1",
				userId: "u-member",
				kind: "DUE",
				title: "Installment due",
				body: "Harvest Gold 2L installment is on the book. Open your profile to see the row.",
				href: "/profile",
				read: false,
				createdAt: daysAgo(2)
			},
			{
				id: "n-2",
				userId: "u-admin",
				kind: "SYSTEM",
				title: "2 unmatched receipts",
				body: "Bank rows waiting to be matched.",
				href: "/payments/unmatched",
				read: false,
				createdAt: daysAgo(1)
			},
			{
				id: "n-3",
				userId: "u-super",
				kind: "SYSTEM",
				title: "Dangerous action pending",
				body: "A restore request is waiting for your decision.",
				href: "/developer/actions",
				read: false,
				createdAt: daysAgo(3)
			}
		],
		workflows: {
			payment_approval: JSON.stringify({
				required: true,
				roles: ["ADMIN"]
			}),
			unmatched_payment: JSON.stringify({ auto_open: true }),
			reminder_workflow: JSON.stringify({
				days_before: 3,
				channel: "IN_APP"
			}),
			bank_sync_frequency: JSON.stringify({
				minutes: 60,
				mode: "mock"
			})
		},
		seq: {
			u: 20,
			m: 20,
			s: 20,
			mc: 20,
			i: 500,
			p: 20,
			al: 20,
			um: 20,
			a: 20,
			da: 20,
			cf: 20,
			mi: 20,
			ac: 20,
			sd: 20,
			bk: 20,
			sl: 20,
			rm: 20,
			ov: 20,
			sms: 20,
			pr: 20,
			n: 20
		}
	};
}
var DEMO_ACCOUNTS = [
	{
		role: "SUPER_ADMIN",
		username: "superadmin",
		password: "superadmin"
	},
	{
		role: "ADMIN",
		username: "admin",
		password: "admin"
	},
	{
		role: "MEMBER",
		username: "member",
		password: "member"
	}
];
function deny(msg) {
	return {
		ok: false,
		error: msg
	};
}
function fireWebAlert(title, body) {
	if (typeof window === "undefined" || typeof Notification === "undefined") return;
	if (Notification.permission !== "granted") return;
	try {
		new Notification(title, {
			body,
			icon: "/favicon.svg"
		});
	} catch {}
}
function slugUsername(fullName, existing) {
	const parts = fullName.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim().split(/\s+/).filter(Boolean);
	let base = parts[0] || "member";
	if (existing.some((u) => u.username === base) && parts[1]) base = `${parts[0]}.${parts[1]}`;
	let n = base;
	let i = 2;
	while (existing.some((u) => u.username === n)) {
		n = `${base}${i}`;
		i += 1;
	}
	return n;
}
var useAppStore = create()(persist((set, get) => {
	const seed = createSeedState();
	const currentUser = () => {
		const id = get().sessionUserId;
		if (!id) return null;
		return get().users.find((u) => u.id === id) ?? null;
	};
	const effectivePermissions = (user) => {
		const u = user === void 0 ? currentUser() : user;
		if (!u) return /* @__PURE__ */ new Set();
		if (u.role === "SUPER_ADMIN") return new Set(Object.keys(PERMISSIONS));
		const codes = new Set(get().rolePerms?.[u.role] ?? ROLE_DEFAULTS[u.role] ?? []);
		for (const ov of get().overrides.filter((o) => o.userId === u.id)) if (ov.grant) codes.add(ov.permissionCode);
		else codes.delete(ov.permissionCode);
		return codes;
	};
	const hasPermission = (code) => effectivePermissions().has(code);
	const requirePerm = (code) => {
		if (!hasPermission(code)) {
			get().log({
				action: "DENIED",
				module: code.split(".")[0] ?? "app",
				recordType: "",
				recordId: "",
				result: "DENIED",
				reason: `missing ${code}`,
				oldValue: "",
				newValue: ""
			});
			return false;
		}
		return true;
	};
	const nextId = (prefix) => {
		const n = get().seq[prefix] ?? 1;
		set({ seq: {
			...get().seq,
			[prefix]: n + 1
		} });
		return `${prefix}-${n}`;
	};
	const log = (entry) => {
		const u = currentUser();
		set({ audit: [{
			id: nextId("a"),
			userId: u?.id ?? null,
			roleName: u?.role ?? null,
			timestamp: nowISO(),
			result: entry.result ?? "SUCCESS",
			action: entry.action,
			module: entry.module,
			recordType: entry.recordType,
			recordId: String(entry.recordId),
			reason: entry.reason ?? "",
			oldValue: entry.oldValue ?? "",
			newValue: entry.newValue ?? ""
		}, ...get().audit].slice(0, 200) });
	};
	return {
		...seed,
		hasHydrated: false,
		pendingLogin: null,
		setHasHydrated: (v) => {
			set({ hasHydrated: v });
			if (!v) return;
			const pending = get().pendingLogin;
			if (!pending) return;
			set({ pendingLogin: null });
			if (pending.type === "as") get().loginAs(pending.username);
			else get().login(pending.username, pending.password);
		},
		currentUser,
		effectivePermissions,
		hasPermission,
		moduleEnabled: (key) => get().modules[key] !== false,
		nextId,
		log,
		visibleMembers: () => {
			const u = currentUser();
			const all = get().members.filter((m) => !m.deletedAt);
			if (!u) return [];
			if (u.role === "MEMBER") return all.filter((m) => m.id === u.memberId);
			return all;
		},
		login: (username, password) => {
			if (!get().hasHydrated) {
				set({ pendingLogin: {
					type: "form",
					username,
					password
				} });
				return { ok: true };
			}
			const user = get().users.find((u) => u.username.toLowerCase() === username.trim().toLowerCase());
			if (!user) return deny("Unknown username.");
			if (!user.isActive) return deny("This account is disabled.");
			if (user.lockedUntil && new Date(user.lockedUntil).getTime() > Date.now()) return deny("Account locked after repeated failures. Try again later.");
			if (user.password !== password) {
				const fails = user.failedLoginCount + 1;
				const lockedUntil = fails >= 5 ? new Date(Date.now() + 3e5).toISOString() : null;
				set({ users: get().users.map((u) => u.id === user.id ? {
					...u,
					failedLoginCount: fails,
					lockedUntil
				} : u) });
				log({
					action: "LOGIN",
					module: "auth",
					recordType: "User",
					recordId: user.id,
					result: "DENIED",
					reason: "bad password",
					oldValue: "",
					newValue: ""
				});
				return deny(lockedUntil ? "Too many attempts. Locked for 5 minutes." : "Incorrect password.");
			}
			set({
				sessionUserId: user.id,
				users: get().users.map((u) => u.id === user.id ? {
					...u,
					failedLoginCount: 0,
					lockedUntil: null
				} : u)
			});
			log({
				action: "LOGIN",
				module: "auth",
				recordType: "User",
				recordId: user.id,
				result: "SUCCESS",
				reason: "",
				oldValue: "",
				newValue: ""
			});
			return { ok: true };
		},
		loginAs: (username) => {
			if (!get().hasHydrated) {
				set({ pendingLogin: {
					type: "as",
					username
				} });
				return { ok: true };
			}
			const user = get().users.find((u) => u.username === username);
			if (!user || !user.isActive) return deny("Account unavailable.");
			set({ sessionUserId: user.id });
			log({
				action: "LOGIN",
				module: "auth",
				recordType: "User",
				recordId: user.id,
				result: "SUCCESS",
				reason: "demo quick-enter",
				oldValue: "",
				newValue: ""
			});
			return { ok: true };
		},
		logout: () => {
			const u = currentUser();
			if (u) log({
				action: "LOGOUT",
				module: "auth",
				recordType: "User",
				recordId: u.id,
				result: "SUCCESS",
				reason: "",
				oldValue: "",
				newValue: ""
			});
			set({ sessionUserId: null });
		},
		createMember: (data) => {
			if (!requirePerm("members.create")) return deny("You cannot create members.");
			if (!get().modules.member_management) return deny("Member module is disabled.");
			if (get().members.some((m) => m.phone === data.phone && !m.deletedAt)) return deny("A member with this phone already exists.");
			const id = nextId("m");
			const member = {
				id,
				fullName: data.fullName.trim(),
				phone: data.phone.trim(),
				email: data.email.trim(),
				address: data.address.trim(),
				city: data.city.trim(),
				assignedStaffId: data.assignedStaffId,
				isActive: true,
				createdAt: nowISO(),
				deletedAt: null
			};
			set({ members: [member, ...get().members] });
			log({
				action: "CREATE_MEMBER",
				module: "members",
				recordType: "Member",
				recordId: id,
				reason: "",
				oldValue: "",
				newValue: member.fullName
			});
			return {
				ok: true,
				id
			};
		},
		updateMember: (id, data) => {
			if (!requirePerm("members.edit")) return deny("You cannot edit members.");
			const existing = get().visibleMembers().find((m) => m.id === id);
			if (!existing) return deny("Member not found or not accessible.");
			set({ members: get().members.map((m) => m.id === id ? {
				...m,
				...data
			} : m) });
			log({
				action: "EDIT_MEMBER",
				module: "members",
				recordType: "Member",
				recordId: id,
				reason: "",
				oldValue: existing.fullName,
				newValue: data.fullName ?? existing.fullName
			});
			return { ok: true };
		},
		softDeleteMember: (id, reason) => {
			if (!requirePerm("members.delete")) return deny("You cannot delete members.");
			if (!reason.trim()) return deny("A reason is required to delete a member.");
			set({ members: get().members.map((m) => m.id === id ? {
				...m,
				deletedAt: nowISO(),
				isActive: false
			} : m) });
			log({
				action: "DELETE_MEMBER",
				module: "members",
				recordType: "Member",
				recordId: id,
				reason: reason.trim(),
				oldValue: "",
				newValue: "soft-deleted"
			});
			return { ok: true };
		},
		createScheme: (data) => {
			if (!requirePerm("chits.create")) return deny("You cannot create schemes.");
			if (!get().modules.chit_management) return deny("Chit module is disabled.");
			const id = nextId("s");
			set({ schemes: [{
				id,
				name: data.name.trim(),
				totalAmount: data.totalAmount,
				durationMonths: data.durationMonths,
				installmentAmount: data.installmentAmount,
				startDate: data.startDate,
				status: "ACTIVE",
				createdBy: currentUser()?.id ?? "",
				createdAt: nowISO()
			}, ...get().schemes] });
			log({
				action: "CREATE_CHIT",
				module: "chits",
				recordType: "ChitScheme",
				recordId: id,
				reason: "",
				oldValue: "",
				newValue: data.name
			});
			return {
				ok: true,
				id
			};
		},
		enrollMember: (schemeId, memberId) => {
			if (!requirePerm("chits.edit")) return deny("You cannot enroll members.");
			if (get().enrollments.some((e) => e.chitSchemeId === schemeId && e.memberId === memberId)) return deny("Member is already enrolled in this scheme.");
			const id = nextId("mc");
			set({ enrollments: [{
				id,
				memberId,
				chitSchemeId: schemeId,
				enrolledAt: nowISO(),
				status: "ACTIVE"
			}, ...get().enrollments] });
			log({
				action: "ENROLL_MEMBER_IN_CHIT",
				module: "chits",
				recordType: "MemberChit",
				recordId: id,
				reason: "",
				oldValue: "",
				newValue: `${memberId} → ${schemeId}`
			});
			return { ok: true };
		},
		generateInstallments: (schemeId) => {
			if (!requirePerm("installments.generate")) return deny("You cannot generate installments.");
			if (!get().modules.installments) return deny("Installments module is disabled.");
			const scheme = get().schemes.find((s) => s.id === schemeId);
			if (!scheme) return deny("Scheme not found.");
			const enrollments = get().enrollments.filter((e) => e.chitSchemeId === schemeId);
			const existing = get().installments;
			const created = [];
			for (const enr of enrollments) {
				const have = new Set(existing.filter((i) => i.memberChitId === enr.id).map((i) => i.installmentNumber));
				for (let n = 1; n <= scheme.durationMonths; n++) {
					if (have.has(n)) continue;
					const dueDate = addMonthsISO(scheme.startDate, n - 1);
					created.push({
						id: nextId("i"),
						memberChitId: enr.id,
						installmentNumber: n,
						dueDate,
						amountDue: scheme.installmentAmount,
						amountPaid: 0,
						status: dueDate < todayISO() ? "OVERDUE" : "PENDING",
						locked: false
					});
				}
			}
			set({ installments: [...get().installments, ...created] });
			log({
				action: "GENERATE_INSTALLMENTS",
				module: "installments",
				recordType: "ChitScheme",
				recordId: schemeId,
				reason: "",
				oldValue: "",
				newValue: `created=${created.length}`
			});
			return {
				ok: true,
				created: created.length
			};
		},
		createPayment: (data) => {
			if (!requirePerm("payments.create")) return deny("You cannot record payments.");
			if (!get().modules.manual_payments && (data.source ?? "MANUAL") === "MANUAL") return deny("Manual payments module is disabled.");
			const id = nextId("p");
			set({ payments: [{
				id,
				memberId: data.memberId,
				amount: data.amount,
				source: data.source ?? "MANUAL",
				reference: data.reference.trim(),
				status: "PENDING",
				recordedBy: currentUser()?.id ?? "",
				createdAt: nowISO(),
				deletedAt: null
			}, ...get().payments] });
			log({
				action: "CREATE_PAYMENT",
				module: "payments",
				recordType: "Payment",
				recordId: id,
				reason: "",
				oldValue: "",
				newValue: String(data.amount)
			});
			const member = get().members.find((m) => m.id === data.memberId);
			if (member) {
				const portal = get().users.find((u) => u.memberId === member.id && u.isActive);
				if (portal) get().notifyAccount({
					userId: portal.id,
					kind: "PAYMENT",
					title: "Payment recorded",
					body: `A ${data.source ?? "MANUAL"} payment of ${formatINR(data.amount)} is on your book.`,
					href: "/profile"
				});
			}
			return {
				ok: true,
				id
			};
		},
		allocatePayment: (paymentId, installmentId, amount) => {
			if (!requirePerm("payments.allocate")) return deny("You cannot allocate payments.");
			if (!get().payments.find((p) => p.id === paymentId && !p.deletedAt)) return deny("Payment not found.");
			const inst = get().installments.find((i) => i.id === installmentId);
			if (!inst) return deny("Installment not found.");
			if (inst.locked) return deny("Installment is locked (already paid). Editing it needs approval.");
			const newPaid = inst.amountPaid + amount;
			const status = newPaid >= inst.amountDue ? "PAID" : "PARTIAL";
			const locked = status === "PAID";
			set({
				allocations: [{
					id: nextId("al"),
					paymentId,
					installmentId,
					amount,
					allocatedBy: currentUser()?.id ?? "",
					allocatedAt: nowISO()
				}, ...get().allocations],
				installments: get().installments.map((i) => i.id === installmentId ? {
					...i,
					amountPaid: newPaid,
					status,
					locked
				} : i),
				payments: get().payments.map((p) => p.id === paymentId ? {
					...p,
					status: "ALLOCATED"
				} : p)
			});
			log({
				action: "ALLOCATE_PAYMENT",
				module: "payments",
				recordType: "Payment",
				recordId: paymentId,
				reason: "",
				oldValue: "",
				newValue: `installment=${installmentId}, amount=${amount}`
			});
			return { ok: true };
		},
		approvePayment: (paymentId) => {
			if (!requirePerm("payments.approve")) return deny("You cannot approve payments.");
			set({ payments: get().payments.map((p) => p.id === paymentId ? {
				...p,
				status: "APPROVED"
			} : p) });
			log({
				action: "APPROVE_PAYMENT",
				module: "payments",
				recordType: "Payment",
				recordId: paymentId,
				reason: "",
				oldValue: "PENDING",
				newValue: "APPROVED"
			});
			return { ok: true };
		},
		softDeletePayment: (paymentId, reason) => {
			if (!requirePerm("payments.delete")) return deny("You cannot delete payments.");
			if (!reason.trim()) return deny("A reason is required to delete a payment.");
			set({ payments: get().payments.map((p) => p.id === paymentId ? {
				...p,
				deletedAt: nowISO(),
				status: "REVERSED"
			} : p) });
			log({
				action: "DELETE_PAYMENT",
				module: "payments",
				recordType: "Payment",
				recordId: paymentId,
				reason: reason.trim(),
				oldValue: "",
				newValue: "soft-deleted"
			});
			return { ok: true };
		},
		resolveUnmatched: (id, memberId) => {
			const perms = effectivePermissions();
			if (!perms.has("payments.approve") && !perms.has("payments.allocate") && !perms.has("payments.create")) return deny("You cannot resolve unmatched payments.");
			const item = get().unmatched.find((u) => u.id === id);
			if (!item) return deny("Not found.");
			const pid = nextId("p");
			set({
				payments: [{
					id: pid,
					memberId,
					amount: item.amount,
					source: item.source,
					reference: item.rawReference.slice(0, 80),
					status: "PENDING",
					recordedBy: currentUser()?.id ?? "",
					createdAt: nowISO(),
					deletedAt: null
				}, ...get().payments],
				unmatched: get().unmatched.map((u) => u.id === id ? {
					...u,
					status: "RESOLVED",
					resolvedPaymentId: pid
				} : u)
			});
			log({
				action: "RESOLVE_UNMATCHED",
				module: "payments",
				recordType: "UnmatchedPayment",
				recordId: id,
				reason: "",
				oldValue: "OPEN",
				newValue: memberId
			});
			return { ok: true };
		},
		ignoreUnmatched: (id) => {
			set({ unmatched: get().unmatched.map((u) => u.id === id ? {
				...u,
				status: "IGNORED"
			} : u) });
			return { ok: true };
		},
		createUser: (data) => {
			if (!requirePerm("users.create")) return deny("You cannot create users.");
			if (data.role === "SUPER_ADMIN" && !hasPermission("users.assign_superadmin")) return deny("Only a Super Admin can create another Super Admin.");
			if (data.role === "MEMBER") {
				if (!data.memberId) return deny("A Member login must be linked to a subscriber.");
				if (!get().members.some((m) => m.id === data.memberId && !m.deletedAt)) return deny("Linked member not found.");
				if (get().users.some((u) => u.memberId === data.memberId)) return deny("This subscriber already has a portal login.");
			}
			if (get().users.some((u) => u.username === data.username || u.email === data.email)) return deny("Username or email already exists.");
			const id = nextId("u");
			set({ users: [...get().users, {
				id,
				username: data.username.trim(),
				email: data.email.trim(),
				password: data.password,
				role: data.role,
				isActive: true,
				failedLoginCount: 0,
				lockedUntil: null,
				memberId: data.role === "MEMBER" ? data.memberId ?? null : null,
				createdAt: nowISO()
			}] });
			log({
				action: "CREATE_USER",
				module: "users",
				recordType: "User",
				recordId: id,
				reason: "",
				oldValue: "",
				newValue: `${data.username}, ${data.role}`
			});
			return {
				ok: true,
				id
			};
		},
		issueMemberLogin: (memberId) => {
			if (!requirePerm("users.create")) return deny("You cannot issue a portal login.");
			const member = get().members.find((m) => m.id === memberId && !m.deletedAt);
			if (!member) return deny("Member not found.");
			const existing = get().users.find((u) => u.memberId === memberId);
			if (existing) return {
				ok: true,
				username: existing.username,
				password: existing.password
			};
			const username = slugUsername(member.fullName, get().users);
			const password = username;
			const created = get().createUser({
				username,
				email: `${username}@nidhi.local`,
				password,
				role: "MEMBER",
				memberId
			});
			if (!created.ok) return created;
			get().notifyAccount({
				userId: created.id,
				kind: "LOGIN",
				title: "Portal login issued",
				body: `User ID ${username}. Open Sign in with the password shown to the floor.`,
				href: "/profile"
			});
			log({
				action: "ISSUE_MEMBER_LOGIN",
				module: "users",
				recordType: "User",
				recordId: created.id,
				reason: "",
				oldValue: "",
				newValue: `${username} → ${memberId}`
			});
			return {
				ok: true,
				username,
				password
			};
		},
		disableUser: (id) => {
			if (!requirePerm("users.delete")) return deny("You cannot disable users.");
			const target = get().users.find((u) => u.id === id);
			if (!target) return deny("User not found.");
			if (target.role === "SUPER_ADMIN" && currentUser()?.role !== "SUPER_ADMIN") return deny("Cannot disable a Super Admin.");
			if (id === currentUser()?.id) return deny("You cannot disable your own session.");
			set({ users: get().users.map((u) => u.id === id ? {
				...u,
				isActive: false
			} : u) });
			log({
				action: "DISABLE_USER",
				module: "users",
				recordType: "User",
				recordId: id,
				reason: "",
				oldValue: "active",
				newValue: "disabled"
			});
			return { ok: true };
		},
		enableUser: (id) => {
			if (!requirePerm("users.edit")) return deny("You cannot enable users.");
			set({ users: get().users.map((u) => u.id === id ? {
				...u,
				isActive: true,
				failedLoginCount: 0,
				lockedUntil: null
			} : u) });
			return { ok: true };
		},
		changeRole: (id, role) => {
			if (!requirePerm("users.assign_roles")) return deny("You cannot change roles.");
			if (role === "SUPER_ADMIN" && !hasPermission("users.assign_superadmin")) return deny("Only Super Admin can grant the Super Admin role.");
			const target = get().users.find((u) => u.id === id);
			if (!target) return deny("User not found.");
			if (target.role === "SUPER_ADMIN" && currentUser()?.role !== "SUPER_ADMIN") return deny("Only Super Admin can change a Super Admin's role.");
			set({ users: get().users.map((u) => u.id === id ? {
				...u,
				role
			} : u) });
			log({
				action: "CHANGE_ROLE",
				module: "users",
				recordType: "User",
				recordId: id,
				reason: "",
				oldValue: target.role,
				newValue: role
			});
			return { ok: true };
		},
		setOverride: (userId, permissionCode, grant, reason) => {
			if (!requirePerm("users.manage_permissions")) return deny("You cannot manage permissions.");
			if (!reason.trim()) return deny("A reason is required.");
			const existing = get().overrides.find((o) => o.userId === userId && o.permissionCode === permissionCode);
			if (existing) set({ overrides: get().overrides.map((o) => o.id === existing.id ? {
				...o,
				grant,
				reason: reason.trim(),
				grantedBy: currentUser()?.id ?? "",
				createdAt: nowISO()
			} : o) });
			else set({ overrides: [...get().overrides, {
				id: nextId("ov"),
				userId,
				permissionCode,
				grant,
				reason: reason.trim(),
				grantedBy: currentUser()?.id ?? "",
				createdAt: nowISO()
			}] });
			log({
				action: "SET_USER_PERMISSION",
				module: "users",
				recordType: "User",
				recordId: userId,
				reason: reason.trim(),
				oldValue: "",
				newValue: `${permissionCode}=${grant}`
			});
			return { ok: true };
		},
		setRolePermissions: (role, codes) => {
			if (currentUser()?.role !== "SUPER_ADMIN") return deny("Only Super Admin can edit role defaults.");
			if (role === "SUPER_ADMIN") return deny("Super Admin's permission set cannot be reduced.");
			ROLE_DEFAULTS[role] = [...codes];
			set({ rolePerms: {
				...get().rolePerms,
				[role]: [...codes]
			} });
			log({
				action: "UPDATE_ROLE_PERMISSIONS",
				module: "roles",
				recordType: "Role",
				recordId: role,
				reason: "",
				oldValue: "",
				newValue: codes.join(",")
			});
			set({ seq: { ...get().seq } });
			return { ok: true };
		},
		toggleModule: (key, enabled) => {
			if (!requirePerm("developer.modules")) return deny("You cannot toggle modules.");
			if (key === "developer_console" && !enabled && currentUser()?.role !== "SUPER_ADMIN") return deny("Only Super Admin may disable the Developer Console.");
			set({ modules: {
				...get().modules,
				[key]: enabled
			} });
			log({
				action: "TOGGLE_MODULE",
				module: "developer",
				recordType: "ModuleSetting",
				recordId: key,
				reason: "",
				oldValue: String(!enabled),
				newValue: String(enabled)
			});
			return { ok: true };
		},
		updateSettings: (patch) => {
			set({ settings: {
				...get().settings,
				...patch
			} });
			log({
				action: "UPDATE_WEBSITE_SETTINGS",
				module: "developer",
				recordType: "SystemSetting",
				recordId: "settings",
				reason: "",
				oldValue: "",
				newValue: Object.keys(patch).join(",")
			});
		},
		updateWorkflow: (key, json) => {
			try {
				JSON.parse(json);
			} catch {
				return deny("Config must be valid JSON.");
			}
			set({ workflows: {
				...get().workflows,
				[key]: json
			} });
			return { ok: true };
		},
		addCustomField: (data) => {
			if (!(/* @__PURE__ */ new Set([
				"text",
				"number",
				"date",
				"select",
				"checkbox",
				"textarea",
				"email",
				"phone"
			])).has(data.fieldType)) return deny("Unsupported field type.");
			set({ customFields: [...get().customFields, {
				id: nextId("cf"),
				formKey: data.formKey,
				fieldName: data.fieldName,
				label: data.label,
				fieldType: data.fieldType,
				required: data.required,
				visible: true,
				orderIndex: get().customFields.length,
				helpText: data.helpText
			}] });
			return { ok: true };
		},
		addMenuItem: (data) => {
			set({ menuItems: [...get().menuItems, {
				id: nextId("mi"),
				label: data.label,
				url: data.url,
				icon: data.icon,
				orderIndex: get().menuItems.length,
				requiredPermission: data.requiredPermission,
				visible: true
			}] });
		},
		createApiClient: (name, scopes) => {
			if (!requirePerm("developer.api")) return deny("You cannot manage API clients.");
			const suffix = Math.random().toString(16).slice(2, 6);
			set({ apiClients: [...get().apiClients, {
				id: nextId("ac"),
				name,
				clientId: `cli_${suffix}`,
				secretMasked: `••••••••${suffix}`,
				scopes,
				isActive: true,
				rateLimitPerMinute: 60,
				createdAt: nowISO(),
				revokedAt: null
			}] });
			return { ok: true };
		},
		revokeApiClient: (id) => {
			set({ apiClients: get().apiClients.map((c) => c.id === id ? {
				...c,
				isActive: false,
				revokedAt: nowISO()
			} : c) });
		},
		mockBankSync: () => {
			const fetched = 1;
			set({
				systemLogs: [{
					id: nextId("sl"),
					level: "INFO",
					source: "bank",
					message: "Mock bank sync completed.",
					timestamp: nowISO()
				}, ...get().systemLogs],
				bankConnections: get().bankConnections.map((c) => ({
					...c,
					lastSyncAt: nowISO()
				}))
			});
			return {
				ok: true,
				fetched
			};
		},
		requestDangerousAction: (actionType, reason, payload) => {
			if (!reason.trim()) return deny("A reason is required.");
			const id = nextId("da");
			set({ actions: [{
				id,
				requestedBy: currentUser()?.id ?? "",
				actionType,
				payload,
				reason: reason.trim(),
				status: "PENDING",
				approvedBy: null,
				createdAt: nowISO(),
				decidedAt: null
			}, ...get().actions] });
			log({
				action: "REQUEST_DANGEROUS_ACTION",
				module: "developer",
				recordType: "DeveloperAction",
				recordId: id,
				reason: reason.trim(),
				oldValue: "",
				newValue: actionType
			});
			return { ok: true };
		},
		decideAction: (id, approve) => {
			if (currentUser()?.role !== "SUPER_ADMIN") return deny("Only Super Admin can approve dangerous actions.");
			set({ actions: get().actions.map((a) => a.id === id ? {
				...a,
				status: approve ? "APPROVED" : "REJECTED",
				approvedBy: currentUser()?.id ?? null,
				decidedAt: nowISO()
			} : a) });
			log({
				action: approve ? "APPROVE_DANGEROUS_ACTION" : "REJECT_DANGEROUS_ACTION",
				module: "developer",
				recordType: "DeveloperAction",
				recordId: id,
				reason: "",
				oldValue: "PENDING",
				newValue: approve ? "APPROVED" : "REJECTED"
			});
			return { ok: true };
		},
		createBackup: (reason) => {
			if (!requirePerm("developer.backup")) return deny("You cannot create backups.");
			const stamp = todayISO();
			set({ backups: [{
				id: nextId("bk"),
				filename: `nidhi-${stamp}.db`,
				sizeBytes: 4e5 + Math.floor(Math.random() * 8e4),
				createdBy: currentUser()?.id ?? "",
				createdAt: nowISO(),
				reason: reason || "Manual snapshot"
			}, ...get().backups] });
			return { ok: true };
		},
		sendReminder: (id) => {
			const reminder = get().reminders.find((r) => r.id === id);
			set({ reminders: get().reminders.map((r) => r.id === id ? {
				...r,
				status: "SENT",
				sentAt: nowISO()
			} : r) });
			if (reminder) {
				const portal = get().users.find((u) => u.memberId === reminder.memberId && u.isActive);
				if (portal) get().notifyAccount({
					userId: portal.id,
					kind: "DUE",
					title: "Collection reminder",
					body: reminder.message,
					href: "/profile"
				});
			}
		},
		notifyAccount: (data) => {
			set({ alerts: [{
				id: nextId("n"),
				userId: data.userId,
				kind: data.kind,
				title: data.title,
				body: data.body,
				href: data.href ?? "/dashboard",
				read: false,
				createdAt: nowISO()
			}, ...get().alerts ?? []].slice(0, 300) });
			if (get().sessionUserId === data.userId) fireWebAlert(data.title, data.body);
		},
		markAlertRead: (id) => {
			set({ alerts: (get().alerts ?? []).map((a) => a.id === id ? {
				...a,
				read: true
			} : a) });
		},
		markAllAlertsRead: () => {
			const uid = currentUser()?.id;
			if (!uid) return;
			set({ alerts: (get().alerts ?? []).map((a) => a.userId === uid ? {
				...a,
				read: true
			} : a) });
		},
		requestPasswordReset: (phone, otp) => {
			const d = phone.replace(/\D/g, "").slice(-10);
			if (d.length < 10) return deny("Enter the 10-digit mobile on the member record.");
			if (!/^\d{6}$/.test(otp)) return deny("OTP generator failed. Try again.");
			const member = get().members.find((m) => !m.deletedAt && m.phone.replace(/\D/g, "").slice(-10) === d);
			if (!member) return deny("No subscriber with that mobile.");
			const portal = get().users.find((u) => u.memberId === member.id && u.isActive);
			if (!portal) return deny("No portal login on this mobile yet. Ask the floor to issue one.");
			const expiresAt = new Date(Date.now() + 6e5).toISOString();
			set({ passwordResets: [{
				id: nextId("pr"),
				memberId: member.id,
				phone: member.phone,
				otp,
				expiresAt,
				used: false,
				createdAt: nowISO()
			}, ...get().passwordResets ?? []].slice(0, 50) });
			get().notifyAccount({
				userId: portal.id,
				kind: "OTP",
				title: "Password reset code",
				body: `A 6-digit code was issued for this account. It expires in 10 minutes.`,
				href: "/forgot"
			});
			log({
				action: "PASSWORD_RESET_OTP",
				module: "auth",
				recordType: "Member",
				recordId: member.id,
				reason: "python otp",
				oldValue: "",
				newValue: "in-app"
			});
			return {
				ok: true,
				toPhone: member.phone
			};
		},
		confirmPasswordReset: (phone, otp, newPassword) => {
			if (newPassword.trim().length < 4) return deny("Password must be at least 4 characters.");
			const d = phone.replace(/\D/g, "").slice(-10);
			const reset = (get().passwordResets ?? []).find((r) => !r.used && r.phone.replace(/\D/g, "").slice(-10) === d && r.otp === otp.trim());
			if (!reset) return deny("Invalid or expired code.");
			if (new Date(reset.expiresAt).getTime() < Date.now()) return deny("That code has expired. Request a new one.");
			const portal = get().users.find((u) => u.memberId === reset.memberId);
			if (!portal) return deny("Portal login not found.");
			set({
				users: get().users.map((u) => u.id === portal.id ? {
					...u,
					password: newPassword.trim(),
					failedLoginCount: 0,
					lockedUntil: null
				} : u),
				passwordResets: get().passwordResets.map((r) => r.id === reset.id ? {
					...r,
					used: true
				} : r)
			});
			log({
				action: "PASSWORD_RESET",
				module: "auth",
				recordType: "User",
				recordId: portal.id,
				reason: "mobile otp",
				oldValue: "",
				newValue: portal.username
			});
			return { ok: true };
		},
		setUserPassword: (userId, password) => {
			if (!hasPermission("users.reset_password") && !hasPermission("users.edit")) return deny("You cannot reset passwords.");
			if (password.trim().length < 4) return deny("Password must be at least 4 characters.");
			const target = get().users.find((u) => u.id === userId);
			if (!target) return deny("User not found.");
			set({ users: get().users.map((u) => u.id === userId ? {
				...u,
				password: password.trim()
			} : u) });
			if (target.memberId) get().notifyAccount({
				userId: target.id,
				kind: "LOGIN",
				title: "Password changed by the house",
				body: `Your portal password was reset. User ID ${target.username}.`,
				href: "/profile"
			});
			return { ok: true };
		},
		sendDueReminders: () => {
			if (!requirePerm("reminders.send")) return deny("You cannot send reminders.");
			const overdue = get().installments.filter((i) => i.status === "OVERDUE");
			let sent = 0;
			const seen = /* @__PURE__ */ new Set();
			for (const inst of overdue) {
				const enr = get().enrollments.find((e) => e.id === inst.memberChitId);
				if (!enr) continue;
				const member = get().members.find((m) => m.id === enr.memberId && !m.deletedAt);
				const scheme = get().schemes.find((s) => s.id === enr.chitSchemeId);
				if (!member) continue;
				const key = `${member.id}:${inst.id}`;
				if (seen.has(key)) continue;
				seen.add(key);
				const portal = get().users.find((u) => u.memberId === member.id && u.isActive);
				if (!portal) continue;
				get().notifyAccount({
					userId: portal.id,
					kind: "DUE",
					title: "Overdue installment",
					body: `Installment #${inst.installmentNumber} on ${scheme?.name ?? "your chit"} is overdue. Please remit ${formatINR(inst.amountDue - inst.amountPaid)}.`,
					href: "/profile"
				});
				sent += 1;
			}
			return {
				ok: true,
				sent
			};
		},
		resetDemo: () => {
			set({
				...createSeedState(),
				hasHydrated: true,
				sessionUserId: null
			});
		}
	};
}, {
	name: "nidhi-chit-desk-v3",
	storage: createJSONStorage(() => {
		if (typeof window === "undefined") return {
			getItem: () => null,
			setItem: () => {},
			removeItem: () => {}
		};
		return localStorage;
	}),
	skipHydration: true,
	merge: (persisted, current) => {
		const p = persisted ?? {};
		const asLedgerSource = (row) => row.source === "SMS" ? {
			...row,
			source: "BANK"
		} : row;
		const payments = (p.payments ?? current.payments).map(asLedgerSource);
		const unmatched = (p.unmatched ?? current.unmatched).map(asLedgerSource);
		const reminders = (p.reminders ?? current.reminders).map((r) => r.channel === "SMS" ? {
			...r,
			channel: "IN_APP"
		} : r);
		const rolePerms = { ...p.rolePerms ?? current.rolePerms };
		if (rolePerms.ADMIN) rolePerms.ADMIN = rolePerms.ADMIN.filter((c) => !c.startsWith("sms."));
		return {
			...current,
			...p,
			payments,
			unmatched,
			reminders,
			smsDevices: [],
			smsTxns: [],
			smsOutbox: [],
			passwordResets: p.passwordResets ?? current.passwordResets ?? [],
			alerts: p.alerts ?? current.alerts ?? [],
			rolePerms,
			settings: {
				...current.settings,
				...p.settings ?? {}
			}
		};
	},
	onRehydrateStorage: () => (state) => {
		state?.setHasHydrated(true);
	},
	partialize: (s) => {
		const { hasHydrated: _h, ...rest } = s;
		const omit = /* @__PURE__ */ new Set([
			"login",
			"loginAs",
			"logout",
			"currentUser",
			"effectivePermissions",
			"hasPermission",
			"moduleEnabled",
			"visibleMembers",
			"nextId",
			"log",
			"createMember",
			"updateMember",
			"softDeleteMember",
			"createScheme",
			"enrollMember",
			"generateInstallments",
			"createPayment",
			"allocatePayment",
			"approvePayment",
			"softDeletePayment",
			"resolveUnmatched",
			"ignoreUnmatched",
			"createUser",
			"issueMemberLogin",
			"disableUser",
			"enableUser",
			"changeRole",
			"setOverride",
			"setRolePermissions",
			"toggleModule",
			"updateSettings",
			"updateWorkflow",
			"addCustomField",
			"addMenuItem",
			"createApiClient",
			"revokeApiClient",
			"mockBankSync",
			"requestDangerousAction",
			"decideAction",
			"createBackup",
			"sendReminder",
			"notifyAccount",
			"markAlertRead",
			"markAllAlertsRead",
			"requestPasswordReset",
			"confirmPasswordReset",
			"setUserPassword",
			"sendDueReminders",
			"resetDemo",
			"setHasHydrated",
			"pendingLogin"
		]);
		const data = {};
		for (const [k, v] of Object.entries(rest)) if (!omit.has(k) && typeof v !== "function") data[k] = v;
		return data;
	}
}));
if (typeof window !== "undefined") useAppStore.persist.rehydrate();
function HydrateGate({ children }) {
	(0, import_react.useEffect)(() => {
		const persist = useAppStore.persist;
		if (!persist) {
			useAppStore.getState().setHasHydrated(true);
			return;
		}
		let cancelled = false;
		const mark = () => {
			if (!cancelled) useAppStore.getState().setHasHydrated(true);
		};
		const unsub = persist.onFinishHydration(mark);
		Promise.resolve(persist.rehydrate()).then(mark);
		return () => {
			cancelled = true;
			unsub?.();
		};
	}, []);
	return children;
}
var styles_default = "/assets/styles-DADVfohg.css";
var APP_NAME = "Nidhi";
var Route$25 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Nidhi — chit fund operations desk for members, schemes, collections, and controls."
			},
			{
				name: "theme-color",
				content: "#10192b"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,500&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "min-h-dvh bg-bg font-sans text-ink",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HydrateGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
					position: "bottom-right",
					toastOptions: {
						className: "font-sans",
						style: {
							background: "#fbf7ee",
							color: "#152033",
							border: "1px solid #d6ccb6"
						}
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	})
});
var $$splitComponentImporter$24 = () => import("./routes-B5oATX5b.mjs");
var Route$24 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$24, "component") });
var $$splitComponentImporter$23 = () => import("./route-UcFae9uv.mjs");
var Route$23 = createFileRoute("/_app")({ component: lazyRouteComponent($$splitComponentImporter$23, "component") });
var $$splitComponentImporter$22 = () => import("./forgot-aGa0QcbW.mjs");
var Route$22 = createFileRoute("/forgot")({ component: lazyRouteComponent($$splitComponentImporter$22, "component") });
var $$splitComponentImporter$21 = () => import("./audit-Btd6AtQk.mjs");
var Route$21 = createFileRoute("/_app/audit")({ component: lazyRouteComponent($$splitComponentImporter$21, "component") });
var $$splitComponentImporter$20 = () => import("./dashboard-CehMQ7dL.mjs");
var Route$20 = createFileRoute("/_app/dashboard")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
var $$splitComponentImporter$19 = () => import("./house-DqiBA-Sx.mjs");
var Route$19 = createFileRoute("/_app/house")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
var $$splitComponentImporter$18 = () => import("./instructions-BtJa4Wu-.mjs");
var Route$18 = createFileRoute("/_app/instructions")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./notifications-TKTQTQIu.mjs");
var Route$17 = createFileRoute("/_app/notifications")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./profile-Cowfa8u3.mjs");
var Route$16 = createFileRoute("/_app/profile")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./reports-HlA4V9Jh.mjs");
var Route$15 = createFileRoute("/_app/reports")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./roles-DOydfOlj.mjs");
var Route$14 = createFileRoute("/_app/roles")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./chits-ZU6h-AwV.mjs");
var Route$13 = createFileRoute("/_app/chits/")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("../_schemeId-DlpsWS5_.mjs");
var Route$12 = createFileRoute("/_app/chits/$schemeId")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./new-DA6OpNvN.mjs");
var Route$11 = createFileRoute("/_app/chits/new")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./developer-CmRJp4Sa.mjs");
var Route$10 = createFileRoute("/_app/developer/")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("../_section-DfmENOOj.mjs");
var Route$9 = createFileRoute("/_app/developer/$section")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./members-D-Lt1nS5.mjs");
var Route$8 = createFileRoute("/_app/members/")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("../_memberId-Cm1F3Wnn.mjs");
var Route$7 = createFileRoute("/_app/members/$memberId")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./new-BTMc6Wok.mjs");
var Route$6 = createFileRoute("/_app/members/new")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./payments-BDn1Fibt.mjs");
var Route$5 = createFileRoute("/_app/payments/")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./new-8iZHxXy3.mjs");
var Route$4 = createFileRoute("/_app/payments/new")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./unmatched-Kls8AI4h.mjs");
var Route$3 = createFileRoute("/_app/payments/unmatched")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./users--IvyAvnS.mjs");
var Route$2 = createFileRoute("/_app/users/")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("../_userId-BMj-8ns0.mjs");
var Route$1 = createFileRoute("/_app/users/$userId")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./new-jKHmFRuY.mjs");
var Route = createFileRoute("/_app/users/new")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$24.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$25
});
var AppRouteRoute = Route$23.update({
	id: "/_app",
	getParentRoute: () => Route$25
});
var ForgotRoute = Route$22.update({
	id: "/forgot",
	path: "/forgot",
	getParentRoute: () => Route$25
});
var AppAuditRoute = Route$21.update({
	id: "/audit",
	path: "/audit",
	getParentRoute: () => AppRouteRoute
});
var AppDashboardRoute = Route$20.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AppRouteRoute
});
var AppHouseRoute = Route$19.update({
	id: "/house",
	path: "/house",
	getParentRoute: () => AppRouteRoute
});
var AppInstructionsRoute = Route$18.update({
	id: "/instructions",
	path: "/instructions",
	getParentRoute: () => AppRouteRoute
});
var AppNotificationsRoute = Route$17.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => AppRouteRoute
});
var AppProfileRoute = Route$16.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => AppRouteRoute
});
var AppReportsRoute = Route$15.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => AppRouteRoute
});
var AppRolesRoute = Route$14.update({
	id: "/roles",
	path: "/roles",
	getParentRoute: () => AppRouteRoute
});
var AppChitsIndexRoute = Route$13.update({
	id: "/chits/",
	path: "/chits/",
	getParentRoute: () => AppRouteRoute
});
var AppChitsSchemeIdRoute = Route$12.update({
	id: "/chits/$schemeId",
	path: "/chits/$schemeId",
	getParentRoute: () => AppRouteRoute
});
var AppChitsNewRoute = Route$11.update({
	id: "/chits/new",
	path: "/chits/new",
	getParentRoute: () => AppRouteRoute
});
var AppDeveloperIndexRoute = Route$10.update({
	id: "/developer/",
	path: "/developer/",
	getParentRoute: () => AppRouteRoute
});
var AppDeveloperSectionRoute = Route$9.update({
	id: "/developer/$section",
	path: "/developer/$section",
	getParentRoute: () => AppRouteRoute
});
var AppMembersIndexRoute = Route$8.update({
	id: "/members/",
	path: "/members/",
	getParentRoute: () => AppRouteRoute
});
var AppMembersMemberIdRoute = Route$7.update({
	id: "/members/$memberId",
	path: "/members/$memberId",
	getParentRoute: () => AppRouteRoute
});
var AppMembersNewRoute = Route$6.update({
	id: "/members/new",
	path: "/members/new",
	getParentRoute: () => AppRouteRoute
});
var AppPaymentsIndexRoute = Route$5.update({
	id: "/payments/",
	path: "/payments/",
	getParentRoute: () => AppRouteRoute
});
var AppPaymentsNewRoute = Route$4.update({
	id: "/payments/new",
	path: "/payments/new",
	getParentRoute: () => AppRouteRoute
});
var AppPaymentsUnmatchedRoute = Route$3.update({
	id: "/payments/unmatched",
	path: "/payments/unmatched",
	getParentRoute: () => AppRouteRoute
});
var AppUsersIndexRoute = Route$2.update({
	id: "/users/",
	path: "/users/",
	getParentRoute: () => AppRouteRoute
});
var AppRouteRouteChildren = {
	AppAuditRoute,
	AppDashboardRoute,
	AppHouseRoute,
	AppInstructionsRoute,
	AppNotificationsRoute,
	AppProfileRoute,
	AppReportsRoute,
	AppRolesRoute,
	AppChitsSchemeIdRoute,
	AppChitsNewRoute,
	AppDeveloperSectionRoute,
	AppMembersMemberIdRoute,
	AppMembersNewRoute,
	AppPaymentsNewRoute,
	AppPaymentsUnmatchedRoute,
	AppUsersUserIdRoute: Route$1.update({
		id: "/users/$userId",
		path: "/users/$userId",
		getParentRoute: () => AppRouteRoute
	}),
	AppUsersNewRoute: Route.update({
		id: "/users/new",
		path: "/users/new",
		getParentRoute: () => AppRouteRoute
	}),
	AppChitsIndexRoute,
	AppDeveloperIndexRoute,
	AppMembersIndexRoute,
	AppPaymentsIndexRoute,
	AppUsersIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AppRouteRoute: AppRouteRoute._addFileChildren(AppRouteRouteChildren),
	ForgotRoute
};
var routeTree = Route$25._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { ROLE_BLURBS as _, Route$12 as a, ROLE_NAMES as b, formatDate as c, initials as d, todayISO as f, PERMISSIONS as g, MODULE_LABELS as h, Route$9 as i, formatDateTime as l, MODULE_KEYS as m, Route$1 as n, useAppStore as o, ADMIN_SCREENS as p, Route$7 as r, DEMO_ACCOUNTS as s, router_exports as t, formatINR as u, ROLE_DEFAULTS as v, assignableRoles as x, ROLE_LABELS as y };
