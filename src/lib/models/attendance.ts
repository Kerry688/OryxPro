import { ObjectId } from 'mongodb';

export interface AttendanceRecord {
  _id?: ObjectId;
  attendanceId: string;
  employeeId: string;
  employeeName: string;
  employeeDepartment: string;
  employeePosition: string;
  
  // Check-in/Check-out Details
  checkInTime?: Date;
  checkOutTime?: Date;
  checkInMethod: 'biometric' | 'rfid' | 'online' | 'manual' | 'mobile_app';
  checkOutMethod: 'biometric' | 'rfid' | 'online' | 'manual' | 'mobile_app';
  
  // Location Information
  checkInLocation?: {
    latitude: number;
    longitude: number;
    address: string;
    deviceId: string;
  };
  checkOutLocation?: {
    latitude: number;
    longitude: number;
    address: string;
    deviceId: string;
  };
  
  // Work Hours Calculation
  workDate: Date;
  scheduledStartTime: Date;
  scheduledEndTime: Date;
  actualStartTime?: Date;
  actualEndTime?: Date;
  
  // Time Calculations
  totalWorkHours: number; // in hours
  scheduledHours: number; // in hours
  overtimeHours: number; // in hours
  breakHours: number; // in hours
  lateArrivalMinutes: number; // minutes late
  earlyDepartureMinutes: number; // minutes early
  
  // Break Records
  breaks: Array<{
    breakId: string;
    breakType: 'lunch' | 'short_break' | 'personal' | 'other';
    startTime: Date;
    endTime?: Date;
    duration: number; // in minutes
    isActive: boolean;
    reason?: string;
  }>;
  
  // Status and Validation
  status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave' | 'holiday' | 'weekend';
  isApproved: boolean;
  approvedBy?: string;
  approvedDate?: Date;
  approvalComments?: string;
  
  // Shift Information
  shiftId?: string;
  shiftName?: string;
  shiftType: 'regular' | 'overtime' | 'night' | 'weekend' | 'holiday';
  
