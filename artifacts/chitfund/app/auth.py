"""
Authentication + authorization enforcement.

Everything here runs on the BACKEND. Templates may also hide buttons/menu
items for a nicer UX, but that is cosmetic only -- every route that changes
or reveals protected data goes through require_permission/require_role/
require_any_permission below, and every one of those returns HTTP 403 (JSON)
or renders a 403 page, never silently allowing through.
"""
import secrets
from datetime import datetime, timedelta, timezone
from functools import wraps

from flask import (
    Blueprint, current_app, g, jsonify, redirect, render_template,
    request, session, url_for, flash
)

from app.extensions import db
from app.models import User, Session as SessionModel, AuditLog, utcnow

auth_bp = Blueprint("auth", __name__)


# ---------------------------------------------------------------------------
# Session helpers (server-side session table, not just a signed cookie)
# ---------------------------------------------------------------------------

def _client_ip():
    return request.headers.get("X-Forwarded-For", request.remote_addr) or "unknown"


def create_session(user):
    token = secrets.token_urlsafe(48)
    timeout = current_app.config["PERMANENT_SESSION_LIFETIME"]
    sess = SessionModel(
        id=token,
        user_id=user.id,
        ip_address=_client_ip(),
        user_agent=request.headers.get("User-Agent", "")[:255],
        expires_at=datetime.utcnow() + timeout,
    )
    db.session.add(sess)
    db.session.commit()
    session.clear()
    session["session_token"] = token
    session.permanent = True
    return sess


def destroy_current_session():
    token = session.get("session_token")
    if token:
        sess = SessionModel.query.get(token)
        if sess:
            sess.revoked = True
            db.session.commit()
    session.clear()


def load_logged_in_user():
    """Runs on every request (registered as before_request). Populates g.user
    and enforces server-side expiry/revocation -- not just cookie trust."""
    g.user = None
    token = session.get("session_token")
    if not token:
        return
    sess = SessionModel.query.get(token)
    if not sess or sess.revoked or sess.expires_at < datetime.utcnow():
        session.clear()
        return
    user = User.query.get(sess.user_id)
    if not user or not user.is_active:
        session.clear()
        return
    # sliding expiry
    sess.last_seen_at = datetime.utcnow()
    sess.expires_at = datetime.utcnow() + current_app.config["PERMANENT_SESSION_LIFETIME"]
    db.session.commit()
    g.user = user


# ---------------------------------------------------------------------------
# Audit helper
# ---------------------------------------------------------------------------

def log_action(action, module=None, record_type=None, record_id=None,
                result="SUCCESS", reason=None, old_value=None, new_value=None):
    entry = AuditLog(
        user_id=g.user.id if getattr(g, "user", None) else None,
        role_name=g.user.role.name if getattr(g, "user", None) and g.user.role else None,
        action=action,
        module=module,
        record_type=record_type,
        record_id=str(record_id) if record_id is not None else None,
        ip_address=_client_ip(),
        result=result,
        reason=reason,
        old_value=old_value,
        new_value=new_value,
    )
    db.session.add(entry)
    db.session.commit()


# ---------------------------------------------------------------------------
# Decorators — the actual access control enforcement
# ---------------------------------------------------------------------------

def _deny(reason):
    log_action("ACCESS_DENIED", result="DENIED", reason=reason)
    if request.path.startswith("/api/"):
        return jsonify({"error": "forbidden", "message": reason}), 403
    return render_template("errors/403.html", reason=reason), 403


def login_required(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        if g.user is None:
            if request.path.startswith("/api/"):
                return jsonify({"error": "unauthorized"}), 401
            return redirect(url_for("auth.login", next=request.path))
        return view(*args, **kwargs)
    return wrapped


def require_permission(code):
    """@require_permission("payments.approve") — the pattern required by spec."""
    def decorator(view):
        @wraps(view)
        @login_required
        def wrapped(*args, **kwargs):
            if not g.user.has_permission(code):
                return _deny(f"missing permission: {code}")
            return view(*args, **kwargs)
        return wrapped
    return decorator


def require_any_permission(*codes):
    def decorator(view):
        @wraps(view)
        @login_required
        def wrapped(*args, **kwargs):
            if not any(g.user.has_permission(c) for c in codes):
                return _deny(f"missing any of permissions: {codes}")
            return view(*args, **kwargs)
        return wrapped
    return decorator


def require_role(*role_names):
    def decorator(view):
        @wraps(view)
        @login_required
        def wrapped(*args, **kwargs):
            if not g.user.role or g.user.role.name not in role_names:
                return _deny(f"requires role in: {role_names}")
            return view(*args, **kwargs)
        return wrapped
    return decorator


def require_module_enabled(module_key):
    """Blocks a route if Developer/Super Admin has disabled that module,
    at the BACKEND level -- not just hiding it in the menu."""
    def decorator(view):
        @wraps(view)
        def wrapped(*args, **kwargs):
            from app.models import ModuleSetting
            setting = ModuleSetting.query.get(module_key)
            if setting is not None and not setting.enabled:
                return _deny(f"module disabled: {module_key}")
            return view(*args, **kwargs)
        return wrapped
    return decorator


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return render_template("auth/login.html")

    username = request.form.get("username", "").strip()
    password = request.form.get("password", "")
    user = User.query.filter_by(username=username).first()

    lockout_minutes = current_app.config["LOGIN_LOCKOUT_MINUTES"]
    max_attempts = current_app.config["MAX_LOGIN_ATTEMPTS"]

    if user and user.locked_until and user.locked_until > datetime.utcnow():
        flash("Account temporarily locked due to repeated failed logins. Try again later.", "error")
        return render_template("auth/login.html"), 429

    if not user or not user.is_active or not user.check_password(password):
        if user and user.is_active:
            user.failed_login_count += 1
            if user.failed_login_count >= max_attempts:
                user.locked_until = datetime.utcnow() + timedelta(minutes=lockout_minutes)
            db.session.commit()
        g.user = None
        log_action("LOGIN_FAILED", result="DENIED", reason=f"username={username}")
        flash("Invalid username or password.", "error")
        return render_template("auth/login.html"), 401

    # success
    user.failed_login_count = 0
    user.locked_until = None
    db.session.commit()
    create_session(user)
    g.user = user
    log_action("LOGIN_SUCCESS")
    next_url = request.args.get("next") or url_for("dashboard.index")
    return redirect(next_url)


@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    log_action("LOGOUT")
    destroy_current_session()
    return redirect(url_for("auth.login"))
