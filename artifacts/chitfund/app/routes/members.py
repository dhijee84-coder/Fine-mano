from flask import Blueprint, render_template, request, redirect, url_for, flash, g, jsonify

from app.extensions import db
from app.auth import require_permission, require_module_enabled, login_required, log_action
from app.models import Member

members_bp = Blueprint("members", __name__)


def _visible_members_query():
    """STAFF only see members assigned to them unless granted members.view_all.
    This is enforced here, at the query layer, on every route below -- never
    left to the frontend to filter."""
    q = Member.query.filter(Member.deleted_at.is_(None))
    if g.user.role.name == "STAFF" and not g.user.has_permission("members.view_all"):
        q = q.filter(Member.assigned_staff_id == g.user.id)
    return q


@members_bp.route("/")
@require_permission("members.view")
@require_module_enabled("member_management")
def list_members():
    members = _visible_members_query().all()
    return render_template("members/list.html", members=members)


@members_bp.route("/<int:member_id>")
@require_permission("members.view")
@require_module_enabled("member_management")
def view_member(member_id):
    member = _visible_members_query().filter(Member.id == member_id).first()
    if member is None:
        return render_template("errors/403.html", reason="Member not found or not accessible"), 404
    return render_template("members/detail.html", member=member)


@members_bp.route("/create", methods=["GET", "POST"])
@require_permission("members.create")
@require_module_enabled("member_management")
def create_member():
    if request.method == "GET":
        return render_template("members/form.html", member=None)

    member = Member(
        full_name=request.form["full_name"],
        phone=request.form["phone"],
        email=request.form.get("email"),
        address=request.form.get("address"),
        assigned_staff_id=g.user.id if g.user.role.name == "STAFF" else request.form.get("assigned_staff_id") or None,
    )
    db.session.add(member)
    db.session.commit()
    log_action("CREATE_MEMBER", module="members", record_type="Member", record_id=member.id)
    flash("Member created.", "success")
    return redirect(url_for("members.list_members"))


@members_bp.route("/<int:member_id>/edit", methods=["GET", "POST"])
@require_permission("members.edit")
@require_module_enabled("member_management")
def edit_member(member_id):
    member = _visible_members_query().filter(Member.id == member_id).first()
    if member is None:
        return render_template("errors/403.html", reason="Member not found or not accessible"), 404

    if request.method == "GET":
        return render_template("members/form.html", member=member)

    old = f"{member.full_name}, {member.phone}"
    member.full_name = request.form["full_name"]
    member.phone = request.form["phone"]
    member.email = request.form.get("email")
    member.address = request.form.get("address")
    db.session.commit()
    log_action("EDIT_MEMBER", module="members", record_type="Member", record_id=member_id,
               old_value=old, new_value=f"{member.full_name}, {member.phone}")
    flash("Member updated.", "success")
    return redirect(url_for("members.view_member", member_id=member_id))


@members_bp.route("/<int:member_id>/delete", methods=["POST"])
@require_permission("members.delete")
@require_module_enabled("member_management")
def delete_member(member_id):
    """Soft delete only -- spec: 'Prefer soft deletion instead of permanent
    deletion' and 'Deleting members with financial history' is a dangerous
    action requiring a reason."""
    from datetime import datetime, timezone
    member = Member.query.get_or_404(member_id)
    reason = request.form.get("reason", "").strip()
    if not reason:
        return jsonify({"error": "a reason is required to delete a member"}), 400
    member.deleted_at = datetime.utcnow()
    member.is_active = False
    db.session.commit()
    log_action("DELETE_MEMBER", module="members", record_type="Member", record_id=member_id, reason=reason)
    flash("Member deleted (soft delete).", "success")
    return redirect(url_for("members.list_members"))


# ---------------------------------------------------------------------------
# Member self-service views (MEMBER role) -- id comes ONLY from g.user, never
# from the URL or form, so Member A structurally cannot request Member B's data.
# ---------------------------------------------------------------------------

@members_bp.route("/me")
@login_required
def my_profile():
    if g.user.role.name != "MEMBER" or not g.user.member_id:
        return render_template("errors/403.html", reason="Member profile not available"), 403
    member = Member.query.get_or_404(g.user.member_id)
    return render_template("members/my_profile.html", member=member)
