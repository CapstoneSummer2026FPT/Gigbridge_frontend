/**
 * Contract Models - CONTRACTS, MILESTONES, MILESTONE_ATTACHMENTS tables
 */

export enum ContractStatus {
  Active = 0,
  Completed = 1,
  Disputed = 2,
}

export enum MilestoneStatus {
  Pending = 0,
  Approved = 1,
  Paid = 2,
}

export interface Contract {
  id: string;
  job_post_id: string;
  client_profile_id: string;
  freelancer_profile_id: string;
  proposal_id: string;
  title: string;
  total_budget: number;
  status: ContractStatus;
  start_date: string;
  end_date: string | null;
  created_at: string;
}

export interface Milestone {
  id: string;
  contract_id: string;
  title: string;
  amount: number;
  due_date: string;
  status: MilestoneStatus;
  paid_at: string | null;
}

export interface MilestoneAttachment {
  id: string;
  milestone_id: string;
  file_name: string;
  file_url: string;
}
