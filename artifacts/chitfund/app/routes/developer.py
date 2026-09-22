import json
from flask import Blueprint, render_template, request, redirect, url_for, flash, g, jsonify, current_app

from app.extensions import db
from app.auth import require_permission, require_role, log_action
from app.models import (
    ModuleSetting, SystemSetting, FeatureFlag, CustomField, MenuItem,
    WorkflowSetting, ApiClient, ApiLog, DeveloperAction, DatabaseBackup,
    SystemLog, Payment, BankConnection, SmsDevice, User
)
import secrets
from werkzeug.security import generate_password_hash

developer_bp = Blueprint("developer", __name__)

MODULE_KEYS = [
    "member_management", "chit_management", "installments", "payments",
    "sms_collector", "bank_api", "manual_payments", "payment_allocation",
    "reminders", "reports", "receipts", "reconciliation", "audit_logs",
    "member_portal", "developer_console",
]

DANGEROUS_ACTION_TYPES = {
    "database_restore", "database_migration", "disable_module_core",
    "delete_financial_records", "change_bank_credentials",
}


# ---------------------------------------------------------------------------
# Overview
# ---------------------------------------------------------------------------

@developer_bp.route("/")
@require_permission("developer.view")
def overview():
    module_settings = {m.key: m.enabled for m in ModuleSetting.query.all()}
    recent_errors = SystemLog.query.filter_by(level="ERROR").order_by(SystemLog.timestamp.desc()).limit(10).all()
    pending_actions = DeveloperAction.query.filter_by(status="PENDING").count()
    return render_template(
        "developer/overview.html",
        modules=module_settings,
        recent_errors=recent_errors,
        pending_actions=pending_actions,
    )


# ---------------------------------------------------------------------------
# B. Module management -- disabling a module blocks routes at the backend,
#    not just hides the menu (enforced via require_module_enabled elsewhere).
# ---------------------------------------------------------------------------

@developer_bp.route("/modules", methods=["GET", "POST"])
@require_permission("developer.modules")
def modules():
    if request.method == "GET":
        settings = {m.key: m for m in ModuleSetting.query.all()}
        return render_template("developer/modules.html", module_keys=MODULE_KEYS, settings=settings)

    key = request.form["module_key"]
    enabled = request.form.get("enabled") == "true"
    if key == "developer_console" and not enabled and g.user.role.name != "SUPER_ADMIN":
        return jsonify({"error": "Only Super Admin may disable the Developer Console itself."}), 403

    setting = ModuleSetting.query.get(key)
    if not setting:
        setting = ModuleSetting(key=key, enabled=enabled, updated_by=g.user.id)
        db.session.add(setting)
    else:
        setting.enabled = enabled
        setting.updated_by = g.user.id
    db.session.commit()
    log_action("TOGGLE_MODULE", module="developer", record_type="ModuleSetting", record_id=key,
               new_value=str(enabled))
    flash(f"Module '{key}' {'enabled' if enabled else 'disabled'}.", "success")
    return redirect(url_for("developer.modules"))


# ---------------------------------------------------------------------------
# A. Website configuration
# ---------------------------------------------------------------------------

WEBSITE_SETTING_KEYS = [
    "site_name", "logo_url", "favicon_url", "theme", "primary_color", "color_mode",
    "footer_content", "company_info", "contact_info", "currency", "date_format", "timezone", "language",
]


@developer_bp.route("/settings", methods=["GET", "POST"])
@require_permission("developer.settings")
def website_settings():
    if request.method == "GET":
        settings = {s.key: s.value for s in SystemSetting.query.all()}
        return render_template("developer/settings.html", keys=WEBSITE_SETTING_KEYS, settings=settings)

    for key in WEBSITE_SETTING_KEYS:
        if key in request.form:
            setting = SystemSetting.query.get(key)
            if not setting:
                setting = SystemSetting(key=key, category="branding")
                db.session.add(setting)
            setting.value = request.form[key]
            setting.updated_by = g.user.id
    db.session.commit()
    log_action("UPDATE_WEBSITE_SETTINGS", module="developer")
    flash("Website settings saved.", "success")
    return redirect(url_for("developer.website_settings"))


