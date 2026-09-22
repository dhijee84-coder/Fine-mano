"""
Database models.

RBAC design:
- roles: fixed set of 7 roles (Super Admin, Admin, Developer, Accountant, Staff, Member, Auditor)
- permissions: fine-grained permission strings, e.g. "payments.approve"
- role_permissions: many-to-many, defines the default permission set for a role
- user_permissions: per-user ADD or REVOKE overrides on top of their role's permissions
- A user's *effective* permission set = (role permissions) + (user grants) - (user revokes)

This lets Super Admin grant a Developer extra financial permissions, or take a
permission away from a specific Admin, without creating a whole new role.
"""
from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import UniqueConstraint
from app.extensions import db


def utcnow():
    return datetime.utcnow()


# ---------------------------------------------------------------------------
# RBAC core
# ---------------------------------------------------------------------------

ROLE_NAMES = [
    "SUPER_ADMIN",
    "ADMIN",
    "DEVELOPER",
    "ACCOUNTANT",
    "STAFF",
    "MEMBER",
    "AUDITOR",
]


class Role(db.Model):
    __tablename__ = "roles"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(255))

    permissions = db.relationship(
        "Permission", secondary="role_permissions", back_populates="roles"
    )


class Permission(db.Model):
    __tablename__ = "permissions"
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(100), unique=True, nullable=False)  # e.g. "payments.approve"
    category = db.Column(db.String(50), nullable=False)  # e.g. "payments"
    description = db.Column(db.String(255))
    is_financial = db.Column(db.Boolean, default=False, nullable=False)
    is_dangerous = db.Column(db.Boolean, default=False, nullable=False)

    roles = db.relationship(
        "Role", secondary="role_permissions", back_populates="permissions"
    )


class RolePermission(db.Model):
    __tablename__ = "role_permissions"
    role_id = db.Column(db.Integer, db.ForeignKey("roles.id"), primary_key=True)
    permission_id = db.Column(db.Integer, db.ForeignKey("permissions.id"), primary_key=True)


class UserPermission(db.Model):
    """Per-user override: grant=True adds a permission, grant=False revokes one
    that the user's role would otherwise have."""
    __tablename__ = "user_permissions"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    permission_id = db.Column(db.Integer, db.ForeignKey("permissions.id"), nullable=False)
    grant = db.Column(db.Boolean, nullable=False, default=True)
    granted_by = db.Column(db.Integer, db.ForeignKey("users.id"))
    reason = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=utcnow)

    permission = db.relationship("Permission")

    __table_args__ = (UniqueConstraint("user_id", "permission_id", name="uq_user_permission"),)


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey("roles.id"), nullable=False)

    is_active = db.Column(db.Boolean, default=True, nullable=False)
    failed_login_count = db.Column(db.Integer, default=0, nullable=False)
    locked_until = db.Column(db.DateTime, nullable=True)

    member_id = db.Column(db.Integer, db.ForeignKey("members.id"), nullable=True)
    created_at = db.Column(db.DateTime, default=utcnow)
    updated_at = db.Column(db.DateTime, default=utcnow, onupdate=utcnow)

    role = db.relationship("Role")
    permission_overrides = db.relationship("UserPermission", foreign_keys=[UserPermission.user_id])

    def set_password(self, raw_password):
        self.password_hash = generate_password_hash(raw_password)

    def check_password(self, raw_password):
        return check_password_hash(self.password_hash, raw_password)

    def effective_permissions(self):
        """Union of role permissions plus per-user grants, minus per-user revokes."""
        role_codes = {p.code for p in self.role.permissions} if self.role else set()
        for override in self.permission_overrides:
            code = override.permission.code
            if override.grant:
                role_codes.add(code)
            else:
                role_codes.discard(code)
        return role_codes

    def has_permission(self, code):
        return code in self.effective_permissions()


class Session(db.Model):
    """Server-side session record, so sessions can be revoked (logout everywhere,
    force-logout on disable, etc.) rather than trusting the cookie alone."""
    __tablename__ = "sessions"
    id = db.Column(db.String(64), primary_key=True)  # session token
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    ip_address = db.Column(db.String(64))
    user_agent = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=utcnow)
    last_seen_at = db.Column(db.DateTime, default=utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)
    revoked = db.Column(db.Boolean, default=False, nullable=False)


