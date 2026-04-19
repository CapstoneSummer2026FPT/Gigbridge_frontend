/**
 * Job Models - JOB_POSTS, JOB_POST_SKILLS, JOB_POST_ATTACHMENTS tables
 */

export enum BudgetType {
  Fixed = 0,
  Hourly = 1,
}

export enum JobStatus {
  Draft = 0,
  Open = 1,
  InProgress = 2,
  Closed = 3,
}

export interface JobPost {
  id: string;
  client_profile_id: string;
  title: string;
  description: string;
  category_id: string;
  budget_type: BudgetType;
  budget_min: number;
  budget_max: number;
  currency: string;
  estimated_duration: string;
  status: JobStatus;
  is_ai_generated: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobPostSkill {
  id: string;
  job_post_id: string;
  skill_id: string;
  is_required: boolean;
}

export interface JobPostAttachment {
  id: string;
  job_post_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
}
