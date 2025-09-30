import { ObjectId } from 'mongodb';

export interface Employee {
  _id?: ObjectId;
  employeeId: string; // Unique employee ID (e.g., EMP001)
  personalInfo: {
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: Date;
    gender: 'male' | 'female' | 'other';
    maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
    nationality: string;
    phone: string;
    email: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
      email?: string;
    };
  };
  employmentInfo: {
    departmentId: string;
    position: string;
    jobTitle: string;
    employmentType: 'full-time' | 'part-time' | 'contract' | 'intern';
    employmentStatus: 'active' | 'inactive' | 'terminated' | 'on-leave';
    hireDate: Date;
    terminationDate?: Date;
    reportingManager?: string; // Employee ID of manager
    workLocation: string;
    workSchedule: string;
    salary: {
      baseSalary: number;
      currency: string;
      payFrequency: 'monthly' | 'bi-weekly' | 'weekly' | 'annual';
    };
    employmentHistory: Array<{
      id: string;
      position: string;
      departmentId: string;
      startDate: Date;
      endDate?: Date;
      salary: {
        baseSalary: number;
        currency: string;
        payFrequency: 'monthly' | 'bi-weekly' | 'weekly' | 'annual';
      };
      reasonForChange?: string;
      manager?: string;
    }>;
  };
  documents: {
    resume?: string;
    contract?: string;
    idDocument?: string;
    passport?: string;
    workPermit?: string;
    visa?: string;
    healthInsurance?: string;
    birthCertificate?: string;
    marriageCertificate?: string;
    otherDocuments: Array<{
      name: string;
      type: 'contract' | 'id' | 'passport' | 'visa' | 'work-permit' | 'certificate' | 'insurance' | 'other';
      documentNumber?: string;
      issueDate?: Date;
      expiryDate?: Date;
      issuingAuthority?: string;
      filePath?: string;
      isRequired: boolean;
    }>;
  };
  skills: {
    technicalSkills: string[];
    softSkills: string[];
    certifications: Array<{
      name: string;
      issuingOrganization: string;
      issueDate: Date;
      expiryDate?: Date;
      credentialId?: string;
    }>;
    languages: Array<{
      language: string;
      proficiency: 'beginner' | 'intermediate' | 'advanced' | 'native';
    }>;
  };
  performance: {
    lastReviewDate?: Date;
    nextReviewDate?: Date;
    overallRating?: number; // 1-5 scale
    goals: Array<{
      id: string;
      title: string;
      description: string;
      targetDate: Date;
      status: 'not-started' | 'in-progress' | 'completed' | 'cancelled';
      progress: number; // 0-100
    }>;
    achievements: Array<{
      id: string;
      title: string;
      description: string;
      date: Date;
      category: string;
    }>;
  };
  leave: {
    totalLeaveDays: number;
    usedLeaveDays: number;
    remainingLeaveDays: number;
    leaveHistory: Array<{
      id: string;
      type: 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'unpaid';
      startDate: Date;
      endDate: Date;
      days: number;
      reason: string;
      status: 'pending' | 'approved' | 'rejected' | 'cancelled';
      approvedBy?: string;
      approvedDate?: Date;
    }>;
  };
  healthInsurance: {
    provider: string;
    policyNumber: string;
    coverageType: 'individual' | 'family' | 'spouse' | 'children';
    startDate: Date;
    endDate?: Date;
    premium: {
      amount: number;
      currency: string;
      frequency: 'monthly' | 'quarterly' | 'annual';
    };
    beneficiaries: Array<{
      name: string;
      relationship: string;
      dateOfBirth: Date;
      covered: boolean;
    }>;
    medicalHistory: Array<{
      id: string;
      date: Date;
      type: 'checkup' | 'illness' | 'injury' | 'vaccination' | 'surgery';
      description: string;
      provider: string;
      cost?: number;
      covered: boolean;
    }>;
  };
  compliance: {
    laborLawCompliance: {
      workPermitValid: boolean;
      workPermitExpiry?: Date;
      visaValid: boolean;
      visaExpiry?: Date;
      socialInsurance: boolean;
      socialInsuranceNumber?: string;
      taxRegistration: boolean;
      taxNumber?: string;
    };
    requiredDocuments: Array<{
      documentType: string;
      required: boolean;
      provided: boolean;
      expiryDate?: Date;
      lastVerified?: Date;
      status: 'valid' | 'expired' | 'missing' | 'pending-renewal';
    }>;
    complianceChecks: Array<{
      id: string;
      checkType: 'document-renewal' | 'work-permit' | 'visa-status' | 'insurance-verification';
      checkDate: Date;
      nextCheckDate: Date;
      status: 'compliant' | 'non-compliant' | 'pending';
      notes?: string;
      checkedBy: string;
    }>;
    trainingCompliance: Array<{
      id: string;
      trainingName: string;
      completionDate: Date;
      expiryDate?: Date;
      status: 'completed' | 'expired' | 'pending';
      certificate?: string;
    }>;
  };
  systemInfo: {
    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
    isActive: boolean;
  };
}

export interface CreateEmployeeDTO {
  personalInfo: {
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: Date;
    gender: 'male' | 'female' | 'other';
    maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
    nationality: string;
    phone: string;
    email: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
      email?: string;
    };
  };
  employmentInfo: {
    departmentId: string;
    position: string;
    jobTitle: string;
    employmentType: 'full-time' | 'part-time' | 'contract' | 'intern';
    workLocation: string;
    workSchedule: string;
    salary: {
      baseSalary: number;
      currency: string;
      payFrequency: 'monthly' | 'bi-weekly' | 'weekly' | 'annual';
    };
  };
}

export interface UpdateEmployeeDTO extends Partial<CreateEmployeeDTO> {
  employmentStatus?: 'active' | 'inactive' | 'terminated' | 'on-leave';
  terminationDate?: Date;
  reportingManager?: string;
}

export interface EmployeeFilter {
  departmentId?: string;
  employmentStatus?: string;
  employmentType?: string;
  position?: string;
  location?: string;
  manager?: string;
  search?: string;
}
