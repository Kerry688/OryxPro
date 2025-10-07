import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

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
    
    // Fetch leave requests
    const leaveRequests = await db.collection('leaveRequests')
      .find({ employeeId })
      .toArray();
    
    const leaveRequestsStats = {
      total: leaveRequests.length,
      pending: leaveRequests.filter(r => r.status === 'pending').length,
      approved: leaveRequests.filter(r => r.status === 'approved').length,
      rejected: leaveRequests.filter(r => r.status === 'rejected').length
    };
    
    // Fetch leave balances
    const currentYear = new Date().getFullYear();
    const leaveBalances = await db.collection('leaveBalances')
      .find({ 
        employeeId,
        year: currentYear
      })
      .toArray();
    
    const totalAvailableDays = leaveBalances.reduce((sum, balance) => sum + balance.availableDays, 0);
    const mostUsedType = leaveBalances.reduce((max, balance) => 
      balance.usedDays > (max.usedDays || 0) ? balance : max, { usedDays: 0 });
    const totalAllocated = leaveBalances.reduce((sum, balance) => sum + balance.allocatedDays, 0);
    const totalUsed = leaveBalances.reduce((sum, balance) => sum + balance.usedDays, 0);
    const utilizationPercentage = totalAllocated > 0 ? Math.round((totalUsed / totalAllocated) * 100) : 0;
    
    const leaveBalancesStats = {
      totalAvailableDays,
      mostUsedType: mostUsedType.leaveTypeName || 'None',
      utilizationPercentage
    };
    
    // Fetch payslips
    const payslips = await db.collection('employeePayrolls')
      .find({ employeeId })
      .sort({ 'payPeriod.year': -1, 'payPeriod.month': -1 })
      .toArray();
    
    const lastPayslip = payslips[0];
    const payslipsStats = {
      totalPayslips: payslips.length,
      lastPayslipDate: lastPayslip ? new Date(lastPayslip.createdAt) : undefined,
      lastPayslipAmount: lastPayslip ? lastPayslip.netSalary : undefined
    };
    
    // Fetch announcements
    const employee = await db.collection('employees').findOne({ employeeId });
    const announcementsQuery: any = {
      isActive: true,
      $or: [
        { 'targetAudience.allEmployees': true },
        { 'targetAudience.departments': { $in: [employee?.department] } },
        { 'targetAudience.positions': { $in: [employee?.position] } },
        { 'targetAudience.specificEmployees': { $in: [employeeId] } }
      ]
    };
    
    const announcements = await db.collection('announcements')
      .find(announcementsQuery)
      .sort({ publishDate: -1 })
      .toArray();
    
    const unreadAnnouncements = announcements.filter(a => !a.readBy?.includes(employeeId));
    const urgentAnnouncements = announcements.filter(a => a.priority === 'urgent');
    const lastAnnouncement = announcements[0];
    
    const announcementsStats = {
      unreadCount: unreadAnnouncements.length,
      urgentCount: urgentAnnouncements.length,
      lastAnnouncementDate: lastAnnouncement ? new Date(lastAnnouncement.publishDate) : undefined
    };
    
    // Fetch messages
    const messages = await db.collection('messages')
      .find({ toEmployeeId: employeeId })
      .sort({ sentDate: -1 })
      .toArray();
    
    const unreadMessages = messages.filter(m => !m.isRead);
    const urgentMessages = messages.filter(m => m.priority === 'urgent' || m.priority === 'high');
    const lastMessage = messages[0];
    
    const messagesStats = {
      unreadCount: unreadMessages.length,
      urgentCount: urgentMessages.length,
      lastMessageDate: lastMessage ? new Date(lastMessage.sentDate) : undefined
    };
    
    const dashboardStats = {
      leaveRequests: leaveRequestsStats,
      leaveBalances: leaveBalancesStats,
      payslips: payslipsStats,
      announcements: announcementsStats,
      messages: messagesStats
    };
    
    return NextResponse.json({
      success: true,
      data: dashboardStats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
