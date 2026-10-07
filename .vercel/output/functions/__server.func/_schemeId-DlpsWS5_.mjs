import { i as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { a as Route$12, c as formatDate, o as useAppStore, u as formatINR } from "./_ssr/router-5YFTNEBk.mjs";
import { c as Field, i as CardTitle, l as Input, n as Button, r as Card, u as Select } from "./_ssr/kit-DQB8BDzZ.mjs";
import { a as PageHeader, c as Td, i as ModuleOff, o as StatCard, r as Forbidden, s as StatusBadge, t as DataTable } from "./_ssr/desk-D9-W6dAi.mjs";
import { n as useModuleOn, t as useHas } from "./_ssr/session-MQtsOIYH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_schemeId-DlpsWS5_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SchemePage() {
	const { schemeId } = Route$12.useParams();
	const canView = useHas("chits.view");
	const canEdit = useHas("chits.edit");
	const canCreateMember = useHas("members.create");
	const canGen = useHas("installments.generate");
	const moduleOn = useModuleOn("chit_management");
	const scheme = useAppStore((s) => s.schemes.find((x) => x.id === schemeId));
	const members = useAppStore((s) => s.members).filter((m) => !m.deletedAt);
	const enrollments = useAppStore((s) => s.enrollments).filter((e) => e.chitSchemeId === schemeId);
	const installments = useAppStore((s) => s.installments);
	const enrollMember = useAppStore((s) => s.enrollMember);
	const createMember = useAppStore((s) => s.createMember);
	const issueMemberLogin = useAppStore((s) => s.issueMemberLogin);
	const users = useAppStore((s) => s.users);
	const generate = useAppStore((s) => s.generateInstallments);
	const [memberId, setMemberId] = (0, import_react.useState)("");
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [city, setCity] = (0, import_react.useState)("");
	if (!canView) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forbidden, { reason: "chits.view is required." });
	if (!moduleOn) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleOff, { name: "chit management" });
	if (!scheme) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forbidden, { reason: "Scheme not found." });
	const enrolledIds = new Set(enrollments.map((e) => e.memberId));
	const available = members.filter((m) => !enrolledIds.has(m.id));
	const inst = installments.filter((i) => enrollments.some((e) => e.id === i.memberChitId));
	const overdue = inst.filter((i) => i.status === "OVERDUE").length;
	const paid = inst.filter((i) => i.status === "PAID").length;
	function fillSchedule() {
		if (!canGen) return;
		const res = generate(schemeId);
		if (!res.ok) toast.error(res.error);
		else if (res.created) toast.success(`${res.created} installment rows added for this scheme.`);
	}
	function ensureLogin(id, name, forceToast) {
		if (users.find((u) => u.memberId === id) && !forceToast) return;
		const login = issueMemberLogin(id);
		if (!login.ok) {
			toast.error(login.error);
			return;
		}
		toast.success(`${name} can sign in with User ID ${login.username} and password ${login.password}.`);
	}
	function onEnroll(e) {
		e.preventDefault();
		if (!memberId) return;
		const res = enrollMember(schemeId, memberId);
		if (!res.ok) {
			toast.error(res.error);
			return;
		}
		const name = members.find((m) => m.id === memberId)?.fullName ?? "Member";
		toast.success("Member enrolled.");
		ensureLogin(memberId, name, false);
		setMemberId("");
		fillSchedule();
	}
	function onCreateAndEnroll(e) {
		e.preventDefault();
		const created = createMember({
			fullName,
			phone,
			email: "",
			address: "",
			city,
			assignedStaffId: null
		});
		if (!created.ok) {
			toast.error(created.error);
			return;
		}
		const enrolled = enrollMember(schemeId, created.id);
		if (!enrolled.ok) {
			toast.error(enrolled.error);
			return;
		}
		ensureLogin(created.id, fullName.trim(), true);
		setFullName("");
		setPhone("");
		setCity("");
		fillSchedule();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "enter",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "Chit scheme",
				title: scheme.name,
				description: `${formatINR(scheme.totalAmount)} corpus · ${scheme.durationMonths} months · started ${formatDate(scheme.startDate)}`,
				actions: canGen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => {
						const res = generate(scheme.id);
						if (!res.ok) toast.error(res.error);
						else toast.success(res.created ? `${res.created} installments generated.` : "Schedule already complete.");
					},
					children: "Generate installments"
				}) : null
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Installment",
						value: formatINR(scheme.installmentAmount)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Enrolled",
						value: enrollments.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Paid rows",
						value: paid
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Overdue rows",
						value: overdue
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "mb-3",
					children: "Add to this scheme"
				}), canEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: onEnroll,
						className: "flex flex-col gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs tracking-[0.14em] text-muted uppercase",
								children: "Existing subscriber"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Member already on the books",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: memberId,
									onChange: (e) => setMemberId(e.target.value),
									required: true,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Select…"
									}), available.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: m.id,
										children: m.fullName
									}, m.id))]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: !memberId,
								children: "Enroll"
							})
						]
					}), canCreateMember ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: onCreateAndEnroll,
						className: "flex flex-col gap-3 border-t border-line pt-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs tracking-[0.14em] text-muted uppercase",
								children: "New subscriber"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Full name",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: fullName,
									onChange: (e) => setFullName(e.target.value),
									required: true
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Phone",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: phone,
									onChange: (e) => setPhone(e.target.value),
									required: true
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "City",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: city,
									onChange: (e) => setCity(e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: !fullName.trim() || !phone.trim(),
								children: "Create and enroll"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: "Creates the member, puts them on this roster, and opens their installment rows. Paid rows already on the book are not overwritten."
							})
						]
					}) : null]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Your role cannot enroll members."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "mb-3",
					children: "Roster"
				}), enrollments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Nobody enrolled yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-col gap-1.5",
					children: enrollments.map((e) => {
						const m = members.find((x) => x.id === e.memberId);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/members/$memberId",
								params: { memberId: e.memberId },
								className: "hover:text-primary",
								children: m?.fullName ?? e.memberId
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: e.status })]
						}, e.id);
					})
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mt-8 mb-3 text-xl",
				children: "Installment book"
			}),
			inst.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "No schedule yet. Enroll someone or generate installments to open the book."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				headers: [
					"#",
					"Member",
					"Due",
					"Amount",
					"Paid",
					"Status"
				],
				children: inst.slice().sort((a, b) => a.dueDate.localeCompare(b.dueDate) || a.installmentNumber - b.installmentNumber).slice(0, 40).map((i) => {
					const enr = enrollments.find((e) => e.id === i.memberChitId);
					const m = members.find((x) => x.id === enr?.memberId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "tabular-nums text-muted",
							children: i.installmentNumber
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: m?.fullName ?? "—" }),
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
			})
		]
	});
}
//#endregion
export { SchemePage as component };
