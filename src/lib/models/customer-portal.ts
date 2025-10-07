// Customer Portal Data Models

export interface CustomerProfile {
  _id?: string;
  id?: string;
  customerId: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  
  // Address Information
  primaryAddress: Address;
  shippingAddresses: Address[];
  billingAddresses: Address[];
  
  // Business Information
  taxNumber: string;
  vatNumber?: string;
  businessRegistration: string;
  industry: string;
  
  // Account Settings
  currency: string;
  paymentTerms: string;
  creditLimit: number;
  currentBalance: number;
  outstandingBalance: number;
  
  // Portal Settings
  preferences: CustomerPreferences;
  notifications: NotificationSettings;
  
  // Security
  lastLogin?: Date;
  loginAttempts: number;
  accountStatus: CustomerAccountStatus;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface Address {
  _id?: string;
  id?: string;
  type: AddressType;
  isDefault: boolean;
  label: string; // Home, Office, Warehouse, etc.
  companyName?: string;
  contactPerson: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  email?: string;
  instructions?: string;
}

export interface CustomerPreferences {
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  theme: 'light' | 'dark' | 'auto';
  dashboardLayout: 'compact' | 'detailed';
  emailNotifications: boolean;
  smsNotifications: boolean;
  orderConfirmations: boolean;
  shipmentUpdates: boolean;
  invoiceNotifications: boolean;
  marketingEmails: boolean;
}

export interface NotificationSettings {
  newOrders: boolean;
  orderUpdates: boolean;
  shipmentUpdates: boolean;
  invoices: boolean;
  payments: boolean;
  quotes: boolean;
  supportTickets: boolean;
  marketing: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
}

export interface CustomerOrder {
  _id?: string;
  id?: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  orderDate: Date;
  requiredDate?: Date;
  shippedDate?: Date;
  status: OrderStatus;
  
  // Order Details
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  
  // Shipping & Billing
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethod: string;
  trackingNumber?: string;
  
  // Payment
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  paymentTerms: string;
  dueDate?: Date;
  
  // Additional Info
  notes?: string;
  specialInstructions?: string;
  salespersonId?: string;
  salespersonName?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface OrderItem {
  _id?: string;
  id?: string;
  productId: string;
  productName: string;
  productCode: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  taxRate: number;
  lineTotal: number;
  imageUrl?: string;
}

export interface CustomerQuote {
  _id?: string;
  id?: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  quoteDate: Date;
  validUntil: Date;
  status: QuoteStatus;
  
  // Quote Details
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  
  // Terms
  paymentTerms: string;
  deliveryTerms: string;
  validityPeriod: number; // in days
  
  // Approval
  approvedBy?: string;
  approvedDate?: Date;
  rejectionReason?: string;
  
  // Conversion
  convertedToOrder?: string;
  conversionDate?: Date;
  
