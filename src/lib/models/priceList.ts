import { Document, ObjectId } from 'mongodb';

// Price List Types
export type PriceListType = 'standard' | 'bulk' | 'promotional' | 'wholesale' | 'retail' | 'seasonal';
export type PriceListStatus = 'active' | 'inactive' | 'draft' | 'archived';

// Price List Item
export interface PriceListItem {
  productId: ObjectId;
  productName: string;
  productSku: string;
  basePrice: number;
  price: number;
  discountPercentage?: number;
  discountAmount?: number;
  minQuantity?: number;
  maxQuantity?: number;
  effectiveDate?: Date;
  expiryDate?: Date;
  notes?: string;
  isActive: boolean;
}

// Price List
export interface PriceList extends Document {
  _id?: ObjectId;
  name: string;
  code: string; // Unique identifier for the price list
  description?: string;
  type: PriceListType;
  status: PriceListStatus;
  
  // Pricing rules
  currency: string;
  taxInclusive: boolean;
  taxRate?: number;
  
  // Validity period
  validFrom: Date;
  validTo?: Date;
  
  // Customer targeting
  customerSegments?: ObjectId[]; // Array of customer segment IDs
  customerTypes?: string[]; // e.g., ['retail', 'wholesale', 'vip']
  minimumOrderValue?: number;
  
  // Geographic restrictions
  regions?: string[]; // e.g., ['US', 'CA', 'EU']
  countries?: string[];
  
  // Product targeting
  productCategories?: string[];
  productTags?: string[];
  includeProducts?: ObjectId[]; // Specific products to include
  excludeProducts?: ObjectId[]; // Specific products to exclude
  
  // Price list items
  items: PriceListItem[];
  
  // Metadata
  isActive: boolean;
  isDefault: boolean;
  priority: number; // Higher priority overrides lower priority
  createdAt: Date;
  updatedAt: Date;
  createdBy: ObjectId;
  updatedBy: ObjectId;
}

// Price List Creation Data
export interface CreatePriceListData {
  name: string;
  code: string;
  description?: string;
  type: PriceListType;
  status?: PriceListStatus;
  currency: string;
  taxInclusive: boolean;
  taxRate?: number;
  validFrom: Date;
  validTo?: Date;
  customerSegments?: ObjectId[];
  customerTypes?: string[];
  minimumOrderValue?: number;
  regions?: string[];
  countries?: string[];
  productCategories?: string[];
  productTags?: string[];
  includeProducts?: ObjectId[];
  excludeProducts?: ObjectId[];
  items: Omit<PriceListItem, 'productName' | 'productSku'>[];
  isDefault?: boolean;
  priority?: number;
  createdBy: ObjectId;
}

// Price List Update Data
export interface UpdatePriceListData {
  name?: string;
  code?: string;
  description?: string;
  type?: PriceListType;
  status?: PriceListStatus;
  currency?: string;
  taxInclusive?: boolean;
  taxRate?: number;
  validFrom?: Date;
  validTo?: Date;
  customerSegments?: ObjectId[];
  customerTypes?: string[];
  minimumOrderValue?: number;
  regions?: string[];
  countries?: string[];
  productCategories?: string[];
  productTags?: string[];
  includeProducts?: ObjectId[];
  excludeProducts?: ObjectId[];
  items?: Omit<PriceListItem, 'productName' | 'productSku'>[];
  isActive?: boolean;
  isDefault?: boolean;
  priority?: number;
  updatedBy: ObjectId;
}

// Bulk Price Update Data
export interface BulkPriceUpdateData {
  priceListId: ObjectId;
  updates: Array<{
    productId: ObjectId;
    price?: number;
    discountPercentage?: number;
    discountAmount?: number;
    minQuantity?: number;
    maxQuantity?: number;
    effectiveDate?: Date;
    expiryDate?: Date;
    notes?: string;
    isActive?: boolean;
  }>;
  updatedBy: ObjectId;
}

// Price List Filters
export interface PriceListFilters {
  type?: PriceListType[];
  status?: PriceListStatus[];
  currency?: string[];
  isActive?: boolean;
  isDefault?: boolean;
  validDate?: Date;
  createdDateRange?: {
    start: Date;
    end: Date;
  };
}

// Price List Search Options
export interface PriceListSearchOptions {
  query?: string;
  filters?: PriceListFilters;
  sortBy?: 'name' | 'code' | 'type' | 'status' | 'createdAt' | 'updatedAt' | 'priority';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Price List Analytics
export interface PriceListAnalytics {
  priceListId: ObjectId;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate: Date;
  metrics: {
    totalProducts: number;
    averageDiscount: number;
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    conversionRate: number;
  };
  topProducts: Array<{
    productId: ObjectId;
    productName: string;
    sku: string;
    revenue: number;
    orders: number;
    averagePrice: number;
  }>;
  insights: string[];
  recommendations: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Price List Template
export interface PriceListTemplate {
  _id?: ObjectId;
  name: string;
  description?: string;
  type: PriceListType;
  defaultSettings: {
    currency: string;
    taxInclusive: boolean;
    taxRate?: number;
    customerTypes?: string[];
    regions?: string[];
    countries?: string[];
  };
  pricingRules: {
    defaultDiscountPercentage?: number;
    bulkDiscountTiers?: Array<{
      minQuantity: number;
      maxQuantity?: number;
      discountPercentage: number;
    }>;
    seasonalAdjustments?: Array<{
      month: number;
      adjustmentPercentage: number;
    }>;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: ObjectId;
  updatedBy: ObjectId;
}

// Price Comparison
export interface PriceComparison {
  productId: ObjectId;
  productName: string;
  productSku: string;
  basePrice: number;
  priceLists: Array<{
    priceListId: ObjectId;
    priceListName: string;
    price: number;
    discountPercentage?: number;
    validFrom: Date;
    validTo?: Date;
  }>;
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
  priceVariance: number;
}

// Price History
export interface PriceHistory {
  _id?: ObjectId;
  productId: ObjectId;
  priceListId?: ObjectId;
  oldPrice: number;
  newPrice: number;
  changeType: 'increase' | 'decrease' | 'new';
  changePercentage: number;
  changeAmount: number;
  reason?: string;
  effectiveDate: Date;
  createdBy: ObjectId;
  createdAt: Date;
}
