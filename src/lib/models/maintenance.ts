export interface MaintenanceSchedule {
  _id?: string;
  assetId: string;
  maintenanceType: MaintenanceType;
  title: string;
  description?: string;
  
  // Scheduling
  intervalType: IntervalType;
  intervalValue: number; // days, hours, or usage units
  lastPerformedDate?: Date;
  nextDueDate: Date;
  
  // Assignment
  assignedTechnician?: string;
  assignedVendor?: string;
  estimatedDuration: number; // in hours
  estimatedCost: number;
  
  // Status
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface MaintenanceWorkOrder {
  _id?: string;
  workOrderNumber: string;
  assetId: string;
  scheduleId?: string; // Reference to maintenance schedule if preventive
  
  // Work Order Details
  title: string;
  description: string;
  maintenanceType: MaintenanceType;
  priority: MaintenancePriority;
  
  // Assignment
  assignedTechnician?: string;
  assignedVendor?: string;
  requestedBy: string;
  
  // Scheduling
  requestedDate: Date;
  scheduledDate?: Date;
  startDate?: Date;
  completedDate?: Date;
  
  // Status
  status: WorkOrderStatus;
  
  // Cost Tracking
  laborCost: number;
  materialCost: number;
  vendorCost: number;
  totalCost: number;
  
  // Documentation
  notes?: string;
  attachments?: string[];
  beforePhotos?: string[];
  afterPhotos?: string[];
  
  // Parts Used
  partsUsed?: MaintenancePart[];
  
  // Follow-up
  followUpRequired: boolean;
  followUpDate?: Date;
  followUpNotes?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface MaintenancePart {
  _id?: string;
  workOrderId: string;
  partNumber: string;
  partName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  supplier?: string;
  warrantyPeriod?: number; // in months
  installedDate?: Date;
  notes?: string;
}

export interface MaintenanceHistory {
  _id?: string;
  assetId: string;
  workOrderId?: string;
  maintenanceType: MaintenanceType;
  performedDate: Date;
  performedBy: string; // Technician or vendor
  description: string;
  duration: number; // in hours
  cost: number;
  notes?: string;
  attachments?: string[];
}

export enum MaintenanceType {
  PREVENTIVE = 'preventive',
  CORRECTIVE = 'corrective',
  PREDICTIVE = 'predictive',
  EMERGENCY = 'emergency',
  INSPECTION = 'inspection',
  CALIBRATION = 'calibration',
  CLEANING = 'cleaning'
}

export enum MaintenanceStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum MaintenancePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum WorkOrderStatus {
  DRAFT = 'draft',
  REQUESTED = 'requested',
  APPROVED = 'approved',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  CLOSED = 'closed'
}

export enum IntervalType {
  DAYS = 'days',
  WEEKS = 'weeks',
  MONTHS = 'months',
  YEARS = 'years',
  HOURS = 'hours',
  USAGE_UNITS = 'usage_units',
  CALENDAR_BASED = 'calendar_based'
}

// Spare Parts Inventory
export interface SparePart {
  _id?: string;
  partNumber: string;
  name: string;
  description?: string;
  category: string;
  manufacturer?: string;
  supplier?: string;
  
  // Inventory
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  reorderPoint: number;
  unit: string; // piece, kg, liter, etc.
  
  // Pricing
  unitCost: number;
  sellingPrice?: number;
  
  // Asset Compatibility
  compatibleAssets?: string[]; // Asset IDs or categories
  
  // Location
  warehouseLocation?: string;
  shelfLocation?: string;
  
  // Status
  isActive: boolean;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// Maintenance Templates
export interface MaintenanceTemplate {
  _id?: string;
  name: string;
  description?: string;
  assetCategory: string;
  maintenanceType: MaintenanceType;
  
  // Tasks
  tasks: MaintenanceTask[];
  
  // Scheduling
  intervalType: IntervalType;
  intervalValue: number;
  
  // Estimated costs
  estimatedDuration: number;
  estimatedCost: number;
  
  // Metadata
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface MaintenanceTask {
  _id?: string;
  taskName: string;
  description?: string;
  estimatedDuration: number; // in minutes
  requiredSkill?: string;
  requiredParts?: MaintenanceTaskPart[];
  instructions?: string;
  checklist?: string[];
}

export interface MaintenanceTaskPart {
  _id?: string;
  partNumber: string;
  quantity: number;
  isRequired: boolean;
}

// Maintenance Analytics
export interface MaintenanceAnalytics {
  assetId: string;
  period: string; // YYYY-MM format
  
  // Costs
  totalMaintenanceCost: number;
  preventiveCost: number;
  correctiveCost: number;
  
  // Frequency
  totalWorkOrders: number;
  preventiveWorkOrders: number;
  correctiveWorkOrders: number;
  
  // Downtime
  totalDowntime: number; // in hours
  averageDowntime: number; // in hours
  
  // Performance
  mttr: number; // Mean Time To Repair in hours
  mtbf: number; // Mean Time Between Failures in hours
  
  // Compliance
  scheduledMaintenanceCompleted: number;
  scheduledMaintenanceTotal: number;
  complianceRate: number; // percentage
}
