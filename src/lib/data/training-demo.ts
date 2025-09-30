import { TrainingProgram, CreateTrainingProgramDTO, CreateTrainingScheduleDTO, CreateCertificationDTO } from '@/lib/models/training';

// Demo Training Programs
export const demoTrainingPrograms: CreateTrainingProgramDTO[] = [
  {
    title: "Leadership Development Program",
    description: "Comprehensive leadership training covering strategic thinking, team management, and decision-making skills for senior and mid-level managers.",
    category: "leadership",
    level: "advanced",
    duration: 40,
    deliveryMethod: "hybrid",
    cost: {
      amount: 2500,
      currency: "EGP"
    },
    prerequisites: ["Management experience", "Bachelor's degree or equivalent"],
    learningObjectives: [
      "Develop strategic leadership capabilities",
      "Enhance team management and motivation skills",
      "Improve decision-making and problem-solving abilities",
      "Build effective communication and presentation skills"
    ],
    skills: ["Strategic Planning", "Team Leadership", "Decision Making", "Communication", "Change Management"],
    instructor: {
      name: "Dr. Ahmed Hassan",
      email: "ahmed.hassan@training.com",
      qualifications: "PhD in Organizational Psychology, 15 years experience in leadership development"
    },
    resources: {
      materials: ["Leadership workbook", "Case studies", "Assessment tools"],
      equipment: ["Projector", "Flip charts", "Whiteboards"],
      software: ["Leadership assessment platform", "Team collaboration tools"]
    },
    certification: {
      provides: true,
      name: "Certified Leadership Professional",
      validFor: 24,
      issuingAuthority: "Egyptian Management Institute"
    }
  },
  {
    title: "Customer Service Excellence",
    description: "Training program focused on delivering exceptional customer service, handling complaints, and building customer relationships.",
    category: "customer-service",
    level: "intermediate",
    duration: 16,
    deliveryMethod: "in-person",
    cost: {
      amount: 800,
      currency: "EGP"
    },
    prerequisites: ["Customer-facing role", "Basic communication skills"],
    learningObjectives: [
      "Master customer service best practices",
      "Learn effective complaint handling techniques",
      "Develop emotional intelligence in customer interactions",
      "Build customer loyalty and retention strategies"
    ],
    skills: ["Customer Service", "Communication", "Problem Solving", "Emotional Intelligence", "Conflict Resolution"],
    instructor: {
      name: "Mariam El Saeed",
      email: "mariam.elsaeed@training.com",
      qualifications: "Customer Service Expert, 10 years in retail and hospitality"
    },
    resources: {
      materials: ["Customer service manual", "Role-play scenarios", "Feedback forms"],
      equipment: ["Customer service simulation setup"],
      software: ["CRM system training", "Customer feedback platform"]
    },
    certification: {
      provides: true,
      name: "Customer Service Excellence Certificate",
      validFor: 12,
      issuingAuthority: "Egyptian Customer Service Institute"
    }
  },
  {
    title: "Project Management Fundamentals",
    description: "Essential project management skills covering planning, execution, monitoring, and closing projects successfully.",
    category: "technical",
    level: "beginner",
    duration: 24,
    deliveryMethod: "online",
    cost: {
      amount: 1200,
      currency: "EGP"
    },
    prerequisites: ["Basic computer skills", "Work experience in any field"],
    learningObjectives: [
      "Understand project management principles and methodologies",
      "Learn project planning and scheduling techniques",
      "Master risk management and quality control",
      "Develop stakeholder management skills"
    ],
    skills: ["Project Planning", "Risk Management", "Team Coordination", "Quality Control", "Stakeholder Management"],
    instructor: {
      name: "Youssef El Abbasi",
      email: "youssef.elabbasi@training.com",
      qualifications: "PMP Certified, 12 years in project management"
    },
    resources: {
      materials: ["PMBOK guide", "Project templates", "Case studies"],
      equipment: ["Project management software access"],
      software: ["Microsoft Project", "Trello", "Asana"]
    },
    certification: {
      provides: true,
      name: "Project Management Fundamentals Certificate",
      validFor: 18,
      issuingAuthority: "Egyptian Project Management Association"
    }
  },
  {
    title: "Workplace Safety & Compliance",
    description: "Comprehensive safety training covering workplace hazards, emergency procedures, and compliance requirements.",
    category: "compliance",
    level: "beginner",
    duration: 8,
    deliveryMethod: "in-person",
    cost: {
      amount: 500,
      currency: "EGP"
    },
    prerequisites: ["Employment in the organization"],
    learningObjectives: [
      "Identify workplace hazards and risks",
      "Learn emergency response procedures",
      "Understand safety regulations and compliance",
      "Develop safety awareness and culture"
    ],
    skills: ["Safety Awareness", "Risk Assessment", "Emergency Response", "Compliance", "Incident Reporting"],
    instructor: {
      name: "Nora El Sharif",
      email: "nora.elsharif@training.com",
      qualifications: "Safety Professional, NEBOSH Certified, 8 years experience"
    },
    resources: {
      materials: ["Safety manual", "Emergency procedures guide", "Safety equipment"],
      equipment: ["Fire extinguishers", "First aid kits", "Safety signage"],
      software: ["Incident reporting system"]
    },
    certification: {
      provides: true,
      name: "Workplace Safety Certificate",
      validFor: 12,
      issuingAuthority: "Egyptian Safety Institute"
    }
  },
  {
    title: "Digital Marketing Essentials",
    description: "Modern digital marketing strategies including social media, content marketing, SEO, and analytics.",
    category: "technical",
    level: "intermediate",
    duration: 20,
    deliveryMethod: "hybrid",
    cost: {
      amount: 1500,
      currency: "EGP"
    },
    prerequisites: ["Basic marketing knowledge", "Computer literacy"],
    learningObjectives: [
      "Master digital marketing channels and strategies",
      "Learn social media marketing and content creation",
      "Understand SEO and paid advertising",
      "Develop analytics and performance measurement skills"
    ],
    skills: ["Digital Marketing", "Social Media", "Content Creation", "SEO", "Analytics"],
    instructor: {
      name: "Dina El Hadithi",
      email: "dina.elhadithi@training.com",
      qualifications: "Digital Marketing Specialist, Google Certified, 6 years experience"
    },
    resources: {
      materials: ["Digital marketing guide", "Content templates", "Analytics reports"],
      equipment: ["Computers", "Design software access"],
      software: ["Google Analytics", "Facebook Ads Manager", "Hootsuite"]
    },
    certification: {
      provides: true,
      name: "Digital Marketing Professional Certificate",
      validFor: 12,
      issuingAuthority: "Egyptian Digital Marketing Institute"
    }
  }
];

