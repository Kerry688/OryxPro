import { Document, ObjectId } from 'mongodb';

// User Types
export enum UserType {
  ERP_USER = 'erp_user',
  EMPLOYEE = 'employee',
  CUSTOMER = 'customer'
}

// Login Portals
export enum LoginPortal {
  ERP_SYSTEM = 'erp_system',
  EMPLOYEE_PORTAL = 'employee_portal',
  CUSTOMER_PORTAL = 'customer_portal'
}

// User Roles
export enum UserRole {
  // ERP System Roles
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  BRANCH_MANAGER = 'branch_manager',
  WAREHOUSE_MANAGER = 'warehouse_manager',
  SALES_REP = 'sales_rep',
  
  // Employee Portal Roles
  EMPLOYEE_ADMIN = 'employee_admin',
  HR_MANAGER = 'hr_manager',
  EMPLOYEE = 'employee',
  
  // Customer Portal Roles
  CUSTOMER_ADMIN = 'customer_admin',
  CUSTOMER = 'customer'
}

export interface User extends Document {
  _id?: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  userType: UserType;
  role: UserRole;
  loginPortal: LoginPortal;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Password management
  mustResetPassword: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  branchId?: ObjectId;
  permissions?: string[];
  
  // Customer-specific fields
  customerId?: string;
  companyName?: string;
  
  // Employee-specific fields
  employeeId?: string;
  department?: string;
  position?: string;
  managerId?: ObjectId;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  userType: UserType;
  role: UserRole;
  loginPortal: LoginPortal;
  avatar?: string;
  branchId?: ObjectId;
  permissions?: string[];
  
  // Password management
  mustResetPassword?: boolean;
  
  // Customer-specific fields
  customerId?: string;
  companyName?: string;
  
  // Employee-specific fields
  employeeId?: string;
  department?: string;
  position?: string;
  managerId?: ObjectId;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  password?: string;
  userType?: UserType;
  role?: UserRole;
  loginPortal?: LoginPortal;
  avatar?: string;
  isActive?: boolean;
  branchId?: ObjectId;
  permissions?: string[];
  
  // Customer-specific fields
  customerId?: string;
  companyName?: string;
  
  // Employee-specific fields
  employeeId?: string;
  department?: string;
  position?: string;
  managerId?: ObjectId;
}

// Login Request Interface
export interface LoginRequest {
  email: string;
  password: string;
  portal: LoginPortal;
  rememberMe?: boolean;
}

// Login Response Interface
export interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  redirectUrl: string;
  message?: string;
}

