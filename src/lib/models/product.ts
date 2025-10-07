import { Document, ObjectId } from 'mongodb';

// Base Product Type
export type ProductType = 'virtual_digital' | 'manufactured_product' | 'sales_product' | 'consumables' | 'print_item' | 'service' | 'raw_material' | 'kit_bundle' | 'asset';

// Tracking Types
export type TrackingType = 'none' | 'serial' | 'batch';

// Common Product Interface
export interface BaseProduct extends Document {
  _id?: ObjectId;
  sku: string;
  name: string;
  description: string;
  type: ProductType;
  category: string;
  subcategory?: string;
  images: string[];
  tags: string[];
  isActive: boolean;
  
  // New tracking and service fields
  trackingType: TrackingType; // How the product is tracked (none, serial, batch)
  warrantyPeriod?: number; // Warranty period in months (optional)
  unitOfMeasure: string; // Unit of measure (e.g., 'pcs', 'kg', 'm', 'hrs', 'sqm')
  isService: boolean; // Whether this is a service item (like repair labor)
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: ObjectId;
  updatedBy: ObjectId;
}

// Virtual/Digital Product - Digital products and services
export interface VirtualDigitalProduct extends BaseProduct {
  type: 'virtual_digital';
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  unit: string;
  isDownloadable: boolean;
  downloadLimit?: number; // max downloads per purchase
  downloadExpiry?: number; // days after purchase
  fileSize?: number; // in MB
  supportedFormats: string[];
  systemRequirements?: {
    os: string[];
    software: string[];
    hardware?: string[];
  };
  licenseType: 'single_use' | 'multi_use' | 'commercial' | 'personal' | 'subscription';
  licenseDuration?: number; // in days, for subscription types
  digitalDelivery: {
    method: 'email' | 'download_link' | 'cloud_access' | 'api_access';
    automated: boolean;
    emailTemplate?: string;
  };
}

// Manufactured Product - Finished goods from production
export interface ManufacturedProduct extends BaseProduct {
  type: 'manufactured_product';
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  unit: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  brand?: string;
  model?: string;
  warranty?: {
    period: number; // months
    terms: string;
  };
  shipping?: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    requiresSpecialHandling: boolean;
  };
  manufacturing: {
    productionTime: number; // in hours
    batchSize: number;
    productionCost: number;
    materialsUsed: Array<{
      materialId: ObjectId;
      quantity: number;
      cost: number;
    }>;
    qualityControl: {
      inspectionRequired: boolean;
      inspectionSteps: string[];
      qualityStandards: string[];
    };
  };
}

// Sales Product - Regular retail products
export interface SalesProduct extends BaseProduct {
  type: 'sales_product';
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  unit: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  brand?: string;
  model?: string;
  warranty?: {
    period: number; // months
    terms: string;
  };
  shipping?: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    requiresSpecialHandling: boolean;
  };
}

// Consumables - Items that get used up or consumed
export interface Consumables extends BaseProduct {
  type: 'consumables';
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  unit: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  brand?: string;
  model?: string;
  consumptionRate: number; // units consumed per period
  shelfLife?: number; // in days
  storageRequirements?: {
    temperature?: {
      min: number;
      max: number;
    };
    humidity?: {
      min: number;
      max: number;
    };
    lightSensitive: boolean;
    requiresRefrigeration: boolean;
  };
  packaging: {
    type: 'bottle' | 'box' | 'tube' | 'sachet' | 'bulk' | 'other';
    size: string;
    unitsPerPackage: number;
  };
  usage: {
    primaryUse: string;
    compatibleEquipment?: string[];
    applicationMethod?: string;
  };
}

// Print Item - Print-on-demand products
export interface PrintItem extends BaseProduct {
  type: 'print_item';
  basePrice: number;
  costPrice: number;
  markup: number;
  isDigital: boolean;
  printComplexity: 'simple' | 'medium' | 'complex';
  printTime: number; // in minutes
  printMaterials: string[];
  printSettings: {
    resolution: number;
    colorMode: 'color' | 'black_white' | 'grayscale';
    paperType: string;
    paperWeight?: number;
    finish?: 'matte' | 'glossy' | 'satin';
  };
  printSpecifications: PrintSpecification[];
  printOptions: PrintOption[];
  customizationOptions: {
    allowText: boolean;
    allowImages: boolean;
    allowLogos: boolean;
    textLimit?: number;
    imageFormats?: string[];
  };
  qualitySettings: {
    standardResolution: number;
    highResolution: number;
    proofRequired: boolean;
  };
}

// Service - Service-based offerings
export interface Service extends BaseProduct {
  type: 'service';
  basePrice: number;
  hourlyRate?: number;
  duration: number; // in hours
  isRecurring: boolean;
  recurringInterval?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  serviceCategory: 'consultation' | 'design' | 'installation' | 'maintenance' | 'support' | 'other';
  serviceOptions: ServiceOption[];
  requirements: string[];
  deliverables: string[];
  skillsRequired: string[];
  equipmentRequired?: string[];
  locationRequirements?: {
    onSite: boolean;
    remote: boolean;
    travelRequired: boolean;
    travelRadius?: number; // in miles/km
  };
  scheduling: {
    advanceBookingRequired: boolean;
    minAdvanceNotice: number; // in hours
    maxAdvanceBooking: number; // in days
    availableSlots: Array<{
      day: string;
      startTime: string;
      endTime: string;
    }>;
  };
}