// Demo Training Schedules
export const demoTrainingSchedules: Omit<CreateTrainingScheduleDTO, 'programId'>[] = [
  {
    instructor: {
      name: "Dr. Ahmed Hassan",
      email: "ahmed.hassan@training.com",
      qualifications: "PhD in Organizational Psychology"
    },
    location: {
      type: "hybrid",
      address: "Training Center, New Cairo",
      room: "Conference Room A",
      meetingLink: "https://zoom.us/j/123456789"
    },
    schedule: {
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-02-15'),
      sessions: [
        {
          sessionNumber: 1,
          date: new Date('2024-01-15'),
          startTime: "09:00",
          endTime: "17:00",
          topic: "Introduction to Leadership",
          objectives: ["Understand leadership principles", "Assess current leadership style"]
        },
        {
          sessionNumber: 2,
          date: new Date('2024-01-22'),
          startTime: "09:00",
          endTime: "17:00",
          topic: "Strategic Thinking",
          objectives: ["Develop strategic mindset", "Learn strategic planning tools"]
        },
        {
          sessionNumber: 3,
          date: new Date('2024-01-29'),
          startTime: "09:00",
          endTime: "17:00",
          topic: "Team Management",
          objectives: ["Build effective teams", "Manage team dynamics"]
        },
        {
          sessionNumber: 4,
          date: new Date('2024-02-05'),
          startTime: "09:00",
          endTime: "17:00",
          topic: "Decision Making",
          objectives: ["Improve decision quality", "Handle complex decisions"]
        },
        {
          sessionNumber: 5,
          date: new Date('2024-02-12'),
          startTime: "09:00",
          endTime: "17:00",
          topic: "Change Management",
          objectives: ["Lead organizational change", "Manage resistance to change"]
        }
      ]
    },
    capacity: {
      maxParticipants: 15,
      minParticipants: 8
    },
    completionCriteria: {
      attendance: 80,
      assignments: ["Leadership assessment", "Strategic plan", "Team management case study"],
      exam: {
        required: true,
        passingScore: 70,
        attempts: 2
      },
      practical: {
        required: true,
        description: "Leadership project presentation"
      }
    }
  },
  {
    instructor: {
      name: "Mariam El Saeed",
      email: "mariam.elsaeed@training.com",
      qualifications: "Customer Service Expert"
    },
    location: {
      type: "in-person",
      address: "Training Center, New Cairo",
      room: "Training Room B"
    },
    schedule: {
      startDate: new Date('2024-01-20'),
      endDate: new Date('2024-01-23'),
      sessions: [
        {
          sessionNumber: 1,
          date: new Date('2024-01-20'),
          startTime: "10:00",
          endTime: "14:00",
          topic: "Customer Service Fundamentals",
          objectives: ["Understand service principles", "Identify customer needs"]
        },
        {
          sessionNumber: 2,
          date: new Date('2024-01-21'),
          startTime: "10:00",
          endTime: "14:00",
          topic: "Communication Excellence",
          objectives: ["Master verbal and non-verbal communication", "Handle difficult conversations"]
        },
        {
          sessionNumber: 3,
          date: new Date('2024-01-22'),
          startTime: "10:00",
          endTime: "14:00",
          topic: "Complaint Handling",
          objectives: ["Turn complaints into opportunities", "De-escalate tense situations"]
        },
        {
          sessionNumber: 4,
          date: new Date('2024-01-23'),
          startTime: "10:00",
          endTime: "14:00",
          topic: "Building Customer Loyalty",
          objectives: ["Create memorable experiences", "Develop retention strategies"]
        }
      ]
    },
    capacity: {
      maxParticipants: 20,
      minParticipants: 10
    },
    completionCriteria: {
      attendance: 100,
      assignments: ["Customer service scenarios", "Communication assessment"],
      exam: {
        required: false,
        passingScore: 0,
        attempts: 0
      },
      practical: {
        required: true,
        description: "Role-play customer interactions"
      }
    }
  }
];