class AuditLog(db.Model):
    """Append-only audit trail. No route or code path in this app ever
    UPDATEs or DELETEs a row here."""
    __tablename__ = "audit_logs"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    role_name = db.Column(db.String(50))
    action = db.Column(db.String(100), nullable=False)
    module = db.Column(db.String(50))
    record_type = db.Column(db.String(50))
    record_id = db.Column(db.String(50))
    ip_address = db.Column(db.String(64))
    timestamp = db.Column(db.DateTime, default=utcnow)
    result = db.Column(db.String(20))  # SUCCESS / DENIED / ERROR
    reason = db.Column(db.String(255))
    old_value = db.Column(db.Text)
    new_value = db.Column(db.Text)


class SystemSetting(db.Model):
    __tablename__ = "system_settings"
    key = db.Column(db.String(100), primary_key=True)
    value = db.Column(db.Text)
    category = db.Column(db.String(50))  # branding, security, locale, etc.
    updated_by = db.Column(db.Integer, db.ForeignKey("users.id"))
    updated_at = db.Column(db.DateTime, default=utcnow, onupdate=utcnow)


class ModuleSetting(db.Model):
    __tablename__ = "module_settings"
    key = db.Column(db.String(50), primary_key=True)  # e.g. "sms_collector"
    enabled = db.Column(db.Boolean, default=True, nullable=False)
    updated_by = db.Column(db.Integer, db.ForeignKey("users.id"))
    updated_at = db.Column(db.DateTime, default=utcnow, onupdate=utcnow)


class FeatureFlag(db.Model):
    __tablename__ = "feature_flags"
    key = db.Column(db.String(50), primary_key=True)
    enabled = db.Column(db.Boolean, default=False, nullable=False)
    description = db.Column(db.String(255))


class CustomField(db.Model):
    """Backing store for the Developer form builder. Fields are DATA, never code."""
    __tablename__ = "custom_fields"
    id = db.Column(db.Integer, primary_key=True)
    form_key = db.Column(db.String(50), nullable=False)  # e.g. "member_form"
    field_name = db.Column(db.String(50), nullable=False)
    label = db.Column(db.String(100), nullable=False)
    field_type = db.Column(db.String(20), nullable=False)  # text, number, date, select, checkbox
    required = db.Column(db.Boolean, default=False)
    visible = db.Column(db.Boolean, default=True)
    order_index = db.Column(db.Integer, default=0)
    default_value = db.Column(db.String(255))
    validation_regex = db.Column(db.String(255))
    help_text = db.Column(db.String(255))
    options_json = db.Column(db.Text)  # for select/radio fields, JSON list

    __table_args__ = (UniqueConstraint("form_key", "field_name", name="uq_form_field"),)


class DashboardLayout(db.Model):
    __tablename__ = "dashboard_layouts"
    id = db.Column(db.Integer, primary_key=True)
    role_id = db.Column(db.Integer, db.ForeignKey("roles.id"), nullable=False)
    layout_json = db.Column(db.Text, nullable=False)  # ordered list of card/widget ids
    updated_by = db.Column(db.Integer, db.ForeignKey("users.id"))
    updated_at = db.Column(db.DateTime, default=utcnow, onupdate=utcnow)


class MenuItem(db.Model):
    __tablename__ = "menu_items"
    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(50), nullable=False)
    url = db.Column(db.String(120), nullable=False)
    icon = db.Column(db.String(50))
    order_index = db.Column(db.Integer, default=0)
    required_permission = db.Column(db.String(100))  # menu item hidden unless user has this
    visible = db.Column(db.Boolean, default=True)


class WorkflowSetting(db.Model):
    __tablename__ = "workflow_settings"
    key = db.Column(db.String(50), primary_key=True)  # e.g. "payment_approval"
    config_json = db.Column(db.Text)
    updated_by = db.Column(db.Integer, db.ForeignKey("users.id"))
    updated_at = db.Column(db.DateTime, default=utcnow, onupdate=utcnow)


class ApiClient(db.Model):
    __tablename__ = "api_clients"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    client_id = db.Column(db.String(64), unique=True, nullable=False)
    secret_hash = db.Column(db.String(255), nullable=False)  # never store plaintext
    scopes = db.Column(db.String(255))  # comma separated permission codes
    is_active = db.Column(db.Boolean, default=True)
    rate_limit_per_minute = db.Column(db.Integer, default=60)
    created_by = db.Column(db.Integer, db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=utcnow)
    revoked_at = db.Column(db.DateTime, nullable=True)

    def masked_secret(self):
        return "••••••••" + self.secret_hash[-4:] if self.secret_hash else "••••••••"


