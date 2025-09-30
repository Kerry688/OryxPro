import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { OrganizationStats } from '@/lib/models/organizationChart';

// GET /api/hr/organization-chart/stats - Get organization chart statistics
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const employeesCollection = db.collection('employees');

    // Get all active employees
    const employees = await employeesCollection.find({
      'systemInfo.isActive': true,
      'employmentInfo.employmentStatus': 'active'
    }).toArray();

    if (employees.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          totalEmployees: 0,
          totalDepartments: 0,
          averageSpanOfControl: 0,
          maxDepth: 0,
          departmentBreakdown: [],
          levelBreakdown: []
        }
      });
    }

    // Calculate statistics
    const stats: OrganizationStats = calculateOrganizationStats(employees);

    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching organization stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch organization stats' },
      { status: 500 }
    );
  }
}

// Helper function to calculate organization statistics
function calculateOrganizationStats(employees: any[]): OrganizationStats {
  // Department breakdown
  const departmentMap = new Map<string, { employeeCount: number; managerCount: number }>();
  const levelMap = new Map<number, { levelName: string; employeeCount: number }>();
  
  let totalEmployees = employees.length;
  let totalDepartments = 0;
  let totalManagers = 0;
  let totalDirectReports = 0;
  let maxDepth = 0;

  employees.forEach(employee => {
    const department = employee.employmentInfo.departmentId;
    const position = employee.employmentInfo.jobTitle.toLowerCase();
    const isManager = position.includes('manager') || position.includes('director') || position.includes('ceo') || position.includes('vp');
    
    // Department breakdown
    if (!departmentMap.has(department)) {
      departmentMap.set(department, { employeeCount: 0, managerCount: 0 });
      totalDepartments++;
    }
    
    const deptStats = departmentMap.get(department)!;
    deptStats.employeeCount++;
    if (isManager) {
      deptStats.managerCount++;
      totalManagers++;
    }

    // Level breakdown (simplified based on position)
    let level = 0;
    let levelName = 'Individual Contributor';
    
    if (position.includes('ceo') || position.includes('president')) {
      level = 0;
      levelName = 'Executive';
    } else if (position.includes('vp') || position.includes('vice president')) {
      level = 1;
      levelName = 'Vice President';
    } else if (position.includes('director')) {
      level = 2;
      levelName = 'Director';
    } else if (position.includes('manager') || position.includes('lead')) {
      level = 3;
      levelName = 'Manager';
    } else if (position.includes('senior') || position.includes('sr')) {
      level = 4;
      levelName = 'Senior';
    } else {
      level = 5;
      levelName = 'Individual Contributor';
    }

    maxDepth = Math.max(maxDepth, level);

    if (!levelMap.has(level)) {
      levelMap.set(level, { levelName, employeeCount: 0 });
    }
    levelMap.get(level)!.employeeCount++;

    // Count direct reports
    if (employee.employmentInfo.reportingManager) {
      totalDirectReports++;
    }
  });

  const departmentBreakdown = Array.from(departmentMap.entries()).map(([department, stats]) => ({
    department,
    employeeCount: stats.employeeCount,
    managerCount: stats.managerCount
  }));

  const levelBreakdown = Array.from(levelMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([level, stats]) => ({
      level,
      levelName: stats.levelName,
      employeeCount: stats.employeeCount
    }));

  const averageSpanOfControl = totalManagers > 0 ? totalDirectReports / totalManagers : 0;

  return {
    totalEmployees,
    totalDepartments,
    averageSpanOfControl: Math.round(averageSpanOfControl * 10) / 10,
    maxDepth,
    departmentBreakdown,
    levelBreakdown
  };
}
