from flask import Blueprint, render_template, request, redirect, url_for, flash, g

from app.extensions import db
from app.auth import require_permission, require_module_enabled, log_action
from app.models import ChitScheme, MemberChit, ChitInstallment

chits_bp = Blueprint("chits", __name__)


@chits_bp.route("/")
@require_permission("chits.view")
@require_module_enabled("chit_management")
def list_chits():
    schemes = ChitScheme.query.all()
    return render_template("chits/list.html", schemes=schemes)


@chits_bp.route("/create", methods=["GET", "POST"])
@require_permission("chits.create")
@require_module_enabled("chit_management")
def create_chit():
    if request.method == "GET":
        return render_template("chits/form.html", scheme=None)

    scheme = ChitScheme(
        name=request.form["name"],
        total_amount=request.form["total_amount"],
        duration_months=int(request.form["duration_months"]),
        installment_amount=request.form["installment_amount"],
        start_date=request.form["start_date"],
        created_by=g.user.id,
    )
    db.session.add(scheme)
    db.session.commit()
    log_action("CREATE_CHIT", module="chits", record_type="ChitScheme", record_id=scheme.id)
    flash("Chit scheme created.", "success")
    return redirect(url_for("chits.list_chits"))


@chits_bp.route("/<int:scheme_id>/enroll", methods=["POST"])
@require_permission("chits.edit")
@require_module_enabled("chit_management")
def enroll_member(scheme_id):
    member_id = int(request.form["member_id"])
    enrollment = MemberChit(member_id=member_id, chit_scheme_id=scheme_id)
    db.session.add(enrollment)
    db.session.commit()
    log_action("ENROLL_MEMBER_IN_CHIT", module="chits", record_type="MemberChit", record_id=enrollment.id)
    flash("Member enrolled.", "success")
    return redirect(url_for("chits.list_chits"))


@chits_bp.route("/<int:scheme_id>/generate-installments", methods=["POST"])
@require_permission("installments.generate")
@require_module_enabled("installments")
def generate_installments(scheme_id):
    """Generates the installment schedule for every member enrolled in a scheme.
    This never overwrites an installment that is already PAID/locked."""
    from datetime import date
    from dateutil.relativedelta import relativedelta  # noqa: F401 (documented dependency; see README)

    scheme = ChitScheme.query.get_or_404(scheme_id)
    enrollments = MemberChit.query.filter_by(chit_scheme_id=scheme_id).all()
    created = 0
    for enrollment in enrollments:
        existing = {i.installment_number for i in ChitInstallment.query.filter_by(member_chit_id=enrollment.id)}
        for n in range(1, scheme.duration_months + 1):
            if n in existing:
                continue
            due = scheme.start_date.replace(day=min(scheme.start_date.day, 28))
            installment = ChitInstallment(
                member_chit_id=enrollment.id, installment_number=n,
                due_date=due, amount_due=scheme.installment_amount,
            )
            db.session.add(installment)
            created += 1
    db.session.commit()
    log_action("GENERATE_INSTALLMENTS", module="installments", record_type="ChitScheme",
               record_id=scheme_id, new_value=f"created={created}")
    flash(f"{created} installments generated.", "success")
    return redirect(url_for("chits.list_chits"))
