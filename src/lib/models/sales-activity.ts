import { ObjectId } from 'mongodb';

export type ActivityType = 'call' | 'meeting' | 'email' | 'task' | 'note' | 'demo' | 'presentation' | 'follow_up';
export type ActivityStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';
export type ActivityPriority = 'low' | 'medium' | 'high' | 'urgent';
export type CallType = 'inbound' | 'outbound' | 'conference' | 'video_call';
export type MeetingType = 'in_person' | 'video_call' | 'phone' | 'webinar';

export interface SalesActivity {
  _id: ObjectId;
  activityNumber: string;
  type: ActivityType;
  status: ActivityStatus;
  priority: ActivityPriority;
  subject: string;
  description?: string;
  assignedTo: string; // Sales rep ID
  assignedToName: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  leadId?: string;
  leadName?: string;
  dealId?: string;
  dealName?: string;
  quotationId?: string;
  quotationNumber?: string;
  scheduledDate: Date;
  startTime?: Date;
  endTime?: Date;
  duration?: number; // in minutes
  location?: string;
  callType?: CallType;
  meetingType?: MeetingType;
  meetingUrl?: string;
  attendees?: {
    name: string;
    email: string;
    role?: string;
    status: 'invited' | 'accepted' | 'declined' | 'tentative';
  }[];
  outcome?: string;
  nextSteps?: string;
  notes?: string;
  attachments?: {
    filename: string;
    url: string;
    type: string;
    size: number;
  }[];
  tags?: string[];
  customFields?: Record<string, any>;
  completedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByName: string;
}

export interface CreateSalesActivityData {
  type: ActivityType;
  status?: ActivityStatus;
  priority?: ActivityPriority;
  subject: string;
  description?: string;
  assignedTo: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  leadId?: string;
  leadName?: string;
  dealId?: string;
  dealName?: string;
  quotationId?: string;
  quotationNumber?: string;
  scheduledDate: Date;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  location?: string;
  callType?: CallType;
  meetingType?: MeetingType;
  meetingUrl?: string;
  attendees?: {
    name: string;
    email: string;
    role?: string;
    status: 'invited' | 'accepted' | 'declined' | 'tentative';
  }[];
  outcome?: string;
  nextSteps?: string;
  notes?: string;
  attachments?: {
    filename: string;
    url: string;
    type: string;
    size: number;
  }[];
  tags?: string[];
  customFields?: Record<string, any>;
}

export interface UpdateSalesActivityData {
  type?: ActivityType;
  status?: ActivityStatus;
  priority?: ActivityPriority;
  subject?: string;
  description?: string;
  assignedTo?: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  leadId?: string;
  leadName?: string;
  dealId?: string;
  dealName?: string;
  quotationId?: string;
  quotationNumber?: string;
  scheduledDate?: Date;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  location?: string;
  callType?: CallType;
  meetingType?: MeetingType;
  meetingUrl?: string;
  attendees?: {
    name: string;
    email: string;
    role?: string;
    status: 'invited' | 'accepted' | 'declined' | 'tentative';
  }[];
  outcome?: string;
  nextSteps?: string;
  notes?: string;
  attachments?: {
    filename: string;
    url: string;
    type: string;
    size: number;
  }[];
  tags?: string[];
  customFields?: Record<string, any>;
  completedDate?: Date;
}

export interface SalesRepStats {
  repId: string;
  repName: string;
  totalActivities: number;
  completedActivities: number;
  pendingActivities: number;
  totalCalls: number;
  totalMeetings: number;
  totalEmails: number;
  totalTasks: number;
  averageActivityDuration: number;
  conversionRate: number;
  dealsWon: number;
  dealsLost: number;
  totalRevenue: number;
  averageDealSize: number;
  activitiesThisWeek: number;
  activitiesThisMonth: number;
  upcomingActivities: number;
  overdueActivities: number;
}
