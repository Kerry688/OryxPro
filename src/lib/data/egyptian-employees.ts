import { CreateEmployeeDTO } from '@/lib/models/employee';

export const egyptianEmployees: CreateEmployeeDTO[] = [
  // Executive Level - CEO
  {
    personalInfo: {
      firstName: "Ahmed",
      lastName: "Mahmoud",
      middleName: "Abdel Rahman",
      dateOfBirth: new Date('1975-03-15'),
      gender: 'male',
      maritalStatus: 'married',
      nationality: 'Egyptian',
      phone: '+20-10-1234-5678',
      email: 'ahmed.mahmoud@photoeq.com',
      address: {
        street: 'Villa 15, New Cairo Compound',
        city: 'New Cairo',
        state: 'Cairo',
        postalCode: '11835',
        country: 'Egypt'
      },
      emergencyContact: {
        name: 'Fatma Mahmoud',
        relationship: 'Wife',
        phone: '+20-10-1234-5679',
        email: 'fatma.mahmoud@email.com'
      }
    },
    employmentInfo: {
      departmentId: 'EXEC',
      position: 'Chief Executive Officer',
      jobTitle: 'CEO',
      employmentType: 'full-time',
      workLocation: 'Head Office - Executive Suite',
      workSchedule: '9:00 AM - 6:00 PM',
      salary: {
        baseSalary: 150000,
        currency: 'EGP',
        payFrequency: 'monthly'
      },
      employmentHistory: [
        {
          id: 'HIST001',
          position: 'CEO',
          departmentId: 'EXEC',
          startDate: new Date('2020-01-15'),
          salary: {
            baseSalary: 150000,
            currency: 'EGP',
            payFrequency: 'monthly'
          },
          reasonForChange: 'Promoted to CEO position',
          manager: 'Board of Directors'
        }
      ]
    },
    documents: {
      resume: '/documents/ahmed-mahmoud-resume.pdf',
      contract: '/documents/ahmed-mahmoud-contract.pdf',
      idDocument: '/documents/ahmed-mahmoud-id.pdf',
      passport: '/documents/ahmed-mahmoud-passport.pdf',
      workPermit: '/documents/ahmed-mahmoud-work-permit.pdf',
      visa: '/documents/ahmed-mahmoud-visa.pdf',
      healthInsurance: '/documents/ahmed-mahmoud-insurance.pdf',
      otherDocuments: [
        {
          name: 'Bachelor Degree Certificate',
          type: 'certificate',
          documentNumber: 'CERT001',
          issueDate: new Date('1997-06-15'),
          issuingAuthority: 'Cairo University',
          isRequired: true
        },
        {
          name: 'MBA Certificate',
          type: 'certificate',
          documentNumber: 'CERT002',
          issueDate: new Date('2005-08-20'),
          issuingAuthority: 'American University in Cairo',
          isRequired: true
        }
      ]
    },
    healthInsurance: {
      provider: 'Allianz Egypt',
      policyNumber: 'ALL-EGY-2024-001',
      coverageType: 'family',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      premium: {
        amount: 1500,
        currency: 'EGP',
        frequency: 'monthly'
      },
      beneficiaries: [
        {
          name: 'Fatma Mahmoud',
          relationship: 'Wife',
          dateOfBirth: new Date('1980-05-10'),
          covered: true
        },
        {
          name: 'Omar Mahmoud',
          relationship: 'Son',
          dateOfBirth: new Date('2005-03-15'),
          covered: true
        },
        {
          name: 'Amina Mahmoud',
          relationship: 'Daughter',
          dateOfBirth: new Date('2008-11-22'),
          covered: true
        }
      ],
      medicalHistory: [
        {
          id: 'MED001',
          date: new Date('2024-01-15'),
          type: 'checkup',
          description: 'Annual health checkup',
          provider: 'Dr. Hassan Medical Center',
          cost: 800,
          covered: true
        },
        {
          id: 'MED002',
          date: new Date('2024-03-10'),
          type: 'vaccination',
          description: 'Flu vaccination',
          provider: 'Dr. Hassan Medical Center',
          cost: 200,
          covered: true
        }
      ]
    },
    compliance: {
      laborLawCompliance: {
        workPermitValid: true,
        workPermitExpiry: new Date('2025-12-31'),
        visaValid: true,
        visaExpiry: new Date('2025-06-30'),
        socialInsurance: true,
        socialInsuranceNumber: 'SSN001234567',
        taxRegistration: true,
        taxNumber: 'TAX123456789'
      },
      requiredDocuments: [
        {
          documentType: 'Work Permit',
          required: true,
          provided: true,
          expiryDate: new Date('2025-12-31'),
          lastVerified: new Date('2024-01-01'),
          status: 'valid'
        },
        {
          documentType: 'Visa',
          required: true,
          provided: true,
          expiryDate: new Date('2025-06-30'),
          lastVerified: new Date('2024-01-01'),
          status: 'valid'
        },
        {
          documentType: 'Social Insurance',
          required: true,
          provided: true,
          status: 'valid'
        },
        {
          documentType: 'Tax Registration',
          required: true,
          provided: true,
          status: 'valid'
        }
      ],
      complianceChecks: [
        {
          id: 'CHECK001',
          checkType: 'document-renewal',
          checkDate: new Date('2024-01-01'),
          nextCheckDate: new Date('2024-07-01'),
          status: 'compliant',
          notes: 'All documents valid and up to date',
          checkedBy: 'HR Manager'
        },
        {
          id: 'CHECK002',
          checkType: 'work-permit',
          checkDate: new Date('2024-01-01'),
          nextCheckDate: new Date('2025-06-01'),
          status: 'compliant',
          notes: 'Work permit valid until December 2025',
          checkedBy: 'HR Manager'
        }
      ],
      trainingCompliance: [
        {
          id: 'TRAIN001',
          trainingName: 'Leadership Development Program',
          completionDate: new Date('2023-12-15'),
          expiryDate: new Date('2025-12-15'),
          status: 'completed',
          certificate: '/certificates/leadership-development.pdf'
        },
        {
          id: 'TRAIN002',
          trainingName: 'Workplace Safety Training',
          completionDate: new Date('2024-01-10'),
          expiryDate: new Date('2025-01-10'),
          status: 'completed',
          certificate: '/certificates/workplace-safety.pdf'
        }
      ]
    }
  },

  // Sales Director
  {
    personalInfo: {
      firstName: "Mariam",
      lastName: "El Saeed",
      middleName: "Mohamed",
      dateOfBirth: new Date('1980-07-22'),
      gender: 'female',
      maritalStatus: 'married',
      nationality: 'Egyptian',
      phone: '+20-10-2345-6789',
      email: 'mariam.elsaeed@photoeq.com',
      address: {
        street: 'Apartment 45, Zamalek',
        city: 'Cairo',
        state: 'Cairo',
        postalCode: '11211',
        country: 'Egypt'
      },
      emergencyContact: {
        name: 'Mohamed El Saeed',
        relationship: 'Husband',
        phone: '+20-10-2345-6790',
        email: 'mohamed.elsaeed@email.com'
      }
    },
    employmentInfo: {
      departmentId: 'SALES',
      position: 'Sales Director',
      jobTitle: 'Sales Director',
      employmentType: 'full-time',
      workLocation: 'Head Office - Sales Center',
      workSchedule: '9:00 AM - 7:00 PM',
      salary: {
        baseSalary: 80000,
        currency: 'EGP',
        payFrequency: 'monthly'
      }
    }
  },

  // Marketing Manager
  {
    personalInfo: {
      firstName: "Youssef",
      lastName: "El Abbasi",
      middleName: "Ahmed",
      dateOfBirth: new Date('1985-11-08'),
      gender: 'male',
      maritalStatus: 'single',
      nationality: 'Egyptian',
      phone: '+20-10-3456-7890',
      email: 'youssef.elabbasi@photoeq.com',
      address: {
        street: 'Building 12, Maadi',
        city: 'Cairo',
        state: 'Cairo',
        postalCode: '11728',
        country: 'Egypt'
      },
      emergencyContact: {
        name: 'Abdullah El Abbasi',
        relationship: 'Father',
        phone: '+20-10-3456-7891',
        email: 'abdullah.elabbasi@email.com'
      }
    },
    employmentInfo: {
      departmentId: 'MKTG',
      position: 'Marketing Manager',
      jobTitle: 'Marketing Manager',
      employmentType: 'full-time',
      workLocation: 'Head Office - Marketing Hub',
      workSchedule: '9:00 AM - 6:00 PM',
      salary: {
        baseSalary: 65000,
        currency: 'EGP',
        payFrequency: 'monthly'
      }
    }
  },

  // Technical Manager
  {
    personalInfo: {
      firstName: "Nora",
      lastName: "El Sharif",
      middleName: "Hassan",
      dateOfBirth: new Date('1982-04-30'),
      gender: 'female',
      maritalStatus: 'married',
      nationality: 'Egyptian',
      phone: '+20-10-4567-8901',
      email: 'nora.elsharif@photoeq.com',
      address: {
        street: 'Villa 8, Heliopolis',
        city: 'Cairo',
        state: 'Cairo',
        postalCode: '11341',
        country: 'Egypt'
      },
      emergencyContact: {
        name: 'Hassan El Sharif',
        relationship: 'Husband',
        phone: '+20-10-4567-8902',
        email: 'hassan.elsharif@email.com'
      }
    },
    employmentInfo: {
      departmentId: 'TECH',
      position: 'Technical Support Manager',
      jobTitle: 'Technical Manager',
      employmentType: 'full-time',
      workLocation: 'Technical Building - Service Center',
      workSchedule: '8:00 AM - 5:00 PM',
      salary: {
        baseSalary: 55000,
        currency: 'EGP',
        payFrequency: 'monthly'
      }
    }
  },

  // CFO
  {
    personalInfo: {
      firstName: "Khaled",
      lastName: "El Faraoni",
      middleName: "Mahmoud",
      dateOfBirth: new Date('1978-12-12'),
      gender: 'male',
      maritalStatus: 'married',
      nationality: 'Egyptian',
      phone: '+20-10-5678-9012',
      email: 'khaled.elfaraoni@photoeq.com',
      address: {
        street: 'Building 25, Nasr City',
        city: 'Cairo',
        state: 'Cairo',
        postalCode: '11762',
        country: 'Egypt'
      },
      emergencyContact: {
        name: 'Amira El Faraoni',
        relationship: 'Wife',
        phone: '+20-10-5678-9013',
        email: 'amira.elfaraoni@email.com'
      }
    },
    employmentInfo: {
      departmentId: 'FIN',
      position: 'Chief Financial Officer',
      jobTitle: 'CFO',
      employmentType: 'full-time',
      workLocation: 'Head Office - Finance Office',
      workSchedule: '9:00 AM - 5:00 PM',
      salary: {
        baseSalary: 90000,
        currency: 'EGP',
        payFrequency: 'monthly'
      }
    }
  },

  // HR Manager
  {
    personalInfo: {
      firstName: "Rania",
      lastName: "El Masry",
      middleName: "Abdel Aziz",
      dateOfBirth: new Date('1983-09-18'),
      gender: 'female',
      maritalStatus: 'married',
      nationality: 'Egyptian',
      phone: '+20-10-6789-0123',
      email: 'rania.elmasry@photoeq.com',
      address: {
        street: 'Apartment 33, Garden City',
        city: 'Cairo',
        state: 'Cairo',
        postalCode: '11451',
        country: 'Egypt'
      },
      emergencyContact: {
        name: 'Abdel Aziz El Masry',
        relationship: 'Husband',
        phone: '+20-10-6789-0124',
        email: 'abdulaziz.elmasry@email.com'
      }
    },
    employmentInfo: {
      departmentId: 'HR',
      position: 'Human Resources Manager',
      jobTitle: 'HR Manager',
      employmentType: 'full-time',
      workLocation: 'Head Office - HR Office',
      workSchedule: '9:00 AM - 5:00 PM',
      salary: {
        baseSalary: 60000,
        currency: 'EGP',
        payFrequency: 'monthly'
      }
    }
  },

  // Operations Manager
  {
    personalInfo: {
      firstName: "Mohamed",
      lastName: "El Noubi",
      middleName: "Ali",
      dateOfBirth: new Date('1981-06-05'),
      gender: 'male',
      maritalStatus: 'single',
      nationality: 'Egyptian',
      phone: '+20-10-7890-1234',
      email: 'mohamed.elnoubi@photoeq.com',
      address: {
        street: 'Building 7, 6th October City',
        city: '6th October City',
        state: 'Giza',
        postalCode: '12568',
        country: 'Egypt'
      },
      emergencyContact: {
        name: 'Ali El Noubi',
        relationship: 'Father',
        phone: '+20-10-7890-1235',
        email: 'ali.elnoubi@email.com'
      }
    },
    employmentInfo: {
      departmentId: 'OPS',
      position: 'Operations Manager',
      jobTitle: 'Operations Manager',
      employmentType: 'full-time',
      workLocation: 'Warehouse Complex - Operations Center',
      workSchedule: '7:00 AM - 4:00 PM',
      salary: {
        baseSalary: 50000,
        currency: 'EGP',
        payFrequency: 'monthly'
      }
    }
  },

  // Retail Manager
  {
    personalInfo: {
      firstName: "Fatma",
      lastName: "El Qahri",
      middleName: "Saad",
      dateOfBirth: new Date('1987-01-25'),
      gender: 'female',
      maritalStatus: 'single',
      nationality: 'Egyptian',
      phone: '+20-10-8901-2345',
      email: 'fatma.elqahri@photoeq.com',
      address: {
        street: 'Apartment 18, Dokki',
        city: 'Cairo',
        state: 'Cairo',
        postalCode: '12311',
        country: 'Egypt'
      },
      emergencyContact: {
        name: 'Saad El Qahri',
        relationship: 'Father',
        phone: '+20-10-8901-2346',
        email: 'saad.elqahri@email.com'
      }
    },
    employmentInfo: {
      departmentId: 'RETAIL',
      position: 'Retail Sales Manager',
      jobTitle: 'Retail Manager',
      employmentType: 'full-time',
      workLocation: 'Multiple Store Locations',
      workSchedule: '10:00 AM - 10:00 PM',
      salary: {
        baseSalary: 45000,
        currency: 'EGP',
        payFrequency: 'monthly'
      }
    }
  },

  // Corporate Sales Manager
  {
    personalInfo: {
      firstName: "Amir",
      lastName: "El Iskandarani",
      middleName: "Mustafa",
      dateOfBirth: new Date('1984-08-14'),
      gender: 'male',
      maritalStatus: 'married',
      nationality: 'Egyptian',
      phone: '+20-10-9012-3456',
      email: 'amir.eliskandarani@photoeq.com',
      address: {
        street: 'Villa 22, Alexandria',
        city: 'Alexandria',
        state: 'Alexandria',
        postalCode: '21500',
        country: 'Egypt'
      },
      emergencyContact: {
        name: 'Mustafa El Iskandarani',
        relationship: 'Father',
        phone: '+20-10-9012-3457',
        email: 'mustafa.eliskandarani@email.com'
      }
    },
    employmentInfo: {
      departmentId: 'CORP',
      position: 'Corporate Sales Manager',
      jobTitle: 'Corporate Sales Manager',
      employmentType: 'full-time',
      workLocation: 'Head Office - Corporate Sales Office',
      workSchedule: '9:00 AM - 6:00 PM',
      salary: {
        baseSalary: 70000,
        currency: 'EGP',
        payFrequency: 'monthly'
      }
    }
  },

  // Digital Marketing Specialist
  {
    personalInfo: {
      firstName: "Dina",
      lastName: "El Hadithi",
      middleName: "Ahmed",
      dateOfBirth: new Date('1990-05-03'),
      gender: 'female',
      maritalStatus: 'single',
      nationality: 'Egyptian',
      phone: '+20-10-0123-4567',
      email: 'dina.elhadithi@photoeq.com',
      address: {
        street: 'Building 15, Sheikh Zayed City',
        city: 'Sheikh Zayed City',
        state: 'Giza',
        postalCode: '12588',
        country: 'Egypt'
      },
      emergencyContact: {
        name: 'Ahmed El Hadithi',
        relationship: 'Father',
        phone: '+20-10-0123-4568',
        email: 'ahmed.elhadithi@email.com'
      }
    },
    employmentInfo: {
      departmentId: 'DIGITAL',
      position: 'Digital Marketing Specialist',
      jobTitle: 'Digital Marketing Specialist',
      employmentType: 'full-time',
      workLocation: 'Head Office - Digital Hub',
      workSchedule: '9:00 AM - 6:00 PM',
      salary: {
        baseSalary: 40000,
        currency: 'EGP',
        payFrequency: 'monthly'
      }
    }
  },

  // Sales Representatives
  {
    personalInfo: {
      firstName: "Omar",
      lastName: "El Mansouri",
      middleName: "Mohamed",
      dateOfBirth: new Date('1992-02-28'),
      gender: 'male',
      maritalStatus: 'single',
      nationality: 'Egyptian',
      phone: '+20-10-1234-5670',
      email: 'omar.elmansouri@photoeq.com',
      address: {
        street: 'Apartment 12, Agouza',
        city: 'Cairo',
        state: 'Cairo',
        postalCode: '12411',
        country: 'Egypt'
      },
      emergencyContact: {
        name: 'Mohamed El Mansouri',
        relationship: 'Father',
        phone: '+20-10-1234-5671',
        email: 'mohamed.elmansouri@email.com'
      }
    },
    employmentInfo: {
      departmentId: 'RETAIL',
      position: 'Sales Representative',
      jobTitle: 'Senior Sales Representative',
      employmentType: 'full-time',
      workLocation: 'Cairo Mall Store',
      workSchedule: '10:00 AM - 10:00 PM',
      salary: {
        baseSalary: 25000,
        currency: 'EGP',
        payFrequency: 'monthly'
      }
    }
  },

  {
    personalInfo: {
      firstName: "Sara",
      lastName: "El Fattahi",
      middleName: "Abdullah",
      dateOfBirth: new Date('1991-10-16'),
      gender: 'female',
      maritalStatus: 'single',
      nationality: 'Egyptian',
      phone: '+20-10-2345-6780',
      email: 'sara.elfattahi@photoeq.com',
      address: {
        street: 'Building 9, Mansoura',
        city: 'Mansoura',
        state: 'Dakahlia',
        postalCode: '35511',
        country: 'Egypt'
      },
      emergencyContact: {
        name: 'Abdullah El Fattahi',
        relationship: 'Father',
        phone: '+20-10-2345-6781',
        email: 'abdullah.elfattahi@email.com'
      }
    },
    employmentInfo: {
      departmentId: 'RETAIL',
      position: 'Sales Representative',
      jobTitle: 'Sales Representative',
      employmentType: 'full-time',
      workLocation: 'Alexandria Store',
      workSchedule: '10:00 AM - 10:00 PM',
      salary: {
        baseSalary: 22000,
        currency: 'EGP',
        payFrequency: 'monthly'
      }
    }
  },

  // Technical Support Staff
  {
    personalInfo: {
      firstName: "Mohamed",
      lastName: "El Teqni",
      middleName: "Hassan",
      dateOfBirth: new Date('1988-11-20'),
      gender: 'male',
      maritalStatus: 'married',
      nationality: 'Egyptian',
      phone: '+20-10-3456-7891',
      email: 'mohamed.elteqni@photoeq.com',
      address: {
        street: 'Building 4, Giza',
        city: 'Giza',
        state: 'Giza',
        postalCode: '12613',
        country: 'Egypt'
      },
      emergencyContact: {
        name: 'Hassan El Teqni',
        relationship: 'Father',
        phone: '+20-10-3456-7892',
        email: 'hassan.elteqni@email.com'
      }
    },
    employmentInfo: {
      departmentId: 'TECH',
      position: 'Technical Support Specialist',
      jobTitle: 'Senior Technical Support Specialist',
      employmentType: 'full-time',
      workLocation: 'Technical Building - Service Center',
      workSchedule: '8:00 AM - 5:00 PM',
      salary: {
        baseSalary: 30000,
        currency: 'EGP',
        payFrequency: 'monthly'
      }
    }
  },

  // Finance Staff
  {
    personalInfo: {
      firstName: "Nadia",
      lastName: "El Mo7asebi",
      middleName: "Ahmed",
      dateOfBirth: new Date('1986-07-09'),
      gender: 'female',
      maritalStatus: 'married',
      nationality: 'Egyptian',
      phone: '+20-10-4567-8902',
      email: 'nadia.elmo7asebi@photoeq.com',
      address: {
        street: 'Villa 6, Shubra El Kheima',
        city: 'Shubra El Kheima',
        state: 'Qalyubia',
        postalCode: '13411',
        country: 'Egypt'
      },
      emergencyContact: {
        name: 'Ahmed El Mo7asebi',
        relationship: 'Father',
        phone: '+20-10-4567-8903',
        email: 'ahmed.elmo7asebi@email.com'
      }
    },
    employmentInfo: {
      departmentId: 'FIN',
      position: 'Senior Accountant',
      jobTitle: 'Senior Accountant',
      employmentType: 'full-time',
      workLocation: 'Head Office - Finance Office',
      workSchedule: '9:00 AM - 5:00 PM',
      salary: {
        baseSalary: 35000,
        currency: 'EGP',
        payFrequency: 'monthly'
      }
    }
  },

  // HR Staff
  {
    personalInfo: {
      firstName: "Kareem",
      lastName: "El Mowazef",
      middleName: "Mohamed",
      dateOfBirth: new Date('1989-04-12'),
      gender: 'male',
      maritalStatus: 'single',
      nationality: 'Egyptian',
      phone: '+20-10-5678-9013',
      email: 'kareem.elmowazef@photoeq.com',
      address: {
        street: 'Building 20, Nasr City',
        city: 'Cairo',
        state: 'Cairo',
        postalCode: '11762',
        country: 'Egypt'
      },
      emergencyContact: {
        name: 'Mohamed El Mowazef',
        relationship: 'Father',
        phone: '+20-10-5678-9014',
        email: 'mohamed.elmowazef@email.com'
      }
    },
    employmentInfo: {
      departmentId: 'HR',
      position: 'HR Specialist',
      jobTitle: 'HR Specialist',
      employmentType: 'full-time',
      workLocation: 'Head Office - HR Office',
      workSchedule: '9:00 AM - 5:00 PM',
      salary: {
        baseSalary: 28000,
        currency: 'EGP',
        payFrequency: 'monthly'
      }
    }
  }
];
