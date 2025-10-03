export interface ReturnOrder {
  _id: string;
  returnNumber: string;
  originalOrderId: string;
  originalOrderNumber: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  returnDate: Date;
  returnReason: ReturnReason;
  returnType: ReturnType;
  status: ReturnStatus;
  items: ReturnItem[];
  totalRefundAmount: number;
  refundMethod: RefundMethod;
  refundStatus: RefundStatus;
  refundTransactionId?: string;
  refundProcessedAt?: Date;
  notes?: string;
  internalNotes?: string;
  processedBy: string;
  processedByName: string;
  branchId: string;
  branchName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReturnItem {
  id: string;
  originalItemId: string;
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  condition: ItemCondition;
  reason: string;
  refundAmount: number;
  restockingFee?: number;
  finalRefundAmount: number;
}

export type ReturnReason = 
  | 'defective'
  | 'wrong_item'
  | 'not_as_described'
  | 'changed_mind'
  | 'damaged_shipping'
  | 'late_delivery'
  | 'duplicate_order'
  | 'size_issue'
  | 'quality_issue'
  | 'other';

export type ReturnType = 
  | 'refund'
  | 'exchange'
  | 'store_credit'
  | 'repair'
  | 'replacement';

export type ReturnStatus = 
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'processing'
  | 'completed'
  | 'cancelled';

export type RefundMethod = 
  | 'original_payment'
  | 'cash'
  | 'store_credit'
  | 'bank_transfer'
  | 'check';

export type RefundStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type ItemCondition = 
  | 'new'
  | 'like_new'
  | 'good'
  | 'fair'
  | 'damaged'
  | 'defective';

export interface CreateReturnOrderData {
  originalOrderId: string;
  customerId?: string;
  returnReason: ReturnReason;
  returnType: ReturnType;
  items: Omit<ReturnItem, 'id' | 'finalRefundAmount'>[];
  notes?: string;
  internalNotes?: string;
}

export interface UpdateReturnOrderData {
  status?: ReturnStatus;
  refundMethod?: RefundMethod;
  refundStatus?: RefundStatus;
  refundTransactionId?: string;
  notes?: string;
  internalNotes?: string;
}
