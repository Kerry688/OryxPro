// Enhanced product models with tracking, warranty, and service fields

export type TrackingType = 'none' | 'serial' | 'batch';
export type UnitOfMeasure = 
  | 'piece' | 'kg' | 'g' | 'lb' | 'oz'
  | 'm' | 'cm' | 'mm' | 'ft' | 'in'
  | 'l' | 'ml' | 'gal' | 'qt' | 'pt'
  | 'm2' | 'ft2' | 'm3' | 'ft3'
  | 'hour' | 'day' | 'week' | 'month' | 'year'
  | 'service' | 'license' | 'subscription';

export type ProductStatus = 'active' | 'inactive' | 'discontinued' | 'draft';
export type ProductType = 'sale_item' | 'print_item' | 'service_item' | 'bundle' | 'digital' | 'consumable';

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'mm' | 'cm' | 'm' | 'in' | 'ft';
}

export interface ProductWeight {
  value: number;
  unit: 'g' | 'kg' | 'lb' | 'oz';
}

export interface WarrantyInfo {
  period: number; // in months
  type: 'manufacturer' | 'extended' | 'service' | 'none';
  description?: string;
  terms?: string;
  coverage?: string[];
  exclusions?: string[];
}

export interface TrackingInfo {
  type: TrackingType;
  serialNumberFormat?: string; // e.g., "SN-YYYY-NNNN"
  batchNumberFormat?: string; // e.g., "B-YYYY-MM-NNN"
  requiresSerialNumber?: boolean;
  requiresBatchNumber?: boolean;
  autoGenerate?: boolean;
}

export interface ServiceInfo {
  isService: boolean;
  serviceType?: 'labor' | 'consultation' | 'maintenance' | 'repair' | 'installation' | 'training' | 'support';
  serviceCategory?: string;
  serviceDuration?: number; // in hours
  serviceLocation?: 'on-site' | 'in-house' | 'remote' | 'customer-location';
  serviceRequirements?: string[];
  serviceSkills?: string[];
  hourlyRate?: number;
  minimumHours?: number;
  maximumHours?: number;
}

export interface InventoryInfo {
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  reorderPoint: number;
  reorderQuantity: number;
  leadTime: number; // in days
  supplier?: string;
  supplierPartNumber?: string;
  lastRestocked?: Date;
  nextRestockDate?: Date;
}

export interface PricingInfo {
  basePrice: number;
  costPrice: number;
  markup: number; // percentage
  margin: number; // percentage
  taxRate: number; // percentage
  discountAllowed: boolean;
  maxDiscount?: number; // percentage
  bulkPricing?: {
    quantity: number;
    price: number;
    discount: number;
  }[];
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  isPrimary: boolean;
  order: number;
  uploadedAt: Date;
}

export interface ProductDocument {
  id: string;
  name: string;
  type: 'manual' | 'specification' | 'certificate' | 'warranty' | 'other';
  url: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface ProductTag {
  id: string;
  name: string;
  color: string;
  category?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  attributes: Record<string, string>; // e.g., { color: 'red', size: 'large' }
  price: number;
  cost: number;
  stock: number;
  isActive: boolean;
  images?: string[];
}

export interface EnhancedProduct {
  _id?: string;
  
  // Basic Information
  sku: string;
  slug: string;
  name: string;
  description: string;
  longDescription?: string;
  categoryId: string;
  categoryName?: string;
  brandId?: string;
  brandName?: string;
  
  // Product Classification
  type: ProductType;
  status: ProductStatus;
  isActive: boolean;
  isDigital: boolean;
  
  // Tracking Information
  tracking: TrackingInfo;
  
  // Physical Properties
  dimensions?: ProductDimensions;
  weight?: ProductWeight;
  unitOfMeasure: UnitOfMeasure;
  
  // Warranty Information
  warranty?: WarrantyInfo;
  
  // Service Information
  service: ServiceInfo;
  
  // Inventory Information
  inventory: InventoryInfo;
  
