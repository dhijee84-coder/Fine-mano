from flask import Blueprint, render_template, g
from app.auth import login_required
from app.models import Member, ChitInstallment, MemberChit, Payment

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/")
@login_required
def index():
    role = g.user.role.name

    if role == "SUPER_ADMIN":
        return render_template("dashboards/super_admin.html")
    if role == "ADMIN":
        return render_template("dashboards/admin.html")
    if role == "DEVELOPER":
        return render_template("dashboards/developer.html")
    if role == "ACCOUNTANT":
        return render_template("dashboards/accountant.html")
    if role == "STAFF":
        return render_template("dashboards/staff.html")
    if role == "AUDITOR":
        return render_template("dashboards/auditor.html")
    if role == "MEMBER":
        return member_dashboard()

    return render_template("dashboards/generic.html")


def member_dashboard():
    """CRITICAL: every query here is filtered by g.user.member_id. A member
    can never pass in someone else's ID -- there is no ID parameter at all."""
    member = Member.query.get(g.user.member_id) if g.user.member_id else None
    if member is None:
        return render_template("dashboards/member.html", member=None, chits=[], installments=[], payments=[])

    member_chits = MemberChit.query.filter_by(member_id=member.id).all()
    chit_ids = [mc.id for mc in member_chits]
    installments = (
        ChitInstallment.query.filter(ChitInstallment.member_chit_id.in_(chit_ids)).all()
        if chit_ids else []
    )
    payments = Payment.query.filter_by(member_id=member.id).order_by(Payment.created_at.desc()).all()

    total_paid = sum((p.amount for p in payments if p.status in ("ALLOCATED", "APPROVED")), 0)
    overdue = [i for i in installments if i.status == "OVERDUE"]
    upcoming = sorted(
        [i for i in installments if i.status == "PENDING"], key=lambda i: i.due_date
    )[:1]

    return render_template(
        "dashboards/member.html",
        member=member,
        chits=member_chits,
        installments=installments,
        payments=payments,
        total_paid=total_paid,
        overdue=overdue,
        upcoming=upcoming,
    )
