import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UpdateClearanceItemDTO } from '@/lib/models/separation';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const separationId = searchParams.get('separationId');
    const employeeId = searchParams.get('employeeId');
    
    let query: any = {};
    
    if (separationId) {
      query.separationId = separationId;
    }
    
    if (employeeId) {
      query.employeeId = employeeId;
    }
    
    const clearanceChecklists = await db.collection('clearanceChecklists')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json({
      success: true,
      data: clearanceChecklists,
      count: clearanceChecklists.length
    });
  } catch (error) {
    console.error('Error fetching clearance checklists:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clearance checklists' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    const { separationId, employeeId } = body;
    
    if (!separationId || !employeeId) {
      return NextResponse.json(
        { success: false, error: 'Separation ID and Employee ID are required' },
        { status: 400 }
      );
    }
    
    // Get separation request details
    const separationRequest = await db.collection('separationRequests').findOne({ separationId });
    if (!separationRequest) {
      return NextResponse.json(
        { success: false, error: 'Separation request not found' },
        { status: 404 }
      );
    }
    
    // Default clearance categories and items
    const defaultCategories = [
      {
        categoryId: 'CAT001',
        categoryName: 'IT Assets & Access',
        items: [
          {
            itemId: 'ITEM001',
            itemName: 'Laptop Return',
            description: 'Return company laptop and accessories',
            department: 'IT',
            responsiblePerson: 'IT_ADMIN',
            responsiblePersonName: 'IT Administrator',
            status: 'pending',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          },
          {
            itemId: 'ITEM002',
            itemName: 'Desktop Computer',
            description: 'Return desktop computer and peripherals',
            department: 'IT',
            responsiblePerson: 'IT_ADMIN',
            responsiblePersonName: 'IT Administrator',
            status: 'pending',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          },
          {
            itemId: 'ITEM003',
            itemName: 'Mobile Device',
            description: 'Return company mobile device',
            department: 'IT',
            responsiblePerson: 'IT_ADMIN',
            responsiblePersonName: 'IT Administrator',
            status: 'pending',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          },
          {
            itemId: 'ITEM004',
            itemName: 'Email Account Deactivation',
            description: 'Deactivate company email account',
            department: 'IT',
            responsiblePerson: 'IT_ADMIN',
            responsiblePersonName: 'IT Administrator',
            status: 'pending',
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
          },
          {
            itemId: 'ITEM005',
            itemName: 'System Access Removal',
            description: 'Remove access from all company systems',
            department: 'IT',
            responsiblePerson: 'IT_ADMIN',
            responsiblePersonName: 'IT Administrator',
            status: 'pending',
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
          }
        ]
      },
      {
        categoryId: 'CAT002',
        categoryName: 'Finance & Settlements',
        items: [
          {
            itemId: 'ITEM006',
            itemName: 'Salary Advance Settlement',
            description: 'Clear any outstanding salary advances',
            department: 'Finance',
            responsiblePerson: 'FINANCE_MGR',
            responsiblePersonName: 'Finance Manager',
            status: 'pending',
            dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
          },
          {
            itemId: 'ITEM007',
            itemName: 'Expense Claims',
            description: 'Submit and process final expense claims',
            department: 'Finance',
            responsiblePerson: 'FINANCE_MGR',
            responsiblePersonName: 'Finance Manager',
            status: 'pending',
            dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
          },
          {
            itemId: 'ITEM008',
            itemName: 'Loan Settlement',
            description: 'Settle any outstanding company loans',
            department: 'Finance',
            responsiblePerson: 'FINANCE_MGR',
            responsiblePersonName: 'Finance Manager',
            status: 'pending',
            dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
          },
          {
            itemId: 'ITEM009',
            itemName: 'Final Settlement',
            description: 'Process final salary and benefits settlement',
            department: 'Finance',
            responsiblePerson: 'FINANCE_MGR',
            responsiblePersonName: 'Finance Manager',
            status: 'pending',
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
          },
          {
            itemId: 'ITEM010',
            itemName: 'Tax Documents',
            description: 'Provide final tax documents and certificates',
            department: 'Finance',
            responsiblePerson: 'FINANCE_MGR',
            responsiblePersonName: 'Finance Manager',
            status: 'pending',
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
          }
        ]
      },
      {
        categoryId: 'CAT003',
        categoryName: 'HR & Documentation',
        items: [
          {
            itemId: 'ITEM011',
            itemName: 'ID Card Return',
            description: 'Return company ID card',
            department: 'HR',
            responsiblePerson: 'HR_MGR',
            responsiblePersonName: 'HR Manager',
            status: 'pending',
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
          },
          {
            itemId: 'ITEM012',
            itemName: 'Access Cards',
            description: 'Return all building and office access cards',
            department: 'HR',
            responsiblePerson: 'HR_MGR',
            responsiblePersonName: 'HR Manager',
            status: 'pending',
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
          },
          {
            itemId: 'ITEM013',
            itemName: 'Company Uniforms',
            description: 'Return company uniforms and branded items',
            department: 'HR',
            responsiblePerson: 'HR_MGR',
            responsiblePersonName: 'HR Manager',
            status: 'pending',
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
          },
          {
            itemId: 'ITEM014',
            itemName: 'Leave Balance Settlement',
            description: 'Calculate and process leave balance',
            department: 'HR',
            responsiblePerson: 'HR_MGR',
            responsiblePersonName: 'HR Manager',
            status: 'pending',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          },
          {
            itemId: 'ITEM015',
            itemName: 'Experience Certificate',
            description: 'Prepare and issue experience certificate',
            department: 'HR',
            responsiblePerson: 'HR_MGR',
            responsiblePersonName: 'HR Manager',
            status: 'pending',
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
          }
        ]
      },
      {
        categoryId: 'CAT004',
        categoryName: 'Operations & Handover',
        items: [
          {
            itemId: 'ITEM016',
            itemName: 'Client Handover',
            description: 'Complete client handover and transition',
            department: 'Operations',
            responsiblePerson: 'OPS_MGR',
            responsiblePersonName: 'Operations Manager',
            status: 'pending',
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
          },
          {
            itemId: 'ITEM017',
            itemName: 'Project Handover',
            description: 'Transfer project responsibilities and documentation',
            department: 'Operations',
            responsiblePerson: 'OPS_MGR',
            responsiblePersonName: 'Operations Manager',
            status: 'pending',
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
          },
          {
            itemId: 'ITEM018',
            itemName: 'Knowledge Transfer',
            description: 'Complete knowledge transfer sessions',
            department: 'Operations',
            responsiblePerson: 'OPS_MGR',
            responsiblePersonName: 'Operations Manager',
            status: 'pending',
            dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
          },
          {
            itemId: 'ITEM019',
            itemName: 'Training Materials',
            description: 'Return training materials and resources',
            department: 'Operations',
            responsiblePerson: 'OPS_MGR',
            responsiblePersonName: 'Operations Manager',
            status: 'pending',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          },
          {
            itemId: 'ITEM020',
            itemName: 'Contact List',
            description: 'Provide updated contact list for ongoing projects',
            department: 'Operations',
            responsiblePerson: 'OPS_MGR',
            responsiblePersonName: 'Operations Manager',
            status: 'pending',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }
        ]
      }
    ];
    
    // Create clearance checklist
    const clearanceChecklist = {
      checklistId: `CLEAR${Date.now()}`,
      separationId,
      employeeId,
      employeeName: separationRequest.employeeName,
      
      categories: defaultCategories,
      
      status: 'not_started',
      completionPercentage: 0,
      
      itAssets: {
        laptop: false,
        desktop: false,
        mobile: false,
        tablet: false,
        accessories: false,
        software: false,
        email: false,
        systemAccess: false,
        dataTransfer: false
      },
      
      finance: {
        salaryAdvance: false,
        expenseClaims: false,
        loanSettlement: false,
        finalSettlement: false,
        taxDocuments: false,
        benefitsTermination: false
      },
      
      hr: {
        idCard: false,
        accessCards: false,
        uniforms: false,
        equipment: false,
        leaveBalance: false,
        finalDocuments: false
      },
      
      operations: {
        clientHandover: false,
        projectHandover: false,
        knowledgeTransfer: false,
        trainingMaterials: false,
        contacts: false
      },
      
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'system',
      updatedBy: 'system'
    };
    
    await db.collection('clearanceChecklists').insertOne(clearanceChecklist);
    
    return NextResponse.json({
      success: true,
      data: clearanceChecklist,
      message: 'Clearance checklist created successfully'
    });
  } catch (error) {
    console.error('Error creating clearance checklist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create clearance checklist' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const body: UpdateClearanceItemDTO & { checklistId: string } = await request.json();
    
    const { checklistId, itemId, status, comments, attachments } = body;
    
    if (!checklistId || !itemId) {
      return NextResponse.json(
        { success: false, error: 'Checklist ID and Item ID are required' },
        { status: 400 }
      );
    }
    
    // Update specific clearance item
    const updateObject: any = {
      status,
      updatedAt: new Date()
    };
    
    if (comments) {
      updateObject.comments = comments;
    }
    
    if (attachments) {
      updateObject.attachments = attachments;
    }
    
    if (status === 'completed') {
      updateObject.completedDate = new Date();
    }
    
    // Update the specific item in the categories array
    await db.collection('clearanceChecklists').updateOne(
      { 
        checklistId,
        'categories.items.itemId': itemId
      },
      {
        $set: {
          'categories.$[category].items.$[item].status': status,
          'categories.$[category].items.$[item].comments': comments || '',
          'categories.$[category].items.$[item].attachments': attachments || [],
          'categories.$[category].items.$[item].completedDate': status === 'completed' ? new Date() : undefined,
          updatedAt: new Date()
        }
      },
      {
        arrayFilters: [
          { 'category.items.itemId': itemId },
          { 'item.itemId': itemId }
        ]
      }
    );
    
    // Recalculate completion percentage
    const checklist = await db.collection('clearanceChecklists').findOne({ checklistId });
    if (checklist) {
      let totalItems = 0;
      let completedItems = 0;
      
      checklist.categories.forEach((category: any) => {
        category.items.forEach((item: any) => {
          totalItems++;
          if (item.status === 'completed') {
            completedItems++;
          }
        });
      });
      
      const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
      const overallStatus = completionPercentage === 100 ? 'completed' : 
                           completionPercentage > 0 ? 'in_progress' : 'not_started';
      
      await db.collection('clearanceChecklists').updateOne(
        { checklistId },
        {
          $set: {
            completionPercentage,
            status: overallStatus,
            updatedAt: new Date()
          }
        }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Clearance item updated successfully'
    });
  } catch (error) {
    console.error('Error updating clearance item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update clearance item' },
      { status: 500 }
    );
  }
}
