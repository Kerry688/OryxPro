import { Document, ObjectId } from 'mongodb';

export type OrderSource = 'pos' | 'online' | 'phone' | 'email' | 'walk-in' | 'sales-rep';

export interface OrderItem {
  id: string;
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
  brand: string;
}

export interface Payment {
  method: 'cash' | 'card' | 'mobile' | 'bank_transfer';
  amount: number;
  transactionId?: string;
  status: 'completed' | 'pending' | 'failed';
  processedAt?: Date;
}

export interface Order extends Document {
  _id?: ObjectId;
  orderNumber: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  payment: Payment;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  orderDate: Date;
  completedAt?: Date;
  notes?: string;
  cashierId: string;
  cashierName: string;
  branchId: string;
  branchName: string;
  source: OrderSource;
  sourceDetails?: {
    channel?: string; // For online orders: website, mobile app, etc.
    salesRepId?: string; // For sales rep orders
    salesRepName?: string;
    phoneNumber?: string; // For phone orders
    emailAddress?: string; // For email orders
  };
}

export interface CreateOrderData {
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  cashierId: string;
  cashierName: string;
  branchId: string;
  branchName: string;
  notes?: string;
  source: OrderSource;
  sourceDetails?: {
    channel?: string;
    salesRepId?: string;
    salesRepName?: string;
    phoneNumber?: string;
    emailAddress?: string;
  };
}

export interface UpdateOrderData {
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  items?: OrderItem[];
  subtotal?: number;
  tax?: number;
  discount?: number;
  total?: number;
  payment?: Payment;
  status?: 'pending' | 'completed' | 'cancelled' | 'refunded';
  notes?: string;
  source?: OrderSource;
  sourceDetails?: {
    channel?: string;
    salesRepId?: string;
    salesRepName?: string;
    phoneNumber?: string;
    emailAddress?: string;
  };
}