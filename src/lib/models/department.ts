import { ObjectId } from 'mongodb';

export interface Department {
  _id?: ObjectId;
  departmentId: string; // Unique department ID (e.g., DEP001)
  name: string;
  description: string;
  code: string; // Short code for the department (e.g., "HR", "IT", "SALES")
  parentDepartmentId?: string; // For hierarchical departments
  managerId?: string; // Employee ID of department manager
  budget: {
    annualBudget: number;
    currency: string;
    fiscalYear: number;
    categories: Array<{
      category: string;
      allocatedAmount: number;
      spentAmount: number;
    }>;
  };
  location: {
    building: string;
    floor: string;
    room?: string;
    address: string;
  };
  contactInfo: {
    phone: string;
    email: string;
    extension?: string;
  };
  policies: {
    workingHours: string;
    dressCode: string;
    remoteWorkPolicy: string;
    otherPolicies: string[];
  };
  metrics: {
    totalEmployees: number;
    averageSalary: number;
    turnoverRate: number;
    productivityScore: number;
  };
  systemInfo: {
    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
    isActive: boolean;
  };
}

export interface CreateDepartmentDTO {
  name: string;
  description: string;
  code: string;
  parentDepartmentId?: string;
  managerId?: string;
  budget: {
    annualBudget: number;
    currency: string;
    fiscalYear: number;
  };
  location: {
    building: string;
    floor: string;
    room?: string;
    address: string;
  };
  contactInfo: {
    phone: string;
    email: string;
    extension?: string;
  };
  policies: {
    workingHours: string;
    dressCode: string;
    remoteWorkPolicy: string;
  };
}

export interface UpdateDepartmentDTO extends Partial<CreateDepartmentDTO> {
  metrics?: {
    totalEmployees?: number;
    averageSalary?: number;
    turnoverRate?: number;
    productivityScore?: number;
  };
}

export interface DepartmentFilter {
  parentDepartmentId?: string;
  managerId?: string;
  location?: string;
  search?: string;
}
