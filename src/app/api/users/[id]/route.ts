import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { hashPassword, validatePasswordStrength } from '@/lib/auth/password';

// User interface
interface User {
  _id?: ObjectId;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  roleId: string;
  branchId?: string;
  department: string;
  position: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  twoFactorEnabled: boolean;
  employeeId?: string;
  password: string;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

interface UpdateUserDTO {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  status?: 'active' | 'inactive' | 'suspended' | 'pending';
  roleId?: string;
  branchId?: string;
  department?: string;
  position?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  twoFactorEnabled?: boolean;
  employeeId?: string;
  password?: string;
}

// GET /api/users/[id] - Get a specific user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const user = await usersCollection.findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0 } } // Exclude password from results
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update a specific user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    const { id } = params;
    const updateData: UpdateUserDTO = await request.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if username or email already exists (excluding current user)
    if (updateData.username || updateData.email) {
      const duplicateQuery: any = {
        _id: { $ne: new ObjectId(id) }
      };

      const orConditions = [];
      if (updateData.username) {
        orConditions.push({ username: updateData.username });
      }
      if (updateData.email) {
        orConditions.push({ email: updateData.email });
      }

      if (orConditions.length > 0) {
        duplicateQuery.$or = orConditions;

        const duplicateUser = await usersCollection.findOne(duplicateQuery);
        if (duplicateUser) {
          return NextResponse.json(
            { success: false, error: 'Username or email already exists' },
            { status: 400 }
          );
        }
      }
    }

    // Check if employee is already linked to another user
    if (updateData.employeeId) {
      const existingEmployeeUser = await usersCollection.findOne({
        employeeId: updateData.employeeId,
        _id: { $ne: new ObjectId(id) }
      });

      if (existingEmployeeUser) {
        return NextResponse.json(
          { success: false, error: 'Employee is already linked to another user' },
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

    // Hash password if provided
    if (updateData.password) {
      // Validate password strength
      const passwordValidation = validatePasswordStrength(updateData.password);
      if (!passwordValidation.isValid) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Password does not meet security requirements',
            details: passwordValidation.errors
          },
          { status: 400 }
        );
      }
      
      updateObject.password = await hashPassword(updateData.password);
    }

    // Remove undefined values
    Object.keys(updateObject).forEach(key => {
      if (updateObject[key] === undefined) {
        delete updateObject[key];
      }
    });

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateObject }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Return updated user without password
    const updatedUser = await usersCollection.findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0 } }
    );

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete a specific user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent deletion of admin users (you might want to add more business logic here)
    if (existingUser.roleId === 'admin') {
      return NextResponse.json(
        { success: false, error: 'Cannot delete admin users' },
        { status: 403 }
      );
    }

    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
