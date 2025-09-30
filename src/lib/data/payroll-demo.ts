import { CreateSalaryStructureDTO, CreateTaxConfigurationDTO, CreatePayrollBatchDTO } from '@/lib/models/payroll';

// Demo Salary Structures
export const demoSalaryStructures: CreateSalaryStructureDTO[] = [
  {
    name: "Senior Management",
    description: "Salary structure for senior management positions including C-level executives and directors",
    grade: "A",
    level: "Senior",
    components: {
      basic: {
        amount: 20000,
        currency: "EGP",
        percentage: 70
      },
      allowances: [
        {
          name: "Transportation Allowance",
          type: "fixed",
          amount: 2000,
          taxable: true,
          description: "Monthly transportation allowance"
        },
        {
          name: "Communication Allowance",
          type: "fixed",
          amount: 1000,
          taxable: true,
          description: "Monthly communication allowance"
        },
        {
          name: "Performance Bonus",
          type: "performance-based",
          percentage: 20,
          basedOn: "basic",
          taxable: true,
          description: "Performance-based bonus"
        },
        {
          name: "Housing Allowance",
          type: "fixed",
          amount: 5000,
          taxable: false,
          description: "Non-taxable housing allowance"
        }
      ],
      deductions: [
        {
          name: "Health Insurance",
          type: "fixed",
          amount: 500,
          description: "Monthly health insurance contribution"
        },
        {
          name: "Social Insurance",
          type: "percentage",
          percentage: 11,
          basedOn: "basic",
          description: "Social insurance contribution"
        }
      ]
    },
    benefits: {
      healthInsurance: {
        provided: true,
        amount: 3000,
        currency: "EGP",
        coverageType: "family"
      },
      retirementPlan: {
        provided: true,
        employeeContribution: 1000,
        employerContribution: 2000,
        currency: "EGP"
      },
      otherBenefits: [
        {
          name: "Car Allowance",
          type: "non-cash",
          value: 8000,
          currency: "EGP",
          description: "Company car or car allowance"
        },
        {
          name: "Annual Leave",
          type: "non-cash",
          value: 30,
          currency: "days",
          description: "Annual vacation days"
        }
      ]
    }
  },
  {
    name: "Middle Management",
    description: "Salary structure for middle management positions including department heads and team leads",
    grade: "B",
    level: "Middle",
    components: {
      basic: {
        amount: 12000,
        currency: "EGP",
        percentage: 75
      },
      allowances: [
        {
          name: "Transportation Allowance",
          type: "fixed",
          amount: 1500,
          taxable: true,
          description: "Monthly transportation allowance"
        },
        {
          name: "Communication Allowance",
          type: "fixed",
          amount: 500,
          taxable: true,
          description: "Monthly communication allowance"
        },
        {
          name: "Performance Bonus",
          type: "performance-based",
          percentage: 15,
          basedOn: "basic",
          taxable: true,
          description: "Performance-based bonus"
        },
        {
          name: "Housing Allowance",
          type: "fixed",
          amount: 3000,
          taxable: false,
          description: "Non-taxable housing allowance"
        }
      ],
      deductions: [
        {
          name: "Health Insurance",
          type: "fixed",
          amount: 300,
          description: "Monthly health insurance contribution"
        },
        {
          name: "Social Insurance",
          type: "percentage",
          percentage: 11,
          basedOn: "basic",
          description: "Social insurance contribution"
        }
      ]
    },
    benefits: {
      healthInsurance: {
        provided: true,
        amount: 2000,
        currency: "EGP",
        coverageType: "individual"
      },
      retirementPlan: {
        provided: true,
        employeeContribution: 600,
        employerContribution: 1200,
        currency: "EGP"
      },
      otherBenefits: [
        {
          name: "Annual Leave",
          type: "non-cash",
          value: 25,
          currency: "days",
          description: "Annual vacation days"
        }
      ]
    }
  },
  {
    name: "Junior Staff",
    description: "Salary structure for junior staff positions including entry-level and support roles",
    grade: "C",
    level: "Junior",
    components: {
      basic: {
        amount: 6000,
        currency: "EGP",
        percentage: 80
      },
      allowances: [
        {
          name: "Transportation Allowance",
          type: "fixed",
          amount: 1000,
          taxable: true,
          description: "Monthly transportation allowance"
        },
        {
          name: "Performance Bonus",
          type: "performance-based",
          percentage: 10,
          basedOn: "basic",
          taxable: true,
          description: "Performance-based bonus"
        },
        {
          name: "Housing Allowance",
          type: "fixed",
          amount: 1500,
          taxable: false,
          description: "Non-taxable housing allowance"
        }
      ],
      deductions: [
        {
          name: "Health Insurance",
          type: "fixed",
          amount: 200,
          description: "Monthly health insurance contribution"
        },
        {
          name: "Social Insurance",
          type: "percentage",
          percentage: 11,
          basedOn: "basic",
          description: "Social insurance contribution"
        }
      ]
    },
    benefits: {
      healthInsurance: {
        provided: true,
        amount: 1000,
        currency: "EGP",
        coverageType: "individual"
      },
      retirementPlan: {
        provided: true,
        employeeContribution: 300,
        employerContribution: 600,
        currency: "EGP"
      },
      otherBenefits: [
        {
          name: "Annual Leave",
          type: "non-cash",
          value: 21,
          currency: "days",
          description: "Annual vacation days"
        }
      ]
    }
  }
];

