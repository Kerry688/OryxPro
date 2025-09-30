// Demo data for Employee Self-Service Portal

export const employeePortalDemo = {
  // Mock employee profiles
  employees: [
    {
      employeeId: 'EMP009',
      firstName: 'Ahmed',
      lastName: 'Mahmoud',
      email: 'ahmed.mahmoud@company.com',
      phone: '+20 10 1234 5678',
      address: {
        street: '123 Nile Street',
        city: 'Cairo',
        state: 'Cairo',
        zipCode: '11511',
        country: 'Egypt'
      },
      emergencyContact: {
        name: 'Fatma Mahmoud',
        relationship: 'Spouse',
        phone: '+20 10 9876 5432',
        email: 'fatma.mahmoud@email.com'
      },
      dateOfBirth: new Date('1985-03-15'),
      nationality: 'Egyptian',
      maritalStatus: 'married',
      profilePicture: '',
      department: 'Executive',
      position: 'CEO',
      managerId: '',
      managerName: '',
      hireDate: new Date('2020-01-01'),
      employmentType: 'full-time',
      workLocation: 'Head Office',
      workSchedule: '9:00 AM - 5:00 PM',
      directReports: ['EMP012', 'EMP013', 'EMP014', 'EMP015'],
      workPhone: '+20 2 2345 6789',
      extension: '101',
      deskLocation: 'CEO Office, Floor 5',
      skills: [
        {
          skillId: 'SKILL001',
          skillName: 'Strategic Planning',
          level: 'expert',
          category: 'Management',
          verified: true,
          verifiedDate: new Date('2023-01-15')
        },
        {
          skillId: 'SKILL002',
          skillName: 'Leadership',
          level: 'expert',
          category: 'Management',
          verified: true,
          verifiedDate: new Date('2023-01-15')
        },
        {
          skillId: 'SKILL003',
          skillName: 'Business Development',
          level: 'advanced',
          category: 'Business',
          verified: true,
          verifiedDate: new Date('2023-06-20')
        }
      ],
      preferences: {
        language: 'en',
        timezone: 'Africa/Cairo',
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        privacy: {
          showProfilePicture: true,
          showContactInfo: true,
          showSkills: true
        }
      },
      lastUpdated: new Date('2024-12-20'),
      updatedBy: 'EMP009'
    }
  ],

  // Mock payslips
  payslips: [
    {
      payslipId: 'PSL001',
      employeeId: 'EMP009',
      employeeName: 'Ahmed Mahmoud',
      payPeriod: {
        startDate: new Date('2024-12-01'),
        endDate: new Date('2024-12-31'),
        month: 12,
        year: 2024
      },
      basicSalary: 25000,
      allowances: [
        { name: 'Transportation Allowance', amount: 3000, taxable: true },
        { name: 'Housing Allowance', amount: 8000, taxable: false },
        { name: 'Communication Allowance', amount: 1000, taxable: true }
      ],
      deductions: [
        { name: 'Income Tax', amount: 4500, type: 'tax' },
        { name: 'Social Insurance', amount: 2750, type: 'insurance' },
        { name: 'Health Insurance', amount: 750, type: 'insurance' }
      ],
      overtime: {
        hours: 12,
        rate: 156.25,
        amount: 1875
      },
      bonuses: [
        { name: 'Performance Bonus', amount: 5000, type: 'performance' },
        { name: 'Year-End Bonus', amount: 3000, type: 'annual' }
      ],
      grossSalary: 40875,
      netSalary: 32875,
      taxDeductions: {
        incomeTax: 4500,
        socialInsurance: 2750,
        healthInsurance: 750,
        totalTaxes: 8000
      },
      bankDetails: {
        bankName: 'National Bank of Egypt',
        accountNumber: '****1234',
        accountHolderName: 'Ahmed Mahmoud'
      },
      status: 'viewed',
      generatedDate: new Date('2024-12-31'),
      sentDate: new Date('2024-12-31'),
      viewedDate: new Date('2025-01-02'),
      payslipUrl: '/api/employee/payslips/PSL001/download',
      taxSlipUrl: '/api/employee/payslips/PSL001/tax-slip'
    },
    {
      payslipId: 'PSL002',
      employeeId: 'EMP009',
      employeeName: 'Ahmed Mahmoud',
      payPeriod: {
        startDate: new Date('2024-11-01'),
        endDate: new Date('2024-11-30'),
        month: 11,
        year: 2024
      },
      basicSalary: 25000,
      allowances: [
        { name: 'Transportation Allowance', amount: 3000, taxable: true },
        { name: 'Housing Allowance', amount: 8000, taxable: false },
        { name: 'Communication Allowance', amount: 1000, taxable: true }
      ],
      deductions: [
        { name: 'Income Tax', amount: 4500, type: 'tax' },
        { name: 'Social Insurance', amount: 2750, type: 'insurance' },
        { name: 'Health Insurance', amount: 750, type: 'insurance' }
      ],
      overtime: {
        hours: 8,
        rate: 156.25,
        amount: 1250
      },
      bonuses: [
        { name: 'Performance Bonus', amount: 3000, type: 'performance' }
      ],
      grossSalary: 40250,
      netSalary: 32250,
      taxDeductions: {
        incomeTax: 4500,
        socialInsurance: 2750,
        healthInsurance: 750,
        totalTaxes: 8000
      },
      bankDetails: {
        bankName: 'National Bank of Egypt',
        accountNumber: '****1234',
        accountHolderName: 'Ahmed Mahmoud'
      },
      status: 'downloaded',
      generatedDate: new Date('2024-11-30'),
      sentDate: new Date('2024-11-30'),
      viewedDate: new Date('2024-12-01'),
      downloadedDate: new Date('2024-12-01'),
      payslipUrl: '/api/employee/payslips/PSL002/download',
      taxSlipUrl: '/api/employee/payslips/PSL002/tax-slip'
    }
  ],

  // Mock announcements
  announcements: [
    {
      announcementId: 'ANN001',
      title: 'Holiday Schedule 2025',
      content: 'Please find attached the complete holiday schedule for 2025. All employees are required to plan their leave requests accordingly. The schedule includes both national holidays and company-specific holidays.\n\nKey dates to remember:\n- New Year: January 1\n- Coptic Christmas: January 7\n- Revolution Day: January 25\n- Sinai Liberation Day: April 25\n- Labor Day: May 1\n- Eid al-Fitr: March 30-31 (tentative)\n- Eid al-Adha: June 6-7 (tentative)\n\nPlease coordinate with your managers when planning vacation time around these holidays.',
      type: 'general',
      priority: 'urgent',
      targetAudience: {
        allEmployees: true,
        departments: [],
        positions: [],
        specificEmployees: []
      },
      authorId: 'EMP009',
      authorName: 'Ahmed Mahmoud',
      authorRole: 'CEO',
      attachments: [
        {
          name: 'Holiday_Schedule_2025.pdf',
          url: '/attachments/holiday-schedule-2025.pdf',
          type: 'application/pdf',
          size: 1024000
        }
      ],
      publishDate: new Date('2024-12-15T09:00:00'),
      isActive: true,
      readBy: [],
      createdAt: new Date('2024-12-15T09:00:00'),
      updatedAt: new Date('2024-12-15T09:00:00')
    },
    {
      announcementId: 'ANN002',
      title: 'New HR Policies Update',
      content: 'We have updated our HR policies effective January 1, 2025. The changes include updates to leave policies, remote work guidelines, and performance review processes.\n\nKey changes:\n1. Annual leave allocation increased to 21 days\n2. Remote work policy now allows up to 2 days per week\n3. Performance reviews will be conducted quarterly\n4. New parental leave policy for both parents\n\nPlease review the updated policies in the employee handbook and contact HR if you have any questions.',
      type: 'policy',
      priority: 'high',
      targetAudience: {
        allEmployees: true,
        departments: [],
        positions: [],
        specificEmployees: []
      },
      authorId: 'EMP012',
      authorName: 'Nora El Sharif',
      authorRole: 'HR Manager',
      attachments: [
        {
          name: 'HR_Policies_2025.pdf',
          url: '/attachments/hr-policies-2025.pdf',
          type: 'application/pdf',
          size: 2048000
        }
      ],
      publishDate: new Date('2024-12-10T14:30:00'),
      isActive: true,
      readBy: ['EMP009'],
      createdAt: new Date('2024-12-10T14:30:00'),
      updatedAt: new Date('2024-12-10T14:30:00')
    },
    {
      announcementId: 'ANN003',
      title: 'Company All-Hands Meeting',
      content: 'Join us for our quarterly all-hands meeting on January 15, 2025, at 2:00 PM in the main conference room.\n\nAgenda:\n- Q4 2024 Performance Review\n- 2025 Strategic Initiatives\n- New Product Launches\n- Employee Recognition Awards\n- Q&A Session\n\nLight refreshments will be provided. Please RSVP by January 10th.',
      type: 'event',
      priority: 'medium',
      targetAudience: {
        allEmployees: true,
        departments: [],
        positions: [],
        specificEmployees: []
      },
      authorId: 'EMP009',
      authorName: 'Ahmed Mahmoud',
      authorRole: 'CEO',
      attachments: [],
      publishDate: new Date('2024-12-05T10:00:00'),
      isActive: true,
      readBy: ['EMP009'],
      createdAt: new Date('2024-12-05T10:00:00'),
      updatedAt: new Date('2024-12-05T10:00:00')
    },
    {
      announcementId: 'ANN004',
      title: 'IT System Maintenance',
      content: 'Scheduled system maintenance will occur on January 10, 2025, from 10:00 PM to 2:00 AM.\n\nDuring this time, the following systems will be temporarily unavailable:\n- Email servers\n- HR portal\n- File servers\n- VPN access\n- Internal applications\n\nPlease save your work and plan accordingly. We apologize for any inconvenience.',
      type: 'general',
      priority: 'high',
      targetAudience: {
        allEmployees: true,
        departments: [],
        positions: [],
        specificEmployees: []
      },
      authorId: 'EMP013',
      authorName: 'Youssef El Abbasi',
      authorRole: 'IT Specialist',
      attachments: [],
      publishDate: new Date('2024-12-01T16:00:00'),
      isActive: true,
      readBy: [],
      createdAt: new Date('2024-12-01T16:00:00'),
      updatedAt: new Date('2024-12-01T16:00:00')
    }
  ],

  // Mock messages
  messages: [
    {
      messageId: 'MSG001',
      fromEmployeeId: 'EMP012',
      fromEmployeeName: 'Nora El Sharif',
      fromEmployeeRole: 'HR Manager',
      toEmployeeId: 'EMP009',
      toEmployeeName: 'Ahmed Mahmoud',
      subject: 'Performance Review Meeting',
      content: 'Hi Ahmed,\n\nI hope you are doing well. I would like to schedule your quarterly performance review meeting. Please let me know your availability for next week.\n\nWe can meet in my office or via video call if you prefer. The meeting should take about 45 minutes.\n\nBest regards,\nNora',
      type: 'direct',
      priority: 'medium',
      attachments: [],
      isRead: false,
      isImportant: false,
      isArchived: false,
      sentDate: new Date('2024-12-15T10:30:00'),
      repliedTo: undefined,
      threadId: undefined
    },
    {
      messageId: 'MSG002',
      fromEmployeeId: 'EMP009',
      fromEmployeeName: 'Ahmed Mahmoud',
      fromEmployeeRole: 'CEO',
      toEmployeeId: 'EMP013',
      toEmployeeName: 'Youssef El Abbasi',
      subject: 'Project Update Required',
      content: 'Hi Youssef,\n\nCould you please provide an update on the website redesign project? I need to present the progress to the board next week.\n\nPlease include:\n- Current status\n- Timeline updates\n- Any blockers or issues\n- Resource requirements\n\nThanks,\nAhmed',
      type: 'direct',
      priority: 'high',
      attachments: [],
      isRead: true,
      isImportant: true,
      isArchived: false,
      sentDate: new Date('2024-12-14T14:15:00'),
      repliedTo: undefined,
      threadId: undefined
    },
    {
      messageId: 'MSG003',
      fromEmployeeId: 'EMP014',
      fromEmployeeName: 'Mariam Hassan',
      fromEmployeeRole: 'Sales Manager',
      toEmployeeId: 'EMP009',
      toEmployeeName: 'Ahmed Mahmoud',
      subject: 'Monthly Sales Report',
      content: 'Dear Ahmed,\n\nPlease find attached the monthly sales report for December. We have exceeded our targets by 15% this month, which is excellent news!\n\nKey highlights:\n- Revenue: 2.5M EGP (target: 2.2M EGP)\n- New clients: 12 (target: 8)\n- Customer satisfaction: 94%\n\nThe team has done an outstanding job, especially during the holiday season.\n\nRegards,\nMariam',
      type: 'direct',
      priority: 'low',
      attachments: [
        {
          name: 'Sales_Report_December_2024.pdf',
          url: '/attachments/sales-report-dec-2024.pdf',
          type: 'application/pdf',
          size: 512000
        }
      ],
      isRead: true,
      isImportant: false,
      isArchived: false,
      sentDate: new Date('2024-12-13T16:45:00'),
      repliedTo: undefined,
      threadId: undefined
    },
    {
      messageId: 'MSG004',
      fromEmployeeId: 'EMP009',
      fromEmployeeName: 'Ahmed Mahmoud',
      fromEmployeeRole: 'CEO',
      toEmployeeId: 'EMP015',
      toEmployeeName: 'Omar Farouk',
      subject: 'Meeting Cancellation',
      content: 'Hi Omar,\n\nI need to cancel our meeting scheduled for tomorrow at 2 PM due to an urgent client meeting that just came up.\n\nLet\'s reschedule for next week. Please let me know your availability.\n\nBest,\nAhmed',
      type: 'direct',
      priority: 'medium',
      attachments: [],
      isRead: false,
      isImportant: false,
      isArchived: false,
      sentDate: new Date('2024-12-12T09:20:00'),
      repliedTo: undefined,
      threadId: undefined
    }
  ]
};

export default employeePortalDemo;
