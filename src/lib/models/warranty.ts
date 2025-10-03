import { Document, ObjectId } from 'mongodb';

// Warranty Status Types
export type WarrantyStatus = 'active' | 'expired' | 'void' | 'claimed' | 'under_review';
export type WarrantyType = 'manufacturer' | 'extended' | 'service' | 'replacement' | 'repair';
export type ClaimStatus = 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';

// Warranty Card Interface
export interface WarrantyCard extends Document {
  _id?: ObjectId;
  warrantyNumber: string;
  productId: ObjectId;
  productName: string;
  productSku: string;
  customerId: ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderId?: ObjectId;
  orderNumber?: string;
  
  // Warranty Details
  warrantyType: WarrantyType;
  status: WarrantyStatus;
  startDate: Date;
  endDate: Date;
  duration: number; // in months
  terms: string;
  coverage: WarrantyCoverage;
  
  // Product Information
  serialNumber?: string;
  batchNumber?: string;
  purchaseDate: Date;
  purchasePrice: number;
  vendor?: string;
  
  // Warranty Provider
  provider: {
    name: string;
    contact: {
      phone: string;
      email: string;
      website?: string;
      address?: string;
    };
  };
  
  // Claims History
  claims: WarrantyClaim[];
  totalClaims: number;
  lastClaimDate?: Date;
  
  // Additional Information
  notes?: string;
  attachments: string[]; // File URLs
  isTransferable: boolean;
  transferFee?: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: ObjectId;
  updatedBy: ObjectId;
}

// Warranty Coverage Details
export interface WarrantyCoverage {
  parts: boolean;
  labor: boolean;
  shipping: boolean;
  replacement: boolean;
  repair: boolean;
  exclusions: string[];
  conditions: string[];
  limitations: {
    maxClaims?: number;
    maxClaimAmount?: number;
    deductible?: number;
    timeLimit?: number; // in days for claim submission
  };
}

// Warranty Claim Interface
export interface WarrantyClaim extends Document {
  _id?: ObjectId;
  claimNumber: string;
  warrantyCardId: ObjectId;
  customerId: ObjectId;
  status: ClaimStatus;
  
  // Claim Details
  issueDescription: string;
  reportedDate: Date;
  expectedResolutionDate?: Date;
  actualResolutionDate?: Date;
  
  // Claim Type and Priority
  claimType: 'defect' | 'malfunction' | 'damage' | 'performance' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  
  // Resolution Details
  resolution: {
    type: 'repair' | 'replacement' | 'refund' | 'credit' | 'denied';
    description: string;
    cost: number;
    approvedBy?: ObjectId;
    approvedDate?: Date;
  };
  
  // Service Provider
  serviceProvider?: {
    name: string;
    contact: string;
    location: string;
    assignedDate: Date;
  };
  
  // Documentation
  evidence: {
    photos: string[];
    documents: string[];
    videos?: string[];
  };
  
  // Communication
  communications: ClaimCommunication[];
  
  // Tracking
  trackingNumber?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: ObjectId;
  updatedBy: ObjectId;
}

// Claim Communication
export interface ClaimCommunication {
  id: string;
  type: 'email' | 'phone' | 'chat' | 'note' | 'system';
  direction: 'inbound' | 'outbound';
  content: string;
  timestamp: Date;
  userId?: ObjectId;
  userName?: string;
  attachments?: string[];
}

// Warranty Template
export interface WarrantyTemplate extends Document {
  _id?: ObjectId;
  name: string;
  description: string;
  warrantyType: WarrantyType;
  duration: number; // in months
  coverage: WarrantyCoverage;
  terms: string;
  isActive: boolean;
  applicableProducts: ObjectId[]; // Product IDs this template applies to
  applicableCategories: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: ObjectId;
  updatedBy: ObjectId;
}

// Warranty Analytics
export interface WarrantyAnalytics {
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate: Date;
  metrics: {
    totalWarranties: number;
    activeWarranties: number;
    expiredWarranties: number;
    totalClaims: number;
    approvedClaims: number;
    rejectedClaims: number;
    averageClaimTime: number; // in days
    claimApprovalRate: number; // percentage
    totalClaimCost: number;
    averageClaimCost: number;
  };
  trends: {
    warrantyIssuance: number;
    claimVolume: number;
    claimApprovalRate: number;
    averageResolutionTime: number;
  };
  topIssues: Array<{
    issue: string;
    count: number;
    percentage: number;
  }>;
  productBreakdown: Array<{
    productId: ObjectId;
    productName: string;
    warrantyCount: number;
    claimCount: number;
    claimRate: number;
  }>;
}

// Create/Update Data Types
export interface CreateWarrantyCardData {
  productId: ObjectId;
  customerId: ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderId?: ObjectId;
  orderNumber?: string;
  warrantyType: WarrantyType;
  duration: number;
  terms: string;
  coverage: WarrantyCoverage;
  serialNumber?: string;
  batchNumber?: string;
  purchaseDate: Date;
  purchasePrice: number;
  vendor?: string;
  provider: {
    name: string;
    contact: {
      phone: string;
      email: string;
      website?: string;
      address?: string;
    };
  };
  notes?: string;
  attachments?: string[];
  isTransferable: boolean;
  transferFee?: number;
  createdBy: ObjectId;
}

export interface UpdateWarrantyCardData {
  status?: WarrantyStatus;
  terms?: string;
  coverage?: WarrantyCoverage;
  notes?: string;
  attachments?: string[];
  isTransferable?: boolean;
  transferFee?: number;
  updatedBy: ObjectId;
}

export interface CreateWarrantyClaimData {
  warrantyCardId: ObjectId;
  customerId: ObjectId;
  issueDescription: string;
  claimType: 'defect' | 'malfunction' | 'damage' | 'performance' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  evidence: {
    photos: string[];
    documents: string[];
    videos?: string[];
  };
  createdBy: ObjectId;
}

export interface UpdateWarrantyClaimData {
  status?: ClaimStatus;
  issueDescription?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  severity?: 'minor' | 'moderate' | 'major' | 'critical';
  resolution?: {
    type: 'repair' | 'replacement' | 'refund' | 'credit' | 'denied';
    description: string;
    cost: number;
    approvedBy?: ObjectId;
    approvedDate?: Date;
  };
  serviceProvider?: {
    name: string;
    contact: string;
    location: string;
    assignedDate: Date;
  };
  trackingNumber?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  updatedBy: ObjectId;
}

// Search and Filter Types
export interface WarrantyFilters {
  status?: WarrantyStatus[];
  warrantyType?: WarrantyType[];
  productId?: ObjectId[];
  customerId?: ObjectId[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  isExpired?: boolean;
  hasClaims?: boolean;
}

export interface WarrantySearchOptions {
  query?: string;
  filters?: WarrantyFilters;
  sortBy?: 'warrantyNumber' | 'customerName' | 'productName' | 'startDate' | 'endDate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ClaimFilters {
  status?: ClaimStatus[];
  claimType?: string[];
  priority?: string[];
  severity?: string[];
  warrantyCardId?: ObjectId[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ClaimSearchOptions {
  query?: string;
  filters?: ClaimFilters;
  sortBy?: 'claimNumber' | 'reportedDate' | 'status' | 'priority' | 'severity';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
