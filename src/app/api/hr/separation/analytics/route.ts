import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    
    // Get separation requests
    const separationRequests = await db.collection('separationRequests').find({
      createdAt: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1)
      }
    }).toArray();
    
    // Get exit interviews
    const exitInterviews = await db.collection('exitInterviews').find({}).toArray();
    
    // Get clearance checklists
    const clearanceChecklists = await db.collection('clearanceChecklists').find({}).toArray();
    
    // Calculate analytics
    const totalSeparations = separationRequests.length;
    
    // Separations by type
    const separationsByType = {
      resignation: separationRequests.filter(r => r.separationType === 'resignation').length,
      termination: separationRequests.filter(r => r.separationType === 'termination').length,
      retirement: separationRequests.filter(r => r.separationType === 'retirement').length,
      end_of_contract: separationRequests.filter(r => r.separationType === 'end_of_contract').length,
      redundancy: separationRequests.filter(r => r.separationType === 'redundancy').length,
      mutual_agreement: separationRequests.filter(r => r.separationType === 'mutual_agreement').length
    };
    
    // Separations by department
    const departmentCounts: { [key: string]: number } = {};
    separationRequests.forEach(request => {
      const dept = request.employeeDepartment;
      departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    });
    
    const separationsByDepartment = Object.entries(departmentCounts).map(([department, count]) => ({
      department,
      count,
      percentage: totalSeparations > 0 ? Math.round((count / totalSeparations) * 100) : 0
    }));
    
    // Average notice period
    const validNoticePeriods = separationRequests
      .filter(r => r.noticePeriodDays && r.noticePeriodDays > 0)
      .map(r => r.noticePeriodDays);
    const averageNoticePeriod = validNoticePeriods.length > 0 
      ? Math.round(validNoticePeriods.reduce((sum, days) => sum + days, 0) / validNoticePeriods.length)
      : 0;
    
    // Exit interview completion
    const exitInterviewCompletion = separationRequests.length > 0 
      ? Math.round((exitInterviews.filter(ei => ei.status === 'completed').length / separationRequests.length) * 100)
      : 0;
    
    // Clearance completion
    const clearanceCompletion = separationRequests.length > 0 
      ? Math.round((clearanceChecklists.filter(cc => cc.status === 'completed').length / separationRequests.length) * 100)
      : 0;
    
    // Average separation duration (from submission to completion)
    const completedSeparations = separationRequests.filter(r => r.status === 'completed' && r.completedDate);
    const averageSeparationDuration = completedSeparations.length > 0 
      ? Math.round(completedSeparations.reduce((sum, r) => {
          const duration = Math.ceil((new Date(r.completedDate).getTime() - new Date(r.submittedDate).getTime()) / (1000 * 60 * 60 * 24));
          return sum + duration;
        }, 0) / completedSeparations.length)
      : 0;
    
    // Top resignation reasons
    const resignationReasons: { [key: string]: number } = {};
    separationRequests
      .filter(r => r.separationType === 'resignation' && r.resignationReason)
      .forEach(request => {
        const reason = request.resignationReason;
        resignationReasons[reason] = (resignationReasons[reason] || 0) + 1;
      });
    
    const topResignationReasons = Object.entries(resignationReasons)
      .map(([reason, count]) => ({
        reason,
        count,
        percentage: Math.round((count / Object.values(resignationReasons).reduce((sum, c) => sum + c, 0)) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Monthly trends
    const monthlyTrends = [];
    for (let month = 0; month < 12; month++) {
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0);
      
      const monthSeparations = separationRequests.filter(r => {
        const date = new Date(r.submittedDate);
        return date >= monthStart && date <= monthEnd;
      });
      
      const monthName = monthStart.toLocaleDateString('en-US', { month: 'short' });
      
      monthlyTrends.push({
        month: monthName,
        count: monthSeparations.length,
        resignation: monthSeparations.filter(r => r.separationType === 'resignation').length,
        termination: monthSeparations.filter(r => r.separationType === 'termination').length
      });
    }
    
    const analytics: any = {
      totalSeparations,
      separationsByType,
      separationsByDepartment,
      averageNoticePeriod,
      exitInterviewCompletion,
      clearanceCompletion,
      averageSeparationDuration,
      topResignationReasons,
      monthlyTrends
    };
    
    return NextResponse.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching separation analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch separation analytics' },
      { status: 500 }
    );
  }
}