  // Pricing Information
  pricing: PricingInfo;
  
  // Media and Documents
  images: ProductImage[];
  documents: ProductDocument[];
  
  // Organization
  tags: ProductTag[];
  variants?: ProductVariant[];
  
  // Relationships
  supplierId?: string;
  supplierName?: string;
  parentProductId?: string; // For bundles or product families
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  version: number;
}

export interface CreateProductData {
  sku: string;
  name: string;
  description: string;
  longDescription?: string;
  categoryId: string;
  brandId?: string;
  type: ProductType;
  status: ProductStatus;
  isActive: boolean;
  isDigital: boolean;
  tracking: TrackingInfo;
  dimensions?: ProductDimensions;
  weight?: ProductWeight;
  unitOfMeasure: UnitOfMeasure;
  warranty?: WarrantyInfo;
  service: ServiceInfo;
  inventory: InventoryInfo;
  pricing: PricingInfo;
  tags?: string[];
  supplierId?: string;
  parentProductId?: string;
  createdBy: string;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  longDescription?: string;
  categoryId?: string;
  brandId?: string;
  type?: ProductType;
  status?: ProductStatus;
  isActive?: boolean;
  isDigital?: boolean;
  tracking?: TrackingInfo;
  dimensions?: ProductDimensions;
  weight?: ProductWeight;
  unitOfMeasure?: UnitOfMeasure;
  warranty?: WarrantyInfo;
  service?: ServiceInfo;
  inventory?: InventoryInfo;
  pricing?: PricingInfo;
  tags?: string[];
  supplierId?: string;
  parentProductId?: string;
  updatedBy: string;
}

export interface ProductFilters {
  categoryId?: string;
  brandId?: string;
  type?: ProductType[];
  status?: ProductStatus[];
  isActive?: boolean;
  isDigital?: boolean;
  isService?: boolean;
  trackingType?: TrackingType[];
  hasWarranty?: boolean;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  lowStock?: boolean;
  tags?: string[];
  supplierId?: string;
}

export interface ProductSearchOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: ProductFilters;
}

export interface ProductAnalytics {
  totalProducts: number;
  productsByType: Record<ProductType, number>;
  productsByStatus: Record<ProductStatus, number>;
  productsByCategory: Array<{
    categoryId: string;
    categoryName: string;
    count: number;
  }>;
  inventoryValue: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  serviceProducts: number;
  warrantyProducts: number;
  averagePrice: number;
  topSellingProducts: Array<{
    productId: string;
    productName: string;
    sales: number;
    revenue: number;
  }>;
  slowMovingProducts: Array<{
    productId: string;
    productName: string;
    daysSinceLastSale: number;
    stockLevel: number;
  }>;
}

// Serial Number and Batch Tracking Models
export interface SerialNumber {
  _id?: string;
  productId: string;
  productName: string;
  serialNumber: string;
  batchNumber?: string;
  status: 'available' | 'sold' | 'returned' | 'defective' | 'recalled';
  purchaseDate?: Date;
  saleDate?: Date;
  customerId?: string;
  customerName?: string;
  warrantyStartDate?: Date;
  warrantyEndDate?: Date;
  location?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Batch {
  _id?: string;
  productId: string;
  productName: string;
  batchNumber: string;
  quantity: number;
  receivedDate: Date;
  expiryDate?: Date;
  supplierId?: string;
  supplierName?: string;
  costPerUnit: number;
  totalCost: number;
  status: 'received' | 'in_stock' | 'sold_out' | 'expired' | 'recalled';
  location?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TrackingRecord {
  _id?: string;
  productId: string;
  productName: string;
  trackingType: TrackingType;
  serialNumber?: string;
  batchNumber?: string;
  action: 'received' | 'sold' | 'returned' | 'transferred' | 'defective' | 'recalled';
  quantity: number;
  fromLocation?: string;
  toLocation?: string;
  customerId?: string;
  customerName?: string;
  orderId?: string;
  notes?: string;
  performedBy: string;
  performedAt: Date;
}