# ---------------------------------------------------------------------------
# C. Form builder — data-driven only, never executes user-supplied code
# ---------------------------------------------------------------------------

ALLOWED_FIELD_TYPES = {"text", "number", "date", "select", "checkbox", "textarea", "email", "phone"}


@developer_bp.route("/forms", methods=["GET", "POST"])
@require_permission("developer.forms")
def form_builder():
    if request.method == "GET":
        form_key = request.args.get("form_key", "member_form")
        fields = CustomField.query.filter_by(form_key=form_key).order_by(CustomField.order_index).all()
        return render_template("developer/forms.html", fields=fields, form_key=form_key)

    field_type = request.form["field_type"]
    if field_type not in ALLOWED_FIELD_TYPES:
        # Hard allow-list. There is no path from this form to eval/exec/template
        # injection -- field_type and validation_regex are stored as inert data
        # and only ever used to pick a rendering widget or run re.match.
        return jsonify({"error": f"unsupported field type: {field_type}"}), 400

    field = CustomField(
        form_key=request.form["form_key"],
        field_name=request.form["field_name"],
        label=request.form["label"],
        field_type=field_type,
        required=request.form.get("required") == "true",
        visible=request.form.get("visible", "true") == "true",
        order_index=int(request.form.get("order_index", 0)),
        default_value=request.form.get("default_value"),
        validation_regex=request.form.get("validation_regex") or None,
        help_text=request.form.get("help_text"),
        options_json=request.form.get("options_json"),
    )
    db.session.add(field)
    db.session.commit()
    log_action("CREATE_CUSTOM_FIELD", module="developer", record_type="CustomField", record_id=field.id)
    flash("Field added.", "success")
    return redirect(url_for("developer.form_builder", form_key=field.form_key))


# ---------------------------------------------------------------------------
# D. Dashboard / menu builder
# ---------------------------------------------------------------------------

@developer_bp.route("/menu", methods=["GET", "POST"])
@require_permission("developer.dashboard")
def menu_builder():
    if request.method == "GET":
        items = MenuItem.query.order_by(MenuItem.order_index).all()
        return render_template("developer/menu.html", items=items)

    item = MenuItem(
        label=request.form["label"],
        url=request.form["url"],
        icon=request.form.get("icon"),
        order_index=int(request.form.get("order_index", 0)),
        required_permission=request.form.get("required_permission") or None,
    )
    db.session.add(item)
    db.session.commit()
    log_action("CREATE_MENU_ITEM", module="developer", record_type="MenuItem", record_id=item.id)
    return redirect(url_for("developer.menu_builder"))


# ---------------------------------------------------------------------------
# E. Workflow configuration
# ---------------------------------------------------------------------------

WORKFLOW_KEYS = [
    "payment_approval", "member_matching", "unmatched_payment", "installment_allocation",
    "reminder_workflow", "bank_sync_frequency", "sms_processing", "manual_adjustment_approval",
    "refund_workflow", "advance_payment_workflow",
]


@developer_bp.route("/workflows", methods=["GET", "POST"])
@require_permission("developer.workflow")
def workflows():
    if request.method == "GET":
        settings = {w.key: w.config_json for w in WorkflowSetting.query.all()}
        return render_template("developer/workflows.html", keys=WORKFLOW_KEYS, settings=settings)

    key = request.form["key"]
    if key not in WORKFLOW_KEYS:
        return jsonify({"error": "unknown workflow key"}), 400
    try:
        config = json.loads(request.form["config_json"])
    except (ValueError, KeyError):
        return jsonify({"error": "config_json must be valid JSON"}), 400

    setting = WorkflowSetting.query.get(key)
    if not setting:
        setting = WorkflowSetting(key=key)
        db.session.add(setting)
    setting.config_json = json.dumps(config)
    setting.updated_by = g.user.id
    db.session.commit()
    log_action("UPDATE_WORKFLOW", module="developer", record_type="WorkflowSetting", record_id=key)
    flash("Workflow updated.", "success")
    return redirect(url_for("developer.workflows"))


