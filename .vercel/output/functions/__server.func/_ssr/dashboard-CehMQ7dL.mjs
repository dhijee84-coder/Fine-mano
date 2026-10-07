import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { O as ArrowRight, a as Terminal, g as Layers, i as TriangleAlert, n as Users, y as IndianRupee } from "../_libs/lucide-react.mjs";
import { c as formatDate, o as useAppStore, u as formatINR, y as ROLE_LABELS } from "./router-5YFTNEBk.mjs";
import { i as CardTitle, n as Button, r as Card } from "./kit-DQB8BDzZ.mjs";
import { a as PageHeader, c as Td, o as StatCard, s as StatusBadge, t as DataTable } from "./desk-D9-W6dAi.mjs";
import { r as useSessionUser } from "./session-MQtsOIYH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-CehMQ7dL.js
var import_jsx_runtime = require_jsx_runtime();
function DashboardPage() {
	const user = useSessionUser();
	if (!user) return null;
	if (user.role === "MEMBER") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemberDash, {});
	if (user.role === "SUPER_ADMIN") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuperDash, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpsDash, {});
}
function monthLabel(iso) {
	return new Date(iso).toLocaleString("en-IN", { month: "short" });
}
function useKpis() {
	const membersAll = useAppStore((s) => s.members);
	const schemesAll = useAppStore((s) => s.schemes);
	const paymentsAll = useAppStore((s) => s.payments);
	const installments = useAppStore((s) => s.installments);
	const unmatchedAll = useAppStore((s) => s.unmatched);
	const members = membersAll.filter((m) => !m.deletedAt && m.isActive);
	const schemes = schemesAll.filter((s) => s.status === "ACTIVE");
	const payments = paymentsAll.filter((p) => !p.deletedAt);
	const unmatched = unmatchedAll.filter((u) => u.status === "OPEN");
	return {
		members,
		schemes,
		payments,
		overdue: installments.filter((i) => i.status === "OVERDUE"),
		unmatched,
		collected: payments.filter((p) => p.status === "APPROVED" || p.status === "ALLOCATED").reduce((s, p) => s + p.amount, 0),
		pendingPay: payments.filter((p) => p.status === "PENDING"),
		chart: lastSixMonths(payments),
		installments
	};
}
function lastSixMonths(payments) {
	const buckets = [];
	const now = /* @__PURE__ */ new Date();
	for (let i = 5; i >= 0; i--) {
		const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
		const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
		const amount = payments.filter((p) => !p.deletedAt && p.createdAt.startsWith(key) && p.status !== "REVERSED").reduce((s, p) => s + p.amount, 0);
		buckets.push({
			label: monthLabel(d.toISOString()),
			amount
		});
	}
	return buckets;
}
function MonthBars({ data }) {
	const max = Math.max(1, ...data.map((d) => d.amount));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-48 items-end gap-2",
		children: data.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] tabular-nums text-muted",
					children: d.amount ? formatINR(d.amount) : "\xA0"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-36 w-full items-end rounded-sm bg-surface-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full rounded-sm bg-primary",
						style: { height: `${Math.max(d.amount ? 8 : 0, d.amount / max * 100)}%` }
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-muted",
					children: d.label
				})
			]
		}, d.label))
	});
}
function SuperDash() {
	const user = useSessionUser();
	const k = useKpis();
	const modules = useAppStore((s) => s.modules);
	const logs = useAppStore((s) => s.systemLogs);
	const actionsAll = useAppStore((s) => s.actions);
	const apiClients = useAppStore((s) => s.apiClients);
	const errors = logs.filter((l) => l.level === "ERROR");
	const pending = actionsAll.filter((a) => a.status === "PENDING");
	const clients = apiClients.filter((c) => c.isActive);
	const on = Object.values(modules).filter(Boolean).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "enter",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: ROLE_LABELS[user.role],
				title: "House desk",
				description: "Users, finance, modules, and the developer console live on this one role.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "navy",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/developer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terminal, { className: "size-4" }), "Developer console"]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Active members",
						value: k.members.length,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Live schemes",
						value: k.schemes.length,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Booked collections",
						value: formatINR(k.collected),
						hint: "Allocated + approved",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndianRupee, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Overdue installments",
						value: k.overdue.length,
						hint: k.unmatched.length ? `${k.unmatched.length} unmatched receipts` : "Aging dues",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Modules on",
						value: `${on}/${Object.keys(modules).length}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Active API clients",
						value: clients.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Pending approvals",
						value: pending.length,
						hint: "Dangerous actions"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Error log",
						value: errors.length
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "mb-4",
						children: "Collections by month"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthBars, { data: k.chart })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "mb-3",
						children: "Quick paths"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashLink, {
								to: "/users",
								label: "Manage users"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashLink, {
								to: "/roles",
								label: "Roles & permissions"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashLink, {
								to: "/developer",
								label: "Developer console",
								extra: pending.length ? `${pending.length} pending` : void 0
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashLink, {
								to: "/developer/modules",
								label: "Enable / disable modules"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashLink, {
								to: "/developer/database",
								label: "Database inspector"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashLink, {
								to: "/audit",
								label: "Audit log"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PendingPayments, { rows: k.pendingPay })
		]
	});
}
function OpsDash() {
	const user = useSessionUser();
	const k = useKpis();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "enter",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: ROLE_LABELS[user.role],
				title: "Floor desk",
				description: "Members, schemes, collections, and allocation — the old admin, staff, and accountant desks in one.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/payments/new",
						children: "Record payment"
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Active members",
						value: k.members.length,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Live schemes",
						value: k.schemes.length,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Booked collections",
						value: formatINR(k.collected),
						hint: "Allocated + approved",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndianRupee, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Overdue installments",
						value: k.overdue.length,
						hint: k.unmatched.length ? `${k.unmatched.length} unmatched receipts` : "Aging dues",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "mb-4",
						children: "Collections by month"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthBars, { data: k.chart })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "mb-3",
						children: "Quick paths"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashLink, {
								to: "/members",
								label: "Manage members"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashLink, {
								to: "/chits",
								label: "Chit schemes"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashLink, {
								to: "/payments",
								label: "Review payments",
								extra: `${k.pendingPay.length} pending`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashLink, {
								to: "/payments/unmatched",
								label: "Unmatched receipts",
								extra: String(k.unmatched.length)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashLink, {
								to: "/reports",
								label: "Reports"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PendingPayments, { rows: k.pendingPay })
		]
	});
}
function PendingPayments({ rows }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "font-display mt-8 mb-3 text-xl",
		children: "Pending payments"
	}), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "No payments waiting on approval."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
		headers: [
			"When",
			"Member",
			"Amount",
			"Source",
			"Status"
		],
		children: rows.slice(0, 6).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "text-muted",
				children: formatDate(p.createdAt)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: memberName(p.memberId) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "tabular-nums",
				children: formatINR(p.amount)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: p.source }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: p.status }) })
		] }, p.id))
	})] });
}
function MemberDash() {
	const user = useSessionUser();
	const member = useAppStore((s) => s.members).find((m) => m.id === user.memberId);
	const enrollments = useAppStore((s) => s.enrollments).filter((e) => e.memberId === user.memberId);
	const schemes = useAppStore((s) => s.schemes);
	const installments = useAppStore((s) => s.installments);
	const payments = useAppStore((s) => s.payments).filter((p) => p.memberId === user.memberId && !p.deletedAt);
	const myInst = installments.filter((i) => enrollments.some((e) => e.id === i.memberChitId));
	const overdue = myInst.filter((i) => i.status === "OVERDUE");
	const upcoming = [...myInst.filter((i) => i.status === "PENDING")].sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];
	const totalPaid = payments.filter((p) => p.status === "ALLOCATED" || p.status === "APPROVED").reduce((s, p) => s + p.amount, 0);
	if (!member) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "enter",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "My chit fund",
			description: "No member profile is linked to this account yet."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "enter",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: member.fullName,
				title: "My chit fund",
				description: "Your enrollments, dues, and receipts only. There is no path to another subscriber’s book.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/profile",
						children: "Profile"
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total paid",
						value: formatINR(totalPaid)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Active chits",
						value: enrollments.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Overdue",
						value: overdue.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Next due",
						value: upcoming ? formatINR(upcoming.amountDue) : "—",
						hint: upcoming ? `Due ${formatDate(upcoming.dueDate)}` : "Nothing pending"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mt-8 mb-3 text-xl",
				children: "Enrolled schemes"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: enrollments.map((e) => {
					const s = schemes.find((x) => x.id === e.chitSchemeId);
					const paid = myInst.filter((i) => i.memberChitId === e.id).filter((i) => i.status === "PAID").length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-[0.14em] text-muted uppercase",
							children: e.status
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display mt-1 text-xl",
							children: s?.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-muted",
							children: [
								paid,
								"/",
								s?.durationMonths,
								" installments paid · ",
								formatINR(s?.installmentAmount ?? 0),
								" / month"
							]
						})
					] }, e.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mt-8 mb-3 text-xl",
				children: "Installments"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				headers: [
					"#",
					"Scheme",
					"Due",
					"Amount",
					"Paid",
					"Status"
				],
				children: myInst.slice().sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 24).map((i) => {
					const enr = enrollments.find((e) => e.id === i.memberChitId);
					const s = schemes.find((x) => x.id === enr?.chitSchemeId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "tabular-nums text-muted",
							children: i.installmentNumber
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: s?.name ?? "—" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "text-muted",
							children: formatDate(i.dueDate)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "tabular-nums",
							children: formatINR(i.amountDue)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "tabular-nums",
							children: formatINR(i.amountPaid)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: i.status }) })
					] }, i.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mt-8 mb-3 text-xl",
				children: "Payment history"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				headers: [
					"Date",
					"Amount",
					"Status",
					"Reference"
				],
				children: payments.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "text-muted",
						children: formatDate(p.createdAt)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "tabular-nums",
						children: formatINR(p.amount)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: p.status }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "font-mono text-xs",
						children: p.reference
					})
				] }, p.id))
			})
		]
	});
}
function DashLink({ to, label, extra }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: "flex h-12 items-center justify-between rounded-md bg-surface-2 px-4 text-sm hover:bg-line",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-center gap-2 text-muted",
			children: [extra ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs tabular-nums",
				children: extra
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
		})]
	});
}
function memberName(id) {
	return useAppStore.getState().members.find((m) => m.id === id)?.fullName ?? id;
}
//#endregion
export { DashboardPage as component };
