// Service history and timeline models for products

export type ServiceHistoryType = 
  | 'installation' 
  | 'maintenance' 
  | 'repair' 
  | 'warranty_claim' 
  | 'inspection' 
  | 'upgrade' 
  | 'replacement' 
  | 'calibration' 
  | 'cleaning' 
  | 'diagnostic' 
  | 'emergency_repair' 
  | 'preventive_maintenance'
  | 'warranty_service'
  | 'recall'
  | 'end_of_life';

export type ServiceHistoryStatus = 
  | 'pending' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'on_hold' 
  | 'failed';

export type ServicePriority = 'low' | 'medium' | 'high' | 'urgent' | 'critical';

export type ServiceOutcome = 
  | 'successful' 
  | 'partially_successful' 
  | 'failed' 
  | 'requires_follow_up' 
  | 'warranty_approved' 
  | 'warranty_denied' 
  | 'customer_satisfied' 
  | 'customer_dissatisfied';

export interface ServiceHistoryEntry {
  _id?: string;
  productId: string;
  productName: string;
  productSerialNumber?: string;
  productModel?: string;
  productCategory?: string;
  
  // Service details
  serviceType: ServiceHistoryType;
  title: string;
  description: string;
  status: ServiceHistoryStatus;
  priority: ServicePriority;
  outcome?: ServiceOutcome;
  
  // Dates and timing
  scheduledDate?: Date;
  startDate?: Date;
  endDate?: Date;
  estimatedDuration?: number; // in minutes
  actualDuration?: number; // in minutes
  
  // Service provider
  technicianId?: string;
  technicianName?: string;
  serviceProviderId?: string;
  serviceProviderName?: string;
  serviceLocation?: string;
  
  // Customer information
  customerId?: string;
  customerName?: string;
  customerContact?: string;
  
  // Related records
  serviceRequestId?: string;
  workOrderId?: string;
  warrantyClaimId?: string;
  invoiceId?: string;
  purchaseOrderId?: string;
  
  // Service details
  serviceItems: ServiceItem[];
  partsUsed: ServicePart[];
  laborHours: number;
  totalCost: number;
  warrantyCoverage: number;
  customerCharge: number;
  
  // Documentation
  notes?: string;
  recommendations?: string;
  followUpRequired?: boolean;
  followUpDate?: Date;
  attachments: ServiceAttachment[];
  
  // Quality and feedback
  customerRating?: number; // 1-5 stars
  customerFeedback?: string;
  technicianNotes?: string;
  qualityCheckPassed?: boolean;
  
  // System tracking
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export interface ServiceItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  warrantyCovered: boolean;
  partNumber?: string;
  supplier?: string;
}

export interface ServicePart {
  id: string;
  partNumber: string;
  partName: string;
  description?: string;
  category: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  warrantyCovered: boolean;
  supplier?: string;
  supplierPartNumber?: string;
  installationDate?: Date;
  warrantyExpiry?: Date;
}

export interface ServiceAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
  description?: string;
}

export interface ServiceTimelineEvent {
  _id?: string;
  productId: string;
  eventType: ServiceHistoryType;
  eventTitle: string;
  eventDescription: string;
  eventDate: Date;
  status: ServiceHistoryStatus;
  priority: ServicePriority;
  technicianName?: string;
  customerName?: string;
  cost?: number;
  warrantyCovered?: boolean;
  attachments?: ServiceAttachment[];
  metadata?: Record<string, any>;
}

export interface ServiceHistorySummary {
  productId: string;
  productName: string;
  totalServices: number;
  totalCost: number;
  warrantyCosts: number;
  customerCosts: number;
  averageServiceTime: number;
  lastServiceDate?: Date;
  nextScheduledService?: Date;
  serviceFrequency: number; // days between services
  reliabilityScore: number; // 0-100
  warrantyStatus: 'active' | 'expired' | 'void';
  warrantyExpiry?: Date;
  serviceHistory: ServiceHistoryEntry[];
  timeline: ServiceTimelineEvent[];
}

export interface CreateServiceHistoryData {
  productId: string;
  productName: string;
  productSerialNumber?: string;
  productModel?: string;
  productCategory?: string;
  serviceType: ServiceHistoryType;
  title: string;
  description: string;
  status: ServiceHistoryStatus;
  priority: ServicePriority;
  scheduledDate?: Date;
  startDate?: Date;
  endDate?: Date;
  estimatedDuration?: number;
  technicianId?: string;
  technicianName?: string;
  serviceProviderId?: string;
  serviceProviderName?: string;
  serviceLocation?: string;
  customerId?: string;
  customerName?: string;
  customerContact?: string;
  serviceRequestId?: string;
  workOrderId?: string;
  warrantyClaimId?: string;
  invoiceId?: string;
  purchaseOrderId?: string;
  serviceItems: ServiceItem[];
  partsUsed: ServicePart[];
  laborHours: number;
  totalCost: number;
  warrantyCoverage: number;
  customerCharge: number;
  notes?: string;
  recommendations?: string;
  followUpRequired?: boolean;
  followUpDate?: Date;
  customerRating?: number;
  customerFeedback?: string;
  technicianNotes?: string;
  qualityCheckPassed?: boolean;
  createdBy: string;
}

export interface UpdateServiceHistoryData {
  serviceType?: ServiceHistoryType;
  title?: string;
  description?: string;
  status?: ServiceHistoryStatus;
  priority?: ServicePriority;
  scheduledDate?: Date;
  startDate?: Date;
  endDate?: Date;
  estimatedDuration?: number;
  actualDuration?: number;
  technicianId?: string;
  technicianName?: string;
  serviceProviderId?: string;
  serviceProviderName?: string;
  serviceLocation?: string;
  customerId?: string;
  customerName?: string;
  customerContact?: string;
  serviceRequestId?: string;
  workOrderId?: string;
  warrantyClaimId?: string;
  invoiceId?: string;
  purchaseOrderId?: string;
  serviceItems?: ServiceItem[];
  partsUsed?: ServicePart[];
  laborHours?: number;
  totalCost?: number;
  warrantyCoverage?: number;
  customerCharge?: number;
  notes?: string;
  recommendations?: string;
  followUpRequired?: boolean;
  followUpDate?: Date;
  outcome?: ServiceOutcome;
  customerRating?: number;
  customerFeedback?: string;
  technicianNotes?: string;
  qualityCheckPassed?: boolean;
  updatedBy: string;
}

export interface ServiceHistoryFilters {
  productId?: string;
  serviceType?: ServiceHistoryType[];
  status?: ServiceHistoryStatus[];
  priority?: ServicePriority[];
  technicianId?: string;
  customerId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  warrantyCovered?: boolean;
  followUpRequired?: boolean;
  hasAttachments?: boolean;
}

export interface ServiceHistorySearchOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: ServiceHistoryFilters;
}

export interface ServiceHistoryAnalytics {
  totalServices: number;
  servicesByType: Record<ServiceHistoryType, number>;
  servicesByStatus: Record<ServiceHistoryStatus, number>;
  totalCost: number;
  warrantyCosts: number;
  customerCosts: number;
  averageServiceTime: number;
  reliabilityTrends: Array<{
    month: string;
    services: number;
    failures: number;
    reliabilityScore: number;
  }>;
  topIssues: Array<{
    issue: string;
    frequency: number;
    averageCost: number;
  }>;
  technicianPerformance: Array<{
    technicianId: string;
    technicianName: string;
    servicesCompleted: number;
    averageRating: number;
    totalHours: number;
  }>;
  costAnalysis: Array<{
    category: string;
    totalCost: number;
    warrantyCovered: number;
    customerCharged: number;
  }>;
}