// Demo Tax Configuration
export const demoTaxConfiguration: CreateTaxConfigurationDTO = {
  name: "Egypt Tax Configuration 2024",
  country: "Egypt",
  currency: "EGP",
  taxYear: 2024,
  brackets: [
    {
      minIncome: 0,
      maxIncome: 15000,
      rate: 0,
      description: "Tax-free bracket"
    },
    {
      minIncome: 15000,
      maxIncome: 30000,
      rate: 2.5,
      description: "First tax bracket"
    },
    {
      minIncome: 30000,
      maxIncome: 45000,
      rate: 10,
      description: "Second tax bracket"
    },
    {
      minIncome: 45000,
      maxIncome: 60000,
      rate: 15,
      description: "Third tax bracket"
    },
    {
      minIncome: 60000,
      maxIncome: 200000,
      rate: 20,
      description: "Fourth tax bracket"
    },
    {
      minIncome: 200000,
      rate: 22.5,
      description: "Highest tax bracket"
    }
  ],
  exemptions: [
    {
      name: "Personal Exemption",
      amount: 9000,
      currency: "EGP",
      type: "personal",
      maxAmount: 9000
    },
    {
      name: "Spouse Exemption",
      amount: 9000,
      currency: "EGP",
      type: "spouse",
      maxAmount: 9000
    },
    {
      name: "Children Exemption",
      amount: 4500,
      currency: "EGP",
      type: "children",
      maxAmount: 18000
    },
    {
      name: "Medical Exemption",
      amount: 0,
      currency: "EGP",
      type: "medical",
      maxAmount: 15000
    }
  ],
  socialInsurance: {
    employeeRate: 11,
    employerRate: 18.75,
    maxContribution: 15000,
    currency: "EGP"
  },
  healthInsurance: {
    employeeRate: 2.5,
    employerRate: 2.5,
    currency: "EGP"
  },
  pension: {
    employeeRate: 5,
    employerRate: 5,
    currency: "EGP"
  }
};

// Demo Payroll Batches
export const demoPayrollBatches: Omit<CreatePayrollBatchDTO, 'employeeIds'>[] = [
  {
    name: "December 2024 Payroll",
    description: "Monthly payroll processing for December 2024",
    payPeriod: {
      startDate: new Date('2024-12-01'),
      endDate: new Date('2024-12-31'),
      month: 12,
      year: 2024
    }
  },
  {
    name: "November 2024 Payroll",
    description: "Monthly payroll processing for November 2024",
    payPeriod: {
      startDate: new Date('2024-11-01'),
      endDate: new Date('2024-11-30'),
      month: 11,
      year: 2024
    }
  },
  {
    name: "January 2025 Payroll",
    description: "Monthly payroll processing for January 2025",
    payPeriod: {
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-01-31'),
      month: 1,
      year: 2025
    }
  }
];
