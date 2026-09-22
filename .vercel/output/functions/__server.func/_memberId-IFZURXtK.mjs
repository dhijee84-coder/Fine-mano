import { i as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { c as formatDate, o as useAppStore, r as Route$7, u as formatINR } from "./_ssr/router-CzIu6ndy.mjs";
import { t as PageHeader } from "./_ssr/page-header-BcO8feB4.mjs";
import { i as useModuleOn, o as useVisibleMembers, r as useHas, t as Button } from "./_ssr/session-BhtPFwO2.mjs";
import { n as Td, t as DataTable } from "./_ssr/data-table-uQ5ostzh.mjs";
import { t as StatusBadge } from "./_ssr/status-badge-BwE5ze5p.mjs";
import { n as ModuleOff, t as Forbidden } from "./_ssr/forbidden-Ctx_Cupf.mjs";
import { n as CardTitle, t as Card } from "./_ssr/card-Dh0onazs.mjs";
import { t as Field } from "./_ssr/field-CuxoslU4.mjs";
import { t as Input } from "./_ssr/input-CoJxW2XI.mjs";
import { n as DialogContent, r as DialogTrigger, t as Dialog } from "./_ssr/dialog-CKMFVqYj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_memberId-IFZURXtK.js
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
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
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
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
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
				})] })]
			})]
		})]
	});
}
//#endregion
export { MemberDetail as component };
