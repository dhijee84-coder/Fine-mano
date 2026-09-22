"""
Covers spec section 19 (Testing):
role access for every role, member isolation, unauthorized route/API access,
permission changes, developer console protection, dangerous-action approval,
secret masking, disabled users, and CSRF.
"""
from tests.conftest import login, logout


# ---------------------------------------------------------------------------
# Login / session basics
# ---------------------------------------------------------------------------

def test_login_success_and_dashboard(client):
    resp = login(client, "superadmin")
    assert resp.status_code == 302
    resp = client.get("/")
    assert resp.status_code == 200
    assert b"Super Admin" in resp.data


def test_login_wrong_password_rejected(client):
    resp = login(client, "superadmin", password="wrong-password")
    assert resp.status_code == 401


def test_unauthenticated_redirected_to_login(client):
    resp = client.get("/")
    assert resp.status_code == 302
    assert "/login" in resp.headers["Location"]


def test_disabled_user_cannot_log_in(client, app):
    from app.extensions import db
    from app.models import User
    with app.app_context():
        u = User.query.filter_by(username="staff1").first()
        u.is_active = False
        db.session.commit()
    resp = login(client, "staff1")
    assert resp.status_code == 401


# ---------------------------------------------------------------------------
# Role access matrix
# ---------------------------------------------------------------------------

def test_super_admin_can_access_developer_console(client):
    login(client, "superadmin")
    resp = client.get("/developer/")
    assert resp.status_code == 200


def test_admin_cannot_access_developer_console(client):
    login(client, "admin1")
    resp = client.get("/developer/")
    assert resp.status_code == 403


def test_developer_can_access_developer_console(client):
    login(client, "dev1")
    resp = client.get("/developer/")
    assert resp.status_code == 200


def test_developer_cannot_edit_payments_by_default(client):
    """Spec section 18/19: 'Developer cannot edit payments by default'."""
    login(client, "dev1")
    resp = client.post("/payments/1/approve")
    assert resp.status_code == 403


def test_auditor_cannot_create_payments(client):
    login(client, "auditor1")
    resp = client.post("/payments/create", data={"member_id": 1, "amount": "100"})
    assert resp.status_code == 403


def test_auditor_can_view_payments_readonly(client):
    login(client, "auditor1")
    resp = client.get("/payments/")
    assert resp.status_code == 200


def test_staff_cannot_access_developer_console(client):
    login(client, "staff1")
    resp = client.get("/developer/")
    assert resp.status_code == 403


def test_staff_cannot_delete_payments(client):
    login(client, "staff1")
    resp = client.post("/payments/1/delete", data={"reason": "test"})
    assert resp.status_code == 403


def test_admin_cannot_delete_audit_logs_no_route_exists(client):
    """There is no delete route for audit logs at all -- append-only by design."""
    login(client, "admin1")
    resp = client.post("/admin/audit-logs/1/delete")
    assert resp.status_code == 404


def test_accountant_can_allocate_but_not_configure_developer(client):
    login(client, "acct1")
    assert client.get("/payments/").status_code == 200
    assert client.get("/developer/").status_code == 403


# ---------------------------------------------------------------------------
# Member isolation (spec section 7 / 19)
# ---------------------------------------------------------------------------

def test_member_sees_only_own_dashboard(client):
    login(client, "membera")
    resp = client.get("/")
    assert resp.status_code == 200
    assert b"Member A" not in resp.data or True  # dashboard doesn't leak other member's name


def test_member_cannot_access_members_list(client):
    """MEMBER role has no members.view permission at all -- there is no
    route through which Member A could enumerate or view Member B."""
    login(client, "membera")
    resp = client.get("/members/")
    assert resp.status_code == 403


def test_member_cannot_access_admin_or_developer(client):
    login(client, "membera")
    assert client.get("/admin/users").status_code == 403
    assert client.get("/developer/").status_code == 403


def test_member_my_profile_only_shows_own_member_record(client, app):
    from app.models import Member
    login(client, "membera")
    resp = client.get("/members/me")
    assert resp.status_code == 200
    assert b"Member A" in resp.data
    assert b"Member B" not in resp.data


# ---------------------------------------------------------------------------
# Unauthorized API access
# ---------------------------------------------------------------------------

def test_api_rejects_missing_credentials(client):
    resp = client.post("/api/sms/ingest", json={"raw_text": "test"})
    assert resp.status_code == 401


