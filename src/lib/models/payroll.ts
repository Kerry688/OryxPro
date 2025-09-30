import { ObjectId } from 'mongodb';

// Salary Structure Model
export interface SalaryStructure {
  _id?: ObjectId;
  structureId: string; // e.g., SAL001
  name: string;
  description: string;
  grade: string;
  level: string;
  components: {
    basic: {
      amount: number;
      currency: string;
      percentage?: number; // Percentage of total if applicable
    };
    allowances: Array<{
      id: string;
      name: string;
      type: 'fixed' | 'percentage' | 'performance-based' | 'conditional';
      amount?: number;
      percentage?: number;
      basedOn?: 'basic' | 'total' | 'performance';
      conditions?: string[];
      taxable: boolean;
      description: string;
    }>;
    deductions: Array<{
      id: string;
      name: string;
      type: 'fixed' | 'percentage' | 'conditional';
      amount?: number;
      percentage?: number;
      basedOn?: 'basic' | 'total' | 'gross';
      conditions?: string[];
      description: string;
    }>;
  };
  benefits: {
    healthInsurance: {
      provided: boolean;
      amount?: number;
      currency?: string;
      coverageType?: 'individual' | 'family';
    };
    retirementPlan: {
      provided: boolean;
      employeeContribution?: number;
      employerContribution?: number;
      currency?: string;
    };
    otherBenefits: Array<{
      name: string;
      type: 'cash' | 'non-cash';
      value: number;
      currency: string;
      description: string;
    }>;
  };
  status: 'active' | 'inactive' | 'archived';
  systemInfo: {
    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
    isActive: boolean;
  };
}

// Tax Configuration Model
export interface TaxConfiguration {
  _id?: ObjectId;
  configId: string; // e.g., TAX001
  name: string;
  country: string;
  currency: string;
  taxYear: number;
  brackets: Array<{
    id: string;
    minIncome: number;
    maxIncome?: number;
    rate: number;
    description: string;
  }>;
  exemptions: Array<{
    name: string;
    amount: number;
    currency: string;
    type: 'personal' | 'spouse' | 'children' | 'medical' | 'education' | 'other';
    maxAmount?: number;
  }>;
  socialInsurance: {
    employeeRate: number;
    employerRate: number;
    maxContribution?: number;
    currency: string;
  };
  healthInsurance: {
    employeeRate: number;
    employerRate: number;
    currency: string;
  };
  pension: {
    employeeRate: number;
    employerRate: number;
    currency: string;
  };
  status: 'active' | 'inactive';
  systemInfo: {
    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
    isActive: boolean;
  };
}

// Employee Payroll Model
export interface EmployeePayroll {
  _id?: ObjectId;
  payrollId: string; // e.g., PAY001
  employeeId: string;
  payPeriod: {
    startDate: Date;
    endDate: Date;
    month: number;
    year: number;
  };
  salaryStructureId: string;
  basicSalary: number;
  allowances: Array<{
    id: string;
    name: string;
    amount: number;
    taxable: boolean;
    description: string;
  }>;
  deductions: Array<{
    id: string;
    name: string;
    amount: number;
    description: string;
  }>;
  overtime: {
    hours: number;
    rate: number;
    amount: number;
  };
  bonuses: Array<{
    id: string;
    name: string;
    amount: number;
    type: 'performance' | 'annual' | 'special' | 'commission';
    description: string;
  }>;
  grossSalary: number;
  taxDeductions: {
    incomeTax: number;
    socialInsurance: number;
    healthInsurance: number;
    pension: number;
    otherTaxes: number;
    totalTaxes: number;
  };
  netSalary: number;
  benefits: {
    healthInsurance: number;
    retirementPlan: number;
    otherBenefits: number;
    totalBenefits: number;
  };
  employerCosts: {
    socialInsurance: number;
    healthInsurance: number;
    pension: number;
    otherBenefits: number;
    totalEmployerCosts: number;
  };
  bankDetails: {
    accountNumber: string;
    bankName: string;
    branchCode: string;
    accountHolderName: string;
  };
  paymentStatus: 'pending' | 'processed' | 'paid' | 'failed';
  paymentDate?: Date;
  transactionId?: string;
  payslipGenerated: boolean;
  payslipUrl?: string;
  notes?: string;
  systemInfo: {
    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
    isActive: boolean;
  };
}