class ApiLog(db.Model):
    __tablename__ = "api_logs"
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.String(64))
    endpoint = db.Column(db.String(150))
    method = db.Column(db.String(10))
    status_code = db.Column(db.Integer)
    ip_address = db.Column(db.String(64))
    timestamp = db.Column(db.DateTime, default=utcnow)
    error_message = db.Column(db.String(255))


class DeveloperAction(db.Model):
    """Queue of dangerous developer-initiated actions awaiting Super Admin approval."""
    __tablename__ = "developer_actions"
    id = db.Column(db.Integer, primary_key=True)
    requested_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    action_type = db.Column(db.String(100), nullable=False)
    payload_json = db.Column(db.Text)
    reason = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(20), default="PENDING")  # PENDING, APPROVED, REJECTED, EXECUTED
    approved_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    created_at = db.Column(db.DateTime, default=utcnow)
    decided_at = db.Column(db.DateTime, nullable=True)


class DatabaseBackup(db.Model):
    __tablename__ = "database_backups"
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    size_bytes = db.Column(db.Integer)
    created_by = db.Column(db.Integer, db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=utcnow)
    reason = db.Column(db.String(255))


class SystemLog(db.Model):
    __tablename__ = "system_logs"
    id = db.Column(db.Integer, primary_key=True)
    level = db.Column(db.String(10))  # INFO, WARNING, ERROR
    source = db.Column(db.String(50))  # scheduler, sms, bank, api, app
    message = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=utcnow)


# ---------------------------------------------------------------------------
# Business domain
# ---------------------------------------------------------------------------

class Member(db.Model):
    __tablename__ = "members"
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(150), nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(255))
    address = db.Column(db.String(255))
    assigned_staff_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=utcnow)
    deleted_at = db.Column(db.DateTime, nullable=True)  # soft delete


class ChitScheme(db.Model):
    __tablename__ = "chit_schemes"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    total_amount = db.Column(db.Numeric(14, 2), nullable=False)
    duration_months = db.Column(db.Integer, nullable=False)
    installment_amount = db.Column(db.Numeric(14, 2), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), default="ACTIVE")
    created_by = db.Column(db.Integer, db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=utcnow)


class MemberChit(db.Model):
    __tablename__ = "member_chits"
    id = db.Column(db.Integer, primary_key=True)
    member_id = db.Column(db.Integer, db.ForeignKey("members.id"), nullable=False)
    chit_scheme_id = db.Column(db.Integer, db.ForeignKey("chit_schemes.id"), nullable=False)
    enrolled_at = db.Column(db.DateTime, default=utcnow)
    status = db.Column(db.String(20), default="ACTIVE")

    __table_args__ = (UniqueConstraint("member_id", "chit_scheme_id", name="uq_member_chit"),)


class ChitInstallment(db.Model):
    __tablename__ = "chit_installments"
    id = db.Column(db.Integer, primary_key=True)
    member_chit_id = db.Column(db.Integer, db.ForeignKey("member_chits.id"), nullable=False)
    installment_number = db.Column(db.Integer, nullable=False)
    due_date = db.Column(db.Date, nullable=False)
    amount_due = db.Column(db.Numeric(14, 2), nullable=False)
    amount_paid = db.Column(db.Numeric(14, 2), default=0)
    status = db.Column(db.String(20), default="PENDING")  # PENDING, PAID, PARTIAL, OVERDUE
    locked = db.Column(db.Boolean, default=False)  # paid installments get locked; edits need approval


class Payment(db.Model):
    __tablename__ = "payments"
    id = db.Column(db.Integer, primary_key=True)
    member_id = db.Column(db.Integer, db.ForeignKey("members.id"), nullable=False)
    amount = db.Column(db.Numeric(14, 2), nullable=False)
    source = db.Column(db.String(20), nullable=False)  # MANUAL, SMS, BANK
    reference = db.Column(db.String(100))
    status = db.Column(db.String(20), default="PENDING")  # PENDING, ALLOCATED, APPROVED, REVERSED
    recorded_by = db.Column(db.Integer, db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=utcnow)
    deleted_at = db.Column(db.DateTime, nullable=True)  # soft delete only


class PaymentAllocation(db.Model):
    __tablename__ = "payment_allocations"
    id = db.Column(db.Integer, primary_key=True)
    payment_id = db.Column(db.Integer, db.ForeignKey("payments.id"), nullable=False)
    installment_id = db.Column(db.Integer, db.ForeignKey("chit_installments.id"), nullable=False)
    amount = db.Column(db.Numeric(14, 2), nullable=False)
    allocated_by = db.Column(db.Integer, db.ForeignKey("users.id"))
    allocated_at = db.Column(db.DateTime, default=utcnow)


