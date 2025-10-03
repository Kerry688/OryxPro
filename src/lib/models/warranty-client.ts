// Client-safe warranty models without MongoDB imports

export type WarrantyStatus = 'active' | 'expired' | 'void' | 'claimed' | 'under_review';
export type WarrantyType = 'manufacturer' | 'extended' | 'service' | 'replacement' | 'repair';
export type ClaimStatus = 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
export type ClaimType = 'defect' | 'malfunction' | 'damage' | 'performance' | 'other';

export interface WarrantyCoverage {
  parts: boolean;
  labor: boolean;
  shipping: boolean;
  replacement: boolean;
  repair: boolean;
}

export interface WarrantyTerms {
  description: string;
  limitations: string[];
  exclusions: string[];
  conditions: string[];
}

export interface WarrantyAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
}

export interface WarrantyCard {
  _id?: string;
  warrantyNumber: string;
  productId: string;
  productName: string;
  productSku: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderId?: string;
  orderNumber?: string;
  warrantyType: WarrantyType;
  status: WarrantyStatus;
  startDate: Date;
  endDate: Date;
  duration: number;
  terms: WarrantyTerms;
  coverage: WarrantyCoverage;
  serialNumber?: string;
  batchNumber?: string;
  purchaseDate: Date;
  purchasePrice: number;
  vendor?: string;
  provider?: string;
  claims: string[];
  totalClaims: number;
  notes?: string;
  attachments: WarrantyAttachment[];
  isTransferable: boolean;
  transferFee?: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface WarrantyClaim {
  _id?: string;
  claimNumber: string;
  warrantyCardId: string;
  issueDescription: string;
  claimType: ClaimType;
  status: ClaimStatus;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  severity: 'critical' | 'major' | 'moderate' | 'minor';
  reportedDate: Date;
  reportedBy: string;
  assignedTo?: string;
  evidence?: {
    photos?: string[];
    documents?: string[];
    videos?: string[];
  };
  resolution?: {
    type: string;
    description: string;
    cost: number;
    approvedBy?: string;
    approvedDate?: Date;
  };
  notes?: string;
  attachments: WarrantyAttachment[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface CreateWarrantyCardData {
  productId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderId?: string;
  orderNumber?: string;
  warrantyType: WarrantyType;
  duration: number;
  terms: WarrantyTerms;
  coverage: WarrantyCoverage;
  serialNumber?: string;
  batchNumber?: string;
  purchaseDate: Date;
  purchasePrice: number;
  vendor?: string;
  provider?: string;
  notes?: string;
  attachments?: WarrantyAttachment[];
  isTransferable: boolean;
  transferFee?: number;
  createdBy: string;
}

export interface CreateWarrantyClaimData {
  warrantyCardId: string;
  issueDescription: string;
  claimType: ClaimType;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  severity: 'critical' | 'major' | 'moderate' | 'minor';
  reportedBy: string;
  assignedTo?: string;
  evidence?: {
    photos?: string[];
    documents?: string[];
    videos?: string[];
  };
  notes?: string;
  attachments?: WarrantyAttachment[];
  createdBy: string;
}

export interface WarrantyTemplate {
  _id?: string;
  name: string;
  description: string;
  warrantyType: WarrantyType;
  duration: number;
  terms: WarrantyTerms;
  coverage: WarrantyCoverage;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface WarrantyAnalytics {
  totalWarranties: number;
  activeWarranties: number;
  expiredWarranties: number;
  totalClaims: number;
  pendingClaims: number;
  approvedClaims: number;
  rejectedClaims: number;
  averageClaimResolutionTime: number;
  warrantySuccessRate: number;
  topClaimTypes: Array<{
    type: ClaimType;
    count: number;
  }>;
  warrantyExpirationTrend: Array<{
    month: string;
    expiring: number;
  }>;
}
