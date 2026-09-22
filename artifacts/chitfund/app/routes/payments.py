from flask import Blueprint, render_template, request, redirect, url_for, flash, g, jsonify

from app.extensions import db
from app.auth import require_permission, require_module_enabled, log_action
from app.models import Payment, PaymentAllocation, ChitInstallment, UnmatchedPayment

payments_bp = Blueprint("payments", __name__)


@payments_bp.route("/")
@require_permission("payments.view")
@require_module_enabled("payments")
def list_payments():
    payments = Payment.query.filter(Payment.deleted_at.is_(None)).order_by(Payment.created_at.desc()).all()
    return render_template("payments/list.html", payments=payments)


@payments_bp.route("/create", methods=["GET", "POST"])
@require_permission("payments.create")
@require_module_enabled("manual_payments")
def create_payment():
    if request.method == "GET":
        return render_template("payments/form.html")

    payment = Payment(
        member_id=int(request.form["member_id"]),
        amount=request.form["amount"],
        source="MANUAL",
        reference=request.form.get("reference"),
        recorded_by=g.user.id,
    )
    db.session.add(payment)
    db.session.commit()
    log_action("CREATE_PAYMENT", module="payments", record_type="Payment", record_id=payment.id)
    flash("Payment recorded.", "success")
    return redirect(url_for("payments.list_payments"))


@payments_bp.route("/<int:payment_id>/allocate", methods=["POST"])
@require_permission("payments.allocate")
@require_module_enabled("payment_allocation")
def allocate_payment(payment_id):
    payment = Payment.query.get_or_404(payment_id)
    installment_id = int(request.form["installment_id"])
    amount = request.form["amount"]

    installment = ChitInstallment.query.get_or_404(installment_id)
    if installment.locked:
        return jsonify({"error": "installment is locked (already paid); "
                                  "editing it requires installments.edit_paid + approval"}), 403

    allocation = PaymentAllocation(
        payment_id=payment.id, installment_id=installment_id,
        amount=amount, allocated_by=g.user.id,
    )
    db.session.add(allocation)
    installment.amount_paid = (installment.amount_paid or 0) + float(amount)
    if installment.amount_paid >= float(installment.amount_due):
        installment.status = "PAID"
        installment.locked = True
    else:
        installment.status = "PARTIAL"
    payment.status = "ALLOCATED"
    db.session.commit()
    log_action("ALLOCATE_PAYMENT", module="payments", record_type="Payment", record_id=payment_id,
               new_value=f"installment={installment_id}, amount={amount}")
    flash("Payment allocated.", "success")
    return redirect(url_for("payments.list_payments"))


@payments_bp.route("/<int:payment_id>/approve", methods=["POST"])
@require_permission("payments.approve")
@require_module_enabled("payments")
def approve_payment(payment_id):
    payment = Payment.query.get_or_404(payment_id)
    payment.status = "APPROVED"
    db.session.commit()
    log_action("APPROVE_PAYMENT", module="payments", record_type="Payment", record_id=payment_id)
    flash("Payment approved.", "success")
    return redirect(url_for("payments.list_payments"))


@payments_bp.route("/<int:payment_id>/delete", methods=["POST"])
@require_permission("payments.delete")
@require_module_enabled("payments")
def delete_payment(payment_id):
    """DANGEROUS ACTION (spec section 12): requires a reason, is logged, and
    is a soft delete only -- never a hard DELETE FROM payments."""
    from datetime import datetime, timezone
    payment = Payment.query.get_or_404(payment_id)
    reason = request.form.get("reason", "").strip()
    if not reason:
        return jsonify({"error": "a reason is required to delete a payment"}), 400

    payment.deleted_at = datetime.utcnow()
    payment.status = "REVERSED"
    db.session.commit()
    log_action("DELETE_PAYMENT", module="payments", record_type="Payment", record_id=payment_id,
               reason=reason, result="SUCCESS")
    flash("Payment deleted (soft delete, logged).", "success")
    return redirect(url_for("payments.list_payments"))


@payments_bp.route("/unmatched")
@require_permission("payments.approve")
@require_module_enabled("payments")
def unmatched_payments():
    items = UnmatchedPayment.query.filter_by(status="OPEN").all()
    return render_template("payments/unmatched.html", items=items)
