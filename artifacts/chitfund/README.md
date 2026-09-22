# Chit Fund Management System

A Flask + SQLite chit fund management system with full role-based and
permission-based access control, a Developer Console, and audit logging.
No PHP. REST API included for the Android SMS Collector and bank webhooks.

**This has been run and tested** — 27 automated tests pass (`pytest tests/`),
and the app was manually smoke-tested end-to-end (login, every dashboard,
Developer Console, and a Member-role account correctly receiving real HTTP 403s
on Admin/Developer/Members/Payments routes).

---

## 1. What's fully implemented

- **7 roles** (Super Admin, Admin, Developer, Accountant, Staff, Member, Auditor)
  with a full permission catalogue (`app/permissions_catalog.py`) and default
  role→permission mapping, seeded into the database.
- **Backend enforcement everywhere.** Every protected route uses
  `@require_permission("code")`, `@require_role(...)`, or `@require_module_enabled(...)`
  decorators (`app/auth.py`). Frontend menus hide links as a UX nicety only —
  the backend check is what actually blocks access, and it always returns
  HTTP 403 (JSON for `/api/*`, an HTML page otherwise).
- **Per-user permission overrides** on top of role defaults (grant *or* revoke),
  with a required reason, audit-logged (`User.effective_permissions()`).
- **Member row-level isolation**: a Member's ID is read only from their own
  session (`g.user.member_id`), never from a URL/form parameter, so there is
  no code path for Member A to request Member B's data.
- **Developer Console** (`/developer/`) covering: website settings, module
  enable/disable (which actually blocks the module's routes, not just the
  menu), a data-driven form builder (hard allow-list of field types — no
  code execution path), menu/dashboard builder, workflow settings, API client
  management with masked secrets, SMS device approval, bank provider
  configuration (mock-only until real credentials are supplied), a read-only
  database inspector with a table allow-list (no arbitrary SQL), backups, a
  dangerous-action request/approval queue, monitoring, and notification config.
- **Dangerous action protection**: deleting payments/members, editing paid
  installments, and Developer-requested actions like `database_restore`
  require a reason, are audit-logged, and (for the Developer-initiated ones)
  need a separate Super Admin approval before they're marked approved.
  Deletes are **soft deletes** (a `deleted_at` timestamp), never `DELETE FROM`.
- **Audit log** is append-only — there is no update/delete route for it, for
  any role including Super Admin, by design.
- **Security**: Werkzeug password hashing, server-side sessions (not just a
  signed cookie — sessions live in a DB table and can be revoked), login
  lockout after repeated failures, CSRF protection (Flask-WTF) on every
  form, security response headers, environment-variable configuration (no
  secrets in source), API-key auth + rate limiting + scopes for the external
  REST API.
- **27 passing automated tests** (`tests/test_rbac.py`) covering the access
  matrix, member isolation, permission changes, dangerous-action approval,
  module-disable enforcement, secret masking, and disabled-user login.

## 2. What's intentionally stubbed (and why)

Being direct about this rather than pretending it's finished:

- **Real bank provider adapters.** `BANK_PROVIDER_MODE=mock` by default. I did
  not invent a fake integration with a real bank's API — building a working
  ICICI/HDFC/Razorpay/etc. adapter needs their actual API docs and
  credentials, which I don't have. The webhook receiver, connection model,
  and the "only mock allowed until live" guard are real and working; the
  actual bank-side calls are not.
- **Android SMS Collector app itself.** The server-side ingestion endpoint
  (`/api/sms/ingest`, device-token auth, rate limited) is real and tested.
  The Android app that sends SMS text to it is a separate mobile project,
  outside a Flask backend's scope — happy to sketch that separately if useful.
  Bank-specific SMS *parsing* logic (regex per bank format) is a config hook
  (`sms.configure_parsers` permission, `SmsTransaction.parse_status`) rather
  than a library of every Indian bank's SMS format, since that needs a lot of
  real sample messages per bank to get right.
- **Background scheduler.** APScheduler is in `requirements.txt` and the
  monitoring page has a slot for scheduler status, but the actual recurring
  jobs (reminder sending, bank sync polling) aren't wired up yet — that's the
  next piece I'd build with you once the core is confirmed working for you.
