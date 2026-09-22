from flask import Blueprint, render_template, request, redirect, url_for, flash, g, jsonify

from app.extensions import db
from app.auth import require_permission, require_role, log_action
from app.models import User, Role, Permission, UserPermission

admin_bp = Blueprint("admin", __name__)


# ---------------------------------------------------------------------------
# User management
# ---------------------------------------------------------------------------

@admin_bp.route("/users")
@require_permission("users.view")
def list_users():
    users = User.query.all()
    return render_template("admin/users.html", users=users)


@admin_bp.route("/users/create", methods=["GET", "POST"])
@require_permission("users.create")
def create_user():
    roles = Role.query.all()
    if request.method == "GET":
        return render_template("admin/user_form.html", roles=roles, user=None)

    username = request.form["username"].strip()
    email = request.form["email"].strip()
    password = request.form["password"]
    role_id = int(request.form["role_id"])
    target_role = Role.query.get_or_404(role_id)

    # Only Super Admin may create another Super Admin.
    if target_role.name == "SUPER_ADMIN" and not g.user.has_permission("users.assign_superadmin"):
        log_action("CREATE_USER", result="DENIED", reason="attempted to create SUPER_ADMIN without permission")
        flash("Only a Super Admin can create another Super Admin account.", "error")
        return render_template("admin/user_form.html", roles=roles, user=None), 403

    if User.query.filter((User.username == username) | (User.email == email)).first():
        flash("Username or email already exists.", "error")
        return render_template("admin/user_form.html", roles=roles, user=None), 400

    user = User(username=username, email=email, role_id=role_id)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    log_action("CREATE_USER", module="users", record_type="User", record_id=user.id,
               new_value=f"username={username}, role={target_role.name}")
    flash("User created.", "success")
    return redirect(url_for("admin.list_users"))


@admin_bp.route("/users/<int:user_id>/role", methods=["POST"])
@require_permission("users.assign_roles")
def change_role(user_id):
    user = User.query.get_or_404(user_id)
    new_role = Role.query.get_or_404(int(request.form["role_id"]))
    old_role_name = user.role.name if user.role else None

    if new_role.name == "SUPER_ADMIN" and not g.user.has_permission("users.assign_superadmin"):
        log_action("CHANGE_ROLE", result="DENIED", record_id=user_id,
                   reason="attempted to promote to SUPER_ADMIN without permission")
        return jsonify({"error": "Only Super Admin can grant the Super Admin role."}), 403

    if old_role_name == "SUPER_ADMIN" and g.user.role.name != "SUPER_ADMIN":
        return jsonify({"error": "Only Super Admin can change a Super Admin's role."}), 403

    user.role_id = new_role.id
    db.session.commit()
    log_action("CHANGE_ROLE", module="users", record_type="User", record_id=user_id,
               old_value=old_role_name, new_value=new_role.name)
    flash("Role updated.", "success")
    return redirect(url_for("admin.list_users"))


@admin_bp.route("/users/<int:user_id>/disable", methods=["POST"])
@require_permission("users.delete")
def disable_user(user_id):
    user = User.query.get_or_404(user_id)
    if user.role.name == "SUPER_ADMIN" and g.user.role.name != "SUPER_ADMIN":
        return jsonify({"error": "Cannot disable a Super Admin."}), 403
    user.is_active = False
    db.session.commit()
    log_action("DISABLE_USER", module="users", record_type="User", record_id=user_id)
    flash("User disabled.", "success")
    return redirect(url_for("admin.list_users"))


# ---------------------------------------------------------------------------
# Role & permission management (Super Admin only)
# ---------------------------------------------------------------------------

@admin_bp.route("/roles")
@require_role("SUPER_ADMIN")
def list_roles():
    roles = Role.query.all()
    permissions = Permission.query.order_by(Permission.category).all()
    return render_template("admin/roles.html", roles=roles, permissions=permissions)


@admin_bp.route("/roles/<int:role_id>/permissions", methods=["POST"])
@require_role("SUPER_ADMIN")
def update_role_permissions(role_id):
    role = Role.query.get_or_404(role_id)
    if role.name == "SUPER_ADMIN":
        flash("Super Admin's permission set cannot be reduced.", "error")
        return redirect(url_for("admin.list_roles"))

    selected_codes = set(request.form.getlist("permissions"))
    all_permissions = Permission.query.all()
    old_codes = {p.code for p in role.permissions}

    role.permissions = [p for p in all_permissions if p.code in selected_codes]
    db.session.commit()

    log_action("UPDATE_ROLE_PERMISSIONS", module="roles", record_type="Role", record_id=role_id,
               old_value=",".join(sorted(old_codes)), new_value=",".join(sorted(selected_codes)))
    flash(f"Permissions updated for {role.name}.", "success")
    return redirect(url_for("admin.list_roles"))


@admin_bp.route("/users/<int:user_id>/permissions", methods=["GET", "POST"])
@require_permission("users.manage_permissions")
def user_permissions(user_id):
    user = User.query.get_or_404(user_id)
    all_permissions = Permission.query.order_by(Permission.category).all()

    if request.method == "GET":
        effective = user.effective_permissions()
        return render_template(
            "admin/user_permissions.html", user=user, permissions=all_permissions, effective=effective
        )

    code = request.form["permission_code"]
    grant = request.form["grant"] == "true"
    reason = request.form.get("reason", "").strip()
    if not reason:
        flash("A reason is required to change an individual permission grant.", "error")
        return redirect(url_for("admin.user_permissions", user_id=user_id))

    perm = Permission.query.filter_by(code=code).first_or_404()
    override = UserPermission.query.filter_by(user_id=user.id, permission_id=perm.id).first()
    if override:
        override.grant = grant
        override.reason = reason
        override.granted_by = g.user.id
    else:
        override = UserPermission(
            user_id=user.id, permission_id=perm.id, grant=grant,
            granted_by=g.user.id, reason=reason,
        )
        db.session.add(override)
    db.session.commit()

    log_action("SET_USER_PERMISSION", module="users", record_type="User", record_id=user_id,
               new_value=f"{code}={grant}", reason=reason)
    flash("Permission override saved.", "success")
    return redirect(url_for("admin.user_permissions", user_id=user_id))


@admin_bp.route("/users/<int:user_id>/effective-permissions")
@require_permission("users.view")
def preview_effective_permissions(user_id):
    """'Preview what a user can access' (spec section 10)."""
    user = User.query.get_or_404(user_id)
    return jsonify({"user": user.username, "role": user.role.name,
                     "effective_permissions": sorted(user.effective_permissions())})