class UnmatchedPayment(db.Model):
    __tablename__ = "unmatched_payments"
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Numeric(14, 2), nullable=False)
    source = db.Column(db.String(20), nullable=False)
    raw_reference = db.Column(db.String(255))
    received_at = db.Column(db.DateTime, default=utcnow)
    status = db.Column(db.String(20), default="OPEN")  # OPEN, RESOLVED, IGNORED
    resolved_payment_id = db.Column(db.Integer, db.ForeignKey("payments.id"), nullable=True)


class SmsDevice(db.Model):
    __tablename__ = "sms_devices"
    id = db.Column(db.Integer, primary_key=True)
    device_name = db.Column(db.String(100), nullable=False)
    device_token_hash = db.Column(db.String(255), nullable=False)
    owner_user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    status = db.Column(db.String(20), default="PENDING")  # PENDING, APPROVED, DISABLED
    last_sync_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=utcnow)


class SmsTransaction(db.Model):
    __tablename__ = "sms_transactions"
    id = db.Column(db.Integer, primary_key=True)
    device_id = db.Column(db.Integer, db.ForeignKey("sms_devices.id"), nullable=False)
    raw_text = db.Column(db.Text, nullable=False)
    parsed_amount = db.Column(db.Numeric(14, 2))
    parsed_reference = db.Column(db.String(150))
    bank_name = db.Column(db.String(50))
    parse_status = db.Column(db.String(20), default="PENDING")  # PENDING, PARSED, FAILED
    received_at = db.Column(db.DateTime, default=utcnow)
    processed_payment_id = db.Column(db.Integer, db.ForeignKey("payments.id"), nullable=True)


class BankConnection(db.Model):
    __tablename__ = "bank_connections"
    id = db.Column(db.Integer, primary_key=True)
    provider_name = db.Column(db.String(50), nullable=False)  # "mock" until real adapter supplied
    is_enabled = db.Column(db.Boolean, default=False)
    credentials_encrypted = db.Column(db.Text)  # never expose in plaintext via API/UI
    sync_frequency_minutes = db.Column(db.Integer, default=60)
    configured_by = db.Column(db.Integer, db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=utcnow)


class BankAccount(db.Model):
    __tablename__ = "bank_accounts"
    id = db.Column(db.Integer, primary_key=True)
    bank_connection_id = db.Column(db.Integer, db.ForeignKey("bank_connections.id"), nullable=False)
    account_number_masked = db.Column(db.String(50))
    account_name = db.Column(db.String(100))


class BankTransaction(db.Model):
    __tablename__ = "bank_transactions"
    id = db.Column(db.Integer, primary_key=True)
    bank_account_id = db.Column(db.Integer, db.ForeignKey("bank_accounts.id"), nullable=False)
    amount = db.Column(db.Numeric(14, 2), nullable=False)
    reference = db.Column(db.String(150))
    transaction_date = db.Column(db.DateTime)
    status = db.Column(db.String(20), default="UNMATCHED")
    processed_payment_id = db.Column(db.Integer, db.ForeignKey("payments.id"), nullable=True)


class BankSyncLog(db.Model):
    __tablename__ = "bank_sync_logs"
    id = db.Column(db.Integer, primary_key=True)
    bank_connection_id = db.Column(db.Integer, db.ForeignKey("bank_connections.id"))
    started_at = db.Column(db.DateTime, default=utcnow)
    finished_at = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(20))  # SUCCESS, FAILED
    transactions_fetched = db.Column(db.Integer, default=0)
    error_message = db.Column(db.String(255))


class Reminder(db.Model):
    __tablename__ = "reminders"
    id = db.Column(db.Integer, primary_key=True)
    member_id = db.Column(db.Integer, db.ForeignKey("members.id"), nullable=False)
    installment_id = db.Column(db.Integer, db.ForeignKey("chit_installments.id"), nullable=True)
    channel = db.Column(db.String(20), default="SMS")  # SMS, EMAIL, IN_APP
    message = db.Column(db.Text)
    status = db.Column(db.String(20), default="PENDING")  # PENDING, SENT, FAILED
    scheduled_for = db.Column(db.DateTime)
    sent_at = db.Column(db.DateTime, nullable=True)


class AdvanceBalance(db.Model):
    __tablename__ = "advance_balances"
    id = db.Column(db.Integer, primary_key=True)
    member_id = db.Column(db.Integer, db.ForeignKey("members.id"), nullable=False)
    balance = db.Column(db.Numeric(14, 2), default=0)
    updated_at = db.Column(db.DateTime, default=utcnow, onupdate=utcnow)
