export interface Asset {
  _id?: string;
  assetId: string; // Unique asset identifier
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  assetType: AssetType;
  
  // Financial Information
  purchaseDate: Date;
  purchaseCost: number;
  currentValue: number;
  supplier?: string;
  invoiceNumber?: string;
  warrantyPeriod?: number; // in months
  
  // Location & Assignment
  location: string;
  department?: string;
  assignedEmployee?: string;
  costCenter?: string;
  
  // Physical Properties
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  specifications?: Record<string, any>;
  
  // Barcode/RFID
  barcode?: string;
  rfidTag?: string;
  qrCode?: string;
  
  // Hierarchy
  parentAsset?: string; // Reference to parent asset ID
  childAssets?: string[]; // Array of child asset IDs
  components?: AssetComponent[];
  
  // Depreciation
  depreciationMethod: DepreciationMethod;
  usefulLife: number; // in years
  salvageValue: number;
  depreciationRate?: number; // calculated
  
  // Status & Lifecycle
  status: AssetStatus;
  condition: AssetCondition;
  lifecycleStage: AssetLifecycleStage;
  
  // Maintenance
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  maintenanceInterval?: number; // in days
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface AssetComponent {
  _id?: string;
  assetId: string;
  componentName: string;
  componentType: string;
  specifications?: Record<string, any>;
  purchaseDate?: Date;
  cost?: number;
  warrantyPeriod?: number;
  status: AssetStatus;
  notes?: string;
}

export enum AssetType {
  IT_EQUIPMENT = 'it_equipment',
  VEHICLE = 'vehicle',
  MACHINERY = 'machinery',
  FURNITURE = 'furniture',
  BUILDING = 'building',
  LAND = 'land',
  INTANGIBLE = 'intangible',
  OTHER = 'other'
}

export enum AssetStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  UNDER_MAINTENANCE = 'under_maintenance',
  DISPOSED = 'disposed',
  LOST = 'lost',
  STOLEN = 'stolen',
  RETIRED = 'retired'
}

export enum AssetCondition {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  CRITICAL = 'critical'
}

export enum AssetLifecycleStage {
  ACQUISITION = 'acquisition',
  COMMISSIONING = 'commissioning',
  OPERATIONAL = 'operational',
  MAINTENANCE = 'maintenance',
  RETIREMENT = 'retirement',
  DISPOSAL = 'disposal'
}

export enum DepreciationMethod {
  STRAIGHT_LINE = 'straight_line',
  DECLINING_BALANCE = 'declining_balance',
  UNITS_OF_PRODUCTION = 'units_of_production',
  SUM_OF_YEARS_DIGITS = 'sum_of_years_digits'
}

// Asset Categories
export interface AssetCategory {
  _id?: string;
  name: string;
  code: string;
  description?: string;
  parentCategory?: string;
  assetType: AssetType;
  depreciationMethod: DepreciationMethod;
  defaultUsefulLife: number;
  defaultSalvageValue: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Depreciation Records
export interface DepreciationRecord {
  _id?: string;
  assetId: string;
  period: string; // YYYY-MM format
  depreciationAmount: number;
  accumulatedDepreciation: number;
  bookValue: number;
  method: DepreciationMethod;
  calculatedAt: Date;
  postedToAccounting: boolean;
  accountingEntryId?: string;
}

// Asset Lifecycle Tracking Interfaces

export interface AssetAcquisition {
  _id?: string;
  id?: string;
  assetId: string;
  acquisitionType: AcquisitionType;
  acquisitionDate: Date;
  
  // Purchase Details
  supplier?: string;
  supplierContact?: string;
  purchaseOrderNumber?: string;
  invoiceNumber?: string;
  purchaseCost: number;
  additionalCosts?: number; // Shipping, installation, etc.
  totalCost: number;
  
  // Transfer Details (if applicable)
  transferredFrom?: string;
  transferredFromLocation?: string;
  transferReason?: string;
  transferDocumentNumber?: string;
  
  // Commissioning
  commissioningDate?: Date;
  commissioningEngineer?: string;
  commissioningNotes?: string;
  acceptanceTestsPassed?: boolean;
  