// Raw Material - Materials used in production
export interface RawMaterial extends BaseProduct {
  type: 'raw_material';
  cost: number;
  stock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  unit: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  supplier: ObjectId;
  materialType: 'paper' | 'ink' | 'toner' | 'fabric' | 'metal' | 'plastic' | 'chemical' | 'other';
  specifications: {
    grade?: string;
    quality?: string;
    color?: string;
    finish?: string;
    thickness?: number;
    density?: number;
    [key: string]: any;
  };
  storage: {
    temperature?: {
      min: number;
      max: number;
    };
    humidity?: {
      min: number;
      max: number;
    };
    requiresSpecialStorage: boolean;
    shelfLife?: number; // in days
    batchTracking: boolean;
  };
  usage: {
    primaryUse: string;
    compatibleProducts: ObjectId[];
    consumptionRate: number; // per unit of finished product
  };
}

// Kit/Bundle - Product bundles
export interface KitBundle extends BaseProduct {
  type: 'kit_bundle';
  basePrice: number;
  costPrice: number;
  markup: number;
  components: BundleComponent[];
  isConfigurable: boolean;
  configurationRules?: {
    minComponents: number;
    maxComponents: number;
    requiredComponents: ObjectId[];
    optionalComponents: ObjectId[];
  };
  packaging: {
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    weight: number;
    packagingType: 'box' | 'envelope' | 'tube' | 'custom';
  };
  assembly: {
    requiresAssembly: boolean;
    assemblyTime: number; // in minutes
    assemblyInstructions?: string;
    assemblyTools?: string[];
  };
}

// Asset - Fixed assets and capital goods
export interface Asset extends BaseProduct {
  type: 'asset';
  purchasePrice: number;
  currentValue: number;
  depreciationMethod: 'straight_line' | 'declining_balance' | 'sum_of_years' | 'none';
  usefulLife: number; // in years
  depreciationRate: number; // percentage per year
  location: {
    branch: ObjectId;
    department?: string;
    room?: string;
    assetTag?: string;
  };
  specifications: {
    manufacturer?: string;
    model?: string;
    serialNumber?: string;
    purchaseDate: Date;
    warrantyExpiry?: Date;
    condition: 'excellent' | 'good' | 'fair' | 'poor' | 'needs_repair';
  };
  maintenance: {
    maintenanceSchedule: 'monthly' | 'quarterly' | 'annually' | 'as_needed';
    lastMaintenance?: Date;
    nextMaintenance?: Date;
    maintenanceHistory: Array<{
      date: Date;
      type: string;
      cost: number;
      description: string;
      performedBy: string;
    }>;
  };
  insurance: {
    insured: boolean;
    policyNumber?: string;
    coverageAmount?: number;
    expiryDate?: Date;
  };
}

// Union type for all products
export type Product = VirtualDigitalProduct | ManufacturedProduct | SalesProduct | Consumables | PrintItem | Service | RawMaterial | KitBundle | Asset;

// Supporting Types
export interface PrintSpecification {
  id: string;
  name: string;
  description: string;
  category: 'paper' | 'finishing' | 'size' | 'color' | 'binding' | 'other';
  options: PrintOption[];
  isRequired: boolean;
  defaultValue?: string;
}

export interface PrintOption {
  id: string;
  name: string;
  description?: string;
  priceAdjustment: number;
  isDefault: boolean;
  specifications?: {
    [key: string]: string | number;
  };
}

export interface ServiceOption {
  id: string;
  name: string;
  description?: string;
  priceAdjustment: number;
  durationAdjustment?: number; // in hours
  isDefault: boolean;
}

export interface BundleComponent {
  id: string;
  productId: ObjectId;
  productName: string;
  quantity: number;
  isRequired: boolean;
  priceAdjustment: number; // Can be positive or negative
  notes?: string;
}

// Create/Update Data Types
export interface CreateProductData {
  sku: string;
  name: string;
  description: string;
  type: ProductType;
  category: string;
  subcategory?: string;
  images: string[];
  tags: string[];
  createdBy: ObjectId;
  
  // Type-specific data
  virtualDigitalData?: Partial<VirtualDigitalProduct>;
  manufacturedData?: Partial<ManufacturedProduct>;
  salesData?: Partial<SalesProduct>;
  consumablesData?: Partial<Consumables>;
  printData?: Partial<PrintItem>;
  serviceData?: Partial<Service>;
  materialData?: Partial<RawMaterial>;
  kitData?: Partial<KitBundle>;
  assetData?: Partial<Asset>;
}

export interface UpdateProductData {
  sku?: string;
  name?: string;
  description?: string;
  type?: ProductType;
  category?: string;
  subcategory?: string;
  images?: string[];
  tags?: string[];
  isActive?: boolean;
  updatedBy: ObjectId;
  
  // Type-specific data
  virtualDigitalData?: Partial<VirtualDigitalProduct>;
  manufacturedData?: Partial<ManufacturedProduct>;
  salesData?: Partial<SalesProduct>;
  consumablesData?: Partial<Consumables>;
  printData?: Partial<PrintItem>;
  serviceData?: Partial<Service>;
  materialData?: Partial<RawMaterial>;
  kitData?: Partial<KitBundle>;
  assetData?: Partial<Asset>;
}

// Product Analytics
export interface ProductAnalytics {
  productId: ObjectId;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate: Date;
  metrics: {
    totalSales: number;
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    stockTurnover: number;
    profitMargin: number;
    customerSatisfaction?: number;
    returnRate?: number;
  };
  trends: {
    salesGrowth: number;
    revenueGrowth: number;
    orderGrowth: number;
    stockMovement: number;
  };
  insights: string[];
  recommendations: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Product Search and Filter Types
export interface ProductFilters {
  type?: ProductType[];
  category?: string[];
  subcategory?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock' | 'all';
  isActive?: boolean;
  tags?: string[];
  createdDateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ProductSearchOptions {
  query?: string;
  filters?: ProductFilters;
  sortBy?: 'name' | 'sku' | 'price' | 'stock' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}