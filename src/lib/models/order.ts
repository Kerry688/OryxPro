import { Document, ObjectId } from 'mongodb';

export interface Order extends Document {
  _id?: ObjectId;
  orderNumber: string;
  customerId: ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  status: 'pending' | 'confirmed' | 'in_production' | 'completed' | 'shipped' | 'delivered' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  orderDate: Date;
  dueDate?: Date;
  completedDate?: Date;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  paymentStatus: 'pending' | 'partial' | 'paid' | 'overdue';
  paymentMethod?: 'cash' | 'card' | 'bank_transfer' | 'check' | 'credit';
  items: OrderItem[];
  notes?: string;
  branchId: ObjectId;
  createdBy: ObjectId;
  assignedTo?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  _id?: ObjectId;
  productId: ObjectId;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: 'pending' | 'in_production' | 'completed' | 'cancelled';
  notes?: string;
  printSettings?: {
    resolution: number;
    colorMode: 'color' | 'black_white';
    paperType: string;
    copies: number;
  };
}

export interface CreateOrderData {
  customerId: ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  dueDate?: Date;
  items: Omit<OrderItem, '_id' | 'productName' | 'productSku' | 'totalPrice'>[];
  notes?: string;
  branchId: ObjectId;
  createdBy: ObjectId;
  assignedTo?: ObjectId;
}

export interface UpdateOrderData {
  status?: 'pending' | 'confirmed' | 'in_production' | 'completed' | 'shipped' | 'delivered' | 'cancelled';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  dueDate?: Date;
  completedDate?: Date;
  totalAmount?: number;
  paidAmount?: number;
  balance?: number;
  paymentStatus?: 'pending' | 'partial' | 'paid' | 'overdue';
  paymentMethod?: 'cash' | 'card' | 'bank_transfer' | 'check' | 'credit';
  items?: OrderItem[];
  notes?: string;
  assignedTo?: ObjectId;
}