# ---------------------------------------------------------------------------
# F. API management -- secrets are always masked, never returned in plaintext
# ---------------------------------------------------------------------------

@developer_bp.route("/api-clients", methods=["GET", "POST"])
@require_permission("developer.api")
def api_clients():
    if request.method == "GET":
        clients = ApiClient.query.all()
        return render_template("developer/api_clients.html", clients=clients)

    name = request.form["name"]
    scopes = request.form.get("scopes", "")
    raw_secret = secrets.token_urlsafe(32)
    client = ApiClient(
        name=name,
        client_id=secrets.token_hex(16),
        secret_hash=generate_password_hash(raw_secret),
        scopes=scopes,
        created_by=g.user.id,
    )
    db.session.add(client)
    db.session.commit()
    log_action("CREATE_API_CLIENT", module="developer", record_type="ApiClient", record_id=client.id)
    # The raw secret is shown exactly once, at creation time, then never again.
    flash(f"API client created. Secret (shown once): {raw_secret}", "success")
    return redirect(url_for("developer.api_clients"))


@developer_bp.route("/api-clients/<int:client_id>/revoke", methods=["POST"])
@require_permission("developer.api")
def revoke_api_client(client_id):
    from datetime import datetime, timezone
    client = ApiClient.query.get_or_404(client_id)
    client.is_active = False
    client.revoked_at = datetime.utcnow()
    db.session.commit()
    log_action("REVOKE_API_CLIENT", module="developer", record_type="ApiClient", record_id=client_id)
    flash("API client revoked.", "success")
    return redirect(url_for("developer.api_clients"))


@developer_bp.route("/api-logs")
@require_permission("developer.api")
def api_logs():
    logs = ApiLog.query.order_by(ApiLog.timestamp.desc()).limit(200).all()
    return render_template("developer/api_logs.html", logs=logs)


# ---------------------------------------------------------------------------
# G. SMS Collector management
# ---------------------------------------------------------------------------

@developer_bp.route("/sms-devices", methods=["GET", "POST"])
@require_permission("developer.view")
def sms_devices():
    if not (g.user.has_permission("sms.manage_devices") or g.user.role.name == "SUPER_ADMIN"):
        return jsonify({"error": "forbidden"}), 403

    if request.method == "GET":
        devices = SmsDevice.query.all()
        return render_template("developer/sms_devices.html", devices=devices)

    action = request.form["action"]
    device = SmsDevice.query.get_or_404(int(request.form["device_id"]))
    if action == "approve":
        device.status = "APPROVED"
    elif action == "disable":
        device.status = "DISABLED"
    else:
        return jsonify({"error": "unknown action"}), 400
    db.session.commit()
    log_action(f"SMS_DEVICE_{action.upper()}", module="developer", record_type="SmsDevice", record_id=device.id)
    return redirect(url_for("developer.sms_devices"))


# ---------------------------------------------------------------------------
# H. Bank API management -- mock adapter only unless real credentials given
# ---------------------------------------------------------------------------

