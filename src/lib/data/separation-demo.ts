// Demo data for Separation & Offboarding module

export const separationDemo = {
  // Mock separation requests
  separationRequests: [
    {
      separationId: 'SEP001',
      employeeId: 'EMP003',
      employeeName: 'Youssef El Abbasi',
      employeeEmail: 'youssef.abbasi@company.com',
      employeePosition: 'IT Specialist',
      employeeDepartment: 'IT',
      managerId: 'EMP009',
      managerName: 'Ahmed Mahmoud',
      hrManagerId: 'EMP002',
      hrManagerName: 'Fatma Hassan',
      
      separationType: 'resignation',
      separationReason: 'Found a better opportunity with a technology company that offers more growth potential and higher compensation.',
      resignationReason: 'better_opportunity',
      
      lastWorkingDate: new Date('2024-12-31'),
      noticePeriodDays: 30,
      noticePeriodStartDate: new Date('2024-12-01'),
      noticePeriodEndDate: new Date('2024-12-31'),
      
      status: 'approved',
      priority: 'medium',
      
      workflowSteps: [
        {
          stepId: 'STEP001',
          stepName: 'Manager Review',
          assignedTo: 'EMP009',
          assignedToName: 'Ahmed Mahmoud',
          status: 'completed',
          dueDate: new Date('2024-12-04'),
          completedDate: new Date('2024-12-03'),
          comments: 'Manager approved the resignation. Employee has been a valuable team member.'
        },
        {
          stepId: 'STEP002',
          stepName: 'HR Review',
          assignedTo: 'EMP002',
          assignedToName: 'Fatma Hassan',
          status: 'completed',
          dueDate: new Date('2024-12-06'),
          completedDate: new Date('2024-12-05'),
          comments: 'HR processed the resignation. Exit interview scheduled.'
        },
        {
          stepId: 'STEP003',
          stepName: 'Exit Interview',
          assignedTo: 'EMP002',
          assignedToName: 'Fatma Hassan',
          status: 'completed',
          dueDate: new Date('2024-12-08'),
          completedDate: new Date('2024-12-07'),
          comments: 'Exit interview completed successfully.'
        },
        {
          stepId: 'STEP004',
          stepName: 'Clearance Process',
          assignedTo: 'MULTIPLE',
          assignedToName: 'Multiple Departments',
          status: 'in_progress',
          dueDate: new Date('2024-12-15'),
          comments: 'Clearance process in progress.'
        }
      ],
      
      approvals: [
        {
          approverId: 'EMP009',
          approverName: 'Ahmed Mahmoud',
          approverRole: 'CEO',
          status: 'approved',
          approvedDate: new Date('2024-12-03'),
          comments: 'Approved. Employee has been a valuable contributor.',
          priority: 1
        },
        {
          approverId: 'EMP002',
          approverName: 'Fatma Hassan',
          approverRole: 'HR Manager',
          status: 'approved',
          approvedDate: new Date('2024-12-05'),
          comments: 'HR approval granted. Exit process initiated.',
          priority: 2
        }
      ],
      
      documents: [
        {
          documentId: 'DOC001',
          documentName: 'Resignation Letter',
          documentType: 'resignation_letter',
          url: '/documents/sep001-resignation-letter.pdf',
          uploadedBy: 'EMP003',
          uploadedDate: new Date('2024-12-01'),
          isRequired: true
        },
        {
          documentId: 'DOC002',
          documentName: 'Acceptance Letter',
          documentType: 'acceptance_letter',
          url: '/documents/sep001-acceptance-letter.pdf',
          uploadedBy: 'EMP002',
          uploadedDate: new Date('2024-12-03'),
          isRequired: true
        }
      ],
      
      finalSettlement: {
        lastSalaryAmount: 15000,
        accruedLeaveDays: 15,
        accruedLeaveValue: 7500,
        noticePayDays: 30,
        noticePayValue: 15000,
        bonusAmount: 5000,
        deductions: [
          {
            name: 'Income Tax',
            amount: 3000,
            reason: 'Final tax deduction'
          },
          {
            name: 'Social Insurance',
            amount: 1650,
            reason: 'Final social insurance'
          }
        ],
        totalSettlement: 42350,
        paymentMethod: 'bank_transfer',
        paymentDate: new Date('2025-01-05'),
        paymentReference: 'PAY2025001'
      },
      
      submittedDate: new Date('2024-12-01'),
      approvedDate: new Date('2024-12-05'),
      completedDate: undefined,
      createdAt: new Date('2024-12-01'),
      updatedAt: new Date('2024-12-20'),
      createdBy: 'EMP003',
      updatedBy: 'EMP002'
    },
    {
      separationId: 'SEP002',
      employeeId: 'EMP004',
      employeeName: 'Mariam Hassan',
      employeeEmail: 'mariam.hassan@company.com',
      employeePosition: 'Sales Manager',
      employeeDepartment: 'Sales',
      managerId: 'EMP009',
      managerName: 'Ahmed Mahmoud',
      hrManagerId: 'EMP002',
      hrManagerName: 'Fatma Hassan',
      
      separationType: 'resignation',
      separationReason: 'Personal reasons - relocating to another city for family commitments.',
      resignationReason: 'personal_reasons',
      
      lastWorkingDate: new Date('2025-01-15'),
      noticePeriodDays: 30,
      noticePeriodStartDate: new Date('2024-12-15'),
      noticePeriodEndDate: new Date('2025-01-15'),
      
      status: 'under_review',
      priority: 'medium',
      
      workflowSteps: [
        {
          stepId: 'STEP001',
          stepName: 'Manager Review',
          assignedTo: 'EMP009',
          assignedToName: 'Ahmed Mahmoud',
          status: 'in_progress',
          dueDate: new Date('2024-12-18'),
          comments: 'Manager review in progress'
        },
        {
          stepId: 'STEP002',
          stepName: 'HR Review',
          assignedTo: 'EMP002',
          assignedToName: 'Fatma Hassan',
          status: 'pending',
          dueDate: new Date('2024-12-20'),
          comments: ''
        },
        {
          stepId: 'STEP003',
          stepName: 'Exit Interview',
          assignedTo: 'EMP002',
          assignedToName: 'Fatma Hassan',
          status: 'pending',
          dueDate: new Date('2024-12-22'),
          comments: ''
        },
        {
          stepId: 'STEP004',
          stepName: 'Clearance Process',
          assignedTo: 'MULTIPLE',
          assignedToName: 'Multiple Departments',
          status: 'pending',
          dueDate: new Date('2024-12-25'),
          comments: ''
        }
      ],
      
      approvals: [
        {
          approverId: 'EMP009',
          approverName: 'Ahmed Mahmoud',
          approverRole: 'CEO',
          status: 'pending',
          priority: 1
        },
        {
          approverId: 'EMP002',
          approverName: 'Fatma Hassan',
          approverRole: 'HR Manager',
          status: 'pending',
          priority: 2
        }
      ],
      
      documents: [
        {
          documentId: 'DOC003',
          documentName: 'Resignation Letter',
          documentType: 'resignation_letter',
          url: '/documents/sep002-resignation-letter.pdf',
          uploadedBy: 'EMP004',
          uploadedDate: new Date('2024-12-15'),
          isRequired: true
        }
      ],
      
      finalSettlement: {
        lastSalaryAmount: 18000,
        accruedLeaveDays: 12,
        accruedLeaveValue: 7200,
        noticePayDays: 30,
        noticePayValue: 18000,
        bonusAmount: 8000,
        deductions: [
          {
            name: 'Income Tax',
            amount: 3600,
            reason: 'Final tax deduction'
          },
          {
            name: 'Social Insurance',
            amount: 1980,
            reason: 'Final social insurance'
          }
        ],
        totalSettlement: 47620,
        paymentMethod: 'bank_transfer',
        paymentDate: undefined,
        paymentReference: ''
      },
      
      submittedDate: new Date('2024-12-15'),
      approvedDate: undefined,
      completedDate: undefined,
      createdAt: new Date('2024-12-15'),
      updatedAt: new Date('2024-12-15'),
      createdBy: 'EMP004',
      updatedBy: 'EMP004'
    }
  ],

  // Mock exit interviews
  exitInterviews: [
    {
      interviewId: 'EINT001',
      separationId: 'SEP001',
      employeeId: 'EMP003',
      employeeName: 'Youssef El Abbasi',
      interviewerId: 'EMP002',
      interviewerName: 'Fatma Hassan',
      interviewerRole: 'HR Manager',
      
      interviewDate: new Date('2024-12-07T14:00:00'),
      interviewDuration: 45,
      interviewType: 'face_to_face',
      interviewLocation: 'HR Office',
      
      status: 'completed',
      
      questions: [
        {
          questionId: 'Q001',
          category: 'job_satisfaction',
          question: 'How would you rate your overall job satisfaction?',
          response: 'I would rate it 4 out of 5. I enjoyed my role and the team, but felt there were limited growth opportunities.',
          rating: 4,
          isRequired: true
        },
        {
          questionId: 'Q002',
          category: 'job_satisfaction',
          question: 'What did you enjoy most about your role?',
          response: 'I really enjoyed the technical challenges and working with new technologies. The team collaboration was also great.',
          rating: 5,
          isRequired: true
        },
        {
          questionId: 'Q003',
          category: 'management',
          question: 'How would you rate your relationship with your direct manager?',
          response: 'My relationship with my manager was good. They were supportive and provided regular feedback.',
          rating: 4,
          isRequired: true
        },
        {
          questionId: 'Q004',
          category: 'work_environment',
          question: 'How would you describe the work environment and culture?',
          response: 'The work environment was generally positive. Good team spirit and collaborative atmosphere.',
          rating: 4,
          isRequired: true
        },
        {
          questionId: 'Q005',
          category: 'compensation',
          question: 'How would you rate your compensation and benefits?',
          response: 'Compensation was competitive, but I felt that benefits could be improved, especially health insurance.',
          rating: 3,
          isRequired: true
        },
        {
          questionId: 'Q006',
          category: 'career_development',
          question: 'Did you have opportunities for career growth and development?',
          response: 'Limited opportunities for advancement. Would like to see more structured career development programs.',
          rating: 2,
          isRequired: true
        },
        {
          questionId: 'Q007',
          category: 'other',
          question: 'What are the main reasons for leaving the company?',
          response: 'I found a better opportunity with more growth potential and higher compensation.',
          rating: 0,
          isRequired: true
        },
        {
          questionId: 'Q008',
          category: 'other',
          question: 'Is there anything that could have been done to retain you?',
          response: 'Better career development opportunities and improved benefits package.',
          rating: 0,
          isRequired: false
        },
        {
          questionId: 'Q009',
          category: 'suggestions',
          question: 'What suggestions do you have for improving the company?',
          response: 'Consider improving the benefits package and providing more career development opportunities.',
          rating: 0,
          isRequired: false
        },
        {
          questionId: 'Q010',
          category: 'suggestions',
          question: 'Would you recommend this company to others?',
          response: 'Yes, I would recommend it to others, especially for those starting their careers.',
          rating: 4,
          isRequired: true
        }
      ],
      
      overallSatisfaction: 4,
      wouldRecommend: true,
      mainReasonsForLeaving: ['Better opportunity', 'Career growth', 'Compensation'],
      suggestionsForImprovement: 'Consider improving the benefits package and providing more career development opportunities. Also, implement a structured mentorship program.',
      additionalComments: 'Overall, it was a positive experience. I learned a lot and grew professionally. The team was supportive and the work was challenging.',
      
      followUpActions: [
        {
          actionId: 'ACTION001',
          action: 'Review benefits package',
          assignedTo: 'EMP002',
          assignedToName: 'Fatma Hassan',
          dueDate: new Date('2025-01-15'),
          status: 'pending',
          notes: 'Consider improving health insurance and retirement benefits based on employee feedback'
        },
        {
          actionId: 'ACTION002',
          action: 'Develop career advancement program',
          assignedTo: 'EMP009',
          assignedToName: 'Ahmed Mahmoud',
          dueDate: new Date('2025-02-01'),
          status: 'pending',
          notes: 'Create structured career development paths for all employees'
        },
        {
          actionId: 'ACTION003',
          action: 'Implement mentorship program',
          assignedTo: 'EMP002',
          assignedToName: 'Fatma Hassan',
          dueDate: new Date('2025-01-30'),
          status: 'pending',
          notes: 'Develop a formal mentorship program for employee development'
        }
      ],
      
      attachments: [],
      
      createdAt: new Date('2024-12-05'),
      updatedAt: new Date('2024-12-07'),
      createdBy: 'EMP002',
      updatedBy: 'EMP002'
    }
  ],

  // Mock clearance checklists
  clearanceChecklists: [
    {
      checklistId: 'CLEAR001',
      separationId: 'SEP001',
      employeeId: 'EMP003',
      employeeName: 'Youssef El Abbasi',
      
      categories: [
        {
          categoryId: 'CAT001',
          categoryName: 'IT Assets & Access',
          items: [
            {
              itemId: 'ITEM001',
              itemName: 'Laptop Return',
              description: 'Return company laptop and accessories',
              department: 'IT',
              responsiblePerson: 'IT_ADMIN',
              responsiblePersonName: 'IT Administrator',
              status: 'completed',
              dueDate: new Date('2024-12-22'),
              completedDate: new Date('2024-12-20'),
              comments: 'Laptop returned in good condition. All accessories included.'
            },
            {
              itemId: 'ITEM002',
              itemName: 'Desktop Computer',
              description: 'Return desktop computer and peripherals',
              department: 'IT',
              responsiblePerson: 'IT_ADMIN',
              responsiblePersonName: 'IT Administrator',
              status: 'not_applicable',
              dueDate: new Date('2024-12-22'),
              comments: 'Employee did not have desktop computer assigned'
            },
            {
              itemId: 'ITEM003',
              itemName: 'Mobile Device',
              description: 'Return company mobile device',
              department: 'IT',
              responsiblePerson: 'IT_ADMIN',
              responsiblePersonName: 'IT Administrator',
              status: 'pending',
              dueDate: new Date('2024-12-22'),
              comments: 'Mobile device return pending'
            },
            {
              itemId: 'ITEM004',
              itemName: 'Email Account Deactivation',
              description: 'Deactivate company email account',
              department: 'IT',
              responsiblePerson: 'IT_ADMIN',
              responsiblePersonName: 'IT Administrator',
              status: 'completed',
              dueDate: new Date('2024-12-18'),
              completedDate: new Date('2024-12-18'),
              comments: 'Email account deactivated successfully'
            },
            {
              itemId: 'ITEM005',
              itemName: 'System Access Removal',
              description: 'Remove access from all company systems',
              department: 'IT',
              responsiblePerson: 'IT_ADMIN',
              responsiblePersonName: 'IT Administrator',
              status: 'completed',
              dueDate: new Date('2024-12-18'),
              completedDate: new Date('2024-12-18'),
              comments: 'All system access removed from user accounts'
            }
          ]
        },
        {
          categoryId: 'CAT002',
          categoryName: 'Finance & Settlements',
          items: [
            {
              itemId: 'ITEM006',
              itemName: 'Salary Advance Settlement',
              description: 'Clear any outstanding salary advances',
              department: 'Finance',
              responsiblePerson: 'FINANCE_MGR',
              responsiblePersonName: 'Finance Manager',
              status: 'completed',
              dueDate: new Date('2024-12-25'),
              completedDate: new Date('2024-12-23'),
              comments: 'No outstanding salary advances'
            },
            {
              itemId: 'ITEM007',
              itemName: 'Expense Claims',
              description: 'Submit and process final expense claims',
              department: 'Finance',
              responsiblePerson: 'FINANCE_MGR',
              responsiblePersonName: 'Finance Manager',
              status: 'in_progress',
              dueDate: new Date('2024-12-25'),
              comments: 'Processing final expense claim of EGP 500'
            },
            {
              itemId: 'ITEM008',
              itemName: 'Loan Settlement',
              description: 'Settle any outstanding company loans',
              department: 'Finance',
              responsiblePerson: 'FINANCE_MGR',
              responsiblePersonName: 'Finance Manager',
              status: 'completed',
              dueDate: new Date('2024-12-25'),
              completedDate: new Date('2024-12-22'),
              comments: 'No outstanding loans'
            },
            {
              itemId: 'ITEM009',
              itemName: 'Final Settlement',
              description: 'Process final salary and benefits settlement',
              department: 'Finance',
              responsiblePerson: 'FINANCE_MGR',
              responsiblePersonName: 'Finance Manager',
              status: 'pending',
              dueDate: new Date('2024-12-29'),
              comments: 'Final settlement calculation in progress'
            },
            {
              itemId: 'ITEM010',
              itemName: 'Tax Documents',
              description: 'Provide final tax documents and certificates',
              department: 'Finance',
              responsiblePerson: 'FINANCE_MGR',
              responsiblePersonName: 'Finance Manager',
              status: 'pending',
              dueDate: new Date('2024-12-29'),
              comments: 'Tax documents preparation in progress'
            }
          ]
        },
        {
          categoryId: 'CAT003',
          categoryName: 'HR & Documentation',
          items: [
            {
              itemId: 'ITEM011',
              itemName: 'ID Card Return',
              description: 'Return company ID card',
              department: 'HR',
              responsiblePerson: 'HR_MGR',
              responsiblePersonName: 'HR Manager',
              status: 'pending',
              dueDate: new Date('2024-12-20'),
              comments: 'ID card return pending'
            },
            {
              itemId: 'ITEM012',
              itemName: 'Access Cards',
              description: 'Return all building and office access cards',
              department: 'HR',
              responsiblePerson: 'HR_MGR',
              responsiblePersonName: 'HR Manager',
              status: 'pending',
              dueDate: new Date('2024-12-20'),
              comments: 'Access cards return pending'
            },
            {
              itemId: 'ITEM013',
              itemName: 'Company Uniforms',
              description: 'Return company uniforms and branded items',
              department: 'HR',
              responsiblePerson: 'HR_MGR',
              responsiblePersonName: 'HR Manager',
              status: 'not_applicable',
              dueDate: new Date('2024-12-20'),
              comments: 'Employee did not receive company uniforms'
            },
            {
              itemId: 'ITEM014',
              itemName: 'Leave Balance Settlement',
              description: 'Calculate and process leave balance',
              department: 'HR',
              responsiblePerson: 'HR_MGR',
              responsiblePersonName: 'HR Manager',
              status: 'completed',
              dueDate: new Date('2024-12-22'),
              completedDate: new Date('2024-12-21'),
              comments: 'Leave balance calculated: 15 days (EGP 7,500)'
            },
            {
              itemId: 'ITEM015',
              itemName: 'Experience Certificate',
              description: 'Prepare and issue experience certificate',
              department: 'HR',
              responsiblePerson: 'HR_MGR',
              responsiblePersonName: 'HR Manager',
              status: 'in_progress',
              dueDate: new Date('2024-12-29'),
              comments: 'Experience certificate being prepared'
            }
          ]
        },
        {
          categoryId: 'CAT004',
          categoryName: 'Operations & Handover',
          items: [
            {
              itemId: 'ITEM016',
              itemName: 'Client Handover',
              description: 'Complete client handover and transition',
              department: 'Operations',
              responsiblePerson: 'OPS_MGR',
              responsiblePersonName: 'Operations Manager',
              status: 'completed',
              dueDate: new Date('2024-12-29'),
              completedDate: new Date('2024-12-24'),
              comments: 'Client handover completed successfully. All clients notified.'
            },
            {
              itemId: 'ITEM017',
              itemName: 'Project Handover',
              description: 'Transfer project responsibilities and documentation',
              department: 'Operations',
              responsiblePerson: 'OPS_MGR',
              responsiblePersonName: 'Operations Manager',
              status: 'completed',
              dueDate: new Date('2024-12-29'),
              completedDate: new Date('2024-12-24'),
              comments: 'Project documentation transferred to replacement team member'
            },
            {
              itemId: 'ITEM018',
              itemName: 'Knowledge Transfer',
              description: 'Complete knowledge transfer sessions',
              department: 'Operations',
              responsiblePerson: 'OPS_MGR',
              responsiblePersonName: 'Operations Manager',
              status: 'completed',
              dueDate: new Date('2024-12-25'),
              completedDate: new Date('2024-12-23'),
              comments: 'Knowledge transfer sessions completed with team members'
            },
            {
              itemId: 'ITEM019',
              itemName: 'Training Materials',
              description: 'Return training materials and resources',
              department: 'Operations',
              responsiblePerson: 'OPS_MGR',
              responsiblePersonName: 'Operations Manager',
              status: 'pending',
              dueDate: new Date('2024-12-22'),
              comments: 'Training materials return pending'
            },
            {
              itemId: 'ITEM020',
              itemName: 'Contact List',
              description: 'Provide updated contact list for ongoing projects',
              department: 'Operations',
              responsiblePerson: 'OPS_MGR',
              responsiblePersonName: 'Operations Manager',
              status: 'completed',
              dueDate: new Date('2024-12-22'),
              completedDate: new Date('2024-12-21'),
              comments: 'Updated contact list provided for ongoing projects'
            }
          ]
        }
      ],
      
      status: 'in_progress',
      completionPercentage: 65,
      
      itAssets: {
        laptop: true,
        desktop: false,
        mobile: false,
        tablet: false,
        accessories: true,
        software: true,
        email: true,
        systemAccess: true,
        dataTransfer: true,
        comments: 'Most IT assets returned. Mobile device return pending.'
      },
      
      finance: {
        salaryAdvance: true,
        expenseClaims: false,
        loanSettlement: true,
        finalSettlement: false,
        taxDocuments: false,
        benefitsTermination: false,
        comments: 'Final settlement and tax documents processing in progress.'
      },
      
      hr: {
        idCard: false,
        accessCards: false,
        uniforms: false,
        equipment: false,
        leaveBalance: true,
        finalDocuments: false,
        comments: 'Leave balance calculated. ID card and access cards return pending.'
      },
      
      operations: {
        clientHandover: true,
        projectHandover: true,
        knowledgeTransfer: true,
        trainingMaterials: false,
        contacts: true,
        comments: 'Operations handover mostly complete. Training materials return pending.'
      },
      
      createdAt: new Date('2024-12-05'),
      updatedAt: new Date('2024-12-24'),
      createdBy: 'system',
      updatedBy: 'system'
    }
  ]
};

export default separationDemo;
