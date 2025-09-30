import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const db = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const year = searchParams.get('year') || new Date().getFullYear().toString();
    const month = searchParams.get('month');
    
    if (!employeeId) {
      return NextResponse.json(
        { success: false, error: 'Employee ID is required' },
        { status: 400 }
      );
    }
    
    // Build query
    let query: any = { employeeId };
    
    if (year) {
      query['payPeriod.year'] = parseInt(year);
    }
    
    if (month) {
      query['payPeriod.month'] = parseInt(month);
    }
    
    const payslips = await db.collection('employeePayrolls').find(query).sort({ 'payPeriod.year': -1, 'payPeriod.month': -1 }).toArray();
    
    // Transform to payslip format
    const formattedPayslips = payslips.map(payroll => ({
      payslipId: payroll._id.toString(),
      employeeId: payroll.employeeId,
      employeeName: payroll.employeeName || 'Employee Name',
      payPeriod: {
        startDate: new Date(payroll.payPeriod.startDate),
        endDate: new Date(payroll.payPeriod.endDate),
        month: payroll.payPeriod.month,
        year: payroll.payPeriod.year
      },
      basicSalary: payroll.basicSalary || 0,
      allowances: payroll.allowances || [],
      deductions: payroll.deductions || [],
      overtime: payroll.overtime || { hours: 0, rate: 0, amount: 0 },
      bonuses: payroll.bonuses || [],
      grossSalary: payroll.grossSalary || 0,
      netSalary: payroll.netSalary || 0,
      taxDeductions: payroll.taxDeductions || {
        incomeTax: 0,
        socialInsurance: 0,
        healthInsurance: 0,
        totalTaxes: 0
      },
      bankDetails: payroll.bankDetails || {
        bankName: '',
        accountNumber: '',
        accountHolderName: ''
      },
      status: payroll.status || 'generated',
      generatedDate: new Date(payroll.createdAt || new Date()),
      payslipUrl: `/api/employee/payslips/${payroll._id}/download`,
      taxSlipUrl: `/api/employee/payslips/${payroll._id}/tax-slip`
    }));
    
    return NextResponse.json({
      success: true,
      data: formattedPayslips,
      count: formattedPayslips.length
    });
  } catch (error) {
    console.error('Error fetching payslips:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payslips' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await connectToDatabase();
    const body = await request.json();
    const { employeeId, payslipId } = body;
    
    if (!employeeId || !payslipId) {
      return NextResponse.json(
        { success: false, error: 'Employee ID and Payslip ID are required' },
        { status: 400 }
      );
    }
    
    // Update payslip status to viewed
    await db.collection('employeePayrolls').updateOne(
      { _id: payslipId, employeeId },
      { 
        $set: { 
          viewedDate: new Date(),
          status: 'viewed'
        } 
      }
    );
    
    return NextResponse.json({
      success: true,
      message: 'Payslip marked as viewed'
    });
  } catch (error) {
    console.error('Error updating payslip status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update payslip status' },
      { status: 500 }
    );
  }
}
