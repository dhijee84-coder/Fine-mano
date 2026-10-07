import { i as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { c as formatDate, o as useAppStore, r as Route$7, u as formatINR } from "./_ssr/router-5YFTNEBk.mjs";
import { a as Dialog, c as Field, i as CardTitle, l as Input, n as Button, o as DialogContent, r as Card, s as DialogTrigger } from "./_ssr/kit-DQB8BDzZ.mjs";
import { a as PageHeader, c as Td, i as ModuleOff, r as Forbidden, s as StatusBadge, t as DataTable } from "./_ssr/desk-D9-W6dAi.mjs";
import { i as useVisibleMembers, n as useModuleOn, t as useHas } from "./_ssr/session-MQtsOIYH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_memberId-Cm1F3Wnn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MemberDetail() {
	const { memberId } = Route$7.useParams();
	const canView = useHas("members.view");
	const canEdit = useHas("members.edit");
	const canDelete = useHas("members.delete");
	const moduleOn = useModuleOn("member_management");
	const navigate = useNavigate();
	const member = useVisibleMembers().find((m) => m.id === memberId);
	const allMember = useAppStore((s) => s.members.find((m) => m.id === memberId));
	const schemes = useAppStore((s) => s.schemes);
	const enrollments = useAppStore((s) => s.enrollments).filter((e) => e.memberId === memberId);
	const payments = useAppStore((s) => s.payments).filter((p) => p.memberId === memberId && !p.deletedAt);
	const updateMember = useAppStore((s) => s.updateMember);
	const softDeleteMember = useAppStore((s) => s.softDeleteMember);
	const issueMemberLogin = useAppStore((s) => s.issueMemberLogin);
	const canIssueLogin = useHas("users.create");
	const portal = useAppStore((s) => s.users).find((u) => u.memberId === memberId);
	const [fullName, setFullName] = (0, import_react.useState)(member?.fullName ?? "");
	const [phone, setPhone] = (0, import_react.useState)(member?.phone ?? "");
	const [email, setEmail] = (0, import_react.useState)(member?.email ?? "");
	const [address, setAddress] = (0, import_react.useState)(member?.address ?? "");
	const [city, setCity] = (0, import_react.useState)(member?.city ?? "");
	const [reason, setReason] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	if (!canView) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forbidden, { reason: "members.view is required." });
	if (!moduleOn) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleOff, { name: "member management" });
	if (!member) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forbidden, { reason: allMember ? "This member is not on your assigned book." : "Member not found." });
	function onSave(e) {
		e.preventDefault();
		const res = updateMember(memberId, {
			fullName,
			phone,
			email,
			address,
			city
		});
		if (!res.ok) {
			toast.error(res.error);
			return;
		}
		toast.success("Member updated.");
	}
	function onDelete(e) {
		e.preventDefault();
		const res = softDeleteMember(memberId, reason);
		if (!res.ok) {
			toast.error(res.error);
			return;
		}
		toast.success("Member soft-deleted.");
		setOpen(false);
		navigate({ to: "/members" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "enter",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Member",
			title: member.fullName,
			description: `${member.city} · ${member.phone}`,
			actions: canDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "danger",
						children: "Soft delete"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					title: "Delete member",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-sm text-muted",
						children: "Soft delete only. Financial history stays. A reason is required and is written to the audit log."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: onDelete,
						className: "flex flex-col gap-3",
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
							children: "Confirm delete"
						})]
					})]
				})]
			}) : null
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "mb-3",
					children: "Record"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: onSave,
					className: "flex flex-col gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Full name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: fullName,
								onChange: (e) => setFullName(e.target.value),
								disabled: !canEdit
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Phone",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: phone,
								onChange: (e) => setPhone(e.target.value),
								disabled: !canEdit
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Email",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: email,
								onChange: (e) => setEmail(e.target.value),
								disabled: !canEdit
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Address",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: address,
								onChange: (e) => setAddress(e.target.value),
								disabled: !canEdit
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "City",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: city,
								onChange: (e) => setCity(e.target.value),
								disabled: !canEdit
							})
						}),
						canEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "mt-1 w-fit",
							children: "Save changes"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Read-only for your role."
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 lg:col-span-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "mb-3",
						children: "Portal login"
					}), portal ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Give these to the subscriber. They type them on Sign in — not a role card."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-1 font-mono text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-faint",
									children: "User ID"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: portal.username }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-faint",
									children: "Password"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: portal.password })
							]
						})]
					}) : canIssueLogin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "This subscriber has no login yet. Issue one so they can open their own chits, dues, and receipts."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							className: "w-fit",
							onClick: () => {
								const res = issueMemberLogin(memberId);
								if (!res.ok) toast.error(res.error);
								else toast.success(`Portal login: ${res.username} / ${res.password}`);
							},
							children: "Create portal login"
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "No portal login on this record."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "mb-3",
						children: "Enrolled chits"
					}), enrollments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Not enrolled in any scheme."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "flex flex-col gap-2",
						children: enrollments.map((e) => {
							const s = schemes.find((x) => x.id === e.chitSchemeId);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between rounded-md bg-surface-2 px-3 py-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s?.name ?? e.chitSchemeId }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: e.status })]
							}, e.id);
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display mb-3 text-xl",
						children: "Payments"
					}), payments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "No payments recorded."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
						headers: [
							"Date",
							"Amount",
							"Source",
							"Status"
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: p.source }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: p.status }) })
						] }, p.id))
					})] })
				]
			})]
		})]
	});
}
//#endregion
export { MemberDetail as component };
