import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link, g as Outlet, p as useRouterState, x as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { C as CircleAlert, D as Bell, E as BookOpen, S as CircleHelp, a as Terminal, g as Layers, h as LayoutDashboard, m as LogOut, n as Users, p as Menu, r as UserRound, s as Shield, t as X, u as ScrollText, w as ChartColumn, x as Database, y as IndianRupee } from "../_libs/lucide-react.mjs";
import { d as initials, o as useAppStore, y as ROLE_LABELS } from "./router-5YFTNEBk.mjs";
import { f as cn, n as Button, t as Badge } from "./kit-DQB8BDzZ.mjs";
import { r as useSessionUser, t as useHas } from "./session-MQtsOIYH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-UcFae9uv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AppShell({ children }) {
	const user = useSessionUser();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [open, setOpen] = (0, import_react.useState)(false);
	const logout = useAppStore((s) => s.logout);
	const settings = useAppStore((s) => s.settings);
	const unmatchedOpen = useAppStore((s) => s.unmatched.filter((u) => u.status === "OPEN").length);
	const pendingActions = useAppStore((s) => s.actions.filter((a) => a.status === "PENDING").length);
	const canMembers = useHas("members.view");
	const canChits = useHas("chits.view");
	const canPayments = useHas("payments.view");
	const canReports = useHas("reports.view");
	const canUsers = useHas("users.view");
	const canAudit = useHas("audit.view");
	const canDev = useHas("developer.view");
	const unreadAlerts = useAppStore((s) => (s.alerts ?? []).filter((a) => a.userId === user?.id && !a.read).length);
	const visible = [
		{
			to: "/dashboard",
			label: "Dashboard",
			icon: LayoutDashboard,
			show: true
		},
		{
			to: "/members",
			label: "Members",
			icon: Users,
			show: canMembers
		},
		{
			to: "/chits",
			label: "Chits",
			icon: Layers,
			show: canChits
		},
		{
			to: "/payments",
			label: "Payments",
			icon: IndianRupee,
			show: canPayments
		},
		{
			to: "/reports",
			label: "Reports",
			icon: ChartColumn,
			show: canReports
		},
		{
			to: "/users",
			label: "Users",
			icon: Shield,
			show: canUsers && user?.role !== "MEMBER"
		},
		{
			to: "/house",
			label: "House book",
			icon: Database,
			show: user?.role === "SUPER_ADMIN"
		},
		{
			to: "/roles",
			label: "Roles",
			icon: BookOpen,
			show: user?.role === "SUPER_ADMIN"
		},
		{
			to: "/audit",
			label: "Audit log",
			icon: ScrollText,
			show: canAudit
		},
		{
			to: "/developer",
			label: "Developer",
			icon: Terminal,
			show: canDev
		},
		{
			to: "/notifications",
			label: "Alerts",
			icon: Bell,
			show: true
		},
		{
			to: "/profile",
			label: "My profile",
			icon: UserRound,
			show: user?.role === "MEMBER"
		},
		{
			to: "/instructions",
			label: "Instructions",
			icon: CircleHelp,
			show: true
		}
	].filter((i) => i.show);
	const brand = settings.site_name || "Nidhi";
	const nav = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "flex flex-1 flex-col gap-0.5 px-3",
		children: visible.map((item) => {
			const active = pathname === item.to || item.to !== "/dashboard" && pathname.startsWith(item.to);
			const Icon = item.icon;
			const badge = item.to === "/payments" && unmatchedOpen > 0 ? unmatchedOpen : item.to === "/developer" && pendingActions > 0 ? pendingActions : item.to === "/notifications" && unreadAlerts > 0 ? unreadAlerts : 0;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				onClick: () => setOpen(false),
				className: cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-150", active ? "bg-navy-2 text-navy-fg" : "text-navy-muted hover:bg-navy-2/60 hover:text-navy-fg"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex-1",
						children: item.label
					}),
					badge > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-danger px-1.5 py-0.5 text-[10px] font-medium text-primary-fg tabular-nums",
						children: badge
					}) : null
				]
			}, item.to);
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "fixed inset-y-0 left-0 z-40 hidden w-60 flex-col bg-navy text-navy-fg lg:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/dashboard",
						className: "flex items-baseline gap-2 px-6 pt-6 pb-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-2xl italic tracking-tight",
							children: brand
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] tracking-[0.16em] text-navy-muted uppercase",
							children: "Chits"
						})]
					}),
					nav,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-auto border-t border-white/10 p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex size-9 items-center justify-center rounded-full bg-navy-2 text-xs font-medium",
									children: user ? initials(user.username) : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm",
										children: user?.username
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-[11px] text-navy-muted",
										children: user ? ROLE_LABELS[user.role] : ""
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										logout();
									},
									className: "rounded-sm p-2 text-navy-muted hover:bg-navy-2 hover:text-navy-fg",
									"aria-label": "Log out",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" })
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-bg/90 px-4 py-3 backdrop-blur-sm lg:hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "flex size-11 items-center justify-center rounded-md",
						onClick: () => setOpen(true),
						"aria-label": "Open menu",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-xl italic",
						children: brand
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [unmatchedOpen > 0 && canPayments ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/payments/unmatched",
							className: "flex size-11 items-center justify-center rounded-md text-warn",
							"aria-label": `${unmatchedOpen} unmatched receipts`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-5" })
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "flex size-11 items-center justify-center rounded-md",
							onClick: () => logout(),
							"aria-label": "Log out",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-5" })
						})]
					})
				]
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50 lg:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "absolute inset-0 bg-ink/40",
					"aria-label": "Close menu",
					onClick: () => setOpen(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-y-0 left-0 flex w-72 flex-col bg-navy text-navy-fg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between px-4 pt-4 pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-2xl italic",
								children: brand
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "flex size-11 items-center justify-center",
								onClick: () => setOpen(false),
								"aria-label": "Close menu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
							})]
						}),
						nav,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-auto border-t border-white/10 p-4 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: user?.username }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-navy-muted",
								children: user ? ROLE_LABELS[user.role] : ""
							})]
						})
					]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:pl-60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-lg:hidden flex items-center justify-between px-8 pt-6 lg:flex",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2 text-xs text-muted",
						children: unmatchedOpen > 0 && canPayments ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/payments/unmatched",
							className: "inline-flex items-center gap-1.5 rounded-full bg-warn-bg px-3 py-1 text-warn",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-3.5" }),
								unmatchedOpen,
								" unmatched"
							]
						}) : null
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: "navy",
						children: user ? ROLE_LABELS[user.role] : ""
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "mx-auto min-w-0 max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:pt-4 lg:pb-12",
					children
				})]
			})
		]
	});
}
function RequireAuth({ children }) {
	const hydrated = useAppStore((s) => s.hasHydrated);
	const user = useSessionUser();
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Sign in"
		})
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	if (!user.isActive) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col items-center justify-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This account is disabled." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: () => useAppStore.getState().logout(),
			children: "Sign out"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children });
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireAuth, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
//#endregion
export { SplitComponent as component };
