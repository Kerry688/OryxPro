export type CustomizationChoice = {
  id: string;
  name: string;
  priceModifier: number; // can be positive or negative
};

export type CustomizationOption = {
  id: string;
  name: string;
  type: 'select' | 'quantity';
  defaultValue: string | number;
  choices?: CustomizationChoice[];
};

export type ProductCategory = {
  id: string;
  name: string;
  description: string;
  slug: string;
  parentId?: string;
  isActive: boolean;
  sortOrder: number;
  level: number; // Tree level (0 for root categories)
  path: string; // Full path like "Electronics > Computers > Laptops"
  children?: ProductCategory[]; // For tree structure
  productCount: number; // Number of products in this category
  createdAt: string;
  updatedAt: string;
};

export type Supplier = {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
};

// Product Types
export type ProductType = 'sale_item' | 'print_item' | 'service_item' | 'bundle';

// Print Specifications
export type PrintSpecification = {
  id: string;
  name: string;
  description: string;
  category: 'paper' | 'finishing' | 'size' | 'color' | 'binding' | 'other';
  options: PrintOption[];
  isRequired: boolean;
  defaultValue?: string;
};

export type PrintOption = {
  id: string;
  name: string;
  description?: string;
  priceAdjustment: number; // Can be positive or negative
  isDefault: boolean;
  specifications?: {
    [key: string]: string | number;
  };
};

// Service Specifications
export type ServiceSpecification = {
  id: string;
  name: string;
  description: string;
  category: 'duration' | 'complexity' | 'location' | 'equipment' | 'other';
  options: ServiceOption[];
  isRequired: boolean;
  defaultValue?: string;
};

export type ServiceOption = {
  id: string;
  name: string;
  description?: string;
  priceAdjustment: number;
  durationAdjustment?: number; // in hours
  isDefault: boolean;
};

// Bundle Components
export type BundleComponent = {
  id: string;
  productId: string;
  quantity: number;
  isRequired: boolean;
  priceAdjustment: number; // Can be positive or negative
  notes?: string;
};

export type Product = {
  id: string;
  sku: string; // Stock Keeping Unit
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  imageId: string;
  categoryId: string;
  supplierId?: string;
  basePrice: number; // Selling price
  costPrice: number; // Cost from supplier
  markup: number; // Percentage markup
  minStockLevel: number;
  maxStockLevel: number;
  reorderPoint: number;
  isActive: boolean;
  isDigital: boolean; // For print-on-demand vs physical products
  weight?: number; // in grams
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  options: CustomizationOption[];
  
  // Product Type specific fields
  type: ProductType;
  
  // Print Item specific fields
  printSpecifications?: PrintSpecification[];
  printTime?: number; // in hours
  printComplexity?: 'simple' | 'medium' | 'complex';
  printEquipment?: string[];
  
  // Service Item specific fields
  serviceSpecifications?: ServiceSpecification[];
  serviceDuration?: number; // in hours
  serviceCategory?: string;
  serviceLocation?: 'on-site' | 'in-house' | 'remote';
  
  // Bundle specific fields
  bundleComponents?: BundleComponent[];
  bundleDiscount?: number; // percentage discount for bundle
  
  // Sale Item specific fields (no additional fields needed)
  
  createdAt: string;
  updatedAt: string;
};

