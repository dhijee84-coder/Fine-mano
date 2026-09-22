"""
External REST API surface (for Android SMS Collector app + bank webhook
receivers). Authenticated with an API client id/secret pair (see
ApiClient model), NOT the browser session cookie -- so it is CSRF-exempt
(registered in app/__init__.py) but every call still requires a valid,
non-revoked client credential plus the right scope.
"""
from functools import wraps
from flask import Blueprint, request, jsonify, g
from werkzeug.security import check_password_hash

from app.extensions import db, limiter
from app.models import ApiClient, ApiLog, ModuleSetting, SmsDevice, SmsTransaction

api_bp = Blueprint("api", __name__)


def _log_api_call(client_id, status_code, error=None):
    entry = ApiLog(
        client_id=client_id, endpoint=request.path, method=request.method,
        status_code=status_code, ip_address=request.headers.get("X-Forwarded-For", request.remote_addr),
        error_message=error,
    )
    db.session.add(entry)
    db.session.commit()


def require_api_scope(scope):
    def decorator(view):
        @wraps(view)
        def wrapped(*args, **kwargs):
            client_id = request.headers.get("X-Api-Client-Id")
            client_secret = request.headers.get("X-Api-Client-Secret")
            client = ApiClient.query.filter_by(client_id=client_id, is_active=True).first()

            if not client or not client_secret or not check_password_hash(client.secret_hash, client_secret):
                _log_api_call(client_id, 401, "invalid credentials")
                return jsonify({"error": "unauthorized"}), 401

            allowed_scopes = (client.scopes or "").split(",")
            if scope not in allowed_scopes:
                _log_api_call(client_id, 403, f"missing scope {scope}")
                return jsonify({"error": "forbidden", "message": f"client lacks scope: {scope}"}), 403

            g.api_client = client
            response = view(*args, **kwargs)
            status = response[1] if isinstance(response, tuple) else 200
            _log_api_call(client_id, status)
            return response
        return wrapped
    return decorator


def _module_enabled(key):
    setting = ModuleSetting.query.get(key)
    return setting is None or setting.enabled


# ---------------------------------------------------------------------------
# Android SMS Collector ingestion endpoint
# ---------------------------------------------------------------------------

@api_bp.route("/sms/ingest", methods=["POST"])
@limiter.limit("60 per minute")
@require_api_scope("sms.ingest")
def ingest_sms():
    if not _module_enabled("sms_collector"):
        return jsonify({"error": "SMS Collector module is disabled"}), 403

    data = request.get_json(silent=True) or {}
    device_token = request.headers.get("X-Device-Token")
    raw_text = data.get("raw_text")
    if not device_token or not raw_text:
        return jsonify({"error": "device_token header and raw_text body field are required"}), 400

    device = SmsDevice.query.filter_by(device_token_hash=device_token, status="APPROVED").first()
    if not device:
        return jsonify({"error": "device not recognized or not approved"}), 403

    transaction = SmsTransaction(device_id=device.id, raw_text=raw_text, parse_status="PENDING")
    db.session.add(transaction)
    device.last_sync_at = db.func.now()
    db.session.commit()
    # Actual bank-SMS parsing is delegated to the configured parser adapters
    # (see Developer Console > SMS Collector > "Configure parser settings").
    return jsonify({"status": "queued", "transaction_id": transaction.id}), 202


# ---------------------------------------------------------------------------
# Bank webhook receiver (mock provider by default -- see BANK_PROVIDER_MODE)
# ---------------------------------------------------------------------------

@api_bp.route("/bank/webhook", methods=["POST"])
@limiter.limit("120 per minute")
@require_api_scope("bank.webhook")
def bank_webhook():
    if not _module_enabled("bank_api"):
        return jsonify({"error": "Bank API module is disabled"}), 403

    from app.models import UnmatchedPayment
    data = request.get_json(silent=True) or {}
    amount = data.get("amount")
    reference = data.get("reference")
    if amount is None:
        return jsonify({"error": "amount is required"}), 400

    unmatched = UnmatchedPayment(amount=amount, source="BANK", raw_reference=reference)
    db.session.add(unmatched)
    db.session.commit()
    return jsonify({"status": "received", "unmatched_payment_id": unmatched.id}), 202


# ---------------------------------------------------------------------------
# Member self-service API (mobile app) -- id comes from the API token's bound
# member, never from a request parameter.
# ---------------------------------------------------------------------------

@api_bp.route("/me/summary", methods=["GET"])
@limiter.limit("30 per minute")
def my_summary():
    """Uses the same session-cookie auth as the web app (member logs into the
    mobile webview) rather than the client-credential scheme above, so a
    member can only ever see their own data."""
    from flask import session
    from app.models import User, Member, MemberChit, ChitInstallment, Payment
    from app.auth import load_logged_in_user
    load_logged_in_user()
    if g.user is None or g.user.role.name != "MEMBER" or not g.user.member_id:
        return jsonify({"error": "unauthorized"}), 401

    member = Member.query.get(g.user.member_id)
    chits = MemberChit.query.filter_by(member_id=member.id).all()
    payments = Payment.query.filter_by(member_id=member.id).all()
    return jsonify({
        "member": member.full_name,
        "active_chits": len(chits),
        "total_payments": len(payments),
    })
