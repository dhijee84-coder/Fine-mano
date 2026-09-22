"""
Seeds:
 - all 7 roles
 - the full permission catalogue
 - default role -> permission mapping
 - default module_settings (all enabled)
 - the FIRST Super Admin account, from environment variables

Run once after creating the database:
    python seed.py

Re-running is safe/idempotent: it will not duplicate roles/permissions and
will not overwrite an existing Super Admin.
"""
import os
from dotenv import load_dotenv

load_dotenv()

from app import create_app
from app.extensions import db
from app.models import Role, Permission, User, ModuleSetting, ROLE_NAMES
from app.permissions_catalog import PERMISSIONS, ROLE_DEFAULTS
from app.routes.developer import MODULE_KEYS


def seed():
    app = create_app()
    with app.app_context():
        db.create_all()

        # Roles
        roles = {}
        for name in ROLE_NAMES:
            role = Role.query.filter_by(name=name).first()
            if not role:
                role = Role(name=name, description=name.replace("_", " ").title())
                db.session.add(role)
            roles[name] = role
        db.session.commit()

        # Permissions
        perms = {}
        for code, (category, description, is_financial, is_dangerous) in PERMISSIONS.items():
            perm = Permission.query.filter_by(code=code).first()
            if not perm:
                perm = Permission(
                    code=code, category=category, description=description,
                    is_financial=is_financial, is_dangerous=is_dangerous,
                )
                db.session.add(perm)
            perms[code] = perm
        db.session.commit()

        # Role -> permission defaults
        for role_name, codes in ROLE_DEFAULTS.items():
            role = roles[role_name]
            role.permissions = [perms[c] for c in codes if c in perms]
        db.session.commit()

        # Modules: all enabled by default
        for key in MODULE_KEYS:
            if not ModuleSetting.query.get(key):
                db.session.add(ModuleSetting(key=key, enabled=True))
        db.session.commit()

        # First Super Admin
        username = os.environ.get("FIRST_SUPERADMIN_USERNAME", "superadmin")
        email = os.environ.get("FIRST_SUPERADMIN_EMAIL", "superadmin@example.com")
        password = os.environ.get("FIRST_SUPERADMIN_PASSWORD")

        if User.query.filter_by(username=username).first():
            print(f"Super Admin '{username}' already exists -- skipping user creation.")
        else:
            if not password:
                raise SystemExit(
                    "FIRST_SUPERADMIN_PASSWORD is not set. Copy .env.example to .env, "
                    "set a strong password, and re-run seed.py."
                )
            admin = User(username=username, email=email, role_id=roles["SUPER_ADMIN"].id)
            admin.set_password(password)
            db.session.add(admin)
            db.session.commit()
            print(f"Created first Super Admin: {username}")
            print("IMPORTANT: log in and change this password immediately, "
                  "then remove FIRST_SUPERADMIN_PASSWORD from .env.")

        print("Seed complete.")


if __name__ == "__main__":
    seed()
