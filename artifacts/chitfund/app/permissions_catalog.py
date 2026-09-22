"""
Single source of truth for every permission in the system and which roles get
it by default. This is seeded into the database (roles/permissions/role_permissions
tables) by seed.py, and Super Admin can subsequently add/remove permissions
per-role or per-user through the UI -- this file only defines the STARTING state.

Format: code -> (category, description, is_financial, is_dangerous)
"""

PERMISSIONS = {
    # Users / access control
    "users.view": ("users", "View user accounts", False, False),
    "users.create": ("users", "Create user accounts", False, False),
    "users.edit": ("users", "Edit user accounts", False, False),
    "users.delete": ("users", "Delete/disable user accounts", False, True),
    "users.assign_roles": ("users", "Change a user's role", False, True),
    "users.assign_superadmin": ("users", "Promote a user to Super Admin", False, True),
    "users.reset_password": ("users", "Reset another user's password", False, True),
    "users.manage_permissions": ("users", "Grant/revoke individual permissions", False, True),

    # Members
    "members.view": ("members", "View member records", False, False),
    "members.view_all": ("members", "View all members, not just assigned", False, False),
    "members.create": ("members", "Create members", False, False),
    "members.edit": ("members", "Edit members", False, False),
    "members.delete": ("members", "Delete members", False, True),
    "members.export": ("members", "Export member data", False, False),

    # Chits
    "chits.view": ("chits", "View chit schemes", False, False),
    "chits.create": ("chits", "Create chit schemes", False, False),
    "chits.edit": ("chits", "Edit chit schemes", False, False),
    "chits.delete": ("chits", "Delete chit schemes", False, True),

    # Installments
    "installments.view": ("installments", "View installments", False, False),
    "installments.create": ("installments", "Create installments", True, False),
    "installments.edit": ("installments", "Edit installments", True, False),
    "installments.edit_paid": ("installments", "Edit an already-paid installment", True, True),
    "installments.generate": ("installments", "Auto-generate installment schedules", True, False),

    # Payments
    "payments.view": ("payments", "View payments", True, False),
    "payments.create": ("payments", "Record manual payments", True, False),
    "payments.edit": ("payments", "Edit payments", True, False),
    "payments.delete": ("payments", "Delete payments", True, True),
    "payments.approve": ("payments", "Approve unmatched/pending payments", True, False),
    "payments.allocate": ("payments", "Allocate payments to installments", True, False),
    "payments.refund": ("payments", "Process refunds", True, True),

    # SMS
    "sms.view": ("sms", "View SMS transactions", False, False),
    "sms.process": ("sms", "Process parsed SMS transactions", True, False),
    "sms.reprocess": ("sms", "Reprocess failed SMS transactions", True, False),
    "sms.manage_devices": ("sms", "Register/approve/disable SMS devices", False, False),
    "sms.configure_parsers": ("sms", "Configure SMS bank parsers", False, False),

    # Bank
    "bank.view": ("bank", "View bank transactions", True, False),
    "bank.connect": ("bank", "Create bank connections", False, True),
    "bank.sync": ("bank", "Trigger bank synchronization", False, False),
    "bank.manage_providers": ("bank", "Configure bank provider adapters", False, True),
    "bank.manage_webhooks": ("bank", "Configure bank webhook endpoints", False, False),
    "bank.view_credentials": ("bank", "View bank credentials (masked only, UI-enforced)", False, True),

    # Reports
    "reports.view": ("reports", "View reports", False, False),
    "reports.export": ("reports", "Export reports", False, False),

    # Reminders
    "reminders.view": ("reminders", "View reminders", False, False),
    "reminders.create": ("reminders", "Create reminders", False, False),
    "reminders.edit": ("reminders", "Edit reminders", False, False),
    "reminders.send": ("reminders", "Send reminders now", False, False),

    # Reconciliation
    "reconciliation.view": ("reconciliation", "View reconciliation reports", True, False),

    # Receipts
    "receipts.view": ("receipts", "View/download receipts", False, False),

    # Developer / technical
    "developer.view": ("developer", "Access the Developer Console", False, False),
    "developer.settings": ("developer", "Change website configuration", False, False),
    "developer.modules": ("developer", "Enable/disable modules", False, True),
    "developer.forms": ("developer", "Configure the form builder", False, False),
    "developer.dashboard": ("developer", "Configure dashboard builder / menus", False, False),
    "developer.workflow": ("developer", "Configure workflow settings", False, False),
    "developer.api": ("developer", "Manage API clients/endpoints", False, False),
    "developer.api_secrets_view": ("developer", "View secrets (always masked)", False, True),
    "developer.database": ("developer", "Access read-only database inspector", False, False),
    "developer.database_write": ("developer", "Run approved write/maintenance ops", False, True),
    "developer.logs": ("developer", "View system/error logs", False, False),
    "developer.backup": ("developer", "Create database backups", False, True),
    "developer.restore": ("developer", "Restore database backups", False, True),
    "developer.scheduler": ("developer", "View/manage scheduler & background jobs", False, False),

    # Financial access explicitly separated from technical access (section 18)
    "developer.financial_access": (
        "developer",
        "Extra grant allowing a Developer to touch financial records "
        "(off by default; Super Admin must explicitly grant it)",
        True,
        True,
    ),

    # Audit
    "audit.view": ("audit", "View audit logs", False, False),
    "audit.export": ("audit", "Export audit logs", False, False),

    # System / security settings
    "settings.security": ("settings", "Change core security settings", False, True),
    "settings.branding": ("settings", "Change branding/UI settings", False, False),
}


