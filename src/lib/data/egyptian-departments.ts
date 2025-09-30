import { CreateDepartmentDTO } from '@/lib/models/department';

export const egyptianDepartments: CreateDepartmentDTO[] = [
  // Executive Department
  {
    name: "Executive Office",
    description: "Top-level management and strategic decision making for the photography equipment sales company",
    code: "EXEC",
    parentDepartmentId: "",
    managerId: "EMP001", // CEO
    budget: {
      annualBudget: 500000,
      currency: "EGP",
      fiscalYear: 2024
    },
    location: {
      building: "Head Office Building",
      floor: "10th Floor",
      room: "Executive Suite",
      address: "Cairo Financial District, New Cairo, Egypt"
    },
    contactInfo: {
      phone: "+20-2-2345-6789",
      email: "executive@photoeq.com",
      extension: "1000"
    },
    policies: {
      workingHours: "9:00 AM - 6:00 PM EET",
      dressCode: "Business Professional",
      remoteWorkPolicy: "Hybrid (3 days office)"
    }
  },

  // Sales Department
  {
    name: "Sales Department",
    description: "Responsible for selling photography equipment to retail and corporate clients across Egypt",
    code: "SALES",
    parentDepartmentId: "EXEC",
    managerId: "EMP002", // Sales Director
    budget: {
      annualBudget: 2000000,
      currency: "EGP",
      fiscalYear: 2024
    },
    location: {
      building: "Head Office Building",
      floor: "8th Floor",
      room: "Sales Center",
      address: "Cairo Financial District, New Cairo, Egypt"
    },
    contactInfo: {
      phone: "+20-2-2345-6790",
      email: "sales@photoeq.com",
      extension: "2000"
    },
    policies: {
      workingHours: "9:00 AM - 7:00 PM EET",
      dressCode: "Business Casual",
      remoteWorkPolicy: "Field Sales Allowed"
    }
  },

  // Marketing Department
  {
    name: "Marketing Department",
    description: "Brand promotion, digital marketing, and customer engagement for photography equipment",
    code: "MKTG",
    parentDepartmentId: "EXEC",
    managerId: "EMP003", // Marketing Manager
    budget: {
      annualBudget: 800000,
      currency: "EGP",
      fiscalYear: 2024
    },
    location: {
      building: "Head Office Building",
      floor: "7th Floor",
      room: "Marketing Hub",
      address: "Cairo Financial District, New Cairo, Egypt"
    },
    contactInfo: {
      phone: "+20-2-2345-6791",
      email: "marketing@photoeq.com",
      extension: "3000"
    },
    policies: {
      workingHours: "9:00 AM - 6:00 PM EET",
      dressCode: "Business Casual",
      remoteWorkPolicy: "Hybrid (2 days office)"
    }
  },

  // Technical Support Department
  {
    name: "Technical Support",
    description: "Product support, technical assistance, and equipment maintenance services",
    code: "TECH",
    parentDepartmentId: "EXEC",
    managerId: "EMP004", // Technical Manager
    budget: {
      annualBudget: 600000,
      currency: "EGP",
      fiscalYear: 2024
    },
    location: {
      building: "Technical Building",
      floor: "Ground Floor",
      room: "Service Center",
      address: "Cairo Financial District, New Cairo, Egypt"
    },
    contactInfo: {
      phone: "+20-2-2345-6792",
      email: "support@photoeq.com",
      extension: "4000"
    },
    policies: {
      workingHours: "8:00 AM - 5:00 PM EET",
      dressCode: "Casual with Company Uniform",
      remoteWorkPolicy: "Office Based"
    }
  },

  // Finance Department
  {
    name: "Finance Department",
    description: "Financial management, accounting, and budget control for the company",
    code: "FIN",
    parentDepartmentId: "EXEC",
    managerId: "EMP005", // CFO
    budget: {
      annualBudget: 300000,
      currency: "EGP",
      fiscalYear: 2024
    },
    location: {
      building: "Head Office Building",
      floor: "6th Floor",
      room: "Finance Office",
      address: "Cairo Financial District, New Cairo, Egypt"
    },
    contactInfo: {
      phone: "+20-2-2345-6793",
      email: "finance@photoeq.com",
      extension: "5000"
    },
    policies: {
      workingHours: "9:00 AM - 5:00 PM EET",
      dressCode: "Business Professional",
      remoteWorkPolicy: "Hybrid (3 days office)"
    }
  },

  // Human Resources Department
  {
    name: "Human Resources",
    description: "Employee management, recruitment, and organizational development",
    code: "HR",
    parentDepartmentId: "EXEC",
    managerId: "EMP006", // HR Manager
    budget: {
      annualBudget: 400000,
      currency: "EGP",
      fiscalYear: 2024
    },
    location: {
      building: "Head Office Building",
      floor: "5th Floor",
      room: "HR Office",
      address: "Cairo Financial District, New Cairo, Egypt"
    },
    contactInfo: {
      phone: "+20-2-2345-6794",
      email: "hr@photoeq.com",
      extension: "6000"
    },
    policies: {
      workingHours: "9:00 AM - 5:00 PM EET",
      dressCode: "Business Professional",
      remoteWorkPolicy: "Hybrid (2 days office)"
    }
  },

  // Operations Department
  {
    name: "Operations",
    description: "Warehouse management, logistics, and inventory control",
    code: "OPS",
    parentDepartmentId: "EXEC",
    managerId: "EMP007", // Operations Manager
    budget: {
      annualBudget: 700000,
      currency: "EGP",
      fiscalYear: 2024
    },
    location: {
      building: "Warehouse Complex",
      floor: "Ground Floor",
      room: "Operations Center",
      address: "Industrial Zone, 6th October City, Egypt"
    },
    contactInfo: {
      phone: "+20-2-2345-6795",
      email: "operations@photoeq.com",
      extension: "7000"
    },
    policies: {
      workingHours: "7:00 AM - 4:00 PM EET",
      dressCode: "Casual with Safety Equipment",
      remoteWorkPolicy: "Office Based"
    }
  },

  // Retail Sales Department (sub-department of Sales)
  {
    name: "Retail Sales",
    description: "Direct retail sales and customer service in physical stores",
    code: "RETAIL",
    parentDepartmentId: "SALES",
    managerId: "EMP008", // Retail Manager
    budget: {
      annualBudget: 800000,
      currency: "EGP",
      fiscalYear: 2024
    },
    location: {
      building: "Multiple Store Locations",
      floor: "Ground Floor",
      room: "Store Floors",
      address: "Various locations across Cairo and Alexandria"
    },
    contactInfo: {
      phone: "+20-2-2345-6796",
      email: "retail@photoeq.com",
      extension: "2100"
    },
    policies: {
      workingHours: "10:00 AM - 10:00 PM EET",
      dressCode: "Business Casual with Company Uniform",
      remoteWorkPolicy: "Store Based"
    }
  },

  // Corporate Sales Department (sub-department of Sales)
  {
    name: "Corporate Sales",
    description: "B2B sales to professional photographers, studios, and corporate clients",
    code: "CORP",
    parentDepartmentId: "SALES",
    managerId: "EMP009", // Corporate Sales Manager
    budget: {
      annualBudget: 1200000,
      currency: "EGP",
      fiscalYear: 2024
    },
    location: {
      building: "Head Office Building",
      floor: "8th Floor",
      room: "Corporate Sales Office",
      address: "Cairo Financial District, New Cairo, Egypt"
    },
    contactInfo: {
      phone: "+20-2-2345-6797",
      email: "corporate@photoeq.com",
      extension: "2200"
    },
    policies: {
      workingHours: "9:00 AM - 6:00 PM EET",
      dressCode: "Business Professional",
      remoteWorkPolicy: "Field Sales and Office"
    }
  },

  // Digital Marketing Team (sub-department of Marketing)
  {
    name: "Digital Marketing",
    description: "Online marketing, social media, and digital advertising campaigns",
    code: "DIGITAL",
    parentDepartmentId: "MKTG",
    managerId: "EMP010", // Digital Marketing Specialist
    budget: {
      annualBudget: 300000,
      currency: "EGP",
      fiscalYear: 2024
    },
    location: {
      building: "Head Office Building",
      floor: "7th Floor",
      room: "Digital Hub",
      address: "Cairo Financial District, New Cairo, Egypt"
    },
    contactInfo: {
      phone: "+20-2-2345-6798",
      email: "digital@photoeq.com",
      extension: "3100"
    },
    policies: {
      workingHours: "9:00 AM - 6:00 PM EET",
      dressCode: "Business Casual",
      remoteWorkPolicy: "Hybrid (2 days office)"
    }
  }
];
