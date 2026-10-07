import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as formatDate, o as useAppStore, u as formatINR } from "./router-5YFTNEBk.mjs";
import { r as Card } from "./kit-DQB8BDzZ.mjs";
import { a as PageHeader, c as Td, i as ModuleOff, r as Forbidden, s as StatusBadge, t as DataTable } from "./desk-D9-W6dAi.mjs";
import { n as useModuleOn, r as useSessionUser } from "./session-MQtsOIYH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-Cowfa8u3.js
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const user = useSessionUser();
	const moduleOn = useModuleOn("member_portal");
	const member = useAppStore((s) => s.members.find((m) => m.id === user?.memberId));
	const enrollments = useAppStore((s) => s.enrollments).filter((e) => e.memberId === user?.memberId);
	const schemes = useAppStore((s) => s.schemes);
	const installments = useAppStore((s) => s.installments);
	if (user?.role !== "MEMBER") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forbidden, { reason: "Member profile is only available on a Member-role account." });
	if (!moduleOn) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleOff, { name: "member portal" });
	if (!member) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forbidden, { reason: "No member record is linked to this account." });
	const myInst = installments.filter((i) => enrollments.some((e) => e.id === i.memberChitId));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "enter",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "Self-service",
				title: member.fullName,
				description: "Your own record. The URL never accepts another member’s id."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mb-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-[11px] tracking-[0.14em] text-muted uppercase",
							children: "Phone"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1",
							children: member.phone
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-[11px] tracking-[0.14em] text-muted uppercase",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1",
							children: member.email
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-[11px] tracking-[0.14em] text-muted uppercase",
								children: "Address"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "mt-1",
								children: [
									member.address,
									", ",
									member.city
								]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mb-3 text-xl",
				children: "Upcoming & overdue"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				headers: [
					"Scheme",
					"#",
					"Due",
					"Amount",
					"Paid",
					"Status"
				],
				children: myInst.filter((i) => i.status === "PENDING" || i.status === "OVERDUE" || i.status === "PARTIAL").map((i) => {
					const enr = enrollments.find((e) => e.id === i.memberChitId);
					const s = schemes.find((x) => x.id === enr?.chitSchemeId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: s?.name }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "tabular-nums",
							children: i.installmentNumber
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: formatDate(i.dueDate) }),
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
export { ProfilePage as component };
