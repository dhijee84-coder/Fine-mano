import type { RoleName, ModuleKey } from "./permissions";

export type PaymentSource = "MANUAL" | "SMS" | "BANK";
export type PaymentStatus = "PENDING" | "ALLOCATED" | "APPROVED" | "REVERSED";
export type InstallmentStatus = "PENDING" | "PAID" | "PARTIAL" | "OVERDUE";
export type SchemeStatus = "ACTIVE" | "CLOSED" | "DRAFT";
export type EnrollmentStatus = "ACTIVE" | "CLOSED" | "DEFAULTED";
export type UnmatchedStatus = "OPEN" | "RESOLVED" | "IGNORED";
export type ActionStatus = "PENDING" | "APPROVED" | "REJECTED" | "EXECUTED";
export type DeviceStatus = "PENDING" | "APPROVED" | "DISABLED";
export type ParseStatus = "PENDING" | "PARSED" | "FAILED";

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: RoleName;
  isActive: boolean;
  failedLoginCount: number;
  lockedUntil: string | null;
  memberId: string | null;
  createdAt: string;
}

export interface UserPermissionOverride {
  id: string;
  userId: string;
  permissionCode: string;
  grant: boolean;
  reason: string;
  grantedBy: string;
  createdAt: string;
}

export interface Member {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  assignedStaffId: string | null;
  isActive: boolean;
  createdAt: string;
  deletedAt: string | null;
}

export interface ChitScheme {
  id: string;
  name: string;
  totalAmount: number;
  durationMonths: number;
  installmentAmount: number;
  startDate: string;
  status: SchemeStatus;
  createdBy: string;
  createdAt: string;
}

export interface MemberChit {
  id: string;
  memberId: string;
  chitSchemeId: string;
  enrolledAt: string;
  status: EnrollmentStatus;
}

export interface ChitInstallment {
  id: string;
  memberChitId: string;
  installmentNumber: number;
  dueDate: string;
  amountDue: number;
  amountPaid: number;
  status: InstallmentStatus;
  locked: boolean;
}

export interface Payment {
  id: string;
  memberId: string;
  amount: number;
  source: PaymentSource;
  reference: string;
  status: PaymentStatus;
  recordedBy: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface PaymentAllocation {
  id: string;
  paymentId: string;
  installmentId: string;
  amount: number;
  allocatedBy: string;
  allocatedAt: string;
}

export interface UnmatchedPayment {
  id: string;
  amount: number;
  source: PaymentSource;
  rawReference: string;
  receivedAt: string;
  status: UnmatchedStatus;
  resolvedPaymentId: string | null;
}

export interface AuditLog {
  id: string;
  userId: string | null;
  roleName: RoleName | null;
  action: string;
  module: string;
  recordType: string;
  recordId: string;
  timestamp: string;
  result: "SUCCESS" | "DENIED" | "ERROR";
  reason: string;
  oldValue: string;
  newValue: string;
}

export interface SystemLog {
  id: string;
  level: "INFO" | "WARNING" | "ERROR";
  source: string;
  message: string;
  timestamp: string;
}

export interface ApiClient {
  id: string;
  name: string;
  clientId: string;
  secretMasked: string;
  scopes: string;
  isActive: boolean;
  rateLimitPerMinute: number;
  createdAt: string;
  revokedAt: string | null;
}

export interface ApiLog {
  id: string;
  clientId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  timestamp: string;
  errorMessage: string;
}

export interface SmsDevice {
  id: string;
  deviceName: string;
  ownerUserId: string;
  status: DeviceStatus;
  lastSyncAt: string | null;
  createdAt: string;
}

export interface SmsTransaction {
  id: string;
  deviceId: string;
  rawText: string;
  parsedAmount: number | null;
  parsedReference: string;
  bankName: string;
  parseStatus: ParseStatus;
  receivedAt: string;
  processedPaymentId: string | null;
}

export interface BankConnection {
  id: string;
  providerName: string;
  isEnabled: boolean;
  accountMasked: string;
  accountName: string;
  syncFrequencyMinutes: number;
  lastSyncAt: string | null;
}

export interface BankTransaction {
  id: string;
  connectionId: string;
  amount: number;
  reference: string;
  transactionDate: string;
  status: "UNMATCHED" | "MATCHED";
  processedPaymentId: string | null;
}

export interface DeveloperAction {
  id: string;
  requestedBy: string;
  actionType: string;
  payload: string;
  reason: string;
  status: ActionStatus;
  approvedBy: string | null;
  createdAt: string;
  decidedAt: string | null;
}

export interface DatabaseBackup {
  id: string;
  filename: string;
  sizeBytes: number;
  createdBy: string;
  createdAt: string;
  reason: string;
}

export interface CustomField {
  id: string;
  formKey: string;
  fieldName: string;
  label: string;
  fieldType: string;
  required: boolean;
  visible: boolean;
  orderIndex: number;
  helpText: string;
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  icon: string;
  orderIndex: number;
  requiredPermission: string;
  visible: boolean;
}

export interface Reminder {
  id: string;
  memberId: string;
  installmentId: string | null;
  channel: "SMS" | "EMAIL" | "IN_APP";
  message: string;
  status: "PENDING" | "SENT" | "FAILED";
  scheduledFor: string;
  sentAt: string | null;
}

export type SmsKind = "OTP" | "LOGIN" | "PAYMENT" | "DUE" | "GENERIC";
export type OutboundSmsStatus = "DEMO" | "QUEUED" | "FAILED";

export interface OutboundSms {
  id: string;
  toPhone: string;
  memberId: string | null;
  kind: SmsKind;
  body: string;
  status: OutboundSmsStatus;
  provider: "twilio";
  otp: string;
  createdAt: string;
}

export interface PasswordReset {
  id: string;
  memberId: string;
  phone: string;
  otp: string;
  expiresAt: string;
  used: boolean;
  createdAt: string;
}

export type AlertKind = "OTP" | "LOGIN" | "PAYMENT" | "DUE" | "SYSTEM";

export interface AccountAlert {
  id: string;
  userId: string;
  kind: AlertKind;
  title: string;
  body: string;
  href: string;
  read: boolean;
  createdAt: string;
}

export interface AppState {
  sessionUserId: string | null;
  users: User[];
  overrides: UserPermissionOverride[];
  members: Member[];
  schemes: ChitScheme[];
  enrollments: MemberChit[];
  installments: ChitInstallment[];
  payments: Payment[];
  allocations: PaymentAllocation[];
  unmatched: UnmatchedPayment[];
  audit: AuditLog[];
  systemLogs: SystemLog[];
  apiClients: ApiClient[];
  apiLogs: ApiLog[];
  smsDevices: SmsDevice[];
  smsTxns: SmsTransaction[];
  bankConnections: BankConnection[];
  bankTxns: BankTransaction[];
  actions: DeveloperAction[];
  backups: DatabaseBackup[];
  customFields: CustomField[];
  menuItems: MenuItem[];
  reminders: Reminder[];
  modules: Record<ModuleKey, boolean>;
  settings: Record<string, string>;
  workflows: Record<string, string>;
  seq: Record<string, number>;
  smsOutbox: OutboundSms[];
  passwordResets: PasswordReset[];
  rolePerms: Record<RoleName, string[]>;
  alerts: AccountAlert[];
}