ROLE_DEFAULTS = {
    "SUPER_ADMIN": list(PERMISSIONS.keys()),  # everything, always

    "ADMIN": [
        "members.view", "members.view_all", "members.create", "members.edit", "members.export",
        "chits.view", "chits.create", "chits.edit",
        "installments.view", "installments.create", "installments.generate", "installments.edit",
        "payments.view", "payments.create", "payments.edit", "payments.approve", "payments.allocate",
        "sms.view", "sms.process",
        "bank.view", "bank.sync",
        "reports.view", "reports.export",
        "reminders.view", "reminders.create", "reminders.edit", "reminders.send",
        "reconciliation.view", "receipts.view",
        "users.view", "users.create", "users.edit",  # can manage staff, not roles/superadmin
    ],

    "DEVELOPER": [
        "developer.view", "developer.settings", "developer.modules", "developer.forms",
        "developer.dashboard", "developer.workflow", "developer.api", "developer.api_secrets_view",
        "developer.database", "developer.logs", "developer.backup", "developer.scheduler",
        "audit.view",  # can see audit logs for debugging, cannot export/modify by default
        "settings.branding",
        # NOTE: no payments.*, no members.edit, no bank.manage_providers by default.
        # developer.financial_access must be explicitly granted by Super Admin (section 18).
    ],

    "ACCOUNTANT": [
        "members.view", "chits.view", "installments.view",
        "payments.view", "payments.create", "payments.allocate",
        "bank.view", "sms.view",
        "reports.view", "reconciliation.view", "receipts.view",
    ],

    "STAFF": [
        "members.view",  # scoped to assigned members at the query layer, not here
        "chits.view", "installments.view",
        "payments.create",  # enter pending payment info; cannot approve/delete
        "reminders.view",
    ],

    "MEMBER": [
        # Members never get row-level table permissions; the /member/* routes
        # only ever query rows filtered by the logged-in member's own ID.
        "receipts.view",
    ],

    "AUDITOR": [
        "members.view", "members.view_all", "chits.view", "installments.view",
        "payments.view", "bank.view", "sms.view",
        "reconciliation.view", "audit.view", "reports.view",
    ],
}
