// Service Request and Work Order models

export type ServiceRequestStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
export type ServiceRequestPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ServiceRequestType = 'repair' | 'maintenance' | 'installation' | 'inspection' | 'warranty_claim' | 'emergency';
export type WorkOrderStatus = 'draft' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
export type BillingStatus = 'warranty_covered' | 'billable' | 'mixed' | 'pending_assessment';

export interface ServiceRequest {
  _id?: string;
  requestNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productId: string;
  productName: string;
  productSku: string;
  serialNumber?: string;
  warrantyCardId?: string;
  warrantyStatus: 'covered' | 'expired' | 'partial' | 'unknown';
  requestType: ServiceRequestType;
  priority: ServiceRequestPriority;
  status: ServiceRequestStatus;
  issueDescription: string;
  reportedDate: Date;
  reportedBy: string;
  assignedTo?: string;
  assignedDate?: Date;
  expectedCompletionDate?: Date;
  actualCompletionDate?: Date;
  workOrders: string[];
  billingStatus: BillingStatus;
  estimatedCost?: number;
  actualCost?: number;
  warrantyCoverage?: {
    labor: boolean;
    parts: boolean;
    replacement: boolean;
    shipping: boolean;
  };
  attachments: ServiceAttachment[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface WorkOrder {
  _id?: string;
  workOrderNumber: string;
  serviceRequestId: string;
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  serialNumber?: string;
  warrantyCardId?: string;
  status: WorkOrderStatus;
  assignedTo: string;
  assignedDate: Date;
  startDate?: Date;
  completionDate?: Date;
  estimatedDuration: number; // in hours
  actualDuration?: number; // in hours
  laborEntries: LaborEntry[];
  partsUsed: PartsEntry[];
  services: ServiceEntry[];
  billingStatus: BillingStatus;
  warrantyCoverage?: {
    labor: boolean;
    parts: boolean;
    replacement: boolean;
    shipping: boolean;
  };
  totalCost: number;
  warrantyCoveredCost: number;
  billableCost: number;
  salesOrderId?: string;
  invoiceId?: string;
  notes?: string;
  attachments: ServiceAttachment[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface LaborEntry {
  id: string;
  description: string;
  technician: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in hours
  hourlyRate: number;
  totalCost: number;
  isWarrantyCovered: boolean;
  category: 'diagnosis' | 'repair' | 'maintenance' | 'installation' | 'testing';
}

export interface PartsEntry {
  id: string;
  partNumber: string;
  partName: string;
  description: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  isWarrantyCovered: boolean;
  supplier?: string;
  category: 'replacement' | 'consumable' | 'upgrade' | 'repair_part';
}

export interface ServiceEntry {
  id: string;
  serviceName: string;
  description: string;
  cost: number;
  isWarrantyCovered: boolean;
  category: 'diagnostic' | 'repair' | 'maintenance' | 'calibration' | 'testing';
}

export interface ServiceAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface WarrantyAssessment {
  _id?: string;
  serviceRequestId: string;
  workOrderId: string;
  warrantyCardId: string;
  assessmentDate: Date;
  assessedBy: string;
  warrantyStatus: 'covered' | 'expired' | 'partial' | 'void';
  coverageDetails: {
    labor: boolean;
    parts: boolean;
    replacement: boolean;
    shipping: boolean;
  };
  coverageLimits?: {
    maxLaborHours?: number;
    maxPartsCost?: number;
    maxTotalCost?: number;
  };
  exclusions: string[];
  notes?: string;
  approvedBy?: string;
  approvedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BillingAssessment {
  _id?: string;
  serviceRequestId: string;
  workOrderId: string;
  assessmentDate: Date;
  assessedBy: string;
  billingStatus: BillingStatus;
  warrantyCoveredItems: {
    labor: number;
    parts: number;
    services: number;
    total: number;
  };
  billableItems: {
    labor: number;
    parts: number;
    services: number;
    total: number;
  };
  salesOrderId?: string;
  invoiceId?: string;
  paymentStatus?: 'pending' | 'paid' | 'partial' | 'overdue';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateServiceRequestData {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productId: string;
  productName: string;
  productSku: string;
  serialNumber?: string;
  warrantyCardId?: string;
  requestType: ServiceRequestType;
  priority: ServiceRequestPriority;
  issueDescription: string;
  reportedBy: string;
  assignedTo?: string;
  expectedCompletionDate?: Date;
  attachments?: ServiceAttachment[];
  notes?: string;
  createdBy: string;
}

export interface CreateWorkOrderData {
  serviceRequestId: string;
  assignedTo: string;
  estimatedDuration: number;
  notes?: string;
  createdBy: string;
}

export interface ServiceRequestFilters {
  status?: ServiceRequestStatus[];
  priority?: ServiceRequestPriority[];
  requestType?: ServiceRequestType[];
  assignedTo?: string[];
  customerId?: string;
  productId?: string;
  warrantyStatus?: string[];
  billingStatus?: BillingStatus[];
  dateFrom?: Date;
  dateTo?: Date;
}

export interface ServiceRequestSearchOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: ServiceRequestFilters;
}

export interface ServiceRequestAnalytics {
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  warrantyCoveredRequests: number;
  billableRequests: number;
  mixedRequests: number;
  averageResolutionTime: number;
  totalRevenue: number;
  warrantyCosts: number;
  topIssues: Array<{
    issue: string;
    count: number;
  }>;
  technicianPerformance: Array<{
    technician: string;
    completedJobs: number;
    averageTime: number;
    customerRating: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    requests: number;
    revenue: number;
    warrantyCosts: number;
  }>;
}
