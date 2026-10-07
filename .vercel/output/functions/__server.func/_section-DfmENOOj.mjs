import { i as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { h as MODULE_LABELS, i as Route$9, l as formatDateTime, m as MODULE_KEYS, o as useAppStore, u as formatINR } from "./_ssr/router-5YFTNEBk.mjs";
import { c as Field, d as Textarea, i as CardTitle, l as Input, n as Button, r as Card, u as Select } from "./_ssr/kit-DQB8BDzZ.mjs";
import { a as PageHeader, c as Td, i as ModuleOff, r as Forbidden, s as StatusBadge, t as DataTable } from "./_ssr/desk-D9-W6dAi.mjs";
import { n as useModuleOn, r as useSessionUser, t as useHas } from "./_ssr/session-MQtsOIYH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_section-DfmENOOj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TITLES = {
	modules: ["Modules", "Disabling a module blocks its routes, not just the menu."],
	settings: ["Website settings", "Branding and locale stored as data."],
	forms: ["Form builder", "Field types are allow-listed. Nothing here is executed as code."],
	menu: ["Menu builder", "Items hide unless the signed-in user has the required permission."],
	workflows: ["Workflows", "JSON configuration only."],
	api: ["API clients", "Secrets are hashed at rest and always masked in the UI."],
	bank: ["Bank providers", "Mock mode until live credentials are supplied. Bank API is the only automatic collection path."],
	database: ["Database inspector", "Allow-listed tables. No arbitrary SQL."],
	actions: ["Dangerous actions", "Developer requests; Super Admin decides."],
	monitoring: ["Monitoring", "System log, backups, scheduler slot."],
	notifications: ["Notifications", "Reminder queue. Scheduler is not wired in this desk."]
};
function DevSection() {
	const { section } = Route$9.useParams();
	const can = useHas("developer.view");
	const moduleOn = useModuleOn("developer_console");
	const meta = TITLES[section];
	if (!can) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forbidden, { reason: "developer.view is required." });
	if (!moduleOn) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleOff, { name: "developer console" });
	if (!meta) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Forbidden, { reason: "Unknown console section." });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "enter",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/developer",
					className: "text-muted hover:text-ink",
					children: "Developer"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-faint",
					children: [" / ", meta[0]]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "Developer console",
				title: meta[0],
				description: meta[1]
			}),
			section === "modules" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulesPanel, {}),
			section === "settings" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsPanel, {}),
			section === "forms" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormsPanel, {}),
			section === "menu" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuPanel, {}),
			section === "workflows" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkflowsPanel, {}),
			section === "api" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApiPanel, {}),
			section === "bank" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BankPanel, {}),
			section === "database" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatabasePanel, {}),
			section === "actions" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionsPanel, {}),
			section === "monitoring" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonitoringPanel, {}),
			section === "notifications" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotifyPanel, {})
		]
	});
}
function ModulesPanel() {
	const modules = useAppStore((s) => s.modules);
	const toggle = useAppStore((s) => s.toggleModule);
	const can = useHas("developer.modules");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
		headers: [
			"Module",
			"Status",
			""
		],
		children: MODULE_KEYS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-medium",
				children: MODULE_LABELS[k]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-mono text-[11px] text-muted",
				children: k
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: modules[k] ? "ENABLED" : "DISABLED" }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: can ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: modules[k] ? "outline" : "default",
				onClick: () => {
					const res = toggle(k, !modules[k]);
					if (!res.ok) toast.error(res.error);
					else toast.success(`${MODULE_LABELS[k]} ${modules[k] ? "disabled" : "enabled"}.`);
				},
				children: modules[k] ? "Disable" : "Enable"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-muted",
				children: "No permission"
			}) })
		] }, k))
	});
}
function SettingsPanel() {
	const settings = useAppStore((s) => s.settings);
	const update = useAppStore((s) => s.updateSettings);
	const [draft, setDraft] = (0, import_react.useState)(settings);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "max-w-xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "flex flex-col gap-3",
			onSubmit: (e) => {
				e.preventDefault();
				update(draft);
				toast.success("Settings saved.");
			},
			children: [[
				"site_name",
				"company_info",
				"contact_info",
				"currency",
				"timezone",
				"language",
				"footer_content"
			].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: k.replace(/_/g, " "),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: draft[k] ?? "",
					onChange: (e) => setDraft({
						...draft,
						[k]: e.target.value
					})
				})
			}, k)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				className: "w-fit",
				children: "Save"
			})]
		})
	});
}
function FormsPanel() {
	const fields = useAppStore((s) => s.customFields);
	const add = useAppStore((s) => s.addCustomField);
	const [formKey, setFormKey] = (0, import_react.useState)("member_form");
	const [fieldName, setFieldName] = (0, import_react.useState)("");
	const [label, setLabel] = (0, import_react.useState)("");
	const [fieldType, setFieldType] = (0, import_react.useState)("text");
	const [required, setRequired] = (0, import_react.useState)(false);
	const [helpText, setHelpText] = (0, import_react.useState)("");
	const visible = fields.filter((f) => f.formKey === formKey);
	function onSubmit(e) {
		e.preventDefault();
		const res = add({
			formKey,
			fieldName,
			label,
			fieldType,
			required,
			helpText
		});
		if (!res.ok) toast.error(res.error);
		else {
			toast.success("Field added.");
			setFieldName("");
			setLabel("");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "lg:col-span-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "mb-3",
				children: "Add field"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Form",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: formKey,
							onChange: (e) => setFormKey(e.target.value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "member_form",
									children: "member_form"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "chit_form",
									children: "chit_form"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "payment_form",
									children: "payment_form"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Field name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: fieldName,
							onChange: (e) => setFieldName(e.target.value),
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Label",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: label,
							onChange: (e) => setLabel(e.target.value),
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Type",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							value: fieldType,
							onChange: (e) => setFieldType(e.target.value),
							children: [
								"text",
								"number",
								"date",
								"select",
								"checkbox",
								"textarea",
								"email",
								"phone"
							].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: t }, t))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: required,
							onChange: (e) => setRequired(e.target.checked)
						}), "Required"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Help text",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: helpText,
							onChange: (e) => setHelpText(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Add"
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "lg:col-span-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				headers: [
					"Name",
					"Label",
					"Type",
					"Required"
				],
				children: visible.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "font-mono text-xs",
						children: f.fieldName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: f.label }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: f.fieldType }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: f.required ? "Yes" : "No" })
				] }, f.id))
			})
		})]
	});
}
function MenuPanel() {
	const items = useAppStore((s) => s.menuItems);
	const add = useAppStore((s) => s.addMenuItem);
	const [label, setLabel] = (0, import_react.useState)("");
	const [url, setUrl] = (0, import_react.useState)("/");
	const [perm, setPerm] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "lg:col-span-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex flex-col gap-3",
				onSubmit: (e) => {
					e.preventDefault();
					add({
						label,
						url,
						icon: "Circle",
						requiredPermission: perm
					});
					toast.success("Menu item added.");
					setLabel("");
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Label",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: label,
							onChange: (e) => setLabel(e.target.value),
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "URL",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: url,
							onChange: (e) => setUrl(e.target.value),
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Required permission",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: perm,
							onChange: (e) => setPerm(e.target.value),
							placeholder: "members.view"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Add"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "lg:col-span-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				headers: [
					"Label",
					"URL",
					"Permission"
				],
				children: items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: i.label }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "font-mono text-xs",
						children: i.url
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "font-mono text-xs",
						children: i.requiredPermission || "—"
					})
				] }, i.id))
			})
		})]
	});
}
function WorkflowsPanel() {
	const workflows = useAppStore((s) => s.workflows);
	const update = useAppStore((s) => s.updateWorkflow);
	const [key, setKey] = (0, import_react.useState)(Object.keys(workflows)[0] ?? "payment_approval");
	const [json, setJson] = (0, import_react.useState)(workflows[key] ?? "{}");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "max-w-2xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "flex flex-col gap-3",
			onSubmit: (e) => {
				e.preventDefault();
				const res = update(key, json);
				if (!res.ok) toast.error(res.error);
				else toast.success("Workflow saved.");
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Workflow",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						value: key,
						onChange: (e) => {
							setKey(e.target.value);
							setJson(workflows[e.target.value] ?? "{}");
						},
						children: Object.keys(workflows).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: k }, k))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Config JSON",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 8,
						className: "font-mono text-xs",
						value: json,
						onChange: (e) => setJson(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-fit",
					children: "Save"
				})
			]
		})
	});
}
function ApiPanel() {
	const clients = useAppStore((s) => s.apiClients);
	const logs = useAppStore((s) => s.apiLogs);
	const create = useAppStore((s) => s.createApiClient);
	const revoke = useAppStore((s) => s.revokeApiClient);
	const [name, setName] = (0, import_react.useState)("");
	const [scopes, setScopes] = (0, import_react.useState)("bank.webhook");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "max-w-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "mb-3",
					children: "New client"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "flex flex-col gap-3",
					onSubmit: (e) => {
						e.preventDefault();
						const res = create(name, scopes);
						if (!res.ok) toast.error(res.error);
						else {
							toast.success("Client created. Secret shown once as masked.");
							setName("");
						}
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: name,
								onChange: (e) => setName(e.target.value),
								required: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Scopes",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: scopes,
								onChange: (e) => setScopes(e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-fit",
							children: "Create"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				headers: [
					"Name",
					"Client ID",
					"Secret",
					"Scopes",
					"Status",
					""
				],
				children: clients.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: c.name }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "font-mono text-xs",
						children: c.clientId
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "font-mono text-xs",
						children: c.secretMasked
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "text-xs",
						children: c.scopes
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: c.isActive ? "ACTIVE" : "DISABLED" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: c.isActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-sm text-danger",
						onClick: () => revoke(c.id),
						children: "Revoke"
					}) : null })
				] }, c.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl",
				children: "API logs"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				headers: [
					"When",
					"Client",
					"Method",
					"Endpoint",
					"Status"
				],
				children: logs.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "text-muted",
						children: formatDateTime(l.timestamp)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "font-mono text-xs",
						children: l.clientId
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: l.method }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "font-mono text-xs",
						children: l.endpoint
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "tabular-nums",
						children: l.statusCode
					})
				] }, l.id))
			})
		]
	});
}
function BankPanel() {
	const connections = useAppStore((s) => s.bankConnections);
	const txns = useAppStore((s) => s.bankTxns);
	const sync = useAppStore((s) => s.mockBankSync);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "BANK_PROVIDER_MODE = mock. Live adapters need real bank credentials."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => {
						const res = sync();
						toast.success(`Mock sync finished (${res.fetched} fetched).`);
					},
					children: "Run mock sync"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				headers: [
					"Provider",
					"Account",
					"Enabled",
					"Last sync"
				],
				children: connections.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "font-mono",
						children: c.providerName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, { children: [c.accountName, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-xs text-muted",
						children: c.accountMasked
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: c.isEnabled ? "ENABLED" : "DISABLED" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "text-muted",
						children: c.lastSyncAt ? formatDateTime(c.lastSyncAt) : "—"
					})
				] }, c.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				headers: [
					"Date",
					"Amount",
					"Reference",
					"Status"
				],
				children: txns.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: t.transactionDate }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "tabular-nums",
						children: formatINR(t.amount)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "font-mono text-xs",
						children: t.reference
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: t.status }) })
				] }, t.id))
			})
		]
	});
}
function DatabasePanel() {
	const state = useAppStore();
	const tables = (0, import_react.useMemo)(() => [
		["members", state.members.length],
		["chit_schemes", state.schemes.length],
		["member_chits", state.enrollments.length],
		["chit_installments", state.installments.length],
		["payments", state.payments.length],
		["unmatched_payments", state.unmatched.length],
		["users", state.users.length],
		["audit_logs", state.audit.length],
		["api_clients", state.apiClients.length],
		["bank_transactions", state.bankTxns.length]
	], [state]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mb-4 max-w-xl text-sm text-muted",
		children: "Read-only counts. Arbitrary SQL is not offered — that is the point of the allow-list."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
		headers: ["Table", "Rows"],
		children: tables.map(([name, n]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
			className: "font-mono text-sm",
			children: name
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
			className: "tabular-nums",
			children: n
		})] }, String(name)))
	})] });
}
function ActionsPanel() {
	const user = useSessionUser();
	const actions = useAppStore((s) => s.actions);
	const users = useAppStore((s) => s.users);
	const request = useAppStore((s) => s.requestDangerousAction);
	const decide = useAppStore((s) => s.decideAction);
	const [type, setType] = (0, import_react.useState)("database_restore");
	const [reason, setReason] = (0, import_react.useState)("");
	const [payload, setPayload] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "lg:col-span-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "mb-3",
				children: "Request"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex flex-col gap-3",
				onSubmit: (e) => {
					e.preventDefault();
					const res = request(type, reason, payload);
					if (!res.ok) toast.error(res.error);
					else {
						toast.success("Queued for Super Admin.");
						setReason("");
					}
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Action type",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							value: type,
							onChange: (e) => setType(e.target.value),
							children: [
								"database_restore",
								"database_migration",
								"disable_module_core",
								"delete_financial_records",
								"change_bank_credentials"
							].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: t }, t))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Payload",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: payload,
							onChange: (e) => setPayload(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Reason",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: reason,
							onChange: (e) => setReason(e.target.value),
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Submit"
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "lg:col-span-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				headers: [
					"Type",
					"By",
					"Status",
					"Reason",
					""
				],
				children: actions.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "font-mono text-xs",
						children: a.actionType
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: users.find((u) => u.id === a.requestedBy)?.username }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: a.status }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "max-w-[180px] truncate text-xs",
						children: a.reason
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: a.status === "PENDING" && user?.role === "SUPER_ADMIN" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-sm text-primary",
							onClick: () => {
								const res = decide(a.id, true);
								if (!res.ok) toast.error(res.error);
								else toast.success("Approved.");
							},
							children: "Approve"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-sm text-danger",
							onClick: () => decide(a.id, false),
							children: "Reject"
						})]
					}) : null })
				] }, a.id))
			})
		})]
	});
}
function MonitoringPanel() {
	const logs = useAppStore((s) => s.systemLogs);
	const backups = useAppStore((s) => s.backups);
	const createBackup = useAppStore((s) => s.createBackup);
	const resetDemo = useAppStore((s) => s.resetDemo);
	const users = useAppStore((s) => s.users);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => {
						const res = createBackup("Manual snapshot from monitoring");
						if (!res.ok) toast.error(res.error);
						else toast.success("Backup recorded.");
					},
					children: "Create backup"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => {
						resetDemo();
						toast.success("Demo data reset. Sign in again.");
					},
					children: "Reset demo data"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "mb-2",
				children: "Scheduler"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "APScheduler is not wired in this desk. Reminder sending is manual from Notifications."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl",
				children: "Backups"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				headers: [
					"File",
					"Size",
					"By",
					"When"
				],
				children: backups.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "font-mono text-xs",
						children: b.filename
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, {
						className: "tabular-nums",
						children: [Math.round(b.sizeBytes / 1024), " KB"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: users.find((u) => u.id === b.createdBy)?.username }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "text-muted",
						children: formatDateTime(b.createdAt)
					})
				] }, b.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl",
				children: "System log"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				headers: [
					"When",
					"Level",
					"Source",
					"Message"
				],
				children: logs.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "whitespace-nowrap text-muted",
						children: formatDateTime(l.timestamp)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: l.level }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "font-mono text-xs",
						children: l.source
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: l.message })
				] }, l.id))
			})
		]
	});
}
function NotifyPanel() {
	const reminders = useAppStore((s) => s.reminders);
	const members = useAppStore((s) => s.members);
	const send = useAppStore((s) => s.sendReminder);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
		headers: [
			"Member",
			"Channel",
			"Status",
			"Message",
			""
		],
		children: reminders.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: members.find((m) => m.id === r.memberId)?.fullName }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: r.channel }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: r.status }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "max-w-sm text-xs text-muted",
				children: r.message
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: r.status === "PENDING" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "text-sm text-primary",
				onClick: () => {
					send(r.id);
					toast.success("In-app reminder posted to that member’s alerts.");
				},
				children: "Send now"
			}) : null })
		] }, r.id))
	});
}
//#endregion
export { DevSection as component };
