// Technician schedule and availability models

export type ScheduleStatus = 'available' | 'busy' | 'unavailable' | 'on_break' | 'off_duty';
export type ScheduleType = 'work' | 'break' | 'training' | 'meeting' | 'maintenance' | 'emergency';
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface TechnicianSchedule {
  _id?: string;
  technicianId: string;
  technicianName: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  status: ScheduleStatus;
  type: ScheduleType;
  title: string;
  description?: string;
  workOrderId?: string;
  serviceRequestId?: string;
  customerId?: string;
  customerName?: string;
  location?: string;
  isRecurring: boolean;
  recurrenceType: RecurrenceType;
  recurrencePattern?: {
    daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
    daysOfMonth?: number[]; // 1-31
    interval?: number; // Every X days/weeks/months
  };
  parentScheduleId?: string; // For recurring schedules
  isAllDay: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedDuration: number; // in minutes
  actualDuration?: number; // in minutes
  notes?: string;
  attachments: ScheduleAttachment[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface ScheduleAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface TechnicianAvailability {
  _id?: string;
  technicianId: string;
  technicianName: string;
  date: Date;
  workingHours: {
    start: string; // HH:MM format
    end: string; // HH:MM format
  };
  breakTimes: Array<{
    start: string;
    end: string;
    type: 'lunch' | 'break' | 'meeting';
  }>;
  isAvailable: boolean;
  maxConcurrentJobs: number;
  currentJobs: number;
  skills: string[];
  certifications: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduleConflict {
  scheduleId: string;
  conflictType: 'overlap' | 'double_booking' | 'outside_hours' | 'skill_mismatch';
  conflictDescription: string;
  severity: 'low' | 'medium' | 'high';
  suggestedResolution?: string;
}

export interface ScheduleTemplate {
  _id?: string;
  name: string;
  description: string;
  technicianId: string;
  templateType: 'weekly' | 'monthly' | 'custom';
  scheduleItems: Array<{
    dayOfWeek?: number; // 0-6 for weekly templates
    dayOfMonth?: number; // 1-31 for monthly templates
    startTime: string;
    endTime: string;
    status: ScheduleStatus;
    type: ScheduleType;
    title: string;
    description?: string;
  }>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface CreateScheduleData {
  technicianId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  status: ScheduleStatus;
  type: ScheduleType;
  title: string;
  description?: string;
  workOrderId?: string;
  serviceRequestId?: string;
  customerId?: string;
  customerName?: string;
  location?: string;
  isRecurring: boolean;
  recurrenceType: RecurrenceType;
  recurrencePattern?: {
    daysOfWeek?: number[];
    daysOfMonth?: number[];
    interval?: number;
  };
  isAllDay: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedDuration: number;
  notes?: string;
  createdBy: string;
}

export interface UpdateScheduleData {
  date?: Date;
  startTime?: Date;
  endTime?: Date;
  status?: ScheduleStatus;
  type?: ScheduleType;
  title?: string;
  description?: string;
  workOrderId?: string;
  serviceRequestId?: string;
  customerId?: string;
  customerName?: string;
  location?: string;
  isRecurring?: boolean;
  recurrenceType?: RecurrenceType;
  recurrencePattern?: {
    daysOfWeek?: number[];
    daysOfMonth?: number[];
    interval?: number;
  };
  isAllDay?: boolean;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  estimatedDuration?: number;
  actualDuration?: number;
  notes?: string;
  updatedBy: string;
}

export interface ScheduleFilters {
  technicianId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  status?: ScheduleStatus[];
  type?: ScheduleType[];
  priority?: string[];
  hasWorkOrder?: boolean;
  isRecurring?: boolean;
}

export interface ScheduleSearchOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: ScheduleFilters;
}

export interface ScheduleAnalytics {
  totalSchedules: number;
  completedSchedules: number;
  pendingSchedules: number;
  cancelledSchedules: number;
  averageCompletionTime: number;
  technicianUtilization: Array<{
    technicianId: string;
    technicianName: string;
    totalHours: number;
    workingHours: number;
    utilizationRate: number;
  }>;
  scheduleConflicts: number;
  recurringSchedules: number;
  monthlyTrends: Array<{
    month: string;
    schedules: number;
    completed: number;
    utilization: number;
  }>;
  topTechnicians: Array<{
    technicianId: string;
    technicianName: string;
    completedJobs: number;
    averageRating: number;
    totalHours: number;
  }>;
}