// Branch and Warehouse Management Types
export type Branch = {
  id: string;
  name: string;
  code: string; // Short code for the branch (e.g., "NYC", "LAX")
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  manager: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Warehouse = {
  id: string;
  branchId: string;
  name: string;
  code: string; // Short code for the warehouse (e.g., "MAIN", "STORAGE")
  address: string;
  type: 'main' | 'storage' | 'retail' | 'distribution';
  capacity: number; // Maximum storage capacity
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// Legacy type for backward compatibility
export type StockLocation = Warehouse;

// Purchase Order Types
export type PurchaseOrderStatus = 'draft' | 'pending' | 'approved' | 'ordered' | 'partial' | 'received' | 'completed' | 'cancelled';

export type PurchaseOrderItem = {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity: number;
  notes?: string;
};

export type PurchaseOrder = {
  id: string;
  poNumber: string;
  supplierId: string;
  branchId: string;
  warehouseId: string;
  status: PurchaseOrderStatus;
  orderDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

// Goods Receipt Types
export type GoodsReceiptStatus = 'draft' | 'received' | 'verified' | 'completed';

export type GoodsReceiptItem = {
  id: string;
  productId: string;
  orderedQuantity: number;
  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
};

export type GoodsReceipt = {
  id: string;
  grNumber: string;
  purchaseOrderId: string;
  branchId: string;
  warehouseId: string;
  status: GoodsReceiptStatus;
  receivedDate: string;
  receivedBy: string;
  verifiedBy?: string;
  items: GoodsReceiptItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

// Issue/Consumption Types
export type IssueType = 'department' | 'project' | 'customer' | 'production' | 'maintenance';

export type IssueStatus = 'draft' | 'approved' | 'issued' | 'completed';

export type IssueItem = {
  id: string;
  productId: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  notes?: string;
};

export type Issue = {
  id: string;
  issueNumber: string;
  branchId: string;
  warehouseId: string;
  type: IssueType;
  status: IssueStatus;
  department?: string;
  project?: string;
  customerId?: string;
  issueDate: string;
  issuedBy: string;
  approvedBy?: string;
  items: IssueItem[];
  totalCost: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

// Returns/Refunds Types
export type ReturnType = 'purchase_return' | 'sales_return' | 'damaged' | 'expired' | 'defective';

export type ReturnStatus = 'draft' | 'approved' | 'received' | 'processed' | 'completed';

export type ReturnItem = {
  id: string;
  productId: string;
  quantity: number;
  reason: string;
  condition: 'good' | 'damaged' | 'defective' | 'expired';
  unitPrice: number;
  totalPrice: number;
  notes?: string;
};

export type Return = {
  id: string;
  returnNumber: string;
  type: ReturnType;
  status: ReturnStatus;
  branchId: string;
  warehouseId: string;
  supplierId?: string;
  customerId?: string;
  originalOrderId?: string; // PO or SO reference
  returnDate: string;
  receivedBy: string;
  approvedBy?: string;
  items: ReturnItem[];
  totalValue: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

// Transfer Order Types
export type TransferStatus = 'draft' | 'approved' | 'in_transit' | 'received' | 'completed' | 'cancelled';

export type TransferItem = {
  id: string;
  productId: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  notes?: string;
};

export type TransferOrder = {
  id: string;
  transferNumber: string;
  fromBranchId: string;
  fromWarehouseId: string;
  toBranchId: string;
  toWarehouseId: string;
  status: TransferStatus;
  transferDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  items: TransferItem[];
  totalValue: number;
  notes?: string;
  createdBy: string;
  approvedBy?: string;
  receivedBy?: string;
  createdAt: string;
  updatedAt: string;
};

// Enhanced Stock Movement Type
export type StockMovement = {
  id: string;
  productId: string;
  branchId: string;
  locationId: string; // Warehouse ID
  type: 'inbound' | 'outbound' | 'adjustment' | 'transfer' | 'issue' | 'return' | 'receipt';
  quantity: number;
  reference: string; // PO number, SO number, etc.
  referenceId?: string; // ID of the related document
  notes?: string;
  createdAt: string;
  createdBy: string;
};

export type StockLevel = {
  id: string;
  productId: string;
  branchId: string;
  locationId: string; // Warehouse ID
  quantity: number;
  reservedQuantity: number; // For pending orders
  availableQuantity: number; // quantity - reservedQuantity
  lastUpdated: string;
};

// Sample Data
export const categories: ProductCategory[] = [
  // Root Categories (Level 0)
  {
    id: 'cat_001',
    name: 'Printing Services',
    description: 'All printing and design services',
    slug: 'printing-services',
    isActive: true,
    sortOrder: 1,
    level: 0,
    path: 'Printing Services',
    productCount: 15,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat_002',
    name: 'Marketing Materials',
    description: 'Promotional and marketing materials',
    slug: 'marketing-materials',
    isActive: true,
    sortOrder: 2,
    level: 0,
    path: 'Marketing Materials',
    productCount: 8,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat_003',
    name: 'Office Supplies',
    description: 'Office and business supplies',
    slug: 'office-supplies',
    isActive: true,
    sortOrder: 3,
    level: 0,
    path: 'Office Supplies',
    productCount: 12,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat_004',
    name: 'Services',
    description: 'Professional services',
    slug: 'services',
    isActive: true,
    sortOrder: 4,
    level: 0,
    path: 'Services',
    productCount: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // Sub-categories (Level 1)
  {
    id: 'cat_005',
    name: 'Business Cards',
    description: 'Professional business cards and name cards',
    slug: 'business-cards',
    parentId: 'cat_001',
    isActive: true,
    sortOrder: 1,
    level: 1,
    path: 'Printing Services > Business Cards',
    productCount: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat_006',
    name: 'Large Format',
    description: 'Banners, posters, and large format printing',
    slug: 'large-format',
    parentId: 'cat_001',
    isActive: true,
    sortOrder: 2,
    level: 1,
    path: 'Printing Services > Large Format',
    productCount: 6,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat_007',
    name: 'Digital Printing',
    description: 'Digital printing services',
    slug: 'digital-printing',
    parentId: 'cat_001',
    isActive: true,
    sortOrder: 3,
    level: 1,
    path: 'Printing Services > Digital Printing',
    productCount: 4,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat_008',
    name: 'Flyers & Brochures',
    description: 'Marketing flyers and brochures',
    slug: 'flyers-brochures',
    parentId: 'cat_002',
    isActive: true,
    sortOrder: 1,
    level: 1,
    path: 'Marketing Materials > Flyers & Brochures',
    productCount: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat_009',
    name: 'Promotional Items',
    description: 'Promotional products and giveaways',
    slug: 'promotional-items',
    parentId: 'cat_002',
    isActive: true,
    sortOrder: 2,
    level: 1,
    path: 'Marketing Materials > Promotional Items',
    productCount: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat_010',
    name: 'Writing Instruments',
    description: 'Pens, pencils, and writing tools',
    slug: 'writing-instruments',
    parentId: 'cat_003',
    isActive: true,
    sortOrder: 1,
    level: 1,
    path: 'Office Supplies > Writing Instruments',
    productCount: 7,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat_011',
    name: 'Paper Products',
    description: 'Paper and stationery products',
    slug: 'paper-products',
    parentId: 'cat_003',
    isActive: true,
    sortOrder: 2,
    level: 1,
    path: 'Office Supplies > Paper Products',
    productCount: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat_012',
    name: 'Design Services',
    description: 'Graphic design and creative services',
    slug: 'design-services',
    parentId: 'cat_004',
    isActive: true,
    sortOrder: 1,
    level: 1,
    path: 'Services > Design Services',
    productCount: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat_013',
    name: 'Consulting',
    description: 'Business and marketing consulting',
    slug: 'consulting',
    parentId: 'cat_004',
    isActive: true,
    sortOrder: 2,
    level: 1,
    path: 'Services > Consulting',
    productCount: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // Sub-sub-categories (Level 2)
  {
    id: 'cat_014',
    name: 'Premium Business Cards',
    description: 'High-end business cards with special finishes',
    slug: 'premium-business-cards',
    parentId: 'cat_005',
    isActive: true,
    sortOrder: 1,
    level: 2,
    path: 'Printing Services > Business Cards > Premium Business Cards',
    productCount: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat_015',
    name: 'Standard Business Cards',
    description: 'Standard business cards',
    slug: 'standard-business-cards',
    parentId: 'cat_005',
    isActive: true,
    sortOrder: 2,
    level: 2,
    path: 'Printing Services > Business Cards > Standard Business Cards',
    productCount: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat_016',
    name: 'Vinyl Banners',
    description: 'Durable vinyl banners for outdoor use',
    slug: 'vinyl-banners',
    parentId: 'cat_006',
    isActive: true,
    sortOrder: 1,
    level: 2,
    path: 'Printing Services > Large Format > Vinyl Banners',
    productCount: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat_017',
    name: 'Fabric Banners',
    description: 'Lightweight fabric banners',
    slug: 'fabric-banners',
    parentId: 'cat_006',
    isActive: true,
    sortOrder: 2,
    level: 2,
    path: 'Printing Services > Large Format > Fabric Banners',
    productCount: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const suppliers: Supplier[] = [
  {
    id: 'sup_001',
    name: 'Premium Paper Co.',
    contactPerson: 'John Smith',
    email: 'john@premiumpaper.com',
    phone: '+1-555-0123',
    address: '123 Paper Street, Print City, PC 12345',
    isActive: true,
  },
  {
    id: 'sup_002',
    name: 'Vinyl Solutions Ltd.',
    contactPerson: 'Sarah Johnson',
    email: 'sarah@vinylsolutions.com',
    phone: '+1-555-0456',
    address: '456 Vinyl Avenue, Banner Town, BT 67890',
    isActive: true,
  },
];

export const branches: Branch[] = [
  {
    id: 'br_001',
    name: 'New York City Branch',
    code: 'NYC',
    address: '123 Business Ave',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
    phone: '+1-555-0101',
    email: 'nyc@printpoint.com',
    manager: 'John Smith',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'br_002',
    name: 'Los Angeles Branch',
    code: 'LAX',
    address: '456 Commerce Blvd',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90210',
    country: 'USA',
    phone: '+1-555-0202',
    email: 'lax@printpoint.com',
    manager: 'Sarah Johnson',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'br_003',
    name: 'Chicago Branch',
    code: 'CHI',
    address: '789 Industrial Way',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    country: 'USA',
    phone: '+1-555-0303',
    email: 'chi@printpoint.com',
    manager: 'Mike Davis',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const warehouses: Warehouse[] = [
  // NYC Branch Warehouses
  {
    id: 'wh_001',
    branchId: 'br_001',
    name: 'NYC Main Warehouse',
    code: 'NYC-MAIN',
    address: '123 Business Ave, Warehouse Section',
    type: 'main',
    capacity: 10000,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'wh_002',
    branchId: 'br_001',
    name: 'NYC Retail Store',
    code: 'NYC-RETAIL',
    address: '123 Business Ave, Retail Floor',
    type: 'retail',
    capacity: 1000,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'wh_003',
    branchId: 'br_001',
    name: 'NYC Storage Facility',
    code: 'NYC-STORAGE',
    address: '456 Storage Lane, NYC',
    type: 'storage',
    capacity: 5000,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  // LAX Branch Warehouses
  {
    id: 'wh_004',
    branchId: 'br_002',
    name: 'LAX Main Warehouse',
    code: 'LAX-MAIN',
    address: '456 Commerce Blvd, Warehouse Section',
    type: 'main',
    capacity: 8000,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'wh_005',
    branchId: 'br_002',
    name: 'LAX Distribution Center',
    code: 'LAX-DIST',
    address: '789 Distribution Way, LAX',
    type: 'distribution',
    capacity: 12000,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'wh_006',
    branchId: 'br_002',
    name: 'LAX Retail Store',
    code: 'LAX-RETAIL',
    address: '456 Commerce Blvd, Retail Floor',
    type: 'retail',
    capacity: 800,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  // Chicago Branch Warehouses
  {
    id: 'wh_007',
    branchId: 'br_003',
    name: 'Chicago Main Warehouse',
    code: 'CHI-MAIN',
    address: '789 Industrial Way, Warehouse Section',
    type: 'main',
    capacity: 6000,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'wh_008',
    branchId: 'br_003',
    name: 'Chicago Storage Facility',
    code: 'CHI-STORAGE',
    address: '321 Storage Ave, Chicago',
    type: 'storage',
    capacity: 4000,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Legacy compatibility
export const stockLocations: StockLocation[] = warehouses;

export const products: Product[] = [
  {
    id: 'prod_001',
    sku: 'BC-001',
    slug: 'business-cards',
    name: 'Business Cards',
    description: 'Premium business cards to make a lasting impression.',
    longDescription:
      'Our business cards are printed on high-quality cardstock with a variety of finishes available. Perfect for networking and professional branding, they offer a crisp, clean look that stands out.',
    imageId: 'business-card',
    categoryId: 'cat_001',
    supplierId: 'sup_001',
    basePrice: 0.25,
    costPrice: 0.15,
    markup: 66.67,
    minStockLevel: 1000,
    maxStockLevel: 10000,
    reorderPoint: 2000,
    isActive: true,
    isDigital: true,
    weight: 5,
    dimensions: {
      length: 8.5,
      width: 5.5,
      height: 0.01,
    },
    type: 'print_item',
    printSpecifications: [
      {
        id: 'print_spec_001',
        name: 'Paper Type',
        description: 'Select the paper type for your business cards',
        category: 'paper',
        isRequired: true,
        options: [
          {
            id: 'print_opt_001',
            name: 'Standard Matte',
            priceAdjustment: 0,
            isDefault: true,
            specifications: { weight: 350, type: 'matte' }
          },
          {
            id: 'print_opt_002',
            name: 'Premium Glossy',
            priceAdjustment: 0.05,
            isDefault: false,
            specifications: { weight: 400, type: 'glossy' }
          }
        ]
      }
    ],
    printTime: 2,
    printComplexity: 'simple',
    printEquipment: ['digital_printer', 'cutter'],
    options: [
      {
        id: 'paper_type',
        name: 'Paper Type',
        type: 'select',
        defaultValue: 'standard_matte',
        choices: [
          { id: 'standard_matte', name: 'Standard Matte', priceModifier: 0 },
          { id: 'premium_glossy', name: 'Premium Glossy', priceModifier: 0.05 },
          { id: 'recycled_paper', name: 'Recycled Paper', priceModifier: 0.02 },
        ],
      },
      {
        id: 'corners',
        name: 'Corners',
        type: 'select',
        defaultValue: 'square',
        choices: [
            { id: 'square', name: 'Square', priceModifier: 0 },
            { id: 'rounded', name: 'Rounded', priceModifier: 0.03 },
        ]
      },
      {
        id: 'quantity',
        name: 'Quantity',
        type: 'quantity',
        defaultValue: 100,
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod_002',
    sku: 'FL-001',
    slug: 'flyers',
    name: 'Promotional Flyers',
    description: 'Vibrant flyers to promote your event or business.',
    longDescription:
      'Get the word out with our full-color flyers. Available in multiple sizes and paper options, they are perfect for handouts, mailers, and promotional events. High-resolution printing ensures your message is seen.',
    imageId: 'flyer',
    categoryId: 'cat_002',
    supplierId: 'sup_001',
    basePrice: 0.4,
    costPrice: 0.25,
    markup: 60.0,
    minStockLevel: 500,
    maxStockLevel: 5000,
    reorderPoint: 1000,
    isActive: true,
    isDigital: true,
    type: 'print_item',
    weight: 3,
    dimensions: {
      length: 8.3,
      width: 5.8,
      height: 0.01,
    },
    options: [
      {
        id: 'size',
        name: 'Size',
        type: 'select',
        defaultValue: 'a5',
        choices: [
          { id: 'a5', name: 'A5 (5.8 x 8.3 in)', priceModifier: 0 },
          { id: 'a4', name: 'A4 (8.3 x 11.7 in)', priceModifier: 0.15 },
          { id: 'letter', name: 'Letter (8.5 x 11 in)', priceModifier: 0.15 },
        ],
      },
      {
        id: 'paper_weight',
        name: 'Paper Weight',
        type: 'select',
        defaultValue: '130gsm',
        choices: [
            { id: '130gsm', name: '130gsm', priceModifier: 0 },
            { id: '170gsm', name: '170gsm', priceModifier: 0.05 },
        ]
      },
      {
        id: 'quantity',
        name: 'Quantity',
        type: 'quantity',
        defaultValue: 100,
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod_003',
    sku: 'VB-001',
    slug: 'banners',
    name: 'Vinyl Banners',
    description: 'Durable, high-quality banners for indoor or outdoor use.',
    longDescription:
      'Make a big statement with our durable vinyl banners. Weather-resistant and printed with UV-cured inks, they are ideal for storefronts, trade shows, and outdoor events. Grommets and reinforced edges included.',
    imageId: 'banner',
    categoryId: 'cat_003',
    supplierId: 'sup_002',
    basePrice: 25.0,
    costPrice: 15.0,
    markup: 66.67,
    minStockLevel: 5,
    maxStockLevel: 50,
    type: 'print_item',
    reorderPoint: 10,
    isActive: true,
    isDigital: false,
    weight: 500,
    dimensions: {
      length: 48,
      width: 24,
      height: 0.1,
    },
    options: [
      {
        id: 'size',
        name: 'Size (ft)',
        type: 'select',
        defaultValue: '2x4',
        choices: [
          { id: '2x4', name: '2ft x 4ft', priceModifier: 0 },
          { id: '3x6', name: '3ft x 6ft', priceModifier: 15.0 },
          { id: '4x8', name: '4ft x 8ft', priceModifier: 30.0 },
        ],
      },
      {
        id: 'quantity',
        name: 'Quantity',
        type: 'quantity',
        defaultValue: 1,
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod_006',
    sku: 'PO-001',
    slug: 'posters',
    name: 'Posters',
    description: 'Bright and colorful posters to grab attention.',
    longDescription: 'Our posters are printed on high-quality paper with a satin finish, ensuring your graphics look their best. Perfect for events, advertisements, or decoration.',
    imageId: 'poster',
    categoryId: 'cat_003',
    supplierId: 'sup_001',
    basePrice: 5.0,
    costPrice: 3.0,
    markup: 66.67,
    minStockLevel: 20,
    maxStockLevel: 200,
    reorderPoint: 50,
    isActive: true,
    isDigital: true,
    type: 'print_item',
    weight: 50,
    dimensions: {
      length: 24,
      width: 18,
      height: 0.01,
    },
    options: [
        {
            id: 'size',
            name: 'Size',
            type: 'select',
            defaultValue: '18x24',
            choices: [
                { id: '12x18', name: '12x18 inches', priceModifier: -1.0 },
                { id: '18x24', name: '18x24 inches', priceModifier: 0 },
                { id: '24x36', name: '24x36 inches', priceModifier: 4.0 },
            ],
        },
        {
            id: 'quantity',
            name: 'Quantity',
            type: 'quantity',
            defaultValue: 10,
        },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  // Sale Item Example
  {
    id: 'prod_007',
    sku: 'PEN-001',
    slug: 'promotional-pens',
    name: 'Promotional Pens',
    description: 'High-quality promotional pens for marketing campaigns.',
    longDescription: 'Custom branded pens perfect for trade shows, conferences, and marketing campaigns. Available in multiple colors and styles.',
    imageId: 'promotional-pen',
    categoryId: 'cat_002',
    supplierId: 'sup_002',
    basePrice: 2.50,
    costPrice: 1.25,
    markup: 100,
    minStockLevel: 500,
    maxStockLevel: 5000,
    reorderPoint: 1000,
    isActive: true,
    isDigital: false,
    weight: 15,
    dimensions: {
      length: 14.5,
      width: 1.0,
      height: 1.0,
    },
    type: 'sale_item',
    options: [
      {
        id: 'pen_color',
        name: 'Pen Color',
        type: 'select',
        defaultValue: 'blue',
        choices: [
          { id: 'blue', name: 'Blue', priceModifier: 0 },
          { id: 'black', name: 'Black', priceModifier: 0 },
          { id: 'red', name: 'Red', priceModifier: 0.10 },
        ],
      },
      {
        id: 'quantity',
        name: 'Quantity',
        type: 'quantity',
        defaultValue: 100,
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  // Service Item Example
  {
    id: 'prod_004',
    sku: 'SVC-001',
    slug: 'graphic-design-service',
    name: 'Graphic Design Service',
    description: 'Professional graphic design services for your marketing materials.',
    longDescription: 'Our experienced designers will create custom graphics, logos, and marketing materials tailored to your brand and requirements.',
    imageId: 'graphic-design',
    categoryId: 'cat_003',
    basePrice: 150.00,
    costPrice: 0,
    markup: 0,
    minStockLevel: 0,
    maxStockLevel: 0,
    reorderPoint: 0,
    isActive: true,
    isDigital: true,
    type: 'service_item',
    serviceSpecifications: [
      {
        id: 'service_spec_001',
        name: 'Project Complexity',
        description: 'Select the complexity level of your design project',
        category: 'complexity',
        isRequired: true,
        options: [
          {
            id: 'service_opt_001',
            name: 'Simple (Logo, Business Card)',
            priceAdjustment: 0,
            durationAdjustment: 0,
            isDefault: true
          },
          {
            id: 'service_opt_002',
            name: 'Medium (Brochure, Flyer)',
            priceAdjustment: 50.00,
            durationAdjustment: 2,
            isDefault: false
          },
          {
            id: 'service_opt_003',
            name: 'Complex (Brand Package, Website)',
            priceAdjustment: 200.00,
            durationAdjustment: 8,
            isDefault: false
          }
        ]
      },
      {
        id: 'service_spec_002',
        name: 'Delivery Timeline',
        description: 'Choose your preferred delivery timeline',
        category: 'duration',
        isRequired: true,
        options: [
          {
            id: 'service_opt_004',
            name: 'Standard (5-7 days)',
            priceAdjustment: 0,
            durationAdjustment: 0,
            isDefault: true
          },
          {
            id: 'service_opt_005',
            name: 'Rush (2-3 days)',
            priceAdjustment: 75.00,
            durationAdjustment: 0,
            isDefault: false
          }
        ]
      }
    ],
    serviceDuration: 4,
    serviceCategory: 'Design',
    serviceLocation: 'in-house',
    options: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  // Bundle Example
  {
    id: 'prod_005',
    sku: 'BND-001',
    slug: 'starter-marketing-package',
    name: 'Starter Marketing Package',
    description: 'Complete marketing package for small businesses.',
    longDescription: 'Everything you need to get started with professional marketing materials. Includes business cards, flyers, and promotional items.',
    imageId: 'marketing-package',
    categoryId: 'cat_001',
    basePrice: 199.99,
    costPrice: 120.00,
    markup: 66.67,
    minStockLevel: 10,
    maxStockLevel: 100,
    reorderPoint: 20,
    isActive: true,
    isDigital: false,
    weight: 500,
    dimensions: {
      length: 30,
      width: 20,
      height: 5,
    },
    type: 'bundle',
    bundleComponents: [
      {
        id: 'bundle_comp_001',
        productId: 'prod_001',
        quantity: 500,
        isRequired: true,
        priceAdjustment: -10.00,
        notes: 'Business cards with standard options'
      },
      {
        id: 'bundle_comp_002',
        productId: 'prod_007',
        quantity: 50,
        isRequired: true,
        priceAdjustment: -5.00,
        notes: 'Promotional pens'
      }
    ],
    bundleDiscount: 15,
    options: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Sample Stock Data
export const stockLevels: StockLevel[] = [
  // NYC Branch Stock
  {
    id: 'stock_001',
    productId: 'prod_001',
    branchId: 'br_001',
    locationId: 'wh_001', // NYC Main Warehouse
    quantity: 5000,
    reservedQuantity: 500,
    availableQuantity: 4500,
    lastUpdated: '2024-01-15T10:30:00Z',
  },
  {
    id: 'stock_002',
    productId: 'prod_001',
    branchId: 'br_001',
    locationId: 'wh_002', // NYC Retail Store
    quantity: 1000,
    reservedQuantity: 100,
    availableQuantity: 900,
    lastUpdated: '2024-01-15T10:30:00Z',
  },
  {
    id: 'stock_003',
    productId: 'prod_007',
    branchId: 'br_001',
    locationId: 'wh_001', // NYC Main Warehouse
    quantity: 2000,
    reservedQuantity: 200,
    availableQuantity: 1800,
    lastUpdated: '2024-01-15T10:30:00Z',
  },
  {
    id: 'stock_004',
    productId: 'prod_007',
    branchId: 'br_001',
    locationId: 'wh_001', // NYC Main Warehouse
    quantity: 25,
    reservedQuantity: 5,
    availableQuantity: 20,
    lastUpdated: '2024-01-15T10:30:00Z',
  },
  {
    id: 'stock_005',
    productId: 'prod_004',
    branchId: 'br_001',
    locationId: 'wh_003', // NYC Storage Facility
    quantity: 150,
    reservedQuantity: 20,
    availableQuantity: 130,
    lastUpdated: '2024-01-15T10:30:00Z',
  },
  // LAX Branch Stock
  {
    id: 'stock_006',
    productId: 'prod_001',
    branchId: 'br_002',
    locationId: 'wh_004', // LAX Main Warehouse
    quantity: 3000,
    reservedQuantity: 300,
    availableQuantity: 2700,
    lastUpdated: '2024-01-15T10:30:00Z',
  },
  {
    id: 'stock_007',
    productId: 'prod_007',
    branchId: 'br_002',
    locationId: 'wh_005', // LAX Distribution Center
    quantity: 1500,
    reservedQuantity: 150,
    availableQuantity: 1350,
    lastUpdated: '2024-01-15T10:30:00Z',
  },
  {
    id: 'stock_008',
    productId: 'prod_007',
    branchId: 'br_002',
    locationId: 'wh_004', // LAX Main Warehouse
    quantity: 15,
    reservedQuantity: 3,
    availableQuantity: 12,
    lastUpdated: '2024-01-15T10:30:00Z',
  },
  // Chicago Branch Stock
  {
    id: 'stock_009',
    productId: 'prod_001',
    branchId: 'br_003',
    locationId: 'wh_007', // Chicago Main Warehouse
    quantity: 2000,
    reservedQuantity: 200,
    availableQuantity: 1800,
    lastUpdated: '2024-01-15T10:30:00Z',
  },
  {
    id: 'stock_010',
    productId: 'prod_004',
    branchId: 'br_003',
    locationId: 'wh_008', // Chicago Storage Facility
    quantity: 100,
    reservedQuantity: 15,
    availableQuantity: 85,
    lastUpdated: '2024-01-15T10:30:00Z',
  },
];

// Sample Purchase Orders
export const purchaseOrders: PurchaseOrder[] = [
  {
    id: 'po_001',
    poNumber: 'PO-2024-001',
    supplierId: 'sup_001',
    branchId: 'br_001',
    warehouseId: 'wh_001',
    status: 'completed',
    orderDate: '2024-01-01T00:00:00Z',
    expectedDeliveryDate: '2024-01-05T00:00:00Z',
    actualDeliveryDate: '2024-01-04T00:00:00Z',
    items: [
      {
        id: 'poi_001',
        productId: 'prod_001',
        quantity: 1000,
        unitPrice: 0.15,
        totalPrice: 150.00,
        receivedQuantity: 1000,
        notes: 'Business cards for NYC main warehouse'
      }
    ],
    subtotal: 150.00,
    tax: 15.00,
    total: 165.00,
    notes: 'Initial stock purchase for NYC branch',
    createdBy: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z',
  },
  {
    id: 'po_002',
    poNumber: 'PO-2024-002',
    supplierId: 'sup_001',
    branchId: 'br_001',
    warehouseId: 'wh_001',
    status: 'ordered',
    orderDate: '2024-01-15T00:00:00Z',
    expectedDeliveryDate: '2024-01-20T00:00:00Z',
    items: [
      {
        id: 'poi_002',
        productId: 'prod_007',
        quantity: 500,
        unitPrice: 0.25,
        totalPrice: 125.00,
        receivedQuantity: 0,
        notes: 'Flyers for NYC branch'
      }
    ],
    subtotal: 125.00,
    tax: 12.50,
    total: 137.50,
    notes: 'Restock flyers for NYC',
    createdBy: 'admin',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
];

// Sample Goods Receipts
export const goodsReceipts: GoodsReceipt[] = [
  {
    id: 'gr_001',
    grNumber: 'GR-2024-001',
    purchaseOrderId: 'po_001',
    branchId: 'br_001',
    warehouseId: 'wh_001',
    status: 'completed',
    receivedDate: '2024-01-04T00:00:00Z',
    receivedBy: 'warehouse-staff',
    verifiedBy: 'warehouse-manager',
    items: [
      {
        id: 'gri_001',
        productId: 'prod_001',
        orderedQuantity: 1000,
        receivedQuantity: 1000,
        acceptedQuantity: 1000,
        rejectedQuantity: 0,
        unitPrice: 0.15,
        totalPrice: 150.00,
        notes: 'All items received in good condition'
      }
    ],
    notes: 'Complete delivery received',
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z',
  },
];

// Sample Issues
export const issues: Issue[] = [
  {
    id: 'iss_001',
    issueNumber: 'ISS-2024-001',
    branchId: 'br_001',
    warehouseId: 'wh_001',
    type: 'department',
    status: 'completed',
    department: 'Sales',
    issueDate: '2024-01-10T00:00:00Z',
    issuedBy: 'warehouse-staff',
    approvedBy: 'department-manager',
    items: [
      {
        id: 'issi_001',
        productId: 'prod_001',
        quantity: 100,
        unitCost: 0.15,
        totalCost: 15.00,
        notes: 'Business cards for sales team'
      }
    ],
    totalCost: 15.00,
    notes: 'Issue to sales department for client samples',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
];

// Sample Returns
export const returns: Return[] = [
  {
    id: 'ret_001',
    returnNumber: 'RET-2024-001',
    type: 'damaged',
    status: 'completed',
    branchId: 'br_001',
    warehouseId: 'wh_001',
    supplierId: 'sup_001',
    originalOrderId: 'po_001',
    returnDate: '2024-01-12T00:00:00Z',
    receivedBy: 'warehouse-staff',
    approvedBy: 'warehouse-manager',
    items: [
      {
        id: 'reti_001',
        productId: 'prod_001',
        quantity: 50,
        reason: 'Damaged during transport',
        condition: 'damaged',
        unitPrice: 0.15,
        totalPrice: 7.50,
        notes: 'Cards damaged due to moisture'
      }
    ],
    totalValue: 7.50,
    notes: 'Return damaged business cards to supplier',
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
  },
];

// Sample Transfer Orders
export const transferOrders: TransferOrder[] = [
  {
    id: 'to_001',
    transferNumber: 'TO-2024-001',
    fromBranchId: 'br_001',
    fromWarehouseId: 'wh_001',
    toBranchId: 'br_001',
    toWarehouseId: 'wh_002',
    status: 'completed',
    transferDate: '2024-01-12T00:00:00Z',
    expectedDeliveryDate: '2024-01-12T00:00:00Z',
    actualDeliveryDate: '2024-01-12T00:00:00Z',
    items: [
      {
        id: 'toi_001',
        productId: 'prod_001',
        quantity: 200,
        unitCost: 0.15,
        totalCost: 30.00,
        notes: 'Transfer to retail store'
      }
    ],
    totalValue: 30.00,
    notes: 'Transfer business cards to retail store',
    createdBy: 'warehouse-manager',
    approvedBy: 'branch-manager',
    receivedBy: 'retail-staff',
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
  },
];

export const stockMovements: StockMovement[] = [
  // NYC Branch Movements
  {
    id: 'mov_001',
    productId: 'prod_001',
    branchId: 'br_001',
    locationId: 'wh_001',
    type: 'receipt',
    quantity: 1000,
    reference: 'PO-2024-001',
    referenceId: 'po_001',
    notes: 'Goods receipt from purchase order',
    createdAt: '2024-01-04T09:00:00Z',
    createdBy: 'warehouse-staff',
  },
  {
    id: 'mov_002',
    productId: 'prod_001',
    branchId: 'br_001',
    locationId: 'wh_001',
    type: 'issue',
    quantity: -100,
    reference: 'ISS-2024-001',
    referenceId: 'iss_001',
    notes: 'Issue to sales department',
    createdAt: '2024-01-10T14:30:00Z',
    createdBy: 'warehouse-staff',
  },
  {
    id: 'mov_003',
    productId: 'prod_001',
    branchId: 'br_001',
    locationId: 'wh_001',
    type: 'return',
    quantity: -50,
    reference: 'RET-2024-001',
    referenceId: 'ret_001',
    notes: 'Return damaged items to supplier',
    createdAt: '2024-01-12T10:00:00Z',
    createdBy: 'warehouse-staff',
  },
  {
    id: 'mov_004',
    productId: 'prod_001',
    branchId: 'br_001',
    locationId: 'wh_001',
    type: 'transfer',
    quantity: -200,
    reference: 'TO-2024-001',
    referenceId: 'to_001',
    notes: 'Transfer to retail store',
    createdAt: '2024-01-12T10:00:00Z',
    createdBy: 'warehouse-manager',
  },
  {
    id: 'mov_005',
    productId: 'prod_001',
    branchId: 'br_001',
    locationId: 'wh_002',
    type: 'transfer',
    quantity: 200,
    reference: 'TO-2024-001',
    referenceId: 'to_001',
    notes: 'Transfer from main warehouse',
    createdAt: '2024-01-12T10:00:00Z',
    createdBy: 'warehouse-manager',
  },
  // LAX Branch Movements
  {
    id: 'mov_006',
    productId: 'prod_001',
    branchId: 'br_002',
    locationId: 'wh_004',
    type: 'receipt',
    quantity: 800,
    reference: 'PO-2024-003',
    referenceId: 'po_003',
    notes: 'Goods receipt for LAX',
    createdAt: '2024-01-02T08:00:00Z',
    createdBy: 'warehouse-staff',
  },
  {
    id: 'mov_007',
    productId: 'prod_007',
    branchId: 'br_002',
    locationId: 'wh_005',
    type: 'receipt',
    quantity: 600,
    reference: 'PO-2024-004',
    referenceId: 'po_004',
    notes: 'Bulk flyer order for LAX distribution',
    createdAt: '2024-01-08T13:45:00Z',
    createdBy: 'warehouse-staff',
  },
  // Chicago Branch Movements
  {
    id: 'mov_008',
    productId: 'prod_001',
    branchId: 'br_003',
    locationId: 'wh_007',
    type: 'receipt',
    quantity: 500,
    reference: 'PO-2024-005',
    referenceId: 'po_005',
    notes: 'Goods receipt for Chicago',
    createdAt: '2024-01-03T11:30:00Z',
    createdBy: 'warehouse-staff',
  },
  {
    id: 'mov_009',
    productId: 'prod_004',
    branchId: 'br_003',
    locationId: 'wh_008',
    type: 'receipt',
    quantity: 200,
    reference: 'PO-2024-006',
    referenceId: 'po_006',
    notes: 'Poster stock for Chicago storage',
    createdAt: '2024-01-15T09:20:00Z',
    createdBy: 'warehouse-staff',
  },
];

// User Management Types
export type Permission = {
  id: string;
  name: string;
  description: string;
  module: string; // e.g., 'products', 'inventory', 'warehouse', 'branches'
  action: string; // e.g., 'create', 'read', 'update', 'delete', 'approve'
};

export type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // Array of permission IDs
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export type User = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  status: UserStatus;
  roleId: string;
  branchId?: string; // Optional branch assignment
  department?: string;
  position?: string;
  lastLoginAt?: string;
  passwordChangedAt: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type UserSession = {
  id: string;
  userId: string;
  token: string;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
  lastActivityAt: string;
};

export type UserActivity = {
  id: string;
  userId: string;
  action: string; // e.g., 'login', 'create_product', 'update_inventory'
  resource: string; // e.g., 'product', 'inventory', 'user'
  resourceId?: string;
  details?: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
};

// Legacy Order Status for simple orders
export type LegacyOrderStatus = 'Order Confirmed' | 'In Production' | 'Shipped' | 'Delivered';

export type Order = {
    id: string;
    customerName: string;
    status: LegacyOrderStatus;
    items: {
        productName: string;
        quantity: number;
    }[];
    estimatedDelivery: string;
}

// Sample Permissions
export const permissions: Permission[] = [
  // Dashboard permissions
  { id: 'perm_001', name: 'View Dashboard', description: 'Access to main dashboard', module: 'dashboard', action: 'read' },
  
  // Product permissions
  { id: 'perm_002', name: 'View Products', description: 'View product catalog', module: 'products', action: 'read' },
  { id: 'perm_003', name: 'Create Products', description: 'Create new products', module: 'products', action: 'create' },
  { id: 'perm_004', name: 'Update Products', description: 'Edit existing products', module: 'products', action: 'update' },
  { id: 'perm_005', name: 'Delete Products', description: 'Delete products', module: 'products', action: 'delete' },
  
  // Inventory permissions
  { id: 'perm_006', name: 'View Inventory', description: 'View stock levels', module: 'inventory', action: 'read' },
  { id: 'perm_007', name: 'Update Inventory', description: 'Adjust stock levels', module: 'inventory', action: 'update' },
  { id: 'perm_008', name: 'Create Stock Movements', description: 'Record stock movements', module: 'inventory', action: 'create' },
  
  // Warehouse permissions
  { id: 'perm_009', name: 'View Purchase Orders', description: 'View purchase orders', module: 'warehouse', action: 'read' },
  { id: 'perm_010', name: 'Create Purchase Orders', description: 'Create purchase orders', module: 'warehouse', action: 'create' },
  { id: 'perm_011', name: 'Approve Purchase Orders', description: 'Approve purchase orders', module: 'warehouse', action: 'approve' },
  { id: 'perm_012', name: 'View Goods Receipts', description: 'View goods receipts', module: 'warehouse', action: 'read' },
  { id: 'perm_013', name: 'Process Goods Receipts', description: 'Process incoming deliveries', module: 'warehouse', action: 'update' },
  { id: 'perm_014', name: 'View Issues', description: 'View stock issues', module: 'warehouse', action: 'read' },
  { id: 'perm_015', name: 'Create Issues', description: 'Create stock issues', module: 'warehouse', action: 'create' },
  { id: 'perm_016', name: 'View Transfers', description: 'View transfer orders', module: 'warehouse', action: 'read' },
  { id: 'perm_017', name: 'Create Transfers', description: 'Create transfer orders', module: 'warehouse', action: 'create' },
  
  // Branch permissions
  { id: 'perm_018', name: 'View Branches', description: 'View branch information', module: 'branches', action: 'read' },
  { id: 'perm_019', name: 'Manage Branches', description: 'Create and edit branches', module: 'branches', action: 'update' },
  
  // User management permissions
  { id: 'perm_020', name: 'View Users', description: 'View user list', module: 'users', action: 'read' },
  { id: 'perm_021', name: 'Create Users', description: 'Create new users', module: 'users', action: 'create' },
  { id: 'perm_022', name: 'Update Users', description: 'Edit user information', module: 'users', action: 'update' },
  { id: 'perm_023', name: 'Delete Users', description: 'Delete users', module: 'users', action: 'delete' },
  { id: 'perm_024', name: 'Manage Roles', description: 'Create and edit roles', module: 'users', action: 'update' },
  { id: 'perm_025', name: 'View User Activity', description: 'View user activity logs', module: 'users', action: 'read' },
  
  // Reports permissions
  { id: 'perm_026', name: 'View Reports', description: 'Access to reports', module: 'reports', action: 'read' },
  { id: 'perm_027', name: 'Export Data', description: 'Export data to files', module: 'reports', action: 'export' },
];

// Sample Roles
export const roles: Role[] = [
  {
    id: 'role_001',
    name: 'Super Admin',
    description: 'Full system access with all permissions',
    permissions: permissions.map(p => p.id),
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role_002',
    name: 'Branch Manager',
    description: 'Manage branch operations and staff',
    permissions: [
      'perm_001', 'perm_002', 'perm_003', 'perm_004', 'perm_006', 'perm_007', 'perm_008',
      'perm_009', 'perm_010', 'perm_011', 'perm_012', 'perm_013', 'perm_014', 'perm_015',
      'perm_016', 'perm_017', 'perm_018', 'perm_020', 'perm_021', 'perm_022', 'perm_026'
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role_003',
    name: 'Warehouse Manager',
    description: 'Manage warehouse operations and inventory',
    permissions: [
      'perm_001', 'perm_002', 'perm_006', 'perm_007', 'perm_008', 'perm_009', 'perm_010',
      'perm_012', 'perm_013', 'perm_014', 'perm_015', 'perm_016', 'perm_017', 'perm_018',
      'perm_026'
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role_004',
    name: 'Warehouse Staff',
    description: 'Process warehouse operations',
    permissions: [
      'perm_001', 'perm_002', 'perm_006', 'perm_008', 'perm_009', 'perm_012', 'perm_013',
      'perm_014', 'perm_015', 'perm_016', 'perm_017', 'perm_018'
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role_005',
    name: 'Sales Representative',
    description: 'Handle sales and customer interactions',
    permissions: [
      'perm_001', 'perm_002', 'perm_006', 'perm_014', 'perm_015', 'perm_018', 'perm_026'
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role_006',
    name: 'Viewer',
    description: 'Read-only access to most modules',
    permissions: [
      'perm_001', 'perm_002', 'perm_006', 'perm_009', 'perm_012', 'perm_014', 'perm_016',
      'perm_018', 'perm_026'
    ],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Sample Users
export const users: User[] = [
  {
    id: 'user_001',
    username: 'admin',
    email: 'admin@printpoint.com',
    firstName: 'System',
    lastName: 'Administrator',
    phone: '+1-555-0001',
    status: 'active',
    roleId: 'role_001',
    department: 'IT',
    position: 'System Administrator',
    lastLoginAt: '2024-01-15T10:30:00Z',
    passwordChangedAt: '2024-01-01T00:00:00Z',
    isEmailVerified: true,
    isPhoneVerified: true,
    twoFactorEnabled: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    createdBy: 'system',
  },
  {
    id: 'user_002',
    username: 'john.smith',
    email: 'john.smith@printpoint.com',
    firstName: 'John',
    lastName: 'Smith',
    phone: '+1-555-0002',
    status: 'active',
    roleId: 'role_002',
    branchId: 'br_001',
    department: 'Management',
    position: 'Branch Manager',
    lastLoginAt: '2024-01-15T09:15:00Z',
    passwordChangedAt: '2024-01-10T00:00:00Z',
    isEmailVerified: true,
    isPhoneVerified: true,
    twoFactorEnabled: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T09:15:00Z',
    createdBy: 'user_001',
  },
  {
    id: 'user_003',
    username: 'sarah.johnson',
    email: 'sarah.johnson@printpoint.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    phone: '+1-555-0003',
    status: 'active',
    roleId: 'role_002',
    branchId: 'br_002',
    department: 'Management',
    position: 'Branch Manager',
    lastLoginAt: '2024-01-15T08:45:00Z',
    passwordChangedAt: '2024-01-08T00:00:00Z',
    isEmailVerified: true,
    isPhoneVerified: false,
    twoFactorEnabled: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T08:45:00Z',
    createdBy: 'user_001',
  },
  {
    id: 'user_004',
    username: 'mike.davis',
    email: 'mike.davis@printpoint.com',
    firstName: 'Mike',
    lastName: 'Davis',
    phone: '+1-555-0004',
    status: 'active',
    roleId: 'role_003',
    branchId: 'br_001',
    department: 'Warehouse',
    position: 'Warehouse Manager',
    lastLoginAt: '2024-01-15T07:30:00Z',
    passwordChangedAt: '2024-01-05T00:00:00Z',
    isEmailVerified: true,
    isPhoneVerified: true,
    twoFactorEnabled: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T07:30:00Z',
    createdBy: 'user_002',
  },
  {
    id: 'user_005',
    username: 'warehouse.staff',
    email: 'warehouse.staff@printpoint.com',
    firstName: 'Warehouse',
    lastName: 'Staff',
    phone: '+1-555-0005',
    status: 'active',
    roleId: 'role_004',
    branchId: 'br_001',
    department: 'Warehouse',
    position: 'Warehouse Staff',
    lastLoginAt: '2024-01-15T06:00:00Z',
    passwordChangedAt: '2024-01-03T00:00:00Z',
    isEmailVerified: true,
    isPhoneVerified: false,
    twoFactorEnabled: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T06:00:00Z',
    createdBy: 'user_004',
  },
  {
    id: 'user_006',
    username: 'sales.rep',
    email: 'sales.rep@printpoint.com',
    firstName: 'Sales',
    lastName: 'Representative',
    phone: '+1-555-0006',
    status: 'active',
    roleId: 'role_005',
    branchId: 'br_001',
    department: 'Sales',
    position: 'Sales Representative',
    lastLoginAt: '2024-01-15T11:20:00Z',
    passwordChangedAt: '2024-01-12T00:00:00Z',
    isEmailVerified: true,
    isPhoneVerified: true,
    twoFactorEnabled: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T11:20:00Z',
    createdBy: 'user_002',
  },
];

// Sample User Activities
export const userActivities: UserActivity[] = [
  {
    id: 'activity_001',
    userId: 'user_001',
    action: 'login',
    resource: 'system',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'activity_002',
    userId: 'user_002',
    action: 'create_product',
    resource: 'product',
    resourceId: 'prod_001',
    details: 'Created business cards product',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    createdAt: '2024-01-15T09:15:00Z',
  },
  {
    id: 'activity_003',
    userId: 'user_004',
    action: 'create_purchase_order',
    resource: 'purchase_order',
    resourceId: 'po_001',
    details: 'Created PO-2024-001 for business cards',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    createdAt: '2024-01-15T07:30:00Z',
  },
  {
    id: 'activity_004',
    userId: 'user_005',
    action: 'process_goods_receipt',
    resource: 'goods_receipt',
    resourceId: 'gr_001',
    details: 'Processed goods receipt for PO-2024-001',
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    createdAt: '2024-01-15T06:00:00Z',
  },
  {
    id: 'activity_005',
    userId: 'user_006',
    action: 'create_issue',
    resource: 'issue',
    resourceId: 'iss_001',
    details: 'Created issue for sales department',
    ipAddress: '192.168.1.104',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    createdAt: '2024-01-15T11:20:00Z',
  },
];

// Customer Management Types
export type CustomerType = 'individual' | 'business' | 'government' | 'nonprofit';

export type CustomerStatus = 'active' | 'inactive' | 'suspended' | 'pending_approval';

export type PaymentTerms = 'net_15' | 'net_30' | 'net_45' | 'net_60' | 'due_on_receipt' | 'prepaid' | 'custom';

export type SalesPaymentMethod = 'cash' | 'check' | 'credit_card' | 'bank_transfer' | 'paypal' | 'other';

export type TransactionType = 'invoice' | 'payment' | 'credit_memo' | 'refund' | 'adjustment' | 'write_off';

export type Customer = {
  id: string;
  customerNumber: string;
  type: CustomerType;
  status: CustomerStatus;
  
  // Basic Information
  firstName?: string;
  lastName?: string;
  companyName?: string;
  email: string;
  phone?: string;
  website?: string;
  
  // Address Information
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  // Business Information
  taxId?: string;
  businessLicense?: string;
  industry?: string;
  employeeCount?: number;
  annualRevenue?: number;
  
  // Account Information
  creditLimit: number;
  paymentTerms: PaymentTerms;
  customPaymentTerms?: number; // days for custom terms
  discountPercentage: number;
  currency: string;
  
  // Balance Information
  currentBalance: number;
  availableCredit: number;
  totalInvoiced: number;
  totalPaid: number;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  
  // Relationship Information
  assignedSalesRep?: string;
  branchId?: string;
  customerSince: string;
  lastOrderDate?: string;
  totalOrders: number;
  averageOrderValue: number;
  
  // Communication Preferences
  preferredContactMethod: 'email' | 'phone' | 'mail';
  marketingOptIn: boolean;
  newsletterOptIn: boolean;
  
  // Metadata
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type CustomerTransaction = {
  id: string;
  customerId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  reference?: string; // Invoice number, payment reference, etc.
  paymentMethod?: PaymentMethod;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  dueDate?: string;
  paidDate?: string;
  createdAt: string;
  createdBy: string;
};

export type CustomerPayment = {
  id: string;
  customerId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  reference: string;
  description?: string;
  appliedToTransactions: string[]; // Array of transaction IDs
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  processedAt: string;
  createdAt: string;
  createdBy: string;
};

export type CustomerNote = {
  id: string;
  customerId: string;
  type: 'general' | 'payment' | 'order' | 'support' | 'marketing';
  title: string;
  content: string;
  isPrivate: boolean;
  createdAt: string;
  createdBy: string;
};

export type CustomerContact = {
  id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  position?: string;
  department?: string;
  isPrimary: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// Sample Customers
export const customers: Customer[] = [
  {
    id: 'cust_001',
    customerNumber: 'CUST-2024-001',
    type: 'business',
    status: 'active',
    companyName: 'TechCorp Solutions',
    email: 'orders@techcorp.com',
    phone: '+1-555-0101',
    website: 'https://techcorp.com',
    billingAddress: {
      street: '123 Business Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    shippingAddress: {
      street: '123 Business Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    taxId: '12-3456789',
    industry: 'Technology',
    employeeCount: 150,
    annualRevenue: 5000000,
    creditLimit: 50000,
    paymentTerms: 'net_30',
    discountPercentage: 5,
    currency: 'USD',
    currentBalance: 12500.00,
    availableCredit: 37500.00,
    totalInvoiced: 125000.00,
    totalPaid: 112500.00,
    lastPaymentDate: '2024-01-10T00:00:00Z',
    lastPaymentAmount: 5000.00,
    assignedSalesRep: 'user_006',
    branchId: 'br_001',
    customerSince: '2023-01-15T00:00:00Z',
    lastOrderDate: '2024-01-15T00:00:00Z',
    totalOrders: 45,
    averageOrderValue: 2777.78,
    preferredContactMethod: 'email',
    marketingOptIn: true,
    newsletterOptIn: true,
    notes: 'High-value customer with consistent orders. Prefers rush delivery.',
    tags: ['vip', 'technology', 'rush-delivery'],
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    createdBy: 'user_002',
  },
  {
    id: 'cust_002',
    customerNumber: 'CUST-2024-002',
    type: 'individual',
    status: 'active',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1-555-0102',
    billingAddress: {
      street: '456 Residential St',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA',
    },
    creditLimit: 5000,
    paymentTerms: 'due_on_receipt',
    discountPercentage: 0,
    currency: 'USD',
    currentBalance: 0.00,
    availableCredit: 5000.00,
    totalInvoiced: 2500.00,
    totalPaid: 2500.00,
    lastPaymentDate: '2024-01-12T00:00:00Z',
    lastPaymentAmount: 150.00,
    branchId: 'br_002',
    customerSince: '2023-06-01T00:00:00Z',
    lastOrderDate: '2024-01-12T00:00:00Z',
    totalOrders: 8,
    averageOrderValue: 312.50,
    preferredContactMethod: 'phone',
    marketingOptIn: false,
    newsletterOptIn: true,
    notes: 'Personal customer, orders business cards and flyers for small business.',
    tags: ['individual', 'small-business'],
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
    createdBy: 'user_003',
  },
  {
    id: 'cust_003',
    customerNumber: 'CUST-2024-003',
    type: 'business',
    status: 'active',
    companyName: 'Marketing Pro Agency',
    email: 'billing@marketingpro.com',
    phone: '+1-555-0103',
    website: 'https://marketingpro.com',
    billingAddress: {
      street: '789 Agency Blvd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
    },
    taxId: '98-7654321',
    industry: 'Marketing',
    employeeCount: 25,
    annualRevenue: 2000000,
    creditLimit: 25000,
    paymentTerms: 'net_15',
    discountPercentage: 10,
    currency: 'USD',
    currentBalance: 8750.00,
    availableCredit: 16250.00,
    totalInvoiced: 75000.00,
    totalPaid: 66250.00,
    lastPaymentDate: '2024-01-08T00:00:00Z',
    lastPaymentAmount: 3000.00,
    assignedSalesRep: 'user_006',
    branchId: 'br_001',
    customerSince: '2023-03-20T00:00:00Z',
    lastOrderDate: '2024-01-14T00:00:00Z',
    totalOrders: 32,
    averageOrderValue: 2343.75,
    preferredContactMethod: 'email',
    marketingOptIn: true,
    newsletterOptIn: true,
    notes: 'Marketing agency with high volume orders. Excellent payment history.',
    tags: ['marketing', 'high-volume', 'reliable'],
    createdAt: '2023-03-20T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z',
    createdBy: 'user_002',
  },
  {
    id: 'cust_004',
    customerNumber: 'CUST-2024-004',
    type: 'government',
    status: 'active',
    companyName: 'City of Springfield',
    email: 'procurement@springfield.gov',
    phone: '+1-555-0104',
    billingAddress: {
      street: '100 City Hall Plaza',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      country: 'USA',
    },
    taxId: '36-1234567',
    industry: 'Government',
    employeeCount: 500,
    annualRevenue: 50000000,
    creditLimit: 100000,
    paymentTerms: 'net_45',
    discountPercentage: 0,
    currency: 'USD',
    currentBalance: 25000.00,
    availableCredit: 75000.00,
    totalInvoiced: 200000.00,
    totalPaid: 175000.00,
    lastPaymentDate: '2024-01-05T00:00:00Z',
    lastPaymentAmount: 15000.00,
    branchId: 'br_002',
    customerSince: '2022-08-10T00:00:00Z',
    lastOrderDate: '2024-01-10T00:00:00Z',
    totalOrders: 18,
    averageOrderValue: 11111.11,
    preferredContactMethod: 'email',
    marketingOptIn: false,
    newsletterOptIn: false,
    notes: 'Government client with strict procurement requirements. Long payment terms.',
    tags: ['government', 'large-orders', 'long-terms'],
    createdAt: '2022-08-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
    createdBy: 'user_003',
  },
  {
    id: 'cust_005',
    customerNumber: 'CUST-2024-005',
    type: 'nonprofit',
    status: 'active',
    companyName: 'Hope Foundation',
    email: 'admin@hopefoundation.org',
    phone: '+1-555-0105',
    website: 'https://hopefoundation.org',
    billingAddress: {
      street: '555 Charity Way',
      city: 'Austin',
      state: 'TX',
      zipCode: '73301',
      country: 'USA',
    },
    taxId: '74-9876543',
    industry: 'Nonprofit',
    employeeCount: 15,
    annualRevenue: 500000,
    creditLimit: 10000,
    paymentTerms: 'net_30',
    discountPercentage: 15,
    currency: 'USD',
    currentBalance: 0.00,
    availableCredit: 10000.00,
    totalInvoiced: 15000.00,
    totalPaid: 15000.00,
    lastPaymentDate: '2024-01-11T00:00:00Z',
    lastPaymentAmount: 2000.00,
    branchId: 'br_001',
    customerSince: '2023-09-05T00:00:00Z',
    lastOrderDate: '2024-01-11T00:00:00Z',
    totalOrders: 12,
    averageOrderValue: 1250.00,
    preferredContactMethod: 'email',
    marketingOptIn: true,
    newsletterOptIn: true,
    notes: 'Nonprofit organization with special pricing. Regular event materials.',
    tags: ['nonprofit', 'special-pricing', 'events'],
    createdAt: '2023-09-05T00:00:00Z',
    updatedAt: '2024-01-11T00:00:00Z',
    createdBy: 'user_002',
  },
];

// Sample Customer Transactions
export const customerTransactions: CustomerTransaction[] = [
  {
    id: 'txn_001',
    customerId: 'cust_001',
    type: 'invoice',
    amount: 2500.00,
    currency: 'USD',
    description: 'Business cards and promotional materials',
    reference: 'INV-2024-001',
    status: 'completed',
    dueDate: '2024-02-15T00:00:00Z',
    createdAt: '2024-01-15T00:00:00Z',
    createdBy: 'user_002',
  },
  {
    id: 'txn_002',
    customerId: 'cust_001',
    type: 'payment',
    amount: 5000.00,
    currency: 'USD',
    description: 'Payment for multiple invoices',
    reference: 'PAY-2024-001',
    paymentMethod: 'bank_transfer',
    status: 'completed',
    paidDate: '2024-01-10T00:00:00Z',
    createdAt: '2024-01-10T00:00:00Z',
    createdBy: 'user_001',
  },
  {
    id: 'txn_003',
    customerId: 'cust_002',
    type: 'invoice',
    amount: 150.00,
    currency: 'USD',
    description: 'Business cards - 500 pieces',
    reference: 'INV-2024-002',
    status: 'completed',
    dueDate: '2024-01-12T00:00:00Z',
    paidDate: '2024-01-12T00:00:00Z',
    createdAt: '2024-01-12T00:00:00Z',
    createdBy: 'user_003',
  },
  {
    id: 'txn_004',
    customerId: 'cust_003',
    type: 'invoice',
    amount: 3500.00,
    currency: 'USD',
    description: 'Marketing materials for Q1 campaign',
    reference: 'INV-2024-003',
    status: 'completed',
    dueDate: '2024-01-29T00:00:00Z',
    createdAt: '2024-01-14T00:00:00Z',
    createdBy: 'user_002',
  },
  {
    id: 'txn_005',
    customerId: 'cust_003',
    type: 'payment',
    amount: 3000.00,
    currency: 'USD',
    description: 'Payment for invoice INV-2023-045',
    reference: 'PAY-2024-002',
    paymentMethod: 'credit_card',
    status: 'completed',
    paidDate: '2024-01-08T00:00:00Z',
    createdAt: '2024-01-08T00:00:00Z',
    createdBy: 'user_001',
  },
];

// Sample Customer Payments
export const customerPayments: CustomerPayment[] = [
  {
    id: 'pay_001',
    customerId: 'cust_001',
    amount: 5000.00,
    currency: 'USD',
    paymentMethod: 'bank_transfer',
    reference: 'PAY-2024-001',
    description: 'Payment for invoices INV-2023-040, INV-2023-041',
    appliedToTransactions: ['txn_002'],
    status: 'completed',
    processedAt: '2024-01-10T14:30:00Z',
    createdAt: '2024-01-10T14:30:00Z',
    createdBy: 'user_001',
  },
  {
    id: 'pay_002',
    customerId: 'cust_002',
    amount: 150.00,
    currency: 'USD',
    paymentMethod: 'credit_card',
    reference: 'PAY-2024-002',
    description: 'Payment for business cards',
    appliedToTransactions: ['txn_003'],
    status: 'completed',
    processedAt: '2024-01-12T10:15:00Z',
    createdAt: '2024-01-12T10:15:00Z',
    createdBy: 'user_001',
  },
  {
    id: 'pay_003',
    customerId: 'cust_003',
    amount: 3000.00,
    currency: 'USD',
    paymentMethod: 'credit_card',
    reference: 'PAY-2024-003',
    description: 'Payment for marketing materials',
    appliedToTransactions: ['txn_005'],
    status: 'completed',
    processedAt: '2024-01-08T16:45:00Z',
    createdAt: '2024-01-08T16:45:00Z',
    createdBy: 'user_001',
  },
];

// Sample Customer Notes
export const customerNotes: CustomerNote[] = [
  {
    id: 'note_001',
    customerId: 'cust_001',
    type: 'general',
    title: 'Rush Delivery Preference',
    content: 'Customer prefers rush delivery for all orders. Willing to pay extra for expedited service.',
    isPrivate: false,
    createdAt: '2024-01-15T00:00:00Z',
    createdBy: 'user_002',
  },
  {
    id: 'note_002',
    customerId: 'cust_001',
    type: 'payment',
    title: 'Payment History',
    content: 'Excellent payment history. Always pays within terms. Consider increasing credit limit.',
    isPrivate: true,
    createdAt: '2024-01-10T00:00:00Z',
    createdBy: 'user_001',
  },
  {
    id: 'note_003',
    customerId: 'cust_003',
    type: 'order',
    title: 'Q1 Campaign Materials',
    content: 'Large order for Q1 marketing campaign. Includes banners, flyers, and business cards.',
    isPrivate: false,
    createdAt: '2024-01-14T00:00:00Z',
    createdBy: 'user_002',
  },
];

// Sample Customer Contacts
export const customerContacts: CustomerContact[] = [
  {
    id: 'contact_001',
    customerId: 'cust_001',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@techcorp.com',
    phone: '+1-555-0101',
    position: 'Procurement Manager',
    department: 'Operations',
    isPrimary: true,
    isActive: true,
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'contact_002',
    customerId: 'cust_001',
    firstName: 'Lisa',
    lastName: 'Johnson',
    email: 'lisa.johnson@techcorp.com',
    phone: '+1-555-0102',
    position: 'Marketing Director',
    department: 'Marketing',
    isPrimary: false,
    isActive: true,
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'contact_003',
    customerId: 'cust_003',
    firstName: 'Mike',
    lastName: 'Davis',
    email: 'mike.davis@marketingpro.com',
    phone: '+1-555-0103',
    position: 'Account Manager',
    department: 'Client Services',
    isPrimary: true,
    isActive: true,
    createdAt: '2023-03-20T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z',
  },
];

// Vendor Management Types
export type VendorType = 'supplier' | 'service_provider' | 'contractor' | 'distributor';

export type VendorStatus = 'active' | 'inactive' | 'suspended' | 'pending_approval';

export type VendorPaymentTerms = 'net_15' | 'net_30' | 'net_45' | 'net_60' | 'due_on_receipt' | 'prepaid' | 'custom';

export type VendorPaymentMethod = 'check' | 'bank_transfer' | 'credit_card' | 'cash' | 'ach' | 'wire_transfer';

export type VendorTransactionType = 'purchase_order' | 'payment' | 'credit_memo' | 'debit_memo' | 'adjustment' | 'refund';

export type Vendor = {
  id: string;
  vendorNumber: string;
  type: VendorType;
  status: VendorStatus;
  
  // Basic Information
  companyName: string;
  legalName?: string;
  email: string;
  phone?: string;
  website?: string;
  
  // Address Information
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  // Business Information
  taxId?: string;
  businessLicense?: string;
  industry?: string;
  employeeCount?: number;
  annualRevenue?: number;
  certifications?: string[];
  
  // Account Information
  creditLimit: number;
  paymentTerms: VendorPaymentTerms;
  customPaymentTerms?: number; // days for custom terms
  discountPercentage: number;
  currency: string;
  
  // Balance Information
  currentBalance: number; // Amount we owe to vendor
  availableCredit: number;
  totalPurchased: number;
  totalPaid: number;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  
  // Relationship Information
  assignedBuyer?: string;
  branchId?: string;
  vendorSince: string;
  lastOrderDate?: string;
  totalOrders: number;
  averageOrderValue: number;
  
  // Performance Metrics
  onTimeDeliveryRate: number; // percentage
  qualityRating: number; // 1-5 scale
  responseTime: number; // in hours
  
  // Communication Preferences
  preferredContactMethod: 'email' | 'phone' | 'fax' | 'mail';
  preferredLanguage: string;
  
  // Metadata
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type VendorTransaction = {
  id: string;
  vendorId: string;
  type: VendorTransactionType;
  amount: number;
  currency: string;
  description: string;
  reference?: string; // PO number, invoice number, etc.
  paymentMethod?: VendorPaymentMethod;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  dueDate?: string;
  paidDate?: string;
  createdAt: string;
  createdBy: string;
};

export type VendorPayment = {
  id: string;
  vendorId: string;
  amount: number;
  currency: string;
  paymentMethod: VendorPaymentMethod;
  reference: string;
  description?: string;
  appliedToTransactions: string[]; // Array of transaction IDs
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  processedAt: string;
  createdAt: string;
  createdBy: string;
};

export type VendorNote = {
  id: string;
  vendorId: string;
  type: 'general' | 'payment' | 'order' | 'quality' | 'performance';
  title: string;
  content: string;
  isPrivate: boolean;
  createdAt: string;
  createdBy: string;
};

export type VendorContact = {
  id: string;
  vendorId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  position?: string;
  department?: string;
  isPrimary: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// Sample Vendors
export const vendors: Vendor[] = [
  {
    id: 'vend_001',
    vendorNumber: 'VEND-2024-001',
    type: 'supplier',
    status: 'active',
    companyName: 'Premium Paper Co.',
    legalName: 'Premium Paper Company LLC',
    email: 'orders@premiumpaper.com',
    phone: '+1-555-1001',
    website: 'https://premiumpaper.com',
    billingAddress: {
      street: '100 Paper Mill Road',
      city: 'Portland',
      state: 'OR',
      zipCode: '97201',
      country: 'USA',
    },
    shippingAddress: {
      street: '100 Paper Mill Road',
      city: 'Portland',
      state: 'OR',
      zipCode: '97201',
      country: 'USA',
    },
    taxId: '93-1234567',
    industry: 'Paper Manufacturing',
    employeeCount: 250,
    annualRevenue: 15000000,
    certifications: ['ISO 9001', 'FSC Certified'],
    creditLimit: 100000,
    paymentTerms: 'net_30',
    discountPercentage: 5,
    currency: 'USD',
    currentBalance: 25000.00,
    availableCredit: 75000.00,
    totalPurchased: 500000.00,
    totalPaid: 475000.00,
    lastPaymentDate: '2024-01-12T00:00:00Z',
    lastPaymentAmount: 15000.00,
    assignedBuyer: 'user_002',
    branchId: 'br_001',
    vendorSince: '2022-03-15T00:00:00Z',
    lastOrderDate: '2024-01-15T00:00:00Z',
    totalOrders: 85,
    averageOrderValue: 5882.35,
    onTimeDeliveryRate: 95.5,
    qualityRating: 4.8,
    responseTime: 2.5,
    preferredContactMethod: 'email',
    preferredLanguage: 'English',
    notes: 'Reliable paper supplier with excellent quality. Preferred vendor for premium paper products.',
    tags: ['premium', 'paper', 'reliable', 'iso-certified'],
    createdAt: '2022-03-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    createdBy: 'user_002',
  },
  {
    id: 'vend_002',
    vendorNumber: 'VEND-2024-002',
    type: 'service_provider',
    status: 'active',
    companyName: 'Digital Print Solutions',
    email: 'service@digitalprint.com',
    phone: '+1-555-1002',
    website: 'https://digitalprint.com',
    billingAddress: {
      street: '500 Tech Avenue',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA',
    },
    taxId: '94-2345678',
    industry: 'Digital Printing Services',
    employeeCount: 75,
    annualRevenue: 8000000,
    certifications: ['ISO 14001'],
    creditLimit: 50000,
    paymentTerms: 'net_15',
    discountPercentage: 3,
    currency: 'USD',
    currentBalance: 8500.00,
    availableCredit: 41500.00,
    totalPurchased: 150000.00,
    totalPaid: 141500.00,
    lastPaymentDate: '2024-01-10T00:00:00Z',
    lastPaymentAmount: 5000.00,
    assignedBuyer: 'user_003',
    branchId: 'br_002',
    vendorSince: '2023-01-20T00:00:00Z',
    lastOrderDate: '2024-01-14T00:00:00Z',
    totalOrders: 45,
    averageOrderValue: 3333.33,
    onTimeDeliveryRate: 92.0,
    qualityRating: 4.5,
    responseTime: 4.0,
    preferredContactMethod: 'phone',
    preferredLanguage: 'English',
    notes: 'Digital printing services for large format and specialty printing needs.',
    tags: ['digital-printing', 'large-format', 'specialty'],
    createdAt: '2023-01-20T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z',
    createdBy: 'user_003',
  },
  {
    id: 'vend_003',
    vendorNumber: 'VEND-2024-003',
    type: 'contractor',
    status: 'active',
    companyName: 'Express Delivery Services',
    email: 'logistics@expressdelivery.com',
    phone: '+1-555-1003',
    website: 'https://expressdelivery.com',
    billingAddress: {
      street: '200 Logistics Blvd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
    },
    taxId: '95-3456789',
    industry: 'Logistics & Transportation',
    employeeCount: 150,
    annualRevenue: 12000000,
    certifications: ['DOT Certified'],
    creditLimit: 75000,
    paymentTerms: 'net_30',
    discountPercentage: 2,
    currency: 'USD',
    currentBalance: 0.00,
    availableCredit: 75000.00,
    totalPurchased: 200000.00,
    totalPaid: 200000.00,
    lastPaymentDate: '2024-01-08T00:00:00Z',
    lastPaymentAmount: 12000.00,
    assignedBuyer: 'user_002',
    branchId: 'br_001',
    vendorSince: '2022-08-10T00:00:00Z',
    lastOrderDate: '2024-01-13T00:00:00Z',
    totalOrders: 120,
    averageOrderValue: 1666.67,
    onTimeDeliveryRate: 98.0,
    qualityRating: 4.9,
    responseTime: 1.0,
    preferredContactMethod: 'email',
    preferredLanguage: 'English',
    notes: 'Excellent delivery service with 98% on-time delivery rate. Preferred for urgent deliveries.',
    tags: ['logistics', 'delivery', 'express', 'reliable'],
    createdAt: '2022-08-10T00:00:00Z',
    updatedAt: '2024-01-13T00:00:00Z',
    createdBy: 'user_002',
  },
  {
    id: 'vend_004',
    vendorNumber: 'VEND-2024-004',
    type: 'distributor',
    status: 'active',
    companyName: 'Office Supplies Central',
    email: 'sales@officesupplies.com',
    phone: '+1-555-1004',
    website: 'https://officesupplies.com',
    billingAddress: {
      street: '300 Supply Chain Way',
      city: 'Dallas',
      state: 'TX',
      zipCode: '75201',
      country: 'USA',
    },
    taxId: '96-4567890',
    industry: 'Office Supplies Distribution',
    employeeCount: 200,
    annualRevenue: 25000000,
    certifications: ['ISO 9001', 'Green Certified'],
    creditLimit: 150000,
    paymentTerms: 'net_45',
    discountPercentage: 8,
    currency: 'USD',
    currentBalance: 45000.00,
    availableCredit: 105000.00,
    totalPurchased: 800000.00,
    totalPaid: 755000.00,
    lastPaymentDate: '2024-01-05T00:00:00Z',
    lastPaymentAmount: 25000.00,
    assignedBuyer: 'user_003',
    branchId: 'br_002',
    vendorSince: '2021-12-01T00:00:00Z',
    lastOrderDate: '2024-01-12T00:00:00Z',
    totalOrders: 200,
    averageOrderValue: 4000.00,
    onTimeDeliveryRate: 96.5,
    qualityRating: 4.6,
    responseTime: 3.0,
    preferredContactMethod: 'email',
    preferredLanguage: 'English',
    notes: 'Major distributor for office supplies and equipment. Good pricing and bulk discounts.',
    tags: ['office-supplies', 'distributor', 'bulk-discounts'],
    createdAt: '2021-12-01T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
    createdBy: 'user_003',
  },
  {
    id: 'vend_005',
    vendorNumber: 'VEND-2024-005',
    type: 'supplier',
    status: 'inactive',
    companyName: 'Budget Materials Inc.',
    email: 'orders@budgetmaterials.com',
    phone: '+1-555-1005',
    website: 'https://budgetmaterials.com',
    billingAddress: {
      street: '150 Cost Street',
      city: 'Phoenix',
      state: 'AZ',
      zipCode: '85001',
      country: 'USA',
    },
    taxId: '97-5678901',
    industry: 'Materials Supply',
    employeeCount: 50,
    annualRevenue: 5000000,
    creditLimit: 25000,
    paymentTerms: 'net_30',
    discountPercentage: 10,
    currency: 'USD',
    currentBalance: 0.00,
    availableCredit: 25000.00,
    totalPurchased: 75000.00,
    totalPaid: 75000.00,
    lastPaymentDate: '2023-11-15T00:00:00Z',
    lastPaymentAmount: 5000.00,
    assignedBuyer: 'user_002',
    branchId: 'br_001',
    vendorSince: '2023-06-01T00:00:00Z',
    lastOrderDate: '2023-11-15T00:00:00Z',
    totalOrders: 15,
    averageOrderValue: 5000.00,
    onTimeDeliveryRate: 85.0,
    qualityRating: 3.8,
    responseTime: 8.0,
    preferredContactMethod: 'phone',
    preferredLanguage: 'English',
    notes: 'Budget supplier with lower quality standards. Use only for non-critical items.',
    tags: ['budget', 'materials', 'low-cost'],
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2023-11-15T00:00:00Z',
    createdBy: 'user_002',
  },
];

// Sample Vendor Transactions
export const vendorTransactions: VendorTransaction[] = [
  {
    id: 'vtxn_001',
    vendorId: 'vend_001',
    type: 'purchase_order',
    amount: 15000.00,
    currency: 'USD',
    description: 'Premium cardstock order - 10,000 sheets',
    reference: 'PO-2024-001',
    status: 'completed',
    dueDate: '2024-02-15T00:00:00Z',
    createdAt: '2024-01-15T00:00:00Z',
    createdBy: 'user_002',
  },
  {
    id: 'vtxn_002',
    vendorId: 'vend_001',
    type: 'payment',
    amount: 15000.00,
    currency: 'USD',
    description: 'Payment for PO-2024-001',
    reference: 'PAY-2024-001',
    paymentMethod: 'bank_transfer',
    status: 'completed',
    paidDate: '2024-01-12T00:00:00Z',
    createdAt: '2024-01-12T00:00:00Z',
    createdBy: 'user_001',
  },
  {
    id: 'vtxn_003',
    vendorId: 'vend_002',
    type: 'purchase_order',
    amount: 8500.00,
    currency: 'USD',
    description: 'Digital printing services for Q1 campaign',
    reference: 'PO-2024-002',
    status: 'completed',
    dueDate: '2024-01-30T00:00:00Z',
    createdAt: '2024-01-14T00:00:00Z',
    createdBy: 'user_003',
  },
  {
    id: 'vtxn_004',
    vendorId: 'vend_003',
    type: 'purchase_order',
    amount: 12000.00,
    currency: 'USD',
    description: 'Express delivery services for January',
    reference: 'PO-2024-003',
    status: 'completed',
    dueDate: '2024-01-20T00:00:00Z',
    createdAt: '2024-01-13T00:00:00Z',
    createdBy: 'user_002',
  },
  {
    id: 'vtxn_005',
    vendorId: 'vend_003',
    type: 'payment',
    amount: 12000.00,
    currency: 'USD',
    description: 'Payment for delivery services',
    reference: 'PAY-2024-002',
    paymentMethod: 'check',
    status: 'completed',
    paidDate: '2024-01-08T00:00:00Z',
    createdAt: '2024-01-08T00:00:00Z',
    createdBy: 'user_001',
  },
];

// Sample Vendor Payments
export const vendorPayments: VendorPayment[] = [
  {
    id: 'vpay_001',
    vendorId: 'vend_001',
    amount: 15000.00,
    currency: 'USD',
    paymentMethod: 'bank_transfer',
    reference: 'PAY-2024-001',
    description: 'Payment for premium cardstock order',
    appliedToTransactions: ['vtxn_002'],
    status: 'completed',
    processedAt: '2024-01-12T14:30:00Z',
    createdAt: '2024-01-12T14:30:00Z',
    createdBy: 'user_001',
  },
  {
    id: 'vpay_002',
    vendorId: 'vend_003',
    amount: 12000.00,
    currency: 'USD',
    paymentMethod: 'check',
    reference: 'PAY-2024-002',
    description: 'Payment for delivery services',
    appliedToTransactions: ['vtxn_005'],
    status: 'completed',
    processedAt: '2024-01-08T10:15:00Z',
    createdAt: '2024-01-08T10:15:00Z',
    createdBy: 'user_001',
  },
  {
    id: 'vpay_003',
    vendorId: 'vend_004',
    amount: 25000.00,
    currency: 'USD',
    paymentMethod: 'ach',
    reference: 'PAY-2024-003',
    description: 'Monthly office supplies payment',
    appliedToTransactions: [],
    status: 'completed',
    processedAt: '2024-01-05T16:45:00Z',
    createdAt: '2024-01-05T16:45:00Z',
    createdBy: 'user_001',
  },
];

// Sample Vendor Notes
export const vendorNotes: VendorNote[] = [
  {
    id: 'vnote_001',
    vendorId: 'vend_001',
    type: 'quality',
    title: 'Excellent Paper Quality',
    content: 'Premium Paper Co. consistently delivers high-quality paper products. Their FSC certification ensures sustainable sourcing.',
    isPrivate: false,
    createdAt: '2024-01-15T00:00:00Z',
    createdBy: 'user_002',
  },
  {
    id: 'vnote_002',
    vendorId: 'vend_001',
    type: 'payment',
    title: 'Payment History',
    content: 'Always pays on time. Consider increasing credit limit due to excellent payment history.',
    isPrivate: true,
    createdAt: '2024-01-12T00:00:00Z',
    createdBy: 'user_001',
  },
  {
    id: 'vnote_003',
    vendorId: 'vend_003',
    type: 'performance',
    title: 'Outstanding Delivery Performance',
    content: 'Express Delivery Services has a 98% on-time delivery rate. Highly recommended for urgent deliveries.',
    isPrivate: false,
    createdAt: '2024-01-13T00:00:00Z',
    createdBy: 'user_002',
  },
];

// Sample Vendor Contacts
export const vendorContacts: VendorContact[] = [
  {
    id: 'vcontact_001',
    vendorId: 'vend_001',
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah.wilson@premiumpaper.com',
    phone: '+1-555-1001',
    position: 'Sales Manager',
    department: 'Sales',
    isPrimary: true,
    isActive: true,
    createdAt: '2022-03-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'vcontact_002',
    vendorId: 'vend_001',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@premiumpaper.com',
    phone: '+1-555-1002',
    position: 'Account Manager',
    department: 'Customer Service',
    isPrimary: false,
    isActive: true,
    createdAt: '2022-03-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'vcontact_003',
    vendorId: 'vend_002',
    firstName: 'Jennifer',
    lastName: 'Davis',
    email: 'jennifer.davis@digitalprint.com',
    phone: '+1-555-1003',
    position: 'Service Coordinator',
    department: 'Operations',
    isPrimary: true,
    isActive: true,
    createdAt: '2023-01-20T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z',
  },
];

// POS System Types
export type PaymentMethod = 'cash' | 'credit_card' | 'debit_card' | 'mobile_payment' | 'check' | 'store_credit';

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';

export type CartItem = {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customizations?: {
    [key: string]: string | number;
  };
  notes?: string;
};

export type POSOrder = {
  id: string;
  orderNumber: string;
  customerId?: string;
  customer?: Customer;
  items: CartItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'partial' | 'refunded';
  status: OrderStatus;
  cashierId: string;
  cashier?: User;
  branchId: string;
  branch?: Branch;
  notes?: string;
  createdAt: string;
  completedAt?: string;
};

export type Receipt = {
  id: string;
  orderId: string;
  order: POSOrder;
  receiptNumber: string;
  printedAt: string;
  printedBy: string;
  isReprint: boolean;
};

// Sample POS Orders
export const posOrders: POSOrder[] = [
  {
    id: 'pos_001',
    orderNumber: 'POS-2024-001',
    customerId: 'cust_001',
    items: [
      {
        id: 'item_001',
        productId: 'prod_001',
        product: products[0], // Business Cards
        quantity: 500,
        unitPrice: 0.25,
        totalPrice: 125.00,
        customizations: {
          paper_type: 'premium_glossy',
          corners: 'rounded'
        }
      },
      {
        id: 'item_002',
        productId: 'prod_007',
        product: products[1], // Promotional Pens
        quantity: 50,
        unitPrice: 2.50,
        totalPrice: 125.00,
        customizations: {
          pen_color: 'blue'
        }
      }
    ],
    subtotal: 250.00,
    taxAmount: 20.00,
    discountAmount: 12.50,
    totalAmount: 257.50,
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    status: 'completed',
    cashierId: 'user_001',
    branchId: 'br_001',
    notes: 'Rush order for client presentation',
    createdAt: '2024-01-15T10:30:00Z',
    completedAt: '2024-01-15T10:35:00Z',
  },
  {
    id: 'pos_002',
    orderNumber: 'POS-2024-002',
    customerId: 'cust_003',
    items: [
      {
        id: 'item_003',
        productId: 'prod_007',
        product: products[2], // Graphic Design Service
        quantity: 1,
        unitPrice: 150.00,
        totalPrice: 150.00,
        customizations: {
          complexity: 'medium',
          timeline: 'rush'
        }
      }
    ],
    subtotal: 150.00,
    taxAmount: 12.00,
    discountAmount: 0.00,
    totalAmount: 162.00,
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    status: 'completed',
    cashierId: 'user_002',
    branchId: 'br_002',
    createdAt: '2024-01-15T14:20:00Z',
    completedAt: '2024-01-15T14:25:00Z',
  },
  {
    id: 'pos_003',
    orderNumber: 'POS-2024-003',
    items: [
      {
        id: 'item_004',
        productId: 'prod_004',
        product: products[3], // Starter Marketing Package
        quantity: 1,
        unitPrice: 199.99,
        totalPrice: 199.99,
        customizations: {}
      }
    ],
    subtotal: 199.99,
    taxAmount: 16.00,
    discountAmount: 30.00,
    totalAmount: 185.99,
    paymentMethod: 'mobile_payment',
    paymentStatus: 'paid',
    status: 'completed',
    cashierId: 'user_001',
    branchId: 'br_001',
    createdAt: '2024-01-15T16:45:00Z',
    completedAt: '2024-01-15T16:50:00Z',
  },
];

// Sample Receipts
export const receipts: Receipt[] = [
  {
    id: 'receipt_001',
    orderId: 'pos_001',
    order: posOrders[0],
    receiptNumber: 'RCP-2024-001',
    printedAt: '2024-01-15T10:35:00Z',
    printedBy: 'user_001',
    isReprint: false,
  },
  {
    id: 'receipt_002',
    orderId: 'pos_002',
    order: posOrders[1],
    receiptNumber: 'RCP-2024-002',
    printedAt: '2024-01-15T14:25:00Z',
    printedBy: 'user_002',
    isReprint: false,
  },
  {
    id: 'receipt_003',
    orderId: 'pos_003',
    order: posOrders[2],
    receiptNumber: 'RCP-2024-003',
    printedAt: '2024-01-15T16:50:00Z',
    printedBy: 'user_001',
    isReprint: false,
  },
];

// Sales Order Management Types
export type SalesOrderStatus = 'draft' | 'pending' | 'confirmed' | 'in_production' | 'ready_for_pickup' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'on_hold';

export type SalesOrderPriority = 'low' | 'normal' | 'high' | 'urgent';

export type SalesOrderSource = 'pos' | 'online' | 'phone' | 'email' | 'walk_in' | 'sales_rep';

export type SalesOrderItem = {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  discount: number; // percentage or fixed amount
  taxRate: number;
  totalPrice: number;
  customizations?: Record<string, any>; // For print specifications, service options, etc.
  notes?: string;
  estimatedCompletionDate?: string;
  actualCompletionDate?: string;
  status: 'pending' | 'in_production' | 'completed' | 'cancelled';
};

export type SalesOrderPayment = {
  id: string;
  amount: number;
  method: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'check' | 'mobile_payment' | 'store_credit';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  processedAt?: string;
  processedBy?: string;
  notes?: string;
};

export type SalesOrderShipping = {
  id: string;
  method: 'pickup' | 'delivery' | 'shipping';
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactPerson?: string;
  contactPhone?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  trackingNumber?: string;
  carrier?: string;
  cost: number;
  status: 'pending' | 'in_transit' | 'delivered' | 'failed';
  notes?: string;
};

export type SalesOrder = {
  id: string;
  orderNumber: string;
  customerId?: string;
  customer?: Customer;
  branchId: string;
  branch: Branch;
  source: SalesOrderSource;
  status: SalesOrderStatus;
  priority: SalesOrderPriority;
  orderDate: string;
  requiredDate?: string;
  shippedDate?: string;
  deliveredDate?: string;
  completedDate?: string;
  items: SalesOrderItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingCost: number;
  totalAmount: number;
  payments: SalesOrderPayment[];
  shipping?: SalesOrderShipping;
  notes?: string;
  internalNotes?: string;
  createdBy: string;
  createdByUser?: User;
  assignedTo?: string;
  assignedToUser?: User;
  lastModifiedBy?: string;
  lastModifiedByUser?: User;
  lastModifiedAt?: string;
  tags?: string[];
  attachments?: string[]; // File URLs
  estimatedCompletionDate?: string;
  actualCompletionDate?: string;
};

// Order Status History
export type OrderStatusHistory = {
  id: string;
  orderId: string;
  status: SalesOrderStatus;
  previousStatus?: SalesOrderStatus;
  changedBy: string;
  changedByUser?: User;
  changedAt: string;
  reason?: string;
  notes?: string;
};

// Order Comments/Notes
export type OrderComment = {
  id: string;
  orderId: string;
  comment: string;
  type: 'internal' | 'customer' | 'system';
  createdBy: string;
  createdByUser?: User;
  createdAt: string;
  isPrivate: boolean;
};

// Order Templates
export type OrderTemplate = {
  id: string;
  name: string;
  description?: string;
  categoryId?: string;
  items: Omit<SalesOrderItem, 'id' | 'product'>[];
  defaultNotes?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

// Sample Sales Orders
export const salesOrders: SalesOrder[] = [
  {
    id: 'so_001',
    orderNumber: 'SO-2024-001',
    customerId: 'cust_001',
    customer: {
      id: 'cust_001',
      name: 'Acme Corporation',
      email: 'orders@acme.com',
      phone: '+1-555-0123',
      type: 'business',
      status: 'active',
      balance: 0,
      creditLimit: 10000,
      paymentTerms: 'net_30',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      address: {
        street: '123 Business Ave',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      contacts: [],
      notes: [],
      transactions: []
    },
    branchId: 'br_001',
    branch: {
      id: 'br_001',
      name: 'Main Branch',
      address: '123 Main St, City, State 12345',
      phone: '+1-555-0100',
      email: 'main@printpoint.com',
      manager: 'John Manager',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    source: 'online',
    status: 'in_production',
    priority: 'normal',
    orderDate: '2024-01-15T10:00:00Z',
    requiredDate: '2024-01-20T17:00:00Z',
    items: [
      {
        id: 'soi_001',
        productId: 'prod_001',
        product: {
          id: 'prod_001',
          name: 'Premium Business Cards',
          description: 'High-quality business cards with premium finish',
          categoryId: 'cat_005',
          price: 0.25,
          cost: 0.15,
          sku: 'BC-PREM-001',
          barcode: '1234567890123',
          type: 'print_item',
          printSpecifications: [
            {
              id: 'ps_001',
              name: 'Paper Type',
              description: 'Choose paper quality',
              category: 'paper',
              options: [
                { id: 'po_001', name: 'Premium Matte', priceModifier: 0.05 },
                { id: 'po_002', name: 'Glossy Finish', priceModifier: 0.10 }
              ]
            }
          ],
          printTime: 2,
          printComplexity: 'medium',
          printEquipment: ['digital_printer', 'cutter'],
          isActive: true,
          isDigital: true,
          weight: 5,
          dimensions: { length: 8.5, width: 5.5, height: 0.01 },
          minStockLevel: 1000,
          maxStockLevel: 10000,
          reorderPoint: 2000,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        quantity: 1000,
        unitPrice: 0.25,
        discount: 0,
        taxRate: 0.08,
        totalPrice: 270.00,
        customizations: {
          paperType: 'premium_matte',
          finish: 'matte'
        },
        status: 'in_production',
        estimatedCompletionDate: '2024-01-18T17:00:00Z'
      }
    ],
    subtotal: 250.00,
    discountAmount: 0,
    taxAmount: 20.00,
    shippingCost: 0,
    totalAmount: 270.00,
    payments: [
      {
        id: 'sop_001',
        amount: 270.00,
        method: 'credit_card',
        status: 'completed',
        transactionId: 'txn_123456',
        processedAt: '2024-01-15T10:05:00Z',
        processedBy: 'user_001'
      }
    ],
    shipping: {
      id: 'sos_001',
      method: 'pickup',
      cost: 0,
      status: 'pending'
    },
    notes: 'Customer requested premium matte finish',
    createdBy: 'user_001',
    assignedTo: 'user_002',
    tags: ['urgent', 'premium'],
    estimatedCompletionDate: '2024-01-18T17:00:00Z'
  },
  {
    id: 'so_002',
    orderNumber: 'SO-2024-002',
    customerId: 'cust_002',
    customer: {
      id: 'cust_002',
      name: 'Jane Smith',
      email: 'jane@email.com',
      phone: '+1-555-0456',
      type: 'individual',
      status: 'active',
      balance: 0,
      creditLimit: 1000,
      paymentTerms: 'net_15',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      address: {
        street: '456 Personal St',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA'
      },
      contacts: [],
      notes: [],
      transactions: []
    },
    branchId: 'br_001',
    branch: {
      id: 'br_001',
      name: 'Main Branch',
      address: '123 Main St, City, State 12345',
      phone: '+1-555-0100',
      email: 'main@printpoint.com',
      manager: 'John Manager',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    source: 'pos',
    status: 'completed',
    priority: 'normal',
    orderDate: '2024-01-14T14:30:00Z',
    requiredDate: '2024-01-16T17:00:00Z',
    shippedDate: '2024-01-16T10:00:00Z',
    deliveredDate: '2024-01-16T15:30:00Z',
    completedDate: '2024-01-16T15:30:00Z',
    items: [
      {
        id: 'soi_002',
        productId: 'prod_007',
        product: {
          id: 'prod_007',
          name: 'Marketing Flyers',
          description: 'Full-color marketing flyers',
          categoryId: 'cat_007',
          price: 0.20,
          cost: 0.12,
          sku: 'FLY-001',
          barcode: '1234567890124',
          type: 'print_item',
          printSpecifications: [
            {
              id: 'ps_002',
              name: 'Paper Weight',
              description: 'Choose paper thickness',
              category: 'paper',
              options: [
                { id: 'po_003', name: '80lb Gloss', priceModifier: 0 },
                { id: 'po_004', name: '100lb Gloss', priceModifier: 0.05 }
              ]
            }
          ],
          printTime: 1,
          printComplexity: 'simple',
          printEquipment: ['digital_printer'],
          isActive: true,
          isDigital: true,
          weight: 3,
          dimensions: { length: 8.3, width: 11.7, height: 0.01 },
          minStockLevel: 500,
          maxStockLevel: 5000,
          reorderPoint: 1000,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        quantity: 500,
        unitPrice: 0.20,
        discount: 10, // 10% discount
        taxRate: 0.08,
        totalPrice: 97.20,
        customizations: {
          paperWeight: '80lb_gloss'
        },
        status: 'completed',
        estimatedCompletionDate: '2024-01-16T12:00:00Z',
        actualCompletionDate: '2024-01-16T11:30:00Z'
      }
    ],
    subtotal: 100.00,
    discountAmount: 10.00,
    taxAmount: 7.20,
    shippingCost: 0,
    totalAmount: 97.20,
    payments: [
      {
        id: 'sop_002',
        amount: 97.20,
        method: 'cash',
        status: 'completed',
        processedAt: '2024-01-14T14:35:00Z',
        processedBy: 'user_001'
      }
    ],
    shipping: {
      id: 'sos_002',
      method: 'pickup',
      cost: 0,
      status: 'delivered',
      actualDeliveryDate: '2024-01-16T15:30:00Z'
    },
    notes: 'Customer picked up order',
    createdBy: 'user_001',
    assignedTo: 'user_002',
    tags: ['completed', 'discount_applied']
  }
];

// Sample Order Status History
export const orderStatusHistory: OrderStatusHistory[] = [
  {
    id: 'osh_001',
    orderId: 'so_001',
    status: 'draft',
    changedBy: 'user_001',
    changedAt: '2024-01-15T10:00:00Z',
    reason: 'Order created'
  },
  {
    id: 'osh_002',
    orderId: 'so_001',
    status: 'confirmed',
    previousStatus: 'draft',
    changedBy: 'user_002',
    changedAt: '2024-01-15T10:30:00Z',
    reason: 'Order confirmed and payment received'
  },
  {
    id: 'osh_003',
    orderId: 'so_001',
    status: 'in_production',
    previousStatus: 'confirmed',
    changedBy: 'user_003',
    changedAt: '2024-01-15T11:00:00Z',
    reason: 'Production started'
  }
];

// Sample Order Comments
export const orderComments: OrderComment[] = [
  {
    id: 'oc_001',
    orderId: 'so_001',
    comment: 'Customer requested premium matte finish for business cards',
    type: 'customer',
    createdBy: 'user_001',
    createdAt: '2024-01-15T10:00:00Z',
    isPrivate: false
  },
  {
    id: 'oc_002',
    orderId: 'so_001',
    comment: 'Paper stock is running low, need to reorder',
    type: 'internal',
    createdBy: 'user_003',
    createdAt: '2024-01-15T11:15:00Z',
    isPrivate: true
  }
];

// Sample Order Templates
export const orderTemplates: OrderTemplate[] = [
  {
    id: 'ot_001',
    name: 'Standard Business Card Order',
    description: 'Template for standard business card orders',
    categoryId: 'cat_005',
    items: [
      {
        productId: 'prod_001',
        quantity: 1000,
        unitPrice: 0.25,
        discount: 0,
        taxRate: 0.08,
        totalPrice: 270.00,
        status: 'pending',
        customizations: {
          paperType: 'standard_matte'
        }
      }
    ],
    defaultNotes: 'Standard business card order',
    isActive: true,
    createdBy: 'user_001',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Order Pipeline Types
export type PipelineStage = {
  id: string;
  name: string;
  description: string;
  status: SalesOrderStatus;
  color: string;
  icon: string;
  order: number;
  isActive: boolean;
  estimatedDuration?: number; // in hours
  requiredRole?: string;
  canSkip: boolean;
  autoAdvance: boolean;
  conditions?: {
    requiresApproval?: boolean;
    requiresPayment?: boolean;
    requiresInventory?: boolean;
    requiresCustomerAction?: boolean;
  };
};

export type PipelineTransition = {
  id: string;
  fromStageId: string;
  toStageId: string;
  name: string;
  description?: string;
  isAutomatic: boolean;
  conditions?: {
    timeBased?: number; // hours
    userAction?: boolean;
    systemCheck?: boolean;
  };
  actions?: string[];
};

export type OrderPipeline = {
  id: string;
  name: string;
  description: string;
  stages: PipelineStage[];
  transitions: PipelineTransition[];
  isDefault: boolean;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type OrderPipelineInstance = {
  id: string;
  orderId: string;
  pipelineId: string;
  currentStageId: string;
  stageHistory: {
    stageId: string;
    enteredAt: string;
    exitedAt?: string;
    enteredBy: string;
    notes?: string;
  }[];
  isCompleted: boolean;
  completedAt?: string;
  startedAt: string;
  estimatedCompletionAt?: string;
};

// Sample Pipeline Stages
export const pipelineStages: PipelineStage[] = [
  {
    id: 'stage_draft',
    name: 'Draft',
    description: 'Order is being created',
    status: 'draft',
    color: 'bg-gray-100 text-gray-800',
    icon: 'FileText',
    order: 1,
    isActive: true,
    estimatedDuration: 1,
    canSkip: false,
    autoAdvance: false,
    conditions: {
      requiresApproval: false,
      requiresPayment: false,
      requiresInventory: false,
      requiresCustomerAction: false
    }
  },
  {
    id: 'stage_pending',
    name: 'Pending Review',
    description: 'Order awaiting confirmation',
    status: 'pending',
    color: 'bg-yellow-100 text-yellow-800',
    icon: 'Clock',
    order: 2,
    isActive: true,
    estimatedDuration: 4,
    canSkip: false,
    autoAdvance: false,
    conditions: {
      requiresApproval: true,
      requiresPayment: false,
      requiresInventory: false,
      requiresCustomerAction: false
    }
  },
  {
    id: 'stage_confirmed',
    name: 'Confirmed',
    description: 'Order confirmed and ready for production',
    status: 'confirmed',
    color: 'bg-blue-100 text-blue-800',
    icon: 'CheckCircle',
    order: 3,
    isActive: true,
    estimatedDuration: 2,
    canSkip: false,
    autoAdvance: true,
    conditions: {
      requiresApproval: false,
      requiresPayment: true,
      requiresInventory: true,
      requiresCustomerAction: false
    }
  },
  {
    id: 'stage_production',
    name: 'In Production',
    description: 'Order is being manufactured',
    status: 'in_production',
    color: 'bg-purple-100 text-purple-800',
    icon: 'Package',
    order: 4,
    isActive: true,
    estimatedDuration: 24,
    canSkip: false,
    autoAdvance: false,
    conditions: {
      requiresApproval: false,
      requiresPayment: false,
      requiresInventory: true,
      requiresCustomerAction: false
    }
  },
  {
    id: 'stage_quality',
    name: 'Quality Check',
    description: 'Order undergoing quality inspection',
    status: 'in_production',
    color: 'bg-indigo-100 text-indigo-800',
    icon: 'Search',
    order: 5,
    isActive: true,
    estimatedDuration: 2,
    canSkip: true,
    autoAdvance: true,
    conditions: {
      requiresApproval: false,
      requiresPayment: false,
      requiresInventory: false,
      requiresCustomerAction: false
    }
  },
  {
    id: 'stage_ready',
    name: 'Ready for Pickup',
    description: 'Order completed and ready for customer',
    status: 'ready_for_pickup',
    color: 'bg-orange-100 text-orange-800',
    icon: 'Truck',
    order: 6,
    isActive: true,
    estimatedDuration: 1,
    canSkip: false,
    autoAdvance: false,
    conditions: {
      requiresApproval: false,
      requiresPayment: false,
      requiresInventory: false,
      requiresCustomerAction: true
    }
  },
  {
    id: 'stage_shipped',
    name: 'Shipped',
    description: 'Order has been shipped to customer',
    status: 'shipped',
    color: 'bg-cyan-100 text-cyan-800',
    icon: 'Truck',
    order: 7,
    isActive: true,
    estimatedDuration: 48,
    canSkip: true,
    autoAdvance: true,
    conditions: {
      requiresApproval: false,
      requiresPayment: false,
      requiresInventory: false,
      requiresCustomerAction: false
    }
  },
  {
    id: 'stage_delivered',
    name: 'Delivered',
    description: 'Order has been delivered to customer',
    status: 'delivered',
    color: 'bg-green-100 text-green-800',
    icon: 'CheckCircle',
    order: 8,
    isActive: true,
    estimatedDuration: 1,
    canSkip: false,
    autoAdvance: true,
    conditions: {
      requiresApproval: false,
      requiresPayment: false,
      requiresInventory: false,
      requiresCustomerAction: false
    }
  },
  {
    id: 'stage_completed',
    name: 'Completed',
    description: 'Order fully completed and closed',
    status: 'completed',
    color: 'bg-green-100 text-green-800',
    icon: 'CheckCircle',
    order: 9,
    isActive: true,
    estimatedDuration: 0,
    canSkip: false,
    autoAdvance: false,
    conditions: {
      requiresApproval: false,
      requiresPayment: false,
      requiresInventory: false,
      requiresCustomerAction: false
    }
  }
];

// Sample Pipeline Transitions
export const pipelineTransitions: PipelineTransition[] = [
  {
    id: 'trans_1',
    fromStageId: 'stage_draft',
    toStageId: 'stage_pending',
    name: 'Submit for Review',
    description: 'Submit order for manager approval',
    isAutomatic: false,
    conditions: {
      userAction: true
    },
    actions: ['validate_order', 'check_inventory', 'calculate_pricing']
  },
  {
    id: 'trans_2',
    fromStageId: 'stage_pending',
    toStageId: 'stage_confirmed',
    name: 'Approve Order',
    description: 'Manager approves the order',
    isAutomatic: false,
    conditions: {
      userAction: true
    },
    actions: ['approve_order', 'reserve_inventory', 'process_payment']
  },
  {
    id: 'trans_3',
    fromStageId: 'stage_confirmed',
    toStageId: 'stage_production',
    name: 'Start Production',
    description: 'Begin manufacturing process',
    isAutomatic: true,
    conditions: {
      timeBased: 2
    },
    actions: ['assign_production', 'schedule_equipment', 'notify_team']
  },
  {
    id: 'trans_4',
    fromStageId: 'stage_production',
    toStageId: 'stage_quality',
    name: 'Production Complete',
    description: 'Move to quality inspection',
    isAutomatic: false,
    conditions: {
      userAction: true
    },
    actions: ['complete_production', 'schedule_quality_check']
  },
  {
    id: 'trans_5',
    fromStageId: 'stage_quality',
    toStageId: 'stage_ready',
    name: 'Quality Approved',
    description: 'Quality check passed',
    isAutomatic: true,
    conditions: {
      timeBased: 1
    },
    actions: ['approve_quality', 'prepare_for_pickup']
  },
  {
    id: 'trans_6',
    fromStageId: 'stage_ready',
    toStageId: 'stage_shipped',
    name: 'Ship Order',
    description: 'Ship order to customer',
    isAutomatic: false,
    conditions: {
      userAction: true
    },
    actions: ['create_shipment', 'generate_tracking', 'notify_customer']
  },
  {
    id: 'trans_7',
    fromStageId: 'stage_shipped',
    toStageId: 'stage_delivered',
    name: 'Mark as Delivered',
    description: 'Confirm delivery to customer',
    isAutomatic: false,
    conditions: {
      userAction: true
    },
    actions: ['confirm_delivery', 'update_inventory', 'send_receipt']
  },
  {
    id: 'trans_8',
    fromStageId: 'stage_delivered',
    toStageId: 'stage_completed',
    name: 'Complete Order',
    description: 'Finalize and close order',
    isAutomatic: true,
    conditions: {
      timeBased: 24
    },
    actions: ['finalize_order', 'update_customer_history', 'generate_report']
  }
];

// Sample Order Pipelines
export const orderPipelines: OrderPipeline[] = [
  {
    id: 'pipeline_standard',
    name: 'Standard Order Pipeline',
    description: 'Default pipeline for most print orders',
    stages: pipelineStages,
    transitions: pipelineTransitions,
    isDefault: true,
    isActive: true,
    createdBy: 'user_001',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'pipeline_rush',
    name: 'Rush Order Pipeline',
    description: 'Expedited pipeline for urgent orders',
    stages: pipelineStages.filter(stage => 
      !['stage_quality'].includes(stage.id)
    ),
    transitions: pipelineTransitions.filter(trans => 
      !['trans_4', 'trans_5'].includes(trans.id)
    ),
    isDefault: false,
    isActive: true,
    createdBy: 'user_001',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'pipeline_digital',
    name: 'Digital Order Pipeline',
    description: 'Simplified pipeline for digital-only orders',
    stages: pipelineStages.filter(stage => 
      ['stage_draft', 'stage_pending', 'stage_confirmed', 'stage_production', 'stage_ready', 'stage_completed'].includes(stage.id)
    ),
    transitions: pipelineTransitions.filter(trans => 
      ['trans_1', 'trans_2', 'trans_3', 'trans_6', 'trans_8'].includes(trans.id)
    ),
    isDefault: false,
    isActive: true,
    createdBy: 'user_001',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Sample Pipeline Instances
export const orderPipelineInstances: OrderPipelineInstance[] = [
  {
    id: 'instance_001',
    orderId: 'so_001',
    pipelineId: 'pipeline_standard',
    currentStageId: 'stage_production',
    stageHistory: [
      {
        stageId: 'stage_draft',
        enteredAt: '2024-01-15T10:00:00Z',
        exitedAt: '2024-01-15T10:30:00Z',
        enteredBy: 'user_001',
        notes: 'Order created'
      },
      {
        stageId: 'stage_pending',
        enteredAt: '2024-01-15T10:30:00Z',
        exitedAt: '2024-01-15T11:00:00Z',
        enteredBy: 'user_001',
        notes: 'Submitted for review'
      },
      {
        stageId: 'stage_confirmed',
        enteredAt: '2024-01-15T11:00:00Z',
        exitedAt: '2024-01-15T13:00:00Z',
        enteredBy: 'user_002',
        notes: 'Order approved and payment received'
      },
      {
        stageId: 'stage_production',
        enteredAt: '2024-01-15T13:00:00Z',
        enteredBy: 'system',
        notes: 'Production started automatically'
      }
    ],
    isCompleted: false,
    startedAt: '2024-01-15T10:00:00Z',
    estimatedCompletionAt: '2024-01-18T17:00:00Z'
  },
  {
    id: 'instance_002',
    orderId: 'so_002',
    pipelineId: 'pipeline_standard',
    currentStageId: 'stage_completed',
    stageHistory: [
      {
        stageId: 'stage_draft',
        enteredAt: '2024-01-14T14:30:00Z',
        exitedAt: '2024-01-14T14:35:00Z',
        enteredBy: 'user_001',
        notes: 'Order created'
      },
      {
        stageId: 'stage_pending',
        enteredAt: '2024-01-14T14:35:00Z',
        exitedAt: '2024-01-14T15:00:00Z',
        enteredBy: 'user_001',
        notes: 'Submitted for review'
      },
      {
        stageId: 'stage_confirmed',
        enteredAt: '2024-01-14T15:00:00Z',
        exitedAt: '2024-01-15T08:00:00Z',
        enteredBy: 'user_002',
        notes: 'Order approved'
      },
      {
        stageId: 'stage_production',
        enteredAt: '2024-01-15T08:00:00Z',
        exitedAt: '2024-01-16T10:00:00Z',
        enteredBy: 'system',
        notes: 'Production completed'
      },
      {
        stageId: 'stage_quality',
        enteredAt: '2024-01-16T10:00:00Z',
        exitedAt: '2024-01-16T11:00:00Z',
        enteredBy: 'user_003',
        notes: 'Quality check passed'
      },
      {
        stageId: 'stage_ready',
        enteredAt: '2024-01-16T11:00:00Z',
        exitedAt: '2024-01-16T15:30:00Z',
        enteredBy: 'system',
        notes: 'Ready for pickup'
      },
      {
        stageId: 'stage_completed',
        enteredAt: '2024-01-16T15:30:00Z',
        enteredBy: 'user_001',
        notes: 'Order completed and delivered'
      }
    ],
    isCompleted: true,
    completedAt: '2024-01-16T15:30:00Z',
    startedAt: '2024-01-14T14:30:00Z',
    estimatedCompletionAt: '2024-01-16T17:00:00Z'
  }
];

export const sampleOrders: Order[] = [
    {
        id: 'PP-12345',
        customerName: 'John Doe',
        status: 'In Production',
        items: [
            { productName: 'Business Cards', quantity: 250 },
            { productName: 'Promotional Flyers', quantity: 500 },
        ],
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toDateString(),
    },
    {
        id: 'PP-67890',
        customerName: 'Jane Smith',
        status: 'Delivered',
        items: [
            { productName: 'Vinyl Banners', quantity: 2 },
        ],
        estimatedDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toDateString(),
    }
]
