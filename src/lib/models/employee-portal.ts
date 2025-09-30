export interface EmployeeProfile {
  employeeId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
      email?: string;
    };
    dateOfBirth: Date;
    nationality: string;
    maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
    profilePicture?: string;
  };
  workInfo: {
    employeeNumber: string;
    department: string;
    position: string;
    managerId: string;
    managerName: string;
    hireDate: Date;
    employmentType: 'full-time' | 'part-time' | 'contract' | 'intern';
    workLocation: string;
    workSchedule: string;
    directReports?: string[];
  };
  contactInfo: {
    workEmail: string;
    workPhone: string;
    extension?: string;
    deskLocation?: string;
  };
  skills: Array<{
    skillId: string;
    skillName: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    category: string;
    verified: boolean;
    verifiedDate?: Date;
  }>;
  preferences: {
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    privacy: {
      showProfilePicture: boolean;
      showContactInfo: boolean;
      showSkills: boolean;
    };
  };
  lastUpdated: Date;
  updatedBy: string;
}

export interface Payslip {
  payslipId: string;
  employeeId: string;
  employeeName: string;
  payPeriod: {
    startDate: Date;
    endDate: Date;
    month: number;
    year: number;
  };
  basicSalary: number;
  allowances: Array<{
    name: string;
    amount: number;
    taxable: boolean;
  }>;
  deductions: Array<{
    name: string;
    amount: number;
    type: 'tax' | 'insurance' | 'loan' | 'other';
  }>;
  overtime: {
    hours: number;
    rate: number;
    amount: number;
  };
  bonuses: Array<{
    name: string;
    amount: number;
    type: string;
  }>;
  grossSalary: number;
  netSalary: number;
  taxDeductions: {
    incomeTax: number;
    socialInsurance: number;
    healthInsurance: number;
    totalTaxes: number;
  };
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
  };
  status: 'generated' | 'sent' | 'viewed' | 'downloaded';
  generatedDate: Date;
  sentDate?: Date;
  viewedDate?: Date;
  downloadedDate?: Date;
  payslipUrl: string;
  taxSlipUrl?: string;
}

export interface LeaveRequestSummary {
  requestId: string;
  leaveTypeId: string;
  leaveTypeName: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedDate: Date;
  approvedDate?: Date;
  approvedBy?: string;
  comments?: string;
  isHalfDay: boolean;
  halfDayType?: 'morning' | 'afternoon';
}

export interface LeaveBalanceSummary {
  leaveTypeId: string;
  leaveTypeName: string;
  leaveTypeCode: string;
  allocatedDays: number;
  usedDays: number;
  pendingDays: number;
  availableDays: number;
  carriedForwardDays: number;
  expiresAt?: Date;
  utilizationPercentage: number;
}

export interface Announcement {
  announcementId: string;
  title: string;
  content: string;
  type: 'general' | 'department' | 'urgent' | 'policy' | 'event';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetAudience: {
    allEmployees: boolean;
    departments?: string[];
    positions?: string[];
    specificEmployees?: string[];
  };
  authorId: string;
  authorName: string;
  authorRole: string;
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  publishDate: Date;
  expiryDate?: Date;
  isActive: boolean;
  readBy: string[]; // Employee IDs who have read this
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  messageId: string;
  fromEmployeeId: string;
  fromEmployeeName: string;
  fromEmployeeRole: string;
  toEmployeeId: string;
  toEmployeeName: string;
  subject: string;
  content: string;
  type: 'direct' | 'department' | 'broadcast';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  isRead: boolean;
  readDate?: Date;
  isImportant: boolean;
  isArchived: boolean;
  sentDate: Date;
  repliedTo?: string; // Message ID this is replying to
  threadId?: string; // For grouping related messages
}

export interface DashboardStats {
  leaveRequests: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  leaveBalances: {
    totalAvailableDays: number;
    mostUsedType: string;
    utilizationPercentage: number;
  };
  payslips: {
    totalPayslips: number;
    lastPayslipDate?: Date;
    lastPayslipAmount?: number;
  };
  announcements: {
    unreadCount: number;
    urgentCount: number;
    lastAnnouncementDate?: Date;
  };
  messages: {
    unreadCount: number;
    urgentCount: number;
    lastMessageDate?: Date;
  };
}

// DTOs for API requests
export interface UpdateProfileDTO {
  personalInfo?: Partial<EmployeeProfile['personalInfo']>;
  contactInfo?: Partial<EmployeeProfile['contactInfo']>;
  skills?: EmployeeProfile['skills'];
  preferences?: Partial<EmployeeProfile['preferences']>;
}

export interface CreateMessageDTO {
  toEmployeeId: string;
  subject: string;
  content: string;
  type: Message['type'];
  priority: Message['priority'];
  attachments?: Message['attachments'];
}

export interface CreateAnnouncementDTO {
  title: string;
  content: string;
  type: Announcement['type'];
  priority: Announcement['priority'];
  targetAudience: Announcement['targetAudience'];
  attachments?: Announcement['attachments'];
  expiryDate?: Date;
}

export interface MarkAsReadDTO {
  itemId: string;
  itemType: 'announcement' | 'message';
  readDate: Date;
}