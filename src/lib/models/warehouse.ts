import { Document, ObjectId } from 'mongodb';

export interface Warehouse extends Document {
  _id?: ObjectId;
  name: string;
  code: string;
  branchId: ObjectId;
  type: 'main' | 'storage' | 'retail' | 'distribution' | 'cold_storage' | 'hazardous';
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  capacity: number; // in cubic meters or units
  currentCapacity?: number; // current usage
  manager: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  features?: string[]; // e.g., ['climate_control', 'security_system', 'forklift_access']
  operatingHours?: {
    monday: { open: string; close: string; isOpen: boolean };
    tuesday: { open: string; close: string; isOpen: boolean };
    wednesday: { open: string; close: string; isOpen: boolean };
    thursday: { open: string; close: string; isOpen: boolean };
    friday: { open: string; close: string; isOpen: boolean };
    saturday: { open: string; close: string; isOpen: boolean };
    sunday: { open: string; close: string; isOpen: boolean };
  };
  createdAt: Date;
  updatedAt: Date;
  createdBy: ObjectId;
  updatedBy: ObjectId;
}

export interface CreateWarehouseData {
  name: string;
  code: string;
  branchId: ObjectId;
  type: 'main' | 'storage' | 'retail' | 'distribution' | 'cold_storage' | 'hazardous';
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  capacity: number;
  manager: string;
  phone?: string;
  email?: string;
  features?: string[];
  operatingHours?: {
    monday: { open: string; close: string; isOpen: boolean };
    tuesday: { open: string; close: string; isOpen: boolean };
    wednesday: { open: string; close: string; isOpen: boolean };
    thursday: { open: string; close: string; isOpen: boolean };
    friday: { open: string; close: string; isOpen: boolean };
    saturday: { open: string; close: string; isOpen: boolean };
    sunday: { open: string; close: string; isOpen: boolean };
  };
  createdBy: ObjectId;
}

export interface UpdateWarehouseData {
  name?: string;
  code?: string;
  branchId?: ObjectId;
  type?: 'main' | 'storage' | 'retail' | 'distribution' | 'cold_storage' | 'hazardous';
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  capacity?: number;
  currentCapacity?: number;
  manager?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
  features?: string[];
  operatingHours?: {
    monday: { open: string; close: string; isOpen: boolean };
    tuesday: { open: string; close: string; isOpen: boolean };
    wednesday: { open: string; close: string; isOpen: boolean };
    thursday: { open: string; close: string; isOpen: boolean };
    friday: { open: string; close: string; isOpen: boolean };
    saturday: { open: string; close: string; isOpen: boolean };
    sunday: { open: string; close: string; isOpen: boolean };
  };
  updatedBy: ObjectId;
}

export interface WarehouseZone extends Document {
  _id?: ObjectId;
  warehouseId: ObjectId;
  name: string;
  code: string;
  type: 'receiving' | 'storage' | 'picking' | 'shipping' | 'quarantine' | 'cold_storage';
  capacity: number;
  currentCapacity?: number;
  location?: string; // e.g., "A1", "Zone-B-2"
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: ObjectId;
  updatedBy: ObjectId;
}

export interface CreateWarehouseZoneData {
  warehouseId: ObjectId;
  name: string;
  code: string;
  type: 'receiving' | 'storage' | 'picking' | 'shipping' | 'quarantine' | 'cold_storage';
  capacity: number;
  location?: string;
  createdBy: ObjectId;
}

export interface UpdateWarehouseZoneData {
  name?: string;
  code?: string;
  type?: 'receiving' | 'storage' | 'picking' | 'shipping' | 'quarantine' | 'cold_storage';
  capacity?: number;
  currentCapacity?: number;
  location?: string;
  isActive?: boolean;
  updatedBy: ObjectId;
}

export interface WarehouseMetrics {
  totalWarehouses: number;
  activeWarehouses: number;
  totalCapacity: number;
  usedCapacity: number;
  capacityUtilization: number;
  lowStockItems: number;
  highStockItems: number;
  totalInventoryValue: number;
  averageStockLevel: number;
  turnoverRate: number;
}
