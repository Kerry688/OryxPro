// Finance & Accounting Module Data Models

// ===== CORE GENERAL LEDGER =====

export interface ChartOfAccount {
  _id?: string;
  id?: string;
  accountCode: string; // e.g., "1000", "1001", "2000"
  accountName: string;
  accountType: AccountType;
  parentAccountId?: string;
  parentAccount?: ChartOfAccount;
  childAccounts?: ChartOfAccount[];
  
  // Hierarchy
  level: number; // 1 = main group, 2 = sub-group, 3 = account
  fullPath: string; // e.g., "Assets > Current Assets > Cash"
  
  // Classification
  balanceType: BalanceType; // Debit or Credit
  isActive: boolean;
  isSystemAccount: boolean; // System-generated accounts
  
  // Multi-company support
  companyId?: string;
  companyName?: string;
  
  // Currency & Localization
  currency?: string;
  localGAAP?: LocalGAAP;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface JournalEntry {
  _id?: string;
  id?: string;
  entryNumber: string; // Auto-generated
  entryDate: Date;
  reference?: string; // External reference
  description: string;
  
  // Entry Details
  entryType: JournalEntryType;
  isReversed: boolean;
  reversalEntryId?: string;
  
  // Approval Workflow
  status: JournalEntryStatus;
  approvedBy?: string;
  approvedDate?: Date;
  requiresApproval: boolean;
  
  // Multi-company & Currency
  companyId?: string;
  currency: string;
  exchangeRate?: number;
  
  // Lines
  lines: JournalEntryLine[];
  
  // Totals
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface JournalEntryLine {
  _id?: string;
  id?: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  
  // Amounts
  debitAmount: number;
  creditAmount: number;
  
  // Additional Info
  description?: string;
  reference?: string;
  projectCode?: string;
  costCenter?: string;
  department?: string;
  
  // Multi-currency
  currency?: string;
  exchangeRate?: number;
  localDebitAmount?: number;
  localCreditAmount?: number;
}

export interface FiscalPeriod {
  _id?: string;
  id?: string;
  fiscalYear: string; // e.g., "2024"
  periodNumber: number; // 1-12 for monthly, or custom
  periodName: string; // e.g., "January 2024", "Q1 2024"
  startDate: Date;
  endDate: Date;
  
  // Status
  status: PeriodStatus;
  isCurrent: boolean;
  
  // Calendar Type
  calendarType: CalendarType;
  
  // Company
  companyId?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

// ===== MULTI-CURRENCY =====

export interface Currency {
  _id?: string;
  id?: string;
  code: string; // ISO 4217 code (USD, EUR, EGP)
  name: string;
  symbol: string;
  decimalPlaces: number;
  isBaseCurrency: boolean; // Company's base currency
  isActive: boolean;
  status: CurrencyStatus;
  lastExchangeRate: number;
  lastExchangeRateDate: Date;
  companyId?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface ExchangeRate {
  _id?: string;
  id?: string;
  fromCurrencyCode: string;
  toCurrencyCode: string;
  rate: number;
  inverseRate: number;
  rateDate: Date;
  isActive: boolean;
  source: string; // Manual, API, etc.
  
  // Company
  companyId?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

// ===== ACCOUNTS PAYABLE =====

export interface VendorInvoice {
  _id?: string;
  id?: string;
  invoiceNumber: string;
  vendorId: string;
  vendorName?: string;
  invoiceDate: Date;
  dueDate: Date;
  
  // Amounts
  grossAmount: number;
  taxAmount: number;
  discountAmount: number;
  netAmount: number;
  paidAmount: number;
  balanceAmount: number;
  
  // Currency
  currency: string;
  exchangeRate?: number;
  
  // Matching
  purchaseOrderId?: string;
  goodsReceiptId?: string;
  matchStatus: MatchStatus;
  
  // Payment Terms
  paymentTerms: string;
  paymentMethod?: PaymentMethod;
  
  // Status
  status: InvoiceStatus;
  isOverdue: boolean;
  
  // Documents
  invoiceDocument?: string;
  attachments?: string[];
  
  // GL Integration
  journalEntryId?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface Payment {
  _id?: string;
  id?: string;
  paymentNumber: string;
  paymentDate: Date;
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
  
  // Amounts
  amount: number;
  currency: string;
  exchangeRate?: number;
  
  // Recipient
  vendorId?: string;
  vendorName?: string;
  customerId?: string;
  customerName?: string;
  
  // Bank Details
  bankAccountId?: string;
  bankAccountName?: string;
  reference?: string;
  
  // Withholding
  withholdingTaxAmount?: number;
  withholdingTaxRate?: number;
  
  // Status
  status: PaymentStatus;
  isReconciled: boolean;
  
  // GL Integration
  journalEntryId?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface PaymentLine {
  _id?: string;
  id?: string;
  paymentId: string;
  invoiceId: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  
  // Amounts
  invoiceAmount: number;
  paidAmount: number;
  discountAmount?: number;
  
  // Currency
  currency: string;
  exchangeRate?: number;
}

// ===== ACCOUNTS RECEIVABLE =====

export interface CustomerInvoice {
  _id?: string;
  id?: string;
  invoiceNumber: string;
  customerId: string;
  customerName?: string;
  invoiceDate: Date;
  dueDate: Date;
  
  // Amounts
  grossAmount: number;
  taxAmount: number;
  discountAmount: number;
  netAmount: number;
  paidAmount: number;
  balanceAmount: number;
  
  // Currency
  currency: string;
  exchangeRate?: number;
  
  // Source
  salesOrderId?: string;
  deliveryId?: string;
  
  // Payment Terms
  paymentTerms: string;
  paymentMethod?: PaymentMethod;
  
  // Status
  status: InvoiceStatus;
  isOverdue: boolean;
  
  // Credit Management
  creditLimit?: number;
  creditUsed?: number;
  
  // Documents
  invoiceDocument?: string;
  attachments?: string[];
  
  // GL Integration
  journalEntryId?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface Receipt {
  _id?: string;
  id?: string;
  receiptNumber: string;
  receiptDate: Date;
  paymentMethod: PaymentMethod;
  
  // Amounts
  amount: number;
  currency: string;
  exchangeRate?: number;
  
  // Payer
  customerId?: string;
  customerName?: string;
  
  // Bank Details
  bankAccountId?: string;
  bankAccountName?: string;
  reference?: string;
  
  // Status
  status: PaymentStatus;
  isReconciled: boolean;
  
  // GL Integration
  journalEntryId?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface ReceiptLine {
  _id?: string;
  id?: string;
  receiptId: string;
  invoiceId: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  
  // Amounts
  invoiceAmount: number;
  paidAmount: number;
  discountAmount?: number;
  
  // Currency
  currency: string;
  exchangeRate?: number;
}

// ===== CASH & BANK MANAGEMENT =====

export interface BankAccount {
  _id?: string;
  id?: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode?: string;
  branchCode?: string;
  
  // Account Details
  accountType: BankAccountType;
  currency: string;
  isActive: boolean;
  
  // Balances
  currentBalance: number;
  availableBalance: number;
  lastReconciledBalance: number;
  lastReconciledDate?: Date;
  
  // Company
  companyId?: string;
  
  // GL Integration
  glAccountId?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface BankReconciliation {
  _id?: string;
  id?: string;
  bankAccountId: string;
  bankAccountName?: string;
  reconciliationDate: Date;
  statementBalance: number;
  bookBalance: number;
  reconciledBalance: number;
  
  // Status
  status: ReconciliationStatus;
  
  // Items
  items: ReconciliationItem[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface ReconciliationItem {
  _id?: string;
  id?: string;
  transactionDate: Date;
  description: string;
  amount: number;
  type: ReconciliationItemType;
  status: ReconciliationStatus;
  
  // References
  journalEntryId?: string;
  paymentId?: string;
  receiptId?: string;
  
  // Bank Reference
  bankReference?: string;
}

// ===== FIXED ASSETS INTEGRATION =====

export interface AssetCapitalization {
  _id?: string;
  id?: string;
  assetId: string; // Link to Asset Management
  assetName?: string;
  capitalizationDate: Date;
  
  // Source
  sourceType: CapitalizationSource;
  sourceDocumentId: string; // AP Invoice, Purchase Order, etc.
  
  // Amounts
  capitalizationAmount: number;
  currency: string;
  exchangeRate?: number;
  
  // GL Integration
  journalEntryId?: string;
  assetAccountId?: string;
  accumulatedDepreciationAccountId?: string;
  
  // Status
  status: CapitalizationStatus;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface DepreciationEntry {
  _id?: string;
  id?: string;
  assetId: string;
  assetName?: string;
  depreciationDate: Date;
  
  // Depreciation Details
  depreciationMethod: string;
  depreciationAmount: number;
  accumulatedDepreciation: number;
  netBookValue: number;
  
  // Multi-book
  bookType: string; // IFRS, Local GAAP, etc.
  
  // GL Integration
  journalEntryId?: string;
  
  // Status
  status: DepreciationStatus;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

// ===== BUDGETING & PLANNING =====

export interface Budget {
  _id?: string;
  id?: string;
  budgetName: string;
  budgetYear: string;
  budgetType: BudgetType;
  
  // Scope
  departmentId?: string;
  projectId?: string;
  costCenterId?: string;
  
  // Status
  status: BudgetStatus;
  isActive: boolean;
  
  // Periods
  periods: BudgetPeriod[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface BudgetPeriod {
  _id?: string;
  id?: string;
  periodNumber: number;
  periodName: string;
  startDate: Date;
  endDate: Date;
  
  // Budget Amounts
  budgetAmount: number;
  actualAmount: number;
  varianceAmount: number;
  variancePercentage: number;
  
  // Accounts
  accounts: BudgetAccount[];
}

export interface BudgetAccount {
  _id?: string;
  id?: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  
  // Amounts
  budgetAmount: number;
  actualAmount: number;
  varianceAmount: number;
  variancePercentage: number;
}

export interface Forecast {
  _id?: string;
  id?: string;
  forecastName: string;
  forecastType: ForecastType;
  forecastPeriod: string; // Monthly, Quarterly, Yearly
  
  // Scope
  departmentId?: string;
  projectId?: string;
  costCenterId?: string;
  
  // Status
  status: ForecastStatus;
  isActive: boolean;
  
  // Scenarios
  scenarios: ForecastScenario[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface ForecastScenario {
  _id?: string;
  id?: string;
  scenarioName: string;
  scenarioType: ScenarioType;
  probability?: number; // 0-100%
  
  // Periods
  periods: ForecastPeriod[];
}

export interface ForecastPeriod {
  _id?: string;
  id?: string;
  periodNumber: number;
  periodName: string;
  startDate: Date;
  endDate: Date;
  
  // Forecast Amounts
  forecastAmount: number;
  actualAmount?: number;
  varianceAmount?: number;
  
  // Accounts
  accounts: ForecastAccount[];
}

export interface ForecastAccount {
  _id?: string;
  id?: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  
  // Amounts
  forecastAmount: number;
  actualAmount?: number;
  varianceAmount?: number;
}

// ===== ENUMS =====

export enum AccountType {
  ASSETS = 'assets',
  LIABILITIES = 'liabilities',
  EQUITY = 'equity',
  INCOME = 'income',
  EXPENSES = 'expenses'
}

export enum BalanceType {
  DEBIT = 'debit',
  CREDIT = 'credit'
}

export enum LocalGAAP {
  IFRS = 'ifrs',
  US_GAAP = 'us_gaap',
  EGYPTIAN_GAAP = 'egyptian_gaap',
  CUSTOM = 'custom'
}

export enum JournalEntryType {
  MANUAL = 'manual',
  AUTOMATED = 'automated',
  RECURRING = 'recurring',
  REVERSAL = 'reversal',
  ADJUSTMENT = 'adjustment'
}

export enum JournalEntryStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  POSTED = 'posted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

export enum PeriodStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  LOCKED = 'locked'
}

export enum CalendarType {
  CALENDAR_YEAR = 'calendar_year',
  FISCAL_YEAR = 'fiscal_year',
  FOUR_FOUR_FIVE = 'four_four_five',
  CUSTOM = 'custom'
}

export enum ExchangeRateType {
  SPOT = 'spot',
  FORWARD = 'forward',
  AVERAGE = 'average'
}

export enum MatchStatus {
  NOT_MATCHED = 'not_matched',
  TWO_WAY = 'two_way',
  THREE_WAY = 'three_way'
}

export enum InvoiceStatus {
  DRAFT = 'draft',
  OPEN = 'open',
  PARTIAL = 'partial',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

export enum PaymentMethod {
  CASH = 'cash',
  CHECK = 'check',
  BANK_TRANSFER = 'bank_transfer',
  CREDIT_CARD = 'credit_card',
  ONLINE_PAYMENT = 'online_payment',
  WIRE_TRANSFER = 'wire_transfer'
}

export enum PaymentType {
  PAYMENT = 'payment',
  RECEIPT = 'receipt',
  REFUND = 'refund',
  ADVANCE = 'advance'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum BankAccountType {
  CHECKING = 'checking',
  SAVINGS = 'savings',
  MONEY_MARKET = 'money_market',
  CREDIT_LINE = 'credit_line'
}

export enum ReconciliationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DISPUTED = 'disputed'
}

export enum ReconciliationItemType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  CHECK = 'check',
  TRANSFER = 'transfer',
  FEE = 'fee',
  INTEREST = 'interest'
}

export enum CapitalizationSource {
  AP_INVOICE = 'ap_invoice',
  PURCHASE_ORDER = 'purchase_order',
  MANUAL = 'manual',
  TRANSFER = 'transfer'
}

export enum CapitalizationStatus {
  PENDING = 'pending',
  CAPITALIZED = 'capitalized',
  CANCELLED = 'cancelled'
}

export enum DepreciationStatus {
  PENDING = 'pending',
  POSTED = 'posted',
  CANCELLED = 'cancelled'
}

export enum BudgetType {
  ANNUAL = 'annual',
  QUARTERLY = 'quarterly',
  MONTHLY = 'monthly',
  PROJECT = 'project'
}

export enum BudgetStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  CLOSED = 'closed',
  CANCELLED = 'cancelled'
}

export enum ForecastType {
  ROLLING = 'rolling',
  ANNUAL = 'annual',
  SCENARIO = 'scenario'
}

export enum ForecastStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived'
}

export enum ScenarioType {
  OPTIMISTIC = 'optimistic',
  REALISTIC = 'realistic',
  PESSIMISTIC = 'pessimistic',
  CUSTOM = 'custom'
}

// ===== FINANCIAL REPORTING =====

export interface FinancialReport {
  _id?: string;
  id?: string;
  reportName: string;
  reportType: ReportType;
  reportCategory: ReportCategory;
  
  // Report Configuration
  templateId?: string;
  parameters: ReportParameter[];
  filters: ReportFilter[];
  
  // Data & Output
  data: any[];
  generatedAt: Date;
  generatedBy: string;
  
  // Schedule & Automation
  isScheduled: boolean;
  scheduleFrequency?: ScheduleFrequency;
  nextRunDate?: Date;
  
  // Export Options
  exportFormats: ExportFormat[];
  
  // Access Control
  accessLevel: AccessLevel;
  authorizedUsers: string[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface ReportTemplate {
  _id?: string;
  id?: string;
  templateName: string;
  templateType: ReportType;
  description: string;
  
  // Template Structure
  sections: ReportSection[];
  calculations: ReportCalculation[];
  
  // Formatting
  styling: ReportStyling;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface ReportSection {
  _id?: string;
  id?: string;
  sectionName: string;
  sectionType: SectionType;
  order: number;
  
  // Content
  accounts: string[]; // Account IDs
  calculations: string[]; // Calculation IDs
  
  // Formatting
  displayFormat: string;
  isVisible: boolean;
}

export interface ReportCalculation {
  _id?: string;
  id?: string;
  calculationName: string;
  calculationType: CalculationType;
  formula: string;
  
  // Parameters
  accounts: string[];
  operators: string[];
  
  // Result
  result?: number;
}

export interface AuditTrail {
  _id?: string;
  id?: string;
  entityType: string; // JournalEntry, Invoice, Payment, etc.
  entityId: string;
  action: AuditAction;
  oldValues?: any;
  newValues?: any;
  
  // User & Context
  userId: string;
  userName?: string;
  userRole?: string;
  ipAddress?: string;
  userAgent?: string;
  
  // Timestamp
  timestamp: Date;
  
  // Additional Context
  reason?: string;
  reference?: string;
}

// ===== TAX MANAGEMENT =====

export interface TaxConfiguration {
  _id?: string;
  id?: string;
  taxType: TaxType;
  taxName: string;
  taxCode: string;
  
  // Rates & Rules
  taxRate: number;
  isCompound: boolean;
  parentTaxId?: string;
  
  // Jurisdiction
  country: string;
  state?: string;
  effectiveDate: Date;
  expiryDate?: Date;
  
  // GL Integration
  taxAccountId: string;
  liabilityAccountId: string;
  
  // Status
  isActive: boolean;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface TaxTransaction {
  _id?: string;
  id?: string;
  transactionId: string;
  transactionType: string;
  
  // Tax Details
  taxType: TaxType;
  taxRate: number;
  taxableAmount: number;
  taxAmount: number;
  
  // Jurisdiction
  country: string;
  state?: string;
  
  // Status
  status: TaxStatus;
  filedDate?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

// ===== INTEGRATION POINTS =====

export interface IntegrationMapping {
  _id?: string;
  id?: string;
  sourceModule: SourceModule;
  targetModule: TargetModule;
  mappingName: string;
  
  // Field Mappings
  fieldMappings: FieldMapping[];
  
  // Transformation Rules
  transformations: TransformationRule[];
  
  // Status
  isActive: boolean;
  lastSyncDate?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface FieldMapping {
  _id?: string;
  id?: string;
  sourceField: string;
  targetField: string;
  dataType: string;
  isRequired: boolean;
  defaultValue?: any;
}

export interface TransformationRule {
  _id?: string;
  id?: string;
  ruleName: string;
  ruleType: TransformationType;
  expression: string;
  order: number;
}

// ===== ENUMS FOR NEW FEATURES =====

export enum ReportType {
  BALANCE_SHEET = 'balance_sheet',
  PROFIT_LOSS = 'profit_loss',
  TRIAL_BALANCE = 'trial_balance',
  CASH_FLOW = 'cash_flow',
  DEPARTMENT_PROFITABILITY = 'department_profitability',
  COST_CENTER_REPORT = 'cost_center_report',
  CUSTOM_DASHBOARD = 'custom_dashboard',
  TAX_REPORT = 'tax_report',
  AUDIT_REPORT = 'audit_report'
}

export enum ReportCategory {
  STANDARD = 'standard',
  MANAGEMENT = 'management',
  COMPLIANCE = 'compliance',
  CUSTOM = 'custom'
}

export enum SectionType {
  HEADER = 'header',
  ASSETS = 'assets',
  LIABILITIES = 'liabilities',
  EQUITY = 'equity',
  INCOME = 'income',
  EXPENSES = 'expenses',
  CALCULATION = 'calculation',
  FOOTER = 'footer'
}

export enum CalculationType {
  SUM = 'sum',
  AVERAGE = 'average',
  PERCENTAGE = 'percentage',
  FORMULA = 'formula',
  CUSTOM = 'custom'
}

export enum ScheduleFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly'
}

export enum ExportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
  XML = 'xml',
  JSON = 'json'
}

export enum AccessLevel {
  PUBLIC = 'public',
  RESTRICTED = 'restricted',
  CONFIDENTIAL = 'confidential'
}

export enum AuditAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  APPROVE = 'approve',
  REJECT = 'reject',
  POST = 'post',
  REVERSE = 'reverse'
}

export enum TaxType {
  VAT = 'vat',
  GST = 'gst',
  SALES_TAX = 'sales_tax',
  WITHHOLDING_TAX = 'withholding_tax',
  INCOME_TAX = 'income_tax',
  CORPORATE_TAX = 'corporate_tax',
  CUSTOM = 'custom'
}

export enum TaxStatus {
  PENDING = 'pending',
  CALCULATED = 'calculated',
  FILED = 'filed',
  PAID = 'paid',
  OVERDUE = 'overdue'
}

export enum SourceModule {
  SALES = 'sales',
  PROCUREMENT = 'procurement',
  INVENTORY = 'inventory',
  HR = 'hr',
  ASSETS = 'assets',
  FLEET = 'fleet'
}

export enum TargetModule {
  FINANCE = 'finance',
  ACCOUNTING = 'accounting',
  REPORTING = 'reporting'
}

export enum TransformationType {
  MAPPING = 'mapping',
  CALCULATION = 'calculation',
  VALIDATION = 'validation',
  FORMATTING = 'formatting'
}

export enum CurrencyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

export interface ReportStyling {
  fonts: {
    header: string;
    body: string;
    footer: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  layout: {
    orientation: 'portrait' | 'landscape';
    margins: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
  };
}

export interface ReportParameter {
  _id?: string;
  id?: string;
  parameterName: string;
  parameterType: 'date' | 'number' | 'text' | 'select';
  defaultValue?: any;
  options?: any[];
  isRequired: boolean;
}

export interface ReportFilter {
  _id?: string;
  id?: string;
  filterName: string;
  filterType: 'date_range' | 'account' | 'company' | 'currency';
  filterValue: any;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'between';
}