@developer_bp.route("/bank-providers", methods=["GET", "POST"])
@require_permission("bank.manage_providers")
def bank_providers():
    if request.method == "GET":
        connections = BankConnection.query.all()
        return render_template(
            "developer/bank_providers.html",
            connections=connections,
            provider_mode=current_app.config["BANK_PROVIDER_MODE"],
        )

    provider_name = request.form.get("provider_name", "mock")
    if provider_name != "mock" and current_app.config["BANK_PROVIDER_MODE"] != "live":
        flash(
            "Only the mock bank provider is available until real credentials and "
            "official API documentation are supplied (set BANK_PROVIDER_MODE=live).",
            "error",
        )
        return redirect(url_for("developer.bank_providers"))

    connection = BankConnection(
        provider_name=provider_name,
        is_enabled=False,  # dangerous action: enabling requires the flow below
        sync_frequency_minutes=int(request.form.get("sync_frequency_minutes", 60)),
        configured_by=g.user.id,
    )
    db.session.add(connection)
    db.session.commit()
    log_action("CREATE_BANK_CONNECTION", module="developer", record_type="BankConnection", record_id=connection.id)
    flash("Bank connection created (disabled). Enable it explicitly once verified.", "success")
    return redirect(url_for("developer.bank_providers"))


# ---------------------------------------------------------------------------
# I. Database tools -- read-only by default, dangerous ops go to an approval
#    queue instead of executing immediately (spec section 12).
# ---------------------------------------------------------------------------

SAFE_INSPECTABLE_TABLES = {
    "members", "chit_schemes", "member_chits", "chit_installments", "payments",
    "payment_allocations", "sms_devices", "sms_transactions", "bank_connections",
    "bank_transactions", "reminders", "users", "roles", "permissions", "audit_logs",
}


@developer_bp.route("/database")
@require_permission("developer.database")
def database_inspector():
    from sqlalchemy import inspect
    inspector = inspect(db.engine)
    tables = {}
    for table_name in inspector.get_table_names():
        tables[table_name] = {
            "columns": [c["name"] for c in inspector.get_columns(table_name)],
            "indexes": [i["name"] for i in inspector.get_indexes(table_name)],
            "foreign_keys": [fk["referred_table"] for fk in inspector.get_foreign_keys(table_name)],
        }
    return render_template("developer/database.html", tables=tables)


@developer_bp.route("/database/query", methods=["POST"])
@require_permission("developer.database")
def run_readonly_query():
    """Only pre-approved, parameterless SELECT-on-a-single-known-table queries
    are allowed. This is NOT a general SQL console -- see spec section 4.I / 12:
    'Do not provide unrestricted SQL execution in production.'"""
    table = request.form.get("table")
    if table not in SAFE_INSPECTABLE_TABLES:
        return jsonify({"error": "table not in the approved read-only list"}), 400

    from sqlalchemy import text
    # Table name is checked against a hard allow-list above, never interpolated
    # from arbitrary user text beyond that membership check.
    result = db.session.execute(text(f"SELECT * FROM {table} LIMIT 100"))
    rows = [dict(row._mapping) for row in result]
    log_action("RUN_READONLY_QUERY", module="developer", record_type="table", record_id=table)
    return jsonify({"table": table, "rows": rows})


@developer_bp.route("/database/backup", methods=["POST"])
@require_permission("developer.backup")
def create_backup():
    import shutil, os
    from datetime import datetime
    reason = request.form.get("reason", "").strip()
    if not reason:
        return jsonify({"error": "a reason is required for every backup"}), 400

    src = current_app.config["SQLALCHEMY_DATABASE_URI"].replace("sqlite:///", "")
    filename = f"backup_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.db"
    dest = os.path.join(current_app.instance_path, "backups", filename)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    try:
        shutil.copy(src, dest)
        size = os.path.getsize(dest)
    except OSError as e:
        log_action("CREATE_BACKUP", result="ERROR", reason=str(e))
        return jsonify({"error": "backup failed", "detail": str(e)}), 500

    backup = DatabaseBackup(filename=filename, size_bytes=size, created_by=g.user.id, reason=reason)
    db.session.add(backup)
    db.session.commit()
    log_action("CREATE_BACKUP", module="developer", record_type="DatabaseBackup", record_id=backup.id, reason=reason)
    flash("Backup created.", "success")
    return redirect(url_for("developer.overview"))


