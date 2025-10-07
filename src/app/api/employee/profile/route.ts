import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UpdateProfileDTO } from '@/lib/models/employee-portal';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    
    if (!employeeId) {
      return NextResponse.json(
        { success: false, error: 'Employee ID is required' },
        { status: 400 }
      );
    }
    
    const employee = await db.collection('employees').findOne({ employeeId });
    
    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }
    
    // Transform employee data to profile format
    const profile = {
      employeeId: employee.employeeId,
      personalInfo: {
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        email: employee.email || '',
        phone: employee.phone || '',
        address: employee.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'Egypt'
        },
        emergencyContact: employee.emergencyContact || {
          name: '',
          relationship: '',
          phone: '',
          email: ''
        },
        dateOfBirth: employee.dateOfBirth ? new Date(employee.dateOfBirth) : new Date(),
        nationality: employee.nationality || 'Egyptian',
        maritalStatus: employee.maritalStatus || 'single',
        profilePicture: employee.profilePicture
      },
      workInfo: {
        employeeNumber: employee.employeeId,
        department: employee.department || '',
        position: employee.position || '',
        managerId: employee.managerId || '',
        managerName: employee.managerName || '',
        hireDate: employee.hireDate ? new Date(employee.hireDate) : new Date(),
        employmentType: employee.employmentType || 'full-time',
        workLocation: employee.workLocation || '',
        workSchedule: employee.workSchedule || '9:00 AM - 5:00 PM',
        directReports: employee.directReports || []
      },
      contactInfo: {
        workEmail: employee.email || '',
        workPhone: employee.workPhone || '',
        extension: employee.extension || '',
        deskLocation: employee.deskLocation || ''
      },
      skills: employee.skills || [],
      preferences: employee.preferences || {
        language: 'en',
        timezone: 'Africa/Cairo',
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        privacy: {
          showProfilePicture: true,
          showContactInfo: true,
          showSkills: true
        }
      },
      lastUpdated: new Date(),
      updatedBy: employeeId
    };
    
    return NextResponse.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching employee profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch employee profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = await connectToDatabase();
    const body: UpdateProfileDTO & { employeeId: string } = await request.json();
    
    const { employeeId, ...updateData } = body;
    
    if (!employeeId) {
      return NextResponse.json(
        { success: false, error: 'Employee ID is required' },
        { status: 400 }
      );
    }
    
    const employee = await db.collection('employees').findOne({ employeeId });
    
    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }
    
    // Build update object
    const updateObject: any = {
      lastUpdated: new Date(),
      updatedBy: employeeId
    };
    
    if (updateData.personalInfo) {
      Object.assign(updateObject, {
        firstName: updateData.personalInfo.firstName || employee.firstName,
        lastName: updateData.personalInfo.lastName || employee.lastName,
        email: updateData.personalInfo.email || employee.email,
        phone: updateData.personalInfo.phone || employee.phone,
        address: updateData.personalInfo.address || employee.address,
        emergencyContact: updateData.personalInfo.emergencyContact || employee.emergencyContact,
        dateOfBirth: updateData.personalInfo.dateOfBirth || employee.dateOfBirth,
        nationality: updateData.personalInfo.nationality || employee.nationality,
        maritalStatus: updateData.personalInfo.maritalStatus || employee.maritalStatus,
        profilePicture: updateData.personalInfo.profilePicture || employee.profilePicture
      });
    }
    
    if (updateData.contactInfo) {
      Object.assign(updateObject, {
        workPhone: updateData.contactInfo.workPhone || employee.workPhone,
        extension: updateData.contactInfo.extension || employee.extension,
        deskLocation: updateData.contactInfo.deskLocation || employee.deskLocation
      });
    }
    
    if (updateData.skills) {
      updateObject.skills = updateData.skills;
    }
    
    if (updateData.preferences) {
      updateObject.preferences = {
        ...employee.preferences,
        ...updateData.preferences
      };
    }
    
    await db.collection('employees').updateOne(
      { employeeId },
      { $set: updateObject }
    );
    
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating employee profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update employee profile' },
      { status: 500 }
    );
  }
}
