import { Document, ObjectId } from 'mongodb';

export interface Store extends Document {
  _id?: ObjectId;
  name: string;
  code: string;
  type: 'retail' | 'wholesale' | 'online' | 'popup' | 'warehouse' | 'showroom';
  branchId: ObjectId;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  manager: ObjectId; // User ID
  staff: ObjectId[]; // Array of User IDs
  operatingHours: {
    monday: { open: string; close: string; isOpen: boolean };
    tuesday: { open: string; close: string; isOpen: boolean };
    wednesday: { open: string; close: string; isOpen: boolean };
    thursday: { open: string; close: string; isOpen: boolean };
    friday: { open: string; close: string; isOpen: boolean };
    saturday: { open: string; close: string; isOpen: boolean };
    sunday: { open: string; close: string; isOpen: boolean };
  };
  features: string[]; // e.g., ['pos_system', 'inventory_tracking', 'customer_service', 'returns']
  services: string[]; // e.g., ['printing', 'design', 'shipping', 'pickup']
  paymentMethods: string[]; // e.g., ['cash', 'card', 'digital_wallet', 'store_credit']
  settings: {
    allowReturns: boolean;
    returnPeriod: number; // days
    allowExchanges: boolean;
    exchangePeriod: number; // days
    requireReceipt: boolean;
    maxDiscountPercentage: number;
    loyaltyProgramEnabled: boolean;
    inventorySync: boolean;
    autoReorder: boolean;
    lowStockThreshold: number;
  };
  metrics: {
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
    customerCount: number;
    inventoryValue: number;
    stockTurnover: number;
    lastUpdated: Date;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: ObjectId;
  updatedBy: ObjectId;
}

export interface CreateStoreData {
  name: string;
  code: string;
  type: 'retail' | 'wholesale' | 'online' | 'popup' | 'warehouse' | 'showroom';
  branchId: ObjectId;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  manager: ObjectId;
  staff: ObjectId[];
  operatingHours: {
    monday: { open: string; close: string; isOpen: boolean };
    tuesday: { open: string; close: string; isOpen: boolean };
    wednesday: { open: string; close: string; isOpen: boolean };
    thursday: { open: string; close: string; isOpen: boolean };
    friday: { open: string; close: string; isOpen: boolean };
    saturday: { open: string; close: string; isOpen: boolean };
    sunday: { open: string; close: string; isOpen: boolean };
  };
  features: string[];
  services: string[];
  paymentMethods: string[];
  settings: {
    allowReturns: boolean;
    returnPeriod: number;
    allowExchanges: boolean;
    exchangePeriod: number;
    requireReceipt: boolean;
    maxDiscountPercentage: number;
    loyaltyProgramEnabled: boolean;
    inventorySync: boolean;
    autoReorder: boolean;
    lowStockThreshold: number;
  };
  createdBy: ObjectId;
}

export interface UpdateStoreData {
  name?: string;
  code?: string;
  type?: 'retail' | 'wholesale' | 'online' | 'popup' | 'warehouse' | 'showroom';
  branchId?: ObjectId;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contact?: {
    phone: string;
    email: string;
    website?: string;
  };
  manager?: ObjectId;
  staff?: ObjectId[];
  operatingHours?: {
    monday: { open: string; close: string; isOpen: boolean };
    tuesday: { open: string; close: string; isOpen: boolean };
    wednesday: { open: string; close: string; isOpen: boolean };
    thursday: { open: string; close: string; isOpen: boolean };
    friday: { open: string; close: string; isOpen: boolean };
    saturday: { open: string; close: string; isOpen: boolean };
    sunday: { open: string; close: string; isOpen: boolean };
  };
  features?: string[];
  services?: string[];
  paymentMethods?: string[];
  settings?: {
    allowReturns: boolean;
    returnPeriod: number;
    allowExchanges: boolean;
    exchangePeriod: number;
    requireReceipt: boolean;
    maxDiscountPercentage: number;
    loyaltyProgramEnabled: boolean;
    inventorySync: boolean;
    autoReorder: boolean;
    lowStockThreshold: number;
  };
  metrics?: {
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
    customerCount: number;
    inventoryValue: number;
    stockTurnover: number;
    lastUpdated: Date;
  };
  isActive?: boolean;
  updatedBy: ObjectId;
}

export interface StorePerformance {
  storeId: ObjectId;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate: Date;
  metrics: {
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
    newCustomers: number;
    returningCustomers: number;
    topSellingProducts: Array<{
      productId: ObjectId;
      productName: string;
      quantitySold: number;
      revenue: number;
    }>;
    salesByHour: Array<{
      hour: number;
      sales: number;
      orders: number;
    }>;
    salesByDay: Array<{
      day: string;
      sales: number;
      orders: number;
    }>;
    inventoryTurnover: number;
    stockOutEvents: number;
    returnRate: number;
    customerSatisfaction: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface StoreAnalytics {
  storeId: ObjectId;
  dateRange: {
    start: Date;
    end: Date;
  };
  summary: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    totalCustomers: number;
    inventoryValue: number;
    stockTurnover: number;
    topCategories: Array<{
      category: string;
      revenue: number;
      orders: number;
    }>;
    peakHours: Array<{
      hour: number;
      sales: number;
    }>;
    busiestDays: Array<{
      day: string;
      sales: number;
    }>;
  };
  trends: {
    salesGrowth: number;
    orderGrowth: number;
    customerGrowth: number;
    inventoryGrowth: number;
  };
  insights: string[];
  recommendations: string[];
  createdAt: Date;
}
