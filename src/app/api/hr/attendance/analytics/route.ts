import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const department = searchParams.get('department');
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    
    // Set date range
    let dateQuery: any = {};
    if (startDate && endDate) {
      dateQuery.workDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else {
      // Default to current year
      dateQuery.workDate = {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1)
      };
    }
    
    // Add department filter if provided
    if (department) {
      dateQuery.employeeDepartment = department;
    }
    
    // Get attendance records
    const attendanceRecords = await db.collection('attendanceRecords').find(dateQuery).toArray();
    
    // Get total employees
    const totalEmployees = await db.collection('employees').countDocuments(
      department ? { department } : {}
    );
    
    // Calculate analytics
    const totalWorkDays = attendanceRecords.length;
    const totalWorkHours = attendanceRecords.reduce((sum, record) => sum + (record.totalWorkHours || 0), 0);
    const totalOvertimeHours = attendanceRecords.reduce((sum, record) => sum + (record.overtimeHours || 0), 0);
    
    const presentRecords = attendanceRecords.filter(record => record.status === 'present' || record.status === 'late');
    const absentRecords = attendanceRecords.filter(record => record.status === 'absent');
    const lateRecords = attendanceRecords.filter(record => record.status === 'late');
    
    const averageAttendance = totalEmployees > 0 ? Math.round((presentRecords.length / (totalEmployees * 365)) * 100) : 0;
    
    // Attendance by department
    const departmentStats: { [key: string]: any } = {};
    attendanceRecords.forEach(record => {
      const dept = record.employeeDepartment;
      if (!departmentStats[dept]) {
        departmentStats[dept] = {
          employees: new Set(),
          totalHours: 0,
          overtimeHours: 0,
          presentCount: 0,
          absentCount: 0,
          lateCount: 0
        };
      }
      
      departmentStats[dept].employees.add(record.employeeId);
      departmentStats[dept].totalHours += record.totalWorkHours || 0;
      departmentStats[dept].overtimeHours += record.overtimeHours || 0;
      
      if (record.status === 'present' || record.status === 'late') {
        departmentStats[dept].presentCount++;
      }
      if (record.status === 'absent') {
        departmentStats[dept].absentCount++;
      }
      if (record.status === 'late') {
        departmentStats[dept].lateCount++;
      }
    });
    
    const attendanceByDepartment = Object.entries(departmentStats).map(([department, stats]) => ({
      department,
      employees: stats.employees.size,
      averageAttendance: stats.employees.size > 0 ? Math.round((stats.presentCount / (stats.employees.size * 365)) * 100) : 0,
      totalHours: Math.round(stats.totalHours * 100) / 100,
      overtimeHours: Math.round(stats.overtimeHours * 100) / 100
    }));
    
    // Attendance by shift
    const shiftStats: { [key: string]: any } = {};
    attendanceRecords.forEach(record => {
      const shift = record.shiftName || 'No Shift';
      if (!shiftStats[shift]) {
        shiftStats[shift] = {
          employees: new Set(),
          totalHours: 0,
          overtimeHours: 0,
          presentCount: 0
        };
      }
      
      shiftStats[shift].employees.add(record.employeeId);
      shiftStats[shift].totalHours += record.totalWorkHours || 0;
      shiftStats[shift].overtimeHours += record.overtimeHours || 0;
      
      if (record.status === 'present' || record.status === 'late') {
        shiftStats[shift].presentCount++;
      }
    });
    
    const attendanceByShift = Object.entries(shiftStats).map(([shiftName, stats]) => ({
      shiftName,
      employees: stats.employees.size,
      averageAttendance: stats.employees.size > 0 ? Math.round((stats.presentCount / (stats.employees.size * 365)) * 100) : 0,
      totalHours: Math.round(stats.totalHours * 100) / 100,
      overtimeHours: Math.round(stats.overtimeHours * 100) / 100
    }));
    
    // Daily trends (last 30 days)
    const dailyTrends = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const dayRecords = attendanceRecords.filter(record => {
        const recordDate = new Date(record.workDate);
        return recordDate >= date && recordDate < nextDay;
      });
      
      dailyTrends.push({
        date,
        present: dayRecords.filter(r => r.status === 'present' || r.status === 'late').length,
        absent: dayRecords.filter(r => r.status === 'absent').length,
        late: dayRecords.filter(r => r.status === 'late').length,
        overtime: dayRecords.reduce((sum, r) => sum + (r.overtimeHours || 0), 0)
      });
    }
    
    // Monthly trends
    const monthlyTrends = [];
    for (let month = 0; month < 12; month++) {
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0);
      
      const monthRecords = attendanceRecords.filter(record => {
        const recordDate = new Date(record.workDate);
        return recordDate >= monthStart && recordDate <= monthEnd;
      });
      
      const monthName = monthStart.toLocaleDateString('en-US', { month: 'short' });
      
      monthlyTrends.push({
        month: monthName,
        averageAttendance: totalEmployees > 0 ? Math.round((monthRecords.filter(r => r.status === 'present' || r.status === 'late').length / (totalEmployees * monthEnd.getDate())) * 100) : 0,
        totalHours: Math.round(monthRecords.reduce((sum, r) => sum + (r.totalWorkHours || 0), 0) * 100) / 100,
        overtimeHours: Math.round(monthRecords.reduce((sum, r) => sum + (r.overtimeHours || 0), 0) * 100) / 100
      });
    }
    
    const analytics = {
      totalEmployees,
      totalWorkDays,
      averageAttendance,
      totalWorkHours: Math.round(totalWorkHours * 100) / 100,
      totalOvertimeHours: Math.round(totalOvertimeHours * 100) / 100,
      lateArrivals: lateRecords.length,
      earlyDepartures: attendanceRecords.filter(r => r.earlyDepartureMinutes > 0).length,
      absences: absentRecords.length,
      attendanceByDepartment,
      attendanceByShift,
      dailyTrends,
      monthlyTrends
    };
    
    return NextResponse.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching attendance analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch attendance analytics' },
      { status: 500 }
    );
  }
}
