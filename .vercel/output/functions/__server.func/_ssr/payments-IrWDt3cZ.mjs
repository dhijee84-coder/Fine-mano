import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { p as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as formatDate, o as useAppStore, u as formatINR } from "./router-CzIu6ndy.mjs";
import { t as PageHeader } from "./page-header-BcO8feB4.mjs";
import { i as useModuleOn, r as useHas, t as Button } from "./session-BhtPFwO2.mjs";
import { n as Td, t as DataTable } from "./data-table-uQ5ostzh.mjs";
import { t as StatusBadge } from "./status-badge-BwE5ze5p.mjs";
import { n as ModuleOff, t as Forbidden } from "./forbidden-Ctx_Cupf.mjs";
import { n as Select, t as Field } from "./field-CuxoslU4.mjs";
import { t as Input } from "./input-CoJxW2XI.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-CKMFVqYj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payments-IrWDt3cZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PaymentsPage() {
	const canView = useHas("payments.view");
	const canCreate = useHas("payments.create");
	const canApprove = useHas("payments.approve");
	const canAlloc = useHas("payments.allocate");
	const canDelete = useHas("payments.delete");
	const moduleOn = useModuleOn("payments");
	const payments = useAppStore((s) => s.payments).filter((p) => !p.deletedAt);
	const members = useAppStore((s) => s.members);
	const enrollments = useAppStore((s) => s.enrollments);
	const installments = useAppStore((s) => s.installments);
	const approve = useAppStore((s) => s.approvePayment);
	const allocate = useAppStore((s) => s.allocatePayment);
	const del = useAppStore((s) => s.softDeletePayment);
	const unmatched = useAppStore((s) => s.unmatched).filter((u) => u.status === "OPEN").length;
	const [allocFor, setAllocFor] = (0, import_react.useState)(null);
	const [instId, setInstId] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)("");
	const [delFor, setDelFor] = (0, import_react.useState)(null);
	const [reason, setReason] = (0, import_react.useState)("");
	if (!canView) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forbidden, { reason: "payments.view is required." });
	if (!moduleOn) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleOff, { name: "payments" });
	const payment = payments.find((p) => p.id === allocFor);
	const memberInst = payment ? installments.filter((i) => {
		return enrollments.find((e) => e.id === i.memberChitId)?.memberId === payment.memberId && !i.locked;
	}) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "enter",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "Collections",
				title: "Payments",
				description: "Manual, SMS, and bank receipts. Allocate to an installment, approve, or soft-delete with a reason.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [unmatched > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/payments/unmatched",
						children: [
							"Unmatched (",
							unmatched,
							")"
						]
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/payments/unmatched",
						children: "Unmatched"
					})
				}), canCreate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/payments/new",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Record payment"]
					})
				}) : null] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				headers: [
					"When",
					"Member",
					"Amount",
					"Source",
					"Ref",
					"Status",
					""
				],
				children: payments.map((p) => {
					const m = members.find((x) => x.id === p.memberId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "text-muted whitespace-nowrap",
							children: formatDate(p.createdAt)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: m?.fullName ?? p.memberId }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "tabular-nums",
							children: formatINR(p.amount)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: p.source }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "max-w-[140px] truncate font-mono text-xs",
							children: p.reference || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: p.status }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								canApprove && p.status === "PENDING" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-sm text-primary",
									onClick: () => {
										const res = approve(p.id);
										if (!res.ok) toast.error(res.error);
										else toast.success("Approved.");
									},
									children: "Approve"
								}) : null,
								canAlloc && p.status !== "REVERSED" && p.status !== "ALLOCATED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-sm text-primary",
									onClick: () => {
										setAllocFor(p.id);
										setAmount(String(p.amount));
										setInstId("");
									},
									children: "Allocate"
								}) : null,
								canDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-sm text-danger",
									onClick: () => {
										setDelFor(p.id);
										setReason("");
									},
									children: "Delete"
								}) : null
							]
						}) })
					] }, p.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!allocFor,
				onOpenChange: (o) => !o && setAllocFor(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					title: "Allocate to installment",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-sm text-muted",
						children: "Locked (fully paid) installments cannot be edited without installments.edit_paid."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "flex flex-col gap-3",
						onSubmit: (e) => {
							e.preventDefault();
							if (!allocFor) return;
							const res = allocate(allocFor, instId, Number(amount));
							if (!res.ok) toast.error(res.error);
							else {
								toast.success("Allocated.");
								setAllocFor(null);
							}
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Installment",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: instId,
									onChange: (e) => setInstId(e.target.value),
									required: true,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Select…"
									}), memberInst.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: i.id,
										children: [
											"#",
											i.installmentNumber,
											" · due ",
											formatDate(i.dueDate),
											" · ",
											i.status,
											" · paid ",
											formatINR(i.amountPaid),
											" /",
											" ",
											formatINR(i.amountDue)
										]
									}, i.id))]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Amount",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 1,
									value: amount,
									onChange: (e) => setAmount(e.target.value),
									required: true
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								children: "Allocate"
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!delFor,
				onOpenChange: (o) => !o && setDelFor(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					title: "Soft-delete payment",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-sm text-muted",
						children: "Never a hard delete. Reason is required and audit-logged."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "flex flex-col gap-3",
						onSubmit: (e) => {
							e.preventDefault();
							if (!delFor) return;
							const res = del(delFor, reason);
							if (!res.ok) toast.error(res.error);
							else {
								toast.success("Payment reversed (soft delete).");
								setDelFor(null);
							}
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Reason",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: reason,
								onChange: (e) => setReason(e.target.value),
								required: true
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							variant: "danger",
							children: "Confirm"
						})]
					})]
				})
			})
		]
	});
}
//#endregion
export { PaymentsPage as component };
