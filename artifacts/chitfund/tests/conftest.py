import os
import pytest

os.environ["SECRET_KEY"] = "test-secret-key"
os.environ["DATABASE_URL"] = "sqlite://"  # in-memory
os.environ["FIRST_SUPERADMIN_PASSWORD"] = "TestPass!2345"

from app import create_app
from app.extensions import db
from app.models import Role, Permission, User, ModuleSetting, ROLE_NAMES, Member
from app.permissions_catalog import PERMISSIONS, ROLE_DEFAULTS
from app.routes.developer import MODULE_KEYS


@pytest.fixture()
def app():
    application = create_app()
    application.config.update(TESTING=True, WTF_CSRF_ENABLED=False)

    with application.app_context():
        db.create_all()

        roles = {}
        for name in ROLE_NAMES:
            role = Role(name=name, description=name)
            db.session.add(role)
            roles[name] = role
        db.session.commit()

        perms = {}
        for code, (category, description, is_financial, is_dangerous) in PERMISSIONS.items():
            perm = Permission(code=code, category=category, description=description,
                               is_financial=is_financial, is_dangerous=is_dangerous)
            db.session.add(perm)
            perms[code] = perm
        db.session.commit()

        for role_name, codes in ROLE_DEFAULTS.items():
            roles[role_name].permissions = [perms[c] for c in codes if c in perms]
        db.session.commit()

        for key in MODULE_KEYS:
            db.session.add(ModuleSetting(key=key, enabled=True))
        db.session.commit()

        def make_user(username, role_name, member_id=None):
            u = User(username=username, email=f"{username}@example.com",
                     role_id=roles[role_name].id, member_id=member_id)
            u.set_password("Password!123")
            db.session.add(u)
            db.session.commit()
            return u

        make_user("superadmin", "SUPER_ADMIN")
        make_user("admin1", "ADMIN")
        make_user("dev1", "DEVELOPER")
        make_user("acct1", "ACCOUNTANT")
        make_user("staff1", "STAFF")
        make_user("auditor1", "AUDITOR")

        member_a = Member(full_name="Member A", phone="1111111111")
        member_b = Member(full_name="Member B", phone="2222222222")
        db.session.add_all([member_a, member_b])
        db.session.commit()

        make_user("membera", "MEMBER", member_id=member_a.id)
        make_user("memberb", "MEMBER", member_id=member_b.id)

        yield application

        db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()


def login(client, username, password="Password!123"):
    return client.post("/login", data={"username": username, "password": password}, follow_redirects=False)


def logout(client):
    client.post("/logout")
