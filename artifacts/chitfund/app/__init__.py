import os
from flask import Flask, g, render_template

from config import Config
from app.extensions import db, csrf, limiter


def create_app(config_class=Config):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_class)

    os.makedirs(app.instance_path, exist_ok=True)

    db.init_app(app)
    csrf.init_app(app)
    limiter.init_app(app)

    from app.auth import auth_bp, load_logged_in_user
    from app.routes.dashboard import dashboard_bp
    from app.routes.admin import admin_bp
    from app.routes.developer import developer_bp
    from app.routes.members import members_bp
    from app.routes.chits import chits_bp
    from app.routes.payments import payments_bp
    from app.routes.api import api_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(admin_bp, url_prefix="/admin")
    app.register_blueprint(developer_bp, url_prefix="/developer")
    app.register_blueprint(members_bp, url_prefix="/members")
    app.register_blueprint(chits_bp, url_prefix="/chits")
    app.register_blueprint(payments_bp, url_prefix="/payments")
    app.register_blueprint(api_bp, url_prefix="/api")

    # API endpoints authenticate via API key, not session cookie -> CSRF-exempt
    csrf.exempt(api_bp)

    app.before_request(load_logged_in_user)

    @app.context_processor
    def inject_user():
        return {"current_user": getattr(g, "user", None)}

    @app.errorhandler(403)
    def forbidden(e):
        return render_template("errors/403.html", reason=str(e)), 403

    @app.errorhandler(404)
    def not_found(e):
        return render_template("errors/404.html"), 404

    # Security headers on every response
    @app.after_request
    def set_security_headers(response):
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "same-origin"
        if app.config.get("SESSION_COOKIE_SECURE"):
            response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains"
        return response

    return app
