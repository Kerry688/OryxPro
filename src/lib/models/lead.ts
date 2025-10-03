import { ObjectId } from 'mongodb';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted' | 'lost';
export type LeadSource = 'website' | 'referral' | 'social_media' | 'email_campaign' | 'cold_call' | 'trade_show' | 'advertisement' | 'other';
export type LeadPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Lead {
  _id: ObjectId;
  leadNumber: string;
  firstName: string;
  lastName: string;
  company?: string;
  jobTitle?: string;
  email: string;
  phone?: string;
  mobile?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  status: LeadStatus;
  source: LeadSource;
  priority: LeadPriority;
  assignedTo?: string; // User ID
  assignedToName?: string;
  estimatedValue?: number;
  expectedCloseDate?: Date;
  description?: string;
  notes?: string;
  tags?: string[];
  customFields?: Record<string, any>;
  lastContactDate?: Date;
  nextFollowUpDate?: Date;
  convertedToCustomer?: boolean;
  convertedCustomerId?: string;
  convertedDealId?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByName: string;
}

export interface CreateLeadData {
  firstName: string;
  lastName: string;
  company?: string;
  jobTitle?: string;
  email: string;
  phone?: string;
  mobile?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  status?: LeadStatus;
  source: LeadSource;
  priority?: LeadPriority;
  assignedTo?: string;
  estimatedValue?: number;
  expectedCloseDate?: Date;
  description?: string;
  notes?: string;
  tags?: string[];
  customFields?: Record<string, any>;
  lastContactDate?: Date;
  nextFollowUpDate?: Date;
}

export interface UpdateLeadData {
  firstName?: string;
  lastName?: string;
  company?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  status?: LeadStatus;
  source?: LeadSource;
  priority?: LeadPriority;
  assignedTo?: string;
  estimatedValue?: number;
  expectedCloseDate?: Date;
  description?: string;
  notes?: string;
  tags?: string[];
  customFields?: Record<string, any>;
  lastContactDate?: Date;
  nextFollowUpDate?: Date;
  convertedToCustomer?: boolean;
  convertedCustomerId?: string;
  convertedDealId?: string;
}
