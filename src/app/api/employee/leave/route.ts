import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const db = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const type = searchParams.get('type'); // 'requests' or 'balances'
    
    if (!employeeId) {
      return NextResponse.json(
        { success: false, error: 'Employee ID is required' },
        { status: 400 }
      );
    }
    
    if (type === 'requests') {
      // Fetch leave requests
      const requests = await db.collection('leaveRequests')
        .find({ employeeId })
        .sort({ submittedDate: -1 })
        .toArray();
      
      const formattedRequests = requests.map(request => ({
        requestId: request.requestId,
        leaveTypeId: request.leaveTypeId,
        leaveTypeName: request.leaveTypeName,
        startDate: new Date(request.startDate),
        endDate: new Date(request.endDate),
        totalDays: request.totalDays,
        reason: request.reason,
        status: request.status,
        priority: request.priority,
        submittedDate: new Date(request.submittedDate),
        approvedDate: request.approvalWorkflow?.completedDate ? new Date(request.approvalWorkflow.completedDate) : undefined,
        approvedBy: request.approvalWorkflow?.approvers?.find(a => a.status === 'approved')?.approverName,
        comments: request.approvalWorkflow?.approvers?.find(a => a.status === 'rejected')?.comments,
        isHalfDay: request.isHalfDay,
        halfDayType: request.halfDayType
      }));
      
      return NextResponse.json({
        success: true,
        data: formattedRequests,
        count: formattedRequests.length
      });
    } else if (type === 'balances') {
      // Fetch leave balances
      const currentYear = new Date().getFullYear();
      const balances = await db.collection('leaveBalances')
        .find({ 
          employeeId,
          year: currentYear
        })
        .toArray();
      
      const formattedBalances = balances.map(balance => {
        const total = balance.allocatedDays + balance.carriedForwardDays;
        const used = balance.usedDays + balance.pendingDays;
        const utilizationPercentage = total > 0 ? Math.round((used / total) * 100) : 0;
        
        return {
          leaveTypeId: balance.leaveTypeId,
          leaveTypeName: balance.leaveTypeName,
          leaveTypeCode: balance.leaveTypeCode || balance.leaveTypeName.substring(0, 3).toUpperCase(),
          allocatedDays: balance.allocatedDays,
          usedDays: balance.usedDays,
          pendingDays: balance.pendingDays,
          availableDays: balance.availableDays,
          carriedForwardDays: balance.carriedForwardDays,
          expiresAt: balance.expiresAt ? new Date(balance.expiresAt) : undefined,
          utilizationPercentage
        };
      });
      
      return NextResponse.json({
        success: true,
        data: formattedBalances,
        count: formattedBalances.length
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid type parameter. Use "requests" or "balances"' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error fetching employee leave data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch employee leave data' },
      { status: 500 }
    );
  }
}
