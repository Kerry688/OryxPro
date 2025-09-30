import { ObjectId } from 'mongodb';

// Training Program Model
export interface TrainingProgram {
  _id?: ObjectId;
  programId: string; // e.g., TRN001
  title: string;
  description: string;
  category: 'technical' | 'soft-skills' | 'compliance' | 'leadership' | 'safety' | 'customer-service' | 'sales' | 'other';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration: number; // in hours
  deliveryMethod: 'in-person' | 'online' | 'hybrid' | 'self-paced';
  cost: {
    amount: number;
    currency: string;
  };
  prerequisites: string[];
  learningObjectives: string[];
  skills: string[]; // Skills that will be developed
  instructor?: {
    name: string;
    email: string;
    qualifications: string;
  };
  resources: {
    materials: string[];
    equipment: string[];
    software: string[];
  };
  certification: {
    provides: boolean;
    name?: string;
    validFor?: number; // months
    issuingAuthority?: string;
  };
  status: 'active' | 'inactive' | 'archived';
  systemInfo: {
    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
    isActive: boolean;
  };
}

// Training Schedule Model
export interface TrainingSchedule {
  _id?: ObjectId;
  scheduleId: string; // e.g., SCH001
  programId: string;
  programTitle: string;
  instructor: {
    name: string;
    email: string;
    qualifications: string;
  };
  location: {
    type: 'classroom' | 'online' | 'hybrid';
    address?: string;
    room?: string;
    meetingLink?: string;
  };
  schedule: {
    startDate: Date;
    endDate: Date;
    sessions: Array<{
      sessionNumber: number;
      date: Date;
      startTime: string; // HH:MM format
      endTime: string; // HH:MM format
      topic: string;
      objectives: string[];
    }>;
  };
  capacity: {
    maxParticipants: number;
    minParticipants: number;
    currentEnrollments: number;
  };
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'postponed';
  enrolledEmployees: string[]; // Employee IDs
  completionCriteria: {
    attendance: number; // minimum percentage
    assignments: string[];
    exam?: {
      required: boolean;
      passingScore: number;
      attempts: number;
    };
    practical?: {
      required: boolean;
      description: string;
    };
  };
  systemInfo: {
    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
    isActive: boolean;
  };
}

// Employee Training Record Model
export interface EmployeeTraining {
  _id?: ObjectId;
  employeeId: string;
  programId: string;
  scheduleId: string;
  enrollmentDate: Date;
  status: 'enrolled' | 'in-progress' | 'completed' | 'failed' | 'withdrawn';
  progress: {
    sessionsAttended: number;
    totalSessions: number;
    attendancePercentage: number;
    assignmentsCompleted: number;
    totalAssignments: number;
    examScore?: number;
    practicalScore?: number;
  };
  completionDate?: Date;
  certificate?: {
    issued: boolean;
    certificateNumber?: string;
    issueDate?: Date;
    expiryDate?: Date;
    downloadLink?: string;
  };
  feedback?: {
    rating: number; // 1-5
    comments: string;
    suggestions: string;
  };
  systemInfo: {
    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
    isActive: boolean;
  };
}

// Certification Model
export interface Certification {
  _id?: ObjectId;
  certificationId: string; // e.g., CERT001
  name: string;
  description: string;
  issuingAuthority: string;
  category: 'professional' | 'technical' | 'compliance' | 'safety' | 'industry' | 'vendor';
  level: 'foundation' | 'associate' | 'professional' | 'expert' | 'master';
  validityPeriod: number; // months
  renewalRequirements: string[];
  cost: {
    amount: number;
    currency: string;
  };
  prerequisites: string[];
  examDetails?: {
    format: 'multiple-choice' | 'practical' | 'essay' | 'mixed';
    duration: number; // minutes
    passingScore: number; // percentage
    attempts: number;
  };
  trainingPrograms: string[]; // Training program IDs that prepare for this certification
  status: 'active' | 'inactive' | 'archived';
  systemInfo: {
    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
    isActive: boolean;
  };
}

