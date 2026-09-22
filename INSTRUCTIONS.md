# Nidhi — complete desk manual

Nidhi is a **chit fund operations desk**. It keeps subscribers, schemes, monthly dues, collections (cash / SMS / bank), allocation to installments, unmatched receipts, reports, users, and a developer console in one place.

This file is the full instruction set: what each screen does, how money moves, and what each role is allowed to touch.

Demo passwords match the username. Sign in with a role card, or type the username.

| Desk | Username | Password | Who it is |
|---|---|---|---|
| Super Admin (house) | `superadmin` | `superadmin` | Users, finance, modules, APIs, approvals |
| Admin (floor) | `admin` | `admin` | Members, schemes, collections, allocation, reports |
| Member (own book) | `member` | `member` | Lakshmi Iyer’s chits, dues, and receipts only |

There is no server login. The session lives in this browser. Reloading keeps the last desk unless you log out. **Reset** of the demo book happens if the stored ledger version changes.

---

## 1. How the house is organised

Three desks. Seven old roles were merged into these.

| Desk | Absorbs | Sees | Does |
|---|---|---|---|
| **Super Admin** | Super Admin + Developer | The whole ledger **and** the developer console | Users, roles, modules, dangerous actions, finance, audit |
| **Admin** | Admin + Staff + Accountant | The whole subscriber book | Members, schemes, installments, payments, allocation, unmatched, reports |
| **Member** | Member + Auditor (personal only) | **Only the linked subscriber** | View own enrollments, installment book, receipts. Nothing else |

A signed-in user has:

1. A **role** (the starting grant list).
2. Optional **per-user overrides** (grant or revoke a single permission, with a reason). Super Admin sets these on a user record.
3. **Modules** (on/off switches). A disabled module blocks its routes, not just the menu.

Effective permission = role defaults ± overrides. Super Admin always has every code and cannot be reduced.

Denied actions are written to the audit log with result `DENIED`.

---

## 2. Role-wise control

### Super Admin — house desk

**Menu:** Dashboard, Members, Chits, Payments, Reports, Users, Roles, Audit log, Developer, Instructions.

**Dashboard (“House desk”)** shows collections KPIs, module/API/error health, dangerous-action backlog, and shortcuts into users, roles, modules, database inspector, and audit.

Can do everything the Admin can, plus:

- Create / disable users, change roles, promote to Super Admin
- Per-user permission overrides (grant or revoke)
- Edit role default grants (not Super Admin’s own set)
- Open the developer console (modules, settings, APIs, SMS devices, bank, database inspector, dangerous actions, monitoring)
- Approve or reject dangerous actions
- Soft-delete members and payments (reason required)
- View and export the audit log
- Toggle modules, including locking the developer console (only Super Admin can disable that module)

### Admin — floor desk

**Menu:** Dashboard, Members, Chits, Payments, Reports, Users, Instructions.

**Dashboard (“Floor desk”)** shows members, live schemes, booked collections, overdue, unmatched count, month bars, and shortcuts to record / review / allocate.

Can:

- Create and edit members (phone unique). Assign an operator.
- Create schemes, enroll members, generate installment schedules
- Record payments (they land **PENDING**)
- Approve pending payments
- Allocate a payment onto an installment (marks the installment PAID or PARTIAL; fully paid rows lock)
- Match or ignore unmatched SMS/bank receipts
- View reports (source mix, scheme due vs collected)
- View and create users at Admin or Member (cannot promote to Super Admin)

Cannot:

- Open Developer, Roles, or Audit
- Soft-delete payments (needs `payments.delete`)
- Reduce Super Admin, or disable the developer console

### Member — own book

**Menu:** Dashboard, My profile, Instructions.

**Dashboard (“My chit fund”)** is Lakshmi Iyer in the seed: total paid, active chits, overdue, next due, enrolled schemes, installment rows, payment history.

Can:

- See **only** records where `memberId` is her own
- Open her profile (contact, enrollments)

Cannot:

- Open Members, Chits, Payments, Reports, Users, Roles, Audit, Developer
- Direct URLs to those pages show **Access denied**
- See another subscriber’s name, dues, or receipts

Row isolation is enforced in the store (`visibleMembers`) as well as the menu.

---

## 3. Sign-in

