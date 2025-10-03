import { ObjectId } from 'mongodb';

export type QuotationStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired' | 'converted';
export type QuotationType = 'quotation' | 'proposal' | 'estimate' | 'invoice';
export type DiscountType = 'percentage' | 'fixed_amount';

export interface QuotationItem {
  productId: string;
  productName: string;
  productCode: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  discountType?: DiscountType;
  taxRate?: number;
  totalPrice: number;
  notes?: string;
}

export interface Quotation {
  _id: ObjectId;
  quotationNumber: string;
  type: QuotationType;
  status: QuotationStatus;
  customerId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  leadId?: string;
  leadName?: string;
  dealId?: string;
  dealName?: string;
  assignedTo?: string; // Sales rep ID
  assignedToName?: string;
  subject: string;
  description?: string;
  items: QuotationItem[];
  subtotal: number;
  discountAmount: number;
  discountType?: DiscountType;
  taxAmount: number;
  taxRate: number;
  totalAmount: number;
  currency: string;
  validUntil: Date;
  termsAndConditions?: string;
  notes?: string;
  internalNotes?: string;
  tags?: string[];
  customFields?: Record<string, any>;
  sentDate?: Date;
  viewedDate?: Date;
  acceptedDate?: Date;
  rejectedDate?: Date;
  convertedDate?: Date;
  convertedToOrderId?: string;
  convertedToOrderNumber?: string;
  attachments?: {
    filename: string;
    url: string;
    type: string;
    size: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByName: string;
}

export interface CreateQuotationData {
  type?: QuotationType;
  status?: QuotationStatus;
  customerId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  leadId?: string;
  leadName?: string;
  dealId?: string;
  dealName?: string;
  assignedTo?: string;
  subject: string;
  description?: string;
  items: QuotationItem[];
  subtotal: number;
  discountAmount?: number;
  discountType?: DiscountType;
  taxAmount?: number;
  taxRate?: number;
  totalAmount: number;
  currency?: string;
  validUntil: Date;
  termsAndConditions?: string;
  notes?: string;
  internalNotes?: string;
  tags?: string[];
  customFields?: Record<string, any>;
  attachments?: {
    filename: string;
    url: string;
    type: string;
    size: number;
  }[];
}

export interface UpdateQuotationData {
  type?: QuotationType;
  status?: QuotationStatus;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  leadId?: string;
  leadName?: string;
  dealId?: string;
  dealName?: string;
  assignedTo?: string;
  subject?: string;
  description?: string;
  items?: QuotationItem[];
  subtotal?: number;
  discountAmount?: number;
  discountType?: DiscountType;
  taxAmount?: number;
  taxRate?: number;
  totalAmount?: number;
  currency?: string;
  validUntil?: Date;
  termsAndConditions?: string;
  notes?: string;
  internalNotes?: string;
  tags?: string[];
  customFields?: Record<string, any>;
  sentDate?: Date;
  viewedDate?: Date;
  acceptedDate?: Date;
  rejectedDate?: Date;
  convertedDate?: Date;
  convertedToOrderId?: string;
  convertedToOrderNumber?: string;
  attachments?: {
    filename: string;
    url: string;
    type: string;
    size: number;
  }[];
}
