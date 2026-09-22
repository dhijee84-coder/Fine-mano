import {
  MODULE_KEYS,
  ROLE_DEFAULTS,
  type RoleName,
} from "./permissions";
import { addMonthsISO, nowISO } from "./format";
import type {
  AppState,
  AuditLog,
  ChitInstallment,
  InstallmentStatus,
  Member,
  Payment,
  User,
} from "./types";

function monthsAgo(n: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  d.setDate(1);
  return d.toISOString().slice(0, 10);
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function dateDaysAgo(n: number): string {
  return daysAgo(n).slice(0, 10);
}

const TODAY = new Date().toISOString().slice(0, 10);

function buildInstallments(opts: {
  memberChitId: string;
  start: string;
  months: number;
  amount: number;
  paidThrough: number;
  partial?: number;
}): ChitInstallment[] {
  const items: ChitInstallment[] = [];
  for (let n = 1; n <= opts.months; n++) {
    const dueDate = addMonthsISO(opts.start, n - 1);
    let status: InstallmentStatus = "PENDING";
    let amountPaid = 0;
    let locked = false;
    if (n <= opts.paidThrough) {
      status = "PAID";
      amountPaid = opts.amount;
      locked = true;
    } else if (n === opts.paidThrough + 1 && opts.partial) {
      status = "PARTIAL";
      amountPaid = opts.partial;
    } else if (dueDate < TODAY) {
      status = "OVERDUE";
    }
    items.push({
      id: `i-${opts.memberChitId}-${n}`,
      memberChitId: opts.memberChitId,
      installmentNumber: n,
      dueDate,
      amountDue: opts.amount,
      amountPaid,
      status,
      locked,
    });
  }
  return items;
}

const USERS: User[] = [
  {
    id: "u-super",
    username: "superadmin",
    email: "superadmin@nidhi.local",
    password: "superadmin",
    role: "SUPER_ADMIN",
    isActive: true,
    failedLoginCount: 0,
    lockedUntil: null,
    memberId: null,
    createdAt: daysAgo(400),
  },
  {
    id: "u-admin",
    username: "admin",
    email: "admin@nidhi.local",
    password: "admin",
    role: "ADMIN",
    isActive: true,
    failedLoginCount: 0,
    lockedUntil: null,
    memberId: null,
    createdAt: daysAgo(380),
  },
  {
    id: "u-member",
    username: "member",
    email: "lakshmi@example.com",
    password: "member",
    role: "MEMBER",
    isActive: true,
    failedLoginCount: 0,
    lockedUntil: null,
    memberId: "m-1",
    createdAt: daysAgo(200),
  },
];

const MEMBERS: Member[] = [
  {
    id: "m-1",
    fullName: "Lakshmi Iyer",
    phone: "+91 98400 11221",
    email: "lakshmi@example.com",
    address: "14 Luz Church Road, Mylapore",
    city: "Chennai",
    assignedStaffId: "u-admin",
    isActive: true,
    createdAt: daysAgo(200),
    deletedAt: null,
  },
  {
    id: "m-2",
    fullName: "Ramesh Krishnan",
    phone: "+91 98840 22011",
    email: "ramesh.k@example.com",
    address: "8 Gandhi Nagar, Adyar",
    city: "Chennai",
    assignedStaffId: "u-admin",
    isActive: true,
    createdAt: daysAgo(190),
    deletedAt: null,
  },
  {
    id: "m-3",
    fullName: "Fatima Begum",
    phone: "+91 94444 33120",
    email: "fatima.b@example.com",
    address: "22 Triplicane High Road",
    city: "Chennai",
    assignedStaffId: "u-admin",
    isActive: true,
    createdAt: daysAgo(180),
    deletedAt: null,
  },
  {
    id: "m-4",
    fullName: "Arjun Reddy",
    phone: "+91 90000 44551",
    email: "arjun.reddy@example.com",
    address: "Banjara Hills, Road No. 12",
    city: "Hyderabad",
    assignedStaffId: "u-admin",
    isActive: true,
    createdAt: daysAgo(170),
    deletedAt: null,
  },
  {
    id: "m-5",
    fullName: "Meena Subramanian",
    phone: "+91 97909 55662",
    email: "meena.s@example.com",
    address: "Race Course, Coimbatore",
    city: "Coimbatore",
    assignedStaffId: "u-admin",
    isActive: true,
    createdAt: daysAgo(160),
    deletedAt: null,
  },
  {
    id: "m-6",
    fullName: "Joseph D'Souza",
    phone: "+91 98200 66773",
    email: "joseph.ds@example.com",
    address: "Fort Kochi, Princess Street",
    city: "Kochi",
    assignedStaffId: null,
    isActive: true,
    createdAt: daysAgo(140),
    deletedAt: null,
  },
  {
    id: "m-7",
    fullName: "Priya Nair",
    phone: "+91 98950 77884",
    email: "priya.nair@example.com",
    address: "Pattom, Thiruvananthapuram",
    city: "Thiruvananthapuram",
    assignedStaffId: null,
    isActive: true,
    createdAt: daysAgo(120),
    deletedAt: null,
  },
  {
    id: "m-8",
    fullName: "Venkatesh Rao",
    phone: "+91 99000 88995",
    email: "venkat.rao@example.com",
    address: "Jayanagar 4th Block",
    city: "Bengaluru",
    assignedStaffId: null,
    isActive: true,
    createdAt: daysAgo(100),
    deletedAt: null,
  },
];

const GOLD_START = monthsAgo(17);
const SILVER_START = monthsAgo(8);
const HARVEST_START = monthsAgo(3);

const INSTALLMENTS: ChitInstallment[] = [
  ...buildInstallments({
    memberChitId: "mc-1",
    start: GOLD_START,
    months: 20,
    amount: 25000,
    paidThrough: 15,
    partial: 10000,
  }),
  ...buildInstallments({
    memberChitId: "mc-2",
    start: GOLD_START,
    months: 20,
    amount: 25000,
    paidThrough: 17,
  }),
  ...buildInstallments({
    memberChitId: "mc-3",
    start: GOLD_START,
    months: 20,
    amount: 25000,
    paidThrough: 14,
  }),
  ...buildInstallments({
    memberChitId: "mc-4",
    start: GOLD_START,
    months: 20,
    amount: 25000,
    paidThrough: 16,
  }),
  ...buildInstallments({
    memberChitId: "mc-5",
    start: GOLD_START,
    months: 20,
    amount: 25000,
    paidThrough: 13,
  }),
  ...buildInstallments({
    memberChitId: "mc-6",
    start: SILVER_START,
    months: 12,
    amount: 16670,
    paidThrough: 7,
  }),
  ...buildInstallments({
    memberChitId: "mc-7",
    start: SILVER_START,
    months: 12,
    amount: 16670,
    paidThrough: 8,
  }),
  ...buildInstallments({
    memberChitId: "mc-8",
    start: SILVER_START,
    months: 12,
    amount: 16670,
    paidThrough: 6,
    partial: 5000,
  }),
  ...buildInstallments({
    memberChitId: "mc-9",
    start: SILVER_START,
    months: 12,
    amount: 16670,
    paidThrough: 8,
  }),
];

function paidSum(memberId: string, memberChitIds: string[]): number {
  const ids = new Set(memberChitIds);
  return INSTALLMENTS.filter((i) => ids.has(i.memberChitId) && i.amountPaid > 0).reduce(
    (s, i) => s + i.amountPaid,
    0,
  );
}

const PAYMENTS: Payment[] = [
  {
    id: "p-1",
    memberId: "m-1",
    amount: 25000,
    source: "BANK",
    reference: "NEFT/SBIN/4419821",
    status: "APPROVED",
    recordedBy: "u-admin",
    createdAt: daysAgo(40),
    deletedAt: null,
  },
  {
    id: "p-2",
    memberId: "m-1",
    amount: 10000,
    source: "MANUAL",
    reference: "CASH-CHN-0921",
    status: "ALLOCATED",
    recordedBy: "u-admin",
    createdAt: daysAgo(12),
    deletedAt: null,
  },
  {
    id: "p-3",
    memberId: "m-2",
    amount: 25000,
    source: "SMS",
    reference: "UPI/44120933",
    status: "APPROVED",
    recordedBy: "u-admin",
    createdAt: daysAgo(18),
    deletedAt: null,
  },
  {
    id: "p-4",
    memberId: "m-3",
    amount: 25000,
    source: "MANUAL",
    reference: "CHQ-33219",
    status: "PENDING",
    recordedBy: "u-admin",
    createdAt: daysAgo(4),
    deletedAt: null,
  },
  {
    id: "p-5",
    memberId: "m-4",
    amount: 25000,
    source: "BANK",
    reference: "IMPS/HDFC/998122",
    status: "ALLOCATED",
    recordedBy: "u-admin",
    createdAt: daysAgo(22),
    deletedAt: null,
  },
  {
    id: "p-6",
    memberId: "m-6",
    amount: 16670,
    source: "SMS",
    reference: "UPI/PRIYA-NAIR",
    status: "PENDING",
    recordedBy: "u-admin",
    createdAt: daysAgo(2),
    deletedAt: null,
  },
  {
    id: "p-7",
    memberId: "m-8",
    amount: 16670,
    source: "MANUAL",
    reference: "CASH-BLR-0811",
    status: "APPROVED",
    recordedBy: "u-admin",
    createdAt: daysAgo(28),
    deletedAt: null,
  },
  {
    id: "p-8",
    memberId: "m-5",
    amount: 20000,
    source: "BANK",
    reference: "NEFT/IOB/120994",
    status: "PENDING",
    recordedBy: "u-admin",
    createdAt: daysAgo(1),
    deletedAt: null,
  },
];

const AUDIT: AuditLog[] = [
  {
    id: "a-1",
    userId: "u-super",
    roleName: "SUPER_ADMIN",
    action: "LOGIN",
    module: "auth",
    recordType: "User",
    recordId: "u-super",
    timestamp: daysAgo(1),
    result: "SUCCESS",
    reason: "",
    oldValue: "",
    newValue: "",
  },
  {
    id: "a-2",
    userId: "u-admin",
    roleName: "ADMIN",
    action: "CREATE_MEMBER",
    module: "members",
    recordType: "Member",
    recordId: "m-8",
    timestamp: daysAgo(100),
    result: "SUCCESS",
    reason: "",
    oldValue: "",
    newValue: "Venkatesh Rao",
  },
  {
    id: "a-3",
    userId: "u-admin",
    roleName: "ADMIN",
    action: "CREATE_PAYMENT",
    module: "payments",
    recordType: "Payment",
    recordId: "p-4",
    timestamp: daysAgo(4),
    result: "SUCCESS",
    reason: "",
    oldValue: "",
    newValue: "25000 MANUAL",
  },
  {
    id: "a-4",
    userId: "u-super",
    roleName: "SUPER_ADMIN",
    action: "REQUEST_DANGEROUS_ACTION",
    module: "developer",
    recordType: "DeveloperAction",
    recordId: "da-1",
    timestamp: daysAgo(3),
    result: "SUCCESS",
    reason: "Need to restore last week's backup after a bad import",
    oldValue: "",
    newValue: "database_restore",
  },
  {
    id: "a-5",
    userId: "u-member",
    roleName: "MEMBER",
    action: "LOGIN",
    module: "auth",
    recordType: "User",
    recordId: "u-member",
    timestamp: daysAgo(0.2),
    result: "SUCCESS",
    reason: "",
    oldValue: "",
    newValue: "",
  },
  {
    id: "a-6",
    userId: "u-admin",
    roleName: "ADMIN",
    action: "ALLOCATE_PAYMENT",
    module: "payments",
    recordType: "Payment",
    recordId: "p-2",
    timestamp: daysAgo(12),
    result: "SUCCESS",
    reason: "",
    oldValue: "PENDING",
    newValue: "ALLOCATED 10000",
  },
];

void paidSum;
void ROLE_DEFAULTS;

export function createSeedState(): AppState {
  return {
    sessionUserId: null,
    users: USERS,
    overrides: [],
    members: MEMBERS,
    schemes: [
      {
        id: "s-gold",
        name: "Aishwarya Gold 5L",
        totalAmount: 500000,
        durationMonths: 20,
        installmentAmount: 25000,
        startDate: GOLD_START,
        status: "ACTIVE",
        createdBy: "u-admin",
        createdAt: daysAgo(520),
      },
      {
        id: "s-silver",
        name: "Lakshmi Silver 2L",
        totalAmount: 200000,
        durationMonths: 12,
        installmentAmount: 16670,
        startDate: SILVER_START,
        status: "ACTIVE",
        createdBy: "u-admin",
        createdAt: daysAgo(250),
      },
      {
        id: "s-harvest",
        name: "Harvest 3L",
        totalAmount: 300000,
        durationMonths: 15,
        installmentAmount: 20000,
        startDate: HARVEST_START,
        status: "ACTIVE",
        createdBy: "u-super",
        createdAt: daysAgo(95),
      },
    ],
    enrollments: [
      { id: "mc-1", memberId: "m-1", chitSchemeId: "s-gold", enrolledAt: daysAgo(510), status: "ACTIVE" },
      { id: "mc-2", memberId: "m-2", chitSchemeId: "s-gold", enrolledAt: daysAgo(510), status: "ACTIVE" },
      { id: "mc-3", memberId: "m-3", chitSchemeId: "s-gold", enrolledAt: daysAgo(500), status: "ACTIVE" },
      { id: "mc-4", memberId: "m-4", chitSchemeId: "s-gold", enrolledAt: daysAgo(490), status: "ACTIVE" },
      { id: "mc-5", memberId: "m-5", chitSchemeId: "s-gold", enrolledAt: daysAgo(480), status: "ACTIVE" },
      { id: "mc-6", memberId: "m-6", chitSchemeId: "s-silver", enrolledAt: daysAgo(240), status: "ACTIVE" },
      { id: "mc-7", memberId: "m-7", chitSchemeId: "s-silver", enrolledAt: daysAgo(240), status: "ACTIVE" },
      { id: "mc-8", memberId: "m-8", chitSchemeId: "s-silver", enrolledAt: daysAgo(230), status: "ACTIVE" },
      { id: "mc-9", memberId: "m-1", chitSchemeId: "s-silver", enrolledAt: daysAgo(220), status: "ACTIVE" },
      { id: "mc-10", memberId: "m-4", chitSchemeId: "s-harvest", enrolledAt: daysAgo(90), status: "ACTIVE" },
      { id: "mc-11", memberId: "m-5", chitSchemeId: "s-harvest", enrolledAt: daysAgo(88), status: "ACTIVE" },
      { id: "mc-12", memberId: "m-3", chitSchemeId: "s-harvest", enrolledAt: daysAgo(85), status: "ACTIVE" },
    ],
    installments: INSTALLMENTS,
    payments: PAYMENTS,
    allocations: [
      {
        id: "al-1",
        paymentId: "p-2",
        installmentId: "i-mc-1-16",
        amount: 10000,
        allocatedBy: "u-admin",
        allocatedAt: daysAgo(12),
      },
      {
        id: "al-2",
        paymentId: "p-5",
        installmentId: "i-mc-4-17",
        amount: 25000,
        allocatedBy: "u-admin",
        allocatedAt: daysAgo(22),
      },
    ],
    unmatched: [
      {
        id: "um-1",
        amount: 25000,
        source: "SMS",
        rawReference: "ICICI SMS: INR 25000 credited from UNKNOWN/UPI",
        receivedAt: daysAgo(3),
        status: "OPEN",
        resolvedPaymentId: null,
      },
      {
        id: "um-2",
        amount: 5000,
        source: "BANK",
        rawReference: "HDFC NEFT 4412 — no member match",
        receivedAt: daysAgo(6),
        status: "OPEN",
        resolvedPaymentId: null,
      },
    ],
    audit: AUDIT,
    systemLogs: [
      {
        id: "sl-1",
        level: "INFO",
        source: "scheduler",
        message: "Reminder job skipped — APScheduler not wired in this demo.",
        timestamp: daysAgo(1),
      },
      {
        id: "sl-2",
        level: "WARNING",
        source: "sms",
        message: "Parser miss on ICICI SMS — routed to unmatched queue.",
        timestamp: daysAgo(3),
      },
      {
        id: "sl-3",
        level: "ERROR",
        source: "bank",
        message: "Mock adapter: HDFC sync delayed 12s (simulated).",
        timestamp: daysAgo(6),
      },
    ],
    apiClients: [
      {
        id: "ac-1",
        name: "Android SMS Collector",
        clientId: "sms_col_7f3a",
        secretMasked: "••••••••a91c",
        scopes: "sms.ingest,sms.view",
        isActive: true,
        rateLimitPerMinute: 60,
        createdAt: daysAgo(200),
        revokedAt: null,
      },
      {
        id: "ac-2",
        name: "Mock bank webhook",
        clientId: "bank_wh_22c1",
        secretMasked: "••••••••e04b",
        scopes: "bank.webhook",
        isActive: true,
        rateLimitPerMinute: 120,
        createdAt: daysAgo(140),
        revokedAt: null,
      },
    ],
    apiLogs: [
      {
        id: "al-api-1",
        clientId: "sms_col_7f3a",
        endpoint: "/api/sms/ingest",
        method: "POST",
        statusCode: 202,
        timestamp: daysAgo(3),
        errorMessage: "",
      },
      {
        id: "al-api-2",
        clientId: "sms_col_7f3a",
        endpoint: "/api/sms/ingest",
        method: "POST",
        statusCode: 429,
        timestamp: daysAgo(8),
        errorMessage: "rate limit exceeded",
      },
      {
        id: "al-api-3",
        clientId: "bank_wh_22c1",
        endpoint: "/api/bank/webhook",
        method: "POST",
        statusCode: 200,
        timestamp: daysAgo(6),
        errorMessage: "",
      },
    ],
    smsDevices: [
      {
        id: "sd-1",
        deviceName: "Foreman Pixel — Chennai office",
        ownerUserId: "u-admin",
        status: "APPROVED",
        lastSyncAt: daysAgo(0.4),
        createdAt: daysAgo(180),
      },
      {
        id: "sd-2",
        deviceName: "Field Nokia — Coimbatore",
        ownerUserId: "u-admin",
        status: "PENDING",
        lastSyncAt: null,
        createdAt: daysAgo(2),
      },
    ],
    smsTxns: [
      {
        id: "st-1",
        deviceId: "sd-1",
        rawText: "ICICI Bank: INR 25,000 credited to A/c XX4412 from UNKNOWN on 05-Sep. UPI Ref 8821.",
        parsedAmount: 25000,
        parsedReference: "UPI 8821",
        bankName: "ICICI",
        parseStatus: "PARSED",
        receivedAt: daysAgo(3),
        processedPaymentId: null,
      },
      {
        id: "st-2",
        deviceId: "sd-1",
        rawText: "SBI: Rs.25000 credited from RAMESH KRISHNAN Ref UPI/44120933",
        parsedAmount: 25000,
        parsedReference: "UPI/44120933",
        bankName: "SBI",
        parseStatus: "PARSED",
        receivedAt: daysAgo(18),
        processedPaymentId: "p-3",
      },
    ],
    bankConnections: [
      {
        id: "bc-1",
        providerName: "mock",
        isEnabled: true,
        accountMasked: "XXXX4412",
        accountName: "Nidhi Chits — Collections",
        syncFrequencyMinutes: 60,
        lastSyncAt: daysAgo(0.5),
      },
    ],
    bankTxns: [
      {
        id: "bt-1",
        connectionId: "bc-1",
        amount: 5000,
        reference: "HDFC NEFT 4412",
        transactionDate: dateDaysAgo(6),
        status: "UNMATCHED",
        processedPaymentId: null,
      },
      {
        id: "bt-2",
        connectionId: "bc-1",
        amount: 25000,
        reference: "NEFT/SBIN/4419821",
        transactionDate: dateDaysAgo(40),
        status: "MATCHED",
        processedPaymentId: "p-1",
      },
    ],
    actions: [
      {
        id: "da-1",
        requestedBy: "u-super",
        actionType: "database_restore",
        payload: "backup nidhi-2026-09-01.db",
        reason: "Need to restore last week's backup after a bad import",
        status: "PENDING",
        approvedBy: null,
        createdAt: daysAgo(3),
        decidedAt: null,
      },
    ],
    backups: [
      {
        id: "bk-1",
        filename: "nidhi-2026-09-01.db",
        sizeBytes: 482110,
        createdBy: "u-super",
        createdAt: daysAgo(7),
        reason: "Weekly snapshot",
      },
    ],
    customFields: [
      {
        id: "cf-1",
        formKey: "member_form",
        fieldName: "aadhaar_last4",
        label: "Aadhaar (last 4)",
        fieldType: "text",
        required: false,
        visible: true,
        orderIndex: 10,
        helpText: "Stored as last four only",
      },
      {
        id: "cf-2",
        formKey: "member_form",
        fieldName: "nominee_name",
        label: "Nominee",
        fieldType: "text",
        required: true,
        visible: true,
        orderIndex: 11,
        helpText: "",
      },
    ],
    menuItems: [
      { id: "mi-1", label: "Dashboard", url: "/dashboard", icon: "LayoutDashboard", orderIndex: 0, requiredPermission: "", visible: true },
      { id: "mi-2", label: "Members", url: "/members", icon: "Users", orderIndex: 1, requiredPermission: "members.view", visible: true },
      { id: "mi-3", label: "Chits", url: "/chits", icon: "Layers", orderIndex: 2, requiredPermission: "chits.view", visible: true },
      { id: "mi-4", label: "Payments", url: "/payments", icon: "IndianRupee", orderIndex: 3, requiredPermission: "payments.view", visible: true },
    ],
    reminders: [
      {
        id: "rm-1",
        memberId: "m-3",
        installmentId: "i-mc-3-16",
        channel: "SMS",
        message: "Nidhi: installment overdue on Aishwarya Gold 5L. Please remit ₹25,000.",
        status: "PENDING",
        scheduledFor: daysAgo(-1),
        sentAt: null,
      },
    ],
    modules: Object.fromEntries(MODULE_KEYS.map((k) => [k, true])) as AppState["modules"],
    settings: {
      site_name: "Nidhi",
      company_info: "Nidhi Chits Pvt. Ltd.",
      contact_info: "operations@nidhi.local · +91 44 4000 1200",
      currency: "INR",
      date_format: "d MMM yyyy",
      timezone: "Asia/Kolkata",
      language: "en-IN",
      theme: "ledger",
      primary_color: "#1B4F8A",
      color_mode: "light",
      footer_content: "Chit operations desk — not a bank.",
      twilio_account_sid: "",
      twilio_auth_token: "",
      twilio_from_number: "",
    },
    smsOutbox: [
      {
        id: "sms-1",
        toPhone: "+91 94444 33120",
        memberId: "m-3",
        kind: "DUE",
        body: "Nidhi: installment overdue on Aishwarya Gold 5L. Please remit ₹25,000.",
        status: "DEMO",
        provider: "twilio",
        otp: "",
        createdAt: daysAgo(1),
      },
    ],
    passwordResets: [],
    rolePerms: {
      SUPER_ADMIN: [...ROLE_DEFAULTS.SUPER_ADMIN],
      ADMIN: [...ROLE_DEFAULTS.ADMIN],
      MEMBER: [...ROLE_DEFAULTS.MEMBER],
    },
    alerts: [
      {
        id: "n-1",
        userId: "u-member",
        kind: "DUE",
        title: "Installment due",
        body: "Harvest Gold 2L installment is on the book. Open your profile to see the row.",
        href: "/profile",
        read: false,
        createdAt: daysAgo(2),
      },
      {
        id: "n-2",
        userId: "u-admin",
        kind: "SYSTEM",
        title: "2 unmatched receipts",
        body: "Bank/SMS rows waiting to be matched.",
        href: "/payments/unmatched",
        read: false,
        createdAt: daysAgo(1),
      },
      {
        id: "n-3",
        userId: "u-super",
        kind: "SYSTEM",
        title: "Dangerous action pending",
        body: "A restore request is waiting for your decision.",
        href: "/developer/actions",
        read: false,
        createdAt: daysAgo(3),
      },
    ],
    workflows: {
      payment_approval: JSON.stringify({ required: true, roles: ["ADMIN"] }),
      unmatched_payment: JSON.stringify({ auto_open: true }),
      reminder_workflow: JSON.stringify({ days_before: 3, channel: "SMS" }),
      bank_sync_frequency: JSON.stringify({ minutes: 60, mode: "mock" }),
    },
    seq: {
      u: 20,
      m: 20,
      s: 20,
      mc: 20,
      i: 500,
      p: 20,
      al: 20,
      um: 20,
      a: 20,
      da: 20,
      cf: 20,
      mi: 20,
      ac: 20,
      sd: 20,
      bk: 20,
      sl: 20,
      rm: 20,
      ov: 20,
      sms: 20,
      pr: 20,
      n: 20,
    },
  };
}

export const DEMO_ACCOUNTS: { role: RoleName; username: string; password: string }[] = [
  { role: "SUPER_ADMIN", username: "superadmin", password: "superadmin" },
  { role: "ADMIN", username: "admin", password: "admin" },
  { role: "MEMBER", username: "member", password: "member" },
];

export { nowISO };
