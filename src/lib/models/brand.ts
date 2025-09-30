import { Document, ObjectId } from 'mongodb';

export interface Brand extends Document {
  _id?: ObjectId;
  name: string;
  code: string; // Unique brand identifier
  description?: string;
  logo?: string; // URL or path to brand logo
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
  category: 'electronics' | 'clothing' | 'automotive' | 'food_beverage' | 'beauty' | 'home_garden' | 'sports' | 'books' | 'toys' | 'health' | 'office' | 'industrial' | 'photography' | 'other';
  status: 'active' | 'inactive' | 'pending' | 'discontinued';
  establishedYear?: number;
  countryOfOrigin?: string;
  certifications?: string[]; // e.g., ISO, CE, FDA
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  contactPerson?: {
    name: string;
    email: string;
    phone: string;
    position: string;
  };
  terms?: {
    paymentTerms: string;
    returnPolicy: string;
    warrantyTerms: string;
    minimumOrder: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: ObjectId;
  updatedBy: ObjectId;
}

export interface CreateBrandData {
  name: string;
  code: string;
  description?: string;
  logo?: string;
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
  category: 'electronics' | 'clothing' | 'automotive' | 'food_beverage' | 'beauty' | 'home_garden' | 'sports' | 'books' | 'toys' | 'health' | 'office' | 'industrial' | 'photography' | 'other';
  status?: 'active' | 'inactive' | 'pending' | 'discontinued';
  establishedYear?: number;
  countryOfOrigin?: string;
  certifications?: string[];
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  contactPerson?: {
    name: string;
    email: string;
    phone: string;
    position: string;
  };
  terms?: {
    paymentTerms: string;
    returnPolicy: string;
    warrantyTerms: string;
    minimumOrder: number;
  };
  createdBy: ObjectId;
}

export interface UpdateBrandData {
  name?: string;
  code?: string;
  description?: string;
  logo?: string;
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
  category?: 'electronics' | 'clothing' | 'automotive' | 'food_beverage' | 'beauty' | 'home_garden' | 'sports' | 'books' | 'toys' | 'health' | 'office' | 'industrial' | 'other';
  status?: 'active' | 'inactive' | 'pending' | 'discontinued';
  establishedYear?: number;
  countryOfOrigin?: string;
  certifications?: string[];
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  contactPerson?: {
    name: string;
    email: string;
    phone: string;
    position: string;
  };
  terms?: {
    paymentTerms: string;
    returnPolicy: string;
    warrantyTerms: string;
    minimumOrder: number;
  };
  isActive?: boolean;
  updatedBy: ObjectId;
}

export interface BrandAnalytics {
  brandId: ObjectId;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate: Date;
  metrics: {
    totalProducts: number;
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    customerSatisfaction?: number;
    returnRate?: number;
  };
  trends: {
    salesGrowth: number;
    revenueGrowth: number;
    orderGrowth: number;
    productGrowth: number;
  };
  topProducts: Array<{
    productId: ObjectId;
    productName: string;
    sku: string;
    revenue: number;
    orders: number;
  }>;
  insights: string[];
  recommendations: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BrandFilters {
  category?: string[];
  status?: string[];
  countryOfOrigin?: string[];
  isActive?: boolean;
  createdDateRange?: {
    start: Date;
    end: Date;
  };
}

export interface BrandSearchOptions {
  query?: string;
  filters?: BrandFilters;
  sortBy?: 'name' | 'code' | 'category' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