1. Open the desk. Wait until the Login button reads **Login** (ledger has opened).
2. Click a role card, **or** type username + password and Login.
3. Failed passwords increment a counter; too many failures lock the account for a cooling-off period.
4. Disabled accounts cannot sign in.
5. Log out from the sidebar (or the header on a phone).

---

## 4. Features and screens

### Dashboard

Role-specific. Super Admin = house + developer health. Admin = floor operations. Member = personal chit fund.

### Members

List of subscribers (name, phone, city, assigned operator, since). **New member** requires a unique phone.

Member detail: edit contact, enrollments, payments, **Soft delete** (Super Admin; reason required). Soft delete hides the row but keeps financial history.

### Chits (schemes)

A scheme has corpus, monthly installment, tenure, start date, status.

- **New scheme** — name, total amount, duration, installment amount, start date.
- **Open a scheme** — enroll a member from those not already on it, generate the installment book, see roster and due rows.
- **Generate** — creates missing installment numbers 1…N for each enrollment. Already-generated numbers (including paid/locked) are left alone. Run it twice: second time creates `0`. Harvest 3L in the seed starts with **0** schedule on purpose so you can watch generate land 45 rows (3 members × 15 months).

### Payments

Every receipt has a source: `MANUAL`, `SMS`, or `BANK`. Status:

| Status | Meaning |
|---|---|
| PENDING | Recorded, not yet approved |
| APPROVED | Accepted, not yet applied to an installment |
| ALLOCATED | Applied to one or more installment rows |
| REVERSED | Soft-deleted; reason required |

**Record payment** — pick a member, amount, reference. Lands PENDING.

**Approve** — PENDING → APPROVED.

**Allocate** — pick an installment. Amount is added to `amountPaid`. If it covers `amountDue`, the row becomes PAID and **locks**. Locked (fully paid) rows cannot be edited without `installments.edit_paid`.

**Delete** — Super Admin only. Reason required. Status becomes REVERSED.

### Unmatched receipts

SMS and bank credits that did not match a subscriber.

- **Match** — attach a member; creates a PENDING payment on that book; unmatched row closes.
- **Ignore** — close without creating a payment.

The Payments badge and the unmatched chip count **open** unmatched rows.

### Reports

Booked collections, pending receipts, overdue outstanding, subscriber count, source mix (MANUAL / SMS / BANK), and per-scheme enrolled / due / collected / gap.

### Users (Admin + Super Admin)

List of desk accounts. Create username, email, password, role. Super Admin can change role, disable, and set permission overrides (grant on top of the role, or revoke even if the role has it). Reason required for an override.

### Roles (Super Admin)

Starting grants per desk. Super Admin’s set is locked. Saving role defaults in this session lasts until the tab’s ledger is reset.

### Audit log (Super Admin)

Every login, create, edit, generate, allocate, approve, delete, deny, and dangerous-action request. Fields: who, role, action, module, record, result (`SUCCESS` / `DENIED`), reason, old/new value, time.

### Profile (Member)

Own contact and enrollments.

### Developer console (Super Admin)

| Section | What it does |
|---|---|
| Modules | Enable / disable route groups. Off = page shows “module off”, not just a hidden menu |
| Website settings | Site name, company, locale, currency, theme colour |
| Form builder | Allow-listed custom fields (data only, never executed as code) |
| Menu builder | Extra nav items gated by a permission code |
| Workflows | JSON config (approval, unmatched, reminders, bank sync). No code exec |
| API clients | Create clients; secrets hashed at rest and always masked |
| SMS devices | Approve or disable collector devices |
| Bank providers | Mock adapter until live credentials exist; **Mock sync** pulls sample credits |
| Database inspector | Allow-listed tables only. No arbitrary SQL |
| Dangerous actions | Queue (restore, write ops). Super Admin approves or rejects |
| Monitoring | System log, backups, scheduler slot |
| Notifications | Reminder queue (scheduler is not wired in this desk) |

Disabling `developer_console` can only be done by Super Admin, so the house cannot lock itself out from a lesser role.

### Instructions (this manual)

Open **Instructions** in the sidebar on any desk. Same content as this file, laid out for the screen.

---

## 5. Processes (do this, in order)

### A. New subscriber on a live chit

1. Sign in as **Admin** or **Super Admin**.
2. Members → **New member**. Unique phone. Optionally assign an operator.
3. Chits → open a scheme → **Enroll** the member.
4. **Generate installments**. New rows appear as PENDING (future) or OVERDUE (past due dates). Paid rows already on the book are not overwritten.

