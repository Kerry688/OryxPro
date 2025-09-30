import { Document, ObjectId } from 'mongodb';

export interface Customer extends Document {
  _id?: ObjectId;
  customerCode: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  email: string;
  phone?: string;
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
  customerType: 'individual' | 'business';
  status: 'active' | 'inactive' | 'suspended';
  creditLimit?: number;
  currentBalance: number;
  paymentTerms: number; // days
  notes?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  lastOrderDate?: Date;
  totalOrders: number;
  totalSpent: number;
}

export interface CreateCustomerData {
  customerCode: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  email: string;
  phone?: string;
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
  customerType: 'individual' | 'business';
  creditLimit?: number;
  paymentTerms: number;
  notes?: string;
  tags: string[];
}

export interface UpdateCustomerData {
  firstName?: string;
  lastName?: string;
  companyName?: string;
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
  customerType?: 'individual' | 'business';
  status?: 'active' | 'inactive' | 'suspended';
  creditLimit?: number;
  paymentTerms?: number;
  notes?: string;
  tags?: string[];
}

