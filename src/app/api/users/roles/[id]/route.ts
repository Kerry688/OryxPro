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

interface UpdateRoleDTO {
  name?: string;
  description?: string;
  permissions?: string[];
  isActive?: boolean;
}

// GET /api/users/roles/[id] - Get a specific role
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const rolesCollection = db.collection('roles');

    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role ID' },
        { status: 400 }
      );
    }

    const role = await rolesCollection.findOne({ _id: new ObjectId(id) });

    if (!role) {
      return NextResponse.json(
        { success: false, error: 'Role not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: role });
  } catch (error) {
    console.error('Error fetching role:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch role' },
      { status: 500 }
    );
  }
}

// PUT /api/users/roles/[id] - Update a specific role
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const rolesCollection = db.collection('roles');
    const usersCollection = db.collection('users');

    const { id } = params;
    const updateData: UpdateRoleDTO = await request.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role ID' },
        { status: 400 }
      );
    }

    // Check if role exists
    const existingRole = await rolesCollection.findOne({ _id: new ObjectId(id) });
    if (!existingRole) {
      return NextResponse.json(
        { success: false, error: 'Role not found' },
        { status: 404 }
      );
    }

    // Check if role name already exists (excluding current role)
    if (updateData.name && updateData.name !== existingRole.name) {
      const duplicateRole = await rolesCollection.findOne({
        name: updateData.name,
        _id: { $ne: new ObjectId(id) }
      });

      if (duplicateRole) {
        return NextResponse.json(
          { success: false, error: 'Role name already exists' },
          { status: 400 }
        );
      }
    }

    // Prepare update object
    const updateObject: any = {
      ...updateData,
      updatedAt: new Date(),
      updatedBy: 'system' // TODO: Get from auth context
    };

    // Remove undefined values
    Object.keys(updateObject).forEach(key => {
      if (updateObject[key] === undefined) {
        delete updateObject[key];
      }
    });

    const result = await rolesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateObject }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Role not found' },
        { status: 404 }
      );
    }

    // Return updated role
    const updatedRole = await rolesCollection.findOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      data: updatedRole,
      message: 'Role updated successfully'
    });
  } catch (error) {
    console.error('Error updating role:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update role' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/roles/[id] - Delete a specific role
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const rolesCollection = db.collection('roles');
    const usersCollection = db.collection('users');

    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role ID' },
        { status: 400 }
      );
    }

    // Check if role exists
    const existingRole = await rolesCollection.findOne({ _id: new ObjectId(id) });
    if (!existingRole) {
      return NextResponse.json(
        { success: false, error: 'Role not found' },
        { status: 404 }
      );
    }

    // Check if any users are assigned to this role
    const usersWithRole = await usersCollection.countDocuments({
      roleId: id
    });

    if (usersWithRole > 0) {
      return NextResponse.json(
        { success: false, error: `Cannot delete role. ${usersWithRole} user(s) are assigned to this role.` },
        { status: 400 }
      );
    }

    // Prevent deletion of system roles
    const systemRoles = ['super_admin', 'admin'];
    if (systemRoles.includes(existingRole.name.toLowerCase().replace(/\s+/g, '_'))) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete system roles' },
        { status: 403 }
      );
    }

    const result = await rolesCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Role not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting role:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete role' },
      { status: 500 }
    );
  }
}
