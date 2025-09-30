import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { EmployeePayroll, PayrollFilter } from '@/lib/models/payroll';
import { ObjectId } from 'mongodb';

// GET /api/hr/payroll/employee-payroll - Get employee payroll records
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const employeeId = searchParams.get('employeeId') || '';
    const month = searchParams.get('month') || '';
    const year = searchParams.get('year') || '';
    const status = searchParams.get('status') || '';
    const department = searchParams.get('department') || '';
    const search = searchParams.get('search') || '';

    const { db } = await connectToDatabase();
    const payrollCollection = db.collection('employeePayrolls');

    // Build filter
    const filter: any = { 'systemInfo.isActive': true };
    
    if (employeeId) filter.employeeId = employeeId;
    if (month) filter['payPeriod.month'] = parseInt(month);
    if (year) filter['payPeriod.year'] = parseInt(year);
    if (status) filter.paymentStatus = status;
    if (search) {
      filter.$or = [
        { employeeId: { $regex: search, $options: 'i' } },
        { payrollId: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count
    const total = await payrollCollection.countDocuments(filter);
    
    // Get payroll records with pagination
    const payrollRecords = await payrollCollection
      .find(filter)
      .sort({ 'payPeriod.year': -1, 'payPeriod.month': -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      data: payrollRecords,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching employee payroll records:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payroll records' },
      { status: 500 }
    );
  }
}

// POST /api/hr/payroll/employee-payroll - Create employee payroll record
export async function POST(request: NextRequest) {
  try {
    const payrollData = await request.json();
    const { db } = await connectToDatabase();
    const payrollCollection = db.collection('employeePayrolls');

    // Generate payroll ID
    const count = await payrollCollection.countDocuments();
    const payrollId = `PAY${String(count + 1).padStart(3, '0')}`;

    // Calculate payroll components
    const basicSalary = payrollData.basicSalary || 0;
    const allowancesTotal = payrollData.allowances?.reduce((sum: number, allowance: any) => sum + allowance.amount, 0) || 0;
    const deductionsTotal = payrollData.deductions?.reduce((sum: number, deduction: any) => sum + deduction.amount, 0) || 0;
    const overtimeAmount = payrollData.overtime?.amount || 0;
    const bonusesTotal = payrollData.bonuses?.reduce((sum: number, bonus: any) => sum + bonus.amount, 0) || 0;

    const grossSalary = basicSalary + allowancesTotal + overtimeAmount + bonusesTotal - deductionsTotal;

    // Calculate taxes (simplified calculation)
    const taxRate = 0.15; // 15% income tax
    const socialInsuranceRate = 0.11; // 11% social insurance
    const healthInsuranceRate = 0.025; // 2.5% health insurance
    const pensionRate = 0.05; // 5% pension

    const incomeTax = grossSalary * taxRate;
    const socialInsurance = Math.min(grossSalary * socialInsuranceRate, 15000); // Max 15,000 EGP
    const healthInsurance = grossSalary * healthInsuranceRate;
    const pension = grossSalary * pensionRate;

    const totalTaxes = incomeTax + socialInsurance + healthInsurance + pension;
    const netSalary = grossSalary - totalTaxes;

    const newPayroll: EmployeePayroll = {
      ...payrollData,
      payrollId,
      basicSalary,
      grossSalary,
      taxDeductions: {
        incomeTax,
        socialInsurance,
        healthInsurance,
        pension,
        otherTaxes: 0,
        totalTaxes
      },
      netSalary,
      benefits: {
        healthInsurance: 0,
        retirementPlan: 0,
        otherBenefits: 0,
        totalBenefits: 0
      },
      employerCosts: {
        socialInsurance: socialInsurance * 0.5, // 50% employer contribution
        healthInsurance: healthInsurance * 0.5,
        pension: pension * 0.5,
        otherBenefits: 0,
        totalEmployerCosts: (socialInsurance + healthInsurance + pension) * 0.5
      },
      paymentStatus: 'pending',
      payslipGenerated: false,
      systemInfo: {
        createdBy: 'system', // TODO: Get from auth context
        createdAt: new Date(),
        updatedBy: 'system',
        updatedAt: new Date(),
        isActive: true
      }
    };

    const result = await payrollCollection.insertOne(newPayroll);

    return NextResponse.json({
      success: true,
      data: { ...newPayroll, _id: result.insertedId },
      message: 'Employee payroll record created successfully'
    });
  } catch (error) {
    console.error('Error creating employee payroll record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create payroll record' },
      { status: 500 }
    );
  }
}