// Demo Certifications
export const demoCertifications: CreateCertificationDTO[] = [
  {
    name: "Certified Leadership Professional",
    description: "Professional certification in leadership and management skills for organizational leaders.",
    issuingAuthority: "Egyptian Management Institute",
    category: "professional",
    level: "professional",
    validityPeriod: 24,
    renewalRequirements: [
      "Complete 40 hours of continuing education",
      "Submit leadership case study",
      "Pass renewal assessment"
    ],
    cost: {
      amount: 3000,
      currency: "EGP"
    },
    prerequisites: [
      "Leadership Development Program completion",
      "Minimum 2 years management experience",
      "Bachelor's degree or equivalent"
    ],
    examDetails: {
      format: "mixed",
      duration: 180,
      passingScore: 75,
      attempts: 3
    },
    trainingPrograms: ["TRN001"] // Leadership Development Program
  },
  {
    name: "Customer Service Excellence Certificate",
    description: "Certificate demonstrating proficiency in customer service and relationship management.",
    issuingAuthority: "Egyptian Customer Service Institute",
    category: "industry",
    level: "associate",
    validityPeriod: 12,
    renewalRequirements: [
      "Complete 20 hours of customer service training",
      "Submit customer satisfaction report",
      "Pass skills assessment"
    ],
    cost: {
      amount: 1200,
      currency: "EGP"
    },
    prerequisites: [
      "Customer Service Excellence training completion",
      "Customer-facing role experience"
    ],
    examDetails: {
      format: "practical",
      duration: 60,
      passingScore: 80,
      attempts: 2
    },
    trainingPrograms: ["TRN002"] // Customer Service Excellence
  },
  {
    name: "Project Management Fundamentals Certificate",
    description: "Foundation-level certification in project management principles and practices.",
    issuingAuthority: "Egyptian Project Management Association",
    category: "professional",
    level: "foundation",
    validityPeriod: 18,
    renewalRequirements: [
      "Complete 30 hours of project management training",
      "Submit project case study",
      "Pass renewal exam"
    ],
    cost: {
      amount: 2000,
      currency: "EGP"
    },
    prerequisites: [
      "Project Management Fundamentals training completion",
      "Basic computer skills"
    ],
    examDetails: {
      format: "multiple-choice",
      duration: 120,
      passingScore: 70,
      attempts: 3
    },
    trainingPrograms: ["TRN003"] // Project Management Fundamentals
  },
  {
    name: "Workplace Safety Certificate",
    description: "Essential safety certification for workplace hazard awareness and emergency response.",
    issuingAuthority: "Egyptian Safety Institute",
    category: "compliance",
    level: "foundation",
    validityPeriod: 12,
    renewalRequirements: [
      "Complete 8 hours of safety refresher training",
      "Pass safety assessment",
      "Demonstrate emergency response skills"
    ],
    cost: {
      amount: 800,
      currency: "EGP"
    },
    prerequisites: [
      "Workplace Safety & Compliance training completion",
      "Employment in the organization"
    ],
    examDetails: {
      format: "mixed",
      duration: 90,
      passingScore: 75,
      attempts: 2
    },
    trainingPrograms: ["TRN004"] // Workplace Safety & Compliance
  },
  {
    name: "Digital Marketing Professional Certificate",
    description: "Professional certification in digital marketing strategies and implementation.",
    issuingAuthority: "Egyptian Digital Marketing Institute",
    category: "professional",
    level: "professional",
    validityPeriod: 12,
    renewalRequirements: [
      "Complete 25 hours of digital marketing training",
      "Submit marketing campaign case study",
      "Pass skills assessment"
    ],
    cost: {
      amount: 2500,
      currency: "EGP"
    },
    prerequisites: [
      "Digital Marketing Essentials training completion",
      "Basic marketing knowledge",
      "Computer literacy"
    ],
    examDetails: {
      format: "mixed",
      duration: 150,
      passingScore: 70,
      attempts: 3
    },
    trainingPrograms: ["TRN005"] // Digital Marketing Essentials
  }
];
