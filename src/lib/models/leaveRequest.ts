import { ObjectId } from 'mongodb';

export interface LeaveRequest {
  _id?: ObjectId;
  requestId: string; // Unique leave request ID (e.g., LR001)
  employeeId: string; // Employee ID
  leaveType: 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'unpaid' | 'emergency' | 'study';
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  appliedDate: Date;
  approvedBy?: string; // Manager/HR Employee ID
  approvedDate?: Date;
  rejectionReason?: string;
  attachments?: string[]; // File paths for supporting documents
  comments: Array<{
    id: string;
    comment: string;
    commentedBy: string;
    commentedAt: Date;
    isInternal: boolean; // Internal comments vs employee comments
  }>;
  systemInfo: {
    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
    isActive: boolean;
  };
}

export interface CreateLeaveRequestDTO {
  employeeId: string;
  leaveType: 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'unpaid' | 'emergency' | 'study';
  startDate: Date;
  endDate: Date;
  reason: string;
  attachments?: string[];
}

export interface UpdateLeaveRequestDTO {
  status?: 'approved' | 'rejected' | 'cancelled';
  approvedBy?: string;
  approvedDate?: Date;
  rejectionReason?: string;
  comments?: Array<{
    comment: string;
    commentedBy: string;
    isInternal: boolean;
  }>;
}

export interface LeaveRequestFilter {
  employeeId?: string;
  leaveType?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  approvedBy?: string;
  search?: string;
}

export interface LeaveBalance {
  employeeId: string;
  leaveType: string;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
  year: number;
}
