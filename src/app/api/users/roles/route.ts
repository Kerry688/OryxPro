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

// GET /api/users/roles - Get all roles with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const rolesCollection = db.collection('roles');

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');

    // Build query
    const query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }
    // If no status filter, show all roles

    // Get total count
    const totalCount = await rolesCollection.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    // Get paginated results
    const skip = (page - 1) * limit;
    const roles = await rolesCollection
      .find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // If no roles exist and no filters applied, create default roles
    if (roles.length === 0 && !search && !status) {
      const defaultRoles = [
        {
          name: 'Super Admin',
          description: 'Full system access with all permissions',
          permissions: [
            'users.create', 'users.read', 'users.update', 'users.delete',
            'roles.create', 'roles.read', 'roles.update', 'roles.delete',
            'employees.create', 'employees.read', 'employees.update', 'employees.delete',
            'products.create', 'products.read', 'products.update', 'products.delete',
            'orders.create', 'orders.read', 'orders.update', 'orders.delete',
            'customers.create', 'customers.read', 'customers.update', 'customers.delete',
            'vendors.create', 'vendors.read', 'vendors.update', 'vendors.delete',
            'inventory.read', 'inventory.update',
            'analytics.read', 'reports.read',
            'settings.read', 'settings.update'
          ],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'system',
          updatedBy: 'system'
        },
        {
          name: 'Admin',
          description: 'Administrative access with most permissions',
          permissions: [
            'users.create', 'users.read', 'users.update',
            'employees.create', 'employees.read', 'employees.update',
            'products.create', 'products.read', 'products.update', 'products.delete',
            'orders.create', 'orders.read', 'orders.update', 'orders.delete',
            'customers.create', 'customers.read', 'customers.update', 'customers.delete',
            'vendors.create', 'vendors.read', 'vendors.update', 'vendors.delete',
            'inventory.read', 'inventory.update',
            'analytics.read', 'reports.read'
          ],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'system',
          updatedBy: 'system'
        },
        {
          name: 'Manager',
          description: 'Management access for departments and teams',
          permissions: [
            'users.read',
            'employees.read', 'employees.update',
            'products.read', 'products.update',
            'orders.create', 'orders.read', 'orders.update',
            'customers.create', 'customers.read', 'customers.update',
            'vendors.read',
            'inventory.read',
            'analytics.read', 'reports.read'
          ],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'system',
          updatedBy: 'system'
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
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'system',
          updatedBy: 'system'
        },
        {
          name: 'Sales Rep',
          description: 'Sales representative with order and customer management',
          permissions: [
            'orders.create', 'orders.read', 'orders.update',
            'customers.create', 'customers.read', 'customers.update',
            'products.read',
            'inventory.read'
          ],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'system',
          updatedBy: 'system'
        },
        {
          name: 'HR Manager',
          description: 'Human resources management access',
          permissions: [
            'users.read',
            'employees.create', 'employees.read', 'employees.update',
            'reports.read'
          ],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'system',
          updatedBy: 'system'
        },
        {
          name: 'Viewer',
          description: 'Read-only access to most system features',
          permissions: [
            'users.read',
            'employees.read',
            'products.read',
            'orders.read',
            'customers.read',
            'vendors.read',
            'inventory.read',
            'analytics.read',
            'reports.read'
          ],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'system',
          updatedBy: 'system'
        }
      ];

      await rolesCollection.insertMany(defaultRoles);
      
      return NextResponse.json({
        success: true,
        data: defaultRoles,
        pagination: {
          page: 1,
          limit,
          totalCount: defaultRoles.length,
          totalPages: 1
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: roles,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch roles' },
      { status: 500 }
    );
  }
}

// POST /api/users/roles - Create a new role
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const rolesCollection = db.collection('roles');

    const roleData = await request.json();

    // Check if role name already exists
    const existingRole = await rolesCollection.findOne({
      name: roleData.name
    });

    if (existingRole) {
      return NextResponse.json(
        { success: false, error: 'Role name already exists' },
        { status: 400 }
      );
    }

    const newRole: Role = {
      name: roleData.name,
      description: roleData.description,
      permissions: roleData.permissions || [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'system', // TODO: Get from auth context
      updatedBy: 'system'
    };

    const result = await rolesCollection.insertOne(newRole);

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newRole },
      message: 'Role created successfully'
    });
  } catch (error) {
    console.error('Error creating role:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create role' },
      { status: 500 }
    );
  }
}
