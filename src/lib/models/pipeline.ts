import { ObjectId } from 'mongodb';

export type PipelineStage = 'lead' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
export type PipelineType = 'sales' | 'marketing' | 'support' | 'custom';

export interface PipelineStageConfig {
  stage: PipelineStage;
  name: string;
  description?: string;
  order: number;
  color: string;
  isActive: boolean;
  isWonStage: boolean;
  isLostStage: boolean;
  defaultProbability: number;
  requiredFields?: string[];
}

export interface Pipeline {
  _id: ObjectId;
  name: string;
  description?: string;
  type: PipelineType;
  isDefault: boolean;
  isActive: boolean;
  stages: PipelineStageConfig[];
  dealCount: number;
  totalValue: number;
  wonValue: number;
  lostValue: number;
  averageDealSize: number;
  averageSalesCycle: number; // in days
  conversionRate: number; // percentage
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByName: string;
}

export interface CreatePipelineData {
  name: string;
  description?: string;
  type?: PipelineType;
  isDefault?: boolean;
  isActive?: boolean;
  stages: Omit<PipelineStageConfig, 'stage'>[];
}

export interface UpdatePipelineData {
  name?: string;
  description?: string;
  type?: PipelineType;
  isDefault?: boolean;
  isActive?: boolean;
  stages?: PipelineStageConfig[];
}

export interface PipelineStats {
  totalDeals: number;
  totalValue: number;
  wonDeals: number;
  wonValue: number;
  lostDeals: number;
  lostValue: number;
  activeDeals: number;
  activeValue: number;
  averageDealSize: number;
  averageSalesCycle: number;
  conversionRate: number;
  stageBreakdown: {
    stage: PipelineStage;
    name: string;
    dealCount: number;
    totalValue: number;
    averageValue: number;
    probability: number;
  }[];
}
