import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { y as ROLE_LABELS } from "./router-5YFTNEBk.mjs";
import { f as cn, i as CardTitle, n as Button, r as Card } from "./kit-DQB8BDzZ.mjs";
import { a as PageHeader, c as Td, s as StatusBadge, t as DataTable } from "./desk-D9-W6dAi.mjs";
import { r as useSessionUser } from "./session-MQtsOIYH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/instructions-BtJa4Wu-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InstructionsPage() {
	const role = useSessionUser()?.role ?? "MEMBER";
	const [filter, setFilter] = (0, import_react.useState)(role === "SUPER_ADMIN" ? "ALL" : role);
	function show(keys) {
		if (role === "SUPER_ADMIN") {
			if (filter === "ALL") return true;
			return keys.includes(filter);
		}
		if (role === "ADMIN") return keys.includes("ADMIN") || keys.includes("MEMBER");
		return keys.includes("MEMBER");
	}
	function showLogin(desk) {
		if (role === "SUPER_ADMIN") return filter === "ALL" || filter === desk;
		if (role === "ADMIN") return desk === "ADMIN" || desk === "MEMBER";
		return desk === "MEMBER";
	}
	const toc = [
		{
			id: "desks",
			label: role === "MEMBER" ? "Your desk" : "Desks & logins",
			show: true
		},
		{
			id: "matrix",
			label: "Who can do what",
			show: show(["SUPER_ADMIN", "ADMIN"])
		},
		{
			id: "signin",
			label: "Sign in",
			show: true
		},
		{
			id: role === "MEMBER" ? "member-screens" : "screens",
			label: "Screens",
			show: true
		},
		{
			id: "money",
			label: "How money moves",
			show: show(["SUPER_ADMIN", "ADMIN"])
		},
		{
			id: "processes",
			label: "Playbooks",
			show: true
		},
		{
			id: "seed",
			label: "Seed book",
			show: show(["SUPER_ADMIN", "ADMIN"])
		},
		{
			id: "developer",
			label: "Developer console",
			show: show(["SUPER_ADMIN"])
		},
		{
			id: "glossary",
			label: "Status glossary",
			show: show(["SUPER_ADMIN", "ADMIN"])
		}
	].filter((t) => t.show);
	const chips = role === "SUPER_ADMIN" ? [
		"ALL",
		"SUPER_ADMIN",
		"ADMIN",
		"MEMBER"
	] : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "enter mx-auto max-w-4xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "Desk manual",
				title: "How Nidhi works",
				description: role === "SUPER_ADMIN" ? "Every screen, process, and login for all three desks." : role === "ADMIN" ? "Floor desk plus the member portal — Super Admin house chapters are hidden." : "Your own book only: sign in, dashboard, profile, and dues."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] tracking-[0.16em] text-muted uppercase",
						children: "You are signed in as"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display mt-1 text-2xl",
						children: ROLE_LABELS[role]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-xl text-sm text-muted",
						children: deskBlurb(role)
					})
				]
			}),
			chips.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 flex flex-wrap gap-2",
				children: chips.map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					variant: filter === key ? "navy" : "outline",
					onClick: () => setFilter(key),
					children: key === "ALL" ? "All desks" : ROLE_LABELS[key]
				}, key))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "mb-8 grid gap-2 sm:grid-cols-3",
				children: toc.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "rounded-md bg-surface-2 px-3 py-2.5 text-left text-sm hover:bg-line",
					onClick: () => document.getElementById(item.id)?.scrollIntoView({
						behavior: "smooth",
						block: "start"
					}),
					children: item.label
				}, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				id: "desks",
				title: role === "MEMBER" ? "Your login" : "Desks & logins",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-4 text-sm text-muted",
						children: role === "SUPER_ADMIN" ? "All three desks. Demo password matches the username." : role === "ADMIN" ? "Your floor login and the member portal login. Super Admin credentials stay on the house desk." : "Sign in with the User ID issued on your member record. Password matches the username unless you reset it."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DataTable, {
						headers: [
							"Desk",
							"Username",
							"Password",
							"Sees"
						],
						children: [
							showLogin("SUPER_ADMIN") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
									className: "font-medium",
									children: "Super Admin"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
									className: "font-mono text-xs",
									children: "superadmin"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
									className: "font-mono text-xs",
									children: "superadmin"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: "Whole ledger + developer console" })
							] }) : null,
							showLogin("ADMIN") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
									className: "font-medium",
									children: "Admin"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
									className: "font-mono text-xs",
									children: "admin"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
									className: "font-mono text-xs",
									children: "admin"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: "Whole subscriber book" })
							] }) : null,
							showLogin("MEMBER") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
									className: "font-medium",
									children: "Member"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
									className: "font-mono text-xs",
									children: "member"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
									className: "font-mono text-xs",
									children: "member"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: "Lakshmi Iyer only" })
							] }) : null
						]
					}),
					show(["SUPER_ADMIN", "ADMIN"]) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted",
						children: "Access is role defaults ± per-user overrides, then modules. Super Admin always has every permission and cannot be reduced. Admin can create Admin and Member logins only — never Super Admin. Members have no Users menu."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted",
						children: "Forgot the password? Use “reset password with mobile” on the sign-in page with the number on your member record."
					})
				]
			}),
			show(["SUPER_ADMIN", "ADMIN"]) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				id: "matrix",
				title: "Who can do what",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
					headers: role === "SUPER_ADMIN" ? [
						"Capability",
						"Super Admin",
						"Admin",
						"Member"
					] : [
						"Capability",
						"Admin",
						"Member"
					],
					children: MATRIX.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "font-medium",
							children: row.cap
						}),
						role === "SUPER_ADMIN" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { on: row.super }) }) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { on: row.admin }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { on: row.member }) })
					] }, row.cap))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted",
					children: "Direct URLs still check permissions. A Member opening /members or /payments sees Access denied — the menu is not the only gate."
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				id: "signin",
				title: "Sign in",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "list-decimal space-y-2 pl-5 text-sm leading-relaxed text-ink-soft",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Wait until the button reads Login — the ledger has opened." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Click a desk card, or type username and password." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Failed passwords count up; too many lock the account for a cooling-off period." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Disabled accounts cannot enter." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Log out from the sidebar (header menu on a phone)." })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted",
					children: "There is no cloud save. The book lives in this browser. A version bump of the demo ledger restores the seed."
				})]
			}),
			show(["SUPER_ADMIN", "ADMIN"]) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				id: "screens",
				title: "Screens — house and floor",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenBlock, {
						title: "Dashboard",
						body: "Super Admin sees House desk: collections plus module/API/error health and developer shortcuts. Admin sees Floor desk: members, schemes, booked collections, overdue, unmatched, and Record payment."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenBlock, {
						title: "Members",
						body: "List of subscribers. New member needs a unique phone. Optional assigned operator. Detail page: edit contact, enrollments, payments. Soft delete (Super Admin) needs a reason and keeps financial history."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenBlock, {
						title: "Chits",
						body: "A scheme has corpus, monthly installment, tenure, start date. Enroll a member, then Generate the installment book. Generate is additive — already-created numbers, including paid/locked rows, are left alone. Run it twice on a complete schedule and it creates 0."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenBlock, {
						title: "Payments",
						body: "Sources: MANUAL and BANK. Record lands PENDING. Approve, then Allocate onto an installment. A full hit marks the installment PAID and locks it. Super Admin can reverse a payment with a reason."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenBlock, {
						title: "Unmatched",
						body: "Bank credits that did not match a subscriber. Match creates a PENDING payment on the chosen book. Ignore closes without a payment. The Payments badge counts open unmatched rows."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenBlock, {
						title: "Reports",
						body: "Booked collections, pending receipts, overdue outstanding, source mix, and per-scheme enrolled / due / collected / gap."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenBlock, {
						title: "Users",
						body: "Create desk accounts. Super Admin can change role, disable, and set per-user permission overrides (grant or revoke) with a reason. Admin can create Admin or Member users, not Super Admin."
					})
				]
			}) : null,
			show(["MEMBER"]) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				id: "member-screens",
				title: "Screens — own book",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenBlock, {
					title: "Dashboard",
					body: "My chit fund: total paid, active chits, overdue, next due, enrolled schemes, installment rows, and payment history. Only the linked subscriber."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenBlock, {
					title: "My profile",
					body: "Own contact and enrollments. There is no path to another subscriber’s book."
				})]
			}) : null,
			show(["SUPER_ADMIN"]) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				id: "house-only",
				title: "House-only screens",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenBlock, {
					title: "Roles",
					body: "Starting grants per desk. Super Admin’s set is locked. Saves last for this browser session until the ledger is reset."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenBlock, {
					title: "Audit log",
					body: "Append-only. Login, create, edit, generate, allocate, approve, delete, deny, dangerous-action requests. No edit or delete path — including for Super Admin."
				})]
			}) : null,
			show(["SUPER_ADMIN", "ADMIN"]) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				id: "money",
				title: "How money moves",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "list-decimal space-y-2 pl-5 text-sm leading-relaxed text-ink-soft",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "A receipt is recorded against a member (manual form, matched unmatched row, or bank API). Status: PENDING." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Approve → APPROVED. Still not applied to a month." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Allocate to an installment. amountPaid increases. If it covers amountDue the row becomes PAID and locks. Otherwise PARTIAL." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Locked (fully paid) rows cannot be edited without installments.edit_paid." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Soft-delete reverses the payment. History stays." })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: [
						"PENDING",
						"APPROVED",
						"ALLOCATED",
						"REVERSED"
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: s }, s))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				id: "processes",
				title: "Playbooks",
				children: [
					show(["SUPER_ADMIN", "ADMIN"]) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
							title: "A. New subscriber on a live chit",
							steps: [
								"Members → New member. Unique phone. Optionally assign an operator.",
								"Chits → open a scheme → Enroll that member.",
								"Generate installments. New rows are PENDING (future) or OVERDUE (past due dates). Paid rows already on the book are not overwritten."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
							title: "B. Collect cash / cheque / UPI",
							steps: [
								"Payments → Record payment (or Floor desk → Record payment).",
								"Pick the scheme, then a live subscriber enrolled in it. Amount defaults to the installment.",
								"Payment is PENDING.",
								"Approve it.",
								"Allocate to the right installment. Partial → PARTIAL. Full → PAID and locked."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
							title: "C. Bank credit with no member",
							steps: [
								"Open Unmatched from the Payments badge or the unmatched chip.",
								"Match → pick the subscriber → creates a PENDING payment.",
								"Approve + allocate as in B. Or Ignore if it is not a chit credit."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
							title: "D. Harvest 3L (empty schedule)",
							steps: [
								"Harvest 3L is enrolled (Arjun, Meena, Fatima) with 0 installment rows on purpose.",
								"Generate from the Chits list or the scheme page.",
								"First click creates 45 rows (3 × 15). Second click creates 0 — schedule already complete."
							]
						})
					] }) : null,
					show(["SUPER_ADMIN"]) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
						title: "E. Dangerous action",
						steps: [
							"Developer → Dangerous actions (or the pending badge on Developer).",
							"A restore/write request sits PENDING.",
							"Approve or reject. The decision is audited."
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
						title: "F. Soft delete",
						steps: ["Open the member or payment.", "Supply a reason. Payments become REVERSED. Members drop off the live list; installment history remains."]
					})] }) : null,
					show(["MEMBER"]) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
						title: "Member: read your own book",
						steps: [
							"Dashboard shows your enrollments, next due, overdue, and receipts.",
							"Open My profile for contact details.",
							"There is no Members, Payments, Reports, or Users menu. Those URLs are denied."
						]
					}) : null
				]
			}),
			show(["SUPER_ADMIN", "ADMIN"]) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				id: "seed",
				title: "Seed book",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-sm text-muted",
						children: "What you see on first open."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DataTable, {
						headers: [
							"Scheme",
							"Corpus",
							"Installment",
							"Tenure",
							"Schedule"
						],
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: "Aishwarya Gold 5L" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
									className: "tabular-nums",
									children: "₹5,00,000"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
									className: "tabular-nums",
									children: "₹25,000"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: "20 months · 5 enrolled" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: "Already generated" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: "Lakshmi Silver 2L" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
									className: "tabular-nums",
									children: "₹2,00,000"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
									className: "tabular-nums",
									children: "₹16,670"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: "12 months · 4 enrolled" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: "Already generated" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: "Harvest 3L" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
									className: "tabular-nums",
									children: "₹3,00,000"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
									className: "tabular-nums",
									children: "₹20,000"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: "15 months · 3 enrolled" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: "Empty until you generate" })
							] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted",
						children: "Subscribers: Lakshmi Iyer, Ramesh Krishnan, Fatima Begum, Arjun Reddy, Meena Subramanian, Joseph D'Souza, Priya Nair, Venkatesh Rao. The Member login is Lakshmi Iyer. Two unmatched receipts sit open so reconciliation can be practised."
					})
				]
			}) : null,
			show(["SUPER_ADMIN"]) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				id: "developer",
				title: "Developer console",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 text-sm text-muted",
					children: "Super Admin only. Disabling a module blocks its routes, not just the menu. Financial records stay on this desk because Super Admin and Developer were merged."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
					headers: ["Section", "What it does"],
					children: DEV_SECTIONS.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "font-medium",
						children: row.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: row.body })] }, row.name))
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { id: "developer" }),
			show(["SUPER_ADMIN", "ADMIN"]) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				id: "glossary",
				title: "Status glossary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gloss, {
							term: "Scheme",
							value: "ACTIVE / CLOSED / DRAFT"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gloss, {
							term: "Enrollment",
							value: "ACTIVE / CLOSED / DEFAULTED"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gloss, {
							term: "Installment",
							value: "PENDING / PARTIAL / PAID / OVERDUE — PAID locks"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gloss, {
							term: "Payment",
							value: "PENDING / APPROVED / ALLOCATED / REVERSED"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gloss, {
							term: "Unmatched",
							value: "OPEN / RESOLVED / IGNORED"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gloss, {
							term: "Dangerous action",
							value: "PENDING / APPROVED / REJECTED / EXECUTED"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gloss, {
							term: "Money",
							value: "Indian Rupees, en-IN · Asia/Kolkata"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-sm text-muted",
					children: "Nidhi is an operations desk, not a bank. Collections are Manual or Bank API. Alerts are in-app (and optional browser). No SMS collector."
				})]
			}) : null
		]
	});
}
function deskBlurb(role) {
	if (role === "SUPER_ADMIN") return "House desk. Users, finance, modules, APIs, and approvals live here. Use the filter to read the floor or member chapters too. All three logins are listed above.";
	if (role === "ADMIN") return "Floor desk. Members, schemes, collections, and allocation. You can add Admin and Member users only — Super Admin is not on that list. Member portal chapters are included below.";
	return "Your own chits, dues, and receipts. Nobody else’s book. There is no Users menu on this login.";
}
function Section({ id, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id,
		className: "mb-10 scroll-mt-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display mb-4 text-2xl",
			children: title
		}), children]
	});
}
function ScreenBlock({ title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "mb-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "mb-1",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm leading-relaxed text-muted",
			children: body
		})]
	});
}
function Play({ title, steps }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "mb-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "mb-2",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-ink-soft",
			children: steps.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: s }, s))
		})]
	});
}
function Gloss({ term, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-surface-2 px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-[11px] tracking-[0.14em] text-muted uppercase",
			children: term
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "mt-1 text-sm",
			children: value
		})]
	});
}
function Mark({ on }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("text-sm font-medium", on ? "text-ink" : "text-faint"),
		children: on ? "Yes" : "—"
	});
}
var MATRIX = [
	{
		cap: "Own dashboard",
		super: true,
		admin: true,
		member: true
	},
	{
		cap: "Members list & detail",
		super: true,
		admin: true,
		member: false
	},
	{
		cap: "Create / edit members",
		super: true,
		admin: true,
		member: false
	},
	{
		cap: "Soft-delete members",
		super: true,
		admin: false,
		member: false
	},
	{
		cap: "Chit schemes & enroll",
		super: true,
		admin: true,
		member: false
	},
	{
		cap: "Generate installments",
		super: true,
		admin: true,
		member: false
	},
	{
		cap: "Record / approve / allocate payments",
		super: true,
		admin: true,
		member: false
	},
	{
		cap: "Unmatched match / ignore",
		super: true,
		admin: true,
		member: false
	},
	{
		cap: "Reverse a payment",
		super: true,
		admin: false,
		member: false
	},
	{
		cap: "Reports",
		super: true,
		admin: true,
		member: false
	},
	{
		cap: "Users",
		super: true,
		admin: true,
		member: false
	},
	{
		cap: "Change roles & overrides",
		super: true,
		admin: false,
		member: false
	},
	{
		cap: "Roles catalogue",
		super: true,
		admin: false,
		member: false
	},
	{
		cap: "Audit log",
		super: true,
		admin: false,
		member: false
	},
	{
		cap: "Developer console",
		super: true,
		admin: false,
		member: false
	},
	{
		cap: "Toggle modules",
		super: true,
		admin: false,
		member: false
	},
	{
		cap: "Own chits, dues, receipts",
		super: true,
		admin: true,
		member: true
	},
	{
		cap: "Another subscriber’s book",
		super: true,
		admin: true,
		member: false
	}
];
var DEV_SECTIONS = [
	{
		name: "Modules",
		body: "Enable / disable route groups. Off = page shows module off, not just a hidden menu."
	},
	{
		name: "Website settings",
		body: "Site name, company, locale, currency, theme colour."
	},
	{
		name: "Form builder",
		body: "Allow-listed custom fields. Data only — never executed as code."
	},
	{
		name: "Menu builder",
		body: "Extra nav items gated by a permission code."
	},
	{
		name: "Workflows",
		body: "JSON config for approval, unmatched, reminders, bank sync. No code exec."
	},
	{
		name: "API clients",
		body: "Create clients. Secrets hashed at rest and always masked."
	},
	{
		name: "Bank providers",
		body: "Mock adapter until live credentials exist. Mock sync pulls sample credits. This is the automatic collection path."
	},
	{
		name: "Database inspector",
		body: "Allow-listed tables only. No arbitrary SQL."
	},
	{
		name: "Dangerous actions",
		body: "Restore / write queue. Super Admin approves or rejects."
	},
	{
		name: "Monitoring",
		body: "System log, backups, scheduler slot."
	},
	{
		name: "Notifications",
		body: "Reminder queue. Scheduler is not a running job in this desk."
	}
];
//#endregion
export { InstructionsPage as component };
