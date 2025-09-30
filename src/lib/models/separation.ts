export interface SeparationRequest {
  separationId: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  employeePosition: string;
  employeeDepartment: string;
  managerId: string;
  managerName: string;
  hrManagerId: string;
  hrManagerName: string;
  
  // Separation Details
  separationType: 'resignation' | 'termination' | 'retirement' | 'end_of_contract' | 'redundancy' | 'mutual_agreement';
  separationReason: string;
  resignationReason?: string;
  terminationReason?: string;
  
  // Dates
  lastWorkingDate: Date;
  noticePeriodDays: number;
  noticePeriodStartDate: Date;
  noticePeriodEndDate: Date;
  
  // Workflow Status
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Workflow Steps
  workflowSteps: {
    stepId: string;
    stepName: string;
    assignedTo: string;
    assignedToName: string;
    status: 'pending' | 'in_progress' | 'completed' | 'skipped';
    dueDate: Date;
    completedDate?: Date;
    comments?: string;
    attachments?: Array<{
      name: string;
      url: string;
      type: string;
      size: number;
    }>;
  }[];
  
  // Approvals
  approvals: {
    approverId: string;
    approverName: string;
    approverRole: string;
    status: 'pending' | 'approved' | 'rejected';
    approvedDate?: Date;
    comments?: string;
    priority: number;
  }[];
  
  // Documents
  documents: Array<{
    documentId: string;
    documentName: string;
    documentType: 'resignation_letter' | 'termination_letter' | 'acceptance_letter' | 'final_settlement' | 'experience_certificate' | 'other';
    url: string;
    uploadedBy: string;
    uploadedDate: Date;
    isRequired: boolean;
  }>;
  
  // Final Settlement
  finalSettlement: {
    lastSalaryAmount: number;
    accruedLeaveDays: number;
    accruedLeaveValue: number;
    noticePayDays: number;
    noticePayValue: number;
    bonusAmount: number;
    deductions: Array<{
      name: string;
      amount: number;
      reason: string;
    }>;
    totalSettlement: number;
    paymentMethod: 'bank_transfer' | 'cash' | 'check';
    paymentDate?: Date;
    paymentReference?: string;
  };
  
  // Metadata
  submittedDate: Date;
  approvedDate?: Date;
  completedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface ExitInterview {
  interviewId: string;
  separationId: string;
  employeeId: string;
  employeeName: string;
  interviewerId: string;
  interviewerName: string;
  interviewerRole: string;
  
  // Interview Details
  interviewDate: Date;
  interviewDuration: number; // in minutes
  interviewType: 'face_to_face' | 'video_call' | 'phone' | 'online_form' | 'email';
  interviewLocation?: string;
  
  // Interview Status
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  
  // Interview Questions & Responses
  questions: Array<{
    questionId: string;
    category: 'job_satisfaction' | 'management' | 'work_environment' | 'compensation' | 'career_development' | 'company_culture' | 'suggestions' | 'other';
    question: string;
    response?: string;
    rating?: number; // 1-5 scale
    isRequired: boolean;
  }>;
  
  // Overall Feedback
  overallSatisfaction: number; // 1-5 scale
  wouldRecommend: boolean;
  mainReasonsForLeaving: string[];
  suggestionsForImprovement: string;
  additionalComments: string;
  
  // Follow-up Actions
  followUpActions: Array<{
    actionId: string;
    action: string;
    assignedTo: string;
    assignedToName: string;
    dueDate: Date;
    status: 'pending' | 'in_progress' | 'completed';
    completedDate?: Date;
    notes?: string;
  }>;
  
  // Documents
  attachments: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface ClearanceChecklist {
  checklistId: string;
  separationId: string;
  employeeId: string;
  employeeName: string;
  
  // Checklist Categories
  categories: {
    categoryId: string;
    categoryName: string;
    items: Array<{
      itemId: string;
      itemName: string;
      description: string;
      department: string;
      responsiblePerson: string;
      responsiblePersonName: string;
      status: 'pending' | 'in_progress' | 'completed' | 'not_applicable';
      dueDate: Date;
      completedDate?: Date;
      comments?: string;
      attachments?: Array<{
        name: string;
        url: string;
        type: string;
        size: number;
      }>;
    }>;
  }[];
  
  // Overall Status
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  completionPercentage: number;
  
  // Key Areas
  itAssets: {
    laptop: boolean;
    desktop: boolean;
    mobile: boolean;
    tablet: boolean;
    accessories: boolean;
    software: boolean;
    email: boolean;
    systemAccess: boolean;
    dataTransfer: boolean;
    comments?: string;
  };
  
  finance: {
    salaryAdvance: boolean;
    expenseClaims: boolean;
    loanSettlement: boolean;
    finalSettlement: boolean;
    taxDocuments: boolean;
    benefitsTermination: boolean;
    comments?: string;
  };
  
  hr: {
    idCard: boolean;
    accessCards: boolean;
    uniforms: boolean;
    equipment: boolean;
    leaveBalance: boolean;
    finalDocuments: boolean;
    comments?: string;
  };
  
  operations: {
    clientHandover: boolean;
    projectHandover: boolean;
    knowledgeTransfer: boolean;
    trainingMaterials: boolean;
    contacts: boolean;
    comments?: string;
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface SeparationAnalytics {
  totalSeparations: number;
  separationsByType: {
    resignation: number;
    termination: number;
    retirement: number;
    end_of_contract: number;
    redundancy: number;
    mutual_agreement: number;
  };
  separationsByDepartment: Array<{
    department: string;
    count: number;
    percentage: number;
  }>;
  averageNoticePeriod: number;
  exitInterviewCompletion: number;
  clearanceCompletion: number;
  averageSeparationDuration: number; // in days
  topResignationReasons: Array<{
    reason: string;
    count: number;
    percentage: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    count: number;
    resignation: number;
    termination: number;
  }>;
}

// DTOs for API requests
export interface CreateSeparationRequestDTO {
  employeeId: string;
  separationType: SeparationRequest['separationType'];
  separationReason: string;
  lastWorkingDate: Date;
  noticePeriodDays?: number;
  resignationReason?: string;
  terminationReason?: string;
}

export interface UpdateSeparationRequestDTO {
  separationReason?: string;
  lastWorkingDate?: Date;
  noticePeriodDays?: number;
  status?: SeparationRequest['status'];
  comments?: string;
}

export interface CreateExitInterviewDTO {
  separationId: string;
  interviewerId: string;
  interviewDate: Date;
  interviewType: ExitInterview['interviewType'];
  interviewLocation?: string;
}

export interface SubmitExitInterviewDTO {
  questions: Array<{
    questionId: string;
    response: string;
    rating?: number;
  }>;
  overallSatisfaction: number;
  wouldRecommend: boolean;
  mainReasonsForLeaving: string[];
  suggestionsForImprovement: string;
  additionalComments: string;
}

export interface UpdateClearanceItemDTO {
  itemId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'not_applicable';
  comments?: string;
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
}

export interface ApproveSeparationDTO {
  separationId: string;
  approverId: string;
  status: 'approved' | 'rejected';
  comments?: string;
}
