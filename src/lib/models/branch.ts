import { Document, ObjectId } from 'mongodb';

export interface Branch extends Document {
  _id?: ObjectId;
  name: string;
  code: string; // Short code for the branch (e.g., "NYC", "LAX")
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  manager: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: ObjectId;
  updatedBy: ObjectId;
}

export interface CreateBranchData {
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  manager: string;
  createdBy: ObjectId;
}

export interface UpdateBranchData {
  name?: string;
  code?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  manager?: string;
  isActive?: boolean;
  updatedBy: ObjectId;
}