### B. Collect a cash / cheque / UPI receipt

1. Payments → **Record payment** (or Dashboard → Record payment on the floor desk).
2. Payment is **PENDING**.
3. **Approve** it.
4. **Allocate** to the oldest unpaid installment (or a specific month). Partial amounts mark PARTIAL; a full hit marks PAID and locks the row.

### C. SMS or bank credit with no member

1. Payments badge / **Unmatched** chip.
2. **Match** → pick the subscriber → **Create payment** (PENDING on that member).
3. Approve + allocate as in B.
4. Or **Ignore** if it is not a chit credit.

### D. Harvest 3L (the empty schedule)

Seed: Harvest 3L is enrolled (Arjun, Meena, Fatima) with **0** installment rows. Generate it from the Chits list or the scheme page. First click creates 45 rows; second click creates 0 (“schedule already complete”).

### E. Dangerous action

1. Super Admin → Developer → Dangerous actions (or the pending badge).
2. A restore/write request sits PENDING.
3. Super Admin **approves** or **rejects**. Approval is itself audited.

### F. Soft delete

Members and payments are never hard-deleted. Super Admin supplies a **reason**. Payments become REVERSED. Members drop off the live list but their installment history remains.

---

## 6. Seed book (what you see on first open)

**Schemes**

- Aishwarya Gold 5L — ₹5,00,000, ₹25,000 × 20 months, 5 enrolled, schedule already generated
- Lakshmi Silver 2L — ₹2,00,000, ₹16,670 × 12 months, 4 enrolled, schedule already generated
- Harvest 3L — ₹3,00,000, ₹20,000 × 15 months, 3 enrolled, **no schedule until you generate**

**Subscribers:** Lakshmi Iyer, Ramesh Krishnan, Fatima Begum, Arjun Reddy, Meena Subramanian, Joseph D'Souza, Priya Nair, Venkatesh Rao.

**Member login** is linked to Lakshmi Iyer (`m-1`).

**Unmatched:** two open sample receipts (SMS and bank) so reconciliation can be practised.

---

## 7. Status glossary

**Scheme:** ACTIVE / CLOSED / DRAFT  
**Enrollment:** ACTIVE / CLOSED / DEFAULTED  
**Installment:** PENDING / PARTIAL / PAID / OVERDUE (PAID rows lock)  
**Payment:** PENDING / APPROVED / ALLOCATED / REVERSED  
**Unmatched:** OPEN / RESOLVED / IGNORED  
**Dangerous action:** PENDING / APPROVED / REJECTED / EXECUTED  
**SMS device:** PENDING / APPROVED / DISABLED  

Money is Indian Rupees, formatted `en-IN` (₹1,01,670). Dates follow the desk locale (Asia/Kolkata).

---

## 8. What this desk does not do

- It is **not a bank**. No real SMS gateway, no live bank credentials, no money movement.
- There is no multi-device cloud save. The book is this browser’s ledger.
- Export of reports/audit is described in permissions but not a file download in this cut.
- The reminder scheduler is a queue, not a running job.

---

## 9. Permission catalogue (Admin vs Super Admin vs Member)

Member has `receipts.view` only. Admin has the floor set below. Super Admin has every code.

Admin grants: `members.view`, `members.view_all`, `members.create`, `members.edit`, `members.export`, `chits.view`, `chits.create`, `chits.edit`, `installments.view`, `installments.create`, `installments.generate`, `installments.edit`, `payments.view`, `payments.create`, `payments.edit`, `payments.approve`, `payments.allocate`, `sms.view`, `sms.process`, `bank.view`, `bank.sync`, `reports.view`, `reports.export`, `reminders.view`, `reminders.create`, `reminders.edit`, `reminders.send`, `reconciliation.view`, `receipts.view`, `users.view`, `users.create`, `users.edit`.

Super Admin extras (dangerous or house-only): user delete / assign roles / assign superadmin / reset password / manage permissions, member delete, chit delete, installment edit-paid, payment delete / refund, SMS device and parser admin, bank connect / providers / credentials, all `developer.*` codes, audit view/export, settings.security, settings.branding.

---

*Nidhi Chits Pvt. Ltd. — operations desk, not a bank.*
