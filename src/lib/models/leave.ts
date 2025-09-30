export interface LeaveType {
  leaveTypeId: string;
  name: string;
  code: string;
  description: string;
  category: 'annual' | 'sick' | 'maternity' | 'paternity' | 'personal' | 'emergency' | 'unpaid' | 'other';
  isPaid: boolean;
  maxDaysPerYear?: number;
  requiresApproval: boolean;
  advanceNoticeDays?: number;
  maxConsecutiveDays?: number;
  carryForward: boolean;
  carryForwardDays?: number;
  accrualRate?: number; // days per month
  color: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeaveBalance {
  balanceId: string;
  employeeId: string;
  leaveTypeId: string;
  leaveTypeName: string;
  year: number;
  allocatedDays: number;
  usedDays: number;
  pendingDays: number;
  carriedForwardDays: number;
  availableDays: number;
  expiresAt?: Date;
  lastUpdated: Date;
}

export interface LeaveRequest {
  requestId: string;
  employeeId: string;
  employeeName: string;
  leaveTypeId: string;
  leaveTypeName: string;
  leaveTypeCode: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isHalfDay: boolean;
  halfDayType?: 'morning' | 'afternoon';
  attachmentUrls?: string[];
  
  // Workflow
  submittedDate: Date;
  lastModifiedDate: Date;
  submittedBy: string;
  
  // Approval workflow
  approvalWorkflow: {
    approvers: Array<{
      approverId: string;
      approverName: string;
      approverRole: string;
      department: string;
      level: number;
      status: 'pending' | 'approved' | 'rejected';
      comments?: string;
      actionDate?: Date;
      isRequired: boolean;
    }>;
    currentLevel: number;
    isCompleted: boolean;
    completedDate?: Date;
  };
  
  // Emergency contact
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  
  // Handover details
  handoverDetails?: {
    colleagueId: string;
    colleagueName: string;
    handoverNotes: string;
    handoverDate: Date;
    handoverAccepted: boolean;
  };
  
  // Comments and notes
  comments: Array<{
    commentId: string;
    authorId: string;
    authorName: string;
    authorRole: string;
    comment: string;
    timestamp: Date;
    isInternal: boolean;
  }>;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface Holiday {
  holidayId: string;
  name: string;
  description?: string;
  date: Date;
  type: 'national' | 'religious' | 'regional' | 'company' | 'floating';
  country: string;
  region?: string;
  isRecurring: boolean;
  recurringPattern?: 'yearly' | 'monthly' | 'weekly';
  isActive: boolean;
  isPublicHoliday: boolean;
  workDayCompensation?: boolean; // If holiday falls on weekend
  createdAt: Date;
  updatedAt: Date;
}

export interface LeavePolicy {
  policyId: string;
  name: string;
  description: string;
  effectiveDate: Date;
  endDate?: Date;
  isActive: boolean;
  
  // Leave entitlements
  leaveEntitlements: Array<{
    leaveTypeId: string;
    leaveTypeName: string;
    daysPerYear: number;
    accrualMethod: 'monthly' | 'yearly' | 'quarterly';
    accrualRate: number;
    maxCarryForward: number;
    probationPeriodMonths: number;
    probationLeaveDays: number;
  }>;
  
  // Approval rules
  approvalRules: Array<{
    leaveTypeId: string;
    maxDays: number;
    requiresApproval: boolean;
    approverLevel: number;
    advanceNoticeDays: number;
  }>;
  
  // Blackout periods
  blackoutPeriods: Array<{
    name: string;
    startDate: Date;
    endDate: Date;
    leaveTypeIds: string[];
    description: string;
  }>;
  
  // Weekend and holiday rules
  weekendDays: number[]; // 0=Sunday, 1=Monday, etc.
  holidayCalculation: 'exclude' | 'include' | 'replace';
  
  createdAt: Date;
  updatedAt: Date;
}

export interface LeaveCalendar {
  calendarId: string;
  name: string;
  description: string;
  year: number;
  country: string;
  region?: string;
  isDefault: boolean;
  holidays: Holiday[];
  workingDays: number[];
  workingHours: {
    start: string;
    end: string;
    breakStart?: string;
    breakEnd?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// DTOs for API requests
export interface CreateLeaveTypeDTO {
  name: string;
  code: string;
  description: string;
  category: LeaveType['category'];
  isPaid: boolean;
  maxDaysPerYear?: number;
  requiresApproval: boolean;
  advanceNoticeDays?: number;
  maxConsecutiveDays?: number;
  carryForward: boolean;
  carryForwardDays?: number;
  accrualRate?: number;
  color: string;
}

export interface CreateLeaveRequestDTO {
  employeeId: string;
  leaveTypeId: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  priority: LeaveRequest['priority'];
  isHalfDay?: boolean;
  halfDayType?: LeaveRequest['halfDayType'];
  emergencyContact?: LeaveRequest['emergencyContact'];
  handoverDetails?: {
    colleagueId: string;
    handoverNotes: string;
  };
}

export interface CreateHolidayDTO {
  name: string;
  description?: string;
  date: Date;
  type: Holiday['type'];
  country: string;
  region?: string;
  isRecurring?: boolean;
  recurringPattern?: Holiday['recurringPattern'];
  isPublicHoliday?: boolean;
  workDayCompensation?: boolean;
}

export interface UpdateLeaveRequestDTO {
  status: LeaveRequest['status'];
  comments?: string;
  approverId: string;
  isInternal?: boolean;
}

export interface LeaveRequestFilters {
  employeeId?: string;
  leaveTypeId?: string;
  status?: LeaveRequest['status'];
  startDate?: Date;
  endDate?: Date;
  priority?: LeaveRequest['priority'];
  department?: string;
  approverId?: string;
}

export interface LeaveBalanceFilters {
  employeeId?: string;
  leaveTypeId?: string;
  year?: number;
  department?: string;
}

export interface HolidayFilters {
  country?: string;
  region?: string;
  type?: Holiday['type'];
  year?: number;
  isPublicHoliday?: boolean;
}
