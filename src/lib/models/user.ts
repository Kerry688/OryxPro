import { Document, ObjectId } from 'mongodb';

export interface User extends Document {
  _id?: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  role: 'admin' | 'branch_manager' | 'warehouse_manager' | 'sales_rep' | 'customer';
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  branchId?: ObjectId;
  permissions?: string[];
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  role: 'admin' | 'branch_manager' | 'warehouse_manager' | 'sales_rep' | 'customer';
  avatar?: string;
  branchId?: ObjectId;
  permissions?: string[];
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  password?: string;
  role?: 'admin' | 'branch_manager' | 'warehouse_manager' | 'sales_rep' | 'customer';
  avatar?: string;
  isActive?: boolean;
  branchId?: ObjectId;
  permissions?: string[];
}

