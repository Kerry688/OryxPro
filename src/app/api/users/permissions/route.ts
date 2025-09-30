import { NextRequest, NextResponse } from 'next/server';

// Permission categories and their permissions
const PERMISSION_CATEGORIES = [
  {
    category: 'User Management',
    permissions: [
      { key: 'users.create', label: 'Create Users', description: 'Create new user accounts' },
      { key: 'users.read', label: 'View Users', description: 'View user information' },
      { key: 'users.update', label: 'Update Users', description: 'Modify user information' },
      { key: 'users.delete', label: 'Delete Users', description: 'Remove user accounts' },
      { key: 'users.manage_roles', label: 'Manage User Roles', description: 'Assign roles to users' },
    ]
  },
  {
    category: 'Role & Permission Management',
    permissions: [
      { key: 'roles.create', label: 'Create Roles', description: 'Create new roles' },
      { key: 'roles.read', label: 'View Roles', description: 'View role information' },
      { key: 'roles.update', label: 'Update Roles', description: 'Modify role permissions' },
      { key: 'roles.delete', label: 'Delete Roles', description: 'Remove roles' },
    ]
  },
  {
    category: 'Employee Management',
    permissions: [
      { key: 'employees.create', label: 'Create Employees', description: 'Add new employees' },
      { key: 'employees.read', label: 'View Employees', description: 'View employee information' },
      { key: 'employees.update', label: 'Update Employees', description: 'Modify employee data' },
      { key: 'employees.delete', label: 'Delete Employees', description: 'Remove employees' },
      { key: 'employees.manage_hr', label: 'HR Management', description: 'Access HR features' },
    ]
  },
  {
    category: 'Product Management',
    permissions: [
      { key: 'products.create', label: 'Create Products', description: 'Add new products' },
      { key: 'products.read', label: 'View Products', description: 'View product information' },
      { key: 'products.update', label: 'Update Products', description: 'Modify product data' },
      { key: 'products.delete', label: 'Delete Products', description: 'Remove products' },
      { key: 'products.manage_categories', label: 'Manage Categories', description: 'Manage product categories' },
      { key: 'products.manage_brands', label: 'Manage Brands', description: 'Manage product brands' },
    ]
  },
  {
    category: 'Order Management',
    permissions: [
      { key: 'orders.create', label: 'Create Orders', description: 'Create new orders' },
      { key: 'orders.read', label: 'View Orders', description: 'View order information' },
      { key: 'orders.update', label: 'Update Orders', description: 'Modify order data' },
      { key: 'orders.delete', label: 'Delete Orders', description: 'Remove orders' },
      { key: 'orders.manage_status', label: 'Manage Order Status', description: 'Change order status' },
    ]
  },
  {
    category: 'Customer Management',
    permissions: [
      { key: 'customers.create', label: 'Create Customers', description: 'Add new customers' },
      { key: 'customers.read', label: 'View Customers', description: 'View customer information' },
      { key: 'customers.update', label: 'Update Customers', description: 'Modify customer data' },
      { key: 'customers.delete', label: 'Delete Customers', description: 'Remove customers' },
    ]
  },
  {
    category: 'Inventory Management',
    permissions: [
      { key: 'inventory.read', label: 'View Inventory', description: 'View inventory levels' },
      { key: 'inventory.update', label: 'Update Inventory', description: 'Modify inventory levels' },
      { key: 'inventory.manage_stock', label: 'Manage Stock', description: 'Manage stock movements' },
      { key: 'inventory.manage_warehouses', label: 'Manage Warehouses', description: 'Manage warehouse locations' },
    ]
  },
  {
    category: 'Analytics & Reports',
    permissions: [
      { key: 'analytics.read', label: 'View Analytics', description: 'Access analytics dashboard' },
      { key: 'reports.read', label: 'View Reports', description: 'Generate and view reports' },
      { key: 'reports.create', label: 'Create Reports', description: 'Create custom reports' },
      { key: 'reports.export', label: 'Export Reports', description: 'Export reports to various formats' },
    ]
  },
  {
    category: 'System Administration',
    permissions: [
      { key: 'settings.read', label: 'View Settings', description: 'View system settings' },
      { key: 'settings.update', label: 'Update Settings', description: 'Modify system settings' },
      { key: 'system.backup', label: 'System Backup', description: 'Create system backups' },
      { key: 'system.maintenance', label: 'System Maintenance', description: 'Perform system maintenance' },
    ]
  },
  {
    category: 'Branch Management',
    permissions: [
      { key: 'branches.create', label: 'Create Branches', description: 'Add new branches' },
      { key: 'branches.read', label: 'View Branches', description: 'View branch information' },
      { key: 'branches.update', label: 'Update Branches', description: 'Modify branch data' },
      { key: 'branches.delete', label: 'Delete Branches', description: 'Remove branches' },
    ]
  }
];

// GET /api/users/permissions - Get all available permissions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let filteredCategories = PERMISSION_CATEGORIES;

    // Filter by category if specified
    if (category) {
      filteredCategories = filteredCategories.filter(cat => 
        cat.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    // Filter by search term if specified
    if (search) {
      filteredCategories = filteredCategories.map(cat => ({
        ...cat,
        permissions: cat.permissions.filter(perm => 
          perm.label.toLowerCase().includes(search.toLowerCase()) ||
          perm.description.toLowerCase().includes(search.toLowerCase()) ||
          perm.key.toLowerCase().includes(search.toLowerCase())
        )
      })).filter(cat => cat.permissions.length > 0);
    }

    // Get all unique permissions
    const allPermissions = filteredCategories.flatMap(cat => 
      cat.permissions.map(perm => ({
        ...perm,
        category: cat.category
      }))
    );

    return NextResponse.json({
      success: true,
      data: {
        categories: filteredCategories,
        allPermissions,
        totalPermissions: allPermissions.length
      }
    });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch permissions' },
      { status: 500 }
    );
  }
}
