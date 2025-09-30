import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Role interface
interface Role {
  _id?: ObjectId;
  name: string;
  description: string;
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

// Demo roles data
const demoRoles: Omit<Role, '_id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>[] = [
  {
    name: 'Super Admin',
    description: 'Full system access with all permissions',
    permissions: [
      'users.create', 'users.read', 'users.update', 'users.delete', 'users.manage_roles',
      'roles.create', 'roles.read', 'roles.update', 'roles.delete',
      'employees.create', 'employees.read', 'employees.update', 'employees.delete', 'employees.manage_hr',
      'products.create', 'products.read', 'products.update', 'products.delete', 'products.manage_categories', 'products.manage_brands',
      'orders.create', 'orders.read', 'orders.update', 'orders.delete', 'orders.manage_status',
      'customers.create', 'customers.read', 'customers.update', 'customers.delete',
      'inventory.read', 'inventory.update', 'inventory.manage_stock', 'inventory.manage_warehouses',
      'analytics.read', 'reports.read', 'reports.create', 'reports.export',
      'settings.read', 'settings.update', 'system.backup', 'system.maintenance',
      'branches.create', 'branches.read', 'branches.update', 'branches.delete'
    ],
    isActive: true
  },
  {
    name: 'Admin',
    description: 'Administrative access with most permissions',
    permissions: [
      'users.create', 'users.read', 'users.update',
      'roles.read',
      'employees.create', 'employees.read', 'employees.update', 'employees.delete', 'employees.manage_hr',
      'products.create', 'products.read', 'products.update', 'products.delete', 'products.manage_categories', 'products.manage_brands',
      'orders.create', 'orders.read', 'orders.update', 'orders.delete', 'orders.manage_status',
      'customers.create', 'customers.read', 'customers.update', 'customers.delete',
      'inventory.read', 'inventory.update', 'inventory.manage_stock', 'inventory.manage_warehouses',
      'analytics.read', 'reports.read', 'reports.create', 'reports.export',
      'settings.read', 'settings.update',
      'branches.create', 'branches.read', 'branches.update', 'branches.delete'
    ],
    isActive: true
  },
  {
    name: 'Sales Manager',
    description: 'Management access for sales department',
    permissions: [
      'users.read',
      'employees.read', 'employees.update',
      'products.read', 'products.update',
      'orders.create', 'orders.read', 'orders.update', 'orders.manage_status',
      'customers.create', 'customers.read', 'customers.update', 'customers.delete',
      'inventory.read',
      'analytics.read', 'reports.read', 'reports.create',
      'branches.read'
    ],
    isActive: true
  },
  {
    name: 'HR Manager',
    description: 'Human resources management access',
    permissions: [
      'users.read',
      'roles.read',
      'employees.create', 'employees.read', 'employees.update', 'employees.delete', 'employees.manage_hr',
      'reports.read', 'reports.create',
      'branches.read'
    ],
    isActive: true
  },
  {
    name: 'Inventory Manager',
    description: 'Inventory and warehouse management access',
    permissions: [
      'products.read', 'products.update',
      'orders.read',
      'inventory.read', 'inventory.update', 'inventory.manage_stock', 'inventory.manage_warehouses',
      'branches.read', 'branches.update',
      'reports.read'
    ],
    isActive: true
  },
  {
    name: 'Sales Representative',
    description: 'Sales representative with order and customer management',
    permissions: [
      'products.read',
      'orders.create', 'orders.read', 'orders.update',
      'customers.create', 'customers.read', 'customers.update',
      'inventory.read'
    ],
    isActive: true
  },
  {
    name: 'Customer Service',
    description: 'Customer service representative access',
    permissions: [
      'orders.read', 'orders.update',
      'customers.read', 'customers.update',
      'products.read',
      'inventory.read'
    ],
    isActive: true
  },
  {
    name: 'Accountant',
    description: 'Financial and accounting access',
    permissions: [
      'orders.read',
      'customers.read',
      'products.read',
      'inventory.read',
      'analytics.read', 'reports.read', 'reports.create', 'reports.export',
      'branches.read'
    ],
    isActive: true
  },
  {
    name: 'Employee',
    description: 'Standard employee access',
    permissions: [
      'products.read',
      'orders.create', 'orders.read',
      'customers.read',
      'inventory.read'
    ],
    isActive: true
  },
  {
    name: 'Viewer',
    description: 'Read-only access to most system features',
    permissions: [
      'users.read',
      'roles.read',
      'employees.read',
      'products.read',
      'orders.read',
      'customers.read',
      'inventory.read',
      'analytics.read',
      'reports.read',
      'branches.read'
    ],
    isActive: true
  },
  {
    name: 'Guest',
    description: 'Limited access for external users',
    permissions: [
      'products.read',
      'customers.read'
    ],
    isActive: true
  },
  {
    name: 'Temporary Access',
    description: 'Temporary access role for contractors',
    permissions: [
      'products.read',
      'orders.read',
      'customers.read',
      'inventory.read'
    ],
    isActive: false
  }
];

// POST /api/users/roles/seed - Seed demo roles data
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const rolesCollection = db.collection('roles');

    // Clear existing roles (optional - remove this if you want to keep existing data)
    await rolesCollection.deleteMany({});

    // Prepare roles with timestamps
    const rolesToInsert = demoRoles.map(role => ({
      ...role,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'system',
      updatedBy: 'system'
    }));

    // Insert demo roles
    const result = await rolesCollection.insertMany(rolesToInsert);

    return NextResponse.json({
      success: true,
      message: `${result.insertedCount} demo roles created successfully`,
      data: {
        insertedCount: result.insertedCount,
        insertedIds: Object.values(result.insertedIds)
      }
    });
  } catch (error) {
    console.error('Error seeding demo roles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed demo roles' },
      { status: 500 }
    );
  }
}