  // Additional Information
  notes?: string;
  attachments?: Array<{
    fileName: string;
    url: string;
    type: string;
    uploadedBy: string;
    uploadedDate: Date;
  }>;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface Shift {
  _id?: ObjectId;
  shiftId: string;
  shiftName: string;
  shiftType: 'regular' | 'overtime' | 'night' | 'weekend' | 'holiday';
  description: string;
  
  // Time Configuration
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  duration: number; // in hours
  
  // Break Configuration
  breakConfiguration: {
    lunchBreak: {
      duration: number; // in minutes
      startTime: string; // HH:MM format
      isPaid: boolean;
    };
    shortBreaks: Array<{
      duration: number; // in minutes
      startTime: string; // HH:MM format
      isPaid: boolean;
    }>;
  };
  
  // Overtime Rules
  overtimeRules: {
    dailyOvertimeThreshold: number; // hours after which overtime applies
    overtimeRate: number; // multiplier (e.g., 1.5 for time and a half)
    maximumDailyHours: number; // maximum hours allowed per day
    weekendRate: number; // weekend overtime rate
    holidayRate: number; // holiday overtime rate
  };
  
  // Applicable Days
  applicableDays: Array<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'>;
  
  // Employee Assignment
  assignedEmployees: Array<{
    employeeId: string;
    employeeName: string;
    startDate: Date;
    endDate?: Date;
    isActive: boolean;
  }>;
  
  // Status
  isActive: boolean;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface BiometricDevice {
  _id?: ObjectId;
  deviceId: string;
  deviceName: string;
  deviceType: 'biometric' | 'rfid' | 'hybrid';
  location: {
    building: string;
    floor: string;
    department?: string;
    room?: string;
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  
  // Device Configuration
  configuration: {
    timezone: string;
    autoSync: boolean;
    syncInterval: number; // in minutes
    dataRetention: number; // in days
    maxUsers: number;
    features: Array<'fingerprint' | 'face_recognition' | 'card_reader' | 'pin_entry'>;
  };
  
  // Connection Details
  connection: {
    ipAddress: string;
    port: number;
    protocol: 'tcp' | 'udp' | 'http' | 'https';
    apiEndpoint?: string;
    apiKey?: string;
    lastSync: Date;
    status: 'online' | 'offline' | 'maintenance' | 'error';
  };
  
  // Status
  isActive: boolean;
  lastMaintenance: Date;
  nextMaintenance: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface AttendancePolicy {
  _id?: ObjectId;
  policyId: string;
  policyName: string;
  description: string;
  
  // Late Arrival Rules
  lateArrivalRules: {
    gracePeriod: number; // minutes
    lateArrivalThreshold: number; // minutes after which it's considered late
    lateArrivalDeduction: {
      type: 'hourly' | 'daily' | 'percentage';
      amount: number;
    };
    maximumLateArrivals: number; // per month
  };
  
  // Early Departure Rules
  earlyDepartureRules: {
    earlyDepartureThreshold: number; // minutes before scheduled end time
    earlyDepartureDeduction: {
      type: 'hourly' | 'daily' | 'percentage';
      amount: number;
    };
    maximumEarlyDepartures: number; // per month
  };
  
  // Absence Rules
  absenceRules: {
    consecutiveAbsenceLimit: number; // days
    monthlyAbsenceLimit: number; // days
    absenceDeduction: {
      type: 'hourly' | 'daily' | 'percentage';
      amount: number;
    };
    requireMedicalCertificate: boolean;
    medicalCertificateThreshold: number; // days
  };
  
  // Overtime Rules
  overtimeRules: {
    minimumOvertimeHours: number; // minimum hours to qualify for overtime
    overtimeCalculationMethod: 'daily' | 'weekly' | 'monthly';
    overtimeRate: number; // multiplier
    weekendRate: number; // weekend overtime rate
    holidayRate: number; // holiday overtime rate
    requireApproval: boolean;
    approvalWorkflow: Array<{
      level: number;
      approverRole: string;
      approverId?: string;
    }>;
  };
  
  // Break Rules
  breakRules: {
    mandatoryBreakDuration: number; // minutes for shifts over certain hours
    breakThreshold: number; // hours after which break is mandatory
    maximumBreakDuration: number; // minutes
    unpaidBreakThreshold: number; // minutes after which break is unpaid
  };
  
  // Work from Home Rules
  workFromHomeRules: {
    allowed: boolean;
    maximumDaysPerWeek: number;
    maximumDaysPerMonth: number;
    requireApproval: boolean;
    allowedDepartments: string[];
    timeTrackingRequired: boolean;
  };
  
  // Applicable Departments
  applicableDepartments: string[];
  
  // Status
  isActive: boolean;
  effectiveDate: Date;
  expiryDate?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface AttendanceReport {
  _id?: ObjectId;
  reportId: string;
  reportName: string;
  reportType: 'daily' | 'weekly' | 'monthly' | 'custom';
  
  // Report Period
  startDate: Date;
  endDate: Date;
  
  // Report Configuration
  configuration: {
    includeBreaks: boolean;
    includeOvertime: boolean;
    includeLateArrivals: boolean;
    includeEarlyDepartures: boolean;
    groupBy: 'employee' | 'department' | 'shift' | 'date';
    format: 'pdf' | 'excel' | 'csv';
  };
  
  // Filter Criteria
  filters: {
    departments?: string[];
    employees?: string[];
    shifts?: string[];
    status?: string[];
    dateRange?: {
      startDate: Date;
      endDate: Date;
    };
  };
  
  // Report Data
  data: {
    totalEmployees: number;
    totalWorkDays: number;
    totalWorkHours: number;
    totalOvertimeHours: number;
    averageAttendance: number; // percentage
    lateArrivals: number;
    earlyDepartures: number;
    absences: number;
    summary: Array<{
      date: Date;
      present: number;
      absent: number;
      late: number;
      overtime: number;
    }>;
  };
  
  // Report Status
  status: 'generating' | 'completed' | 'failed';
  generatedAt?: Date;
  fileUrl?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

// DTOs for API requests
export interface CheckInDTO {
  employeeId: string;
  method: 'biometric' | 'rfid' | 'online' | 'manual' | 'mobile_app';
  location?: {
    latitude: number;
    longitude: number;
    address: string;
    deviceId: string;
  };
  notes?: string;
}

export interface CheckOutDTO {
  employeeId: string;
  method: 'biometric' | 'rfid' | 'online' | 'manual' | 'mobile_app';
  location?: {
    latitude: number;
    longitude: number;
    address: string;
    deviceId: string;
  };
  notes?: string;
}

export interface BreakStartDTO {
  employeeId: string;
  breakType: 'lunch' | 'short_break' | 'personal' | 'other';
  reason?: string;
}

export interface BreakEndDTO {
  employeeId: string;
  breakId: string;
}

export interface CreateShiftDTO {
  shiftName: string;
  shiftType: 'regular' | 'overtime' | 'night' | 'weekend' | 'holiday';
  description: string;
  startTime: string;
  endTime: string;
  applicableDays: Array<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'>;
  breakConfiguration: {
    lunchBreak: {
      duration: number;
      startTime: string;
      isPaid: boolean;
    };
    shortBreaks: Array<{
      duration: number;
      startTime: string;
      isPaid: boolean;
    }>;
  };
  overtimeRules: {
    dailyOvertimeThreshold: number;
    overtimeRate: number;
    maximumDailyHours: number;
    weekendRate: number;
    holidayRate: number;
  };
}

export interface UpdateAttendanceDTO {
  attendanceId: string;
  checkInTime?: Date;
  checkOutTime?: Date;
  status?: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave' | 'holiday' | 'weekend';
  notes?: string;
  isApproved?: boolean;
  approvalComments?: string;
}

export interface AttendanceAnalytics {
  totalEmployees: number;
  totalWorkDays: number;
  averageAttendance: number;
  totalWorkHours: number;
  totalOvertimeHours: number;
  lateArrivals: number;
  earlyDepartures: number;
  absences: number;
  attendanceByDepartment: Array<{
    department: string;
    employees: number;
    averageAttendance: number;
    totalHours: number;
    overtimeHours: number;
  }>;
  attendanceByShift: Array<{
    shiftName: string;
    employees: number;
    averageAttendance: number;
    totalHours: number;
    overtimeHours: number;
  }>;
  dailyTrends: Array<{
    date: Date;
    present: number;
    absent: number;
    late: number;
    overtime: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    averageAttendance: number;
    totalHours: number;
    overtimeHours: number;
  }>;
}
