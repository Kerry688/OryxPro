import { ObjectId } from 'mongodb';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled' | 'on_hold';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskType = 'task' | 'bug' | 'feature' | 'improvement' | 'research' | 'documentation';
export type TaskCategory = 'development' | 'design' | 'marketing' | 'sales' | 'support' | 'hr' | 'finance' | 'general';

export interface TaskAssignee {
  userId: string;
  userName: string;
  userEmail: string;
  assignedAt: Date;
}

export interface TaskComment {
  _id: ObjectId;
  content: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  createdAt: Date;
  updatedAt: Date;
  isEdited?: boolean;
}

export interface TaskAttachment {
  _id: ObjectId;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: Date;
}

export interface TaskChecklist {
  _id: ObjectId;
  title: string;
  completed: boolean;
  completedAt?: Date;
  completedBy?: string;
  createdAt: Date;
}

export interface TaskDependency {
  taskId: string;
  taskTitle: string;
  dependencyType: 'blocks' | 'blocked_by' | 'related_to';
}

export interface Task {
  _id: ObjectId;
  taskNumber: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  category: TaskCategory;
  
  // Assignment
  assignees: TaskAssignee[];
  assignedBy?: string;
  assignedByName?: string;
  
  // Project/Module context
  projectId?: string;
  projectName?: string;
  moduleId?: string;
  moduleName?: string;
  
  // CRM Integration
  customerId?: string;
  customerName?: string;
  leadId?: string;
  leadName?: string;
  dealId?: string;
  dealName?: string;
  
  // Dates
  dueDate?: Date;
  startDate?: Date;
  completedDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  
  // Progress tracking
  progress: number; // 0-100
  checklist: TaskChecklist[];
  dependencies: TaskDependency[];
  
  // Communication
  comments: TaskComment[];
  attachments: TaskAttachment[];
  
  // Metadata
  tags: string[];
  customFields?: Record<string, any>;
  watchers: string[]; // User IDs who are watching this task
  
  // Audit trail
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByName: string;
  lastModifiedBy?: string;
  lastModifiedByName?: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  type?: TaskType;
  category?: TaskCategory;
  
  // Assignment
  assignees?: TaskAssignee[];
  assignedBy?: string;
  
  // Project/Module context
  projectId?: string;
  projectName?: string;
  moduleId?: string;
  moduleName?: string;
  
  // CRM Integration
  customerId?: string;
  customerName?: string;
  leadId?: string;
  leadName?: string;
  dealId?: string;
  dealName?: string;
  
  // Dates
  dueDate?: Date;
  startDate?: Date;
  estimatedHours?: number;
  
  // Progress tracking
  progress?: number;
  checklist?: Omit<TaskChecklist, '_id'>[];
  dependencies?: TaskDependency[];
  
  // Communication
  comments?: Omit<TaskComment, '_id'>[];
  attachments?: Omit<TaskAttachment, '_id'>[];
  
  // Metadata
  tags?: string[];
  customFields?: Record<string, any>;
  watchers?: string[];
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  type?: TaskType;
  category?: TaskCategory;
  
  // Assignment
  assignees?: TaskAssignee[];
  assignedBy?: string;
  
  // Project/Module context
  projectId?: string;
  projectName?: string;
  moduleId?: string;
  moduleName?: string;
  
  // CRM Integration
  customerId?: string;
  customerName?: string;
  leadId?: string;
  leadName?: string;
  dealId?: string;
  dealName?: string;
  
  // Dates
  dueDate?: Date;
  startDate?: Date;
  completedDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  
  // Progress tracking
  progress?: number;
  checklist?: TaskChecklist[];
  dependencies?: TaskDependency[];
  
  // Communication
  comments?: TaskComment[];
  attachments?: TaskAttachment[];
  
  // Metadata
  tags?: string[];
  customFields?: Record<string, any>;
  watchers?: string[];
  
  // Audit trail
  lastModifiedBy?: string;
  lastModifiedByName?: string;
}

export interface TaskFilter {
  status?: TaskStatus | 'all';
  priority?: TaskPriority | 'all';
  type?: TaskType | 'all';
  category?: TaskCategory | 'all';
  assignee?: string | 'all';
  projectId?: string | 'all';
  dueDate?: 'overdue' | 'today' | 'this_week' | 'this_month' | 'all';
  createdBy?: string | 'all';
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
  dueToday: number;
  dueThisWeek: number;
  totalEstimatedHours: number;
  totalActualHours: number;
  averageCompletionTime: number;
  completionRate: number;
}