- **Form/dashboard builder rendering.** The builders store structured data
  (fields, layout) correctly, but the *runtime* member/chit forms don't yet
  read that config to dynamically render custom fields — they use the fixed
  fields shown in the templates. The data model is there; the dynamic
  rendering layer is the next step.

None of the above are faked or hand-waved — they're either mock-by-design
(bank) or explicitly out of scope for a backend-only deliverable (the Android
app binary), and everything else listed in section 1 is real, working code.

## 3. Project layout

```
chitfund/
├── app/
│   ├── __init__.py          # app factory, security headers, blueprint registration
│   ├── auth.py               # login, sessions, RBAC decorators, audit log helper
│   ├── extensions.py         # db, csrf, limiter singletons
│   ├── models.py             # every table from the spec (RBAC + business)
│   ├── permissions_catalog.py# the permission list + default role mapping
│   ├── routes/
│   │   ├── dashboard.py       # role-specific dashboard routing
│   │   ├── admin.py           # user/role/permission management
│   │   ├── developer.py       # the Developer Console (all 19 sub-sections)
│   │   ├── members.py         # member CRUD + row-level isolation
│   │   ├── chits.py           # chit schemes, enrollment, installment generation
│   │   ├── payments.py        # payments, allocation, approval, soft delete
│   │   └── api.py             # external REST API (SMS/bank webhooks)
│   ├── templates/             # Jinja2 templates, responsive CSS
│   └── static/css/style.css
├── tests/
│   ├── conftest.py            # test fixtures (in-memory DB, seeded users)
│   └── test_rbac.py           # 27 tests covering spec section 19
├── config.py
├── seed.py                    # creates roles/permissions/modules + first Super Admin
├── run.py                     # dev server entrypoint
├── requirements.txt
└── .env.example
```

## 4. Setup

```bash
cd chitfund
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env: set SECRET_KEY to a real random value, and
# FIRST_SUPERADMIN_PASSWORD to a strong password.

python seed.py                     # creates the DB and the first Super Admin
python run.py                      # runs on http://127.0.0.1:5000
```

Log in with the username/password you set in `.env`. **Immediately change
that password** through the app once logged in, then remove
`FIRST_SUPERADMIN_PASSWORD` from `.env` — it's only read once, by `seed.py`.

## 5. Running the tests

```bash
pip install -r requirements.txt   # includes pytest
python -m pytest tests/ -v
```

## 6. Creating the first Super Admin (if you ever need to redo it)

`seed.py` is idempotent — re-running it won't duplicate roles/permissions and
won't touch an existing Super Admin account. To create a *second* Super Admin
later, log in as the existing Super Admin and use **Users → New user**,
selecting the Super Admin role (that action itself requires the
`users.assign_superadmin` permission, which only Super Admin has by default).

## 7. Production notes

- Set `SESSION_COOKIE_SECURE=true` in `.env` once you're serving over HTTPS.
- Switch `RATELIMIT_STORAGE_URI` from `memory://` to a real Redis URL.
- Run behind a real WSGI server (gunicorn/uwsgi) — never `python run.py`
  (`debug=False` is already the default; keep it that way).
- Point `DATABASE_URL` at Postgres/MySQL for anything beyond a small
  single-server deployment; SQLite is fine to start with.
- Wire up a real backup destination (S3, etc.) instead of the local
  `instance/backups/` folder used by `developer.create_backup`.

## 8. What I'd build next, in order

1. APScheduler jobs: reminder sending, bank sync polling, SMS reprocessing.
2. Dynamic form rendering from the `custom_fields` table on the actual
   member/chit forms.
3. A real bank provider adapter, once you tell me which bank/aggregator
   (e.g. Razorpay, Setu, a specific bank's API) and share their docs.
4. The Android SMS Collector app itself (separate mobile codebase).

I focused the available effort on making the access-control system itself
airtight and verifiably correct, since that was the actual ask ("do not create
only a visual demo... every protected action must also be checked on the
backend") — happy to go deep on any of the four items above next.
