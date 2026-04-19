export type ProjectStatus = 'active' | 'completed' | 'paused' | 'disputed' | 'cancelled';

export interface Project {
  id: string;
  jobId: string;
  clientId: string;
  freelancerId: string;
  title: string;
  description: string;
  totalBudget: number;
  paidAmount: number;
  status: ProjectStatus;
  startDate: string;
  endDate?: string;
  milestones: ProjectMilestone[];
  conversationId: string;
  progress: number; // 0-100
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'submitted' | 'approved' | 'paid';
  completedAt?: string;
}

export interface AIInterviewSession {
  id: string;
  jobId: string;
  freelancerId: string;
  clientId: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  suitabilityScore?: number;
  questions: AIInterviewQuestion[];
  transcription?: string;
  scheduledAt: string;
  completedAt?: string;
  aiSummary?: string;
}

export interface AIInterviewQuestion {
  id: string;
  question: string;
  answer?: string;
  score?: number;
  category: 'technical' | 'behavioral' | 'situational' | 'communication';
}