  // Additional Info
  notes?: string;
  salespersonId?: string;
  salespersonName?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface CustomerInvoice {
  _id?: string;
  id?: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  invoiceDate: Date;
  dueDate: Date;
  status: InvoiceStatus;
  
  // Invoice Details
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  currency: string;
  
  // Related Documents
  orderId?: string;
  orderNumber?: string;
  quoteId?: string;
  quoteNumber?: string;
  
  // Payment
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  paymentDate?: Date;
  paymentReference?: string;
  
  // Additional Info
  notes?: string;
  terms?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface Shipment {
  _id?: string;
  id?: string;
  shipmentNumber: string;
  customerId: string;
  customerName: string;
  orderId: string;
  orderNumber: string;
  
  // Shipment Details
  carrier: string;
  trackingNumber: string;
  shippingMethod: string;
  shippingDate: Date;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  
  // Status & Location
  status: ShipmentStatus;
  currentLocation?: string;
  locationHistory: ShipmentLocation[];
  
  // Items
  items: ShipmentItem[];
  totalWeight: number;
  totalValue: number;
  
  // Delivery
  deliveryAddress: Address;
  deliveryInstructions?: string;
  signatureRequired: boolean;
  signatureReceived?: boolean;
  
  // Additional Info
  notes?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface ShipmentLocation {
  location: string;
  timestamp: Date;
  status: string;
  notes?: string;
}

export interface ShipmentItem {
  _id?: string;
  id?: string;
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  unitWeight: number;
  totalWeight: number;
}

export interface Payment {
  _id?: string;
  id?: string;
  paymentNumber: string;
  customerId: string;
  customerName: string;
  invoiceId?: string;
  invoiceNumber?: string;
  paymentDate: Date;
  amount: number;
  currency: string;
  
  // Payment Method
  paymentMethod: PaymentMethod;
  paymentReference: string;
  gatewayTransactionId?: string;
  
  // Status
  status: PaymentStatus;
  processedDate?: Date;
  failureReason?: string;
  
  // Bank Details (for bank transfers)
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface SupportTicket {
  _id?: string;
  id?: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  category: TicketCategory;
  
  // Related Items
  orderId?: string;
  orderNumber?: string;
  invoiceId?: string;
  invoiceNumber?: string;
  
  // Assignments
  assignedTo?: string;
  assignedToName?: string;
  
  // Timeline
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  
  // Messages
  messages: TicketMessage[];
  
  // Metadata
  createdBy: string;
  updatedBy: string;
}

export interface TicketMessage {
  _id?: string;
  id?: string;
  message: string;
  senderId: string;
  senderName: string;
  senderType: 'customer' | 'support';
  attachments?: string[];
  createdAt: Date;
}

export interface ReturnRequest {
  _id?: string;
  id?: string;
  returnNumber: string;
  customerId: string;
  customerName: string;
  orderId: string;
  orderNumber: string;
  requestDate: Date;
  status: ReturnStatus;
  reason: ReturnReason;
  
  // Items to Return
  items: ReturnItem[];
  totalValue: number;
  refundAmount: number;
  
  // Approval
  approvedBy?: string;
  approvedDate?: Date;
  approvalNotes?: string;
  
  // Processing
  receivedDate?: Date;
  processedDate?: Date;
  refundDate?: Date;
  
  // Additional Info
  notes?: string;
  customerNotes?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface ReturnItem {
  _id?: string;
  id?: string;
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
  reason: string;
  condition: 'new' | 'used' | 'damaged' | 'defective';
}

// Enums

export enum AddressType {
  SHIPPING = 'shipping',
  BILLING = 'billing',
  BOTH = 'both'
}

export enum CustomerAccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_APPROVAL = 'pending_approval'
}

export enum OrderStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  ON_HOLD = 'on_hold'
}

export enum QuoteStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  CONVERTED = 'converted'
}

export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
  PARTIALLY_PAID = 'partially_paid'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum ShipmentStatus {
  PENDING = 'pending',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  FAILED_DELIVERY = 'failed_delivery',
  RETURNED = 'returned'
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  PAYPAL = 'paypal',
  STRIPE = 'stripe',
  CASH = 'cash',
  CHECK = 'check',
  WIRE_TRANSFER = 'wire_transfer'
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  PENDING_CUSTOMER = 'pending_customer',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export enum TicketCategory {
  ORDER_INQUIRY = 'order_inquiry',
  SHIPPING_ISSUE = 'shipping_issue',
  PAYMENT_ISSUE = 'payment_issue',
  PRODUCT_QUESTION = 'product_question',
  TECHNICAL_SUPPORT = 'technical_support',
  BILLING_INQUIRY = 'billing_inquiry',
  RETURN_REQUEST = 'return_request',
  OTHER = 'other'
}

export enum ReturnStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  RECEIVED = 'received',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum ReturnReason {
  DEFECTIVE = 'defective',
  WRONG_ITEM = 'wrong_item',
  NOT_AS_DESCRIBED = 'not_as_described',
  CHANGED_MIND = 'changed_mind',
  DAMAGED_IN_SHIPPING = 'damaged_in_shipping',
  OTHER = 'other'
}
