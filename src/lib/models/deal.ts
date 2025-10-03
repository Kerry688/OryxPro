import { ObjectId } from 'mongodb';

export type DealStatus = 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
export type DealStage = 'lead' | 'opportunity' | 'proposal' | 'negotiation' | 'closed';
export type DealPriority = 'low' | 'medium' | 'high' | 'urgent';
export type DealType = 'new_business' | 'upsell' | 'cross_sell' | 'renewal';

export interface Deal {
  _id: ObjectId;
  dealNumber: string;
  name: string;
  description?: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  leadId?: string; // If converted from lead
  leadName?: string;
  status: DealStatus;
  stage: DealStage;
  priority: DealPriority;
  type: DealType;
  assignedTo?: string; // User ID
  assignedToName?: string;
  value: number;
  probability: number; // 0-100
  expectedCloseDate: Date;
  actualCloseDate?: Date;
  currency: string;
  products?: {
    productId: string;
    productName: string;
    productCode: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  competitors?: string[];
  nextSteps?: string;
  notes?: string;
  tags?: string[];
  customFields?: Record<string, any>;
  lastActivityDate?: Date;
  nextFollowUpDate?: Date;
  wonReason?: string;
  lostReason?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByName: string;
}

export interface CreateDealData {
  name: string;
  description?: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  leadId?: string;
  leadName?: string;
  status?: DealStatus;
  stage?: DealStage;
  priority?: DealPriority;
  type?: DealType;
  assignedTo?: string;
  value: number;
  probability?: number;
  expectedCloseDate: Date;
  currency?: string;
  products?: {
    productId: string;
    productName: string;
    productCode: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  competitors?: string[];
  nextSteps?: string;
  notes?: string;
  tags?: string[];
  customFields?: Record<string, any>;
  lastActivityDate?: Date;
  nextFollowUpDate?: Date;
}

export interface UpdateDealData {
  name?: string;
  description?: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  leadId?: string;
  leadName?: string;
  status?: DealStatus;
  stage?: DealStage;
  priority?: DealPriority;
  type?: DealType;
  assignedTo?: string;
  value?: number;
  probability?: number;
  expectedCloseDate?: Date;
  actualCloseDate?: Date;
  currency?: string;
  products?: {
    productId: string;
    productName: string;
    productCode: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  competitors?: string[];
  nextSteps?: string;
  notes?: string;
  tags?: string[];
  customFields?: Record<string, any>;
  lastActivityDate?: Date;
  nextFollowUpDate?: Date;
  wonReason?: string;
  lostReason?: string;
}
