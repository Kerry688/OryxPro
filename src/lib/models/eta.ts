import { ObjectId } from 'mongodb';

export type ETAInvoiceStatus = 'draft' | 'submitted' | 'accepted' | 'rejected' | 'cancelled' | 'under_review';
export type ETASyncStatus = 'pending' | 'success' | 'failed' | 'retry';
export type ETAProductStatus = 'active' | 'inactive' | 'pending_approval' | 'rejected';

export interface ETAProduct {
  _id: ObjectId;
  productId: string; // Reference to our product
  productName: string;
  productCode: string; // Our internal product code
  egsCode: string; // Egyptian Goods and Services code
  egsDescription: string;
  category: string;
  subcategory?: string;
  unitOfMeasure: string;
  taxRate: number; // VAT rate (14% for most items)
  status: ETAProductStatus;
  lastSyncAt?: Date;
  syncStatus: ETASyncStatus;
  syncError?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ETAInvoiceItem {
  itemCode: string; // EGS code
  itemName: string;
  itemDescription: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate: number;
  taxAmount: number;
  discount?: number;
  discountAmount?: number;
}

export interface ETAInvoice {
  _id: ObjectId;
  invoiceId: string; // Our internal invoice ID
  etaInvoiceId?: string; // ETA system invoice ID
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate?: Date;
  customerName: string;
  customerTaxNumber?: string;
  customerAddress?: string;
  customerPhone?: string;
  customerEmail?: string;
  items: ETAInvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  status: ETAInvoiceStatus;
  submissionDate?: Date;
  acceptanceDate?: Date;
  rejectionReason?: string;
  etaResponse?: {
    uuid: string;
    submissionId: string;
    status: string;
    message: string;
    timestamp: Date;
  };
  lastSyncAt?: Date;
  syncStatus: ETASyncStatus;
  syncError?: string;
  retryCount: number;
  maxRetries: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ETASyncLog {
  _id: ObjectId;
  syncType: 'invoice' | 'product' | 'bulk_invoice' | 'bulk_product';
  entityId: string;
  status: ETASyncStatus;
  requestData?: any;
  responseData?: any;
  errorMessage?: string;
  retryCount: number;
  startedAt: Date;
  completedAt?: Date;
  duration?: number; // in milliseconds
}

export interface ETASettings {
  _id: ObjectId;
  apiEndpoint: string;
  apiKey: string;
  secretKey: string;
  environment: 'sandbox' | 'production';
  autoSync: boolean;
  syncInterval: number; // in minutes
  retryAttempts: number;
  timeout: number; // in milliseconds
  isActive: boolean;
  lastSyncAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateETAProductData {
  productId: string;
  productName: string;
  productCode: string;
  egsCode: string;
  egsDescription: string;
  category: string;
  subcategory?: string;
  unitOfMeasure: string;
  taxRate: number;
}

export interface UpdateETAProductData {
  egsCode?: string;
  egsDescription?: string;
  category?: string;
  subcategory?: string;
  unitOfMeasure?: string;
  taxRate?: number;
  status?: ETAProductStatus;
}

export interface CreateETAInvoiceData {
  invoiceId: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate?: Date;
  customerName: string;
  customerTaxNumber?: string;
  customerAddress?: string;
  customerPhone?: string;
  customerEmail?: string;
  items: ETAInvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  paymentMethod: string;
}

export interface ETASyncOptions {
  entityType: 'invoice' | 'product';
  entityIds?: string[];
  forceSync?: boolean;
  batchSize?: number;
}

export interface ETAProductSearchOptions {
  productId?: string;
  egsCode?: string;
  category?: string;
  status?: ETAProductStatus;
  syncStatus?: ETASyncStatus;
  searchTerm?: string;
  limit?: number;
  offset?: number;
}

export interface ETAInvoiceSearchOptions {
  invoiceId?: string;
  etaInvoiceId?: string;
  status?: ETAInvoiceStatus;
  syncStatus?: ETASyncStatus;
  dateFrom?: Date;
  dateTo?: Date;
  customerName?: string;
  searchTerm?: string;
  limit?: number;
  offset?: number;
}
