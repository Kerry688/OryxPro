import { Document, ObjectId } from 'mongodb';

export interface Company extends Document {
  _id?: ObjectId;
  companyName: string;
  legalName: string;
  registrationNumber: string;
  taxId: string;
  industry: string;
  companySize: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  foundedYear: number;
  website?: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  businessType: 'sole_proprietorship' | 'partnership' | 'corporation' | 'llc' | 'non_profit';
  currency: string;
  timezone: string;
  language: string;
  logo?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: ObjectId;
  updatedBy: ObjectId;
}

export interface CreateCompanyData {
  companyName: string;
  legalName: string;
  registrationNumber: string;
  taxId: string;
  industry: string;
  companySize: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  foundedYear: number;
  website?: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  businessType: 'sole_proprietorship' | 'partnership' | 'corporation' | 'llc' | 'non_profit';
  currency: string;
  timezone: string;
  language: string;
  logo?: string;
  description?: string;
  createdBy: ObjectId;
}

export interface UpdateCompanyData {
  companyName?: string;
  legalName?: string;
  registrationNumber?: string;
  taxId?: string;
  industry?: string;
  companySize?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  foundedYear?: number;
  website?: string;
  email?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  businessType?: 'sole_proprietorship' | 'partnership' | 'corporation' | 'llc' | 'non_profit';
  currency?: string;
  timezone?: string;
  language?: string;
  logo?: string;
  description?: string;
  isActive?: boolean;
  updatedBy: ObjectId;
}