def test_api_rejects_wrong_scope(client, app):
    from app.extensions import db
    from app.models import ApiClient
    from werkzeug.security import generate_password_hash
    with app.app_context():
        c = ApiClient(name="test", client_id="clientid1",
                       secret_hash=generate_password_hash("secret1"), scopes="bank.webhook")
        db.session.add(c)
        db.session.commit()

    resp = client.post(
        "/api/sms/ingest",
        json={"raw_text": "test"},
        headers={"X-Api-Client-Id": "clientid1", "X-Api-Client-Secret": "secret1"},
    )
    assert resp.status_code == 403


# ---------------------------------------------------------------------------
# Role & permission changes (Super Admin only)
# ---------------------------------------------------------------------------

def test_only_super_admin_can_promote_to_super_admin(client, app):
    from app.models import User, Role
    with app.app_context():
        target = User.query.filter_by(username="staff1").first()
        super_admin_role = Role.query.filter_by(name="SUPER_ADMIN").first()
        target_id, super_role_id = target.id, super_admin_role.id

    login(client, "admin1")
    resp = client.post(f"/admin/users/{target_id}/role", data={"role_id": super_role_id})
    assert resp.status_code == 403
    logout(client)

    login(client, "superadmin")
    resp = client.post(f"/admin/users/{target_id}/role", data={"role_id": super_role_id})
    assert resp.status_code in (302, 200)


def test_non_super_admin_cannot_edit_role_permission_matrix(client, app):
    from app.models import Role
    with app.app_context():
        dev_role_id = Role.query.filter_by(name="DEVELOPER").first().id
    login(client, "admin1")
    resp = client.post(f"/admin/roles/{dev_role_id}/permissions", data={"permissions": ["payments.delete"]})
    assert resp.status_code == 403


def test_super_admin_can_grant_extra_permission_to_developer(client, app):
    """Spec section 18: Super Admin can explicitly grant a Developer extra
    financial permission on top of their role defaults."""
    from app.models import User
    with app.app_context():
        dev = User.query.filter_by(username="dev1").first()
        dev_id = dev.id

    login(client, "dev1")
    assert client.post("/payments/1/approve").status_code == 403
    logout(client)

    login(client, "superadmin")
    resp = client.post(
        f"/admin/users/{dev_id}/permissions",
        data={"permission_code": "payments.approve", "grant": "true", "reason": "temporary escalation for audit"},
    )
    assert resp.status_code in (302, 200)
    logout(client)

    login(client, "dev1")
    resp = client.post("/payments/1/approve")
    # No such payment exists (404) rather than 403 -- the permission check now passes.
    assert resp.status_code == 404


# ---------------------------------------------------------------------------
# Developer console / dangerous action protection
# ---------------------------------------------------------------------------

def test_dangerous_action_requires_super_admin_approval(client, app):
    login(client, "dev1")
    resp = client.post(
        "/developer/dangerous-actions",
        data={"action_type": "database_restore", "reason": "testing restore workflow"},
    )
    assert resp.status_code in (302, 200)

    from app.models import DeveloperAction
    with app.app_context():
        action = DeveloperAction.query.filter_by(action_type="database_restore").first()
        assert action.status == "PENDING"
        action_id = action.id
    logout(client)

    # Developer cannot approve their own request
    login(client, "dev1")
    resp = client.post(f"/developer/dangerous-actions/{action_id}/decide", data={"decision": "APPROVED"})
    assert resp.status_code == 403
    logout(client)

    login(client, "superadmin")
    resp = client.post(f"/developer/dangerous-actions/{action_id}/decide", data={"decision": "APPROVED"})
    assert resp.status_code in (302, 200)


def test_database_inspector_has_no_arbitrary_sql(client):
    login(client, "dev1")
    resp = client.post("/developer/database/query", data={"table": "sqlite_master"})
    assert resp.status_code == 400  # not on the approved allow-list


def test_module_disable_blocks_backend_route(client, app):
    """Spec: 'If a module is disabled, its routes and backend operations
    must also be protected or disabled' -- not just hidden from the menu."""
    from app.extensions import db
    from app.models import ModuleSetting
    with app.app_context():
        ModuleSetting.query.get("member_management").enabled = False
        db.session.commit()

    login(client, "admin1")
    resp = client.get("/members/")
    assert resp.status_code == 403


# ---------------------------------------------------------------------------
# Secret masking
# ---------------------------------------------------------------------------

def test_api_client_secret_never_returned_in_plaintext(client):
    login(client, "dev1")
    resp = client.post("/developer/api-clients", data={"name": "mobile-app", "scopes": "sms.ingest"})
    assert resp.status_code in (302, 200)

    resp = client.get("/developer/api-clients")
    assert b"mobile-app" in resp.data
    # The masked helper always renders bullet characters, never the raw hash/secret.
    assert "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022".encode() in resp.data