@developer_bp.route("/dangerous-actions", methods=["GET", "POST"])
@require_permission("developer.view")
def request_dangerous_action():
    """Developer REQUESTS a dangerous action; it only executes after a Super
    Admin approves it via admin_approve_action below (spec section 12)."""
    if request.method == "GET":
        actions = DeveloperAction.query.order_by(DeveloperAction.created_at.desc()).all()
        return render_template("developer/dangerous_actions.html", actions=actions,
                                allowed_types=sorted(DANGEROUS_ACTION_TYPES))

    action_type = request.form["action_type"]
    reason = request.form.get("reason", "").strip()
    if action_type not in DANGEROUS_ACTION_TYPES:
        return jsonify({"error": "unknown dangerous action type"}), 400
    if not reason:
        return jsonify({"error": "reason is required"}), 400

    action = DeveloperAction(
        requested_by=g.user.id, action_type=action_type,
        payload_json=request.form.get("payload_json", "{}"), reason=reason,
    )
    db.session.add(action)
    db.session.commit()
    log_action("REQUEST_DANGEROUS_ACTION", module="developer", record_type="DeveloperAction",
               record_id=action.id, reason=reason)
    flash("Request submitted for Super Admin approval.", "success")
    return redirect(url_for("developer.request_dangerous_action"))


@developer_bp.route("/dangerous-actions/<int:action_id>/decide", methods=["POST"])
@require_role("SUPER_ADMIN")
def decide_dangerous_action(action_id):
    from datetime import datetime, timezone
    action = DeveloperAction.query.get_or_404(action_id)
    decision = request.form["decision"]  # "APPROVED" or "REJECTED"
    if decision not in ("APPROVED", "REJECTED"):
        return jsonify({"error": "invalid decision"}), 400

    action.status = decision
    action.approved_by = g.user.id
    action.decided_at = datetime.utcnow()
    db.session.commit()
    log_action(f"DANGEROUS_ACTION_{decision}", module="developer", record_type="DeveloperAction",
               record_id=action_id)

    # NOTE: actual execution of the approved action (e.g. running the restore,
    # applying the migration) is intentionally a separate, explicit step run
    # by an operator from the CLI/ops runbook -- this app never auto-executes
    # a destructive operation purely because a status flag flipped to APPROVED.
    flash(f"Action {decision.lower()}.", "success")
    return redirect(url_for("developer.request_dangerous_action"))


# ---------------------------------------------------------------------------
# J. System monitoring
# ---------------------------------------------------------------------------

@developer_bp.route("/monitoring")
@require_permission("developer.logs")
def monitoring():
    error_logs = SystemLog.query.order_by(SystemLog.timestamp.desc()).limit(50).all()
    module_settings = {m.key: m.enabled for m in ModuleSetting.query.all()}
    return render_template("developer/monitoring.html", logs=error_logs, modules=module_settings)


# ---------------------------------------------------------------------------
# K. Notification configuration -- secrets never rendered in plaintext
# ---------------------------------------------------------------------------

NOTIFICATION_KEYS = ["email_provider", "sender_name", "reminder_timing", "retry_policy", "notifications_enabled"]


@developer_bp.route("/notifications", methods=["GET", "POST"])
@require_permission("developer.settings")
def notifications():
    if request.method == "GET":
        settings = {s.key: s.value for s in SystemSetting.query.filter(
            SystemSetting.key.in_(NOTIFICATION_KEYS)).all()}
        return render_template("developer/notifications.html", keys=NOTIFICATION_KEYS, settings=settings)

    for key in NOTIFICATION_KEYS:
        if key in request.form:
            setting = SystemSetting.query.get(key)
            if not setting:
                setting = SystemSetting(key=key, category="notifications")
                db.session.add(setting)
            # Provider passwords/API keys are handled via environment variables,
            # never stored here in plaintext -- only non-secret config like
            # sender name / timing / templates lives in system_settings.
            setting.value = request.form[key]
            setting.updated_by = g.user.id
    db.session.commit()
    flash("Notification settings saved.", "success")
    return redirect(url_for("developer.notifications"))