  // Documentation
  documents?: AssetDocument[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface AssetUsage {
  _id?: string;
  id?: string;
  assetId: string;
  
  // Assignment Details
  assignedEmployee?: string;
  assignedEmployeeName?: string;
  assignedDepartment?: string;
  assignedCostCenter?: string;
  assignedProject?: string;
  
  // Location
  currentLocation: string;
  previousLocation?: string;
  locationHistory?: LocationHistory[];
  
  // Usage Tracking
  usageStartDate: Date;
  usageEndDate?: Date;
  usageType: UsageType;
  utilizationRate?: number; // Percentage of time in use
  
  // Operational Details
  operationalStatus: OperationalStatus;
  isAvailable: boolean;
  availabilityReason?: string;
  
  // Performance Metrics
  hoursOperated?: number;
  cyclesCompleted?: number;
  outputProduced?: number;
  efficiencyRating?: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface LocationHistory {
  _id?: string;
  location: string;
  movedDate: Date;
  movedBy: string;
  reason: string;
  notes?: string;
}

export interface AssetDisposal {
  _id?: string;
  id?: string;
  assetId: string;
  disposalType: DisposalType;
  disposalDate: Date;
  
  // Financial Details
  disposalValue: number;
  disposalCosts?: number; // Removal, transport, etc.
  netDisposalValue: number;
  
  // Sale Details (if applicable)
  buyer?: string;
  buyerContact?: string;
  saleDocumentNumber?: string;
  
  // Disposal Details
  disposalReason: string;
  disposalMethod?: string;
  disposalLocation?: string;
  disposalCompany?: string;
  
  // Documentation
  disposalCertificate?: string;
  environmentalCompliance?: boolean;
  disposalDocuments?: AssetDocument[];
  
  // Approval
  approvedBy?: string;
  approvedDate?: Date;
  approvalNotes?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface AssetDocument {
  _id?: string;
  id?: string;
  assetId: string;
  documentType: DocumentType;
  documentName: string;
  documentNumber?: string;
  filePath?: string;
  fileSize?: number;
  uploadedDate: Date;
  uploadedBy: string;
  expiryDate?: Date;
  isActive: boolean;
  notes?: string;
}

// Enums for Lifecycle Tracking

export enum AcquisitionType {
  PURCHASE = 'purchase',
  LEASE = 'lease',
  DONATION = 'donation',
  TRANSFER = 'transfer',
  CONSTRUCTION = 'construction',
  DEVELOPMENT = 'development'
}

export enum UsageType {
  OPERATIONAL = 'operational',
  STANDBY = 'standby',
  MAINTENANCE = 'maintenance',
  TESTING = 'testing',
  DEMO = 'demo',
  STORAGE = 'storage'
}

export enum OperationalStatus {
  RUNNING = 'running',
  STOPPED = 'stopped',
  IDLE = 'idle',
  BROKEN_DOWN = 'broken_down',
  MAINTENANCE = 'maintenance',
  OUT_OF_SERVICE = 'out_of_service'
}

export enum DisposalType {
  SALE = 'sale',
  DONATION = 'donation',
  SCRAPPING = 'scrapping',
  DESTRUCTION = 'destruction',
  TRADE_IN = 'trade_in',
  TRANSFER = 'transfer',
  RETIREMENT = 'retirement'
}

export enum DocumentType {
  INVOICE = 'invoice',
  WARRANTY = 'warranty',
  MANUAL = 'manual',
  CERTIFICATE = 'certificate',
  PERMIT = 'permit',
  INSURANCE = 'insurance',
  MAINTENANCE_RECORD = 'maintenance_record',
  DISPOSAL_CERTIFICATE = 'disposal_certificate',
  OTHER = 'other'
}

// Asset Reporting Interfaces

export interface AssetReport {
  _id?: string;
  id?: string;
  reportName: string;
  reportType: AssetReportType;
  reportDate: Date;
  generatedBy: string;
  
  // Report Parameters
  filters: AssetReportFilter[];
  parameters: AssetReportParameter[];
  
  // Report Data
  data: AssetReportData;
  summary: AssetReportSummary;
  
  // Export Options
  exportFormats: AssetExportFormat[];
  isScheduled: boolean;
  scheduleFrequency?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface AssetReportFilter {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'between' | 'in';
  value: any;
  label: string;
}

export interface AssetReportParameter {
  name: string;
  value: any;
  type: 'date' | 'number' | 'text' | 'select' | 'boolean';
  label: string;
}

export interface AssetReportData {
  assets: Asset[];
  totalCount: number;
  totalValue: number;
  averageValue: number;
  categories: CategorySummary[];
  departments: DepartmentSummary[];
  locations: LocationSummary[];
  statusBreakdown: StatusSummary[];
  conditionBreakdown: ConditionSummary[];
}

export interface AssetReportSummary {
  totalAssets: number;
  totalValue: number;
  totalDepreciation: number;
  netBookValue: number;
  maintenanceCosts: number;
  utilizationRate: number;
  roiPercentage: number;
  complianceRate: number;
}

export interface CategorySummary {
  category: string;
  count: number;
  totalValue: number;
  averageValue: number;
  percentage: number;
}

export interface DepartmentSummary {
  department: string;
  count: number;
  totalValue: number;
  utilizationRate: number;
  maintenanceCosts: number;
}

export interface LocationSummary {
  location: string;
  count: number;
  totalValue: number;
  condition: AssetCondition;
  lastMaintenanceDate?: Date;
}

export interface StatusSummary {
  status: AssetStatus;
  count: number;
  percentage: number;
  totalValue: number;
}

export interface ConditionSummary {
  condition: AssetCondition;
  count: number;
  percentage: number;
  totalValue: number;
  maintenanceRequired: boolean;
}

export interface DepreciationSchedule {
  _id?: string;
  id?: string;
  assetId: string;
  assetName: string;
  period: string; // YYYY-MM
  depreciationAmount: number;
  accumulatedDepreciation: number;
  bookValue: number;
  remainingLife: number; // in months
  depreciationMethod: DepreciationMethod;
  calculatedAt: Date;
}

export interface MaintenanceCostReport {
  _id?: string;
  id?: string;
  assetId: string;
  assetName: string;
  category: string;
  department: string;
  totalMaintenanceCost: number;
  preventiveCost: number;
  correctiveCost: number;
  emergencyCost: number;
  maintenanceHours: number;
  downtimeHours: number;
  maintenanceFrequency: number;
  costPerHour: number;
  costPerUnit: number;
  period: string; // YYYY-MM
  reportDate: Date;
}

export interface ROIAnalysis {
  _id?: string;
  id?: string;
  assetId: string;
  assetName: string;
  category: string;
  department: string;
  
  // Financial Metrics
  initialInvestment: number;
  currentValue: number;
  totalRevenue: number;
  totalCosts: number;
  netProfit: number;
  roiPercentage: number;
  
  // Utilization Metrics
  utilizationRate: number;
  hoursOperated: number;
  hoursAvailable: number;
  outputProduced: number;
  efficiencyRating: number;
  
  // Performance Metrics
  maintenanceCostRatio: number;
  downtimePercentage: number;
  productivityIndex: number;
  
  // Time Period
  analysisPeriod: string; // YYYY-MM
  reportDate: Date;
}

export interface UtilizationAnalysis {
  _id?: string;
  id?: string;
  assetId: string;
  assetName: string;
  category: string;
  department: string;
  location: string;
  
  // Time-based Metrics
  totalHours: number;
  operationalHours: number;
  idleHours: number;
  maintenanceHours: number;
  downtimeHours: number;
  
  // Utilization Rates
  overallUtilization: number;
  operationalUtilization: number;
  availabilityRate: number;
  reliabilityRate: number;
  
  // Performance Indicators
  utilizationTrend: 'increasing' | 'decreasing' | 'stable';
  performanceRating: number; // 1-10
  recommendations: string[];
  
  // Time Period
  analysisPeriod: string; // YYYY-MM
  reportDate: Date;
}

// Enums for Reporting

export enum AssetReportType {
  ASSET_REGISTER = 'asset_register',
  DEPRECIATION_SCHEDULE = 'depreciation_schedule',
  MAINTENANCE_COSTS = 'maintenance_costs',
  ROI_ANALYSIS = 'roi_analysis',
  UTILIZATION_ANALYSIS = 'utilization_analysis',
  COMPLIANCE_REPORT = 'compliance_report',
  FINANCIAL_SUMMARY = 'financial_summary',
  PERFORMANCE_DASHBOARD = 'performance_dashboard'
}

export enum AssetExportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json'
}

// Revaluation Records
export interface RevaluationRecord {
  _id?: string;
  assetId: string;
  revaluationDate: Date;
  previousValue: number;
  newValue: number;
  revaluationAmount: number;
  reason: string;
  approvedBy: string;
  accountingEntryId?: string;
  createdAt: Date;
}

// Impairment Records
export interface ImpairmentRecord {
  _id?: string;
  assetId: string;
  impairmentDate: Date;
  previousValue: number;
  impairedValue: number;
  impairmentAmount: number;
  reason: string;
  evidence: string[];
  approvedBy: string;
  accountingEntryId?: string;
  createdAt: Date;
}

// Asset Transfer/Assignment
export interface AssetAssignment {
  _id?: string;
  assetId: string;
  assignedTo: string; // Employee ID or Department ID
  assignmentType: 'employee' | 'department' | 'location';
  assignedDate: Date;
  unassignedDate?: Date;
  assignedBy: string;
  notes?: string;
  isActive: boolean;
}

// Asset Disposal
export interface AssetDisposal {
  _id?: string;
  assetId: string;
  disposalDate: Date;
  disposalMethod: DisposalMethod;
  disposalValue: number;
  disposalCosts: number;
  netDisposalValue: number;
  buyer?: string;
  reason: string;
  approvedBy: string;
  accountingEntryId?: string;
  createdAt: Date;
}

export enum DisposalMethod {
  SALE = 'sale',
  DONATION = 'donation',
  SCRAP = 'scrap',
  TRADE_IN = 'trade_in',
  DESTRUCTION = 'destruction'
}