// Payslip Template Model
export interface PayslipTemplate {
  _id?: ObjectId;
  templateId: string; // e.g., TEMP001
  name: string;
  description: string;
  companyInfo: {
    name: string;
    address: string;
    logo?: string;
    taxNumber: string;
    registrationNumber: string;
  };
  layout: {
    header: {
      showCompanyLogo: boolean;
      showCompanyInfo: boolean;
      title: string;
      subtitle?: string;
    };
    employeeInfo: {
      showEmployeePhoto: boolean;
      showEmployeeId: boolean;
      showDepartment: boolean;
      showPosition: boolean;
    };
    salaryBreakdown: {
      showBasicSalary: boolean;
      showAllowances: boolean;
      showDeductions: boolean;
      showOvertime: boolean;
      showBonuses: boolean;
      showBenefits: boolean;
    };
    taxInformation: {
      showTaxBrackets: boolean;
      showSocialInsurance: boolean;
      showHealthInsurance: boolean;
      showPension: boolean;
    };
    footer: {
      showPaymentMethod: boolean;
      showBankDetails: boolean;
      showNotes: boolean;
      customFooter?: string;
    };
  };
  styling: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    fontSize: number;
  };
  status: 'active' | 'inactive';
  systemInfo: {
    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
    isActive: boolean;
  };
}

// Payroll Batch Model
export interface PayrollBatch {
  _id?: ObjectId;
  batchId: string; // e.g., BATCH001
  name: string;
  description: string;
  payPeriod: {
    startDate: Date;
    endDate: Date;
    month: number;
    year: number;
  };
  employeeIds: string[];
  status: 'draft' | 'processing' | 'completed' | 'failed';
  totalEmployees: number;
  totalGrossSalary: number;
  totalNetSalary: number;
  totalTaxes: number;
  totalEmployerCosts: number;
  processingStartedAt?: Date;
  processingCompletedAt?: Date;
  errorLog?: string[];
  generatedPayslips: number;
  failedPayslips: number;
  bankTransferFile?: string;
  systemInfo: {
    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
    isActive: boolean;
  };
}

// DTOs for API operations
export interface CreateSalaryStructureDTO {
  name: string;
  description: string;
  grade: string;
  level: string;
  components: {
    basic: {
      amount: number;
      currency: string;
      percentage?: number;
    };
    allowances: Array<{
      name: string;
      type: 'fixed' | 'percentage' | 'performance-based' | 'conditional';
      amount?: number;
      percentage?: number;
      basedOn?: 'basic' | 'total' | 'performance';
      conditions?: string[];
      taxable: boolean;
      description: string;
    }>;
    deductions: Array<{
      name: string;
      type: 'fixed' | 'percentage' | 'conditional';
      amount?: number;
      percentage?: number;
      basedOn?: 'basic' | 'total' | 'gross';
      conditions?: string[];
      description: string;
    }>;
  };
  benefits: {
    healthInsurance: {
      provided: boolean;
      amount?: number;
      currency?: string;
      coverageType?: 'individual' | 'family';
    };
    retirementPlan: {
      provided: boolean;
      employeeContribution?: number;
      employerContribution?: number;
      currency?: string;
    };
    otherBenefits: Array<{
      name: string;
      type: 'cash' | 'non-cash';
      value: number;
      currency: string;
      description: string;
    }>;
  };
}

export interface CreateTaxConfigurationDTO {
  name: string;
  country: string;
  currency: string;
  taxYear: number;
  brackets: Array<{
    minIncome: number;
    maxIncome?: number;
    rate: number;
    description: string;
  }>;
  exemptions: Array<{
    name: string;
    amount: number;
    currency: string;
    type: 'personal' | 'spouse' | 'children' | 'medical' | 'education' | 'other';
    maxAmount?: number;
  }>;
  socialInsurance: {
    employeeRate: number;
    employerRate: number;
    maxContribution?: number;
    currency: string;
  };
  healthInsurance: {
    employeeRate: number;
    employerRate: number;
    currency: string;
  };
  pension: {
    employeeRate: number;
    employerRate: number;
    currency: string;
  };
}

export interface CreatePayrollBatchDTO {
  name: string;
  description: string;
  payPeriod: {
    startDate: Date;
    endDate: Date;
    month: number;
    year: number;
  };
  employeeIds: string[];
}

export interface ProcessPayrollDTO {
  batchId: string;
  generatePayslips: boolean;
  processBankTransfer: boolean;
}

// Filter interfaces
export interface PayrollFilter {
  employeeId?: string;
  payPeriod?: {
    month: number;
    year: number;
  };
  status?: string;
  department?: string;
  search?: string;
}

export interface SalaryStructureFilter {
  grade?: string;
  level?: string;
  status?: string;
  search?: string;
}

export interface TaxConfigurationFilter {
  country?: string;
  taxYear?: number;
  status?: string;
  search?: string;
}