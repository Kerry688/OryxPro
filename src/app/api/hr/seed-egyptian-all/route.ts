import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { egyptianDepartments } from '@/lib/data/egyptian-departments';
import { egyptianEmployees } from '@/lib/data/egyptian-employees';
import { egyptianOrganizationChart } from '@/lib/data/egyptian-organization-chart';
import { ObjectId } from 'mongodb';

// POST /api/hr/seed-egyptian-all - Seed all Egyptian HR demo data
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const departmentsCollection = db.collection('departments');
    const employeesCollection = db.collection('employees');
    const organizationChartsCollection = db.collection('organizationCharts');

    // Clear existing data first
    await Promise.all([
      departmentsCollection.deleteMany({}),
      employeesCollection.deleteMany({}),
      organizationChartsCollection.deleteMany({})
    ]);

    const results = {
      departments: { insertedCount: 0, departmentIds: [] as string[] },
      employees: { insertedCount: 0, employeeIds: [] as string[] },
      organizationChart: { insertedId: null as any }
    };

    // 1. Seed Departments
    const departmentIdMap: { [key: string]: string } = {};
    const departmentsWithIds = egyptianDepartments.map((dept, index) => {
      const departmentId = `DEP${String(index + 1).padStart(3, '0')}`;
      departmentIdMap[dept.code] = departmentId;
      results.departments.departmentIds.push(departmentId);
      
      return {
        ...dept,
        departmentId,
        systemInfo: {
          createdBy: 'system',
          createdAt: new Date(),
          updatedBy: 'system',
          updatedAt: new Date(),
          isActive: true
        }
      };
    });

    // Update parent department references
    const finalDepartments = departmentsWithIds.map(dept => {
      if (dept.parentDepartmentId && departmentIdMap[dept.parentDepartmentId]) {
        return {
          ...dept,
          parentDepartmentId: departmentIdMap[dept.parentDepartmentId]
        };
      }
      return dept;
    });

    const departmentsResult = await departmentsCollection.insertMany(finalDepartments);
    results.departments.insertedCount = departmentsResult.insertedCount;

    // 2. Seed Employees
    const employeesWithIds = egyptianEmployees.map((emp, index) => {
      const employeeId = `EMP${String(index + 1).padStart(3, '0')}`;
      results.employees.employeeIds.push(employeeId);
      
      return {
        ...emp,
        employeeId,
        systemInfo: {
          createdBy: 'system',
          createdAt: new Date(),
          updatedBy: 'system',
          updatedAt: new Date(),
          isActive: true
        }
      };
    });

    const employeesResult = await employeesCollection.insertMany(employeesWithIds);
    results.employees.insertedCount = employeesResult.insertedCount;

    // 3. Seed Organization Chart
    const chartData = {
      ...egyptianOrganizationChart,
      systemInfo: {
        createdBy: 'system',
        createdAt: new Date(),
        updatedBy: 'system',
        updatedAt: new Date(),
        isActive: true
      }
    };

    const chartResult = await organizationChartsCollection.insertOne(chartData);
    results.organizationChart.insertedId = chartResult.insertedId;

    return NextResponse.json({
      success: true,
      message: 'Successfully seeded all Egyptian HR demo data',
      data: {
        summary: {
          departments: results.departments.insertedCount,
          employees: results.employees.insertedCount,
          organizationChart: 1
        },
        details: results
      }
    });
  } catch (error) {
    console.error('Error seeding Egyptian HR demo data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed Egyptian HR demo data' },
      { status: 500 }
    );
  }
}

// GET /api/hr/seed-egyptian-all - Get seeded data summary
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const departmentsCollection = db.collection('departments');
    const employeesCollection = db.collection('employees');
    const organizationChartsCollection = db.collection('organizationCharts');

    const [departmentsCount, employeesCount, chartCount] = await Promise.all([
      departmentsCollection.countDocuments({ 'systemInfo.isActive': true }),
      employeesCollection.countDocuments({ 'systemInfo.isActive': true }),
      organizationChartsCollection.countDocuments({ 'systemInfo.isActive': true })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          departments: departmentsCount,
          employees: employeesCount,
          organizationChart: chartCount
        },
        status: {
          departments: departmentsCount > 0 ? 'seeded' : 'not seeded',
          employees: employeesCount > 0 ? 'seeded' : 'not seeded',
          organizationChart: chartCount > 0 ? 'seeded' : 'not seeded'
        }
      }
    });
  } catch (error) {
    console.error('Error fetching seeded data summary:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch seeded data summary' },
      { status: 500 }
    );
  }
}

// DELETE /api/hr/seed-egyptian-all - Clear all Egyptian HR demo data
export async function DELETE(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const departmentsCollection = db.collection('departments');
    const employeesCollection = db.collection('employees');
    const organizationChartsCollection = db.collection('organizationCharts');

    const [departmentsResult, employeesResult, chartResult] = await Promise.all([
      departmentsCollection.deleteMany({}),
      employeesCollection.deleteMany({}),
      organizationChartsCollection.deleteMany({})
    ]);

    const totalDeleted = departmentsResult.deletedCount + employeesResult.deletedCount + chartResult.deletedCount;

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${totalDeleted} records`,
      data: {
        summary: {
          departments: departmentsResult.deletedCount,
          employees: employeesResult.deletedCount,
          organizationChart: chartResult.deletedCount
        },
        totalDeleted
      }
    });
  } catch (error) {
    console.error('Error clearing Egyptian HR demo data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear Egyptian HR demo data' },
      { status: 500 }
    );
  }
}
