import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { demoSalaryStructures, demoTaxConfiguration, demoPayrollBatches } from '@/lib/data/payroll-demo';
import { SalaryStructure, TaxConfiguration, PayrollBatch } from '@/lib/models/payroll';

// POST /api/hr/payroll/seed - Seed payroll demo data
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    
    // Clear existing data
    await db.collection('salaryStructures').deleteMany({});
    await db.collection('taxConfigurations').deleteMany({});
    await db.collection('payrollBatches').deleteMany({});
    await db.collection('employeePayrolls').deleteMany({});
    await db.collection('payslipTemplates').deleteMany({});

    let seededCount = 0;

    // Seed Salary Structures
    for (const structureData of demoSalaryStructures) {
      const count = await db.collection('salaryStructures').countDocuments();
      const structureId = `SAL${String(count + 1).padStart(3, '0')}`;

      const structure: SalaryStructure = {
        ...structureData,
        structureId,
        status: 'active',
        systemInfo: {
          createdBy: 'system',
          createdAt: new Date(),
          updatedBy: 'system',
          updatedAt: new Date(),
          isActive: true
        }
      };

      await db.collection('salaryStructures').insertOne(structure);
      seededCount++;
    }

    // Seed Tax Configuration
    const count = await db.collection('taxConfigurations').countDocuments();
    const configId = `TAX${String(count + 1).padStart(3, '0')}`;

    const taxConfig: TaxConfiguration = {
      ...demoTaxConfiguration,
      configId,
      status: 'active',
      systemInfo: {
        createdBy: 'system',
        createdAt: new Date(),
        updatedBy: 'system',
        updatedAt: new Date(),
        isActive: true
      }
    };

    await db.collection('taxConfigurations').insertOne(taxConfig);
    seededCount++;

    // Seed Payroll Batches
    for (const batchData of demoPayrollBatches) {
      const count = await db.collection('payrollBatches').countDocuments();
      const batchId = `BATCH${String(count + 1).padStart(3, '0')}`;

      // Get employee IDs from the employees collection
      const employees = await db.collection('employees').find({ 'systemInfo.isActive': true }).toArray();
      const employeeIds = employees.map(emp => emp.employeeId);

      const batch: PayrollBatch = {
        ...batchData,
        batchId,
        employeeIds,
        status: batchData.payPeriod.month === 12 && batchData.payPeriod.year === 2024 ? 'completed' : 
                batchData.payPeriod.month === 1 && batchData.payPeriod.year === 2025 ? 'processing' : 'completed',
        totalEmployees: employeeIds.length,
        totalGrossSalary: employeeIds.length * 15000, // Example calculation
        totalNetSalary: employeeIds.length * 12000,
        totalTaxes: employeeIds.length * 2500,
        totalEmployerCosts: employeeIds.length * 3000,
        generatedPayslips: batchData.payPeriod.month === 12 && batchData.payPeriod.year === 2024 ? employeeIds.length : 0,
        failedPayslips: 0,
        processingStartedAt: batchData.payPeriod.month === 1 && batchData.payPeriod.year === 2025 ? new Date() : undefined,
        processingCompletedAt: batchData.payPeriod.month === 12 && batchData.payPeriod.year === 2024 ? new Date() : undefined,
        systemInfo: {
          createdBy: 'system',
          createdAt: new Date(),
          updatedBy: 'system',
          updatedAt: new Date(),
          isActive: true
        }
      };

      await db.collection('payrollBatches').insertOne(batch);
      seededCount++;
    }

    // Create sample employee payroll records for December 2024
    const employees = await db.collection('employees').find({ 'systemInfo.isActive': true }).limit(5).toArray();
    const structures = await db.collection('salaryStructures').find({ 'systemInfo.isActive': true }).toArray();

    for (const employee of employees) {
      const structure = structures[Math.floor(Math.random() * structures.length)];
      const payrollCount = await db.collection('employeePayrolls').countDocuments();
      const payrollId = `PAY${String(payrollCount + 1).padStart(3, '0')}`;

      const basicSalary = structure.components.basic.amount;
      const allowancesTotal = structure.components.allowances.reduce((sum, allowance) => {
        if (allowance.type === 'fixed') {
          return sum + (allowance.amount || 0);
        } else if (allowance.type === 'percentage') {
          return sum + (basicSalary * (allowance.percentage || 0) / 100);
        }
        return sum;
      }, 0);

      const deductionsTotal = structure.components.deductions.reduce((sum, deduction) => {
        if (deduction.type === 'fixed') {
          return sum + (deduction.amount || 0);
        } else if (deduction.type === 'percentage') {
          return sum + (basicSalary * (deduction.percentage || 0) / 100);
        }
        return sum;
      }, 0);

      const grossSalary = basicSalary + allowancesTotal;
      const taxRate = 0.15; // 15% income tax
      const socialInsuranceRate = 0.11; // 11% social insurance
      const healthInsuranceRate = 0.025; // 2.5% health insurance

      const incomeTax = Math.max(0, (grossSalary - 9000) * taxRate); // Personal exemption
      const socialInsurance = Math.min(grossSalary * socialInsuranceRate, 15000);
      const healthInsurance = grossSalary * healthInsuranceRate;

      const totalTaxes = incomeTax + socialInsurance + healthInsurance;
      const netSalary = grossSalary - totalTaxes;

      const employeePayroll = {
        payrollId,
        employeeId: employee.employeeId,
        payPeriod: {
          startDate: new Date('2024-12-01'),
          endDate: new Date('2024-12-31'),
          month: 12,
          year: 2024
        },
        salaryStructureId: structure.structureId,
        basicSalary,
        allowances: structure.components.allowances.map(allowance => ({
          id: `ALLOW_${Math.random().toString(36).substr(2, 9)}`,
          name: allowance.name,
          amount: allowance.type === 'fixed' ? (allowance.amount || 0) : (basicSalary * (allowance.percentage || 0) / 100),
          taxable: allowance.taxable,
          description: allowance.description
        })),
        deductions: structure.components.deductions.map(deduction => ({
          id: `DED_${Math.random().toString(36).substr(2, 9)}`,
          name: deduction.name,
          amount: deduction.type === 'fixed' ? (deduction.amount || 0) : (basicSalary * (deduction.percentage || 0) / 100),
          description: deduction.description
        })),
        overtime: {
          hours: Math.floor(Math.random() * 20),
          rate: basicSalary / 160, // Hourly rate based on monthly salary
          amount: 0
        },
        bonuses: [
          {
            id: `BONUS_${Math.random().toString(36).substr(2, 9)}`,
            name: "Performance Bonus",
            amount: Math.floor(Math.random() * 2000),
            type: "performance",
            description: "Monthly performance bonus"
          }
        ],
        grossSalary,
        taxDeductions: {
          incomeTax,
          socialInsurance,
          healthInsurance,
          pension: 0,
          otherTaxes: 0,
          totalTaxes
        },
        netSalary,
        benefits: {
          healthInsurance: structure.benefits.healthInsurance.amount || 0,
          retirementPlan: structure.benefits.retirementPlan.employeeContribution || 0,
          otherBenefits: 0,
          totalBenefits: (structure.benefits.healthInsurance.amount || 0) + (structure.benefits.retirementPlan.employeeContribution || 0)
        },
        employerCosts: {
          socialInsurance: socialInsurance * 0.5,
          healthInsurance: healthInsurance * 0.5,
          pension: 0,
          otherBenefits: (structure.benefits.retirementPlan.employerContribution || 0),
          totalEmployerCosts: (socialInsurance * 0.5) + (healthInsurance * 0.5) + (structure.benefits.retirementPlan.employerContribution || 0)
        },
        bankDetails: {
          accountNumber: `****${Math.random().toString().substr(2, 4)}`,
          bankName: "National Bank of Egypt",
          branchCode: "001",
          accountHolderName: `${employee.personalInfo.firstName} ${employee.personalInfo.lastName}`
        },
        paymentStatus: 'paid',
        paymentDate: new Date('2024-12-31'),
        transactionId: `TXN_${Math.random().toString(36).substr(2, 9)}`,
        payslipGenerated: true,
        payslipUrl: `/payslips/${payrollId}.pdf`,
        systemInfo: {
          createdBy: 'system',
          createdAt: new Date(),
          updatedBy: 'system',
          updatedAt: new Date(),
          isActive: true
        }
      };

      await db.collection('employeePayrolls').insertOne(employeePayroll);
      seededCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${seededCount} payroll records`,
      data: {
        salaryStructures: demoSalaryStructures.length,
        taxConfigurations: 1,
        payrollBatches: demoPayrollBatches.length,
        employeePayrolls: employees.length
      }
    });
  } catch (error) {
    console.error('Error seeding payroll data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed payroll data' },
      { status: 500 }
    );
  }
}
