import { ObjectId } from 'mongodb';

export interface OrganizationNode {
  _id?: ObjectId;
  employeeId: string;
  name: string;
  position: string;
  department: string;
  level: number; // 0 = CEO, 1 = VP, 2 = Director, etc.
  parentId?: string; // Employee ID of the manager
  children?: OrganizationNode[];
  avatar?: string;
  email: string;
  phone?: string;
  location?: string;
  isActive: boolean;
  hireDate: Date;
  directReports?: number; // Count of direct reports
  teamSize?: number; // Total team size including indirect reports
}

export interface OrganizationChart {
  _id?: ObjectId;
  companyId: string;
  name: string;
  version: string;
  lastUpdated: Date;
  rootNode: OrganizationNode;
  totalEmployees: number;
  totalDepartments: number;
  maxDepth: number;
  systemInfo: {
    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
    isActive: boolean;
  };
}

export interface CreateOrganizationChartDTO {
  companyId: string;
  name: string;
  version: string;
}

export interface UpdateOrganizationChartDTO {
  name?: string;
  version?: string;
  lastUpdated?: Date;
}

export interface OrganizationNodeDTO {
  employeeId: string;
  name: string;
  position: string;
  department: string;
  level: number;
  parentId?: string;
  avatar?: string;
  email: string;
  phone?: string;
  location?: string;
  isActive: boolean;
  hireDate: Date;
}

export interface OrganizationStats {
  totalEmployees: number;
  totalDepartments: number;
  averageSpanOfControl: number;
  maxDepth: number;
  departmentBreakdown: Array<{
    department: string;
    employeeCount: number;
    managerCount: number;
  }>;
  levelBreakdown: Array<{
    level: number;
    levelName: string;
    employeeCount: number;
  }>;
}