// Employee Certification Model
export interface EmployeeCertification {
  _id?: ObjectId;
  employeeId: string;
  certificationId: string;
  certificationName: string;
  issueDate: Date;
  expiryDate: Date;
  status: 'active' | 'expired' | 'expiring-soon' | 'renewed';
  certificateNumber: string;
  issuingAuthority: string;
  verification: {
    verified: boolean;
    verifiedBy?: string;
    verifiedDate?: Date;
    verificationMethod: 'email' | 'website' | 'phone' | 'document';
  };
  renewalHistory: Array<{
    renewalDate: Date;
    previousExpiryDate: Date;
    newExpiryDate: Date;
    cost: number;
    currency: string;
  }>;
  systemInfo: {
    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
    isActive: boolean;
  };
}

// Skill Gap Analysis Model
export interface SkillGapAnalysis {
  _id?: ObjectId;
  analysisId: string; // e.g., SGA001
  employeeId: string;
  positionId: string;
  analysisDate: Date;
  requiredSkills: Array<{
    skill: string;
    category: string;
    requiredLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    importance: 'critical' | 'important' | 'nice-to-have';
    weight: number; // 1-10
  }>;
  currentSkills: Array<{
    skill: string;
    category: string;
    currentLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    lastAssessed: Date;
    source: 'self-assessment' | 'manager-review' | 'peer-review' | 'test' | 'performance';
  }>;
  gapAnalysis: Array<{
    skill: string;
    category: string;
    gap: number; // 1-4 (expert=4, advanced=3, intermediate=2, beginner=1)
    priority: 'high' | 'medium' | 'low';
    recommendedTraining: string[]; // Training program IDs
    estimatedTimeToClose: number; // months
  }>;
  overallScore: {
    current: number; // 1-100
    required: number; // 1-100
    gap: number; // difference
  };
  recommendations: {
    immediateActions: string[];
    trainingPrograms: string[];
    mentoring: string[];
    onJobTraining: string[];
    timeline: string;
  };
  systemInfo: {
    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
    isActive: boolean;
  };
}

// DTOs for API operations
export interface CreateTrainingProgramDTO {
  title: string;
  description: string;
  category: string;
  level: string;
  duration: number;
  deliveryMethod: string;
  cost: {
    amount: number;
    currency: string;
  };
  prerequisites: string[];
  learningObjectives: string[];
  skills: string[];
  instructor?: {
    name: string;
    email: string;
    qualifications: string;
  };
  resources: {
    materials: string[];
    equipment: string[];
    software: string[];
  };
  certification: {
    provides: boolean;
    name?: string;
    validFor?: number;
    issuingAuthority?: string;
  };
}

export interface CreateTrainingScheduleDTO {
  programId: string;
  instructor: {
    name: string;
    email: string;
    qualifications: string;
  };
  location: {
    type: string;
    address?: string;
    room?: string;
    meetingLink?: string;
  };
  schedule: {
    startDate: Date;
    endDate: Date;
    sessions: Array<{
      sessionNumber: number;
      date: Date;
      startTime: string;
      endTime: string;
      topic: string;
      objectives: string[];
    }>;
  };
  capacity: {
    maxParticipants: number;
    minParticipants: number;
  };
  completionCriteria: {
    attendance: number;
    assignments: string[];
    exam?: {
      required: boolean;
      passingScore: number;
      attempts: number;
    };
    practical?: {
      required: boolean;
      description: string;
    };
  };
}

export interface CreateCertificationDTO {
  name: string;
  description: string;
  issuingAuthority: string;
  category: string;
  level: string;
  validityPeriod: number;
  renewalRequirements: string[];
  cost: {
    amount: number;
    currency: string;
  };
  prerequisites: string[];
  examDetails?: {
    format: string;
    duration: number;
    passingScore: number;
    attempts: number;
  };
  trainingPrograms: string[];
}

export interface CreateSkillGapAnalysisDTO {
  employeeId: string;
  positionId: string;
  requiredSkills: Array<{
    skill: string;
    category: string;
    requiredLevel: string;
    importance: string;
    weight: number;
  }>;
  currentSkills: Array<{
    skill: string;
    category: string;
    currentLevel: string;
    lastAssessed: Date;
    source: string;
  }>;
}

// Filter interfaces
export interface TrainingProgramFilter {
  category?: string;
  level?: string;
  deliveryMethod?: string;
  status?: string;
  search?: string;
}

export interface TrainingScheduleFilter {
  programId?: string;
  status?: string;
  instructor?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export interface CertificationFilter {
  category?: string;
  level?: string;
  issuingAuthority?: string;
  status?: string;
  search?: string;
}
